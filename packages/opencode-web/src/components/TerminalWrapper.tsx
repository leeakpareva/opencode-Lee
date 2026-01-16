'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Always use API-based terminal for simplicity
const Terminal = dynamic(
  () => import('./TerminalAPI'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center text-terminal-muted">
        <p>Loading terminal...</p>
      </div>
    )
  }
)

interface TerminalWrapperProps {
  authenticated: boolean
}

export default function TerminalWrapper({ authenticated }: TerminalWrapperProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Terminal authenticated={authenticated} />
    </Suspense>
  )
}