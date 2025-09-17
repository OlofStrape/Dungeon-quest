/**
 * PuzzleManager - General puzzle framework for non-combat rooms
 * 
 * TODO/Next steps:
 * - Add puzzle state persistence
 * - Implement puzzle hints system
 * - Add puzzle completion animations
 */

export interface Goal {
  id: string;
  required: number;
  progress: number;
  onComplete?: () => void;
  onProgress?: (current: number, required: number) => void;
}

export interface PuzzleState {
  goals: Map<string, Goal>;
  completedGoals: Set<string>;
  isComplete: boolean;
}

export class PuzzleManager {
  private state: PuzzleState;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.state = {
      goals: new Map(),
      completedGoals: new Set(),
      isComplete: false
    };
  }

  registerGoal(goal: Goal): void {
    this.state.goals.set(goal.id, goal);
    this.scene.events.emit('goalRegistered', goal);
  }

  tick(id: string): void {
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

  private completeGoal(id: string): void {
    const goal = this.state.goals.get(id);
    if (!goal) return;

    this.state.completedGoals.add(id);
    
    // Call completion callback
    if (goal.onComplete) {
      goal.onComplete();
    }

    this.scene.events.emit('goalCompleted', goal);

    // Check if all goals are complete
    this.checkOverallCompletion();
  }

  private checkOverallCompletion(): void {
    const allGoalsComplete = Array.from(this.state.goals.keys()).every(
      id => this.state.completedGoals.has(id)
    );

    if (allGoalsComplete && !this.state.isComplete) {
      this.state.isComplete = true;
      this.scene.events.emit('puzzleComplete');
    }
  }

  isComplete(id: string): boolean {
    return this.state.completedGoals.has(id);
  }

  isOverallComplete(): boolean {
    return this.state.isComplete;
  }

  getProgress(id: string): { current: number; required: number } | null {
    const goal = this.state.goals.get(id);
    if (!goal) return null;

    return {
      current: goal.progress,
      required: goal.required
    };
  }

  getAllProgress(): Array<{ id: string; current: number; required: number }> {
    return Array.from(this.state.goals.entries()).map(([id, goal]) => ({
      id,
      current: goal.progress,
      required: goal.required
    }));
  }

  reset(): void {
    this.state.goals.clear();
    this.state.completedGoals.clear();
    this.state.isComplete = false;
  }

  // Factory methods for common puzzle types
  static createProgressGoal(id: string, required: number, onComplete?: () => void): Goal {
    return {
      id,
      required,
      progress: 0,
      onComplete
    };
  }

  static createChoiceGoal(id: string, onComplete?: () => void): Goal {
    return {
      id,
      required: 1,
      progress: 0,
      onComplete
    };
  }

  static createDragDropGoal(id: string, requiredItems: number, onComplete?: () => void): Goal {
    return {
      id,
      required: requiredItems,
      progress: 0,
      onComplete
    };
  }
}
