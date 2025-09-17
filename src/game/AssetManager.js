/**
 * AssetManager - Centralized asset management according to Art Bible
 *
 * Handles loading, caching, and providing access to all game assets
 * following the Art Bible specifications for Dungeon of Numbers EDU.
 */
export class AssetManager {
    constructor() {
        this.loadedAssets = new Map();
        this.loadingPromises = new Map();
    }
    static getInstance() {
        if (!AssetManager.instance) {
            AssetManager.instance = new AssetManager();
        }
        return AssetManager.instance;
    }
    /**
     * Load a sprite atlas
     */
    async loadSpriteAtlas(key, textureUrl, atlasUrl) {
        if (this.loadedAssets.has(key)) {
            return;
        }
        if (this.loadingPromises.has(key)) {
            return this.loadingPromises.get(key);
        }
        const promise = new Promise((resolve, reject) => {
            // This would be called from a Phaser scene
            // For now, we'll just mark it as loaded
            this.loadedAssets.set(key, { textureUrl, atlasUrl });
            resolve();
        });
        this.loadingPromises.set(key, promise);
        return promise;
    }
    /**
     * Load a tileset
     */
    async loadTileset(key, textureUrl, tilemapUrl) {
        if (this.loadedAssets.has(key)) {
            return;
        }
        const promise = new Promise((resolve) => {
            this.loadedAssets.set(key, { textureUrl, tilemapUrl });
            resolve();
        });
        this.loadingPromises.set(key, promise);
        return promise;
    }
    /**
     * Get loaded asset
     */
    getAsset(key) {
        return this.loadedAssets.get(key);
    }
    /**
     * Check if asset is loaded
     */
    isAssetLoaded(key) {
        return this.loadedAssets.has(key);
    }
    /**
     * Get all character sprite keys
     */
    getCharacterSpriteKeys() {
        return [
            'lanternbearer_walk',
            'lanternbearer_idle',
            'lanternbearer_cast'
        ];
    }
    /**
     * Get all sidekick sprite keys
     */
    getSidekickSpriteKeys() {
        return [
            'sidekick_idle'
        ];
    }
    /**
     * Get all boss sprite keys
     */
    getBossSpriteKeys() {
        return [
            'times_troll',
            'hourglass_wraith',
            'shape_mimic'
        ];
    }
    /**
     * Get all tileset keys
     */
    getTilesetKeys() {
        return [
            'tal_tileset',
            'tid_tileset',
            'geometri_tileset',
            'algebra_tileset',
            'data_tileset'
        ];
    }
    /**
     * Get UI asset keys
     */
    getUIAssetKeys() {
        return [
            'ui_atlas'
        ];
    }
    /**
     * Get animation configuration for a sprite
     */
    getAnimationConfig(spriteKey) {
        const configs = {
            'lanternbearer_walk': {
                directions: ['up', 'down', 'left', 'right'],
                framesPerDirection: 6,
                frameRate: 8,
                repeat: -1
            },
            'lanternbearer_idle': {
                frames: 3,
                frameRate: 4,
                repeat: -1
            },
            'lanternbearer_cast': {
                frames: 6,
                frameRate: 12,
                repeat: 0
            },
            'sidekick_idle': {
                frames: 4,
                frameRate: 4,
                repeat: -1
            },
            'sidekick_speak': {
                frames: 2,
                frameRate: 6,
                repeat: 0
            },
            'sidekick_hint_spark': {
                frames: 4,
                frameRate: 8,
                repeat: 0
            },
            'sidekick_dash': {
                frames: 4,
                frameRate: 12,
                repeat: 0
            },
            'times_troll_idle': {
                frames: 4,
                frameRate: 6,
                repeat: -1
            },
            'times_troll_attack': {
                frames: 6,
                frameRate: 8,
                repeat: 0
            },
            'times_troll_hit': {
                frames: 2,
                frameRate: 12,
                repeat: 0
            }
        };
        return configs[spriteKey] || null;
    }
    /**
     * Get dungeon theme colors
     */
    getDungeonThemeColors() {
        return {
            'Tal & Algebra': '#2C3E50', // deep-blue-gray
            'Geometri': '#7DAF66', // moss-green
            'Tid': '#3F5B6E', // cool-blue
            'Mönster': '#E8C170', // warm-torch
            'Data': '#C6E4F2' // magic-light
        };
    }
    /**
     * Get Art Bible color palette
     */
    getColorPalette() {
        return {
            'deep-blue-gray': '#2C3E50',
            'cool-blue': '#3F5B6E',
            'moss-green': '#7DAF66',
            'warm-torch': '#E8C170',
            'magic-light': '#C6E4F2',
            'slate-dark': '#22313A',
            'pale-text': '#DAE4EA',
            'hp-red': '#E76F51',
            'xp-teal': '#2A9D8F'
        };
    }
    /**
     * Clear all loaded assets (for testing)
     */
    clearAssets() {
        this.loadedAssets.clear();
        this.loadingPromises.clear();
    }
}
