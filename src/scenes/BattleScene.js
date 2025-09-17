/**
 * BattleScene - Turn-based Final Fantasy-like battles
 */
import { EncounterManager } from '../game/EncounterManager';
import { QuestionGenerator } from '../game/QuestionGenerator';
import { GameState } from '../game/GameState';
import { SaveSystem } from '../game/SaveSystem';
import { Analytics } from '../game/Analytics';
export class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });
        this.currentDungeon = '';
        // Battle state
        this.currentQuestion = null;
        this.battleStartTime = 0;
        this.questionsAnswered = 0;
        this.correctAnswers = 0;
        this.isBossBattle = false;
        this.bossPhase = 1;
    }
    init(data) {
        this.roomRow = data.roomRow;
        this.currentDungeon = data.dungeon;
        this.isBossBattle = data.roomRow.Typ === 'boss-combat';
        this.bossPhase = 1;
    }
    preload() {
        this.load.atlas('ui_atlas', 'assets/ui/ui_atlas.png', 'assets/ui/ui_atlas.json');
    }
    create() {
        // Initialize systems
        this.gameState = GameState.getInstance();
        this.analytics = Analytics.getInstance();
        this.questionGenerator = new QuestionGenerator();
        // Initialize encounter manager
        this.encounterManager = new EncounterManager({
            row: this.roomRow,
            onFinish: (result) => this.handleBattleFinish(result)
        });
        // Create battle background
        this.createBattleBackground();
        // Create battle UI
        this.createBattleUI();
        // Start battle
        this.startBattle();
        this.battleStartTime = Date.now();
    }
    createBattleBackground() {
        const bgColor = this.isBossBattle ? 0xE76F51 : 0x2C3E50;
        this.add.rectangle(400, 300, 800, 600, bgColor);
        const titleText = this.isBossBattle ? `BOSS: ${this.roomRow.Rum}` : `Battle: ${this.roomRow.Rum}`;
        this.add.text(400, 50, titleText, {
            fontSize: '28px',
            color: '#E8C170',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
    }
    createBattleUI() {
        this.battleUI = this.add.container(0, 0);
        // Player HP Bar
        const playerHpBg = this.add.rectangle(100, 500, 200, 20, 0x22313A);
        const playerHpFill = this.add.rectangle(100, 500, 200, 20, 0xE76F51);
        playerHpFill.setOrigin(0, 0.5);
        playerHpBg.setOrigin(0, 0.5);
        // Enemy HP Bar
        const enemyHpBg = this.add.rectangle(700, 100, 200, 20, 0x22313A);
        const enemyHpFill = this.add.rectangle(700, 100, 200, 20, 0x2A9D8F);
        enemyHpFill.setOrigin(0, 0.5);
        enemyHpBg.setOrigin(0, 0.5);
        this.battleUI.add([playerHpBg, playerHpFill, enemyHpBg, enemyHpFill]);
        this.battleUI.setData('playerHpFill', playerHpFill);
        this.battleUI.setData('enemyHpFill', enemyHpFill);
    }
    startBattle() {
        this.nextQuestion();
    }
    nextQuestion() {
        this.currentQuestion = this.questionGenerator.generateQuestion(this.roomRow);
        this.showQuestionUI();
        this.updateBattleUI();
    }
    showQuestionUI() {
        if (this.questionUI) {
            this.questionUI.destroy();
        }
        this.questionUI = this.add.container(0, 0);
        const questionBg = this.add.rectangle(400, 350, 600, 300, 0x22313A);
        questionBg.setStrokeStyle(3, 0xE8C170);
        const questionText = this.add.text(400, 250, this.currentQuestion.prompt, {
            fontSize: '20px',
            color: '#DAE4EA',
            fontFamily: 'Courier New',
            wordWrap: { width: 550 }
        }).setOrigin(0.5);
        this.questionUI.add([questionBg, questionText]);
        if (this.currentQuestion.options) {
            this.addAnswerOptions();
        }
        else {
            this.addAnswerInput();
        }
    }
    addAnswerOptions() {
        this.currentQuestion.options.forEach((option, index) => {
            const optionBg = this.add.rectangle(400, 350 + index * 50, 200, 40, 0x3F5B6E);
            optionBg.setStrokeStyle(2, 0xE8C170);
            optionBg.setInteractive();
            const optionText = this.add.text(400, 350 + index * 50, option, {
                fontSize: '16px',
                color: '#DAE4EA',
                fontFamily: 'Courier New'
            }).setOrigin(0.5);
            optionBg.on('pointerdown', () => {
                this.submitAnswer(option);
            });
            this.questionUI.add([optionBg, optionText]);
        });
    }
    addAnswerInput() {
        const inputBg = this.add.rectangle(400, 400, 200, 40, 0x3F5B6E);
        inputBg.setStrokeStyle(2, 0xE8C170);
        const inputText = this.add.text(400, 400, 'Type your answer...', {
            fontSize: '16px',
            color: '#DAE4EA',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        this.input.keyboard.on('keydown', (event) => {
            if (event.key === 'Enter') {
                this.submitAnswer(inputText.text);
            }
        });
        this.questionUI.add([inputBg, inputText]);
    }
    submitAnswer(answer) {
        const isCorrect = answer === this.currentQuestion.answer;
        this.questionsAnswered++;
        if (isCorrect) {
            this.correctAnswers++;
        }
        if (isCorrect) {
            this.handleCorrectAnswer();
        }
        else {
            this.handleIncorrectAnswer();
        }
    }
    handleCorrectAnswer() {
        this.encounterManager.submitAnswer(this.currentQuestion.answer);
        if (this.encounterManager.isEnemyDefeated()) {
            this.handleBattleWin();
            return;
        }
        this.time.delayedCall(1500, () => {
            this.nextQuestion();
        });
    }
    handleIncorrectAnswer() {
        this.gameState.damagePlayer(this.roomRow['Skada vid fel']);
        if (this.gameState.isPlayerDefeated()) {
            this.handleBattleLose();
            return;
        }
        this.time.delayedCall(1500, () => {
            this.nextQuestion();
        });
    }
    handleBattleWin() {
        const xpGained = this.calculateXPGain();
        this.gameState.addXP(xpGained);
        SaveSystem.markRoomCompleted(this.roomRow.Rum);
        this.showVictoryScreen(xpGained);
    }
    handleBattleLose() {
        this.gameState.resetHP();
        this.showDefeatScreen();
    }
    calculateXPGain() {
        let baseXP = 10;
        const difficultyMultiplier = {
            'E': 1.0, 'C': 1.5, 'A': 2.0, 'Boss': 3.0
        };
        baseXP *= difficultyMultiplier[this.roomRow.Nivå] || 1.0;
        return Math.floor(baseXP);
    }
    showVictoryScreen(xpGained) {
        this.battleUI.destroy();
        if (this.questionUI)
            this.questionUI.destroy();
        const victoryText = this.add.text(400, 300, `VICTORY! +${xpGained} XP`, {
            fontSize: '36px',
            color: '#7DAF66',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('OverworldScene', {
                dungeon: this.currentDungeon,
                dungeonData: []
            });
        });
    }
    showDefeatScreen() {
        this.battleUI.destroy();
        if (this.questionUI)
            this.questionUI.destroy();
        const defeatText = this.add.text(400, 300, 'DEFEAT! Teleporting to Hub...', {
            fontSize: '36px',
            color: '#E76F51',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        this.time.delayedCall(2000, () => {
            this.scene.start('HubScene');
        });
    }
    handleBattleFinish(result) {
        if (result.won) {
            this.handleBattleWin();
        }
        else {
            this.handleBattleLose();
        }
    }
    updateBattleUI() {
        const playerHpFill = this.battleUI.getData('playerHpFill');
        const enemyHpFill = this.battleUI.getData('enemyHpFill');
        const playerHpPercent = this.gameState.playerHP / this.gameState.playerMaxHP;
        playerHpFill.width = 200 * playerHpPercent;
        const enemyHpPercent = this.encounterManager.getEnemyHP() / this.roomRow['Fiende-HP/Segment'];
        enemyHpFill.width = 200 * enemyHpPercent;
    }
    update(time, delta) {
        this.encounterManager.update(delta);
        this.updateBattleUI();
    }
}
