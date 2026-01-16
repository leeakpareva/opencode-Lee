'use client'

import React, { useEffect, useState } from 'react'
import TerminalWrapper from '@/components/TerminalWrapper'
import StatusBar from '@/components/StatusBar'
import { useKeyBindings } from '@/hooks/useKeyBindings'

export default function Home() {
  const [showHelp, setShowHelp] = useState(false)
  const [connected, setConnected] = useState(true)

  // Setup key bindings
  useKeyBindings([
    { key: 'h', ctrl: true, action: () => setShowHelp(!showHelp) },
    { key: 'l', ctrl: true, action: () => console.clear() },
  ])

  return (
    <div className="h-screen w-screen bg-terminal-bg overflow-hidden flex flex-col">
      <div className="flex-shrink-0 p-4">
        <div className="transition-opacity duration-1000 opacity-100">
          <pre className="text-terminal-primary font-bold text-xs sm:text-sm md:text-base lg:text-lg select-none raven-text-shadow">
{`██████   █████  ██    ██ ███████ ███    ██
██   ██ ██   ██ ██    ██ ██      ████   ██
██████  ███████ ██    ██ █████   ██ ██  ██
██   ██ ██   ██  ██  ██  ██      ██  ██ ██
██   ██ ██   ██   ████   ███████ ██   ████`}
          </pre>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <TerminalWrapper authenticated={true} />
      </div>

      <StatusBar connected={connected} />
    </div>
  )
}