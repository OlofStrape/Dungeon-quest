export class GameState {
  private static instance: GameState;
  
  playerMaxHP = 12;
  playerHP = 12;
  playerXP = 0;
  level = 1;

  // enkel energi till hints
  sidekickEnergy = 5;

  private constructor() {}

  static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

  resetHP(newMax?: number) {
    if (newMax) this.playerMaxHP = newMax;
    this.playerHP = this.playerMaxHP;
  }

  addXP(xp: number) {
    this.playerXP += xp;
    while (this.playerXP >= this.level * 50) {
      this.level++;
      this.playerMaxHP += 1;
      this.playerHP = this.playerMaxHP;
    }
  }

  damage(d: number) {
    this.playerHP = Math.max(0, this.playerHP - d);
  }

  damagePlayer(damage: number) {
    this.damage(damage);
  }

  isDown() { return this.playerHP <= 0; }
  
  isPlayerDefeated() { return this.isDown(); }
}

export const gameState = GameState.getInstance();
