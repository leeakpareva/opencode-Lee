import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Always run in demo mode for free access
const DEMO_MODE = true

// Demo responses for common queries - enhanced for better interaction
const demoResponses: Record<string, string> = {
  'hello': 'Hello! I\'m RAVEN, your AI terminal assistant. How can I help you today?',
  'hi': 'Hi there! Welcome to RAVEN terminal. Type "help" to see available commands or ask me anything!',
  'what can you do': 'I can help you with:\n- Terminal commands and navigation\n- Coding questions and debugging\n- System information and monitoring\n- File operations and management\n- General assistance\n\nType "help" for available commands.',
  'who are you': 'I am RAVEN (Responsive AI Virtual Environment Navigator), a terminal-based assistant designed to help you navigate and interact with your system efficiently.',
  'ls': 'Desktop/\nDocuments/\nDownloads/\nPictures/\nVideos/\nMusic/\nProjects/',
  'pwd': '/home/user',
  'date': new Date().toLocaleString(),
  'whoami': 'user',
  'echo': 'Echo: Your message has been received',
  'time': new Date().toLocaleTimeString(),
  'cd': 'Changed directory',
  'mkdir': 'Directory created successfully',
  'touch': 'File created successfully',
  'rm': 'File removed successfully',
  'cat': 'File contents would be displayed here',
  'nano': 'Opening text editor... (demo mode)',
  'vim': 'Opening VIM editor... (demo mode)',
  'git': 'Git version 2.34.0 (demo mode)',
  'node': 'Node.js v18.0.0 (demo mode)',
  'npm': 'npm v9.0.0 (demo mode)',
  'python': 'Python 3.10.0 (demo mode)',
  'default': 'Command executed successfully. Try these commands:\n- help: Show all commands\n- ls: List files\n- pwd: Show current directory\n- date: Show current date/time\n- clear: Clear screen'
}

function getDemoResponse(message: string): string {
  const lowerMessage = message.toLowerCase().trim()

  // Check for exact or partial matches
  for (const [key, response] of Object.entries(demoResponses)) {
    if (lowerMessage.includes(key)) {
      return response
    }
  }

  return demoResponses.default
}

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Process built-in commands
    if (message === 'help') {
      return NextResponse.json({
        response: 'Available Commands:\n  help - Show this help message\n  clear - Clear the terminal\n  about - About RAVEN\n\nOr type any question to chat with RAVEN AI',
        type: 'command'
      })
    }

    if (message === 'clear') {
      return NextResponse.json({
        response: '',
        type: 'clear'
      })
    }

    if (message === 'about') {
      return NextResponse.json({
        response: 'RAVEN - AI Terminal Assistant\nVersion: 1.0.0\nMode: Free Web Terminal\n\nA fully functional web-based terminal interface.',
        type: 'command'
      })
    }

    // If in demo mode, return demo responses
    if (DEMO_MODE) {
      const response = getDemoResponse(message)
      return NextResponse.json({
        response,
        type: 'ai'
      })
    }

    // Send to OpenAI (only if valid API key)
    const completion = await openai!.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are RAVEN, an AI assistant in a terminal interface. Respond concisely and helpfully. Format your responses for terminal display.'
        },
        ...history.slice(-10),
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const response = completion.choices[0].message.content

    return NextResponse.json({
      response,
      type: 'ai'
    })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    )
  }
}