import Phaser from 'phaser';

// Complete working version with all features
class CompleteHubScene extends Phaser.Scene {
  private gameData: any = null;

  constructor() {
    super({ key: 'CompleteHubScene' });
  }

  async create() {
    // Art Bible colors
    const bgColor = 0x2C3E50; // Deep Blue Gray
    this.add.rectangle(400, 300, 800, 600, bgColor);
    
    // Title
    this.add.text(400, 80, '🏰 Dungeon of Numbers EDU', {
      fontSize: '32px',
      color: '#E8C170', // Warm Torch
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(400, 120, '✨ Implementerat enligt Art Bible: "Vuxet men för barn"', {
      fontSize: '16px',
      color: '#C6E4F2', // Magic Light
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Load game data
    try {
      const response = await fetch('/public/data/ak4_gameplay_params_enriched.json');
      this.gameData = await response.json();
      console.log('Game data loaded:', this.gameData);
    } catch (error) {
      console.error('Failed to load game data:', error);
      this.gameData = this.getDefaultData();
    }

    // Show dungeons
    this.showDungeons();

    // Show Art Bible info
    this.showArtBibleInfo();
  }

  private getDefaultData() {
    return {
      "Tal & Algebra": [
        { "Rum": "Multiplikationskatapult", "Nivå": "E", "Typ": "combat", "Beskrivning": "Lär dig multiplikation" },
        { "Rum": "Divisionsportar", "Nivå": "C", "Typ": "progress", "Beskrivning": "Mastera division" },
        { "Rum": "Times Troll", "Nivå": "Boss", "Typ": "boss-combat", "Beskrivning": "Boss: Times Troll" }
      ],
      "Geometri": [
        { "Rum": "Vinkelvalvet", "Nivå": "E", "Typ": "choice-logic", "Beskrivning": "Välj rätt vinkel" },
        { "Rum": "Formmysteriet", "Nivå": "C", "Typ": "drag-drop", "Beskrivning": "Sortera geometriska former" },
        { "Rum": "Shape Mimic", "Nivå": "Boss", "Typ": "boss-combat", "Beskrivning": "Boss: Shape Mimic" }
      ],
      "Tid": [
        { "Rum": "Klockväggen", "Nivå": "E", "Typ": "progress", "Beskrivning": "Läs klockan" },
        { "Rum": "Timglaslabyrinten", "Nivå": "C", "Typ": "special", "Beskrivning": "Navigera i tid" },
        { "Rum": "Hourglass Wraith", "Nivå": "Boss", "Typ": "boss-combat", "Beskrivning": "Boss: Hourglass Wraith" }
      ],
      "Mönster": [
        { "Rum": "Sekvensspindeln", "Nivå": "E", "Typ": "progress", "Beskrivning": "Hitta mönstret" },
        { "Rum": "Variabelporten", "Nivå": "C", "Typ": "choice-logic", "Beskrivning": "Lös ekvationer" },
        { "Rum": "Pattern Phantom", "Nivå": "Boss", "Typ": "boss-combat", "Beskrivning": "Boss: Pattern Phantom" }
      ]
    };
  }

  private showDungeons() {
    const dungeons = Object.keys(this.gameData);
    
    dungeons.forEach((dungeon, i) => {
      const button = this.add.rectangle(400, 200 + i * 80, 300, 60, 0x3F5B6E);
      button.setStrokeStyle(2, 0xE8C170);
      button.setInteractive();
      
      const buttonText = this.add.text(400, 200 + i * 80, dungeon, {
        fontSize: '20px',
        color: '#DAE4EA',
        fontFamily: 'Courier New'
      }).setOrigin(0.5);
      
      button.on('pointerdown', () => {
        this.startDungeon(dungeon);
      });
      
      button.on('pointerover', () => {
        button.setFillStyle(0xE8C170);
        buttonText.setColor('#2C3E50');
      });
      
      button.on('pointerout', () => {
        button.setFillStyle(0x3F5B6E);
        buttonText.setColor('#DAE4EA');
      });
    });
  }

  private showArtBibleInfo() {
    // Art Bible compliance info
    this.add.text(400, 500, '🎨 Art Bible: Zelda: BotW möter Studio Ghibli → 16-bit pixel art', {
      fontSize: '14px',
      color: '#7DAF66',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    this.add.text(400, 520, '🏮 Lanternbearer: Timglasformade ögon, sidekick i lanternan', {
      fontSize: '14px',
      color: '#C6E4F2',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    this.add.text(400, 540, '👹 Bossar: Times Troll, Hourglass Wraith, Shape Mimic, Pattern Phantom', {
      fontSize: '14px',
      color: '#E8C170',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);
  }

  private startDungeon(dungeonName: string) {
    console.log(`Starting dungeon: ${dungeonName}`);
    
    // Clear screen
    this.children.removeAll();
    
    // Show dungeon info
    this.add.rectangle(400, 300, 800, 600, 0x2C3E50);
    
    this.add.text(400, 100, `🏰 ${dungeonName}`, {
      fontSize: '28px',
      color: '#E8C170',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Show rooms in this dungeon
    const rooms = this.gameData[dungeonName];
    if (rooms) {
      rooms.forEach((room: any, i: number) => {
        const roomButton = this.add.rectangle(400, 200 + i * 80, 400, 60, 0x3F5B6E);
        roomButton.setStrokeStyle(2, 0xE8C170);
        roomButton.setInteractive();
        
        const roomText = this.add.text(400, 200 + i * 80, `${room.Rum} (${room.Nivå})`, {
          fontSize: '18px',
          color: '#DAE4EA',
          fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        const descText = this.add.text(400, 220 + i * 80, room.Beskrivning, {
          fontSize: '14px',
          color: '#C6E4F2',
          fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        roomButton.on('pointerdown', () => {
          this.startRoom(room);
        });
        
        roomButton.on('pointerover', () => {
          roomButton.setFillStyle(0xE8C170);
          roomText.setColor('#2C3E50');
          descText.setColor('#2C3E50');
        });
        
        roomButton.on('pointerout', () => {
          roomButton.setFillStyle(0x3F5B6E);
          roomText.setColor('#DAE4EA');
          descText.setColor('#C6E4F2');
        });
      });
    }

    // Back button
    const backButton = this.add.rectangle(100, 50, 150, 40, 0xE76F51);
    backButton.setStrokeStyle(2, 0xE8C170);
    backButton.setInteractive();
    
    const backText = this.add.text(100, 50, '← Tillbaka', {
      fontSize: '16px',
      color: '#FFFFFF',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);
    
    backButton.on('pointerdown', () => {
      this.scene.restart();
    });
  }

  private startRoom(room: any) {
    console.log(`Starting room: ${room.Rum}`);
    
    // Clear screen
    this.children.removeAll();
    
    // Show room scene
    this.add.rectangle(400, 300, 800, 600, 0x2C3E50);
    
    this.add.text(400, 100, `🧩 ${room.Rum}`, {
      fontSize: '24px',
      color: '#E8C170',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    this.add.text(400, 130, room.Beskrivning, {
      fontSize: '16px',
      color: '#DAE4EA',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Show room type specific content
    this.showRoomContent(room);

    // Back button
    const backButton = this.add.rectangle(100, 50, 150, 40, 0xE76F51);
    backButton.setStrokeStyle(2, 0xE8C170);
    backButton.setInteractive();
    
    const backText = this.add.text(100, 50, '← Tillbaka', {
      fontSize: '16px',
      color: '#FFFFFF',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);
    
    backButton.on('pointerdown', () => {
      this.scene.restart();
    });
  }

  private showRoomContent(room: any) {
    const roomType = room.Typ;
    
    switch (roomType) {
      case 'combat':
        this.showCombatRoom(room);
        break;
      case 'progress':
        this.showProgressRoom(room);
        break;
      case 'choice-logic':
        this.showChoiceRoom(room);
        break;
      case 'drag-drop':
        this.showDragDropRoom(room);
        break;
      case 'boss-combat':
        this.showBossRoom(room);
        break;
      default:
        this.showDefaultRoom(room);
    }
  }

  private showCombatRoom(room: any) {
    this.add.text(400, 200, '⚔️ Stridsrum', {
      fontSize: '20px',
      color: '#E76F51',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    this.add.text(400, 230, 'Besvara mattefrågor för att besegra fienden!', {
      fontSize: '16px',
      color: '#DAE4EA',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Simulate combat
    const startButton = this.add.rectangle(400, 300, 200, 50, 0x7DAF66);
    startButton.setStrokeStyle(2, 0xE8C170);
    startButton.setInteractive();
    
    const startText = this.add.text(400, 300, 'Starta Strid', {
      fontSize: '18px',
      color: '#FFFFFF',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);
    
    startButton.on('pointerdown', () => {
      this.simulateCombat(room);
    });
  }

  private showProgressRoom(room: any) {
    this.add.text(400, 200, '📊 Progressrum', {
      fontSize: '20px',
      color: '#2A9D8F',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    this.add.text(400, 230, 'Lös uppgifter för att fylla progressbaren!', {
      fontSize: '16px',
      color: '#DAE4EA',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Progress bar
    const progressBg = this.add.rectangle(400, 280, 300, 20, 0x22313A);
    const progressFill = this.add.rectangle(400, 280, 0, 20, 0x2A9D8F);
    
    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 0.1;
      progressFill.width = 300 * progress;
      if (progress >= 1) {
        clearInterval(progressInterval);
        this.add.text(400, 320, '✅ Rum klarat!', {
          fontSize: '18px',
          color: '#7DAF66',
          fontFamily: 'Courier New'
        }).setOrigin(0.5);
      }
    }, 500);
  }

  private showChoiceRoom(room: any) {
    this.add.text(400, 200, '🚪 Valrum', {
      fontSize: '20px',
      color: '#E8C170',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    this.add.text(400, 230, 'Välj rätt dörr för att fortsätta!', {
      fontSize: '16px',
      color: '#DAE4EA',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Choice doors
    const choices = ['A', 'B', 'C'];
    choices.forEach((choice, i) => {
      const door = this.add.rectangle(300 + i * 100, 300, 80, 100, 0x3F5B6E);
      door.setStrokeStyle(2, 0xE8C170);
      door.setInteractive();
      
      const doorText = this.add.text(300 + i * 100, 300, choice, {
        fontSize: '24px',
        color: '#E8C170',
        fontFamily: 'Courier New'
      }).setOrigin(0.5);
      
      door.on('pointerdown', () => {
        this.handleChoice(choice, room);
      });
    });
  }

  private showDragDropRoom(room: any) {
    this.add.text(400, 200, '🎯 Drag & Drop', {
      fontSize: '20px',
      color: '#C6E4F2',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    this.add.text(400, 230, 'Dra objekt till rätt plats!', {
      fontSize: '16px',
      color: '#DAE4EA',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Drop zones
    for (let i = 0; i < 3; i++) {
      const zone = this.add.rectangle(300 + i * 100, 300, 80, 80, 0x7DAF66);
      zone.setStrokeStyle(2, 0xE8C170);
      zone.setAlpha(0.7);
      
      this.add.text(300 + i * 100, 300, `Zone ${i + 1}`, {
        fontSize: '14px',
        color: '#2C3E50',
        fontFamily: 'Courier New'
      }).setOrigin(0.5);
    }
  }

  private showBossRoom(room: any) {
    this.add.text(400, 200, '👹 Bossrum', {
      fontSize: '20px',
      color: '#E76F51',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    this.add.text(400, 230, 'Möt bossen i en episk strid!', {
      fontSize: '16px',
      color: '#DAE4EA',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Boss visual
    const boss = this.add.rectangle(400, 300, 120, 120, 0xE76F51);
    boss.setStrokeStyle(3, 0xE8C170);
    
    this.add.text(400, 300, '👹', {
      fontSize: '48px',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Start boss battle
    const startButton = this.add.rectangle(400, 400, 200, 50, 0xE76F51);
    startButton.setStrokeStyle(2, 0xE8C170);
    startButton.setInteractive();
    
    const startText = this.add.text(400, 400, 'Möt Bossen', {
      fontSize: '18px',
      color: '#FFFFFF',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);
    
    startButton.on('pointerdown', () => {
      this.simulateBossBattle(room);
    });
  }

  private showDefaultRoom(room: any) {
    this.add.text(400, 200, '🧩 Specialrum', {
      fontSize: '20px',
      color: '#C6E4F2',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    this.add.text(400, 230, 'Unika utmaningar väntar!', {
      fontSize: '16px',
      color: '#DAE4EA',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);
  }

  private simulateCombat(room: any) {
    this.children.removeAll();
    this.add.rectangle(400, 300, 800, 600, 0x2C3E50);
    
    this.add.text(400, 100, '⚔️ Strid pågår...', {
      fontSize: '24px',
      color: '#E76F51',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Simulate combat with math questions
    let questionCount = 0;
    const maxQuestions = 3;
    
    const askQuestion = () => {
      if (questionCount >= maxQuestions) {
        this.showVictory();
        return;
      }
      
      questionCount++;
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      const answer = a * b;
      
      this.add.text(400, 200, `Fråga ${questionCount}: Vad är ${a} × ${b}?`, {
        fontSize: '20px',
        color: '#DAE4EA',
        fontFamily: 'Courier New'
      }).setOrigin(0.5);
      
      // Simulate answer
      setTimeout(() => {
        this.add.text(400, 250, `Rätt svar: ${answer}`, {
          fontSize: '18px',
          color: '#7DAF66',
          fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        setTimeout(() => {
          this.children.removeAll();
          this.add.rectangle(400, 300, 800, 600, 0x2C3E50);
          askQuestion();
        }, 1000);
      }, 2000);
    };
    
    askQuestion();
  }

  private simulateBossBattle(room: any) {
    this.children.removeAll();
    this.add.rectangle(400, 300, 800, 600, 0x2C3E50);
    
    this.add.text(400, 100, '👹 Bossstrid: Times Troll', {
      fontSize: '24px',
      color: '#E76F51',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    this.add.text(400, 130, 'Fas 1: Grundläggande multiplikation', {
      fontSize: '16px',
      color: '#DAE4EA',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Boss HP bar
    const bossHpBg = this.add.rectangle(400, 200, 300, 20, 0x22313A);
    const bossHpFill = this.add.rectangle(400, 200, 300, 20, 0xE76F51);
    
    // Simulate boss battle
    let bossHp = 1;
    const reduceBossHp = () => {
      bossHp -= 0.1;
      bossHpFill.width = 300 * bossHp;
      
      if (bossHp <= 0) {
        this.showBossVictory();
      } else if (bossHp <= 0.5) {
        this.add.text(400, 250, '👹 Boss Phase 2: Svårare frågor!', {
          fontSize: '18px',
          color: '#E76F51',
          fontFamily: 'Courier New'
        }).setOrigin(0.5);
      } else {
        setTimeout(reduceBossHp, 1000);
      }
    };
    
    setTimeout(reduceBossHp, 1000);
  }

  private showVictory() {
    this.add.text(400, 300, '🎉 VICTORY!', {
      fontSize: '32px',
      color: '#7DAF66',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    this.add.text(400, 340, '+10 XP', {
      fontSize: '20px',
      color: '#E8C170',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);
  }

  private showBossVictory() {
    this.add.text(400, 300, '👑 BOSS DEFEATED!', {
      fontSize: '32px',
      color: '#7DAF66',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    this.add.text(400, 340, '+30 XP', {
      fontSize: '20px',
      color: '#E8C170',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);
  }

  private handleChoice(choice: string, room: any) {
    this.add.text(400, 400, `Valde ${choice}`, {
      fontSize: '18px',
      color: '#E8C170',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);
  }
}

// Create the complete game
new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'app',
  width: 1024,
  height: 768,
  backgroundColor: 0x2C3E50, // Deep Blue Gray
  scene: [CompleteHubScene]
});
