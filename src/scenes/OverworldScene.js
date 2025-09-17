/**
 * OverworldScene - Zelda-like exploration on dungeon map
 *
 * TODO/Next steps:
 * - Add tilemap collision detection
 * - Implement room transitions
 * - Add visual feedback for interactable objects
 */
import { createEntity, addComponent, createPosition, createSprite, createCollider } from '../ecs/components';
import { MovementSystem } from '../ecs/systems/MovementSystem';
import { InteractionSystem } from '../ecs/systems/InteractionSystem';
import { CollisionSystem } from '../ecs/systems/CollisionSystem';
import { RoomFactory } from '../game/RoomFactory';
import { PuzzleManager } from '../game/PuzzleManager';
import { SaveSystem } from '../game/SaveSystem';
import { Analytics } from '../game/Analytics';
import { GameState } from '../game/GameState';
export class OverworldScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OverworldScene' });
        this.entities = [];
        this.currentDungeon = '';
        this.dungeonData = [];
    }
    init(data) {
        this.currentDungeon = data.dungeon;
        this.dungeonData = data.dungeonData;
    }
    preload() {
        // Load dungeon-specific tileset
        this.load.image(`${this.currentDungeon.toLowerCase()}_tileset`, `assets/tilesets/${this.currentDungeon.toLowerCase()}_tileset.png`);
        this.load.tilemapTiledJSON(`${this.currentDungeon.toLowerCase()}_tilemap`, `assets/tilesets/${this.currentDungeon.toLowerCase()}_tilemap.json`);
        // Load player sprite
        this.load.atlas('lanternbearer_walk', 'assets/sprites/chars/lanternbearer_walk.png', 'assets/sprites/chars/lanternbearer_walk.json');
        this.load.atlas('ui_atlas', 'assets/ui/ui_atlas.png', 'assets/ui/ui_atlas.json');
    }
    create() {
        // Initialize systems
        this.gameState = GameState.getInstance();
        this.analytics = Analytics.getInstance();
        this.puzzleManager = new PuzzleManager(this);
        this.roomFactory = new RoomFactory(this);
        this.movementSystem = new MovementSystem(this);
        this.interactionSystem = new InteractionSystem(this, this.gameState);
        this.collisionSystem = new CollisionSystem(this);
        // Create tilemap
        this.createTilemap();
        // Create player
        this.createPlayer();
        // Create dungeon rooms
        this.createDungeonRooms();
        // Create HUD
        this.createHUD();
        // Set up event listeners
        this.setupEventListeners();
        // Log room entry
        this.analytics.logRoomEnter(this.currentDungeon, 'overworld');
        // Set current location
        SaveSystem.setCurrentLocation(this.currentDungeon, 'overworld');
    }
    createTilemap() {
        const tilesetName = `${this.currentDungeon.toLowerCase()}_tileset`;
        const tilemapName = `${this.currentDungeon.toLowerCase()}_tilemap`;
        this.tilemap = this.make.tilemap({ key: tilemapName });
        const tileset = this.tilemap.addTilesetImage('tileset', tilesetName);
        // Create layers
        this.backgroundLayer = this.tilemap.createLayer('background', tileset);
        this.wallsLayer = this.tilemap.createLayer('walls', tileset);
        this.objectsLayer = this.tilemap.createLayer('objects', tileset);
        // Set collision
        this.wallsLayer.setCollisionByProperty({ collides: true });
        this.collisionSystem.setTilemap(this.tilemap, this.wallsLayer);
    }
    createPlayer() {
        // Create player entity
        this.player = createEntity('player');
        addComponent(this.player, 'position', createPosition(400, 300));
        addComponent(this.player, 'velocity', { vx: 0, vy: 0 });
        addComponent(this.player, 'sprite', createSprite('lanternbearer_walk', 'lanternbearer_walk_down_1'));
        addComponent(this.player, 'collider', createCollider(32, 32));
        // Create player sprite
        const pos = this.player.components.get('position');
        this.playerSprite = this.add.sprite(pos.x, pos.y, 'lanternbearer_walk', 'lanternbearer_walk_down_1');
        this.playerSprite.setScale(2);
        // Create interaction prompt
        this.interactionPrompt = this.add.text(400, 250, '', {
            fontSize: '16px',
            color: '#E8C170',
            fontFamily: 'Courier New'
        }).setOrigin(0.5).setVisible(false);
        this.entities.push(this.player);
    }
    createDungeonRooms() {
        this.dungeonData.forEach(roomRow => {
            const roomEntities = this.roomFactory.createRoom({
                row: roomRow,
                puzzleManager: this.puzzleManager,
                onRoomComplete: () => this.handleRoomComplete(roomRow),
                onRoomFail: () => this.handleRoomFail(roomRow)
            });
            this.entities.push(...roomEntities);
            this.createRoomVisuals(roomRow);
        });
    }
    createRoomVisuals(roomRow) {
        // Create visual representation of the room
        const roomSprite = this.add.sprite(0, 0, 'ui_atlas', 'panel_bg');
        roomSprite.setPosition(100 + Math.random() * 600, 100 + Math.random() * 400);
        roomSprite.setScale(0.5);
        roomSprite.setAlpha(0.7);
        // Add room label
        const roomText = this.add.text(roomSprite.x, roomSprite.y, roomRow.Rum, {
            fontSize: '12px',
            color: '#DAE4EA',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        // Add level indicator
        const levelText = this.add.text(roomSprite.x, roomSprite.y + 20, roomRow.Nivå, {
            fontSize: '10px',
            color: '#E8C170',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        // Make room interactive
        roomSprite.setInteractive();
        roomSprite.on('pointerdown', () => {
            this.enterRoom(roomRow);
        });
    }
    createHUD() {
        // HP Bar
        const hpBarBg = this.add.rectangle(50, 50, 200, 20, 0x22313A);
        const hpBarFill = this.add.rectangle(50, 50, 200, 20, 0xE76F51);
        hpBarFill.setOrigin(0, 0.5);
        hpBarBg.setOrigin(0, 0.5);
        // XP Bar
        const xpBarBg = this.add.rectangle(50, 80, 200, 15, 0x22313A);
        const xpBarFill = this.add.rectangle(50, 80, 200, 15, 0x2A9D8F);
        xpBarFill.setOrigin(0, 0.5);
        xpBarBg.setOrigin(0, 0.5);
        // Sidekick Energy
        const energyBarBg = this.add.rectangle(50, 110, 150, 15, 0x22313A);
        const energyBarFill = this.add.rectangle(50, 110, 150, 15, 0xC6E4F2);
        energyBarFill.setOrigin(0, 0.5);
        energyBarBg.setOrigin(0, 0.5);
        // Labels
        this.add.text(10, 50, 'HP:', { fontSize: '14px', color: '#DAE4EA' });
        this.add.text(10, 80, 'XP:', { fontSize: '14px', color: '#DAE4EA' });
        this.add.text(10, 110, 'Energy:', { fontSize: '14px', color: '#DAE4EA' });
        // Update bars
        this.updateHUD();
    }
    updateHUD() {
        // This would update the HUD bars based on game state
        // Implementation depends on how GameState is structured
    }
    setupEventListeners() {
        // Room completion events
        this.events.on('roomComplete', (roomRow) => {
            this.handleRoomComplete(roomRow);
        });
        // Puzzle events
        this.events.on('puzzleComplete', () => {
            console.log('Puzzle completed!');
        });
        // Trigger events
        this.events.on('triggerActivated', (data) => {
            this.handleTriggerActivated(data);
        });
    }
    handleRoomComplete(roomRow) {
        console.log(`Room completed: ${roomRow.Rum}`);
        SaveSystem.markRoomCompleted(roomRow.Rum);
        this.analytics.logRoomComplete(roomRow.Rum, roomRow.Typ, 0);
        // Show completion feedback
        this.showCompletionFeedback(roomRow);
    }
    handleRoomFail(roomRow) {
        console.log(`Room failed: ${roomRow.Rum}`);
        this.analytics.logRoomFail(roomRow.Rum, roomRow.Typ, 'player_died');
        // Teleport to hub
        this.scene.start('HubScene');
    }
    handleTriggerActivated(data) {
        if (data.triggerType === 'room') {
            this.enterRoom(data.targetData.roomRow);
        }
        else if (data.triggerType === 'battle') {
            this.startBattle(data.targetData.roomRow);
        }
    }
    enterRoom(roomRow) {
        console.log(`Entering room: ${roomRow.Rum}`);
        this.analytics.logRoomEnter(roomRow.Rum, roomRow.Typ);
        this.scene.start('RoomScene', {
            roomRow,
            dungeon: this.currentDungeon
        });
    }
    startBattle(roomRow) {
        console.log(`Starting battle: ${roomRow.Rum}`);
        this.scene.start('BattleScene', {
            roomRow,
            dungeon: this.currentDungeon
        });
    }
    showCompletionFeedback(roomRow) {
        const feedback = this.add.text(400, 300, `Room ${roomRow.Rum} completed!`, {
            fontSize: '24px',
            color: '#7DAF66',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        this.tweens.add({
            targets: feedback,
            alpha: 0,
            y: 250,
            duration: 2000,
            onComplete: () => feedback.destroy()
        });
    }
    update(time, delta) {
        // Update systems
        this.movementSystem.update(this.entities, delta);
        this.interactionSystem.update(this.entities, this.player);
        this.collisionSystem.update(this.entities);
        // Update player sprite position
        const pos = this.player.components.get('position');
        this.playerSprite.setPosition(pos.x, pos.y);
        // Update interaction prompt
        const prompt = this.interactionSystem.getInteractionPrompt(this.entities, this.player);
        if (prompt) {
            this.interactionPrompt.setText(prompt);
            this.interactionPrompt.setVisible(true);
            this.interactionPrompt.setPosition(pos.x, pos.y - 40);
        }
        else {
            this.interactionPrompt.setVisible(false);
        }
        // Update HUD
        this.updateHUD();
    }
}
