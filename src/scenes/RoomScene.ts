/**
 * RoomScene - Individual rooms with puzzles/portals/clocks/etc
 * 
 * TODO/Next steps:
 * - Add room-specific UI layouts
 * - Implement puzzle completion animations
 * - Add room state persistence
 */

import { Entity, createEntity, addComponent, createPosition, createSprite, createCollider, createInteractable } from '../ecs/components';
import { MovementSystem } from '../ecs/systems/MovementSystem';
import { InteractionSystem } from '../ecs/systems/InteractionSystem';
import { CollisionSystem } from '../ecs/systems/CollisionSystem';
import { RoomFactory } from '../game/RoomFactory';
import { PuzzleManager } from '../game/PuzzleManager';
import { SaveSystem } from '../game/SaveSystem';
import { Analytics } from '../game/Analytics';
import { QuestionGenerator } from '../game/QuestionGenerator';
import { RoomRow } from '../types/content';
import { GameState } from '../game/GameState';

export class RoomScene extends Phaser.Scene {
  private entities: Entity[] = [];
  private player!: Entity;
  private movementSystem!: MovementSystem;
  private interactionSystem!: InteractionSystem;
  private collisionSystem!: CollisionSystem;
  private roomFactory!: RoomFactory;
  private puzzleManager!: PuzzleManager;
  private questionGenerator!: QuestionGenerator;
  private gameState!: GameState;
  private analytics!: Analytics;
  
  private roomRow!: RoomRow;
  private currentDungeon: string = '';
  private playerSprite!: Phaser.GameObjects.Sprite;
  private interactionPrompt!: Phaser.GameObjects.Text;
  private roomUI!: Phaser.GameObjects.Container;
  
