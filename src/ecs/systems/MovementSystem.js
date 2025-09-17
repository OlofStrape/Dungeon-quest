/**
 * MovementSystem - Handles top-down Zelda-like movement
 *
 * TODO/Next steps:
 * - Add diagonal movement smoothing
 * - Implement movement animations
 * - Add collision with tilemap walls
 */
export class MovementSystem {
    constructor(scene) {
        this.speed = 120; // pixels per second
        this.scene = scene;
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.wasdKeys = this.scene.input.keyboard.addKeys('W,S,A,D');
    }
    update(entities, delta) {
        entities.forEach(entity => {
            if (this.hasMovementComponents(entity)) {
                this.updateEntityMovement(entity, delta);
            }
        });
    }
    hasMovementComponents(entity) {
        return entity.components.has('position') &&
            entity.components.has('velocity');
    }
    updateEntityMovement(entity, delta) {
        const position = entity.components.get('position');
        const velocity = entity.components.get('velocity');
        // Handle input for player entities
        if (entity.id === 'player') {
            this.handlePlayerInput(velocity);
        }
        // Apply movement
        const deltaSeconds = delta / 1000;
        position.x += velocity.vx * deltaSeconds;
        position.y += velocity.vy * deltaSeconds;
        // Apply friction
        velocity.vx *= 0.8;
        velocity.vy *= 0.8;
        // Stop very small movements
        if (Math.abs(velocity.vx) < 0.1)
            velocity.vx = 0;
        if (Math.abs(velocity.vy) < 0.1)
            velocity.vy = 0;
    }
    handlePlayerInput(velocity) {
        // Reset velocity
        velocity.vx = 0;
        velocity.vy = 0;
        // Check for input
        const left = this.cursors.left.isDown || this.wasdKeys.A.isDown;
        const right = this.cursors.right.isDown || this.wasdKeys.D.isDown;
        const up = this.cursors.up.isDown || this.wasdKeys.W.isDown;
        const down = this.cursors.down.isDown || this.wasdKeys.S.isDown;
        // Apply movement
        if (left)
            velocity.vx = -this.speed;
        if (right)
            velocity.vx = this.speed;
        if (up)
            velocity.vy = -this.speed;
        if (down)
            velocity.vy = this.speed;
        // Normalize diagonal movement
        if (velocity.vx !== 0 && velocity.vy !== 0) {
            const factor = Math.sqrt(2) / 2;
            velocity.vx *= factor;
            velocity.vy *= factor;
        }
    }
    getMovementDirection() {
        const left = this.cursors.left.isDown || this.wasdKeys.A.isDown;
        const right = this.cursors.right.isDown || this.wasdKeys.D.isDown;
        const up = this.cursors.up.isDown || this.wasdKeys.W.isDown;
        const down = this.cursors.down.isDown || this.wasdKeys.S.isDown;
        if (up && left)
            return 'up-left';
        if (up && right)
            return 'up-right';
        if (down && left)
            return 'down-left';
        if (down && right)
            return 'down-right';
        if (up)
            return 'up';
        if (down)
            return 'down';
        if (left)
            return 'left';
        if (right)
            return 'right';
        return 'idle';
    }
    isMoving() {
        return this.cursors.left.isDown || this.cursors.right.isDown ||
            this.cursors.up.isDown || this.cursors.down.isDown ||
            this.wasdKeys.A.isDown || this.wasdKeys.D.isDown ||
            this.wasdKeys.W.isDown || this.wasdKeys.S.isDown;
    }
}
