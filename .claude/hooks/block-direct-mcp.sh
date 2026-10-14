#!/usr/bin/env bash
# PreToolUse guard for Bash/PowerShell: block shell commands that talk to the
# Unreal MCP server directly (port 8000), which would skip unreal-mcp-guard.js.
# A tripwire against mistakes, not a lock — the mentor rule still applies.
if grep -qiE '(127\.0\.0\.1|localhost|\[::1\]|0\.0\.0\.0):8000'; then
  echo "Blocked: direct requests to the Unreal MCP server (port 8000) skip the read-only guard. Use mcp__unreal-mcp__call_tool instead." >&2
  exit 2
fi
exit 0