  // UI Elements
  private progressUI!: Phaser.GameObjects.Container;
  private gateUI!: Phaser.GameObjects.Container;
  private dragDropUI!: Phaser.GameObjects.Container;
  private questionUI!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'RoomScene' });
  }

  init(data: { roomRow: RoomRow; dungeon: string }): void {
    this.roomRow = data.roomRow;
    this.currentDungeon = data.dungeon;
  }

  preload(): void {
    // Load room-specific assets
    this.load.atlas('lanternbearer_walk', 'assets/sprites/chars/lanternbearer_walk.png', 'assets/sprites/chars/lanternbearer_walk.json');
    this.load.atlas('ui_atlas', 'assets/ui/ui_atlas.png', 'assets/ui/ui_atlas.json');
  }

  create(): void {
    // Initialize systems
    this.gameState = GameState.getInstance();
    this.analytics = Analytics.getInstance();
    this.puzzleManager = new PuzzleManager(this);
    this.roomFactory = new RoomFactory(this);
    this.questionGenerator = new QuestionGenerator();
    this.movementSystem = new MovementSystem(this);
    this.interactionSystem = new InteractionSystem(this, this.gameState);
    this.collisionSystem = new CollisionSystem(this);

    // Create room background
    this.createRoomBackground();

    // Create player
    this.createPlayer();

    // Create room entities based on type
    this.createRoomEntities();

    // Create room-specific UI
    this.createRoomUI();

    // Set up event listeners
    this.setupEventListeners();

    // Log room entry
    this.analytics.logRoomEnter(this.roomRow.Rum, this.roomRow.Typ);

    // Set current location
    SaveSystem.setCurrentLocation(this.currentDungeon, this.roomRow.Rum);
  }

  private createRoomBackground(): void {
    // Create room background based on room type
    const bgColor = this.getRoomBackgroundColor();
    this.add.rectangle(400, 300, 800, 600, bgColor);
    
    // Add room title
    this.add.text(400, 50, `${this.roomRow.Rum} (${this.roomRow.Nivå})`, {
      fontSize: '24px',
      color: '#E8C170',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Add room description
    this.add.text(400, 80, this.roomRow.Beskrivning, {
      fontSize: '16px',
      color: '#DAE4EA',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);
  }

  private getRoomBackgroundColor(): number {
    const colors: { [key: string]: number } = {
      'combat': 0x2C3E50,
      'progress': 0x3F5B6E,
      'choice-logic': 0x7DAF66,
      'drag-drop': 0xE8C170,
      'special': 0xC6E4F2,
      'grind': 0x22313A,
      'boss-combat': 0xE76F51
    };
    return colors[this.roomRow.Typ] || 0x2C3E50;
  }

  private createPlayer(): void {
    // Create player entity
    this.player = createEntity('player');
    addComponent(this.player, 'position', createPosition(400, 500));
    addComponent(this.player, 'velocity', { vx: 0, vy: 0 });
    addComponent(this.player, 'sprite', createSprite('lanternbearer_walk', 'lanternbearer_walk_down_1'));
    addComponent(this.player, 'collider', createCollider(32, 32));

    // Create player sprite
    const pos = this.player.components.get('position');
    this.playerSprite = this.add.sprite(pos.x, pos.y, 'lanternbearer_walk', 'lanternbearer_walk_down_1');
    this.playerSprite.setScale(2);

    // Create interaction prompt
    this.interactionPrompt = this.add.text(400, 450, '', {
      fontSize: '16px',
      color: '#E8C170',
      fontFamily: 'Courier New'
    }).setOrigin(0.5).setVisible(false);

    this.entities.push(this.player);
  }

  private createRoomEntities(): void {
    const roomEntities = this.roomFactory.createRoom({
      row: this.roomRow,
      puzzleManager: this.puzzleManager,
      onRoomComplete: () => this.handleRoomComplete(),
      onRoomFail: () => this.handleRoomFail()
    });

    this.entities.push(...roomEntities);
    this.createRoomVisuals();
  }

  private createRoomVisuals(): void {
    // Create visual elements based on room type
    switch (this.roomRow.Typ) {
      case 'progress':
        this.createProgressVisuals();
        break;
      case 'choice-logic':
        this.createChoiceVisuals();
        break;
      case 'drag-drop':
        this.createDragDropVisuals();
        break;
      case 'special':
        this.createSpecialVisuals();
        break;
      default:
        this.createDefaultVisuals();
    }
  }

  private createProgressVisuals(): void {
    // Create progress bar segments
    const segmentCount = this.roomRow['Frågor/uppgifter'];
    for (let i = 0; i < segmentCount; i++) {
      const segment = this.add.rectangle(200 + i * 100, 200, 80, 20, 0x22313A);
      segment.setStrokeStyle(2, 0xE8C170);
      
      // Add segment number
      this.add.text(segment.x, segment.y, (i + 1).toString(), {
        fontSize: '14px',
        color: '#DAE4EA',
        fontFamily: 'Courier New'
      }).setOrigin(0.5);
    }
  }

  private createChoiceVisuals(): void {
    // Create choice doors
    const choices = ['A', 'B', 'C'];
    choices.forEach((choice, index) => {
      const door = this.add.rectangle(300 + index * 150, 300, 100, 120, 0x3F5B6E);
      door.setStrokeStyle(3, 0xE8C170);
      door.setInteractive();
      
      // Add choice label
      this.add.text(door.x, door.y, choice, {
        fontSize: '24px',
        color: '#E8C170',
        fontFamily: 'Courier New'
      }).setOrigin(0.5);
      
      door.on('pointerdown', () => this.handleChoice(choice));
    });
  }

  private createDragDropVisuals(): void {
    // Create drop zones
    const dropZoneCount = Math.min(this.roomRow['Frågor/uppgifter'], 4);
    for (let i = 0; i < dropZoneCount; i++) {
      const dropZone = this.add.rectangle(200 + i * 150, 300, 120, 120, 0x7DAF66);
      dropZone.setStrokeStyle(2, 0xE8C170);
      dropZone.setAlpha(0.7);
      
      // Add drop zone label
      this.add.text(dropZone.x, dropZone.y, `Zone ${i + 1}`, {
        fontSize: '14px',
        color: '#DAE4EA',
        fontFamily: 'Courier New'
      }).setOrigin(0.5);
    }
  }

  private createSpecialVisuals(): void {
    // Create special room elements based on description
    const specialElement = this.add.rectangle(400, 300, 150, 150, 0xC6E4F2);
    specialElement.setStrokeStyle(3, 0xE8C170);
    specialElement.setInteractive();
    
    // Add special element label
    this.add.text(specialElement.x, specialElement.y, 'Special', {
      fontSize: '18px',
      color: '#2C3E50',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);
    
    specialElement.on('pointerdown', () => this.handleSpecialInteraction());
  }

  private createDefaultVisuals(): void {
    // Default room visuals
    const centerElement = this.add.rectangle(400, 300, 100, 100, 0x22313A);
    centerElement.setStrokeStyle(2, 0xE8C170);
  }

  private createRoomUI(): void {
    // Create room-specific UI container
    this.roomUI = this.add.container(0, 0);
    
    // Create UI based on room type
    switch (this.roomRow.Typ) {
      case 'progress':
        this.createProgressUI();
        break;
      case 'choice-logic':
        this.createGateUI();
        break;
      case 'drag-drop':
        this.createDragDropUI();
        break;
      default:
        this.createDefaultUI();
    }
  }

  private createProgressUI(): void {
    this.progressUI = this.add.container(0, 0);
    
    // Progress bar background
    const progressBg = this.add.rectangle(400, 100, 300, 20, 0x22313A);
    const progressFill = this.add.rectangle(400, 100, 300, 20, 0x2A9D8F);
    progressFill.setOrigin(0, 0.5);
    progressBg.setOrigin(0, 0.5);
    
    this.progressUI.add([progressBg, progressFill]);
  }

  private createGateUI(): void {
    this.gateUI = this.add.container(0, 0);
    
    // Gate selection UI
    const gateBg = this.add.rectangle(400, 150, 400, 100, 0x22313A);
    gateBg.setStrokeStyle(2, 0xE8C170);
    
    const gateText = this.add.text(400, 150, 'Choose your path:', {
      fontSize: '18px',
      color: '#DAE4EA',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);
    
    this.gateUI.add([gateBg, gateText]);
  }

  private createDragDropUI(): void {
    this.dragDropUI = this.add.container(0, 0);
    
    // Drag drop instructions
    const instructionBg = this.add.rectangle(400, 100, 500, 60, 0x22313A);
    instructionBg.setStrokeStyle(2, 0xE8C170);
    
    const instructionText = this.add.text(400, 100, 'Drag items to the correct zones', {
      fontSize: '16px',
      color: '#DAE4EA',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);
    
    this.dragDropUI.add([instructionBg, instructionText]);
  }

  private createDefaultUI(): void {
    // Default UI
    const defaultBg = this.add.rectangle(400, 100, 300, 60, 0x22313A);
    defaultBg.setStrokeStyle(2, 0xE8C170);
    
    const defaultText = this.add.text(400, 100, 'Interact with objects', {
      fontSize: '16px',
      color: '#DAE4EA',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);
  }

  private setupEventListeners(): void {
    // Math question events
    this.events.on('startMathQuestion', (data: any) => {
      this.startMathQuestion(data);
    });

    // Choice question events
    this.events.on('startChoiceQuestion', (data: any) => {
      this.startChoiceQuestion(data);
    });

    // Drag drop events
    this.events.on('startDragDropQuestion', (data: any) => {
      this.startDragDropQuestion(data);
    });

    // Special question events
    this.events.on('startSpecialQuestion', (data: any) => {
      this.startSpecialQuestion(data);
    });

    // Puzzle events
    this.events.on('puzzleComplete', () => {
      this.handleRoomComplete();
    });
  }

  private startMathQuestion(data: any): void {
    const question = this.questionGenerator.generateQuestion(this.roomRow);
    this.showQuestionUI(question, data.onCorrect, data.onIncorrect);
  }

  private startChoiceQuestion(data: any): void {
    const question = this.questionGenerator.generateQuestion(this.roomRow);
    this.showChoiceUI(question, data.onCorrect, data.onIncorrect);
  }

  private startDragDropQuestion(data: any): void {
    const question = this.questionGenerator.generateQuestion(this.roomRow);
    this.showDragDropUI(question, data.onCorrect);
  }

  private startSpecialQuestion(data: any): void {
    const question = this.questionGenerator.generateQuestion(this.roomRow);
    this.showSpecialUI(question, data.onComplete);
  }

  private showQuestionUI(question: any, onCorrect: () => void, onIncorrect: () => void): void {
    // Create question UI
    this.questionUI = this.add.container(0, 0);
    
    const questionBg = this.add.rectangle(400, 300, 600, 400, 0x22313A);
    questionBg.setStrokeStyle(3, 0xE8C170);
    
    const questionText = this.add.text(400, 200, question.prompt, {
      fontSize: '20px',
      color: '#DAE4EA',
      fontFamily: 'Courier New',
      wordWrap: { width: 550 }
    }).setOrigin(0.5);
    
    this.questionUI.add([questionBg, questionText]);
    
    // Add input field or options based on question type
    if (question.options) {
      this.addQuestionOptions(question, onCorrect, onIncorrect);
    } else {
      this.addQuestionInput(question, onCorrect, onIncorrect);
    }
  }

  private addQuestionOptions(question: any, onCorrect: () => void, onIncorrect: () => void): void {
    question.options.forEach((option: string, index: number) => {
      const optionBg = this.add.rectangle(400, 300 + index * 50, 200, 40, 0x3F5B6E);
      optionBg.setStrokeStyle(2, 0xE8C170);
      optionBg.setInteractive();
      
      const optionText = this.add.text(400, 300 + index * 50, option, {
        fontSize: '16px',
        color: '#DAE4EA',
        fontFamily: 'Courier New'
      }).setOrigin(0.5);
      
      optionBg.on('pointerdown', () => {
        if (option === question.answer) {
          onCorrect();
        } else {
          onIncorrect();
        }
        this.questionUI.destroy();
      });
      
      this.questionUI.add([optionBg, optionText]);
    });
  }

  private addQuestionInput(question: any, onCorrect: () => void, onIncorrect: () => void): void {
    const inputBg = this.add.rectangle(400, 350, 200, 40, 0x3F5B6E);
    inputBg.setStrokeStyle(2, 0xE8C170);
    
    const inputText = this.add.text(400, 350, 'Type your answer...', {
      fontSize: '16px',
      color: '#DAE4EA',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);
    
    // Add input handling
    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        const answer = inputText.text;
        if (answer === question.answer) {
          onCorrect();
        } else {
          onIncorrect();
        }
        this.questionUI.destroy();
      }
    });
    
    this.questionUI.add([inputBg, inputText]);
  }

  private showChoiceUI(question: any, onCorrect: () => void, onIncorrect: () => void): void {
    // Similar to question UI but with choice-specific styling
    this.showQuestionUI(question, onCorrect, onIncorrect);
  }

  private showDragDropUI(question: any, onCorrect: () => void): void {
    // Drag drop specific UI
    this.showQuestionUI(question, onCorrect, () => {});
  }

  private showSpecialUI(question: any, onComplete: () => void): void {
    // Special room UI
    this.showQuestionUI(question, onComplete, () => {});
  }

  private handleChoice(choice: string): void {
    console.log(`Choice selected: ${choice}`);
    // Handle choice logic
    this.puzzleManager.tick(`choice_${choice}`);
  }

  private handleSpecialInteraction(): void {
    console.log('Special interaction triggered');
    // Handle special room mechanics
    this.puzzleManager.tick('special_interaction');
  }

  private handleRoomComplete(): void {
    console.log(`Room completed: ${this.roomRow.Rum}`);
    SaveSystem.markRoomCompleted(this.roomRow.Rum);
    this.analytics.logRoomComplete(this.roomRow.Rum, this.roomRow.Typ, 0);
    
    // Show completion feedback
    this.showCompletionFeedback();
    
    // Return to overworld after delay
    this.time.delayedCall(2000, () => {
      this.scene.start('OverworldScene', {
        dungeon: this.currentDungeon,
        dungeonData: [] // This should be passed from the calling scene
      });
    });
  }

  private handleRoomFail(): void {
    console.log(`Room failed: ${this.roomRow.Rum}`);
    this.analytics.logRoomFail(this.roomRow.Rum, this.roomRow.Typ, 'player_died');
    
    // Teleport to hub
    this.scene.start('HubScene');
  }

  private showCompletionFeedback(): void {
    const feedback = this.add.text(400, 300, `Room ${this.roomRow.Rum} completed!`, {
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

  update(time: number, delta: number): void {
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
    } else {
      this.interactionPrompt.setVisible(false);
    }
  }
}
