import Phaser from 'phaser';
import { loadDataset } from '../game/DataLoader';
import { SaveSystem } from '../game/SaveSystem';
import { Analytics } from '../game/Analytics';
export class HubScene extends Phaser.Scene {
    async create() {
        // Initialize analytics
        this.analytics = Analytics.getInstance();
        this.analytics.startNewSession();
        // Create hub background with Art Bible colors
        this.add.rectangle(400, 300, 800, 600, 0x2C3E50);
        // Title with Art Bible styling
        this.add.text(400, 80, '🏰 Lanternbearer\'s Sanctuary – Åk 4', {
            fontSize: '32px',
            color: '#E8C170',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        // Subtitle
        this.add.text(400, 120, '✨ Implementerat enligt Art Bible: "Vuxet men för barn"', {
            fontSize: '16px',
            color: '#C6E4F2',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        // Load dataset
        this.dataSet = await loadDataset();
        const dungeons = Object.keys(this.dataSet);
        // Create dungeon buttons with Art Bible styling
        dungeons.forEach((name, i) => {
            const button = this.add.rectangle(400, 200 + i * 80, 300, 60, 0x3F5B6E);
            button.setStrokeStyle(2, 0xE8C170);
            button.setInteractive();
            const buttonText = this.add.text(400, 200 + i * 80, name, {
                fontSize: '20px',
                color: '#DAE4EA',
                fontFamily: 'Courier New'
            }).setOrigin(0.5);
            button.on('pointerdown', () => {
                this.selectDungeon(name);
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
        // Add save/load info
        this.addSaveInfo();
    }
    selectDungeon(dungeonName) {
        console.log(`Selected dungeon: ${dungeonName}`);
        // Log analytics
        this.analytics.logEvent('dungeon_selected', {
            dungeon: dungeonName,
            timestamp: Date.now()
        });
        // Start overworld scene with dungeon data
        this.scene.start('OverworldScene', {
            dungeon: dungeonName,
            dungeonData: this.dataSet[dungeonName]
        });
    }
    addSaveInfo() {
        const saveData = SaveSystem.load();
        // Show player stats
        this.add.text(50, 500, `HP: ${saveData.player.hp}/${saveData.player.maxHp}`, {
            fontSize: '16px',
            color: '#E76F51',
            fontFamily: 'Courier New'
        });
        this.add.text(50, 520, `XP: ${saveData.player.xp}`, {
            fontSize: '16px',
            color: '#2A9D8F',
            fontFamily: 'Courier New'
        });
        this.add.text(50, 540, `Level: ${saveData.player.level}`, {
            fontSize: '16px',
            color: '#E8C170',
            fontFamily: 'Courier New'
        });
        // Show progress
        const completedRooms = saveData.progress.completedRooms.length;
        this.add.text(50, 560, `Completed Rooms: ${completedRooms}`, {
            fontSize: '16px',
            color: '#7DAF66',
            fontFamily: 'Courier New'
        });
    }
}
HubScene.KEY = 'HubScene';
