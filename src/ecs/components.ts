/**
 * ECS Components for Dungeon of Numbers EDU
 * 
 * TODO/Next steps:
 * - Add animation components for sprite states
 * - Implement inventory component for keys/loot
 * - Add audio component for SFX triggers
 */

export interface Position {
  x: number;
  y: number;
  z?: number; // For layering
}

export interface Velocity {
  vx: number;
  vy: number;
}

export interface Sprite {
  texture: string;
  frame?: string;
  scale?: number;
  tint?: number;
  visible?: boolean;
}

export interface Collider {
  width: number;
  height: number;
  offsetX?: number;
  offsetY?: number;
  isTrigger?: boolean;
}

export interface Interactable {
  range: number;
  onInteract: (context: InteractionContext) => void;
  canInteract?: (context: InteractionContext) => boolean;
  prompt?: string;
}

export interface InteractionContext {
  player: Entity;
  scene: Phaser.Scene;
  gameState: any; // Will be typed properly
}

export interface Entity {
  id: string;
  components: Map<string, any>;
}

export interface Player extends Entity {
  components: Map<string, any> & {
    position: Position;
    velocity: Velocity;
    sprite: Sprite;
    collider: Collider;
    interactable?: Interactable;
  };
}

export interface Door extends Entity {
  components: Map<string, any> & {
    position: Position;
    sprite: Sprite;
    collider: Collider;
    interactable: Interactable;
    isLocked: boolean;
    requiredKey?: string;
    targetRoom?: string;
  };
}

export interface Trigger extends Entity {
  components: Map<string, any> & {
    position: Position;
    collider: Collider;
    triggerType: 'room' | 'battle' | 'cutscene';
    targetData: any;
  };
}

export interface PuzzleElement extends Entity {
  components: Map<string, any> & {
    position: Position;
    sprite: Sprite;
    collider: Collider;
    interactable: Interactable;
    puzzleType: 'progress' | 'choice' | 'dragdrop' | 'special';
    puzzleData: any;
  };
}

// Component factory functions
export function createPosition(x: number, y: number, z?: number): Position {
  return { x, y, z };
}

export function createVelocity(vx: number = 0, vy: number = 0): Velocity {
  return { vx, vy };
}

export function createSprite(texture: string, frame?: string, scale: number = 1): Sprite {
  return { texture, frame, scale, visible: true };
}

export function createCollider(width: number, height: number, isTrigger: boolean = false): Collider {
  return { width, height, isTrigger };
}

export function createInteractable(
  range: number,
  onInteract: (context: InteractionContext) => void,
  prompt?: string
): Interactable {
  return { range, onInteract, prompt };
}

// Entity factory functions
export function createEntity(id: string): Entity {
  return {
    id,
    components: new Map()
  };
}

export function addComponent<T>(entity: Entity, componentType: string, component: T): void {
  entity.components.set(componentType, component);
}

export function getComponent<T>(entity: Entity, componentType: string): T | undefined {
  return entity.components.get(componentType);
}

export function hasComponent(entity: Entity, componentType: string): boolean {
  return entity.components.has(componentType);
}
