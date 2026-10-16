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

**2026-10-15 · M1-T6 · Pick the Area under the cursor**
- **Learned:**
  - Get Hit Result Under Cursor by Channel fires the ray from the camera through the cursor; no manual line trace maths needed.
  - The Hit Result is a struct: Break Hit Result → Hit Actor.
  - Cast To BP_Area does two jobs at once: filters out everything that isn't an Area, and hands back a `BP_Area`-typed reference (needed in T7).
  - By Channel vs For Objects: a kind of ray that components respond to, vs a list of collider types to look for.
  - A reference's type doesn't promise it points at anything: any reference can be None. The caller checks with Is Valid, and the Is Not Valid branch is real game logic ("clicked nothing" → print "none" now, clear the highlight in T7).
  - Logic that answers a question goes in a function; the event decides what to do with the answer.
- **Tripped up:**
  - For Objects "didn't work": its Object Types list was empty, so the ray could hit nothing.
  - Clicking the floor printed the last clicked Area. The Cast Failed path never reached a Return Node, so the caller's output pin kept its old value. Making the variable local, removing it, or toggling Pure didn't help, because none of them was the cause. Fixed with a second Return Node on Cast Failed.
  - Get Display Name on an empty reference gave a blank message, which looked like "maybe it works".
  - Questioned why Is Valid is needed when the output is typed `BP_Area` (type ≠ "something is there"), and whether the check is duplicated (the cast asks "is it an Area?", Is Valid asks "did I get one?"). A bool `Found` output would be an equally valid alternative.

**2026-10-16 · M1-T7 · Highlight**
- **Learned:**
  - Material vs Material Instance: the material holds the graph and its *parameters*; an MI only changes parameter values and reuses the parent's shaders. A parameter in an MI stays greyed out until its **override checkbox** is ticked.
  - What's expensive is *compiling* new materials, not swapping already-made ones at runtime. M → MI → M costs the same as MI → MI; MI → MI is a tidiness convention (the master stays untouched).
  - A Cast doesn't pick *which* Area. The object reference coming out of `GetAreaUnderCursor` already *is* that one Area (`Area_7`); the cast only checks the type.
  - Split of responsibility: the Area owns *how* it looks (`SetHighlighted`), the controller owns *which one* is selected, because "only one at a time" is a rule across all Areas.
  - Order matters: turn the old one off **before** turning the new one on, or re-clicking the same Area turns it off again.
- **Tripped up:**
  - Built the Lerp + parameters in the material, then the MI "wouldn't let me change it": the override checkbox wasn't ticked.
  - In the plan, asked how the engine knows the clicked Area is `_7` and not `_5` when you "cast to the BP". The reference carries that; the class doesn't.
  - Proposed Areas listening for clicks, and called Interfaces a broadcaster/listener tool (that's an Event Dispatcher; an Interface is a shared message). Neither was needed: the controller already knows the one Area to talk to.
  - First working version used `PreviouslyHitArea` + `MostRecentlyHitArea` and turned the new Area on *before* the old one off, so clicking an Area, then empty space, then the same Area left it dark. Fixed by reordering to off → set → on with one variable.
  - Used Cast To BP_Area on variables already typed `BP_Area`, as an "is it empty?" check. Works, but Is Valid says what's meant (cleanup noted in Current focus).
- **Follow-up (same day, cleanup):**
  - Learned: a Cast is only needed when a reference's type is too *broad* (Hit Actor = any Actor). A variable already typed `BP_Area` can call `SetHighlighted` directly; drag off the pin and see if the function is offered.
  - Learned: when two branches start with the same step, move it before the split, so it exists (and is checked) once.
  - Tripped up: removing the casts also removed the hidden "is it empty?" check they were doing, so the first click and repeated empty clicks logged *Accessed None* while the game looked fine (a node called on None is skipped). Also, the Is Valid that was there checked `HitArea`, not `SelectedArea`: two different questions.
  - Tripped up: while rewiring, the event ended up on **Triggered** instead of **Started** (fires every frame while held). Not noticed in play because re-selecting the same Area looks identical.

**2026-10-16 · M2-T1 · Area data**
- **Learned:**
  - An **enum** is your own variable type with a fixed list of named choices. In UE it's an asset (`E_SpawnSide`), and every variable of that type picks one choice from a dropdown.
  - Why an enum beats the alternatives: two booleans could both be true, and an integer code is unreadable and allows invalid values.
  - The **first** enumerator is the default for new variables, so "None" goes first.
  - Data the level designer sets per Area (`Capacity`, `SpawnSide`) is Instance Editable, the same tool as `SizeX`/`SizeY` in M1.
  - Design choices hiding in the "data" task: capacity by size, and spawn sides sized for later (3–4 enemies), not just for the MVP's 2.
- **Tripped up:**
  - Wasn't sure the enum was built right (it was: None / Hero / Enemy, in that order).
  - Asked whether spawn sides need marking separately. The `SpawnSide` value set on each Area *is* the marking.
  - Tooling: the Unreal MCP connection dropped after the editor's server restarted. Restarting the server isn't enough; the Claude session has to reconnect (or start fresh).
