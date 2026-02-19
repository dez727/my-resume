#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install gh CLI if not already present
if ! command -v gh &> /dev/null; then
  echo "Installing gh CLI..."
  apt-get install -y -qq gh
  echo "gh CLI installed: $(gh --version | head -1)"
fi

# Authenticate gh CLI with GITHUB_TOKEN if set
if [ -n "${GITHUB_TOKEN:-}" ]; then
  echo "$GITHUB_TOKEN" | gh auth login --with-token
  echo "gh CLI authenticated as: $(gh api user --jq '.login')"
else
  echo "WARNING: GITHUB_TOKEN is not set. gh CLI will not be authenticated."
  echo "Set GITHUB_TOKEN in your Claude Code project environment settings."
fi
