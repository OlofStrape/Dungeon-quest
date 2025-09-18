export class GameState {
    constructor() {
        this.playerMaxHP = 12;
        this.playerHP = 12;
        this.playerXP = 0;
        this.level = 1;
        // enkel energi till hints
        this.sidekickEnergy = 5;
    }
    static getInstance() {
        if (!GameState.instance) {
            GameState.instance = new GameState();
        }
        return GameState.instance;
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
    damagePlayer(damage) {
        this.damage(damage);
    }
    isDown() { return this.playerHP <= 0; }
    isPlayerDefeated() { return this.isDown(); }
}
export const gameState = GameState.getInstance();
