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

**2026-10-14 · M1-T2 · `BP_Area` actor**
- **Learned:**
  - The Construction Script runs in the editor, so an actor can rebuild itself every time you change a value in Details.
  - Instance Editable gives each placed copy its own value; leaving it off keeps a value fixed for every copy.
  - A plain Scene root + a mesh child lets you move the mesh's pivot: shift the mesh so its corner sits on the root.
  - Size ≠ Scale: scale = size ÷ the mesh's size at scale 1 (the engine Cube is 100 cm).
  - Relative vs World location: inside an actor you set things relative to the parent.
  - Grouping X/Y/Z into one Vector cuts the wiring roughly in half.
- **Tripped up:**
  - Scaling alone moved the corner off the root. The offset has to grow with the size too (location = size × 0.5).
  - First tried the Set *World* Location/Scale nodes; Relative was the right pair.
  - Print String in the Construction Script showed nothing on screen. On-screen messages only appear in PIE; editor-time prints go to the Output Log.
  - Started with sizes as meter multipliers, then switched to cm (UE's own unit).

**2026-10-14 · M1-T3 · Lay out the room**
- **Learned:**
  - Scaling stretches whatever is *painted on* a mesh (textures, patterns). A plain colour can't stretch, so a border made of two plain cubes stays sharp at any size.
  - A child component inherits its parent's scale. `TopCube` under `BottomCube` only needs "a bit smaller than my parent" (`(Size − 2 × Border) / Size`), not a size of its own.
  - A Function can return two values at once (`GetInnerScale` gives X and Y).
  - Outliner folders and actor labels keep the level readable; they don't affect the game.
- **Tripped up:**
  - Rotating Areas by ±90° made `SizeX` point along world Y and moved the corner they grow from to another side, so placement was hard to reason about. Fixed: all rotations 0, sizes swapped instead.
  - Started the task in the wrong Claude session; the work was fine, just checked again here.

**2026-10-14 · M1-T4 · Top-down camera & Player Controller**
- **Learned:**
  - Game Mode says *which* classes the game uses (pawn, controller, player state). The Player Controller owns per-player things: the cursor and what you look through.
  - With Default Pawn Class = None, a plain PlayerController is enough for "no body"; it just looks wherever it's told.
  - A camera can stand in the level as a Camera Actor; the controller switches to it with Set View Target with Blend on Event BeginPlay.
  - Show Mouse Cursor is a Class Defaults checkbox, no nodes needed.
  - Is Valid guards against a missing reference; Promote to Variable creates a correctly typed variable.
  - Pitch is measured from the horizon (−90 = straight down); Yaw on a multiple of 90 keeps rectangles looking like rectangles.
- **Tripped up:**
  - Picked `NoPawnPlayerController` as the parent. PIE failed with "Couldn't spawn player: PlayerState is null" (that class skips the Player State). Fixed by reparenting to `PlayerController`.
  - Wasn't sure whether the camera belonged in Default Pawn Class (no: that stays None).
  - First camera (0, 0, 400, Pitch −45 / Yaw 45) hovered over a room corner, looked diagonally and clipped the nearest Area. Reframed straight-on.
  - Couldn't find the Camera Actor variable type; Promote to Variable solved it.

**2026-10-14 · M1-T5 · Click input**
- **Learned:**
  - Enhanced Input splits *meaning* from *keys*: the Input Action (`IA_Select`) is the meaning, the Mapping Context (`IMC_Battle`) binds keys to it, and the Player Controller switches the context on.
  - A plain click is a Digital (bool) action.
  - The context is added on BeginPlay through the Enhanced Input Local Player Subsystem → Add Mapping Context. Since a Blueprint has only one BeginPlay, the new nodes go into the existing chain.
  - Every Input Action gets its own event node in Blueprints. Its **Started** pin fires once per press.
- **Tripped up:**
  - In the plan, thought the Input Action itself detects when and how long the button is held. That's the job of Triggers and the event's pins.
  - Thought the Print String could go into `IMC_Battle`. A Mapping Context is a data table with no graph, so all logic goes in a Blueprint (the controller).
  - Wasn't sure whether "add the context on start" meant BeginPlay or a Cast. It's BeginPlay.
