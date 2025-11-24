# LLM CLI Setup Guide

Guide for using native LLM CLIs with premium subscription allowances.

## Overview

This script supports **premium subscription CLIs** - tools that use your existing LLM subscriptions rather than API credits:

- ✅ **Claude CLI** - Uses your Anthropic premium account
- ✅ **Gemini CLI** - Uses your Google AI premium account
- ✅ **llm** - Can use API keys or local models
- ✅ **aichat** - Multi-provider CLI

## Installation

### Claude CLI (Recommended)

```bash
# Check if already installed
which claude

# If not installed, download from:
# https://claude.ai/download

# Test it works
claude --version

# Set up authentication (requires Claude subscription)
claude setup-token
```

### llm (Simon Willison)

```bash
pip install llm

# Set up API keys
llm keys set openai
# Enter your API key when prompted
```

### aichat

```bash
# Install via cargo
cargo install aichat

# Or via package manager
brew install aichat  # macOS
```

## Usage Examples

### Using Claude (Default - Uses Premium Subscription)

```bash
cd /home/renchey/projects/org-governance

# Simple usage - uses your Claude subscription allowance
python3 scripts/create-journal.py \
  -i "41475c73-db7e-42b5-b76f-e173f989cc52" \
  -f conversation.txt \
  -t "Branch Protection Setup"

# Specify Claude model explicitly
python3 scripts/create-journal.py \
  -i "41475c73-db7e-42b5-b76f-e173f989cc52" \
  -f conversation.txt \
  -m opus  # or sonnet
```

### Using llm

```bash
# Use GPT-4o-mini (charges to OpenAI API)
python3 scripts/create-journal.py \
  -i "conversation-id" \
  -f conversation.txt \
  --llm-cli llm \
  -m "gpt-4o-mini"

# Use local model (free!)
python3 scripts/create-journal.py \
  -i "conversation-id" \
  -f conversation.txt \
  --llm-cli llm \
  -m "orca-mini-3b"
```

### Using aichat

```bash
python3 scripts/create-journal.py \
  -i "conversation-id" \
  -f conversation.txt \
  --llm-cli aichat \
  -m "claude-sonnet"
```

### Set Default CLI

```bash
# Use environment variable to set default
export LLM_CLI=claude
python3 scripts/create-journal.py -i <id> -f conversation.txt
```

## Model Names by CLI

### Claude CLI

- `sonnet` - Claude Sonnet (default, recommended)
- `opus` - Claude Opus (highest quality)
- `haiku` - Claude Haiku (fastest)

### llm

- `gpt-4o` - GPT-4 Optimized
- `gpt-4o-mini` - GPT-4 Mini (cost-effective)
- `gpt-3.5-turbo` - GPT-3.5 Turbo
- `orca-mini-3b` - Local model (free)

### aichat

- `claude-sonnet` - Anthropic Claude
- `gpt-4` - OpenAI GPT-4
- `gemini-pro` - Google Gemini

## Cost Comparison

| CLI        | Model       | Cost Type             | Best For                    |
| ---------- | ----------- | --------------------- | --------------------------- |
| **claude** | sonnet/opus | **Premium allowance** | **Daily use (recommended)** |
| llm        | orca-mini   | **Free (local)**      | Offline, testing            |
| llm        | gpt-4o-mini | API usage ($)         | One-off tasks               |
| aichat     | \*          | Varies                | Multi-provider needs        |

## Troubleshooting

### "CLI not found"

```bash
# Check installation
which claude
which llm

# Install if missing (see Installation section above)
```

### Claude authentication issues

```bash
# Re-authenticate
claude setup-token

# Check your Claude subscription at https://claude.ai
```

### Timeout for large conversations

```bash
# Edit scripts/create-journal.py line ~145
# Change: timeout=120 → timeout=300
```

## Why Use Premium CLIs?

1. **No API bills** - Uses subscription allowance
2. **Higher rate limits** - Premium subscriptions have better limits
3. **Convenient** - Already authenticated
4. **Latest models** - Access to newest models immediately

## Links

- **Claude CLI**: https://claude.ai/download
- **llm**: https://github.com/simonw/llm
- **aichat**: https://github.com/sigoden/aichat
