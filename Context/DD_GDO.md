### Base Info

TL:DR Turn-based roguelike. The player controls a party of 3 heroes of their choice (warrior, archer, mage, assassin, shaman). Regular battles involve only 2 heroes, while the boss ones 3 of them. The map is randomly generated with differently sized rectangles, and each one of them counts as a space. References (1-5) are the examples. Each hero has 4 unique skills, though the following pattern: Ability 1 \- Basic attack, Ability 2 & 3 \- Damaging Ability, Ability 4 \- Survivability. The action economy is derived from the Time System. There’s no mana to pay, no but everything has its cost in “Time”. Instead of cooldowns, each use increases the Time Cost, which decreases over time. Each enemy action is also described in “Time” \- i.e “3,5 \<Time\> Move \+ Attack” or “5 \<Time\> Self-Buff \+ Attack” etc.

// For MVP: Only 2 classes, warrior & archer. No random map generation, just fixes one for now.  
No real assets, just placeholders, mainly programming in BPs, doing the architecture stuff.


### Inspirations

Darkest Dungeon The Boardgame \- **the board only**: rooms made of differently sized Areas (refs 1–5). The rulebook (6) is background reading, not a rules source. ✅  
Shards of Order \- the resource system in form of “Time” (7-8)  
Wynncraft, minecraft MMO-RPG \- the 4 ability of each classes

---

