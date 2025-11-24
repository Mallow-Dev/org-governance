#!/usr/bin/env python3
"""
Conversation Journal Generator

Generates "meeting minutes" style summaries from AI conversation transcripts.
Uses a lightweight LLM (GPT-OSS) to minimize costs.
"""

import argparse
import json
import os
import re
import subprocess
import tempfile
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

JOURNAL_DIR = "memory-bank/sessions"
REDACTION_PATTERNS = [
    r"(api[_-]?key|token|secret|password|credential)[:\s=]+['\"]?[\w\-\.]+",
    r"(GITHUB_TOKEN|API_KEY|SECRET_KEY)[:\s=]+.+",
    r"Bearer\s+[\w\-\.]+",
    r"[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}",  # Private IPs (basic)
]


def redact_sensitive_info(text: str) -> tuple[str, List[str]]:
    """Redact sensitive information and return redacted text + list of findings."""
    redactions = []
    redacted_text = text
    
    for pattern in REDACTION_PATTERNS:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            redactions.append(f"Found sensitive data: {match.group(0)[:20]}...")
            redacted_text = redacted_text.replace(match.group(0), "[REDACTED]")
    
    return redacted_text, redactions


def build_cli_command(cli_name: str, model: str, temp_file: str) -> list:
    """
    Build the appropriate CLI command based on the tool.
    
    Different CLIs have different syntaxes:
    - claude: claude --print --model <model> < input.txt
    - llm: llm -m <model> < input.txt
    - aichat: aichat -m <model> < input.txt
    - gemini: varies by implementation
    """
    cli_lower = cli_name.lower()
    
    if 'claude' in cli_lower:
        # Claude CLI: claude --print --model sonnet
        cmd = [cli_name, '--print']
        
        if model:
            # Map generic names to Claude model names
            model_map = {
                'gpt-4o': 'opus',
                'gpt-4': 'opus',
                'gpt-3.5-turbo': 'haiku',
                'claude-sonnet': 'sonnet',
                'claude-opus': 'opus',
                'claude-haiku': 'haiku',
            }
            claude_model = model_map.get(model, model)
            cmd.extend(['--model', claude_model])
        else:
            # Default to haiku - fastest model for simple summarization tasks
            cmd.extend(['--model', 'haiku'])
        
        return cmd
    
    elif 'gemini' in cli_lower:
        # Gemini CLI patterns vary, but often: gemini chat "prompt"
        # For file input, we'll read and pass as argument
        return [cli_name, 'chat']
    
    elif 'aichat' in cli_lower:
        # aichat -m model
        cmd = [cli_name]
        if model:
            cmd.extend(['-m', model])
        return cmd
    
    else:
        # Default pattern (llm, chatgpt-cli, etc.): cli -m model
        cmd = [cli_name]
        if model:
            cmd.extend(['-m', model])
        return cmd


def generate_journal(conversation_data: str, conversation_id: str, llm_cli: str = "claude", model: str = None) -> str:
    """
    Generate journal using LLM CLI.
    
    Supports native CLIs with premium subscription allowances:
    - claude (Anthropic Claude CLI with premium account)
    - gemini (Google Gemini CLI)
    - llm (Simon Willison's llm tool)
    - aichat
    - Custom CLIs via LLM_CLI environment variable
    """
    
    # Redact sensitive information first
    safe_data, security_notes = redact_sensitive_info(conversation_data)
    
    # Prepare prompt
    full_prompt = f"""{SYSTEM_PROMPT}

---

# Conversation Transcript

{safe_data}

---

Generate the journal now in the specified markdown format."""
    
    # Get LLM CLI from environment or use default
    llm_command = os.getenv("LLM_CLI", llm_cli)
    
    try:
        # Write prompt to temp file for better handling of large conversations
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            temp_file = f.name
            f.write(full_prompt)
        
        # Build CLI command based on the tool
        cmd = build_cli_command(llm_command, model, temp_file)
        
        print(f"🤖 Calling {llm_command} CLI with model: {model or 'default'}")
        print(f"   Command: {' '.join(cmd)}")
        
        # Execute command
        # For CLIs that support stdin
        with open(temp_file, 'r') as stdin_file:
            result = subprocess.run(
                cmd,
                stdin=stdin_file,
                capture_output=True,
                text=True,
                timeout=120  # 2 minute timeout
            )
        
        # Clean up temp file
        os.unlink(temp_file)
        
        if result.returncode != 0:
            print(f"⚠️  CLI error (exit {result.returncode}): {result.stderr}")
            raise RuntimeError(f"CLI failed: {result.stderr}")
        
        journal_content = result.stdout.strip()
        
        # Add security notes if any were found
        if security_notes:
            security_section = "\n\n## Security Notes\n\n" + "\n".join(
                f"- 🔒 **Action Required**: {note}" for note in security_notes
            )
            # Insert before final separator if it exists
            if "\n---\n" in journal_content:
                journal_content = journal_content.replace("\n---\n", security_section + "\n\n---\n", 1)
            else:
                journal_content += security_section
        
        return journal_content
        
    except FileNotFoundError:
        print(f"❌ CLI '{llm_command}' not found.")
        print(f"\n💡 Available options:")
        print(f"   - claude (install from Anthropic)")
        print(f"   - llm (pip install llm)")
        print(f"   - aichat (cargo install aichat)")
        print(f"   - Set LLM_CLI environment variable to your CLI path")
        
        # Return placeholder as fallback
        return generate_placeholder_journal(conversation_id, security_notes)
    
    except Exception as e:
        print(f"❌ Error generating journal: {e}")
        return generate_placeholder_journal(conversation_id, security_notes)


