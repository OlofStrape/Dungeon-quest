export class GameState {
    constructor() {
        this.playerMaxHP = 12;
        this.playerHP = 12;
        this.playerXP = 0;
        this.level = 1;
        // enkel energi till hints
        this.sidekickEnergy = 5;
    }
    resetHP(newMax) {
        if (newMax)
            this.playerMaxHP = newMax;
        this.playerHP = this.playerMaxHP;
    }
    addXP(xp) {
        this.playerXP += xp;
        while (this.playerXP >= this.level * 50) {
            this.level++;
            this.playerMaxHP += 1;
            this.playerHP = this.playerMaxHP;
        }
    }
    damage(d) {
        this.playerHP = Math.max(0, this.playerHP - d);
    }
    isDown() { return this.playerHP <= 0; }
}
export const gameState = new GameState();
