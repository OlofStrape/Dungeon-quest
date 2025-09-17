/**
 * ECS Components for Dungeon of Numbers EDU
 *
 * TODO/Next steps:
 * - Add animation components for sprite states
 * - Implement inventory component for keys/loot
 * - Add audio component for SFX triggers
 */
// Component factory functions
export function createPosition(x, y, z) {
    return { x, y, z };
}
export function createVelocity(vx = 0, vy = 0) {
    return { vx, vy };
}
export function createSprite(texture, frame, scale = 1) {
    return { texture, frame, scale, visible: true };
}
export function createCollider(width, height, isTrigger = false) {
    return { width, height, isTrigger };
}
export function createInteractable(range, onInteract, prompt) {
    return { range, onInteract, prompt };
}
// Entity factory functions
export function createEntity(id) {
    return {
        id,
        components: new Map()
    };
}
export function addComponent(entity, componentType, component) {
    entity.components.set(componentType, component);
}
export function getComponent(entity, componentType) {
    return entity.components.get(componentType);
}
export function hasComponent(entity, componentType) {
    return entity.components.has(componentType);
}
