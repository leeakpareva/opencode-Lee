'use client'

import { useState, useEffect } from 'react'

interface AuthDialogProps {
  onAuthenticate: (token: string) => void
}

export default function AuthDialog({ onAuthenticate }: AuthDialogProps) {
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKey.trim()) {
      setError('API key is required')
      return
    }

    setLoading(true)
    setError('')

    // Simulate authentication
    // In production, this would validate against your backend
    setTimeout(() => {
      if (apiKey.length > 10) {
        onAuthenticate(apiKey)
      } else {
        setError('Invalid API key')
        setLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className={`bg-terminal-bg border border-terminal-border rounded-lg p-6 max-w-md w-full mx-4 transition-all duration-300 transform ${
          visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{
          boxShadow: '0 0 30px rgba(250, 178, 131, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)'
        }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-terminal-primary mb-2">RAVEN Authentication</h2>
          <p className="text-terminal-muted text-sm">Enter your OpenCode API key to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="apiKey" className="block text-terminal-fg text-sm mb-2">
              API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-terminal-border rounded text-terminal-fg focus:outline-none focus:border-terminal-primary transition-colors"
              placeholder="Enter your API key..."
              disabled={loading}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-red-500 text-sm">{error}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-terminal-primary text-terminal-bg font-semibold rounded hover:bg-terminal-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Connect'}
            </button>
            <button
              type="button"
              onClick={() => window.open('https://opencode.ai/keys', '_blank')}
              className="px-4 py-2 bg-terminal-border text-terminal-fg font-semibold rounded hover:bg-terminal-border/80 transition-colors"
            >
              Get API Key
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-terminal-border">
            <p className="text-terminal-muted text-xs">
              For demo purposes, any key longer than 10 characters will work.
              In production, this would validate against the OpenCode API.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}