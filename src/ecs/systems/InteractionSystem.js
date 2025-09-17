/**
 * InteractionSystem - Handles "A-button" interactions
 *
 * TODO/Next steps:
 * - Add interaction prompts/UI
 * - Implement interaction cooldown
 * - Add visual feedback for interactable objects
 */
export class InteractionSystem {
    constructor(scene, gameState) {
        this.scene = scene;
        this.gameState = gameState;
        this.interactKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    update(entities, player) {
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            this.handleInteraction(entities, player);
        }
    }
    handleInteraction(entities, player) {
        const playerPos = player.components.get('position');
        if (!playerPos)
            return;
        // Find nearest interactable entity
        const nearestInteractable = this.findNearestInteractable(entities, playerPos);
        if (nearestInteractable) {
            const interactable = nearestInteractable.components.get('interactable');
            const context = {
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
    findNearestInteractable(entities, playerPos) {
        let nearest = null;
        let nearestDistance = Infinity;
        entities.forEach(entity => {
            if (!entity.components.has('interactable') || !entity.components.has('position')) {
                return;
            }
            const entityPos = entity.components.get('position');
            const interactable = entity.components.get('interactable');
            const distance = Phaser.Math.Distance.Between(playerPos.x, playerPos.y, entityPos.x, entityPos.y);
            if (distance <= interactable.range && distance < nearestDistance) {
                nearest = entity;
                nearestDistance = distance;
            }
        });
        return nearest;
    }
    getInteractionPrompt(entities, player) {
        const playerPos = player.components.get('position');
        if (!playerPos)
            return null;
        const nearestInteractable = this.findNearestInteractable(entities, playerPos);
        if (nearestInteractable) {
            const interactable = nearestInteractable.components.get('interactable');
            return interactable.prompt || 'Press SPACE to interact';
        }
        return null;
    }
}
