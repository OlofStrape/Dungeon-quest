import { QuestionGenerator } from "./QuestionGenerator";
import { gameState } from "./GameState";
export class EncounterManager {
    constructor(row, onFinish) {
        this.row = row;
        this.onFinish = onFinish;
        this.enemyHP = this.row["Fiende-HP/Segment"];
        this.questionsLeft = this.row["Frågor/uppgifter"];
        this.timePerQ = this.row["Tid/gräns (sek)"] ?? undefined;
    }
    nextQuestion() {
        return QuestionGenerator.generate(this.row);
    }
    handleAnswer(correct) {
        if (correct) {
            this.enemyHP -= this.row["Skada vid rätt"];
            this.questionsLeft--;
        }
        else {
            gameState.damage(this.row["Skada vid fel"]);
        }
        if (gameState.isDown()) {
            this.onFinish({ won: false, xpGained: 0 });
        }
        else if (this.enemyHP <= 0 || this.questionsLeft <= 0) {
            const reward = JSON.parse(this.row["Belöning(JSON)"] || '{"xp":6}');
            gameState.addXP(reward.xp ?? 6);
            this.onFinish({ won: true, xpGained: reward.xp ?? 6 });
        }
    }
}
