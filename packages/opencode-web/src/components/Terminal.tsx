'use client'

import { useEffect, useRef, useState } from 'react'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { WebglAddon } from '@xterm/addon-webgl'
import '@xterm/xterm/css/xterm.css'
import { io, Socket } from 'socket.io-client'

interface TerminalProps {
  authenticated: boolean
}

export default function Terminal({ authenticated }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const [connected, setConnected] = useState(false)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentCommand, setCurrentCommand] = useState('')

  useEffect(() => {
    if (!terminalRef.current || !authenticated) return

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
    fitAddon.fit()

    // Display welcome message
    xterm.writeln('')
    xterm.writeln('  \x1b[1;35mWelcome to RAVEN Terminal\x1b[0m')
    xterm.writeln('  \x1b[90mConnecting to server...\x1b[0m')
    xterm.writeln('')

    // Connect to WebSocket server - same origin in production
    const wsUrl = typeof window !== 'undefined'
      ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`
      : 'ws://localhost:3001'

    const socket = io(wsUrl, {
      auth: {
        token: localStorage.getItem('opencode_token'),
      },
      transports: ['websocket', 'polling'],
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)
      // Server will send the initial prompt
    })

    socket.on('disconnect', () => {
      setConnected(false)
      xterm.writeln('\r\n  \x1b[1;31m✗ Disconnected\x1b[0m')
    })

    socket.on('output', (data: string) => {
      xterm.write(data)
    })

    socket.on('error', (error: string) => {
      xterm.writeln(`\r\n\x1b[1;31mError: ${error}\x1b[0m`)
    })

    // Handle terminal input
    xterm.onData((data: string) => {
      if (connected && socket.connected) {
        socket.emit('input', data)
      }
    })

    // Handle resize
    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit()
        if (socket.connected) {
          socket.emit('resize', {
            cols: xterm.cols,
            rows: xterm.rows,
          })
        }
      }
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
      if (xtermRef.current) {
        xtermRef.current.dispose()
      }
    }
  }, [authenticated])

  if (!authenticated) {
    return (
      <div className="h-full flex items-center justify-center text-terminal-muted">
        <p>Please authenticate to access the terminal</p>
      </div>
    )
  }

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