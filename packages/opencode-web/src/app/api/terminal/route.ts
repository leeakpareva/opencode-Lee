import { NextRequest, NextResponse } from 'next/server'

// This is a placeholder API route for terminal operations
// In production, this would connect to the actual OpenCode backend

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ready',
    message: 'Terminal API is ready',
    version: '1.0.0'
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { command, sessionId } = body

    // In production, this would execute commands through the OpenCode backend
    // For now, return a mock response
    return NextResponse.json({
      success: true,
      output: `Executing: ${command}`,
      sessionId: sessionId || 'demo-session'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}