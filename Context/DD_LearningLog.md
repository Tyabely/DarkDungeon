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

**2026-10-16 · M2-T2 · `BP_Unit` placeholder**
- **Learned:**
  - A second enum (`E_Team`: Hero / Enemy) for a different job than `E_SpawnSide`. A *place* can be "None"; a *piece* always has a side, so `E_Team` has no None.
  - **Switch on Enum** in the Construction Script: one exit per value, each one sets a different material. Changing `Team` in Details recolours the piece straight away.
  - Reused the M1 material pattern for units: a parent material plus a Material Instance with `ColorScaling` overridden (Decisions #32/#33).
  - A variable can hold a **reference to another actor** (`CurrentArea`, type `BP_Area`). It stays empty (None) until T3 fills it.
  - **Pivot at the feet:** the 60×60×180 cube is lifted by 90 cm inside the Blueprint, so the actor's origin sits on the floor. Spawning at an Area's location in T3 will stand the unit *on* the Area, not half inside it.
  - Placeholder size drove a level change: corner and side Areas were enlarged so their capacity fits 60 cm units.
- **Tripped up:** none reported.

**2026-10-16 · M2-T3 · Spawn at battle start**
- **Learned:**
  - **Get All Actors Of Class** returns an **array** sized by whatever it finds; you don't create the slots. To work on each item you loop with **For Each Loop**, whose Array Element is "the current item".
  - The array is already typed (`BP_Area`), and so is Spawn Actor's Return Value (`BP_Unit`). A Cast on them is redundant, which is what the blue **NOTE** bar on a cast means.
  - **Switch on Enum** for flow: one exit per `SpawnSide`, None left unconnected, instead of Branches plus `==` nodes.
  - **The Construction Script runs inside Spawn Actor from Class.** Setting `Team` after the spawn came too late for the colour. **Expose on Spawn** puts the variable on the Spawn node, so the value is there before construction. Same fix for `CurrentArea`, which also removed the long wires.
  - Rule kept: if a value is part of what the actor *is* when it's created, give it to the Spawn node.
  - **Switch vs Select**: Switch picks which *exec path* runs; Select picks which *value* comes out. Both exits of the Switch go into one Spawn node, and a Select on `SpawnSide` turns the side into a `Team`. A Select's Index pin takes its type from the first wire connected to it.
- **Tripped up:**
  - Getting one value out of an array (tried casting the whole array) until For Each clicked.
  - Thought the colour issue could only be fixed by moving the logic to the Event Graph. It worked, but only because spawn and SET happen in the same frame; Expose on Spawn is the real fix.
  - First Select attempt used **Array Index** (the item's position in the list) instead of **Spawn Side**, which turned its Index into an Integer. A fresh Select wired to Spawn Side first showed the None / Hero / Enemy options.
  - Tooling: the MCP connection dropped mid-session again and only came back after restarting the Claude app. Logs on both sides show no error.

**2026-10-18 · M2-T4 · Occupancy & capacity (in progress)**
- **Learned:**
  - **Length vs index:** Length counts items, an index numbers slots from 0, Last Index = Length − 1. The capacity check is `Length < Capacity`; the first try (`Last Index < Capacity`) let one unit too many in.
  - **Add vs Insert:** Add appends with no index needed. Insert at Last Index on an empty array (−1) silently did nothing while the function still returned true.
  - **Target = the receiver, not the sender.** `AddUnit` lives on `BP_Area`, so its Target must be *an Area* (`CurrentArea`), and Self goes into Added Unit. Casting Self to `BP_Area` can never work, because a unit isn't an Area.
  - Registering in the unit's own BeginPlay means any spawner (Game Mode, a later summon) gets registration for free.
  - **Pure nodes re-run for every loop pass**, so the chain feeding Set Actor Location reads a new Array Index each time. The For Each *is* the loop.
  - **Lookup table instead of branches:** per-count layouts as data (`Layouts`, an array of the `S_SlotLayout` struct) picked by `Length − 1`. Wrapping an array in a struct is how you get an array of arrays. A 90° Rotate Vector Around Axis replaces a manual X/Y flip.
  - An array element's ⌄ menu in Details has Insert / Delete / Duplicate.
- **Tripped up:**
  - "Function inside a function?": `AddUnit` *is* the checker; no extra layer was needed.
  - Calling `AddUnit` from `BP_Unit` with Target = self (error) and then a Cast of self to `BP_Area` (always fails), until Target = `CurrentArea` clicked. Felt like having to "fake the sender".
  - `Layouts` first made as a **local** variable (no defaults for local arrays), then as a Vector array instead of an `S_SlotLayout` array. The struct is found by name in the type picker, not under Vector.
  - Break S_SlotLayout didn't show up when dragging from the array; it only appears on a single element (after a Get).
  - Subtract node with B = **−1** (Length + 1): 2 units read the 4-unit row and 3 units read a row that doesn't exist (all at the centre). The Rotate node was also left unwired.
  - The "wall" in 2-slot corners was the refused 3rd unit still standing at the centre; the capacity check worked.
  - `MoveToArea` arranges `CurrentArea` but adds to `AreaToMove`. It works only because both are the same at spawn.
