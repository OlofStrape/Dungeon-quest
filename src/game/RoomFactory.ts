/**
 * RoomFactory - Builds rooms from dataset and type
 * 
 * TODO/Next steps:
 * - Add room layout generation
 * - Implement room-specific assets
 * - Add room state persistence
 */

import { RoomRow, DungeonDataset } from '../types/content';
import { Entity, createEntity, addComponent, createPosition, createSprite, createCollider, createInteractable } from '../ecs/components';
import { PuzzleManager } from './PuzzleManager';

export interface RoomConfig {
  row: RoomRow;
  puzzleManager: PuzzleManager;
  onRoomComplete: () => void;
  onRoomFail: () => void;
}

export class RoomFactory {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  createRoom(config: RoomConfig): Entity[] {
    const { row, puzzleManager, onRoomComplete, onRoomFail } = config;
    const entities: Entity[] = [];

    switch (row.Typ) {
      case 'combat':
        entities.push(...this.createCombatRoom(row, onRoomComplete, onRoomFail));
        break;
      case 'progress':
        entities.push(...this.createProgressRoom(row, puzzleManager, onRoomComplete, onRoomFail));
        break;
      case 'choice-logic':
        entities.push(...this.createChoiceRoom(row, puzzleManager, onRoomComplete, onRoomFail));
        break;
      case 'drag-drop':
        entities.push(...this.createDragDropRoom(row, puzzleManager, onRoomComplete, onRoomFail));
        break;
      case 'special':
        entities.push(...this.createSpecialRoom(row, puzzleManager, onRoomComplete, onRoomFail));
        break;
      case 'grind':
        entities.push(...this.createGrindRoom(row, puzzleManager, onRoomComplete, onRoomFail));
        break;
      case 'boss-combat':
        entities.push(...this.createBossRoom(row, onRoomComplete, onRoomFail));
        break;
      default:
        console.warn(`Unknown room type: ${row.Typ}`);
        entities.push(...this.createDefaultRoom(row, onRoomComplete, onRoomFail));
    }

    return entities;
  }

  private createCombatRoom(row: RoomRow, onComplete: () => void, onFail: () => void): Entity[] {
    const entities: Entity[] = [];

    // Create encounter trigger
    const trigger = createEntity(`encounter_trigger_${row.Rum}`);
    addComponent(trigger, 'position', createPosition(400, 300));
    addComponent(trigger, 'collider', createCollider(100, 100, true));
    addComponent(trigger, 'trigger', {
      triggerType: 'battle',
      targetData: { roomRow: row }
    });

    entities.push(trigger);

    // Add visual indicator
    const indicator = createEntity(`combat_indicator_${row.Rum}`);
    addComponent(indicator, 'position', createPosition(400, 300));
    addComponent(indicator, 'sprite', createSprite('ui_atlas', 'hp_bar_fill'));
    addComponent(indicator, 'collider', createCollider(100, 100));

    entities.push(indicator);

    return entities;
  }

  private createProgressRoom(row: RoomRow, puzzleManager: PuzzleManager, onComplete: () => void, onFail: () => void): Entity[] {
    const entities: Entity[] = [];

    // Register progress goal
    const goal = PuzzleManager.createProgressGoal(
      `progress_${row.Rum}`,
      row['Frågor/uppgifter'],
      onComplete
    );
    puzzleManager.registerGoal(goal);

    // Create progress stations
    const stationCount = Math.min(row['Frågor/uppgifter'], 6);
    for (let i = 0; i < stationCount; i++) {
      const station = createEntity(`progress_station_${row.Rum}_${i}`);
      addComponent(station, 'position', createPosition(200 + i * 100, 300));
      addComponent(station, 'sprite', createSprite('ui_atlas', 'xp_bar_bg'));
      addComponent(station, 'collider', createCollider(80, 80));
      addComponent(station, 'interactable', createInteractable(
        50,
        () => this.handleProgressStation(station, puzzleManager, goal.id),
        'Solve math problem'
      ));

      entities.push(station);
    }

    return entities;
  }

  private createChoiceRoom(row: RoomRow, puzzleManager: PuzzleManager, onComplete: () => void, onFail: () => void): Entity[] {
    const entities: Entity[] = [];

    // Create choice doors (typically 3 choices)
    const choices = ['A', 'B', 'C'];
    choices.forEach((choice, index) => {
      const door = createEntity(`choice_door_${row.Rum}_${choice}`);
      addComponent(door, 'position', createPosition(300 + index * 150, 400));
      addComponent(door, 'sprite', createSprite('ui_atlas', 'button_bg'));
      addComponent(door, 'collider', createCollider(100, 120));
      addComponent(door, 'interactable', createInteractable(
        60,
        () => this.handleChoiceDoor(door, choice, puzzleManager, onComplete, onFail),
        `Choose ${choice}`
      ));

      entities.push(door);
    });

    return entities;
  }

