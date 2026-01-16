import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Process built-in commands
    if (message === 'help') {
      return NextResponse.json({
        response: 'Available Commands:\n  help - Show this help message\n  clear - Clear the terminal\n  about - About RAVEN\n\nOr type any question to chat with RAVEN AI',
        type: 'command'
      })
    }

    if (message === 'clear') {
      return NextResponse.json({
        response: '',
        type: 'clear'
      })
    }

    if (message === 'about') {
      return NextResponse.json({
        response: 'RAVEN - AI Terminal Assistant\nVersion: 1.0.0\nPowered by OpenAI GPT-3.5',
        type: 'command'
      })
    }

    // Send to OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are RAVEN, an AI assistant in a terminal interface. Respond concisely and helpfully. Format your responses for terminal display.'
        },
        ...history.slice(-10),
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const response = completion.choices[0].message.content

    return NextResponse.json({
      response,
      type: 'ai'
    })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    )
  }
}