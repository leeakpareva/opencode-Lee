import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RAVEN Terminal',
  description: 'Web-based terminal interface for OpenCode RAVEN',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}