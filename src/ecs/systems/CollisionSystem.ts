/**
 * CollisionSystem - Handles tile collision and entity interactions
 * 
 * TODO/Next steps:
 * - Add tilemap collision detection
 * - Implement trigger zones
 * - Add collision response for different entity types
 */

import { Entity, Position, Collider } from '../components';

export interface CollisionResult {
  collided: boolean;
  entity?: Entity;
  direction?: string;
}

export class CollisionSystem {
  private scene: Phaser.Scene;
  private tilemap: Phaser.Tilemaps.Tilemap | null = null;
  private wallsLayer: Phaser.Tilemaps.TilemapLayer | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  setTilemap(tilemap: Phaser.Tilemaps.Tilemap, wallsLayer: Phaser.Tilemaps.TilemapLayer): void {
    this.tilemap = tilemap;
    this.wallsLayer = wallsLayer;
  }

  update(entities: Entity[]): void {
    entities.forEach(entity => {
      if (this.hasCollisionComponents(entity)) {
        this.checkCollisions(entity, entities);
      }
    });
  }

  private hasCollisionComponents(entity: Entity): boolean {
    return entity.components.has('position') && 
           entity.components.has('collider');
  }

  private checkCollisions(entity: Entity, allEntities: Entity[]): void {
    const position = entity.components.get('position') as Position;
    const collider = entity.components.get('collider') as Collider;

    // Check tilemap collision
    if (this.tilemap && this.wallsLayer) {
      const tileCollision = this.checkTileCollision(position, collider);
      if (tileCollision.collided) {
        this.resolveTileCollision(entity, tileCollision.direction!);
      }
    }

    // Check entity-to-entity collision
    allEntities.forEach(otherEntity => {
      if (otherEntity.id === entity.id) return;
      if (!this.hasCollisionComponents(otherEntity)) return;

      const collision = this.checkEntityCollision(entity, otherEntity);
      if (collision.collided) {
        this.handleEntityCollision(entity, otherEntity);
      }
    });
  }

  private checkTileCollision(position: Position, collider: Collider): CollisionResult {
    if (!this.tilemap || !this.wallsLayer) {
      return { collided: false };
    }

    const left = position.x + (collider.offsetX || 0);
    const right = left + collider.width;
    const top = position.y + (collider.offsetY || 0);
    const bottom = top + collider.height;

    // Check corners
    const topLeft = this.wallsLayer.getTileAtWorldXY(left, top);
    const topRight = this.wallsLayer.getTileAtWorldXY(right, top);
    const bottomLeft = this.wallsLayer.getTileAtWorldXY(left, bottom);
    const bottomRight = this.wallsLayer.getTileAtWorldXY(right, bottom);

    if (topLeft || topRight || bottomLeft || bottomRight) {
      // Determine collision direction
      let direction = '';
      if (topLeft || topRight) direction += 'up';
      if (bottomLeft || bottomRight) direction += 'down';
      if (topLeft || bottomLeft) direction += 'left';
      if (topRight || bottomRight) direction += 'right';

      return { collided: true, direction };
    }

    return { collided: false };
  }

  private checkEntityCollision(entity1: Entity, entity2: Entity): CollisionResult {
    const pos1 = entity1.components.get('position') as Position;
    const col1 = entity1.components.get('collider') as Collider;
    const pos2 = entity2.components.get('position') as Position;
    const col2 = entity2.components.get('collider') as Collider;

    const left1 = pos1.x + (col1.offsetX || 0);
    const right1 = left1 + col1.width;
    const top1 = pos1.y + (col1.offsetY || 0);
    const bottom1 = top1 + col1.height;

    const left2 = pos2.x + (col2.offsetX || 0);
    const right2 = left2 + col2.width;
    const top2 = pos2.y + (col2.offsetY || 0);
    const bottom2 = top2 + col2.height;

    const collided = !(right1 < left2 || left1 > right2 || bottom1 < top2 || top1 > bottom2);

    return { collided, entity: entity2 };
  }

  private resolveTileCollision(entity: Entity, direction: string): void {
    const position = entity.components.get('position') as Position;
    const velocity = entity.components.get('velocity');

    if (direction.includes('up')) {
      position.y = Math.ceil(position.y / 32) * 32;
      if (velocity) velocity.vy = 0;
    }
    if (direction.includes('down')) {
      position.y = Math.floor(position.y / 32) * 32;
      if (velocity) velocity.vy = 0;
    }
    if (direction.includes('left')) {
      position.x = Math.ceil(position.x / 32) * 32;
      if (velocity) velocity.vx = 0;
    }
    if (direction.includes('right')) {
      position.x = Math.floor(position.x / 32) * 32;
      if (velocity) velocity.vx = 0;
    }
  }

  private handleEntityCollision(entity1: Entity, entity2: Entity): void {
    // Handle different collision types
    if (entity2.components.has('interactable')) {
      // This is handled by InteractionSystem
      return;
    }

    if (entity2.components.has('trigger')) {
      this.handleTriggerCollision(entity1, entity2);
    }
  }

  private handleTriggerCollision(entity: Entity, trigger: Entity): void {
    const triggerData = trigger.components.get('trigger');
    if (!triggerData) return;

    // Emit trigger event
    this.scene.events.emit('triggerActivated', {
      triggerType: triggerData.triggerType,
      targetData: triggerData.targetData,
      entity: entity
    });
  }
}
