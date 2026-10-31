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

**2026-10-18 · M2-T4 · Occupancy & capacity** ✅
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
  - `MoveToArea` arranges `CurrentArea` but adds to `AreaToMove`. It works only because both are the same at spawn. Fixed by moving `ArrangeUnits` into `AddUnit`'s true path, so the Area that accepts a unit is always the one that re-arranges.
  - Finishing pass: a refused unit was a "ghost" that no Area listed, standing inside the others. Destroy Actor fixed it, but the first try *replaced* the Print String instead of following it, so the over-fill went silent. Final chain: Print → Destroy Actor.
- **Thinking ahead (T5 brief, same day):** picked an enum over "index 0 of an array = selected" for the Area's three looks (a hidden rule like that is easy to forget), and spotted both catches of edge-box neighbour detection (T-junctions, diagonal corners) before building it.

**2026-10-18 · M2-T5 · Neighbours** ✅
- **Learned:**
  - **Range overlap** = Min(ends) − Max(starts), one axis at a time: positive = shared length, 0 = touching at a point, negative = gap. It doesn't depend on the order of the two Areas, and Min / Max do the "sorting".
  - The neighbour rule needs **both** axes: one ≈ 0 (they touch) **and** the other > tolerance (they share some edge). Corner contact = both 0; "edges line up but there's a gap" = one 0, other negative. Both > 0 = the rectangles overlap (a level bug → warning print).
  - **Who does what:** `IsNeighbour(OtherArea)` only answers about one pair (the caller plugs the other Area in, like `AddUnit`'s input); the BeginPlay loop asks it about every other Area. Get All Actors Of Class isn't allowed in the Construction Script, but bounds are, so they're ready before any BeginPlay.
  - Floats: compare with **Nearly Equal** and a tolerance, not `==`.
  - An **enum** is its own asset, not something made inside a Blueprint. One enum input beats two bools (no meaningless "both true" case), and a wire only joins pins of the same type.
  - **Switch vs Select again:** three Set Material nodes that differ only in the material = a value choice → one Select into one Set Material.
  - **Array into Target** calls the function on every item, no loop node needed.
  - Clear the old selection *before* setting the new one, or a new selection that was an old neighbour gets wiped.
  - Debugging order that worked: confirm the parts that do work (skip-self, false never adds), find the unconnected output, then **print the locals** to see the real numbers.
- **Tripped up:**
  - Worked the puzzle by mixing up which values are an Area's start and end, so a real overlap came out negative (1 − 3 instead of 3 − 1).
  - Swapped the starts' Max for a Min while experimenting, so no axis ever gave 0.
  - First return rule `X == 0 OR Y == 0` (corners count), then XOR (gaps count). The fix needed "the other axis is positive".
  - First idea for the look was "index 0 of an array = selected", rejected for an enum. Then two bools on `SetLook`, because the enum didn't connect to the bool pins.
  - `SetLook`'s first Select had every option wired to `NewLook`, so it always returned `NewLook`.

**2026-10-21 · M2-T6 · Move a hero by clicking** ✅
- **Learned:**
  - **Trace channels and collision responses:** every component answers each channel with Block / Overlap / Ignore. A custom channel with default Ignore (`AreaPick`) only "sees" what opts in. A multi-trace still stops at the first Block. `Visibility` is just a channel's name; it has nothing to do with rendering.
  - The ray hits a **component** (`TopCube`); the Hit Result also carries the **actor** that owns it, which is what the Cast reads.
  - **Cast vs Is Valid:** Is Valid asks "is there anything?", Cast asks "is it this type?" (and fails on None too).
  - **Selection state** lives in variables on the controller, and they must survive between clicks: wiping them at the end of every click made "same as before" impossible (the whiteboard).
  - **Source of truth:** one place owns a fact, everything else reads it. Applied three times: selection on the controller, looks painted *from* the variables, spawn-vs-move asked of the Area's list instead of `CurrentArea`.
  - **Compare before you overwrite:** deselect needs the old value at the moment the new hit arrives (the coat check).
  - **One frame:** a whole click (lights off, decide, paint) runs before the screen draws, so a look that is cleared and never re-applied simply vanishes.
  - A function that ends without reaching a Return node hands back default outputs, so a successful move came back as false.
  - Splitting one big event into named functions (`ClearLooks`, `SelectHero`, `PaintSelection`…) so that each branch ends in one call. **Find References** shows who calls a function.
  - **Flowchart first:** sketching the click flow in Miro is what made deselect click.
- **Tripped up:**
  - First fix for "lit but not selected" was a member flag (`bWasUnitSelectionValid`) for a fact that only lives for one click; it went stale after an empty click.
  - Cleared both variables first, then fired the rays, so there was nothing left to compare against. Then wiped both at the end of every click.
  - Deselect fixed for the looks but not the variables (three spots where they disagreed).
  - `MoveToArea` returned nothing after SET `CurrentArea`; a Branch after `RemoveUnit` had its Condition unwired (always true).
  - In the refactor: `SelectArea`'s input and the controller `MoveToArea`'s target were left unwired, `PaintSelection` nested the Area inside the hero check, the refused-move path painted nothing, and an old `IA_Select` node was left in the graph.
  - Asked "is it two clicks?" when the hero went dark after a move: it was one click whose start switched the lights off.

**2026-10-21 · M3-T1 · Unit data shape** ✅
- **Learned:**
  - **Data Table vs Data Asset:** a spreadsheet where every row has the same columns, vs one file per thing filled in from a template. Both can point to other Data Assets. Lists are easy on a Data Asset and fiddly in a table cell.
  - **Template vs filled-in copy:** `PDA_` is a Blueprint class (Primary Data Asset) and can have children. `DA_` is a filled-in copy and can't. Duplicate it instead.
  - **Fields go on the parent if code reads them without knowing the child.** Otherwise every read needs a Cast.
  - **Data is shared:** `DA_Ghoul` is the stat card for every Ghoul. Max HP goes in data, current HP on each unit.
  - **Data has no logic:** "moves and abilities work differently" is about the Blueprints that read them, not about which fields they can share.
  - Text (player-facing) vs String. Look = Static Mesh + Material Interface, without animation.
  - Sketched the shape in Miro before building.
- **Tripped up:**
  - Picked Data Assets partly because the tutorials did. The reasons that hold up are the different fields and the lists.
  - Moved `Team` into both children to fix "two sources of truth", which made two separate variables.
  - Read "use Text for Name" as "drop the name for an enum of unit types".
  - First sketch left out Speed and Look. Built the M5 ability/move templates early.

**2026-10-21 · M3-T2 · The four MVP units as data** ✅
- **Learned:**
  - **Different values → a `DA_`; different fields → a child class.** Warrior and Archer fill in the same hero form, so they're Data Assets made from `PDA_Hero`, not children of it.
  - A Data Asset only shows fields that are Instance Editable. A Class Default on `PDA_Enemy` (`Team` = Enemy) fills in every enemy `DA_` for free.
  - **Mesh vs Transform:** the mesh is only the shape (a 1 m cube). The tall block comes from the component's Scale (0.6/0.6/1.8) inside `BP_Unit`, so the `DA_` holds the plain Cube.
  - Copy/paste a property: right-click the field → Copy, right-click the target field → Paste.
  - Renamed for clarity: `MaxHealth` → `BaseMaxHealth`, `Name` → `DisplayName`, `PDA_Move` → `PDA_EnemyMove`, `PDA_Ability` → `PDA_HeroAbility`. Moves went through the Content Browser, so no leftover redirectors.
- **Tripped up:**
  - Expected Warrior/Archer to be child classes of `PDA_Hero`.
  - The HP numbers first landed in `DisplayName`, leaving `BaseMaxHealth` at 0 on all four.

**2026-10-21 · M3-T3 · Spawn from data** ✅
- **Learned:**
  - **A DA is data, not an actor.** Spawn Actor's Class stays `BP_Unit`. The Game Mode passes the `DA_` through an Expose on Spawn `UnitData` (`PDA_Unit`) pin, and the unit's Construction Script reads team, mesh, material and HP from it.
  - **Arrays don't convert like single objects.** A `PDA_Hero` fits a `PDA_Unit` variable, but an array of `PDA_Hero` doesn't fit an array of `PDA_Unit`. Fix: pick *one* unit per Switch exit into a `UnitToSpawn` (`PDA_Unit`) variable, then use one shared Spawn node.
  - A wildcard node (Select) locks its type from the first wire. Retyping the variables later doesn't unlock it.
  - **"Next item" pattern:** one counter per side (`HeroesSpawned`, `EnemiesSpawned`) plus `IsValidIndex` before GET, instead of a nested For Each, which would spawn every hero in every hero Area.
  - `CurrentHealth` is a **copy** of `BaseMaxHealth`, because both Ghouls share one DA.
  - **Uniform vs vest:** the permanent look comes from data, and selection is a temporary change on top. An overlay material can only add light (Additive) or cover (Translucent). It can't see the colour below it, so it can't saturate.
  - **Desaturation with a negative fraction** pushes colour *away* from grey, which makes it more saturated. Driven by a `SelectedGlow` scalar parameter.
  - **MI vs DMI:** an MI's values are fixed while the game runs. A Dynamic Material Instance is a private runtime copy that one unit can change with Set Scalar Parameter Value.
- **Tripped up:**
  - The Select node over two differently-typed arrays.
  - `PaintSelection` passed the unit's own `UnitState`, which nothing ever set, so selection always painted Regular (the #60 "second copy" trap again).
  - There are two nodes called *Create Dynamic Material Instance*. Picked the global one (Parent, no Target) instead of the component one (Target is Primitive Component). Drag from the component to get the right one.
  - Overlay tried both ways (brighter, then darker) before finding saturation needs the base material.

**2026-10-21 · M3-T4 · Gameplay Tags (identity only)** ✅
- **Learned:**
  - A **Gameplay Tag** is a label in a tree (`Unit.Hero.Warrior`), picked from a dropdown, so a typo can't make a new tag. It's stored in `Config/DefaultGameplayTags.ini`, which is a text file, so Git shows tag changes line by line.
  - **Matches Tag** counts a child as its parent (`Unit.Hero.Warrior` matches `Unit.Hero`). **Matches Tag Exact** only counts the identical tag.
  - **Enum vs tag:** an enum is one choice from a fixed list and has a Switch node. A tag carries a family tree, and a **Tag Container** can hold several at once. Statuses (Bleed + Buffed together) are where tags pay off (M5).
  - `GetDebugStringFromGameplayTag` turns a tag into a String for Print. All five spawned units printed the right tag in PIE.
- **Tripped up:**
  - Renaming tags in the Project Settings tag tree left 8 **tag redirects** in the `.ini` (`Unit.Hero.Unit.Hero.Warrior_` → …, one pointing to itself). Nothing uses those old names.
  - Thought the task wanted option A (tag replaces `E_Team`). It only asked for a choice, and B was fine.
  - Thought tags had been added to the roadmap late. They were in M3 from the first draft. Only the "tag the units" wording was new.

**2026-10-21 · M3-T5 · Soft vs hard references** ✅
- **Learned:**
  - A **hard reference** loads its target whenever the holder loads. A **soft reference** stores only a path and loads nothing until asked. Switched `PDA_Unit.StaticMesh`/`Material` to soft; the four DAs kept their values.
  - **Async Load Asset** has two exits: **then** fires immediately with nothing loaded, **Completed** fires on a later frame. BeginPlay itself still ends in one frame; the game keeps drawing (with the component's default grey cube) instead of freezing. **Load Asset Blocking** is the freezing version (a hitch).
  - **Latent nodes** (clock icon) only work in the Event Graph, so the look moved from the Construction Script to BeginPlay.
  - Completed hands back a plain Object, so it needs a Cast (StaticMesh, MaterialInterface). The DMI must be made after the material arrives.
  - Reference Viewer filters show the DA's mesh and material as soft only.
- **Tripped up:**
  - PIE stopped working once the variables were soft, because the Construction Script still fed them to Set Static Mesh. First tried the wrong pins, then hit a compile error until the code moved to BeginPlay with Async Load Asset.
  - Size Map showed no difference: `BP_Unit`'s `Cube` component still hard-references the engine Cube, and the assets are tiny and already loaded in the editor.

**2026-10-24 · M3-T6 · See the data in play** ✅
- **Learned:**
  - A **Widget Blueprint** is the layout + logic of one piece of UI; a **Widget Component** puts it on an actor. Inside the widget, **Self is the widget**, so Cast Self To `BP_Unit` can never succeed.
  - **Push, not pull:** `BP_Unit`'s BeginPlay does Get Widget → Cast To `WBP_HealthBar` → `SetUnitInfo`. Property bindings and Tick both re-ask every frame for values that don't change. An Event Dispatcher isn't needed while one owner talks to one widget.
  - Ticking **Is Variable** on a widget makes the member variable for you. A function that should change the screen must **Set** (Set Text, Set Percent), not just Return values.
  - **Space = Screen** + **Draw at Desired Size**: the label always faces the camera and sizes itself to its contents. No rotation logic. A Canvas Panel has no desired size, so it's for full-screen HUDs.
  - Convert Int → Float **before** dividing for the bar's Percent (integer division would give 0).
- **Tripped up:**
  - Cast Self To `BP_Unit` inside the widget (the orange WARNING on the Cast).
  - Tried to aim a World-space widget at the camera with `Get Actor Of Class` + Find Look at Rotation on Tick, rotating `HealthBarComponent` but measuring from `Plane`.
  - `SetUnitInfo` first returned its values instead of setting the widgets.
  - Deleting `GetText`/`GetPercent` left two dangling bindings, so the widget wouldn't compile until Remove Binding.
  - The component was scaled 0.07/0.4/0.07, which squashed the World-space card; reset to 1 once it moved to Screen space.

**2026-10-24 · M4-T1 · The battle clock** ✅
- **Learned:**
  - **Float precision**: 0.1 can't be stored exactly in a float, so time is kept in whole tenths (Int). Seconds only appear on screen.
  - **Game State** = the shared current situation. The Game Mode creates it from **Game State Class**, and a GameModeBase needs a GameState**Base**.
  - **Cast** in plain words: Get Game State only promises "some Game State", and the Cast checks "are you *my* `BP_BattleGameState`?" before you can read `CurrentTimeTenths`. **Self** is just the Blueprint you're in.
  - **Create Widget already returns the typed `WBP_`**, so it needs no Get Widget or Cast. Those were only needed for the Widget Component in M3-T6.
  - **UMG Designer**: panels vs widgets, **Slot** = the parent's rules for a child, Border for a background, Brush Image Size vs font size, DPI scaling makes the small Play viewport look smaller than the Designer.
  - Int → **To Float** before ÷ 10, then To Text (Float) with 1 min/max fractional digit and Format Text `{Time}s`.
  - Reasoned out on your own that the "time moved" dispatcher belongs on the Game State (the one who announces), with the widget as a listener.
- **Tripped up:**
  - First name idea `ClockIncrement` described the step size, not the running total. Renamed to `CurrentTimeTenths`.
  - Copied the M3 health-bar pattern (`Widget` → Get Widget → Cast To `WBP_BattleClock`) into the controller, and fed **Self** into Cast To `BP_BattleGameState` (the orange WARNING).
  - The Overlay had no colour of its own, and a bigger font didn't make the icon bigger.
  - Started the dispatcher early, on the controller. Parked for T2.

**2026-10-24 · M4-T2 · Actions cost time** ✅
- **Learned:**
  - Reasoned out (L0) that one Game State function should be the only way to change the time: **one owner, one way in**.
  - **Dispatcher, both ends**: **Call** shouts (inside `AdvanceClock`), **Bind** signs up (in the widget). The shouter doesn't bind to itself.
  - **Dispatcher inputs** are added in the dispatcher's Details → Inputs, and the SET node's output pin is the fresh value to send.
  - A dispatcher only shows in the right-click menu when you drag from a pin of the owner's type, so the widget first needs Get Game State → Cast.
  - **Event Construct** = a widget's BeginPlay.
  - Only a successful move costs time (the call sits on the success path).
- **Tripped up:**
  - The Game State first bound to its own dispatcher with an empty event (shouter listening to itself).
  - Couldn't find the dispatcher inside the widget (no typed Game State reference yet).
  - Function and dispatcher names first said "Update", which doesn't say *add*. Renamed to `AdvanceClock` / `OnClockAdvanced`.
  - (Claude's slip) The MCP text view looked like the widget was created only when there's a camera. Both branches actually join, so that T1 leftover was already fine.

**2026-10-25 · M4-T3 · Enemies on the timeline** ✅
- **Learned:**
  - Applied the M3 rule "different fields → a child class" to actors: `BP_EnemyUnit` under `BP_Unit`. **Call to Parent Function** keeps the parent's BeginPlay (look, HP) running in the child.
  - A cast can't separate heroes from enemies when both are `BP_Unit`s. The controller already knows the player acted, so the clock call moved there.
  - **Spawn Actor's extra pins come from the type of the Class wire.** A wildcard Select made it "any Actor" and the pins vanished; a `BP_Unit` **Class Reference** brought them back.
  - Collapsed the spawn branches into a `SpawnUnit` function with local variables.
  - Designed the enemy clock yourself in Miro: absolute due time, `<=`, reschedule from the old due time. The log proved it exact: with 1s moves and a 2.5s action, attacks at 3s, 5s, 8s, 10s.
  - An actor binds to a dispatcher exactly like a widget does, just in BeginPlay.
- **Tripped up:**
  - First warm-up: a Switch on `Team` inside `BP_Unit.MoveToArea`; its Enemy exit had no Return node, so an enemy's move would have returned false.
  - Considered casting to tell heroes from enemies.
  - Wrong wires after the spawn change made the heroes disappear for a while.
  - Couldn't find `OnClockAdvanced` in `BP_EnemyUnit` until the Cast (same lesson as T2).
  - `OnClockTick` re-reads the clock through a second cast instead of using its `NewTimeTenths` pin.
  - (Claude's slip) MCP read the `IA_Select` event as empty, so Claude reported the `AdvanceClock` call missing. It was there.

**2026-10-25 · M4-T4 · Land in order** ✅
- **Learned:**
  - Designed the **battle queue** yourself in Miro: one referee finds the earliest enemy, resolves it, and asks again until nobody is due. That one loop fixes both "two attacks in one jump" and "bind order instead of time order".
  - **"Due at" beats "time until"**: a due time stays true while the clock moves (train timetable: "departs *at* 14:30"); time left is one subtraction when the UI needs it.
  - **Running minimum** (the "note in your hand" pattern) for `FindEarliestAttacker`, including the trap: a note starting at 0 never gets written, so index 0 always goes on it.
  - **Functions run in one frame and can't wait; events can.** So the repeat is a custom event that calls itself as its last step, not a While Loop, ready to wait for animations later.
  - **Referee vs scoreboard**: the Game Mode decides what happens next (the queue); the Game State holds the clock everyone reads.
  - Keep a function that returns two answers **impure**: a pure node re-runs for every output pin read.
  - Catch designer mistakes in the data (Value Range Min = 1) instead of cluttering the logic.
  - Tested with a 10s jump and checked the log against a written-down expected order.
- **Tripped up:**
  - Made the attack assets as **child Blueprint classes** of `PDA_EnemyAttack`, so the `AttackSet` picker showed nothing. Data Assets are made via Miscellaneous → Data Asset.
  - Thought `DA_Ghoul` had no `AttackSet`. Every DA has every field of its PDA; it was just empty.
  - Wanted to store `TimeUntilAttack` and update every enemy after each jump.
  - First `FindLowest` compared `due − clock` but stored plain `due`, mixing two kinds of number; then it fell into the start-at-0 trap.
  - `ResolveAttack` first set `CurrentAttack` to None, which only worked because the old `OnClockTick` refilled it right after.
  - Unsure how to build the repeat with a While Loop (the answer: don't, use a self-calling event).

**2026-10-26 · M4-T5 · Enemy intent label** ✅
- **Learned:**
  - Questioned the plan: chose a label above each enemy over a HUD list, and sketched a better HUD timeline (proportional bar, icons, hover) for later.
  - UMG layout: **Overlay** to stack text on the bar, **Size Box** overrides in pixels, why **Render Transform** is the wrong tool for size.
  - Widget inheritance: a child Widget Blueprint can't add widgets of its own; the parent leaves a **Named Slot**.
  - Changing an inherited component's Widget Class is a Details setting, not an Event Graph override.
  - Two listeners on one dispatcher have no order you control, so the update goes into the Game Mode's chain, right after the attacks resolve.
  - Thought ahead to animations: one attack plays, then the next, so labels update after every attack. Added a Delay as a stand-in and spotted that input isn't blocked meanwhile.
  - **Clamp** at 0 so a waiting attack reads "0.0s" (your UX call). Format Text for "{Attack} | {Time}s".
  - Checked the labels against the log at three clock times.
- **Tripped up:**
  - Typed 1.1 into Height Override as if it were a scale (it's pixels) and kept the Render Transform, so nothing seemed to change.
  - Read "override a part of the parent" as needing an Event Graph change.
  - Named only the Is Not Valid exit as "nothing due"; the usual one is the Branch False.
  - Couldn't put content into the Named Slot from the child, so `IntentText` sits in the parent and heroes showed "Text Block" until you hid it. (Partly Claude's wording: "put a Text in `IntentSlot`" didn't say *in the child*.)
  - Saved the child widget in the Content root first.

**2026-10-28 · M4-T6 · Debugging pass** ✅
- **Learned:**
  - Predict first, then test: wrote down what two overlapping clicks would do before opening any tool, and let the tools say who was right.
  - **Print as breadcrumbs:** `ENTER` / `AFTER delay` lines with the event input, the shared variable and **Get Game Time in Seconds**, read in the **Output Log**. Counting lines (two ENTERs, one AFTER) showed the second chain was dropped, not queued.
  - **Breakpoints:** F9 to set, F10 Step Over, F5 Resume. Stepping over chain B's Delay landed on chain A's wake-up 2s later, which shows chain B had no next node. Saw a dispatcher broadcast hand control to the next listener (`WBP_BattleClock`) once the Game Mode's chain paused.
  - **Visual Logger:** recording, one row per actor, same-frame entries stacked, reading the spacing against the grid (1 line ≈ 1s). Attacks 1.2s apart instead of 2s, and no wake-up mark for the dead chain.
  - Why the bug looked fine: two bugs cancel out. Chain B dies on the busy Delay, but chain A picks up B's clock time from the shared variable and finishes B's work. Only the missing gap and the stale labels show.
  - The limit is **one Delay node per object = one timer**, not "one Game Mode = one task": two chains did run inside one Game Mode.
  - Format Text gaps go in `{}`: `ENTER in={In} var={Var} t={T}` grows three pins.
- **Tripped up:**
  - Typed `{ENTER in=` into Format Text, which makes the whole label one unclosed gap.
  - Hovered a getter that hadn't run yet and read 0; the debugger shows a pure node's last computed value.
  - Step Over walked into the For Each Loop **macro**'s inner nodes (Step Out or F5 gets back).
  - First prediction: the second click's chain is queued and the whole chain runs again. The log had no second `AFTER delay`, so it was dropped instead.
  - Asked whether the task was worth doing at all; settled on doing all of it.

**2026-10-28 · M5-T1 · Health and damage** ✅
- **Learned:**
  - **Actor Component**: built `BPC_Health`, added it to `BP_Unit`, and moved HP and its math into it. Healing can reuse the clamp later.
  - **Construction Script timing**: components already exist there and `UnitData` is set at spawn, so `InitHealth` belongs there; the widget doesn't exist yet, so it can't be touched there.
  - **Bind only hears the future**: worked out yourself why the label stayed blank (the broadcast from the Construction Script came before BeginPlay's Bind); fixed by calling the handler once after binding.
  - **Interface vs dispatcher**: an order going in (`ReceiveDamage`) vs news going out (`OnHealthChanged`, `OnDied`). The **(Message)** node works on any Actor.
  - **Who owns what**: the component says "HP is 0", the unit reports and destroys itself, the Game Mode decides what a death means per team.
  - Rosters are spawn recipes; `EnemyQueue` is the living enemies.
- **Tripped up:**
  - Deleted the Get Widget → Cast chain while rewiring, so `HealthBarWidget` was empty (Accessed None in the log).
  - Cast to `WBP_HealthBarEnemy` in `BP_Unit`: heroes failed the cast. Shared code casts to the shared parent.
  - Added the interface but not its event on `BP_Unit`, so the message had nothing behind it.
  - Gave the component's function and the interface message the same name (`ReceiveDamage`), which doubled the entries in the node menu.
  - First death version: `Destroy Actor` first and `Unit to Remove` unwired, so nothing left the queue.
  - Questioned why the interface is needed at all (a fair question; answered in Decisions #122).

**2026-10-28 · M5-T2 · Ability data** ✅
- **Learned:**
  - **Data vs state**: a Data Asset holds what a designer types in and is shared by everyone who points at it, so it's never Set during play. A live number (current cost, Strains) lives on the unit. You reached the "keep the reference, store only what changes" idea yourself.
  - **Min/Max pairs** describe ranges cleanly: `MinRange`/`MaxRange` cover 0–0 (own Area) and 1–3 (Shot) with no special cases. Your idea.
  - **Targeting vs effects**: "who do I click" and "what happens" are separate questions. That's why a "self" Boolean waits until Shield Wall.
  - **Value Range Min as a guard rail** on data fields (cost ≥ 1, ranges and damage ≥ 0), the same as #108.
  - **Designing in tenths**: integer time from #91 carried into ability data (`BaseCostTenths`).
  - **Moving a design between games**: your mana "spell exhaustion" model became Strain stacks. A simulation showed that, because the cost *is* time, a fixed 5s fade barely escalates expensive abilities, so the fade became per ability. You also found that stepping "every second" is a symptom of ticking, and working it out on demand removes it.
- **Tripped up:**
  - The first pass left `AbilitySet` empty on both hero DAs. The abilities existed but no hero owned them.
  - Renamed `IsAOE` to `bIsAOE` instead of removing it (fixed on the second pass).
  - The original strain doc's tables rounded to nearest while the text said "round up". Pick one rule and write it next to the formula.

**2026-10-30 · M5-T3 · Ability bar** ✅
- **Learned:**
  - **Widgets inside widgets**: one `WBP_AbilityButton` built once, placed 5 times in `WBP_AbilityBar`. Five fixed slots match "5 abilities per hero" (GDO), so no widgets are created at runtime.
  - **Owning data vs owning the screen**: the hero (its DA) owns the abilities; the controller owns the bar. Your instinct "the bar is HUD, but the data is the unit's" was both right.
  - **One way in**: `ChangeSelectedUnit` and `UpdateSelectedAbility` are the only writers of their variables, so each can announce every change with a dispatcher (the `AdvanceClock` pattern again).
  - **Direct call vs interface vs dispatcher**: phone your manager (one known receiver: the slot calls the controller), "anyone with first aid?" (unknown type: `BPI_Damageable`), a PA announcement (unknown listeners: the slots and the bar).
  - **One loop for every case**: hero, enemy and nothing all go through the same For Loop; an empty list blanks every slot. **For Loop** counts numbers; **Is Valid Index** asks "is there an item N?" *before* Get.
  - **Output pins keep their last value**: a Cast's or Set's output pin is a snapshot from the last time that node ran. A path that skips the node still reads the old snapshot. Read the variable instead.
  - **Local vs normal variables**: a local variable is wiped when its function ends, so it can't remember "last time".
  - **State, not history**: the toggle compares the click with the *current* `SelectedAbility` (a light switch looks at the lamp), and the dispatcher announces the resulting state. Slots paint from that alone, with no memory of their own.
  - **Set Background Color** tints the button tile; **Set Color and Opacity** tints its content.
- **Tripped up:**
  - The slot's SET ran only on the valid branch, so a blanked slot kept its old ability.
  - Reading `Unit Data` from an empty `NewUnit` → Accessed None.
  - Stale output pins twice: the Cast's, then the Set node's, fed the loop after deselecting.
  - Is Valid *after* Get (too late for the warning), then both Branch exits wired into the same node.
  - `RecentlySelectedButton` as a local variable; a Branch with True/False swapped; a SET instead of a GET in On Clicked; `ChangeSelectedUnit` re-passing the old ability and missing a Return Node on one path.
  - A toggle based on "the last click" breaks on the third click; the fix is comparing with the current state.

**2026-10-31 · M5-T4 (step) · Range highlight** ✅
- **Learned:**
  - **Distance on a graph** with breadth-first search, returned as a **Map** (Area → steps), and **In Range** to filter it by `MinRange..MaxRange`.
  - **Material Instances** for looks: one `M_Area` with a colour parameter, one MI per look.
  - **Undo before you change**: a depaint reads the *current* selection, so it has to run while that selection is still the old one. Your fix moved the depaint to the start of every entry point.
  - **Entry point vs step**: painting belongs to whatever starts the action (click, button), not to a function used inside a bigger change. `UpdateSelectedAbility` painting mid hero-switch is what repainted the old hero's Area.
  - **A dispatcher call is synchronous**: listeners run right away, then the caller carries on.
  - **For Each over an empty array** simply runs zero times; no Is Valid / `Get[0]` check needed (and `Get[0]` on an empty array logs a warning).
  - **Reading your own graph as a system**: renaming, commenting and deleting redundant nodes made the next bug findable.
- **Tripped up:**
  - The depaint loop set each recorded Area to **InRange** instead of Normal, so "clearing" repainted purple; fixed once, then lost during a cleanup pass.
  - `Clear` + `Return` wired on the loop's **Loop Body** instead of **Completed**, so only the first Area reset.
  - Depaint gated on `SelectedArea` after deselect had already set it to None.
  - In Range Min/Max swapped.
  - Painting inside a state-change function (`UpdateSelectedAbility`) ran while the hero switch was half done.
  - Many bugs at once in one review was overwhelming; one fix + one test at a time worked better.
