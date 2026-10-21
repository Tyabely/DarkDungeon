### DarkDungeon — Conventions

Quick-reference rules for folders, names, and Git. If something here stops making sense, change it — but change it here first, then in the project.

---

### 1. Folders

Everything we make lives in **one top folder**, organized **by game feature** (not by file type).

```
Content/
├── DarkDungeon/        ← everything we make
│   ├── Core/           game-wide setup: Game Mode, Player Controller, camera
│   ├── Board/          Areas and room layouts
│   ├── Units/          what heroes and enemies share: BP_Unit, PDA_Unit, E_Team
│   │   ├── Heroes/     PDA_Hero, PDA_HeroAbility, hero material, DA_ files
│   │   │   └── Warrior/   only once a hero has its own files (mesh, material, abilities) → DA_Warrior moves in
│   │   └── Enemies/    PDA_Enemy, PDA_EnemyMove, enemy material, DA_ files (Ghoul/ etc. same rule)
│   ├── Combat/         battle clock, turn flow, base for all abilities
│   ├── UI/
│   ├── Input/          (create when needed)
│   ├── Maps/           levels (create when needed)
│   └── Shared/         placeholder meshes/materials used everywhere
├── Developers/kacpe/   personal sandbox for experiments — never referenced by real game files
└── (template folders)  read-only cookbook — don't edit, delete before portfolio
```

Rules:
- **New folders only when the first file needs them.** (Git doesn't store empty folders.)
- **Template folders** (`TopDown/`, `Variant_Strategy/`, `Characters/`, `Cursor/`, `LevelPrototyping/`): read, don't edit. To experiment with one, duplicate it into `Developers/kacpe/` or `DarkDungeon/` first.
- **Sandbox** (`Developers/kacpe/`): anything goes, but real game files must never point at something in here.

---

### 2. Asset names: `Prefix_Name`

- **PascalCase** — each word capitalized, no spaces: `HeroUnit`.
- Extra underscore only for a **variant**: `MI_Area_Highlighted`.
- English names.

| What it is | Prefix | Example |
|---|---|---|
| Blueprint (actors, game mode, controller…) | `BP_` | `BP_Area`, `BP_BattleGameMode` |
| Blueprint Interface | `BPI_` | `BPI_Damageable` |
| Blueprint Function Library | `BPFL_` | `BPFL_BoardMath` |
| Actor Component | `AC_` | `AC_Health` |
| Widget Blueprint (UI) | `WBP_` | `WBP_Timeline` |
| Data Asset *template* (Primary Data Asset class) | `PDA_` | `PDA_HeroDefinition` |
| Data Asset (filled-in copy) | `DA_` | `DA_Warrior` |
| Data Table | `DT_` | `DT_Abilities` |
| Structure | `S_` | `S_AbilityCost` |
| Enumeration | `E_` | `E_TargetRule` |
| Level | `LVL_` | `LVL_Battle_01` |
| Input Action / Input Mapping Context | `IA_` / `IMC_` | `IA_Select`, `IMC_Battle` |
| Material / Material Instance | `M_` / `MI_` | `M_Area`, `MI_Area_Highlighted` |
| Static Mesh / Texture | `SM_` / `T_` | `SM_AreaTile`, `T_Icon_Slash` |

New asset type not in the table? Add a row here before using it.

---

### 3. Inside Blueprints

- **Variables:** PascalCase. Booleans (true/false) start with lowercase `b`: `bIsSelected`, `bCanAct`.
- **Functions:** named as actions (verb first): `GetDistance`, `ApplyDamage`, `AdvanceClock`.
- **Events / Event Dispatchers:** named as what happened: `OnUnitDied`, `OnClockAdvanced`.
- **Readability:** comment boxes around groups of nodes, reroute nodes instead of wire spaghetti, big graphs collapsed into functions.

---

### 4. Moving & renaming (⚠️ important)

- **Only move/rename inside the Content Browser — never in Windows File Explorer.** Assets point at each other; Explorer breaks those pointers, the Content Browser updates them.
- After moving things, right-click the folder → **Update Redirector References** to clean up the leftover "this moved over there" files (Redirectors).

---

### 5. Git

Layout:
```
F:\P_UE5\DarkDungeon\            ← repo root
├── .gitattributes               LFS rules for the whole repo (no slash in rules → applies to all subfolders)
├── Context\                     docs
├── README.md
└── DarkDungeon_Project\
    ├── .gitignore               skips Intermediate/, Saved/, DerivedDataCache/ (rules with a slash → only apply next to the file)
    └── ...
```

Rules:
- Binary files (`.uasset`, `.umap`, images, PDFs) go through **Git LFS**. Adding a new binary type (e.g. `.fbx`, `.wav`)? Check it has a line in `.gitattributes` *before* committing it.
- **Commit often**, at least at the end of every session and before anything risky (big refactor, MCP session, engine plugin change).
- **Commit messages:** short, say *what changed*: `Add BP_Area with highlight on click`, `Fix clock skipping enemy actions`.
- **Close the editor before** moving project folders or switching to an old commit.
