/**
 * BattleScene - Turn-based Final Fantasy-like battles
 */

import { EncounterManager } from '../game/EncounterManager';
import { QuestionGenerator } from '../game/QuestionGenerator';
import { GameState } from '../game/GameState';
import { SaveSystem } from '../game/SaveSystem';
import { Analytics } from '../game/Analytics';
import { RoomRow } from '../types/content';

export class BattleScene extends Phaser.Scene {
  private encounterManager!: EncounterManager;
  private questionGenerator!: QuestionGenerator;
  private gameState!: GameState;
  private analytics!: Analytics;
  
  private roomRow!: RoomRow;
  private currentDungeon: string = '';
  private battleUI!: Phaser.GameObjects.Container;
  private questionUI!: Phaser.GameObjects.Container;
  
  // Battle state
  private currentQuestion: any = null;
  private battleStartTime: number = 0;
  private questionsAnswered: number = 0;
  private correctAnswers: number = 0;
  private isBossBattle: boolean = false;
  private bossPhase: number = 1;

  constructor() {
    super({ key: 'BattleScene' });
  }

  init(data: { roomRow: RoomRow; dungeon: string }): void {
    this.roomRow = data.roomRow;
    this.currentDungeon = data.dungeon;
    this.isBossBattle = data.roomRow.Typ === 'boss-combat';
    this.bossPhase = 1;
  }

  preload(): void {
    this.load.atlas('ui_atlas', 'assets/ui/ui_atlas.png', 'assets/ui/ui_atlas.json');
  }

  create(): void {
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

  private createBattleBackground(): void {
    const bgColor = this.isBossBattle ? 0xE76F51 : 0x2C3E50;
    this.add.rectangle(400, 300, 800, 600, bgColor);
    
    const titleText = this.isBossBattle ? `BOSS: ${this.roomRow.Rum}` : `Battle: ${this.roomRow.Rum}`;
    this.add.text(400, 50, titleText, {
      fontSize: '28px',
      color: '#E8C170',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);
  }

  private createBattleUI(): void {
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

  private startBattle(): void {
    this.nextQuestion();
  }

  private nextQuestion(): void {
    this.currentQuestion = this.questionGenerator.generateQuestion(this.roomRow);
    this.showQuestionUI();
    this.updateBattleUI();
  }

  private showQuestionUI(): void {
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
    } else {
      this.addAnswerInput();
    }
  }

  private addAnswerOptions(): void {
    this.currentQuestion.options.forEach((option: string, index: number) => {
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

  private addAnswerInput(): void {
    const inputBg = this.add.rectangle(400, 400, 200, 40, 0x3F5B6E);
    inputBg.setStrokeStyle(2, 0xE8C170);
    
    const inputText = this.add.text(400, 400, 'Type your answer...', {
      fontSize: '16px',
      color: '#DAE4EA',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);
    
    this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        this.submitAnswer(inputText.text);
      }
    });
    
    this.questionUI.add([inputBg, inputText]);
  }

  private submitAnswer(answer: string): void {
    const isCorrect = answer === this.currentQuestion.answer;
    
    this.questionsAnswered++;
    if (isCorrect) {
      this.correctAnswers++;
    }
    
    if (isCorrect) {
      this.handleCorrectAnswer();
    } else {
      this.handleIncorrectAnswer();
    }
  }

  private handleCorrectAnswer(): void {
    this.encounterManager.submitAnswer(this.currentQuestion.answer);
    
    if (this.encounterManager.isEnemyDefeated()) {
      this.handleBattleWin();
      return;
    }
    
    this.time.delayedCall(1500, () => {
      this.nextQuestion();
    });
  }

  private handleIncorrectAnswer(): void {
    this.gameState.damagePlayer(this.roomRow['Skada vid fel']);
    
    if (this.gameState.isPlayerDefeated()) {
      this.handleBattleLose();
      return;
    }
    
    this.time.delayedCall(1500, () => {
      this.nextQuestion();
    });
  }

  private handleBattleWin(): void {
    const xpGained = this.calculateXPGain();
    this.gameState.addXP(xpGained);
    SaveSystem.markRoomCompleted(this.roomRow.Rum);
    
    this.showVictoryScreen(xpGained);
  }

  private handleBattleLose(): void {
    this.gameState.resetHP();
    this.showDefeatScreen();
  }

  private calculateXPGain(): number {
    let baseXP = 10;
    const difficultyMultiplier: { [key: string]: number } = {
      'E': 1.0, 'C': 1.5, 'A': 2.0, 'Boss': 3.0
    };
    baseXP *= difficultyMultiplier[this.roomRow.Nivå] || 1.0;
    return Math.floor(baseXP);
  }

  private showVictoryScreen(xpGained: number): void {
    this.battleUI.destroy();
    if (this.questionUI) this.questionUI.destroy();
    
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

  private showDefeatScreen(): void {
    this.battleUI.destroy();
    if (this.questionUI) this.questionUI.destroy();
    
    const defeatText = this.add.text(400, 300, 'DEFEAT! Teleporting to Hub...', {
      fontSize: '36px',
      color: '#E76F51',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);
    
    this.time.delayedCall(2000, () => {
      this.scene.start('HubScene');
    });
  }

  private handleBattleFinish(result: { won: boolean; xp: number }): void {
    if (result.won) {
      this.handleBattleWin();
    } else {
      this.handleBattleLose();
    }
  }

  private updateBattleUI(): void {
    const playerHpFill = this.battleUI.getData('playerHpFill') as Phaser.GameObjects.Rectangle;
    const enemyHpFill = this.battleUI.getData('enemyHpFill') as Phaser.GameObjects.Rectangle;
    
    const playerHpPercent = this.gameState.playerHP / this.gameState.playerMaxHP;
    playerHpFill.width = 200 * playerHpPercent;
    
    const enemyHpPercent = this.encounterManager.getEnemyHP() / this.roomRow['Fiende-HP/Segment'];
    enemyHpFill.width = 200 * enemyHpPercent;
  }

  update(time: number, delta: number): void {
    this.encounterManager.update(delta);
    this.updateBattleUI();
  }
}