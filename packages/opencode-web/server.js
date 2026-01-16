const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')
const OpenAI = require('openai')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3001

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Store session data
const sessions = new Map()

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Initialize Socket.IO
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // Initialize session for this socket
    sessions.set(socket.id, {
      history: [],
      context: 'You are RAVEN, an AI assistant in a terminal interface. Respond concisely and helpfully. Format your responses for terminal display.'
    })

    socket.emit('output', '\x1b[1;35mRAVEN AI Terminal Connected\x1b[0m\r\n')
    socket.emit('output', 'Type your commands or questions. Type "help" for available commands.\r\n\r\n$ ')

    socket.on('input', async (data) => {
      const session = sessions.get(socket.id)

      // Echo the input
      socket.emit('output', data)

      // Handle special characters
      if (data === '\r' || data === '\n') {
        return
      }

      // Build command from buffer
      if (!session.currentCommand) {
        session.currentCommand = ''
      }

      // Handle backspace
      if (data === '\x7f' || data === '\b') {
        if (session.currentCommand.length > 0) {
          session.currentCommand = session.currentCommand.slice(0, -1)
        }
        return
      }

      // Handle enter key
      if (data === '\r') {
        const command = session.currentCommand.trim()
        session.currentCommand = ''

        if (command === '') {
          socket.emit('output', '\r\n$ ')
          return
        }

        socket.emit('output', '\r\n')

        // Process command
        await processCommand(socket, command, session)

        socket.emit('output', '\r\n$ ')
        return
      }

      // Add character to command buffer
      session.currentCommand += data
    })

    socket.on('resize', ({ cols, rows }) => {
      console.log(`Terminal resized to ${cols}x${rows}`)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
      sessions.delete(socket.id)
    })
  })

  async function processCommand(socket, command, session) {
    // Handle built-in commands
    if (command === 'help') {
      socket.emit('output', '\x1b[1;36mAvailable Commands:\x1b[0m\r\n')
      socket.emit('output', '  help     - Show this help message\r\n')
      socket.emit('output', '  clear    - Clear the terminal\r\n')
      socket.emit('output', '  about    - About RAVEN\r\n')
      socket.emit('output', '  exit     - Disconnect from terminal\r\n')
      socket.emit('output', '\r\nOr type any question to chat with RAVEN AI\r\n')
      return
    }

    if (command === 'clear') {
      socket.emit('output', '\x1b[2J\x1b[H')
      return
    }

    if (command === 'about') {
      socket.emit('output', '\x1b[1;35mRAVEN - AI Terminal Assistant\x1b[0m\r\n')
      socket.emit('output', 'Version: 1.0.0\r\n')
      socket.emit('output', 'Powered by OpenAI GPT-3.5\r\n')
      return
    }

    if (command === 'exit') {
      socket.emit('output', '\x1b[1;33mGoodbye!\x1b[0m\r\n')
      socket.disconnect()
      return
    }

    // Send to OpenAI
    try {
      socket.emit('output', '\x1b[1;33mProcessing...\x1b[0m\r\n')

      session.history.push({ role: 'user', content: command })

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: session.context },
          ...session.history.slice(-10) // Keep last 10 messages for context
        ],
        max_tokens: 500,
        temperature: 0.7,
      })

      const response = completion.choices[0].message.content
      session.history.push({ role: 'assistant', content: response })

      // Format and send response
      socket.emit('output', '\x1b[1;32mRAVEN:\x1b[0m ')

      // Split response into lines for better terminal display
      const lines = response.split('\n')
      for (const line of lines) {
        socket.emit('output', line + '\r\n')
      }

    } catch (error) {
      console.error('OpenAI error:', error)
      socket.emit('output', '\x1b[1;31mError: Failed to process request\x1b[0m\r\n')
      if (error.message) {
        socket.emit('output', `Details: ${error.message}\r\n`)
      }
    }
  }

  server.once('error', (err) => {
    console.error(err)
    process.exit(1)
  })

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})