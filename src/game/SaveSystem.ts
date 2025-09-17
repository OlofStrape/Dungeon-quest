/**
 * SaveSystem - Handles localStorage persistence
 * 
 * TODO/Next steps:
 * - Add save slot management
 * - Implement cloud save backup
 * - Add save data validation
 */

export interface SaveData {
  player: {
    hp: number;
    maxHp: number;
    xp: number;
    level: number;
    sidekickEnergy: number;
  };
  progress: {
    completedRooms: string[];
    unlockedDoors: string[];
    completedBosses: string[];
    currentDungeon?: string;
    currentRoom?: string;
  };
  settings: {
    volume: number;
    difficulty: string;
    hintsEnabled: boolean;
  };
  timestamp: number;
  version: string;
}

export class SaveSystem {
  private static readonly SAVE_KEY = 'dungeon_of_numbers_save';
  private static readonly VERSION = '1.0.0';

  static save(data: Partial<SaveData>): void {
    try {
      const existingData = this.load();
      const saveData: SaveData = {
        ...existingData,
        ...data,
        timestamp: Date.now(),
        version: this.VERSION
      };

      localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
      console.log('Game saved successfully');
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  }

  static load(): SaveData {
    try {
      const saved = localStorage.getItem(this.SAVE_KEY);
      if (!saved) {
        return this.getDefaultSaveData();
      }

      const data = JSON.parse(saved) as SaveData;
      
      // Validate version compatibility
      if (data.version !== this.VERSION) {
        console.warn('Save version mismatch, using defaults');
        return this.getDefaultSaveData();
      }

      return data;
    } catch (error) {
      console.error('Failed to load save data:', error);
      return this.getDefaultSaveData();
    }
  }

  static getDefaultSaveData(): SaveData {
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

  static clearSave(): void {
    try {
      localStorage.removeItem(this.SAVE_KEY);
      console.log('Save data cleared');
    } catch (error) {
      console.error('Failed to clear save data:', error);
    }
  }

  static hasSave(): boolean {
    return localStorage.getItem(this.SAVE_KEY) !== null;
  }

  // Convenience methods for common operations
  static savePlayerState(player: any): void {
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

  static saveProgress(progress: any): void {
    this.save({ progress });
  }

  static saveSettings(settings: any): void {
    this.save({ settings });
  }

  static markRoomCompleted(roomId: string): void {
    const data = this.load();
    if (!data.progress.completedRooms.includes(roomId)) {
      data.progress.completedRooms.push(roomId);
      this.save({ progress: data.progress });
    }
  }

  static markDoorUnlocked(doorId: string): void {
    const data = this.load();
    if (!data.progress.unlockedDoors.includes(doorId)) {
      data.progress.unlockedDoors.push(doorId);
      this.save({ progress: data.progress });
    }
  }

  static markBossCompleted(bossId: string): void {
    const data = this.load();
    if (!data.progress.completedBosses.includes(bossId)) {
      data.progress.completedBosses.push(bossId);
      this.save({ progress: data.progress });
    }
  }

  static isRoomCompleted(roomId: string): boolean {
    const data = this.load();
    return data.progress.completedRooms.includes(roomId);
  }

  static isDoorUnlocked(doorId: string): boolean {
    const data = this.load();
    return data.progress.unlockedDoors.includes(doorId);
  }

  static isBossCompleted(bossId: string): boolean {
    const data = this.load();
    return data.progress.completedBosses.includes(bossId);
  }

  static setCurrentLocation(dungeon?: string, room?: string): void {
    this.save({
      progress: {
        ...this.load().progress,
        currentDungeon: dungeon,
        currentRoom: room
      }
    });
  }

  static getCurrentLocation(): { dungeon?: string; room?: string } {
    const data = this.load();
    return {
      dungeon: data.progress.currentDungeon,
      room: data.progress.currentRoom
    };
  }

  // Auto-save functionality
  static enableAutoSave(intervalMs: number = 30000): void {
    setInterval(() => {
      // Auto-save current game state
      this.save({ timestamp: Date.now() });
    }, intervalMs);
  }
}
