# 🖥️ RAVEN Web Terminal

A modern web-based terminal interface that replicates the OpenCode RAVEN native terminal experience in the browser, powered by OpenAI GPT-3.5.

![RAVEN Terminal](https://img.shields.io/badge/RAVEN-Terminal-orange?style=for-the-badge&logo=terminal&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Ready-black?style=for-the-badge&logo=vercel&logoColor=white)

## ✨ Features

- 🎨 **Authentic Terminal Experience**: Full xterm.js integration with custom RAVEN color scheme
- 🤖 **AI-Powered**: Chat with RAVEN AI powered by OpenAI GPT-3.5
- 🔐 **Secure Authentication**: API key-based authentication system
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Real-time Interaction**: Instant responses with API integration
- 🎯 **Command System**: Built-in commands (help, clear, about)
- 🌈 **Beautiful UI**: Dark theme with signature orange accent (#fab283)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- OpenAI API key

### Installation

1. **Clone and navigate to the web terminal:**
```bash
cd packages/opencode-web
```

2. **Install dependencies:**
```bash
# Using npm
npm install

# Using bun (recommended)
bun install
```

3. **Set up environment variables:**

Create a `.env.local` file:
```env
# Required: Your OpenAI API key
OPENAI_API_KEY=your-openai-api-key-here

# Optional: Custom ports
PORT=3001
```

4. **Run the development server:**
```bash
# Using npm
npm run dev

# Using bun
bun run dev
```

5. **Open your browser:**
Navigate to [http://localhost:3001](http://localhost:3001)

## 📦 Project Structure

```
opencode-web/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/          # AI chat API endpoint
│   │   │   └── terminal/      # Terminal operations
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main page
│   ├── components/
│   │   ├── AuthDialog.tsx     # Authentication modal
│   │   ├── Logo.tsx           # RAVEN ASCII art logo
│   │   ├── StatusBar.tsx      # Bottom status bar
│   │   ├── Terminal.tsx       # WebSocket terminal
│   │   ├── TerminalAPI.tsx    # API-based terminal
│   │   └── TerminalWrapper.tsx # Terminal loader
│   └── hooks/
│       └── useKeyBindings.ts  # Keyboard shortcuts
├── public/                    # Static assets
├── server.js                  # Custom server with WebSocket
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # Next.js configuration
├── vercel.json               # Vercel deployment config
└── package.json              # Dependencies

```

## 🛠️ Available Scripts

```bash
# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Run Next.js dev server (without custom server)
npm run dev:next
```

## 🎮 Using the Terminal

### Authentication
1. Enter any API key longer than 10 characters (demo mode)
2. Or click "Get API Key" to get a real OpenAI key

### Available Commands

| Command | Description |
|---------|------------|
| `help` | Display available commands |
| `clear` | Clear the terminal screen |
| `about` | Show RAVEN information |
| `exit` | Disconnect from terminal |
| Any text | Chat with RAVEN AI |

### Keyboard Shortcuts

- `Ctrl+H` - Toggle help
- `Ctrl+L` - Clear console
- `Ctrl+C` - Copy selected text

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Set up environment variables:**
```bash
# Add your OpenAI API key as a secret
vercel env add OPENAI_API_KEY
```

3. **Deploy:**
```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel
```

### Manual Deployment

1. **Build the application:**
```bash
npm run build
```

2. **Set environment variables:**
```bash
export OPENAI_API_KEY=your-key-here
export NODE_ENV=production
```

3. **Start the server:**
```bash
npm run start
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key | - |
| `PORT` | No | Server port | 3001 |
| `NEXT_PUBLIC_VERCEL` | No | Set to "1" for Vercel deployment | - |
| `NODE_ENV` | No | Environment (development/production) | development |

### Customization

#### Theme Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  terminal: {
    bg: '#0a0a0a',       // Background
    fg: '#eeeeee',       // Foreground text
    primary: '#fab283',  // RAVEN orange
    muted: '#808080',    // Muted text
    border: '#333333',   // Border color
  }
}
```

#### Terminal Settings
Edit `src/components/TerminalAPI.tsx`:
```javascript
const xterm = new XTerm({
  fontSize: 14,           // Font size
  fontFamily: 'Cascadia Code, Fira Code, Consolas',
  cursorStyle: 'block',   // Cursor style
  cursorBlink: true,      // Blinking cursor
  scrollback: 10000,      // History lines
})
```

## 🌐 API Endpoints

### POST `/api/chat`
Chat with RAVEN AI

**Request:**
```json
{
  "message": "Hello RAVEN",
  "history": []
}
```

**Response:**
```json
{
  "response": "Hello! I'm RAVEN, your AI terminal assistant...",
  "type": "ai"
}
```

### GET `/api/terminal`
Check terminal API status

**Response:**
```json
{
  "status": "ready",
  "version": "1.0.0"
}
```

## 🐛 Troubleshooting

### Common Issues

**1. "Module not found" error:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

**2. OpenAI API errors:**
- Check your API key is valid
- Ensure you have credits in your OpenAI account
- Verify the key is properly set in `.env.local`

**3. Port already in use:**
```bash
# Use a different port
PORT=3002 npm run dev
```

**4. WebSocket connection issues:**
- Check if you're running the custom server (`npm run dev`)
- Ensure no firewall is blocking WebSocket connections

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this in your projects!

## 🔗 Links

- [OpenCode](https://opencode.ai)
- [OpenAI API](https://platform.openai.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [xterm.js](https://xtermjs.org)
- [Vercel](https://vercel.com)

## 💡 Tips

- **For production**: Always use environment variables for sensitive data
- **Performance**: Enable WebGL addon for better terminal performance
- **Security**: Implement rate limiting for API endpoints in production
- **Scaling**: Consider using Redis for session management at scale

---

Built with ❤️ using Next.js, TypeScript, and OpenAI