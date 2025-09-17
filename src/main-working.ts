import Phaser from 'phaser';

// Simple working version of the game
class SimpleHubScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SimpleHubScene' });
  }

  create() {
    // Art Bible colors
    const bgColor = 0x2C3E50; // Deep Blue Gray
    this.add.rectangle(400, 300, 800, 600, bgColor);
    
    // Title
    this.add.text(400, 100, '🏰 Dungeon of Numbers EDU', {
      fontSize: '32px',
      color: '#E8C170', // Warm Torch
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(400, 140, 'Zelda + Final Fantasy + Matematik för Åk 4', {
      fontSize: '18px',
      color: '#C6E4F2', // Magic Light
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Art Bible info
    this.add.text(400, 180, '✨ Implementerat enligt Art Bible: "Vuxet men för barn"', {
      fontSize: '16px',
      color: '#7DAF66', // Moss Green
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Dungeon buttons
    const dungeons = [
      '🔢 Tal & Algebra',
      '📐 Geometri', 
      '⏰ Tid',
      '🔮 Mönster',
      '📊 Data'
    ];

    dungeons.forEach((dungeon, i) => {
      const button = this.add.rectangle(400, 250 + i * 60, 300, 50, 0x3F5B6E);
      button.setStrokeStyle(2, 0xE8C170);
      button.setInteractive();
      
      const buttonText = this.add.text(400, 250 + i * 60, dungeon, {
        fontSize: '18px',
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

    // Instructions
    this.add.text(400, 550, 'Klicka på en dungeon för att börja spela!', {
      fontSize: '16px',
      color: '#DAE4EA',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);
  }

  startDungeon(dungeonName: string) {
    console.log(`Starting dungeon: ${dungeonName}`);
    // For now, just show a message
    this.add.text(400, 400, `Startar ${dungeonName}...`, {
      fontSize: '24px',
      color: '#7DAF66',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);
  }
}

// Create the game
new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'app',
  width: 1024,
  height: 768,
  backgroundColor: 0x2C3E50, // Deep Blue Gray
  scene: [SimpleHubScene]
});
