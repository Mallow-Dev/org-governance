#!/bin/bash
# Org Governance Onboarding Script
# Usage: ./onboard-repo.sh /path/to/target/repo

set -e

TARGET_REPO=$1

if [ -z "$TARGET_REPO" ]; then
    echo "Usage: $0 /path/to/target/repo"
    exit 1
fi

if [ ! -d "$TARGET_REPO/.git" ]; then
    echo "Error: $TARGET_REPO is not a git repository."
    exit 1
fi

GOVERNANCE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOOK_SOURCE="$GOVERNANCE_ROOT/hooks/pre-commit"

echo "🚀 Onboarding repository: $TARGET_REPO"

# 1. Install Pre-commit Hook
echo "Installing pre-commit hook..."
cp "$HOOK_SOURCE" "$TARGET_REPO/.git/hooks/pre-commit"
chmod +x "$TARGET_REPO/.git/hooks/pre-commit"
echo "✅ Pre-commit hook installed."

# 2. Add Governance Badge (Optional)
README_PATH="$TARGET_REPO/README.md"
BADGE="[![Governance: Active](https://img.shields.io/badge/Governance-Active-success)](https://github.com/Mallow-Dev/org-governance)"

if [ -f "$README_PATH" ]; then
    if ! grep -q "Governance: Active" "$README_PATH"; then
        echo "Adding governance badge to README.md..."
        # Prepend badge to README
        sed -i "1s/^/$BADGE\n\n/" "$README_PATH"
        echo "✅ Badge added."
    else
        echo "ℹ️  Governance badge already present."
    fi
else
    echo "⚠️  README.md not found. Skipping badge."
fi

echo
echo "🎉 Onboarding complete!"
echo "This repository is now compliant with organizational governance standards."
