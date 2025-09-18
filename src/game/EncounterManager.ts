import type { RoomRow } from "../types/content";
import { QuestionGenerator } from "./QuestionGenerator";
import { gameState } from "./GameState";

export interface EncounterResult {
  won: boolean;
  xpGained: number;
}

export class EncounterManager {
  constructor(private row: RoomRow, private onFinish: (res: EncounterResult) => void) {}

  enemyHP = this.row["Fiende-HP/Segment"];
  questionsLeft = this.row["Frågor/uppgifter"];
  timePerQ = this.row["Tid/gräns (sek)"] ?? undefined;

  nextQuestion() {
    return QuestionGenerator.generate(this.row);
  }

  generateQuestion(row: RoomRow) {
    return QuestionGenerator.generate(row);
  }

  submitAnswer(answer: string) {
    // This would need to be implemented based on the current question
    // For now, just call handleAnswer with a placeholder
    this.handleAnswer(true);
  }

  isEnemyDefeated(): boolean {
    return this.enemyHP <= 0;
  }

  getEnemyHP(): number {
    return this.enemyHP;
  }

  update(delta: number) {
    // Update logic for encounter manager
    // This could include timers, animations, etc.
  }

  handleAnswer(correct: boolean) {
    if (correct) {
      this.enemyHP -= this.row["Skada vid rätt"];
      this.questionsLeft--;
    } else {
      gameState.damage(this.row["Skada vid fel"]);
    }

    if (gameState.isDown()) {
      this.onFinish({ won: false, xpGained: 0 });
    } else if (this.enemyHP <= 0 || this.questionsLeft <= 0) {
      const reward = JSON.parse(this.row["Belöning(JSON)"] || '{"xp":6}');
      gameState.addXP(reward.xp ?? 6);
      this.onFinish({ won: true, xpGained: reward.xp ?? 6 });
    }
  }
}
