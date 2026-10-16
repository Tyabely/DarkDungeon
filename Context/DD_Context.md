### Intro

The purpose of this project is to create a small UE5 game, primarily for learning purposes. The goal can be weighted the following way: 50% learning UE5, 25% having a portfolio piece, 25% creating an enjoyable game that can be further developed. Having that in mind, I would like you to do both research and think-through what is the best way you can support me in achieving this goal and write it down in this file. The initial idea is to just use UE5 MCP, you have access to all files, but you can’t do anything on your own \- everything needs to be done by me, manually. Rather than giving me the answer, try to teach. When asked for something specific, if it’s feasible, give a hint/just a gist. If not, provide just a concrete answer to that problem, rather than the entire architecture. We aim to maintain balance between AAA quality-code & scalability vs. “if it works, it works approach”. Stuff in [GDO.md](http://GDO.md) can be a subject of change in terms of game design though, so staying open-ended is definitely something we need to watch out for. Doing mistakes or “wasting time” here is fine, as long as it's beneficial to the learning process. 

---

### 1. Learner Profile *(fill in / confirm)*

| Topic | Status |
|---|---|
| General programming experience | Mostly visual scripting, little to no text coding. **Assume zero knowledge** ✅ |
| UE experience (editor / Blueprints / C++) | Some UE Blueprints (tutorials / small projects, knows the editor basics) ✅ |
| UE version | **5.8** ✅ (freeze it for the whole project, no mid-project engine upgrades) |
| Time budget | ~6–10 h / week ✅ |
| Target for MVP | No deadline ✅ (rough expectation: MVP in ~2–3 months) |
| Version control | Git + Git LFS, **public** GitHub repo [Tyabely/DarkDungeon](https://github.com/Tyabely/DarkDungeon), managed in GitKraken ✅ |
| Project location | Repo root `F:\P_UE5\DarkDungeon` (holds `Context/`, `README.md`, `.gitattributes`); Unreal project in `F:\P_UE5\DarkDungeon\DarkDungeon_Project\` (its own `.gitignore` lives there) ✅ |

---

### 2. How Claude supports this project (the "mentor contract")

**Roles.** You are the developer, I'm the mentor / senior reviewer. I don't implement — I explain, hint, review, and keep the docs in shape. If I ever drift into "here's the whole system", call it out.

**How I explain things (the "no shortcuts" rule) ✅.** Assume zero coding knowledge. Claude tends to compress explanations and assume background knowledge. That's banned here:
- **Every new term gets defined the first time it shows up**, in plain words plus a concrete example from *this* game. (Not "use an Event Dispatcher" but "an Event Dispatcher is a 'shout': one Blueprint shouts 'enemy died!', and anyone who signed up to listen reacts. The Blueprint that shouts doesn't need to know who's listening.")
- **Say *why* before *how*.** Every concept comes with the problem it solves, ideally a problem you've already hit.
- **One new idea at a time.** If a task needs three new concepts, it gets split.
- **No unexplained abbreviations or jargon.** If you see a word you don't know, that's my mistake, not yours. Say "define X" and I will.
- Terms get collected in the **Glossary** (§6) as we go, so you can come back to them.
- The hint ladder below still applies. "Simple language" doesn't mean "giving the answer away".

**The Hint Ladder.** When you ask for help, I start at the lowest useful level and climb only when you ask ("next hint" / "just tell me"):

| Level | What you get | Example ("how do I know which enemy action lands next?") |
|---|---|---|
| **L0 – Nudge** | A question back or the concept name to look up | "What data would you need to sort to know who acts next?" |
| **L1 – Gist** | The approach in 1–3 sentences, plus which UE features fit | "Each pending action stores the clock time it lands at; the smallest one is next. Look at `Min of Float Array`." |
| **L2 – Shape** | Step list / node list / pseudo-code, no wiring done for you | "1) On combat start, fill array… 2) Function `GetNextActor`… 3) …" |
| **L3 – Answer** | Concrete answer to *that* problem only | Exact node chain or code snippet for that one function |

Exceptions where I go straight to L3: engine quirks / gotchas that teach nothing (e.g. a checkbox buried in Project Settings), crash or build errors, tooling setup.

**Quality bar — where to be "AAA" and where "if it works, it works":**

| Invest properly (scalability matters) | Hack freely (placeholder is fine) |
|---|---|
| Combat rules separated from presentation (logic doesn't care about meshes/animations) | UI layout & look |
| Data-driven content: heroes, abilities, enemies defined in data, not hard-coded | VFX, juice, camera polish |
| The Time/turn system (it's the core identity of the game) | Level art, map visuals |
| Clear ownership: who owns combat state, who talks to whom (events vs direct calls) | Menus, save/load (until needed) |
| Naming conventions & folder structure from day 1 | One-off debug tools |

Rule of thumb: *if it will be copied 5+ times (abilities, enemies) or everything depends on it (turn order) — design it. Otherwise ship it.*

**"AAA" in a Blueprint-only project** means: logic lives in Functions (not giant Event Graphs), Interfaces and Event Dispatchers replace cast chains, content lives in Data Assets / Data Tables, Gameplay Tags replace magic strings/enums where things grow, and graphs stay readable (reroute nodes, comments, collapsed functions). Messy BP is the #1 thing reviewers notice in a portfolio.

---

### 3. Workflow

**Per feature / task loop:**
1. **Brief** — I describe the goal, the UE concepts involved, and "done when…" criteria. No solution.
2. **Plan (yours)** — you sketch how you'd do it (a few bullet points). I comment on the plan *before* you build. Cheap mistakes here, expensive later.
3. **Build** — you implement. Use the hint ladder when stuck.
4. **Review** — you show me the result (see channels below). I review like a senior would: what's good, what will hurt later, what's fine to leave.
5. **Log** — one or two lines into the Learning Log + Decision Log (below). This is also portfolio material.

**Review channels (how I see your work):**
- **Copy-pasted Blueprint nodes** — select nodes in a BP graph, `Ctrl+C`, paste into chat. UE copies them as text (T3D), which I can read precisely. *This is the best channel for BP review.*
- **Screenshots** of graphs, Details panels, the viewport, or PIE.
- **Output Log / Message Log** text for errors and warnings.
- **The project files** — I can read folder structure, `.ini` configs, C++ source, and these docs. `.uasset` files are binary, so I can't read Blueprints from disk.
- **UE MCP (read-only by agreement)** — see below.

**UE MCP: decided ✅ (UE 5.8, read-only by agreement)**

Research summary (Oct 2026):
- **UE 5.8 ships Epic's own MCP server**: the *Unreal MCP* plugin (internal id `ModelContextProtocol`), marked **Experimental**. It runs inside the editor at `http://127.0.0.1:8000/mcp`, local-only, no auth.
- **Epic's GitHub repo [`EpicGames/unreal-engine-skills-for-claude-code-plugin`](https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin)** is most likely the "better setup" repo. It's a Claude Code plugin that adds an `unreal-mcp` skill (workflows/conventions for driving the editor) plus a SessionStart hook that tells Claude it's in a UE project. It sits **on top of** Epic's in-editor MCP server rather than replacing it.
- Third-party servers ([ChiR24/Unreal_mcp](https://github.com/ChiR24/Unreal_mcp), [Unreal-MCP-Ultra](https://github.com/hoodtronik/Unreal-MCP-Ultra), [ClaudeUnrealMCP](https://github.com/AgustinJimenez/ClaudeUnrealMCP), VibeUE) predate 5.8. Their main edge is **reading Blueprint graphs back** (e.g. `describe_graph`, `read_event_graph`), which reviews say Epic's first release does only in a limited way. Downside: many ship C++ plugins with prebuilt binaries per engine version. On 5.8 you may have to compile them, which needs Visual Studio even in a BP-only project.

Setup plan (M0 task, done by you):
1. Edit → Plugins: enable **Unreal MCP (ModelContextProtocol)** and **AllToolsets**. Without AllToolsets, no tools are exposed. Restart.
2. Editor Preferences → Model Context Protocol → auto-start on (or console: `ModelContextProtocol.StartServer`).
3. Console: `ModelContextProtocol.GenerateClientConfig ClaudeCode`. This writes the `.mcp.json` into the project root.
4. In Claude Code: `/plugin install unreal-engine-skills-for-claude-code@claude-plugins-official` (if the marketplace is missing, add `anthropics/claude-plugins-official` first). The hook needs bash on PATH; Git for Windows covers that.
5. Claude Code runs from the **repo root** (`F:\P_UE5\DarkDungeon`) so it sees both the docs and the project. The editor generates `.mcp.json` inside `DarkDungeon_Project\`; move or copy it to the repo root (it only holds the local server address). Verify with `/mcp`.
6. First real check: ask me to list the toolsets (`list_toolsets` / `describe_toolset`) and see **whether a Blueprint graph read tool exists**. If it doesn't, Ctrl+C node paste stays the main BP review channel. Add a third-party reader only if that gets painful.
   → **Done 2026-10-14:** ~50 toolsets / ~830 functions. A Blueprint graph reader exists: `BlueprintTools.read_graph_dsl` returns a graph as text. Ctrl+C paste stays as the fallback.

Rules of use:
- I only call **read/inspect** tools: list assets/actors, read properties, read logs, describe graphs.
- I never call create/modify/delete tools, and never `execute_tool_script` (it runs arbitrary Python).
- Enforce it, don't just trust it. ✅ Done with a **hook** rather than a `deny` list. All ~830 editor functions go through one Claude Code tool (`call_tool`), and deny rules can only see tool names, so they can't tell a read from a write. The hook (`.claude/hooks/unreal-mcp-guard.js`) checks each function name and only lets reads through. A second hook blocks shell commands that would talk to the editor's port 8000 directly. See `DD_Decisions.md`.
- Commit before sessions where I inspect via MCP (experimental plugin = keep a rollback point).

**Living docs:**
- `CLAUDE.md` (repo root) — short briefing Claude Code loads automatically at the start of every session: roles, where the docs are, and the session protocol.
- `DD_Context.md` — this file: how we work, learner profile, roadmap + **Current focus** (§4).
- `DD_GDO.md` — game design. Expected to change; changes are cheap.
- `DD_Conventions.md` — folders, naming, Blueprint style, Git rules. Quick reference.
- `DD_LearningLog.md` — date · what I learned · what tripped me up. Short.
- `DD_Decisions.md` — lightweight decision records: "Decided X over Y because Z". Shows engineering thinking in a portfolio.

**Sessions & doc upkeep:**
- **One task per session.** Name the session after it (e.g. "M1-T3 mouse picking").
- **You say "done"; Claude checks it, then updates the docs.** The steps are in `CLAUDE.md`: verify the "done when" criteria, then tick Current focus and add the Learning Log, Decisions and Glossary entries. You never have to ask "update the file".
- **"Wrap up"** ends a session mid-task. Progress gets recorded and a "next session starts with…" note is left.
- Then you commit (Claude suggests the message) and push.
- Prefer a new session over `/compact` at task boundaries. Mid-task, `/compact` with a note on what to keep.

---

### 4. Learning Roadmap (draft — tied to the MVP)

Each milestone has a playable result and a set of UE concepts it teaches. Order is chosen so each step builds on the previous one.

#### ▶ Current focus
*Claude updates this block whenever you say a task is done (after checking it). You only report "done".*

**M2 – Pieces on the Board** · ⬜ next. Goal: 2 hero placeholders + 2 enemy placeholders stand in Areas, and an Area never holds more units than its capacity.
*(Draft task list, written when M1 closed. Change it freely in the first M2 session.)*

- [ ] **T1 – Area data.** Each Area knows how many units fit and whether it's a spawn spot.
  *Done when:* `BP_Area` has an Instance Editable integer `Capacity` and an Instance Editable **enum** `SpawnSide` (`E_SpawnSide`: None / Hero / Enemy, in `Board/`); every Area in the room has sensible values (GDO §3), with at least 2 Hero and 2 Enemy spawn slots in total.
- [ ] **T2 – `BP_Unit` placeholder.** One reusable "piece".
  *Done when:* `BP_Unit` (new `Units/` folder) has a simple visible mesh, an Instance Editable `Team` enum (`E_Team`: Hero / Enemy) that changes its colour (Construction Script), and a `CurrentArea` (`BP_Area` reference) variable; a hero and an enemy placed by hand look different.
- [ ] **T3 – Spawn at battle start.** The Game Mode deploys the pieces.
  *Done when:* on BeginPlay, `BP_BattleGameMode` finds the spawn Areas and uses **Spawn Actor from Class** to create 2 heroes in Hero Areas and 2 enemies in Enemy Areas; nothing is placed by hand any more; each unit's `CurrentArea` is set.
- [ ] **T4 – Occupancy & capacity.** Areas know who stands in them.
  *Done when:* `BP_Area` keeps an **array** of the units in it, with functions to add/remove a unit that refuse when it's full (returns success yes/no); units in the same Area stand side by side, not inside each other; trying to over-fill an Area prints a clear message.
- [ ] **T5 – Neighbours.** Which Areas share an edge (GDO §3).
  *Done when:* each `BP_Area` has an array of neighbour Areas (filled by hand in the level, or worked out from positions; your choice, recorded as a Decision); selecting an Area also tints its neighbours in a second look, so you can check the map by clicking.
- [ ] **T6 – Move a hero by clicking.** Capacity matters in play.
  *Done when:* click a hero to select it, click an Area to move it there; the move is refused when the Area is full; the old Area's list and the new one's are both updated. Units must not block Area picking any more (Decisions #29: custom trace channel, or another way you choose).

**Next session starts with:** M2-T1. Before it, the small T7 cleanup (optional, ~10 min, recommended before T5/T6 lean on the selection):
- The Is Not Valid branch turns the old Area off but doesn't empty `MostRecentlyHitArea`, so after clicking empty space the controller still "remembers" an Area nothing shows as selected. Harmless now; wrong as soon as anything asks "what's selected?". Clear it there, and rename the variable to `SelectedArea`, which is then exactly what it holds.
- The three Cast To BP_Area nodes on `BP_Area`-typed variables only act as "is it empty?" checks. Use Is Valid / a Validated Get.
- Names per Conventions: `MI_HighlightedInner` → `MI_Area_Highlighted`, `M_WhiteInner` → `M_Area` (or add `MI_Area_Default` and swap MI ↔ MI), `IsHIghlighted` → `bIsHighlighted`.

Older optional leftovers: T6, the Append's "Hit:" has no trailing space and the function's output pin `HitActor` could be `Area`; T3, labels skip `Area_3` and aren't zero-padded, `TopCube` Z = 100 has no note; T4, camera X (385) is ~65 cm off the room's centre (~320) and the near row sits close to the frame's bottom edge.

**Last finished:** M1-T7 Highlight ✅ (2026-10-16), which closes **M1 – The Board** ✅. M1's task list and "built as" notes live in git history (`M1-T6` commit) and in Decisions #11–#35.

#### Milestones

| # | Milestone | Status | Playable result | UE concepts learned |
|---|---|---|---|---|
| M0 | **Setup** | ✅ 2026-10-14 | Empty UE 5.8 project in version control, folders & naming set, MCP connected (read-only) | Project creation, plugins, Git LFS + `.gitignore`, folder/naming conventions, editor preferences & console commands |
| M1 | **The Board** | ✅ 2026-10-16 | Fixed room of rectangle Areas visible from a top-down camera; click an Area to highlight it | Actors vs Components, Blueprint classes, construction script, collision/traces for mouse picking, Player Controller, camera |
| M2 | **Pieces on the Board** | ⬜ | 2 hero placeholders + 2 enemy placeholders placed in Areas; Area capacity respected | Spawning, references between actors, arrays/maps, enums, structs, Area adjacency (graph basics) |
| M3 | **Data-driven Units** | ⬜ | Heroes/enemies built from data (stats, abilities) instead of hard-coded values | Primary Data Assets / Data Tables, Gameplay Tags, soft vs hard references |
| M4 | **The Time System** | ⬜ | Timeline UI shows upcoming enemy actions; the clock advances by the cost of your action and enemy actions land in order | Game Mode / Game State ownership, Event Dispatchers, functions vs events, debugging (breakpoints, Print, Visual Logger) |
| M5 | **Abilities** | ⬜ | Either hero can pick an ability, pick a target Area, deal ranged damage (e.g. 80–110); escalating costs work | Ability architecture (objects/components), interfaces, targeting, UMG basics (buttons, bindings vs events) |
| M6 | **Enemy AI** | ⬜ | Enemies telegraph & execute intents ("3.5 ⏳ Move + Attack") | Simple decision logic in BP (no Behavior Trees needed), reuse of the ability system |
| M7 | **Win / Lose & Loop** | ⬜ | Battle ends, restart / next battle | Level/state flow, Game Instance, basic save data |
| M8 | **Portfolio pass** | ⬜ | Short trailer/GIF, readme, docs cleanup | Sequencer basics (optional), packaging a build |

Status: ⬜ not started · 🔄 in progress · ✅ done (checked by Claude)

Stretch / post-MVP learning tracks: procedural map generation, Common UI, animation & VFX, Enhanced Input deep-dive, profiling (Insights). C++ and GAS are out of scope by decision (GAS effectively needs C++ for Attribute Sets).

---

### 5. Open Questions (setup / process)

- ~~Experience level~~ → some UE Blueprints, mostly visual scripting, assume zero coding knowledge ✅
- ~~Blueprint-only, or Blueprint + C++?~~ → **Blueprints only** ✅
- ~~UE version / VCS~~ → 5.8, Git + LFS on GitHub ✅
- ~~MCP~~ → Epic Unreal MCP + Epic Claude Code skills plugin, read-only ✅ (setup in M0).
- ~~Pace~~ → 6–10 h/week, no deadline ✅

---

### 6. Glossary (grows as we go)

Plain-language definitions of every term used in these docs. When a new one comes up in a session, it gets added here.

**Project & tools**
- **Git**: a tool that saves "snapshots" (commits) of the whole project, so you can always go back to a version that worked.
- **Git LFS** (Large File Storage): an add-on for Git. UE files (`.uasset`, `.umap`) are big binary files that Git handles badly; LFS stores them separately so the repo stays fast.
- **`.gitignore`**: a list of files Git should *not* save. Things UE can regenerate itself, like `Intermediate/`, `Saved/`, `DerivedDataCache/`.
- **MCP** (Model Context Protocol): a standard "plug" that lets Claude talk to another program. Here it lets me *look into* your open editor (list assets, read settings) without you sending screenshots.
- **PIE** (Play In Editor): pressing Play inside the editor to test the game.
- **Copy-pasted nodes (T3D text)**: when you select Blueprint nodes and press Ctrl+C, UE copies them as text. Paste that text to me and I can read exactly what you built.
- **Remote** (usually named `origin`): a second copy of your repo on another computer, here GitHub's servers. It's your backup and your portfolio page.
- **Push / Pull / Clone**: *push* sends your new commits up to the remote. *Pull* brings commits down from it. *Clone* downloads a whole repo, history included, onto a new PC.
- **origin / main / master**: `origin` is the nickname of the remote (GitHub). `main` is your primary branch, a line of commits. `master` is the old name for the same thing. `origin/main` means "the `main` branch as it is on GitHub".
- **Tracking (upstream)**: the one-time link saying "my local `main` syncs with `origin/main`". After it's set, Push and Pull know where to go.
- **LFS pointer**: the tiny text note Git stores in place of a big file ("the real file has ID fdee63… and is 308 KB"). The real file is uploaded separately to LFS storage. If that upload fails, GitHub shows the files but a clone gets only the notes.

**Claude Code**
- **Session**: one conversation with Claude. It forgets everything when it ends, so anything worth keeping goes into the docs. One task per session.
- **Context (window)**: everything Claude can "see" in the current session: messages, files read, tool results. It has a size limit. When it fills up, older details fade.
- **`/compact`**: replaces the conversation so far with a summary to free up context. Small details get lost. **`/clear`** wipes the conversation completely.
- **`CLAUDE.md`**: a briefing file Claude Code reads automatically at the start of every session in this folder.
- **Hook**: a small script Claude Code runs automatically at a set moment, e.g. *before* a tool is used. Ours checks every Unreal MCP call and blocks anything that isn't a read.
- **Allowlist vs denylist**: an allowlist names what's permitted and blocks everything else (safe by default). A denylist names what's forbidden and permits everything else (anything new slips through). The MCP guard uses an allowlist.

**Unreal building blocks**
- **Actor**: anything that can exist in the level: a hero, an Area, the camera. If you can place it in the world, it's an Actor.
- **Component**: a piece you attach to an Actor to give it an ability, like a mesh (how it looks), collision (what it bumps into), or your own "Health" component. Actors are built *from* Components.
- **Blueprint Class**: a reusable template. You make `BP_Area` once, then place it 10 times; each copy is an *instance*.
- **Level**: one "world" file (`.umap`) you open and play in. Ours: `LVL_Battle_01`, the room where the fight happens.
- **World Settings**: the settings panel of a whole level (not of one actor). Holds the **Game Mode override**: "this level uses this Game Mode instead of the project default".
- **Pawn / Possess**: a Pawn is an Actor the player can *possess*, i.e. take control of. The Player Controller is "you", the Pawn is the body you steer. A Game Mode spawns its **Default Pawn Class** at the PlayerStart; GameModeBase defaults to `DefaultPawn` (a flying sphere), so set it to None if you don't want one.
- **PlayerStart**: a marker saying where the player's Pawn spawns. It doesn't decide *what* spawns; the Game Mode does.
- **Parent / Child class, Inherit**: a child Blueprint automatically gets (inherits) every setting and function of its parent. `BP_BattleGameMode` is a child of GameModeBase.
- **Class Defaults**: the starting values of every variable and setting of a Blueprint, inherited ones included. Toolbar button in the Blueprint editor. Inherited settings live here, not in the graph.
- **GameModeBase vs GameMode**: GameMode = GameModeBase + "match states" (waiting, in progress, over), mainly for multiplayer. We use GameModeBase.
- **Construction Script**: a second graph in every Actor Blueprint that runs *in the editor* whenever you place, move or edit the actor (BeginPlay only runs when the game starts). `BP_Area` uses it to resize itself live while you type a size.
- **Instance Editable** (the eye icon): makes a variable show up in the Details panel of each placed copy, so every copy can have its own value. `SizeX`/`SizeY` are; `SizeZ` (thickness) isn't. Not the same as **Private**, which hides a variable from *other Blueprints*.
- **Root component / Scene component**: the root is the top component everything else hangs under; move it and the rest follows. A **Scene component** is an empty one, just a point in space, often used as a clean root (like `DefaultSceneRoot` in `BP_Area`).
- **Pivot**: the point a mesh rotates and scales around. The engine Cube's pivot is its center, which is why `BP_Area` shifts the cube by half its size to put the corner on the root.
- **Relative vs World (location/scale)**: *World* = measured in the level's coordinates. *Relative* = measured from the parent component. Inside an actor's own setup you almost always want Relative.
- **Scale vs Size**: Scale is a multiplier on the mesh's own size (scale 2 = twice as big). Size is the result in world units. Size = mesh size at scale 1 × Scale.
- **Unreal unit (uu)**: 1 uu = 1 cm. Locations, mesh sizes and Details panel numbers are all in cm.
- **Attach (child component)**: a component placed *under* another one in the Components list. It moves, rotates and **scales** with its parent. `BP_Area`'s `TopCube` hangs under `BottomCube`, so it only needs a scale *relative* to the bottom cube (e.g. 0.96), not its own size in cm.
- **Actor label**: the name an actor shows in the Outliner (`Area_1`). It's just for you to read; game logic shouldn't depend on it. Rename with F2.
- **Outliner folder**: a folder in the level's actor list (`Areas_1`), not in the Content Browser. Only tidies the list; it has no effect on the game.
- **Vector**: one value holding three numbers (X, Y, Z). Location and Scale are Vectors, so one Vector wire can replace three separate number wires.
- **Magic number**: a raw number in a graph with no name explaining it (e.g. a bare `0.01`). Fine when obvious, but a named variable or a node comment saves future-you a puzzle.
- **Redirector**: a hidden note left behind when you move an asset ("it moved over there"), so old links keep working. Clean up with right-click folder → Update Redirector References.
- **Function vs Event**: both are "do this" blocks. A **Function** runs instantly and can return an answer ("what's the distance between these two Areas?"). An **Event** is a reaction to something happening ("when clicked…") and can't return an answer.
- **Variable / Array / Struct / Enum**: a Variable is a labeled box holding one value (HP = 500). An Array is a list of boxes (all enemies in the room). A Struct is a bundle of different values that belong together (an ability's name + cost + damage range). An Enum is a fixed list of choices (Target: Closest / Furthest / Lowest HP).
- **Game Mode / Game State**: Game Mode holds the *rules* of the match ("battle starts when…, you lose when…"). Game State holds the *current situation* everyone can read ("the clock is at 12.5s").
- **Player Controller**: the Blueprint that represents *you*, the person at the keyboard. It turns mouse clicks into game commands like "select this Area".
- **Player State**: a small actor the Game Mode creates for every player to hold info *about* that player (name, score). Unreal won't let a player join without one, which is why the "pawnless" `NoPawnPlayerController` failed with "PlayerState is null".
- **Reparent**: changing which parent class a Blueprint is built on (Class Settings → Parent Class). Used in T4 to move `BP_BattlePlayerController` from `NoPawnPlayerController` to plain `PlayerController`.
- **Camera Actor**: a camera that stands in the level on its own, with no body attached. `BattleCamera` is one. A camera *component* is the same idea but lives inside another actor, like a character.
- **View Target**: the actor whose eyes you see the game through. The Player Controller's **Set View Target with Blend** switches it (Blend Time 0 = instant cut).
- **Pitch / Yaw / Roll**: the three rotation angles. Pitch = nose up/down (−90 looks straight down), Yaw = turning left/right, Roll = tilting sideways.
- **Pilot (an actor)**: right-click an actor in the Outliner → Pilot. The viewport looks through it and moves it as you fly around. Eject to stop. Handy for framing a camera.
- **Event BeginPlay**: fires once when an actor starts existing in the running game. The earliest point where everything in the level can be found.
- **Is Valid**: a node that checks whether a reference actually points at something. Prevents "Accessed None" errors when, e.g., no camera was found.
- **Object Reference (variable type)**: a variable that points at one existing thing in the game, e.g. `BattleCamera` → the camera in the level. Typing it as the exact class (Camera Actor, not just Actor) lets the editor offer that class's options.
- **Promote to Variable**: right-click a pin → creates a variable of exactly that pin's type and wires a SET for you.
- **Enhanced Input**: UE 5's input system. It separates *what the player means* (an Input Action) from *which key does it* (a Mapping Context), so logic never mentions a specific key.
- **Input Action (`IA_`)**: a data asset naming one thing the player can mean, e.g. `IA_Select` = "select something". Its **Value Type** says what it carries: Digital (bool) for a plain click, Axis for things like a stick or scroll amount.
- **Input Mapping Context (`IMC_`)**: a data asset listing "this key → that action", e.g. `IMC_Battle`: Left Mouse Button → `IA_Select`. It's a table with no graph, so no logic lives in it. It does nothing until something adds it for the player.
- **Subsystem / Enhanced Input Local Player Subsystem**: a subsystem is a built-in helper object the engine creates for you automatically, one per something (here: one per local player). This one keeps the list of active Mapping Contexts; **Add Mapping Context** switches one on.
- **Mapping Context Priority**: when two active contexts bind the same key, the higher priority wins. With only one context, 0 is fine.
- **Trigger (Enhanced Input)**: a rule deciding *when* an action fires: on press, on release, after holding 0.5 s… Set on the Input Action or on one mapping. None set = fire while the key is down.
- **Started vs Triggered (event pins)**: on an Input Action event, **Started** fires once at the moment of the press; **Triggered** fires every frame the trigger condition holds, so with no triggers set it repeats while you hold the button. For "one click = one command", use Started.
- **Trace (line trace / raycast)**: an invisible ray fired into the level; the first thing with collision in its way is the hit. **Get Hit Result Under Cursor** fires one from the camera through the mouse cursor, so you don't have to work out the start and end points yourself.
- **Hit Result**: a struct with everything about one trace hit: which actor, which component, where. Open it with **Break Hit Result** to get e.g. **Hit Actor**.
- **Break (a struct)**: a node that unpacks a struct into its separate values, like opening a parcel. **Make** does the opposite.
- **Trace channel vs Object type**: two ways to say what a trace may hit. **By Channel**: you pick a kind of ray (*Visibility*, *Camera*), and every component's collision settings say Block / Overlap / Ignore for that kind. **For Objects**: you list the kinds of collider you want (*WorldStatic*, *WorldDynamic*, *Pawn*…); an empty list hits nothing.
- **Collision response (Block / Overlap / Ignore)**: how a component reacts to a trace channel or another collider. Block stops a trace and counts as a hit.
- **None (null)**: the empty value of any object reference, meaning "points at nothing". Every reference can be None, whatever its type. The type says *what kind* of thing it would point at, not that something is there.
- **Accessed None**: the error logged when a graph tries to use a reference that is None (e.g. calling a function on it). The node simply doesn't run. Check with Is Valid first.
- **Return Node**: the node that ends a function and hands its outputs back. A function can have several; every exec path out of a function should end in one. If a path ends without one, the caller's output pin keeps its **old** value (the T6 "last Area still printed" bug).
- **Pure vs impure function**: a **pure** function has no white exec pins and re-runs every time something reads its output (fine for maths). An **impure** one runs once, at a clear point in the exec chain. Use impure for questions about the world at a specific moment, like a trace.
- **Get Display Name vs Get Object Name**: Display Name gives the Outliner label in the editor (`Area_9`). Object Name gives the internal name (`BP_Area_C_5`).
- **Event Dispatcher**: a "shout". One Blueprint shouts "enemy died!" and anyone who signed up to listen reacts. The shouter doesn't need to know who's listening.
- **Interface**: a promise that several different Blueprints understand the same message. E.g. "TakeDamage" works on heroes and enemies alike, without asking "are you a hero or an enemy?" first.
- **Casting (Cast To X)**: asking "are you specifically a `BP_Ghoul`?" before talking to something. On success the node hands you the same thing *as that class*, so you can use its own variables and functions; otherwise it takes the **Cast Failed** exit. T6 uses Cast To BP_Area as the "only Areas count" filter. Useful sometimes; chains of casts make Blueprints fragile, which is why Interfaces and Dispatchers exist.
- **Data Asset / Data Table**: files that hold *data only*, no logic. E.g. "Warrior: HP 1100, abilities Slash/Cleave/…". Changing a number means editing data, not rewiring Blueprints.
- **Gameplay Tag**: a label like `Status.Bleed` or `Ability.Warrior.Charge`, organized in a tree. Safer than typing text by hand, because a typo can't create a "new" tag by accident.
- **UMG** (Unreal Motion Graphics): Unreal's tool for building UI: buttons, health bars, the timeline.
- **Class vs instance vs reference**: the class `BP_Area` is the house plan; `Area_7` in the level is one house built from it (an instance); an object reference is that house's street address. A Cast never *chooses* which house. It only checks that the address you already hold is a `BP_Area` house.
- **Material (`M_`)**: the recipe for how a surface looks (colour, shine, roughness), built as a node graph that ends in outputs like Base Color. `M_WhiteInner` colours the Areas' `TopCube`.
- **Shader / shader compile**: a shader is the small program the graphics card runs to draw a material. Every new *Material* has to be compiled into shaders, which is slow (the "Compiling Shaders" counter). That's the expensive part, not swapping materials at runtime.
- **Material Parameter (Scalar / Vector)**: a named value inside a material that can be changed *without* editing its graph. Scalar = one number (`ColorScaling`), Vector = a colour or three numbers (`ColorRegular`, `ColorHighlight`).
- **Material Instance (`MI_`)**: a copy of a material that changes only parameter values. It reuses the parent's shaders, so it costs almost nothing to make. `MI_HighlightedInner` = `M_WhiteInner` with `ColorScaling` = 1.
- **Override (in a Material Instance)**: the checkbox next to each parameter. Unticked (greyed out) = "use the parent's value"; ticked = "this instance uses its own value". Every parameter starts unticked, which is why a fresh MI seems to refuse edits.
- **Lerp (Linear Interpolate)**: blends between A and B by Alpha: 0 = all A, 1 = all B, 0.5 = halfway. `M_WhiteInner` lerps white → blue by `ColorScaling`, so a highlight could later *fade in* by animating Alpha.
- **Set Material**: a node that puts a different material on one slot (Element Index) of a mesh component at runtime. `SetHighlighted` uses it on `TopCube`.
- **Dynamic Material Instance**: a Material Instance created *while the game runs*, so you can change its parameters live (e.g. fade `ColorScaling` 0 → 1). The alternative to swapping between ready-made MIs; not used yet.
- **Reroute node**: a dot on a wire that only bends it, to keep a graph readable. Does nothing to the logic. Double-click a wire to add one.
- **Validated Get**: right-click a variable getter → *Convert to Validated Get*. The getter gets Is Valid / Is Not Valid exits built in, which is shorter than a separate Is Valid node.

**Our game's terms**
- **Area**: one rectangle of the board. It has a capacity (how many units fit) and neighbors (rectangles sharing an edge).
- **Range / Distance**: how many Area-steps apart two Areas are, counting neighbors, not meters.
- **Battle clock**: the single shared timer of a fight, in seconds.
- **Cost**: how many seconds an action pushes the clock forward.
- **Escalation**: each use of an ability raises its next cost; it slowly cools back down as the clock runs.
- **Intent**: what an enemy will do next and when it lands, shown to the player in advance.
