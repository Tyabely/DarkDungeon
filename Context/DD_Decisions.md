### DarkDungeon — Decisions

Short decision records: **what** we chose, **over what**, and **why**. When you later wonder "why is it like this?", the answer should be here. Newest at the bottom.
Claude adds an entry whenever a task you report as done involved a choice.

| # | Date | Milestone | Decided | Over | Because |
|---|---|---|---|---|---|
| 1 | 2026-10-14 | M0 | UE **5.8**, frozen for the whole project | Upgrading engine versions mid-project | Upgrades break plugins and assets, and that teaches nothing about game-making |
| 2 | 2026-10-14 | M0 | **Blueprint-only** (no C++, no GAS) | Blueprint + C++ | Learning goal is UE itself, not programming. GAS effectively needs C++ for Attribute Sets |
| 3 | 2026-10-14 | M0 | **Git + Git LFS on GitHub** | Perforce, Diversion, plain Git | Free, industry-standard for small teams, works as a portfolio host. LFS keeps big binary files out of normal Git history |
| 4 | 2026-10-14 | M0 | **Top Down Strategy** template as the starting project | Blank project | Gives a working top-down camera and click-to-act setup to learn from. Template folders stay read-only and are deleted before the portfolio pass |
| 5 | 2026-10-14 | M0 | Folders **by game feature** under `Content/DarkDungeon/` | Folders by file type (all Blueprints together, all materials together) | Everything for one feature sits in one place, which is easier to find, move and delete |
| 6 | 2026-10-14 | M0 | Epic's built-in **Unreal MCP**, used **read-only** | Third-party MCP servers, or letting Claude edit | Ships with 5.8, so nothing to compile. Read-only keeps every editor action in your hands (the learning goal) |
| 7 | 2026-10-14 | M0 | Enforce read-only with a **PreToolUse hook + allowlist** | A `deny` list in `settings.json` | All ~830 editor functions go through one Claude Code tool (`call_tool`). Deny rules only see tool names, so they can't tell reads from writes. An allowlist also blocks functions added by future engine updates |
| 8 | 2026-10-14 | M0 | Hook written in **Node.js** | Python, PowerShell | Python isn't installed system-wide. Node is already installed and starts much faster than PowerShell, which matters because the hook runs on every editor call |
| 9 | 2026-10-14 | M0 | Repo **public** from day one, managed with **GitKraken** | Private repo with GitHub Desktop (the original plan) | GitKraken shows the history better, and its free plan only supports public repos. Nothing sensitive is in the repo. Cost: the commit email is public, and other people's clones use your LFS bandwidth |
| 10 | 2026-10-14 | M0 | Check every push with `check-lfs-remote.js` | Trusting the Git client's "success" | The first push silently skipped all LFS files. The script asks GitHub directly whether every file arrived |
