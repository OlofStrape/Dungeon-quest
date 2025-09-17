export class GameState {
  playerMaxHP = 12;
  playerHP = 12;
  playerXP = 0;
  level = 1;

  // enkel energi till hints
  sidekickEnergy = 5;

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

  isDown() { return this.playerHP <= 0; }
}

export const gameState = new GameState();
