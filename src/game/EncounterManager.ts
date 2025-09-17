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
