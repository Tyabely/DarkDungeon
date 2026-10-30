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
- **Use an everyday analogy for logic and math ✅.** When a calculation or rule is abstract, map it onto something from daily life first, then back onto the game. (M2-T5: overlap of two ranges = two work shifts, 9:00–17:00 and 12:00–20:00. You're both at work from the later start (Max of starts) to the earlier end (Min of ends); negative = never together.) That example landed better than any formula.
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
   - **Branchy logic → flowchart first ✅.** When I can see a task will need several branches, states or "what happens on the next click" logic, I recommend sketching it as a flowchart in **Miro** before touching nodes (boxes for steps, diamonds/colours for decisions, one lane per event). You've done this on past projects, and in M2-T6 the click-flow chart is what unlocked deselect. A screenshot of the chart is also a great review channel.
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

**M5 – Abilities** · 🔄 in progress. Goal: either hero picks an ability, picks a target, deals damage from a range (e.g. 80–110), and each use costs time that escalates (GDO §4.2, §5, §6).
*(Draft task list, written when M4 closed. Change it freely as M5 goes. T4 is branchy, so sketch a Miro flowchart first.)*

- [x] **T1 – Health and damage.** ✅ 2026-10-28. `BPC_Health` (Integer `CurrentHealth`/`MaximumHealth`, `InitHealth` from the Construction Script, `ApplyDamage` with Clamp 0..Max, dispatchers `OnHealthChanged` + `OnDied`); `BPI_Damageable.ReceiveDamage` implemented on `BP_Unit` → `ApplyDamage`; `BP_Unit` binds both dispatchers in BeginPlay and draws the label once; death → Game Mode `HandleUnitDeath(Unit)` removes enemies from `EnemyQueue`, then the unit destroys itself. Tested with two Delayed hits in the Game Mode's BeginPlay (Decisions #118–#124).
- [x] **T2 – Ability data.** ✅ 2026-10-28. `PDA_HeroAbility` rebuilt from the M3 draft: `DisplayName`, `MinDamage`/`MaxDamage` (Min 0), `MinRange`/`MaxRange` (Min 0), `BaseCostTenths` (Min 1), `StrainRatio`, `StrainDurationTenths`; `Size`/`IsAOE` removed. `DA_Slash` (80–110, range 0–0) and `DA_Shot` (70–100, range 1–3), both cost 15 / ratio 0.4 / duration 45, listed in `AbilitySet` on `DA_Warrior` / `DA_Archer`. Escalation redesigned as Strain stacks (GDO §4.2, Decisions #125–#127).
- [x] **T3 – Ability bar.** ✅ 2026-10-30. `WBP_AbilityBar` (5 fixed `WBP_AbilityButton` slots, created by the controller) listens to the controller's `OnSelectedUnitChange` (only `ChangeSelectedUnit` writes `SelectedUnit`), casts the unit's data to `PDA_Hero`, copies `AbilitySet` into `AbilitiesToDisplay` (cleared for enemy/nothing) and runs one For Loop over the slots with Is Valid Index → `SetAbilityDisplayName` (name, `BaseCostTenths` as seconds; None blanks and disables). On Clicked → `UpdateSelectedAbility` on the controller: toggles `SelectedAbility` against its current value and broadcasts `OnSelectedAbilityChange`; each slot paints itself green (Set Background Color) when the announced ability is its own. Changing the unit clears the ability (Decisions #128–#135).
- [ ] **T4 – Target and resolve.** With an ability selected, Areas in range light up (range = Area steps, GDO §3: needs a "distance on the graph"). Click a target: random damage in range, `AdvanceClock(cost)`, enemy attacks resolve. If the hit kills, the enemy's attack never happens (GDO §4.1). *Flowchart first.*
- [ ] **T5 – Escalating cost.** Strain stacks (GDO §4.2, #125): each use adds an `S_Strain` to the hero's list for that ability; the current cost is worked out on demand from the clock. Move escalates too (GDO §6, re-tune as Strain), so `BaseMoveCost` leaves `BP_Unit` (#102).
- [ ] **T6 – One status.** One timed status as a Gameplay Tag in a Tag Container on the unit (e.g. Shield Wall's half damage for 4s), expiring on the clock.

**T4 progress (2026-10-30):**
- [x] Targeting rules decided (Decisions #136–#140): click an **enemy unit**; a wrong click keeps the selection and prints; right click cancels in layers; Area clicks never move while an ability is selected; ability clears after use, hero stays.
- [x] Refactor step 1 ✅ checked: `BP_HeroUnit` (child of `BP_Unit`, in `Units/`) is what the Game Mode's `SpawnUnit` spawns for heroes; `SelectedUnit` → **`SelectedHero`** typed `BP_HeroUnit`; `ChangeSelectedUnit` → `ChangeSelectedHero(BP_HeroUnit)`; the click path casts to `BP_HeroUnit` (Cast Failed → the Area path); the #94 swap is done (ability cleared before the dispatcher). The debug hits in the Game Mode's BeginPlay are gone. Clean PIE run.
- [ ] Refactor step 2: `GetUnitUnderCursor` drops its `Team == 0` check (Equal (Byte)) and returns any `BP_Unit`. The click path's Cast already does the judging (#141). Play-test: clicking an enemy with nothing selected must still do nothing.
- [ ] Refactor step 3: tick **Generate Abstract Class** on `BP_Unit` (#142), then re-test.
- [ ] Flowchart in Miro: *what did I click (hero / enemy / Area / nothing)?* → *is an ability selected?* → the rows of #137.
- [ ] Then: distance on the graph → range highlight → resolve (`IsValidTarget`, damage, `AdvanceClock`).

**Next:** M5-T4 refactor step 2 (`GetUnitUnderCursor` without the team check), then step 3, then the flowchart.

**Carried over from M5-T3:**
- T5: the slot reads `BaseCostTenths` from the DA itself. When the real cost lives on the hero, the slot should be *given* the cost (a `CostTenths` input or a `SetCost` function) instead of working it out (#131).
- ~~`ChangeSelectedUnit` announces before clearing the ability~~ swapped in T4 (now `ChangeSelectedHero`).
- `SetAbilityDisplayName` also sets the cost and the enabled state, so `SetAbility` would be a clearer name.
- `PaintAbilityDisplay` checks Is Valid twice in a row (Is Valid node, then a Branch on Is Valid). One is enough.
- Cleanup: the "END OF THE LOOP" Print String in `UpdateDisplay`; `NumberOfAbilities` duplicates the slot count (an array of the 5 slots would replace both it and the 5-way Select node); widgets use `Get Player Controller (0)` where **Get Owning Player** says what's meant.
- Check `DA_Warrior` / `DA_Archer` `AbilitySet` holds only the real abilities (extra Slash/Shot were added for testing).
- Later idea: the bar could show enemy info when an enemy can be selected (out of scope now; `GetUnitUnderCursor` only picks heroes).

**Carried over from M5-T2:**
- `StrainDurationTenths` has Value Range Min **0**; make it **1**. T5 divides by it, so 0 would be a divide-by-zero.
- `StrainRatio` has no Min; set Min 0 so a negative ratio can't make spamming cheaper. Optional.
- Min > Max (damage or range) can't be blocked by Value Range, because it compares two fields. It's a designer rule for now; T4 could swap or warn.
- Live ability state (Strains, T5) goes on the hero, never on the DA. That's probably the moment `BP_HeroUnit` gets made (#102).

**Carried over from M5-T1:**
- ~~Delete the debug hits from the Game Mode's BeginPlay~~ gone (checked in T4).
- Hero death does nothing in `HandleUnitDeath` yet. When it matters (M7 lose check), the controller must also clear its selection if the selected hero died.
- `HandleUnitDeath` reads the team from `UnitData`; `BP_Unit` has its own `Team` variable. Pick one source. The Switch + Cast To `BP_EnemyUnit` could also be just the Cast (success = enemy). Fine to leave.
- `HandHealthChanged` → `HandleHealthChanged` (typo); the dispatcher input `MaxHealth` vs variable `MaximumHealth`. The queue-print loop in `HandleUnitDeath` is debug.
- An already-dead unit hit again fires `OnDied` again (HP stays 0). Harmless while it's destroyed at once; matters if death gets an animation.

**Carried over from M4-T6:**
- Set the placeholder Delay in `ResolveNextAttack` back to **0.1s** (it's 2.0 for the T6 test).
- The overlapping-chains bug is known and left in on purpose (#115): a click during the Delay starts a second chain that resolves one attack at once and dies on the busy Delay; the first chain then carries on with the second chain's time. Fix with the "is resolving" flag when animations arrive. When the flag goes in, expect the first chain to stop "rescuing" the second: test that every due attack still resolves.
- Delete the ENTER / AFTER-delay **Print Text** nodes (and their Format Text / Get Game Time nodes); keep the **Vis Log** nodes in the Game Mode's "Debug" comment box (#116).

**Carried over from M4-T5:**
- ~~Heroes show "Text Block"~~ fixed 2026-10-26 (heroes show no intent line). `IntentText` still sits in the parent's `IntentSlot`, so the Named Slot does no work; fine to leave it or remove it. "0.0s" seen in play.
- Bar width follows the widest line (enemy bars stretch to the intent text): the Overlay's Vertical Box slot is Horizontal Alignment **Fill**. Set it to **Center** so the Size Box's 150 holds.
- The "update every enemy" For Each is copied into the True and False exits of `ResolveNextAttack`. Collapse to a function (`UpdateAllIntentLabels`) so a change happens once.
- ~~Rename the Game Mode variable `NewTimeTenths`~~ done in T6: it's `ResolveTimeTenths` now.
- Input isn't blocked while attacks resolve (#113). The real fix is an "is resolving" flag the controller checks; it belongs with animations.
- Attack names show the DA's Name field ("GhoulAttack1"); give them real names ("Bite") in the DAs when the attacks get designed (M6).
- The clamp uses Select with `>`; a Max (Integer) node does the same in one node. Fine to leave.
- HUD timeline (your sketch: proportional bar 0→10+s with enemy icons, hover for details) is planned in GDO §4.4 for M5/M8.

**Carried over from M4-T4:**
- `FindEarliestAttacker` uses two Branches (index 0, then `<`) where one Branch with an OR would do. Same result; fine to leave.
- Ties go to whoever comes first in `EnemyQueue`, which is spawn order. Fine for now; a real tie rule is a design question.
- Animations (later): `ResolveNextAttack`'s self-call moves behind an "attack finished" dispatcher on the enemy. That's why it's an event and not a While Loop (#106).
- Dead enemies must leave `EnemyQueue` (M5, with damage). Until then `Is Valid` covers an empty queue.
- Check that the time field on `PDA_EnemyAttack` has **Value Range Min = 1** (#108). MCP can't show it.
- `BP_EnemyUnit` sits in `Units/`; Conventions put enemy-only things in `Units/Enemies/`. Move it through the Content Browser when convenient. (Carried from T3.)
- The "Mixing AGameStateBase with AGameMode" error is gone from the log since 14:42 on 2026-10-25. If the Game Mode was reparented, #11 needs updating.

**Carried over from M4-T2:**
- `BaseMoveCost` (renamed from `BaseCostMove`) stays on `BP_Unit` for now (#102). When Move escalates (+0.5 per use, GDO §4.3, M5) it should come from hero data (`PDA_Hero` or the Move ability).
- The start value is still pushed by the controller (`SetClockInfo` with `GetCurrentTimeTenths`). The widget could do that itself in Event Construct, right after its cast. Then the controller only creates the widget and doesn't need `ClockWidgetReference`. Optional.
- The Cast Failed pins (controller, widget, unit) are unwired. A Print String there would explain a blank clock. Fine to leave.

**Carried over from M3 (fine to leave):**
- T6: the label's text-shadow / bar-colour polish is open (`WBP_HealthBar` moved to `UI/` in M4-T5). HP is pushed once in BeginPlay, so damage (M5) must call `SetUnitInfo` again or swap to a dispatcher.
- T5: a click on a unit before its material arrives would make `PaintUnitState` hit Accessed None on an empty `DynamicMaterialInstance` (an Is Valid there covers it once loads take real time); the two loads run one after the other and could start together; the Cast failure pins are unwired.
- Cleanup: drop the `Invalid DA!` Print (the Blueprint editor's preview actor fires it on every recompile) and the tag Print, now that the readout shows the data.
- Future-proofing: one master material `M_Unit` (colour Vector param + `SelectedSaturation`) with `MI_HeroUnit`/`MI_EnemyUnit` as instances, so the selection effect lives in one graph instead of two; split the spawn loop into a `SpawnUnits` function and the Construction Script body into `ApplyUnitData`; health moves into `BPC_Health` in M5 (#80); the roster moves to the Game Instance and enemies to an encounter DA (#76).

Optional leftovers from M2 (fine to leave, nice to fix): `GetUnitUnderCursor` compares `Team` with **Equal (Byte)** vs 0 (use the enum `==` Hero) and its `CastFailed` path has no Return node; `SetUnitLook` still takes a `Team` input the unit already has; the controller's `MoveToArea` shares its name with the unit's (e.g. `TryMoveSelectedHero`); a `UnitPick` trace channel would replace `Visibility` for unit picking; spawn and move could become two functions (Decisions #63). Older: `Input/Test.uasset` (M1-T5) looks like a leftover; M1 notes (Append "Hit:" spacing, `TopCube` Z = 100 note, camera ~65 cm off centre).

**Last finished:** **M4 – The Time System** ✅ closed 2026-10-28 with M4-T6 Debugging pass: found the overlapping-chains bug (a second click during the Delay starts a second `ResolveNextAttack` chain, which resolves one attack at once and dies on the busy Delay; the first chain then uses the second chain's time) and proved it with Print (`ENTER`/`AFTER delay` + Get Game Time in Seconds), a breakpoint on the Delay (Step Over from chain B landed on chain A's wake-up 2s later) and the Visual Logger (attacks ~1.2s apart, no wake-up mark for chain B). Fix deferred to the "is resolving" flag (Decisions #115–#117). M4 built: the battle clock in tenths on `BP_BattleGameState`, `AdvanceClock` + `OnClockAdvanced`, `BP_EnemyUnit`, attacks from `PDA_EnemyAttack` data, the Game Mode's battle queue (`ResolveNextAttack`), and enemy intent labels. Task list in git history (`M4-T6` commit) and Decisions #91–#117. **M3 – Data-driven Units** ✅ closed 2026-10-24 with M3-T6 See the data in play: a Widget Component on `BP_Unit` (Space = Screen, Draw at Desired Size, Z 220) shows `WBP_HealthBar` (name, bar, "800 / 800"). `BP_Unit`'s BeginPlay does Get Widget → Cast To `WBP_HealthBar` → `SetUnitInfo(UnitName, CurrentHealth, MaxHealth)`, which sets `NameText`, `HealthBar` and `CurrentHealthText` once. No bindings, no Tick (Decisions #88–#90). M3 built: `PDA_Unit`/`PDA_Hero`/`PDA_Enemy`, four `DA_`s, spawn from typed rosters, identity Gameplay Tags, soft mesh/material with Async Load Asset. Task list in git history (`M3-T6` commit) and Decisions #66–#90. **M2 – Pieces on the Board** ✅: `M2-T6` commit and Decisions #37–#65. **M1 – The Board** ✅: `M1-T6` commit and Decisions #11–#36.

#### Milestones

| # | Milestone | Status | Playable result | UE concepts learned |
|---|---|---|---|---|
| M0 | **Setup** | ✅ 2026-10-14 | Empty UE 5.8 project in version control, folders & naming set, MCP connected (read-only) | Project creation, plugins, Git LFS + `.gitignore`, folder/naming conventions, editor preferences & console commands |
| M1 | **The Board** | ✅ 2026-10-16 | Fixed room of rectangle Areas visible from a top-down camera; click an Area to highlight it | Actors vs Components, Blueprint classes, construction script, collision/traces for mouse picking, Player Controller, camera |
| M2 | **Pieces on the Board** | ✅ 2026-10-21 | 2 hero placeholders + 3 enemy placeholders placed in Areas; Area capacity respected | Spawning, references between actors, arrays/maps, enums, structs, Area adjacency (graph basics) |
| M3 | **Data-driven Units** | ✅ 2026-10-24 | Heroes/enemies built from data (stats, abilities) instead of hard-coded values | Primary Data Assets / Data Tables, Gameplay Tags, soft vs hard references |
| M4 | **The Time System** | ✅ 2026-10-28 | Each enemy shows its next attack and seconds left; the clock advances by the cost of your action and enemy actions land in order | Game Mode / Game State ownership, Event Dispatchers, functions vs events, debugging (breakpoints, Print, Visual Logger) |
| M5 | **Abilities** | 🔄 | Either hero can pick an ability, pick a target Area, deal ranged damage (e.g. 80–110); escalating costs work | Ability architecture (objects/components), interfaces, targeting, UMG basics (buttons, bindings vs events), statuses as Gameplay Tags (`Status.Bleed`, `Status.Buff.*`) in a Tag Container on the unit (add/remove/has-tag) |
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
- **Enumeration asset / Enumerator**: in UE you create your own enum as an asset (Content Browser → Blueprint → Enumeration, prefix `E_`, e.g. `E_SpawnSide`). Each choice inside it is an *enumerator* (None, Hero, Enemy). A new variable of that type starts on the **first** enumerator, so put the "nothing / default" choice first. Better than two booleans (both could be true) or a number code (`2` means nothing to a reader, and `7` is allowed).
- **Game Mode / Game State**: Game Mode holds the *rules* of the match ("battle starts when…, you lose when…"). Game State holds the *current situation* everyone can read ("the clock is at 12.5s"). The Game Mode creates the Game State named in its **Game State Class** setting. Base goes with Base: a GameModeBase needs a **GameStateBase** child, or it only warns and doesn't work properly. Any Blueprint reaches it with **Get Game State** → Cast To `BP_BattleGameState`.
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
  - **Call** = the shout itself (`Call OnClockAdvanced` inside `AdvanceClock`). **Bind** = signing up to listen (`WBP_BattleClock` binds in Event Construct, and its `UpdateClock` event runs on every shout). The shouter never binds to itself.
  - **Dispatcher input (payload)**: a value carried with the shout, added under the dispatcher's Details → Inputs. `OnClockAdvanced` carries `NewTimeTenths`, so listeners don't have to go ask the Game State. Add inputs *before* binding: the listener's custom event copies them when it's created.
- **Event Construct**: a widget's version of BeginPlay. It runs once, when the widget is created.
- **Interface**: a promise that several different Blueprints understand the same message. E.g. `BPI_Damageable.ReceiveDamage` works on heroes and enemies alike, without asking "are you a hero or an enemy?" first. The interface only lists names and inputs (no body); each Blueprint that adds it (Class Settings → Interfaces) writes its own answer. Interface = an order going **in** to one object; dispatcher = news going **out** to whoever listens.
  - **Message vs direct call**: the node marked **(Message)** works on any Actor reference and silently does nothing if that actor doesn't implement the interface. The plain call only appears when the reference's type already implements it.
- **Bind hears only the future**: binding to a dispatcher catches calls made *after* the Bind. Anything broadcast earlier (e.g. from the Construction Script) is missed, so read the current value once yourself right after binding.
- **Cast and child classes**: a Cast asks "are you *at least* an X?". A `WBP_HealthBarEnemy` passes Cast To `WBP_HealthBar` (a child is also its parent), but a plain `WBP_HealthBar` fails Cast To `WBP_HealthBarEnemy`. Shared code casts to the shared parent.
- **Casting (Cast To X)**: asking "are you specifically a `BP_Ghoul`?" before talking to something. On success the node hands you the same thing *as that class*, so you can use its own variables and functions; otherwise it takes the **Cast Failed** exit. T6 uses Cast To BP_Area as the "only Areas count" filter. Useful sometimes; chains of casts make Blueprints fragile, which is why Interfaces and Dispatchers exist.
- **Data Asset / Data Table**: files that hold *data only*, no logic. E.g. "Warrior: HP 1100, abilities Slash/Cleave/…". Changing a number means editing data, not rewiring Blueprints. A **Data Table (`DT_`)** is one spreadsheet: every row has the same columns, which come from a struct. A **Data Asset (`DA_`)** is one file per thing, filled in from a template. The data is **shared**: both Ghouls read the same `DA_Ghoul`, so it holds `BaseMaxHealth`, and the HP that drops when hit lives on each `BP_Unit`.
- **Primary Data Asset (`PDA_`)**: the Blueprint class you pick as the parent of a Data Asset *template* (`PDA_Unit`). "Primary" means the engine can find and load it by ID, which soft references use (T5). Templates can have children (`PDA_Hero`), but a filled-in `DA_` can't. You duplicate it instead. Filled-in copies are made with right-click → Miscellaneous → Data Asset → pick the template. Rule of thumb: **different values → a new `DA_`; different fields → a child template.** A `DA_`'s Details only show the template's Instance Editable variables.
- **Mesh vs component Transform**: the Static Mesh is only the shape file (the engine's 1 m Cube). Where it sits and how it's stretched (Location, Rotation, Scale) belongs to the component that shows it. `BP_Unit`'s tall block = Cube × Scale 0.6/0.6/1.8. Swapping the mesh with Set Static Mesh keeps the component's Scale.
- **Text vs String**: both hold words. **Text** is for words the player sees, and Unreal can translate it (`PDA_Unit.Name`). **String** is for internal labels and building messages.
- **Static Mesh vs Skeletal Mesh**: a Static Mesh is a 3D model that never bends (a chess piece). A Skeletal Mesh has bones and can be animated, which needs an Animation Blueprint. DarkDungeon's placeholders are static.
- **Material Interface**: the variable type that accepts both a Material (`M_`) and a Material Instance (`MI_`). `PDA_Unit.Material` uses it.
- **Gameplay Tag**: a label like `Status.Bleed` or `Ability.Warrior.Charge`, organized in a tree. Safer than typing text by hand, because a typo can't create a "new" tag by accident. Every unit has one (`PDA_Unit.UnitTag`, e.g. `Unit.Hero.Warrior`). The project's tags live in `Config/DefaultGameplayTags.ini`.
- **Matches Tag vs Matches Tag Exact**: **Matches Tag** counts a child as its parent, so `Unit.Hero.Warrior` matches `Unit.Hero` (true). **Exact** only counts the identical tag, so the same check is false. Use the parent check for "is this any hero?".
- **Gameplay Tag Container**: a list of tags that one thing carries at once, e.g. a unit that is `Status.Bleed` *and* `Status.Buff.Armor`. It has add, remove and "has tag" nodes. Planned for statuses in M5.
- **Gameplay Tag Redirect**: a "forwarding address" from an old tag name to a new one. Unreal writes one when you rename a tag, so assets still using the old name keep working. Remove redirects once nothing uses the old names.
- **Hard reference**: a pointer to another asset that is *packed in the backpack*: loading the asset that holds it also loads the target, every time. `BP_Unit`'s `Cube` component hard-references the engine Cube.
- **Soft reference (Soft Object Reference)**: a pointer that stores only the target's *path*, like a note saying "the sword is in locker 12". Nothing loads until you ask. `PDA_Unit.StaticMesh` and `Material` are soft since M3-T5. Its pin is a lighter shade of the hard reference's colour.
- **Async Load Asset**: a latent node that loads a soft reference in the background. **then** fires at once (asset not there yet), **Completed** fires on a later frame with the asset as a plain Object, so you Cast it (To StaticMesh, To MaterialInterface) before using it.
- **Latent node**: a node that finishes later, not in the same frame (clock icon: Delay, Async Load Asset). Allowed only in an Event Graph, never in a function or the Construction Script. **One Delay node on one object holds one timer**: if another chain reaches it while it's counting, that call is dropped and the chain ends there (the M4-T6 bug). A second Delay node has its own timer; **Retriggerable Delay** restarts the countdown instead.
- **Load Asset Blocking / hitch**: the non-async way to load a soft reference: the whole game stops until the asset is in memory. That visible stutter is a **hitch**, which is why gameplay uses Async Load Asset.
- **Reference Viewer**: right-click an asset → Reference Viewer. A map of what the asset points at and what points at it, with filters to show hard and soft references separately.
- **Size Map**: right-click an asset → Size Map. Boxes showing how much memory (or disk) loading that asset drags in with it.
- **UMG** (Unreal Motion Graphics): Unreal's tool for building UI: buttons, health bars, the timeline.
- **Widget Blueprint (`WBP_`)**: a Blueprint for one piece of UI. The **Designer** tab is the layout (Text blocks, Progress Bars), the **Graph** tab the logic. `WBP_HealthBar` is the card above each unit. Inside it, **Self is the widget**, never the unit it floats over, which is why Cast Self To `BP_Unit` always failed.
- **Widget Component**: a component that shows a widget on an actor, like `Cube` shows a mesh. `BP_Unit`'s `HealthBarComponent` holds `WBP_HealthBar`; **Get Widget** hands you the live widget inside it (Cast it to the `WBP_` to call its functions). That widget doesn't exist yet in the Construction Script, so talk to it from BeginPlay.
- **Space: World vs Screen (Widget Component)**: **World** makes the widget a flat plane in the level (perspective, can hide behind cubes, needs rotating to face the camera). **Screen** draws it flat on the screen at the actor's spot, always facing you, sized in pixels. Labels use Screen.
- **Desired size / Draw at Desired Size**: a widget's desired size is the room its contents ask for (two lines of text + a bar). With Draw at Desired Size the component draws exactly that, instead of a fixed Draw Size like 500×500.
- **Canvas Panel / Anchors**: a Canvas Panel is a screen-sized corkboard where each child is pinned at a Position and Size; **Anchors** say which point of the screen a child sticks to when the screen resizes ("bottom centre"). Right for full-screen HUDs (the M4 timeline), wrong for a small self-sizing card, because it has no desired size of its own.
- **Vertical Box / Overlay**: layout panels. A **Vertical Box** stacks children top to bottom like a list and is as big as they need. An **Overlay** stacks them on top of each other (text over a bar).
- **Horizontal Box / Border / Size Box**: more layout panels. A **Horizontal Box** lines children up left to right (hourglass, then time). A **Border** holds one child and has its own background (Brush Color, Padding), so it's the easy way to put a dark panel behind text. A **Size Box** forces its one child to a set width/height.
- **Slot (UMG)**: the **Slot** section at the top of a widget's Details is the *parent's* rules for placing that child: Padding, Size (Auto/Fill), alignment, and Anchors inside a Canvas Panel. Move the widget into a different panel and the Slot options change.
- **Brush Image Size**: an Image's own size (Appearance → Brush, 32×32 by default). It's separate from font size, which is why making the text bigger left the hourglass small.
- **DPI scaling**: Unreal shrinks or grows all UI to match the screen size (Project Settings → User Interface). A small Play viewport makes the UI look smaller than in the Designer, so set the Designer preview to 1920×1080 and judge sizes in play.
- **To Text (Float) / Format Text**: To Text (Float) turns a number into display text; under its ▼ arrow, **Minimum/Maximum Fractional Digits** = 1 always shows one decimal ("3.0", not "3"). **Format Text** fills a template: `{Time}s` grows a `Time` pin, giving "2.5s".
- **Is Variable (widget)**: a checkbox on a widget in the Designer. Ticked, Unreal makes a member variable of the same name (`HealthBar`) that the Graph can use, e.g. → Set Percent. You don't create it by hand.
- **Property binding (UMG)**: the **Bind** dropdown next to a widget field (Text, Percent) that links it to a function the widget runs **every frame** (pull). Deleting the function leaves the binding pointing at nothing, and the Blueprint won't compile until you **Remove Binding**.
- **Push vs pull**: *pull* = the widget keeps asking for the value (a binding, or Tick). *Push* = whoever owns the data hands it over when it changes (`BP_Unit` calls `SetUnitInfo`). Push does no work while nothing changes.
- **Set vs Return (in a function)**: a Return node hands values back to the caller (a vending machine). To change something on screen the function must *set* it, e.g. Set Text on `NameText` (a postman).
- **Class vs instance vs reference**: the class `BP_Area` is the house plan; `Area_7` in the level is one house built from it (an instance); an object reference is that house's street address. A Cast never *chooses* which house. It only checks that the address you already hold is a `BP_Area` house.
- **Material (`M_`)**: the recipe for how a surface looks (colour, shine, roughness), built as a node graph that ends in outputs like Base Color. `M_Area` colours the Areas' `TopCube`.
- **Shader / shader compile**: a shader is the small program the graphics card runs to draw a material. Every new *Material* has to be compiled into shaders, which is slow (the "Compiling Shaders" counter). That's the expensive part, not swapping materials at runtime.
- **Material Parameter (Scalar / Vector)**: a named value inside a material that can be changed *without* editing its graph. Scalar = one number (`ColorScaling`), Vector = a colour or three numbers (`ColorRegular`, `ColorHighlight`).
- **Material Instance (`MI_`)**: a copy of a material that changes only parameter values. It reuses the parent's shaders, so it costs almost nothing to make. `MI_Area_Highlighted` = `M_Area` with `ColorScaling` = 1.
- **Override (in a Material Instance)**: the checkbox next to each parameter. Unticked (greyed out) = "use the parent's value"; ticked = "this instance uses its own value". Every parameter starts unticked, which is why a fresh MI seems to refuse edits.
- **Lerp (Linear Interpolate)**: blends between A and B by Alpha: 0 = all A, 1 = all B, 0.5 = halfway. `M_Area` lerps white → blue by `ColorScaling`, so a highlight could later *fade in* by animating Alpha.
- **Set Material**: a node that puts a different material on one slot (Element Index) of a mesh component at runtime. `SetHighlighted` uses it on `TopCube`.
- **Dynamic Material Instance (DMI)**: a Material Instance created *while the game runs*, private to one actor, so you can change its parameters live with **Set Scalar Parameter Value**. A normal MI's values are fixed in play and shared by everyone using it. Each `BP_Unit` makes one in its Construction Script so selecting one Ghoul doesn't change the other. Two nodes share the name. Use the component one ("Target is Primitive Component"), which also puts the DMI on the mesh.
- **Overlay Material**: a second material drawn on top of a mesh's normal one, set or cleared with Set Overlay Material. It can't see the colour underneath, so it can only add light or cover it. Tried for selection in M3-T3, then dropped.
- **Blend Mode (Additive / Translucent)**: how a material mixes with what's behind it. **Additive** adds its colour (like a torch: only brighter, washing toward white). **Translucent** covers it by **Opacity** (0 = invisible, 1 = solid).
- **Desaturation (node)**: blends a colour toward grey by Fraction (0 = unchanged, 1 = grey). A **negative** Fraction pushes away from grey, which makes the colour more saturated. That's the selection look in `M_HeroUnit`/`M_EnemyUnit`.
- **Fresnel**: a material value that's 0 where a surface faces the camera and 1 at its edges (the bright rim on a soap bubble). Used for rim glows.
- **Actor Component**: a piece of behaviour you attach to an actor, the way `Cube` is a component but holding logic instead of a mesh. `BPC_Health` holds HP and the math on it; any actor that gets it can have health. Components added in the Components panel already exist when the Construction Script runs.
- **Game Instance**: the one object that survives level loads. Game Mode, controller and units are rebuilt per level. It's the future home of the hero pool and roster (M7).
- **Typed array / wildcard lock**: an array of `PDA_Hero` is not an array of `PDA_Unit`, even though one `PDA_Hero` fits a `PDA_Unit` variable. Wildcard nodes (Select, GET) take their type from the first wire and keep it.
- **Is Valid Index**: true when an array has an item at that index. Guards GET so a too-short roster skips the Area instead of returning None.
- **Reroute node**: a dot on a wire that only bends it, to keep a graph readable. Does nothing to the logic. Double-click a wire to add one.
- **Validated Get**: right-click a variable getter → *Convert to Validated Get*. The getter gets Is Valid / Is Not Valid exits built in, which is shorter than a separate Is Valid node.
- **Switch on (Enum)**: a flow node with one exit per enum value; execution leaves through the exit that matches. `BP_Unit`'s Construction Script uses Switch on `E_Team`: the Hero exit sets the hero material, the Enemy exit sets the enemy one. (**Select** is the data version: it picks one of several *values* instead of one of several exits.)
- **Object reference variable**: a variable whose type is a class (e.g. `BP_Area`) and whose value is the "street address" of one actor of that class, or **None** while empty. `BP_Unit.CurrentArea` holds the Area the unit stands in.
- **Pivot / actor origin**: the point an actor's location refers to. Where it sits inside the mesh matters: `BP_Unit`'s cube is lifted 90 cm so the origin is at its feet, and "place at this spot" stands it *on* the floor instead of half inside it.
- **Spawn / Spawn Actor from Class**: creating an actor *while the game runs* instead of placing it in the editor. The node takes a Class (`BP_Unit`) and a Spawn Transform (where it goes) and returns a reference to the new actor. `BP_BattleGameMode` spawns every unit at battle start.
- **Expose on Spawn**: a variable checkbox (needs Instance Editable too) that adds the variable as an input pin on Spawn Actor from Class. The value is set *before* the Construction Script runs, which is why `Team` colours the unit correctly.
- **Get All Actors Of Class**: searches the running level for every actor of one class and returns them as an array (`BP_Area` → all 9 Areas). Fine at battle start; too slow to call every frame.
- **Array / For Each Loop**: an array is a list of values of one type, sized by what's put in it. For Each Loop runs its Loop Body once per item, with **Array Element** = the current item and **Array Index** = its position (starting at 0).
- **Index / Length / Last Index**: an **index** is a slot's number in an array, starting at 0. **Length** counts the items; **Last Index** = Length − 1. One unit in `UnitsInArea` → Length 1, Last Index 0; an empty array → Length 0, Last Index −1.
- **Add vs Insert (array)**: **Add** puts an item on the end, no index needed. **Insert** puts it at an exact index and pushes the rest down; an index that doesn't exist (like −1) is skipped. `AddUnit` uses Add, because the order inside an Area doesn't matter.
- **Remove Item**: finds an item anywhere in the array and removes it; returns true if it was found. `RemoveUnit` uses it.
- **Target pin**: on a function from another Blueprint, Target = *which object does the work* (the receiver, not the caller). `AddUnit`'s Target is an Area (`CurrentArea`); the unit itself goes into the **Added Unit** input. Calling it with Target = self from `BP_Unit` is an error, because a unit has no `AddUnit`.
- **Local variable**: a variable that exists only inside one function while it runs, then disappears. Good for scratch values; not for settings, and not for anything that must be remembered between calls (`RecentlySelectedButton` as a local forgot the last button every time). The editor can't take typed-in default values for a local *array*, which is why `Layouts` became a member variable.
- **User-defined Structure (`S_`)**: a struct you create yourself (Content Browser → Blueprint → Structure). `S_SlotLayout` has one field, `Slots` (array of Vector). Wrapping an array in a struct is the way to get an "array of arrays", which Blueprint doesn't allow directly. **Split Struct Pin** (right-click a struct pin) shows its fields on the node itself, the same as a Break.
- **Lookup table**: data you look up instead of calculating. `Layouts` row N − 1 holds the slot positions for N units: one table, one loop, no Switch per case.
- **Get (a copy) vs Get (a ref)**: both read the item at an index. **A copy** hands you a duplicate, so changing it leaves the array alone; **a ref** hands you the item itself, so changes (e.g. Set Members on a struct) go into the array. For object references (`BP_Unit`) both point to the same actor anyway; it matters for structs, vectors and numbers.
- **Integer division**: dividing whole numbers throws the fraction away: (2 − 1) / 2 = 0, not 0.5. Convert to float before dividing when the fraction matters.
- **Float precision / storing time in tenths**: a float can't hold 0.1 exactly (it's stored as 0.1000000015), so adding 0.1 thirty times may give 2.9999998, not 3.0, and "has the clock reached 3.0?" can wrongly say no. Storing whole tenths in an Integer (25 = 2.5s) is always exact, like a shop that keeps prices in cents and only adds the decimal point on the price tag. `CurrentTimeTenths` works this way.
- **Rotate Vector Around Axis**: turns a vector by an angle around an axis. Axis (0, 0, 1) = around "up". `ArrangeUnits` rotates the slot layout 90° when an Area is longer in Y. With Axis (0, 0, 0) there's nothing to rotate around.
- **Set Actor Location vs Set Actor Relative Location**: Relative is measured from the parent the actor is attached to; an unattached actor's "relative" is the world. Units aren't attached to Areas, so use Set Actor Location with Area centre + offset.
- **Event Tick**: runs every frame. The node's mere presence makes the actor tick, even with nothing wired to it, so delete unused ones.
- **Destroy Actor**: removes an actor from the running game for good. `BP_Unit` destroys itself when its Area refuses it, so no "ghost" unit stands around that no Area lists. Put it last in a chain: anything after it works on an actor that's already on its way out.
- **Array into Target**: wire an *array* into a function's Target pin and Blueprint calls the function once per item, like a hidden For Each. The controller tints every neighbour with one `SetLook` node fed by `Neighbours`.
- **Nearly Equal (Float)**: compares two floats with an Error Tolerance instead of `==`. Floats are rarely exactly equal (an edge at 260 can come out as 259.9999), so "≈ 0" checks use this.
- **Tolerance**: the small margin you accept as "the same", e.g. 0.1 cm in `IsNeighbour`.
- **XOR (exclusive or)**: true when exactly one of two inputs is true, false when both or neither are. Tried in `IsNeighbour`; it rejected corners but let "touching line, but a gap" through.
- **Collision Handling Override**: what Spawn Actor does if something is already in the spot: spawn anyway, nudge the actor aside, or give up. DarkDungeon uses "Try To Adjust Location, But Always Spawn".
- **Custom trace channel**: a "kind of ray" you add yourself (Project Settings → Engine → Collision → Trace Channels). `AreaPick` has Default Response **Ignore**, so only components that opt in (the Areas' cubes, set to Block) are hit by it, and units never block Area picking. Saved in `Config/DefaultEngine.ini`.
- **Visibility channel**: a built-in trace channel. Despite the name it has nothing to do with what's drawn on screen: a hidden mesh with collision can block it, a visible one with NoCollision can't.
- **Multi trace**: a trace that reports everything it passes through. It still stops at the first **Block**; only **Overlap** responses let it continue.
- **Hit Component vs Hit Actor**: a ray physically hits a component (`TopCube`); the Hit Result also gives the actor that owns it (`BP_Area`). Casts read the actor.
- **Equal (Object) `==`**: compares two references: true when both point at the same actor (or both are None). Used to detect "clicked the same hero / Area again".
- **Selection state**: what the player has selected, kept in variables between clicks (`SelectedUnit`, `SelectedArea` on the controller). It must survive the click; wiping it at the end of every click makes "same as before" impossible.
- **Source of truth**: the one place that owns a fact; everything else asks it. Selection → the controller's variables; the looks are painted *from* them; "is this unit already in an Area?" → the Area's `UnitsInArea`, not the unit's `CurrentArea`.
- **Find References / Find in Blueprints**: right-click a function or variable in My Blueprint → Find References lists every node that uses it in this Blueprint; the binoculars (Ctrl+Shift+F) search all Blueprints.
- **Collapse to Function / Collapse Nodes / Comment box**: Collapse to Function turns selected nodes into a real function (inputs, outputs, locals, reusable). Collapse Nodes only packs them into a grey box (visual only). A comment box (select nodes, press C) is a labelled frame.
- **Class Reference (variable type)**: the purple version of a variable type. It holds a *kind* of thing (the house plan, `BP_EnemyUnit`), not one existing thing (blue Object Reference, `Area_7`). Spawn Actor's Class pin takes one. Its type also decides which Expose on Spawn pins the Spawn node shows: a `BP_Unit` class wire shows Current Area and Unit Data, a plain Actor class doesn't.
- **Call to Parent Function**: in a child Blueprint, an event like BeginPlay *replaces* the parent's version. Right-click the event → Add Call to Parent Function adds a node that runs the parent's version too. `BP_EnemyUnit` calls it first, so `BP_Unit`'s look loading and HP push still happen.
- **Modulo (`%`)**: the remainder after dividing. 7 % 3 = 1. Like a clock face: one hour past 12 is 1, not 13. (index + 1) % length steps through an array and wraps back to 0 after the last item.
- **Absolute vs relative time**: absolute = a fixed point on the clock ("lands at 5.0s"); relative = a distance from now ("lands in 2.5s"). Enemies store absolute time, so "is it due?" is one comparison; time left = due − clock.
- **Data Asset vs child Blueprint of a `PDA_`**: a Data Asset (Content Browser → Miscellaneous → Data Asset) is a *filled-in copy* of the form, e.g. `DA_GhoulAttack1`. A child Blueprint class is a *new blank form* with extra fields. Slots like `AttackSet` take filled-in copies, so a Blueprint class never shows up in their picker.
- **Running minimum**: finding the smallest item by walking the list once with a "best so far" note, replacing it whenever you meet something smaller. Like finding the shortest person in a queue. The first item must always be written down (`Array Index == 0`), or a note that starts at 0 never changes. `FindEarliestAttacker` does this.
- **Self-calling event (recursion)**: an event whose last step calls itself, so each call handles one step and asks "anything else?". `ResolveNextAttack` resolves one attack per call. Unlike a While Loop, the call-again can later wait (for an animation), and it stops when its Branch says no.
- **Value Range (variable)**: the Min/Max a number variable accepts in the Details panel. Set on a data field, it stops bad data at the source (attack time ≥ 1) instead of guarding against it in logic.
- **HUD (heads-up display)**: UI glued to the screen, not to anything in the world. The battle clock in the corner is HUD; the labels above units are not (they follow their unit).
- **Overlay (UMG)**: a panel that stacks its children on top of each other, like clear sheets on an overhead projector. Lower in the Hierarchy = drawn on top. `WBP_HealthBar` puts the "350 / 350" text over the bar this way.
- **Size Box overrides**: Width/Height Override force a widget's size in **pixels** (150 × 44), not as a scale. 1.1 means 1.1 pixels. With the slot set to Fill, the parent's size wins anyway.
- **Render Transform**: stretches or moves a widget's *picture* after layout is decided, like zooming a photo already glued into an album. Neighbours don't make room and scaled text blurs. For size, use Size Box or Font Size instead.
- **Named Slot**: a labelled empty socket in a parent widget's layout, like the blank "Notes:" box on a printed form. A child Widget Blueprint inherits the parent's layout and can't add widgets except into such a slot. Content placed in it *in the parent* is default content every user of the widget gets.
- **Clamp**: forcing a number to stay inside limits. Time left = Max(due − clock, 0), so an overdue attack shows "0.0s" ("resolving now") instead of a negative number.
- **Format Text**: a node that fills a template with values. `{Attack} | {Time}s` grows two input pins, `Attack` and `Time`.
- **Execution chain**: one run of white exec wires, started by one event call. Each click starts its own chain of `ResolveNextAttack`; two can be in flight at once inside one actor, both reading and writing its variables.
- **Race condition**: a bug where the result depends on which of two overlapping chains gets somewhere first, usually because they share a variable. Like two cooks using one whiteboard: B wipes A's number, A later reads B's. In T6 chain A carried on with chain B's `ResolveTimeTenths`.
- **Output Log**: Window → Output Log. Every Print (and engine message) as a line of text that stays, unlike on-screen Prints, which vanish. Copy lines from here to compare runs.
- **Get Game Time in Seconds**: real seconds since Play started, like a stopwatch (not the battle clock). Added to a Print, it shows *when* in real time each line happened.
- **Breakpoint**: a red stop sign on a node (select it, **F9**). When execution reaches it, the game freezes and you can hover over pins to see their values. **Resume** (F5) unfreezes.
- **Step Over / Step Out**: while frozen, **Step Over** (F10) runs one more node and freezes at whatever runs next, even in another Blueprint or seconds later. **Step Out** (Alt+Shift+F11) finishes the current function or macro and freezes back in the graph that called it.
- **Hover value (debugger)**: hovering a pin while frozen shows its value **from the last time that node ran**. A getter that hasn't run yet shows its default (0), not the variable's current value.
- **Macro**: a saved bundle of ordinary nodes that Unreal pastes in wherever you use it. For Each Loop is one (Branch, Assign, `<`, Sequence inside), which is why stepping can walk into it. Unlike a function, a macro can hold latent nodes and have several exec exits.
- **Visual Logger**: Tools → Debug → Visual Logger. A recorder: press Record before Play, then scrub through the run afterwards. One row per actor, a timeline with a mark per frame that logged something (same-frame lines stacked), and shapes drawn in the level at that moment. Nodes: **Vis Log Text** (a line in a **Log Category** like `Chain`) and **Vis Log Location** (a sphere at a spot, e.g. on the attacking enemy). Silent unless recording, and left out of shipping builds.
- **Battle queue**: the Game Mode's list of enemies (`EnemyQueue`) and the logic that resolves their attacks in time order after each clock jump. The Game Mode is the referee (decides what happens next); the Game State is the scoreboard (the clock everyone reads).

**Our game's terms**
- **Area**: one rectangle of the board. It has a capacity (how many units fit) and neighbors (rectangles sharing an edge).
- **Neighbour / adjacency**: two Areas are neighbours (adjacent) when they share a piece of edge longer than zero. Touching only at a corner doesn't count, and neither does a gap. Each `BP_Area` keeps its own `Neighbours` list.
- **Graph (maths)**: dots joined by lines. Here every Area is a dot and every neighbour pair is a line. Range, movement and paths (M5–M6) are walks along those lines.
- **Range overlap (interval)**: a range is the stretch between a start and an end on one axis (X 260 → 660). Two ranges overlap by **Min(ends) − Max(starts)**: positive = they share that length, 0 = they meet at one point, negative = a gap. Like two work shifts 9–17 and 12–20: together from the later start to the earlier end.
- **Range / Distance**: how many Area-steps apart two Areas are, counting neighbors, not meters.
- **Battle clock**: the single shared timer of a fight, in seconds.
- **Cost**: how many seconds an action pushes the clock forward.
- **Escalation**: each use of an ability raises its next cost; it slowly cools back down as the clock runs. In this game it works through Strain stacks (GDO §4.2).
- **Strain**: the extra cost one use of an ability leaves behind, like a bruise that fades on its own schedule. Slash paid 1.5s with ratio 0.4 → a Strain of 0.6s that fades to nothing over 4.5s. Several Strains can be active at once; the current cost is the base plus whatever is left of all of them.
- **On demand (calculated, not stored)**: work a number out at the moment you need it from things that don't go stale (the clock, when something happened), instead of keeping a copy and updating it every tick. `GetNextAttackDue` and the Strain fade both work this way.
- **Targeting vs effect**: two separate questions about an ability. Targeting = what you click and what's allowed (Shot: an enemy 1–3 Areas away; Shield Wall: no click, it's you). Effect = what happens then (damage, a status, a push). Keeping them apart means a self-buff that also deals damage needs no special case.
- **Data vs state**: data is what a designer types in and stays fixed during a battle (Slash's base cost, in `DA_Slash`). State is what changes while playing (Slash's current cost, its active Strains), and it lives on the unit. Never Set a variable on a Data Asset during play: everyone shares that one object.
- **Intent**: what an enemy will do next and when it lands, shown to the player in advance.
- **Child widget (User Created)**: one of your own widgets placed inside another, from the Palette's **User Created** section. `WBP_AbilityButton` is built once and placed 5 times in `WBP_AbilityBar`; change it once and all 5 change.
- **Button / On Clicked**: a Button widget holds exactly one child (put a Vertical Box inside for several). **On Clicked** (Details → Events → +) is the event that runs when it's clicked: an event, not a binding.
- **Alignment (Canvas slot)**: which point of the widget sits on its Position, like where you hold a picture when you pin it to a wall. (0, 0) = top-left corner, (0.5, 1) = middle of the bottom edge. With Anchor bottom-centre and Alignment (0.5, 1), Position (0, 0) puts a bar on the bottom edge, centred, whatever its size.
- **For Loop**: a loop that counts numbers from First Index to Last Index and hands you the current number (Index). Unlike For Each it doesn't need an array, so it can always visit all 5 slots. Unlike a While loop it needs no counter variable you reset by hand.
- **Select node**: picks one of several inputs by a number (or true/false). The bar uses Index 0–4 to pick the slot.
- **Output pins keep their last value**: an output pin on a node with white exec pins (Cast, Set, a function call) is a snapshot from the last time that node ran. A path that skips the node still reads the old snapshot (the Warrior's abilities came back after deselecting). On such paths, read the variable with a getter instead.
- **One way in (single writer)**: only one function may change a value (`AdvanceClock` for the time, `ChangeSelectedUnit` for the unit, `UpdateSelectedAbility` for the ability). Then every change can be announced in one place, and nothing slips past.
- **State, not history**: decide from the current value, not from what happened last time. The ability toggle asks "is this the ability selected *now*?" (a light switch looks at the lamp), so any number of clicks works. Dispatchers announce the resulting state, not the reason it changed.
- **Set Background Color vs Set Color and Opacity (Button)**: Background Color tints the button's tile; Color and Opacity tints its content (the text).
- **Abstract class (Generate Abstract Class)**: a "template only" class. You can make children of it, but never spawn or place it itself, like the recipe category "pasta dish": you cook carbonara, never "pasta dish". Checkbox in Class Settings. `BP_Unit` becomes one once every unit is a `BP_HeroUnit` or `BP_EnemyUnit`.
- **Child fits a parent pin, not the other way**: a `BP_HeroUnit` *is* a `BP_Unit`, so it plugs into any pin that wants a `BP_Unit`. A `BP_Unit` might be an enemy, so it doesn't plug into a `BP_HeroUnit` pin without a Cast. That's why retyping `SelectedHero` only broke its Set node. **None** fits any object pin.
- **Stale reference**: a variable still pointing at something that changed or no longer exists (a `SelectedEnemy` still holding the ghoul your Slash just killed). Avoid it by passing a value as a function input when it's only needed for one moment.
- **Refactor**: changing how the code is built without changing what the player sees (making `BP_HeroUnit`, renaming `SelectedHero`). Test it by checking that nothing changed, then commit before adding new features.
