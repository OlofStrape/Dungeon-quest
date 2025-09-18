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
    generateQuestion(row) {
        return QuestionGenerator.generate(row);
    }
    submitAnswer(answer) {
        // This would need to be implemented based on the current question
        // For now, just call handleAnswer with a placeholder
        this.handleAnswer(true);
    }
    isEnemyDefeated() {
        return this.enemyHP <= 0;
    }
    getEnemyHP() {
        return this.enemyHP;
    }
    update(delta) {
        // Update logic for encounter manager
        // This could include timers, animations, etc.
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
