import Phaser from 'phaser';
import { gameState } from '../game/GameState';
export class BattleUI extends Phaser.Scene {
    constructor() {
        super(...arguments);
        this.options = [];
    }
    init(data) {
        this.manager = data.manager;
        this.row = data.row;
    }
    create() {
        this.add.text(20, 20, this.row["Dungeon"] + " – " + this.row["Rum"], { fontSize: '18px' });
        this.enemyHPBar = this.add.text(20, 50, `Fiende HP: ${this.manager.enemyHP}`);
        this.playerHPBar = this.add.text(20, 80, `Din HP: ${gameState.playerHP}/${gameState.playerMaxHP}`);
        this.prompt = this.add.text(20, 140, "", { fontSize: '24px' });
        this.next();
    }
    next() {
        const q = this.manager.nextQuestion();
        this.prompt.setText(q.prompt);
        this.options.forEach(o => o.destroy());
        this.options = [];
        if (q.options && q.options.length) {
            q.options.forEach((opt, i) => {
                const t = this.add.text(20, 200 + i * 40, opt, { fontSize: '20px', backgroundColor: '#eee' })
                    .setInteractive()
                    .on('pointerup', () => this.answer(opt === q.answer));
                this.options.push(t);
            });
        }
        else {
            const input = this.add.dom(400, 300, 'input', 'width:220px;font-size:18px;');
            const btn = this.add.text(640, 300, 'OK', { fontSize: '20px', backgroundColor: '#ddd' })
                .setInteractive()
                .on('pointerup', () => {
                const el = input.node;
                this.answer(el.value.trim() === q.answer.trim());
                input.destroy();
                btn.destroy();
            });
        }
    }
    answer(correct) {
        this.manager.handleAnswer(correct);
        this.enemyHPBar.setText(`Fiende HP: ${this.manager.enemyHP}`);
        this.playerHPBar.setText(`Din HP: ${gameState.playerHP}/${gameState.playerMaxHP}`);
        // player HP fetch via GameState singleton (simple UI refresh via event in production)
        // For now we just restart question until finish; Scene that created us handles finish via callback in EncounterManager.
        if (this.manager.enemyHP > 0 && this.manager.questionsLeft > 0) {
            this.next();
        }
    }
}
BattleUI.KEY = 'BattleUI';
