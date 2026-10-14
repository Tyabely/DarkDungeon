### DarkDungeon — Learning Log

One short entry per finished task: what you learned and what tripped you up. Newest at the bottom.
Claude writes the draft when you report a task as done; edit anything that doesn't sound like you.
Over time this becomes your portfolio story: what you could do at the start vs. now.

---

**2026-10-14 · M0 A–E · Project setup**
- **Learned:**
  - How a UE project is laid out on disk, and why Git LFS is needed for `.uasset` files.
  - How to organize Content by feature with `Prefix_Name` naming.
  - What MCP is: a standard "plug" that lets Claude look into the open editor.
  - How Claude Code is set up around the project: `CLAUDE.md` as the auto-loaded briefing, hooks as automatic checks, one task per session.
- **Tripped up:**
  - The editor wrote `.mcp.json` into `DarkDungeon_Project\` instead of the repo root, so it ended up committed in both places.
  - Claude Code's permission rules can't tell apart the ~830 editor functions (they all go through one tool), so the planned "deny list" had to become a hook.

**2026-10-14 · M0 F–G · GitHub remote**
- **Learned:**
  - `origin` is the remote's nickname, `main` is the branch, `master` is the old name for `main`.
  - Tracking links local `main` to `origin/main`.
  - LFS files travel separately from commits: the commit holds only a small pointer.
- **Tripped up:**
  - GitKraken asked for the upstream branch and pre-filled my username where the branch name (`main`) should go.
  - The first push uploaded the commits but none of the 418 LFS files, without any error. Fixed with `git lfs push --all origin` (it needed its own GitHub sign-in).
  - Lesson: "pushed" isn't "backed up" until the LFS files are checked too.

**2026-10-14 · M1-T1 · Battle level & Game Mode**
- **Learned:**
  - A level picks its rules through the Game Mode override in World Settings; Project Settings → Maps & Modes picks which level opens.
  - A child Blueprint inherits settings from its parent. Those settings live in **Class Defaults**, not in the graph.
  - GameModeBase vs GameMode, and what a Pawn / Default Pawn Class is.
- **Tripped up:**
  - Pressing Play spawned a flying sphere although the new Game Mode's graph was empty. Cause: the inherited Default Pawn Class (`DefaultPawn`). Fixed by setting it to None.
  - Saved both assets into `Board/` first; moved them to `Maps/` and `Core/` in the Content Browser.
