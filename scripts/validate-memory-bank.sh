#!/bin/bash
# Memory Bank Validation Script
#
# Validates memory bank integrity and format compliance
# Run before committing changes to memory bank files

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MEMORY_BANK="$REPO_ROOT/memory-bank"
AGENT_BANKS="$REPO_ROOT/agent-memory-banks"

echo "🔍 Validating Memory Bank..."
echo

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Function to check file exists
check_file() {
    local file=$1
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Missing required file: $file${NC}"
        ((errors++))
        return 1
    fi
    return 0
}

# Function to check markdown syntax
check_markdown() {
    local file=$1
    if command -v markdown-link-check &> /dev/null; then
        if ! markdown-link-check "$file" -q 2>/dev/null; then
            echo -e "${YELLOW}⚠️  Broken links in: $file${NC}"
            ((warnings++))
        fi
    fi
}

# Function to check for sensitive data
check_sensitive() {
    local file=$1
    local patterns=("api_key" "API_KEY" "password" "PASSWORD" "secret" "SECRET" "token" "TOKEN")
    
    for pattern in "${patterns[@]}"; do
        if grep -i "$pattern" "$file" | grep -v "# " | grep -v "example" > /dev/null 2>&1; then
            echo -e "${RED}❌ Possible sensitive data in $file: $pattern${NC}"
            ((errors++))
        fi
    done
}

echo "📋 Checking required files..."

# Check shared memory files
check_file "$MEMORY_BANK/activeContext.md"
check_file "$MEMORY_BANK/progress.md"
check_file "$MEMORY_BANK/agent-logbook.md"

# Check agent-specific memory files
check_file "$AGENT_BANKS/governance-monitor-memory.md"
check_file "$AGENT_BANKS/report-processor-memory.md"
check_file "$AGENT_BANKS/standards-updater-memory.md"
check_file "$AGENT_BANKS/compliance-checker-memory.md"

echo

echo "🔗 Checking for broken links..."
for file in "$MEMORY_BANK"/*.md "$AGENT_BANKS"/*.md; do
    if [ -f "$file" ]; then
        check_markdown "$file"
    fi
done

echo

echo "🔒 Checking for sensitive data..."
for file in "$MEMORY_BANK"/*.md "$AGENT_BANKS"/*.md; do
    if [ -f "$file" ]; then
        check_sensitive "$file"
    fi
done

echo

echo "📅 Checking timestamps in agent-logbook..."
if [ -f "$MEMORY_BANK/agent-logbook.md" ]; then
    # Check for entries without proper timestamp format
    if grep -E "^## [^0-9]" "$MEMORY_BANK/agent-logbook.md" > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Some logbook entries may have invalid timestamp format${NC}"
        ((warnings++))
    fi
fi

echo

# Summary
echo "================================"
if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    exit 0
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Passed with $warnings warning(s)${NC}"
    exit 0
else
    echo -e "${RED}❌ Failed with $errors error(s) and $warnings warning(s)${NC}"
    exit 1
fi
