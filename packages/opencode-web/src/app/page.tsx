'use client'

import { useEffect, useState } from 'react'
import TerminalWrapper from '@/components/TerminalWrapper'
import Logo from '@/components/Logo'
import AuthDialog from '@/components/AuthDialog'
import StatusBar from '@/components/StatusBar'
import { useKeyBindings } from '@/hooks/useKeyBindings'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuth, setShowAuth] = useState(true)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('opencode_token')
    if (token) {
      setIsAuthenticated(true)
      setShowAuth(false)
    }
  }, [])

  const handleAuthenticate = (token: string) => {
    localStorage.setItem('opencode_token', token)
    setIsAuthenticated(true)
    setShowAuth(false)
  }

  // Setup key bindings
  useKeyBindings([
    { key: 'h', ctrl: true, action: () => setShowHelp(!showHelp) },
    { key: 'l', ctrl: true, action: () => console.clear() },
  ])

  return (
    <div className="h-screen w-screen bg-terminal-bg overflow-hidden flex flex-col">
      {showAuth && !isAuthenticated && (
        <AuthDialog onAuthenticate={handleAuthenticate} />
      )}

      <div className="flex-shrink-0 p-4">
        <Logo />
      </div>

      <div className="flex-1 overflow-hidden">
        <TerminalWrapper authenticated={isAuthenticated} />
      </div>

      <StatusBar connected={isAuthenticated} />
    </div>
  )
}