def generate_placeholder_journal(conversation_id: str, security_notes: List[str]) -> str:
    """Generate a placeholder journal when LLM is not available."""
    return f"""# Conversation Journal: Placeholder

**Date**: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}  
**Conversation ID**: {conversation_id}

## Topics Discussed

- [Auto-generated summary would appear here]

## Actions Completed

- ✅ Placeholder action

## Security Notes

{chr(10).join(f"- 🔒 **Action Required**: {note}" for note in security_notes) if security_notes else "- No sensitive data detected"}

## References

- Conversation ID: {conversation_id}

---

**Note**: LLM CLI not available. Install with `pip install llm` or configure LLM_CLI.
"""



SYSTEM_PROMPT = """You are a technical meeting minutes generator. Analyse the conversation and create a structured journal with:

1. **Topics Discussed**: High-level themes
2. **Actions Completed**: What was built, fixed, or changed (include file paths, function names)
3. **Issues Fixed**: Bugs or problems resolved
4. **Plans Made**: Future work discussed
5. **Decisions**: Key choices and rationale
6. **Follow-up Items**: TODOs or unfinished items

Format in markdown. Be concise. Include line numbers from conversation when referencing specific exchanges (e.g. "L123-L145").

CRITICAL: Do NOT include sensitive data (API keys, tokens, credentials, private IPs). Flag these as security notes instead.
"""


def main():
    parser = argparse.ArgumentParser(
        description="Generate conversation journal",
        epilog="Examples:\n"
               "  %(prog)s -i abc123 -f chat.txt --llm-cli claude\n"
               "  %(prog)s -i abc123 -f chat.txt --llm-cli claude -m opus\n"
               "  %(prog)s -i abc123 -f chat.txt --llm-cli llm -m gpt-4o-mini",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("--conversation-id", "-i", required=True, help="Conversation ID")
    parser.add_argument("--input", "-f", help="Input file path (conversation transcript)")
    parser.add_argument("--output-dir", "-o", default=JOURNAL_DIR, help="Output directory")
    parser.add_argument("--title", "-t", help="Custom journal title")
    parser.add_argument("--llm-cli", default="claude", help="LLM CLI command (default: claude)")
    parser.add_argument("--model", "-m", help="LLM model to use (optional, uses CLI default)")
    
    args = parser.parse_args()
    
    # Ensure output directory exists
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Load conversation data
    if args.input:
        with open(args.input, "r") as f:
            conversation_data = f.read()
    else:
        # FUTURE: Fetch conversation data from API by conversation ID
        # Will require API endpoint integration or conversation export feature
        
        print("❌ Error: --input/-f argument is required")
        print("   Provide conversation transcript file with --input <file>")
        print("\n   Future: Add conversation API integration to fetch by ID")
        return 1
    
    # Generate journal
    print(f"🔍 Generating journal for conversation {args.conversation_id}...")
    journal_content = generate_journal(
        conversation_data, 
        args.conversation_id,
        llm_cli=args.llm_cli,
        model=args.model
    )
    
    # Determine filename
    timestamp = datetime.now().strftime("%Y-%m-%d")
    title_slug = args.title.lower().replace(" ", "-") if args.title else args.conversation_id[:8]
    output_file = output_dir / f"{timestamp}_{title_slug}.md"
    
    # Write journal
    with open(output_file, "w") as f:
        f.write(journal_content)
    
    print(f"✅ Journal created: {output_file}")
    print(f"📝 Review and commit to memory bank")


if __name__ == "__main__":
    main()