  private createDragDropRoom(row: RoomRow, puzzleManager: PuzzleManager, onComplete: () => void, onFail: () => void): Entity[] {
    const entities: Entity[] = [];

    // Create drop zones
    const dropZoneCount = Math.min(row['Frågor/uppgifter'], 4);
    for (let i = 0; i < dropZoneCount; i++) {
      const dropZone = createEntity(`drop_zone_${row.Rum}_${i}`);
      addComponent(dropZone, 'position', createPosition(200 + i * 150, 300));
      addComponent(dropZone, 'sprite', createSprite('ui_atlas', 'panel_bg'));
      addComponent(dropZone, 'collider', createCollider(120, 120));
      addComponent(dropZone, 'interactable', createInteractable(
        80,
        () => this.handleDropZone(dropZone, puzzleManager, onComplete),
        'Drop item here'
      ));

      entities.push(dropZone);
    }

    return entities;
  }

  private createSpecialRoom(row: RoomRow, puzzleManager: PuzzleManager, onComplete: () => void, onFail: () => void): Entity[] {
    const entities: Entity[] = [];

    // Special rooms have unique mechanics based on description
    const specialElement = createEntity(`special_${row.Rum}`);
    addComponent(specialElement, 'position', createPosition(400, 300));
    addComponent(specialElement, 'sprite', createSprite('ui_atlas', 'hint_icon'));
    addComponent(specialElement, 'collider', createCollider(100, 100));
    addComponent(specialElement, 'interactable', createInteractable(
      60,
      () => this.handleSpecialElement(specialElement, row, puzzleManager, onComplete),
      row.Beskrivning || 'Interact'
    ));

    entities.push(specialElement);

    return entities;
  }

  private createGrindRoom(row: RoomRow, puzzleManager: PuzzleManager, onComplete: () => void, onFail: () => void): Entity[] {
    // Grind rooms are similar to progress rooms but with adaptive difficulty
    return this.createProgressRoom(row, puzzleManager, onComplete, onFail);
  }

  private createBossRoom(row: RoomRow, onComplete: () => void, onFail: () => void): Entity[] {
    const entities: Entity[] = [];

    // Create boss encounter trigger
    const bossTrigger = createEntity(`boss_trigger_${row.Rum}`);
    addComponent(bossTrigger, 'position', createPosition(400, 300));
    addComponent(bossTrigger, 'collider', createCollider(150, 150, true));
    addComponent(bossTrigger, 'trigger', {
      triggerType: 'battle',
      targetData: { roomRow: row, isBoss: true }
    });

    entities.push(bossTrigger);

    // Add boss visual
    const bossVisual = createEntity(`boss_visual_${row.Rum}`);
    addComponent(bossVisual, 'position', createPosition(400, 300));
    addComponent(bossVisual, 'sprite', createSprite('ui_atlas', 'hp_bar_fill', 2));
    addComponent(bossVisual, 'collider', createCollider(150, 150));

    entities.push(bossVisual);

    return entities;
  }

  private createDefaultRoom(row: RoomRow, onComplete: () => void, onFail: () => void): Entity[] {
    // Fallback room type
    return this.createCombatRoom(row, onComplete, onFail);
  }

  // Event handlers
  private handleProgressStation(station: Entity, puzzleManager: PuzzleManager, goalId: string): void {
    // This would trigger a math question
    this.scene.events.emit('startMathQuestion', {
      goalId,
      onCorrect: () => puzzleManager.tick(goalId),
      onIncorrect: () => console.log('Incorrect answer')
    });
  }

  private handleChoiceDoor(door: Entity, choice: string, puzzleManager: PuzzleManager, onComplete: () => void, onFail: () => void): void {
    // This would show a choice question
    this.scene.events.emit('startChoiceQuestion', {
      choice,
      onCorrect: () => {
        const goal = PuzzleManager.createChoiceGoal(`choice_${door.id}`, onComplete);
        puzzleManager.registerGoal(goal);
        puzzleManager.tick(goal.id);
      },
      onIncorrect: onFail
    });
  }

  private handleDropZone(dropZone: Entity, puzzleManager: PuzzleManager, onComplete: () => void): void {
    // This would handle drag-drop interaction
    this.scene.events.emit('startDragDropQuestion', {
      dropZone,
      onCorrect: () => {
        const goal = PuzzleManager.createDragDropGoal(`dragdrop_${dropZone.id}`, 1, onComplete);
        puzzleManager.registerGoal(goal);
        puzzleManager.tick(goal.id);
      }
    });
  }

  private handleSpecialElement(element: Entity, row: RoomRow, puzzleManager: PuzzleManager, onComplete: () => void): void {
    // Handle special room mechanics
    this.scene.events.emit('startSpecialQuestion', {
      roomRow: row,
      onComplete
    });
  }
}
