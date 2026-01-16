'use client'

import { useEffect, useState } from 'react'
import TerminalWrapper from '@/components/TerminalWrapper'
import Logo from '@/components/Logo'
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
        <Logo />
      </div>

      <div className="flex-1 overflow-hidden">
        <TerminalWrapper authenticated={true} />
      </div>

      <StatusBar connected={connected} />
    </div>
  )
}