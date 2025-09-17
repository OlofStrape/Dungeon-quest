import { AssetLoader } from '../game/AssetLoader';
export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }
    preload() {
        // Create loading bar
        this.createLoadingBar();
        // Initialize asset loader
        this.assetLoader = new AssetLoader(this);
        // Load all assets according to Art Bible
        this.assetLoader.loadAll();
        // Load game data
        this.load.json('gameData', 'public/data/ak4_gameplay_params_enriched.json');
        // Set up loading events
        this.load.on('progress', (progress) => {
            this.updateLoadingBar(progress);
        });
        this.load.on('complete', () => {
            this.createAnimations();
            this.scene.start('HubScene');
        });
    }
    createLoadingBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        // Background
        this.add.rectangle(width / 2, height / 2, width, height, 0x2C3E50);
        // Title
        this.add.text(width / 2, height / 2 - 100, 'Dungeon of Numbers EDU', {
            fontSize: '32px',
            color: '#E8C170',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        // Subtitle
        this.add.text(width / 2, height / 2 - 60, 'Åk 4 - Lanternbearer\'s Sanctuary', {
            fontSize: '18px',
            color: '#C6E4F2',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        // Loading bar background
        this.add.rectangle(width / 2, height / 2, 400, 20, 0x22313A);
        // Loading bar fill
        this.loadingBar = this.add.rectangle(width / 2 - 200, height / 2, 0, 20, 0x7DAF66);
        this.loadingBar.setOrigin(0, 0.5);
        // Loading text
        this.loadingText = this.add.text(width / 2, height / 2 + 40, 'Loading...', {
            fontSize: '16px',
            color: '#DAE4EA',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
    }
    updateLoadingBar(progress) {
        this.loadingBar.width = 400 * progress;
        this.loadingText.setText(`Loading... ${Math.round(progress * 100)}%`);
    }
    createAnimations() {
        this.assetLoader.createAnimations();
    }
}
