'use client'

import React, { useState, useEffect } from 'react'

interface StatusBarProps {
  connected: boolean
  model?: string
  session?: string
}

export default function StatusBar({ connected, model = 'claude-3.5-sonnet', session = 'default' }: StatusBarProps) {
  const [time, setTime] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTime(new Date())
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center justify-between px-4 py-1 bg-black/50 border-t border-terminal-border text-xs text-terminal-muted">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>{connected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Model:</span>
          <span className="text-terminal-primary">{model}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Session:</span>
          <span className="text-terminal-fg">{session}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span>{mounted && time ? time.toLocaleTimeString() : '--:--:--'}</span>
      </div>
    </div>
  )
}