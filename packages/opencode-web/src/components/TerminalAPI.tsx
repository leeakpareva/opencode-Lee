'use client'

import { useEffect, useRef, useState } from 'react'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { WebglAddon } from '@xterm/addon-webgl'
import '@xterm/xterm/css/xterm.css'

interface TerminalAPIProps {
  authenticated: boolean
}

export default function TerminalAPI({ authenticated }: TerminalAPIProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const [commandHistory, setCommandHistory] = useState<Array<{ role: string; content: string }>>([])
  const [currentCommand, setCurrentCommand] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!terminalRef.current) return

    // Initialize xterm.js
    const xterm = new XTerm({
      theme: {
        background: '#0a0a0a',
        foreground: '#eeeeee',
        cursor: '#fab283',
        cursorAccent: '#fab283',
        selectionBackground: '#fab28333',
        black: '#0a0a0a',
        red: '#ff5555',
        green: '#50fa7b',
        yellow: '#f1fa8c',
        blue: '#bd93f9',
        magenta: '#ff79c6',
        cyan: '#8be9fd',
        white: '#bfbfbf',
        brightBlack: '#4d4d4d',
        brightRed: '#ff6e67',
        brightGreen: '#5af78e',
        brightYellow: '#f4f99d',
        brightBlue: '#caa9fa',
        brightMagenta: '#ff92d0',
        brightCyan: '#9aedfe',
        brightWhite: '#e6e6e6',
      },
      fontFamily: 'Cascadia Code, Fira Code, Consolas, Monaco, monospace',
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 10000,
      allowTransparency: true,
      windowsMode: navigator.platform.includes('Win'),
    })

    xtermRef.current = xterm

    // Add addons
    const fitAddon = new FitAddon()
    fitAddonRef.current = fitAddon
    xterm.loadAddon(fitAddon)

    const webLinksAddon = new WebLinksAddon()
    xterm.loadAddon(webLinksAddon)

    // Try to use WebGL for better performance
    try {
      const webglAddon = new WebglAddon()
      xterm.loadAddon(webglAddon)
    } catch (e) {
      console.warn('WebGL addon failed to load:', e)
    }

    // Open terminal
    xterm.open(terminalRef.current)

    // Delay fit to ensure terminal is properly initialized
    setTimeout(() => {
      if (fitAddon) {
        try {
          fitAddon.fit()
        } catch (e) {
          console.warn('Failed to fit terminal:', e)
        }
      }
    }, 100)

    // Display welcome message
    xterm.writeln('')
    xterm.writeln('  \x1b[1;35mRAVEN AI Terminal\x1b[0m')
    xterm.writeln('  Type "help" for available commands')
    xterm.writeln('')
    xterm.write('$ ')

    let localCommand = ''

    // Handle terminal input
    xterm.onData(async (data: string) => {
      if (processing) return

      // Handle special characters
      if (data === '\x7f' || data === '\b') {
        // Backspace
        if (localCommand.length > 0) {
          localCommand = localCommand.slice(0, -1)
          xterm.write('\b \b')
        }
        return
      }

      if (data === '\r' || data === '\n') {
        // Enter key
        const command = localCommand.trim()
        localCommand = ''

        if (command === '') {
          xterm.write('\r\n$ ')
          return
        }

        xterm.write('\r\n')
        setProcessing(true)

        try {
          // Send command to API
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: command,
              history: commandHistory.slice(-10),
            }),
          })

          const data = await response.json()

          if (data.type === 'clear') {
            xterm.clear()
            xterm.write('$ ')
          } else if (data.error) {
            xterm.writeln(`\x1b[1;31mError: ${data.error}\x1b[0m`)
            xterm.write('$ ')
          } else {
            // Display response
            if (data.type === 'ai') {
              xterm.writeln('\x1b[1;32mRAVEN:\x1b[0m')
            }

            const lines = data.response.split('\n')
            for (const line of lines) {
              xterm.writeln(line)
            }

            xterm.write('\r\n$ ')

            // Update history
            setCommandHistory(prev => [
              ...prev,
              { role: 'user', content: command },
              { role: 'assistant', content: data.response }
            ])
          }
        } catch (error) {
          xterm.writeln('\x1b[1;31mError: Failed to connect to server\x1b[0m')
          xterm.write('$ ')
        }

        setProcessing(false)
        return
      }

      // Normal character
      if (data.charCodeAt(0) >= 32) {
        localCommand += data
        xterm.write(data)
      }
    })

    // Handle resize
    const handleResize = () => {
      if (fitAddonRef.current) {
        try {
          fitAddonRef.current.fit()
        } catch (e) {
          console.warn('Failed to fit on resize:', e)
        }
      }
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (xtermRef.current) {
        xtermRef.current.dispose()
      }
    }
  }, [commandHistory, processing])

  return (
    <div className="h-full p-4">
      <div
        ref={terminalRef}
        className="h-full w-full bg-terminal-bg rounded-lg terminal-glow p-2"
        style={{
          border: '1px solid #333',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
        }}
      />
    </div>
  )
}