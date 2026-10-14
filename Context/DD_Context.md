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

**M1 – The Board** · 🔄 started 2026-10-14. Goal: a fixed room of rectangle Areas seen from a top-down camera; click an Area to highlight it.

- [x] **T1 – Battle level & Game Mode.** ✅ 2026-10-14 Our own empty level and our own rules Blueprint, so we stop living inside the template's level.
  *Done when:* `LVL_Battle_01` (in `DarkDungeon/Maps/`) has floor + light; `BP_BattleGameMode` (in `Core/`) is the level's Game Mode override; Project Settings → Maps & Modes opens/plays `LVL_Battle_01` by default; PIE starts there with no template character running around.
- [x] **T2 – `BP_Area` actor.** ✅ 2026-10-14 One reusable rectangle that sizes itself.
  *Done when:* `BP_Area` (in `Board/`) has a sensible component setup (root + visible mesh); an **Instance Editable** size variable drives the mesh size through the **Construction Script**; 2–3 copies in the level with different sizes, and changing the size in Details updates the viewport live.
- [ ] **T3 – Lay out the room.** Hand-build the MVP room (GDO §3).
  *Done when:* 8–10 `BP_Area` instances of mixed sizes form one room (look of refs 1–5), small gaps between Areas, sensible labels in the Outliner (e.g. `Area_01`…), grouped in an Outliner folder.
- [ ] **T4 – Top-down camera & Player Controller.** See the whole board when you press Play, mouse cursor visible.
  *Done when:* `BP_BattlePlayerController` (in `Core/`) is set in the Game Mode; on PIE the view is a fixed top-down (slightly angled is fine) shot of the whole room; mouse cursor is visible; no pawn wandering around.
- [ ] **T5 – Click input.** A click becomes a game command.
  *Done when:* `IA_Select` + `IMC_Battle` (in `Input/`) exist; the Player Controller adds the mapping context on start; left click prints "Select" (Print String) in PIE.
- [ ] **T6 – Pick the Area under the cursor.** Which Area did I click?
  *Done when:* clicking an Area prints *that* Area's name; clicking empty space prints nothing (or "none"); picking ignores things that aren't Areas.
- [ ] **T7 – Highlight.** Show the selection.
  *Done when:* the clicked Area changes look (material instance, e.g. `MI_Area_Highlighted`); only one Area is highlighted at a time; clicking empty space clears it; the Area owns *how* it looks highlighted (the controller only says "you're selected / not selected").

**Next session starts with:** T3. User sketches the room layout (rough Area sizes in cm and where they go), Claude reviews it, then build. Leftovers from T2 (optional): delete the Print String in `BP_Area`'s Construction Script; rename `VectorXYZ` / `SizeZ` to say what they mean.

**Last finished:** M1-T2 `BP_Area` actor ✅ (2026-10-14).

#### Milestones

| # | Milestone | Status | Playable result | UE concepts learned |
|---|---|---|---|---|
| M0 | **Setup** | ✅ 2026-10-14 | Empty UE 5.8 project in version control, folders & naming set, MCP connected (read-only) | Project creation, plugins, Git LFS + `.gitignore`, folder/naming conventions, editor preferences & console commands |
| M1 | **The Board** | 🔄 | Fixed room of rectangle Areas visible from a top-down camera; click an Area to highlight it | Actors vs Components, Blueprint classes, construction script, collision/traces for mouse picking, Player Controller, camera |
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
- **Vector**: one value holding three numbers (X, Y, Z). Location and Scale are Vectors, so one Vector wire can replace three separate number wires.
- **Magic number**: a raw number in a graph with no name explaining it (e.g. a bare `0.01`). Fine when obvious, but a named variable or a node comment saves future-you a puzzle.
- **Redirector**: a hidden note left behind when you move an asset ("it moved over there"), so old links keep working. Clean up with right-click folder → Update Redirector References.
- **Function vs Event**: both are "do this" blocks. A **Function** runs instantly and can return an answer ("what's the distance between these two Areas?"). An **Event** is a reaction to something happening ("when clicked…") and can't return an answer.
- **Variable / Array / Struct / Enum**: a Variable is a labeled box holding one value (HP = 500). An Array is a list of boxes (all enemies in the room). A Struct is a bundle of different values that belong together (an ability's name + cost + damage range). An Enum is a fixed list of choices (Target: Closest / Furthest / Lowest HP).
- **Game Mode / Game State**: Game Mode holds the *rules* of the match ("battle starts when…, you lose when…"). Game State holds the *current situation* everyone can read ("the clock is at 12.5s").
- **Player Controller**: the Blueprint that represents *you*, the person at the keyboard. It turns mouse clicks into game commands like "select this Area".
- **Event Dispatcher**: a "shout". One Blueprint shouts "enemy died!" and anyone who signed up to listen reacts. The shouter doesn't need to know who's listening.
- **Interface**: a promise that several different Blueprints understand the same message. E.g. "TakeDamage" works on heroes and enemies alike, without asking "are you a hero or an enemy?" first.
- **Casting**: asking "are you specifically a `BP_Ghoul`?" before talking to something. Useful sometimes; chains of casts make Blueprints fragile, which is why Interfaces and Dispatchers exist.
- **Data Asset / Data Table**: files that hold *data only*, no logic. E.g. "Warrior: HP 1100, abilities Slash/Cleave/…". Changing a number means editing data, not rewiring Blueprints.
- **Gameplay Tag**: a label like `Status.Bleed` or `Ability.Warrior.Charge`, organized in a tree. Safer than typing text by hand, because a typo can't create a "new" tag by accident.
- **UMG** (Unreal Motion Graphics): Unreal's tool for building UI: buttons, health bars, the timeline.

**Our game's terms**
- **Area**: one rectangle of the board. It has a capacity (how many units fit) and neighbors (rectangles sharing an edge).
- **Range / Distance**: how many Area-steps apart two Areas are, counting neighbors, not meters.
- **Battle clock**: the single shared timer of a fight, in seconds.
- **Cost**: how many seconds an action pushes the clock forward.
- **Escalation**: each use of an ability raises its next cost; it slowly cools back down as the clock runs.
- **Intent**: what an enemy will do next and when it lands, shown to the player in advance.
