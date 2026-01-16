<p align="center">
  <h1>🐦‍⬛ RAVEN</h1>
</p>
<p align="center">Enhanced AI coding agent - A powerful fork of OpenCode.</p>
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/opencode-ai"><img alt="npm" src="https://img.shields.io/npm/v/opencode-ai?style=flat-square" /></a>
  <a href="https://github.com/anomalyco/opencode/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/anomalyco/opencode/publish.yml?style=flat-square&branch=dev" /></a>
</p>

[![OpenCode Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://opencode.ai)

---

### Installation

**RAVEN** is a forked and enhanced version of OpenCode with additional features and improvements.

#### Quick Setup

```bash
# Clone the repository
git clone https://github.com/leeak/opencode-Lee.git
cd opencode-Lee

# Install dependencies
bun install

# Start RAVEN
bun run dev
```

#### Alternative: Direct CLI Usage

```bash
# After cloning and installing dependencies
# Navigate to the opencode package
cd packages/opencode

# Run RAVEN directly
bun run dev
```

#### Global Installation (Coming Soon)

```bash
# Will be available once published
npm install -g raven-ai
```

> [!TIP]
> Remove versions older than 0.1.x before installing.

### RAVEN vs OpenCode

RAVEN includes all OpenCode features plus:

- **Enhanced CLI Experience**: Improved command-line interface with better error handling
- **Custom Branding**: Personalized experience with RAVEN branding
- **Additional Features**: Extended functionality beyond the original OpenCode
- **Performance Optimizations**: Various improvements for better performance

> **Note**: RAVEN is based on OpenCode but is an independent fork. It is not affiliated with the official OpenCode team.

### Usage

Once installed, you can start RAVEN using:

```bash
# From the project root
bun run dev

# Or from the packages/opencode directory
cd packages/opencode && bun run dev
```

RAVEN will start with the same powerful AI coding capabilities as OpenCode, but with enhanced features and customizations.

### Agents

RAVEN includes the same powerful agent system as OpenCode with two built-in agents you can switch between with the `Tab` key:

- **build** - Default, full access agent for development work
- **plan** - Read-only agent for analysis and code exploration
  - Denies file edits by default
  - Asks permission before running bash commands
  - Ideal for exploring unfamiliar codebases or planning changes

Also included is a **general** subagent for complex searches and multistep tasks.
This is used internally and can be invoked using `@general` in messages.

### Documentation

RAVEN uses the same configuration system as OpenCode. For configuration details, refer to the [OpenCode documentation](https://opencode.ai/docs).

### Contributing

If you're interested in contributing to RAVEN, please:

1. Fork this repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Building on RAVEN

RAVEN is a fork of OpenCode and includes all original OpenCode functionality with additional enhancements. This project is not affiliated with the official OpenCode team.

### FAQ

#### How is RAVEN different from OpenCode?

RAVEN is a fork of OpenCode that includes:

- All OpenCode features and capabilities
- Enhanced user experience with custom branding
- Additional performance optimizations
- Extended functionality beyond the original OpenCode
- Improved error handling and CLI experience

#### How is RAVEN different from Claude Code?

Like OpenCode, RAVEN is very similar to Claude Code in terms of capability. Key differences:

- 100% open source
- Not coupled to any provider. Can be used with Claude, OpenAI, Google or even local models
- Out of the box LSP support
- Focus on terminal user interface (TUI)
- Client/server architecture allowing remote usage

---

**RAVEN** - Enhanced AI coding agent based on OpenCode

> This is an independent fork and is not affiliated with the official OpenCode team.
