# 🚀 Deployment Guide - Få spelet online

## 📋 Steg för att få spelet online

### 1. Skapa GitHub Repository

1. Gå till [GitHub.com](https://github.com) och logga in
2. Klicka på "New repository"
3. Namnge repository: `dungeon-of-numbers-edu`
4. Välj "Public" (för GitHub Pages)
5. Klicka "Create repository"

### 2. Pusha koden till GitHub

```bash
# Ersätt 'username' med ditt GitHub-användarnamn
git remote set-url origin https://github.com/USERNAME/dungeon-of-numbers-edu.git

# Pusha till GitHub
git push -u origin master
```

### 3. Aktivera GitHub Pages

1. Gå till din repository på GitHub
2. Klicka på "Settings" (höger i menyn)
3. Scrolla ner till "Pages" i vänstermenyn
4. Under "Source", välj "Deploy from a branch"
5. Välj "master" branch och "/ (root)" folder
6. Klicka "Save"

### 4. Vänta på deployment

- GitHub Pages kommer att bygga och deploya spelet automatiskt
- Det tar 2-5 minuter
- Du får en länk som: `https://USERNAME.github.io/dungeon-of-numbers-edu/`

## 🎮 Testa spelet online

### Snabbstart
1. Öppna `https://USERNAME.github.io/dungeon-of-numbers-edu/`
2. Klicka på "🎮 Spela Nu (Komplett Demo)"
3. Testa alla funktioner!

### Tillgängliga sidor
- **Huvudsida**: `index.html` - Översikt och länkar
- **Spel**: `simple-game.html` - Komplett demo med Art Bible
- **Systemtest**: `test-system.html` - Verifiera alla system
- **Asset-generator**: `generate_placeholders.html` - Skapa placeholder-bilder

## 🔧 Lokal utveckling

```bash
# Installera dependencies
npm install

# Starta utvecklingsserver
npm run dev

# Bygg för production
npm run build

# Förhandsvisa build
npm run preview
```

## 📱 GitHub Pages funktioner

### Automatisk deployment
- Varje push till `master` branch deployar automatiskt
- GitHub Actions bygger projektet
- Spelet blir tillgängligt på `https://USERNAME.github.io/dungeon-of-numbers-edu/`

### Custom domain (valfritt)
1. I repository Settings → Pages
2. Lägg till din domän i "Custom domain"
3. Lägg till CNAME-fil i root-mappen

## 🎯 Testa alla funktioner online

### Happy Path test
1. **Hub** → Välj "Tal & Algebra"
2. **Overworld** → Klicka på rum för att utforska
3. **Room** → Lös pussel eller starta strid
4. **Battle** → Besvara mattefrågor, besegra fiender
5. **Boss** → Times Troll med fasbyte efter 10 korrekta
6. **0 HP** → Teleport till hub (progress sparad)

### Systemtest
- Öppna `test-system.html`
- Klicka "Run All Tests"
- Verifiera att alla system fungerar

### Art Bible compliance
- Kontrollera färgpalett
- Verifiera UI-styling
- Testa karaktärsbeskrivningar
- Kontrollera boss-information

## 🐛 Felsökning

### Spelet laddar inte
- Kontrollera att alla filer är pushat till GitHub
- Vänta 2-5 minuter efter push
- Kontrollera GitHub Actions för fel

### Assets saknas
- Använd `generate_placeholders.html` för att skapa placeholder-bilder
- Kontrollera att alla asset-filer finns i `assets/` mappen

### Import-fel
- Kontrollera att alla TypeScript-filer kompilerar
- Kör `npm run build` lokalt för att testa

## 📊 Analytics online

Spelet loggar automatiskt:
- Frågesvar (korrekt/fel, tid, streak)
- Rum-progression
- Boss-encounters
- Player deaths och teleports

All data sparas i localStorage och kan exporteras för lärarvy.

## 🎉 Klart!

När allt är deployat kommer spelet att vara tillgängligt online med:
- ✅ Komplett Zelda + Final Fantasy gameplay
- ✅ Art Bible implementation
- ✅ Alla 5 dungeons och 4 bossar
- ✅ Save/Load system
- ✅ Analytics och telemetri
- ✅ Responsiv design för alla enheter

**Länk till spelet**: `https://USERNAME.github.io/dungeon-of-numbers-edu/`