> Legend: ✅ decided · 🟡 proposed (Claude's suggestion, open to change) · ❓ open question

### 1. Design Pillars 🟡

1. **Time is the only currency.** Every decision is "is this worth the seconds?". No mana, no cooldowns, no action points.
2. **Read the enemy.** Enemies telegraph their next action and *when* it lands. Good play = exploiting that window.
3. **Space matters.** Areas (rectangles) have capacity and distance; positioning is a real choice, not decoration.
4. **Two heroes, one tempo.** You drive both heroes from one timeline; escalating costs push you to weave them together.

### 2. Core Loop 🟡

- **Run:** pick 3 heroes → travel a branching map of rooms, Slay the Spire style → boss → win/lose. ✅ *(post-MVP)*
- **Room / Battle:** choose which 2 heroes fight → deploy → fight until all enemies or all heroes are down (some levels add a time limit, see §4.6).
- **Between battles** ✅ *(post-MVP)*: pick up upgrades, mostly **items you assign to a hero** (different stats/effects). Along the way: curses, heals, skill-tree upgrades. Details later.
- ❓ *(post-MVP)* What does the third, benched hero do while two fight?
- **MVP:** a single fixed battle (then a short fixed sequence of 2–3 battles if time allows).

### 3. Battlefield 🟡 (board look from refs 1–5)

- A room is made of **Areas**, rectangles of different sizes. ✅
- Each Area has: **capacity** (the pips in refs: how many units fit; scales with size, 2–4 in the MVP room), **neighbors** (shared edge = adjacent), and a **spawn side** (None / Hero / Enemy). ✅ Other tags (e.g. High Ground) are post-MVP.
- MVP room spawns: enemies in the left column (7 slots, room for groups of 3–4), heroes in the two right corners (4 slots). 🟡 Revisit after the first spawn playtest.
- First level (`LVL_Battle_01`): **2 heroes vs 3 enemies**, one unit per spawn Area. ✅ Spawned by the Game Mode at battle start.
- **Distance / Range** = number of Area steps between two Areas (graph distance, not world distance).
- Units stand *in* an Area, not on a grid tile. Abilities target an **Area** (and pick unit(s) inside it).
- **No stances.** Abilities only check range; positioning on the board does the rest. ✅
- Areas **touch edge to edge**; each draws a thin dark border so the rectangles read clearly. Gaps only where they shape the room. ✅
- MVP: one hand-built room (~8–10 Areas). Built in M1-T3: 9 Areas, symmetric (see Decisions #21). Procedural generation later, but the data shape (Areas + adjacency) is designed now so generation can plug in. ✅
- High/Low Ground: **post-MVP** nice-to-have, not in the demo (decided 2026-10-16). Kept as a possible fun feature for later.

### 4. The Time System (core identity)

#### 4.1 Model: Global Timeline ✅

- **Unit: seconds (s).** "Time" in design talk = seconds on the battle clock. ✅
- One shared battle clock. Each enemy runs its own action on it: "Ghoul: **3s** Move + Attack" = it lands 3s after it started. ✅
- **The player is one actor on the timeline, controlling 2 heroes.** You pick an action from *either* hero, freely swapping between them. The action's cost advances the clock. ✅
- **Hero actions resolve at the start** of their duration; the cost is "recovery" time. ✅
- Example ✅: Ghoul's attack is due in 3s. You use a 4s Slash. Slash lands immediately; if it kills the Ghoul, its attack never happens. If not, the Ghoul attacks at 3s, and it's already 1s into its next action when you get control back.
- **The incentive to swap heroes is escalation** (§4.2): spamming one hero's best ability gets expensive, so you alternate. ✅
- ❓ Are both heroes always "equal" on the board, or does the hero who acted last matter (e.g. the one in recovery can't react)?

#### 4.2 Escalating cost ("instead of cooldowns") 🟡
- Each ability has `BaseCost`. Each use adds `+Escalation` to its current cost.
- Current cost decays back toward `BaseCost` at `DecayRate` per 1s that passes on the clock.
- Example: Shield Wall base 2s, +3s per use, decays 0.5s per second. Use it twice quickly → costs 2s, then 5s. Wait 6s → back to 2s.
- **Everything escalates**, including the Basic Attack and the basic Move. ✅ The Basic Attack is still the "cheap option": slightly lower base cost and a smaller increase per use than other abilities. 🟡
- ❓ Show escalation as a number on the ability button, or as a "heat" bar?

#### 4.3 Movement ✅
- **Every hero has a basic Move** action (not one of their abilities). It costs seconds per Area moved (e.g. 1s per Area) and **escalates** like everything else, so you can't reposition for free over and over. ✅
- **Every hero also has a 5th ability: a Mobility ability** that moves *and* does something (e.g. Charge: move + hit). ✅ See §6.
- **Enemies move the board-game way:** they move up to their Speed (in Areas) toward their target, then attack if they're in range. If they can't reach, they still move as far as they can and the attack doesn't happen. ✅

#### 4.4 Enemy Intents 🟡
- Each enemy always shows its **next action + seconds left** ("3.5s Move + Attack Closest").
- Targeting labels ✅: **Closest / Furthest / Highest HP / Lowest HP**. Each enemy action picks one; we'll choose per enemy as we design them.
- ❓ *(low priority, decide during M6)* Is the *target* shown in advance, or only the action?

#### 4.5 Statuses 🟡
- Durations in seconds, not turns (e.g. Bleed 30 dmg every 1s for 4s). Fits the timeline naturally. ❓ confirm

#### 4.6 Battle Clock ✅
- **Not a general rule.** Some levels can have it as a special feature (e.g. "Reinforcements arrive at 30s"). Not in MVP.

### 5. Combat Resolution ✅
- **Damage ranges, always hit.** E.g. Slash deals 80–110. No accuracy/dodge rolls. ✅
- Numbers live at a "hundreds" scale (hero HP ~800–1200, enemy HP ~300–600). 🟡
- ❓ Crits? (Proposal: none for MVP; the range already gives variance.)
- ❓ Show the range on hover ("80–110") or the average?

### 6. Heroes 🟡 (MVP: Warrior & Archer, first-draft kits, numbers are placeholders)

Pattern ✅: A1 Basic · A2/A3 Damage · A4 Survivability · **A5 Mobility (move + effect)** · plus the shared basic **Move**.

How to read the Cost column: `2 (+1)` = costs 2s now, and each use adds +1s to the next use (it cools back down over time, §4.2).

**All heroes**
| # | Name | Cost (s) | Range | Effect |
|---|---|---|---|---|
| — | Move | 1 per Area (+0.5) | 1+ | Move to a connected Area |

**Warrior**: frontline, wants to be in the enemy's Area. HP ~1100.
| # | Name | Cost (s) | Range | Effect |
|---|---|---|---|---|
| A1 | Slash | 1.5 (+0.5) | 0 | 80–110 dmg to 1 enemy |
| A2 | Cleave | 3 (+2) | 0 | 60–80 dmg to all enemies in Area |
| A3 | Crushing Blow | 4 (+3) | 0 | 150–190 dmg to 1 enemy |
| A4 | Shield Wall | 2 (+3) | self | Take ½ dmg for 4s; enemies in Area must target Warrior |
| A5 | Charge | 3 (+2) | 1–2 | Move to target Area, 90–120 dmg, push target 1 Area |

**Archer**: backline, wants distance. HP ~800.
| # | Name | Cost (s) | Range | Effect |
|---|---|---|---|---|
| A1 | Shot | 1.5 (+0.5) | 1–3 | 70–100 dmg to 1 enemy |
| A2 | Volley | 4 (+2) | 1–3 | 50–70 dmg to all enemies in Area |
| A3 | Pinning Arrow | 3 (+2) | 1–3 | 50–70 dmg, target's current action delayed +1.5s |
| A4 | Hunker Down | 2 (+3) | self | Take ½ dmg for 3s |
| A5 | Tumble Shot | 2.5 (+2) | 1–3 | Move 1 Area away from enemies, then shoot 40–60 dmg |

Note: A3 "Pinning Arrow" shows the unique design space of the Time system: **manipulating enemy timing** (delay, haste) is something cooldown games can't do.

Post-MVP: Mage, Assassin, Shaman.

❓ Hero stats beyond HP? (Items will add stats/effects later, see §2.) Leveling within a run?

### 7. Enemies 🟡 (MVP: 2 types)

Enemies move toward their target up to their **Speed** (Areas), then attack if in range (§4.3).

| Enemy | HP | Speed | Actions |
|---|---|---|---|
| Ghoul (melee) | 500 | 2 | 3.5s Move + Attack Closest (90–120) · 5s Self-Buff + Attack |
| Cultist (ranged) | 350 | 1 | 4s Attack Furthest (60–80) · 3s Curse Highest HP (−20% dmg dealt for 5s) |

❓ How enemies choose their next action: "half fixed, half random", details to decide. Example idea: a fixed opening action, then a weighted random pick. Needed by M6.

### 8. MVP Scope

**In** ✅ / 🟡
- 1 fixed room, ~8–10 Areas, 3D top-down board with placeholder meshes ✅
- Warrior + Archer (2-hero battle), 5 abilities each + basic Move
- 2 enemy types, 1 encounter
- Timeline UI, escalating costs, enemy intents
- Win / lose screen + restart
- Placeholder art only, Blueprints only ✅

**Out (later)**
- Hero selection & party of 3, boss battles with 3 heroes
- Procedural map generation
- Mage / Assassin / Shaman
- Run map, items, curses, heals, skill-tree upgrades
- Level-specific battle clocks

### 9. Open Questions (design), summary
1. Enemy action choice: what exactly is "half fixed, half random"? *(M6)*
2. Enemy intent: show the target in advance? *(M6, low priority)*
3. Escalation display: number on the button, or a "heat" bar? *(M5)*
4. Statuses in seconds: confirm. *(M5)*
5. Benched third hero: does it do anything? *(post-MVP)*
6. Permadeath for heroes within a run? *(post-MVP)*
7. High/Low Ground? *(post-MVP)*

Resolved: ~~Time model~~ (global timeline, seconds, one player actor, actions resolve at start) · ~~Stances~~ (dropped) · ~~Dice~~ (damage ranges, always hit) · ~~Presentation~~ (3D top-down board) · ~~Movement~~ (basic Move + 5th Mobility ability, both escalate) · ~~Basic Attack escalation~~ (yes, smaller) · ~~Enemy movement~~ (move up to Speed, attack if in range) · ~~Battle clock~~ (per-level feature only) · ~~Run structure~~ (Slay the Spire-like, items on heroes, post-MVP)
