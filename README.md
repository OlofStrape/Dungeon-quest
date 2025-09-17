# 🏰 Dungeon of Numbers EDU - Åk 4

Ett **Zelda-liknande utforskningsspel med Final Fantasy-stridar** för matematikundervisning i årskurs 4.

## 🎮 Spelkoncept

- **Zelda-känsla i utforskning**: Tilemaps, interaktiva rum, pussel, låsta dörrar
- **Final Fantasy-känsla i strider**: Turbaserade encounters mot fiender/bossar där matteuppgifter är actions
- **Ingen död**: Vid 0 HP teleporteras spelaren till hub (träna mer), progression och loot behålls
- **Data-driven**: Läser `public/data/ak4_gameplay_params_enriched.json` och genererar encounters, UI, rum/utmaningar
- **Åk 4 komplett**: 5 dungeons med rum (E/C/A), grind, special, boss

## 🎨 Art Bible

Spelet följer en **"Vuxet men för barn"** estetik:
- **Zelda: BotW möter Studio Ghibli** översatt till 16-bit pixel art
- **Muted earth tones** + accent lighting color palette
- **Lanternbearer** (spelare) med timglasformade "lensing eyes"
- **Sidekick** som geometrisk "wisp" i lanternan
- **Bossar**: Times Troll, Hourglass Wraith, Shape Mimic, Pattern Phantom

## 🚀 Snabbstart

### Lokal utveckling
```bash
npm install
npm run dev
```

### Testa online
Öppna `simple-game.html` i webbläsaren för en komplett demo med Art Bible-styling.

## 📁 Projektstruktur

```
src/
├── scenes/           # Phaser scener
│   ├── HubScene.ts          # Dungeon-val
│   ├── OverworldScene.ts    # Zelda-liknande utforskning
│   ├── RoomScene.ts         # Pussel-rum
│   └── BattleScene.ts       # FF-liknande strider
├── game/             # Spellogik
│   ├── GameState.ts         # Spelarstatistik
│   ├── DataLoader.ts        # JSON-laddning
│   ├── QuestionGenerator.ts # Frågegenerering
│   ├── EncounterManager.ts  # Stridshantering
│   ├── PuzzleManager.ts     # Pusselramverk
│   ├── RoomFactory.ts       # Rum-byggare
│   ├── SaveSystem.ts        # Spara/ladda
│   └── Analytics.ts         # Telemetri
├── ecs/              # Entity-Component-System
│   ├── components.ts        # ECS-komponenter
│   └── systems/             # ECS-system
│       ├── MovementSystem.ts    # Zelda-rörelse
│       ├── InteractionSystem.ts # A-knapp interaktion
│       └── CollisionSystem.ts   # Collision detection
├── ui/               # UI-komponenter
│   ├── BattleUI.ts          # Strids-UI
│   ├── ProgressUI.ts        # Progress-UI
│   ├── GateUI.ts            # Val-UI
│   └── DragDropUI.ts        # Drag-drop-UI
└── data/             # Datatyper
    └── types.ts             # TypeScript interfaces
```

## 🎯 Kärnfunktioner

### Zelda-liknande utforskning
- **Top-down rörelse** med WASD/piltangenter
- **Tilemap collision** med väggar och objekt
- **Interaktion** med "A/Space" för dörrar, spakar, paneler
- **Triggers** som startar rum eller strider

### Final Fantasy-stridar
- **Turbaserade encounters** med HP-system
- **Matteuppgifter som actions** - rätt svar = skada på fiende
- **Boss-faser** med ökad svårighet efter N korrekta svar
- **Tidsgränser** för A-nivå och boss-rum

### Pusselramverk
- **Progress-rum**: 6 segment som fylls genom frågor
- **Choice-logic**: Tre portar med olika val
- **Drag-drop**: Canvas med målzoner
- **Special-rum**: Unika mekaniker per rum

### Progression
- **Ingen död**: 0 HP → teleport till hub
- **XP-system** baserat på svårighet och prestanda
- **Save/Load** med localStorage
- **Analytics** för lärarvy och anpassning

## 📊 Data-driven design

Allt innehåll kommer från `public/data/ak4_gameplay_params_enriched.json`:
- **Dungeons**: Tal & Algebra, Geometri, Tid, Mönster
- **Rumstyper**: combat, progress, choice-logic, drag-drop, special, grind, boss-combat
- **Frågetyper**: calc, clock, interval, perimeter, sequence, equation
- **Svårighetsgrader**: E, C, A, Boss
- **Belöningar**: XP, loot, ability unlocks

## 🎨 Art Bible Implementation

### Färgpalett
- **Deep Blue Gray**: `#2C3E50` (bakgrund)
- **Cool Blue**: `#3F5B6E` (paneler)
- **Moss Green**: `#7DAF66` (framgång)
- **Warm Torch**: `#E8C170` (accent)
- **Magic Light**: `#C6E4F2` (text)
- **HP Red**: `#E76F51` (HP-bar)
- **XP Teal**: `#2A9D8F` (XP-bar)

### Karaktärer
- **Lanternbearer**: Medel-låg hatt, knälång rock, timglasformade ögon
- **Sidekick**: Geometrisk wisp i lanternan med subtila matte-symboler
- **Bossar**: Unika designs per dungeon med specifika mekaniker

## 🧪 Testning

### Systemtest
Öppna `test-system.html` för att verifiera alla system fungerar.

### Happy Path
1. Hub → Tal-dungeon → Multiplikationskatapult
2. BattleScene: 6 frågor, HP-system, XP-belöning
3. Progress Room: 6 segment genom frågor
4. Times Troll: Boss med fasbyte efter 10 korrekta
5. 0 HP → Teleport till hub (progress sparad)

## 📈 Analytics

Spelet loggar automatiskt:
- **Frågesvar**: Korrekt/fel, tid, streak
- **Rum-progression**: In- och utträde, completion time
- **Boss-encounters**: Faser, completion time
- **Player deaths**: Orsak, rum
- **Hub teleports**: Orsak, från rum

## 🔧 Teknisk stack

- **Vite** - Build tool
- **TypeScript** - Type safety
- **Phaser 3** - Game framework
- **ECS** - Entity-Component-System arkitektur
- **localStorage** - Save/Load system

## 📝 Licens

Utvecklat för utbildningssyfte i årskurs 4 matematik.

## 🤝 Bidrag

Projektet följer Art Bible-specifikationer och data-driven design. Alla ändringar bör följa dessa riktlinjer.

---

**🎮 Implementerat enligt specifikation: Zelda + Final Fantasy + Ingen död + Data-driven + Art Bible!**