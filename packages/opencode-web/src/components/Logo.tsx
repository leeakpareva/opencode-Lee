'use client'

import { useEffect, useState } from 'react'

export default function Logo() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <div
      className={`transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <pre className="text-terminal-primary font-bold text-xs sm:text-sm md:text-base lg:text-lg select-none raven-text-shadow">
{`██████   █████  ██    ██ ███████ ███    ██
██   ██ ██   ██ ██    ██ ██      ████   ██
██████  ███████ ██    ██ █████   ██ ██  ██
██   ██ ██   ██  ██  ██  ██      ██  ██ ██
██   ██ ██   ██   ████   ███████ ██   ████`}
      </pre>
    </div>
  )
}