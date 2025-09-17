/**
 * InteractionSystem - Handles "A-button" interactions
 * 
 * TODO/Next steps:
 * - Add interaction prompts/UI
 * - Implement interaction cooldown
 * - Add visual feedback for interactable objects
 */

import { Entity, Interactable, InteractionContext } from '../components';

export class InteractionSystem {
  private scene: Phaser.Scene;
  private interactKey: Phaser.Input.Keyboard.Key;
  private gameState: any; // Will be typed properly

  constructor(scene: Phaser.Scene, gameState: any) {
    this.scene = scene;
    this.gameState = gameState;
    this.interactKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update(entities: Entity[], player: Entity): void {
    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.handleInteraction(entities, player);
    }
  }

  private handleInteraction(entities: Entity[], player: Entity): void {
    const playerPos = player.components.get('position');
    if (!playerPos) return;

    // Find nearest interactable entity
    const nearestInteractable = this.findNearestInteractable(entities, playerPos);
    
    if (nearestInteractable) {
      const interactable = nearestInteractable.components.get('interactable') as Interactable;
      const context: InteractionContext = {
        player,
        scene: this.scene,
        gameState: this.gameState
      };

      // Check if interaction is allowed
      if (interactable.canInteract && !interactable.canInteract(context)) {
        return;
      }

      // Execute interaction
      interactable.onInteract(context);
    }
  }

  private findNearestInteractable(entities: Entity[], playerPos: any): Entity | null {
    let nearest: Entity | null = null;
    let nearestDistance = Infinity;

    entities.forEach(entity => {
      if (!entity.components.has('interactable') || !entity.components.has('position')) {
        return;
      }

      const entityPos = entity.components.get('position');
      const interactable = entity.components.get('interactable') as Interactable;
      
      const distance = Phaser.Math.Distance.Between(
        playerPos.x, playerPos.y,
        entityPos.x, entityPos.y
      );

      if (distance <= interactable.range && distance < nearestDistance) {
        nearest = entity;
        nearestDistance = distance;
      }
    });

    return nearest;
  }

  getInteractionPrompt(entities: Entity[], player: Entity): string | null {
    const playerPos = player.components.get('position');
    if (!playerPos) return null;

    const nearestInteractable = this.findNearestInteractable(entities, playerPos);
    
    if (nearestInteractable) {
      const interactable = nearestInteractable.components.get('interactable') as Interactable;
      return interactable.prompt || 'Press SPACE to interact';
    }

    return null;
  }
}
