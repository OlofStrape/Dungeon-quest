/**
 * SaveSystem - Handles localStorage persistence
 *
 * TODO/Next steps:
 * - Add save slot management
 * - Implement cloud save backup
 * - Add save data validation
 */
export class SaveSystem {
    static save(data) {
        try {
            const existingData = this.load();
            const saveData = {
                ...existingData,
                ...data,
                timestamp: Date.now(),
                version: this.VERSION
            };
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
            console.log('Game saved successfully');
        }
        catch (error) {
            console.error('Failed to save game:', error);
        }
    }
    static load() {
        try {
            const saved = localStorage.getItem(this.SAVE_KEY);
            if (!saved) {
                return this.getDefaultSaveData();
            }
            const data = JSON.parse(saved);
            // Validate version compatibility
            if (data.version !== this.VERSION) {
                console.warn('Save version mismatch, using defaults');
                return this.getDefaultSaveData();
            }
            return data;
        }
        catch (error) {
            console.error('Failed to load save data:', error);
            return this.getDefaultSaveData();
        }
    }
    static getDefaultSaveData() {
        return {
            player: {
                hp: 12,
                maxHp: 12,
                xp: 0,
                level: 1,
                sidekickEnergy: 100
            },
            progress: {
                completedRooms: [],
                unlockedDoors: [],
                completedBosses: [],
                currentDungeon: undefined,
                currentRoom: undefined
            },
            settings: {
                volume: 0.7,
                difficulty: 'normal',
                hintsEnabled: true
            },
            timestamp: Date.now(),
            version: this.VERSION
        };
    }
    static clearSave() {
        try {
            localStorage.removeItem(this.SAVE_KEY);
            console.log('Save data cleared');
        }
        catch (error) {
            console.error('Failed to clear save data:', error);
        }
    }
    static hasSave() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    }
    // Convenience methods for common operations
    static savePlayerState(player) {
        this.save({
            player: {
                hp: player.hp,
                maxHp: player.maxHp,
                xp: player.xp,
                level: player.level,
                sidekickEnergy: player.sidekickEnergy
            }
        });
    }
    static saveProgress(progress) {
        this.save({ progress });
    }
    static saveSettings(settings) {
        this.save({ settings });
    }
    static markRoomCompleted(roomId) {
        const data = this.load();
        if (!data.progress.completedRooms.includes(roomId)) {
            data.progress.completedRooms.push(roomId);
            this.save({ progress: data.progress });
        }
    }
    static markDoorUnlocked(doorId) {
        const data = this.load();
        if (!data.progress.unlockedDoors.includes(doorId)) {
            data.progress.unlockedDoors.push(doorId);
            this.save({ progress: data.progress });
        }
    }
    static markBossCompleted(bossId) {
        const data = this.load();
        if (!data.progress.completedBosses.includes(bossId)) {
            data.progress.completedBosses.push(bossId);
            this.save({ progress: data.progress });
        }
    }
    static isRoomCompleted(roomId) {
        const data = this.load();
        return data.progress.completedRooms.includes(roomId);
    }
    static isDoorUnlocked(doorId) {
        const data = this.load();
        return data.progress.unlockedDoors.includes(doorId);
    }
    static isBossCompleted(bossId) {
        const data = this.load();
        return data.progress.completedBosses.includes(bossId);
    }
    static setCurrentLocation(dungeon, room) {
        this.save({
            progress: {
                ...this.load().progress,
                currentDungeon: dungeon,
                currentRoom: room
            }
        });
    }
    static getCurrentLocation() {
        const data = this.load();
        return {
            dungeon: data.progress.currentDungeon,
            room: data.progress.currentRoom
        };
    }
    // Auto-save functionality
    static enableAutoSave(intervalMs = 30000) {
        setInterval(() => {
            // Auto-save current game state
            this.save({ timestamp: Date.now() });
        }, intervalMs);
    }
}
SaveSystem.SAVE_KEY = 'dungeon_of_numbers_save';
SaveSystem.VERSION = '1.0.0';
