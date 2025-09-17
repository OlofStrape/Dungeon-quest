/**
 * PuzzleManager - General puzzle framework for non-combat rooms
 *
 * TODO/Next steps:
 * - Add puzzle state persistence
 * - Implement puzzle hints system
 * - Add puzzle completion animations
 */
export class PuzzleManager {
    constructor(scene) {
        this.scene = scene;
        this.state = {
            goals: new Map(),
            completedGoals: new Set(),
            isComplete: false
        };
    }
    registerGoal(goal) {
        this.state.goals.set(goal.id, goal);
        this.scene.events.emit('goalRegistered', goal);
    }
    tick(id) {
        const goal = this.state.goals.get(id);
        if (!goal) {
            console.warn(`Goal ${id} not found`);
            return;
        }
        goal.progress++;
        // Call progress callback
        if (goal.onProgress) {
            goal.onProgress(goal.progress, goal.required);
        }
        this.scene.events.emit('goalProgress', {
            id,
            progress: goal.progress,
            required: goal.required
        });
        // Check if goal is complete
        if (goal.progress >= goal.required) {
            this.completeGoal(id);
        }
    }
    completeGoal(id) {
        const goal = this.state.goals.get(id);
        if (!goal)
            return;
        this.state.completedGoals.add(id);
        // Call completion callback
        if (goal.onComplete) {
            goal.onComplete();
        }
        this.scene.events.emit('goalCompleted', goal);
        // Check if all goals are complete
        this.checkOverallCompletion();
    }
    checkOverallCompletion() {
        const allGoalsComplete = Array.from(this.state.goals.keys()).every(id => this.state.completedGoals.has(id));
        if (allGoalsComplete && !this.state.isComplete) {
            this.state.isComplete = true;
            this.scene.events.emit('puzzleComplete');
        }
    }
    isComplete(id) {
        return this.state.completedGoals.has(id);
    }
    isOverallComplete() {
        return this.state.isComplete;
    }
    getProgress(id) {
        const goal = this.state.goals.get(id);
        if (!goal)
            return null;
        return {
            current: goal.progress,
            required: goal.required
        };
    }
    getAllProgress() {
        return Array.from(this.state.goals.entries()).map(([id, goal]) => ({
            id,
            current: goal.progress,
            required: goal.required
        }));
    }
    reset() {
        this.state.goals.clear();
        this.state.completedGoals.clear();
        this.state.isComplete = false;
    }
    // Factory methods for common puzzle types
    static createProgressGoal(id, required, onComplete) {
        return {
            id,
            required,
            progress: 0,
            onComplete
        };
    }
    static createChoiceGoal(id, onComplete) {
        return {
            id,
            required: 1,
            progress: 0,
            onComplete
        };
    }
    static createDragDropGoal(id, requiredItems, onComplete) {
        return {
            id,
            required: requiredItems,
            progress: 0,
            onComplete
        };
    }
}
