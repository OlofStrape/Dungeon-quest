# Art Bible - Dungeon of Numbers EDU (Åk 4)

## 🎨 Övergripande Stil

**Ton**: "Vuxet men för barn" – mystik, nyfikenhet, trygg äventyrskänsla. Inte gulligt.

**Estetik**: Zelda: BotW möter Studio Ghibli i semi-realistic concept → översätts till 16-bit pixel art in-game.

## 🌈 Färgpalett

### Primära färger (Art Bible)
- `#2C3E50` - Djup blågrå (deep-blue-gray)
- `#3F5B6E` - Kall blå (cool-blue)  
- `#7DAF66` - Mossgrön (moss-green)
- `#E8C170` - Varm fackla (warm-torch)
- `#C6E4F2` - Magiljus (magic-light)

### UI-färger
- `#22313A` - Mörk skiffer (slate-dark)
- `#DAE4EA` - Blek text (pale-text)
- `#E76F51` - HP-röd (hp-red)
- `#2A9D8F` - XP-teal (xp-teal)

## 👤 Karaktärer

### 1. Lanternbearer (Spelaren)
**Koncept**: Medel-låg hatt/huva, knälång rock/kappa, robust boots
**Signatur**: Timglasformade "lensing eyes" (vertikala elips-linser med svag glöd)
**Lanterna**: Sidomonterad/fram, sidekick bor i lanternan
**Färger**: Djup blågrå med varma läderdetaljer; inre ljus kallt blågrönt

**In-game specs**:
- Storlek: 48×48 px
- Animationer: 4 riktningar, 6 frames per riktning
- Idle blink: 2–3 frames (ögonglöd pulserar)
- Attack-cast: 6 frames
- Hit-stun: 2 frames

### 2. Sidekick (i lanternan)
**Koncept**: Geometrisk "wisp" - liten flytande tetra/polygonskärva, vinklad, inte gullig
**Ögon**: Små glödande slitsar (inte runda)
**Färg**: Kall cyan/blågrönt med diskreta partiklar

**In-game specs**:
- Storlek: 32×32 px
- Animationer: idle 4 frames, speak 2 frames, hint-spark 4 frames, dash 4 frames

### 3. Fiender (Åk 4)
**Times Troll** (Tal-boss): Massiv stenfigur med urtavla i bröstet
**Hourglass Wraith** (Tid-boss): Svävande skepnad med timglas inbäddat
**Shape Mimic** (Geometri-boss): Skiftar silhuett mellan triangel/rektangel/cirkel

**In-game specs**:
- Storlek: 96×96 px
- Animationer: 6–8 frames (idle/attack/hit)

## 🏰 Miljöer

### Tilesets (32×32 px tiles)
**Biome-kit Åk 4**:

1. **Talsalarna**: Sten, golv med subtla sifferinlägg, bron-/katapult-props
2. **Tidens sal**: Klockväggar, kuggar, brons/obsidian, timglas-props
3. **Geometrins salar**: Polerade stenplattor, spegelpaneler, mätstolpar
4. **Algebra**: Symbolgolv, mönsterbryggor, variabelportar
5. **Datasalarna**: Tavlor, diagramstativ, skrivpulpet, pergament/skrivdon

### Props/VFX
- Facklor (4-frame eldloop)
- Svävande partiklar
- Dörrar/portar (öppna/stäng 4 frames)
- "Glow-runes" (svaga)

## 🎮 UI

### Pixelhud
- **HP-bar**: Horisontell, mörk ram, fyll i `#E76F51`
- **XP-bar**: `#2A9D8F`
- **Hint-knapp**: Liten ikon av sidekick-silhuett
- **Paneler**: Mörk skiffer (`#22313A`) med ljus text (`#DAE4EA`)

## 📁 Asset-struktur

```
assets/
├── sprites/
│   ├── chars/
│   │   ├── lanternbearer_walk.png + .json
│   │   ├── lanternbearer_idle.png + .json
│   │   └── lanternbearer_cast.png + .json
│   ├── enemies/
│   │   ├── times_troll.png + .json
│   │   ├── hourglass_wraith.png + .json
│   │   └── shape_mimic.png + .json
│   └── fx/
│       └── sidekick_idle.png + .json
├── tilesets/
│   ├── tal_tileset.png + .json
│   ├── tid_tileset.png + .json
│   ├── geometri_tileset.png + .json
│   ├── algebra_tileset.png + .json
│   └── data_tileset.png + .json
└── ui/
    └── ui_atlas.png + .json
```

## 🔧 Tekniska Specs

### Sprites
- **Format**: PNG + Phaser atlas JSON (array format)
- **Bakgrund**: Magenta `#FF00FF` eller alfa-transparent
- **Naming**: `chars/lanternbearer_walk.png + .json`

### Tilesets
- **Storlek**: 32×32 px
- **Tilemargin**: 0
- **Tilespacing**: 0
- **Export**: TSX/TMX eller JSON tilemap

### Animationer
- **Walk/cast**: 8–12 fps
- **Idle**: 4–6 fps

### Palette lock
- Håll dig inom 24–32 färger per set om möjligt (retro)

## 🚫 Negativa prompts

**Undvik**:
- Chibi-stil
- Kawaii
- Stora runda ögon
- Spetsiga magikerhattar
- Randiga scarf
- Direkt likhet med känd IP
- Mättade leksaksfärger

## 🎯 Mini-brief per Åk 4-dungeon

### Tal
Stenhallar med diskreta sifferinlägg; katapult, brosegment.

### Tid
Urtavlor, kugghjul, timglas-pelare, brons/obsidian.

### Geometri
Speglar, måttstolpar, polerade plattor med kantlinjer.

### Algebra
Symbolgolv, mönsterbroar, variabelportar med symbolpaneler.

### Data
Tavlor, staplar, rullar/pergament, med bläckfläckar och linjal.

## 📝 AI Prompts

### Concept Art Prompt
"Create a semi-realistic fantasy concept illustration of a 'Lanternbearer' player character for a math-adventure game. Adult-leaning tone for ages 11–14. Silhouette: hood or low hat (not pointed), knee-length coat, sturdy boots, a front lantern that houses a small geometric wisp sidekick. Signature eyes: hourglass-shaped luminous lenses (not round, not cute). Color: deep blue-gray fabrics, warm leather, cool blue-green inner glow from the lantern. Lighting: torches and faint magical symbols (π, Σ, ∠) etched subtly in metal, not dominant. Composition: 3-quarter view, ambient dungeon background (stone, runic trims, torchlight). Avoid chibi or oversized eyes. No strong resemblance to existing IP."

### In-game Pixel Art Prompt
"Create a 16-bit pixel art sprite sheet for a top-down adventure game character 'Lanternbearer'. Size: 48×48 px per frame. 4 directions (up/down/left/right). 6 walking frames per direction. Idle (3 frames, subtle eye-glow pulse). Cast (6 frames). Hit-stun (2 frames). Colors: limited palette with deep blue-gray clothing, cool blue-green lantern glow, small hourglass-shaped luminous eyes. Adult-leaning style, not cute. Export as a packed PNG spritesheet with a JSON frame atlas (Phaser-compatible). Avoid chibi proportions and pointed wizard hats."

### UI Prompt
"Design a pixel art UI kit for a top-down adventure RPG: HP bar (red), XP bar (teal), framed panels with slate-dark background and pale text, small icons for hint (geometric wisp), clock, shape, and data/graph. 16-bit style, readable at 2× scale, not cute. Export as UI atlas PNG + JSON."
