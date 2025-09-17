/**
 * AssetLoader - Handles loading of all game assets according to Art Bible specifications
 *
 * Sprites:
 * - Lanternbearer: 48×48 px, 4 directions, 6 frames each
 * - Sidekick: 32×32 px, idle/speak/hint/dash animations
 * - Bosses: 96×96 px, idle/attack/hit animations
 *
 * Tilesets:
 * - 32×32 px tiles for each dungeon biome
 * - Tal, Tid, Geometri, Algebra, Data themes
 *
 * UI:
 * - Pixel art HUD elements
 * - HP/XP bars, panels, icons
 */
export class AssetLoader {
    constructor(scene) {
        this.scene = scene;
    }
    /**
     * Load all character sprites
     */
    loadCharacterSprites() {
        // Lanternbearer walking animations (48×48 px)
        this.scene.load.atlas('lanternbearer_walk', 'assets/sprites/chars/lanternbearer_walk.png', 'assets/sprites/chars/lanternbearer_walk.json');
        // Lanternbearer idle animation
        this.scene.load.atlas('lanternbearer_idle', 'assets/sprites/chars/lanternbearer_idle.png', 'assets/sprites/chars/lanternbearer_idle.json');
        // Lanternbearer cast animation
        this.scene.load.atlas('lanternbearer_cast', 'assets/sprites/chars/lanternbearer_cast.png', 'assets/sprites/chars/lanternbearer_cast.json');
    }
    /**
     * Load sidekick sprites (32×32 px)
     */
    loadSidekickSprites() {
        this.scene.load.atlas('sidekick_idle', 'assets/sprites/fx/sidekick_idle.png', 'assets/sprites/fx/sidekick_idle.json');
    }
    /**
     * Load boss sprites (96×96 px)
     */
    loadBossSprites() {
        // Times Troll (Tal & Algebra boss)
        this.scene.load.atlas('times_troll', 'assets/sprites/enemies/times_troll.png', 'assets/sprites/enemies/times_troll.json');
        // Hourglass Wraith (Tid boss)
        this.scene.load.atlas('hourglass_wraith', 'assets/sprites/enemies/hourglass_wraith.png', 'assets/sprites/enemies/hourglass_wraith.json');
        // Shape Mimic (Geometri boss)
        this.scene.load.atlas('shape_mimic', 'assets/sprites/enemies/shape_mimic.png', 'assets/sprites/enemies/shape_mimic.json');
    }
    /**
     * Load tilesets for each dungeon biome (32×32 px)
     */
    loadTilesets() {
        // Tal & Algebra tileset
        this.scene.load.image('tal_tileset', 'assets/tilesets/tal_tileset.png');
        this.scene.load.tilemapTiledJSON('tal_tilemap', 'assets/tilesets/tal_tileset.json');
        // Tid tileset
        this.scene.load.image('tid_tileset', 'assets/tilesets/tid_tileset.png');
        this.scene.load.tilemapTiledJSON('tid_tilemap', 'assets/tilesets/tid_tileset.json');
        // Geometri tileset
        this.scene.load.image('geometri_tileset', 'assets/tilesets/geometri_tileset.png');
        this.scene.load.tilemapTiledJSON('geometri_tilemap', 'assets/tilesets/geometri_tileset.json');
        // Algebra tileset
        this.scene.load.image('algebra_tileset', 'assets/tilesets/algebra_tileset.png');
        this.scene.load.tilemapTiledJSON('algebra_tilemap', 'assets/tilesets/algebra_tilemap.json');
        // Data tileset
        this.scene.load.image('data_tileset', 'assets/tilesets/data_tileset.png');
        this.scene.load.tilemapTiledJSON('data_tilemap', 'assets/tilesets/data_tilemap.json');
    }
    /**
     * Load UI elements
     */
    loadUIElements() {
        this.scene.load.atlas('ui_atlas', 'assets/ui/ui_atlas.png', 'assets/ui/ui_atlas.json');
    }
    /**
     * Load all assets
     */
    loadAll() {
        this.loadCharacterSprites();
        this.loadSidekickSprites();
        this.loadBossSprites();
        this.loadTilesets();
        this.loadUIElements();
    }
    /**
     * Create animations for loaded sprites
     */
    createAnimations() {
        // Lanternbearer walking animations
        const directions = ['up', 'down', 'left', 'right'];
        directions.forEach(dir => {
            this.scene.anims.create({
                key: `lanternbearer_walk_${dir}`,
                frames: this.scene.anims.generateFrameNames('lanternbearer_walk', {
                    prefix: `lanternbearer_walk_${dir}_`,
                    start: 1,
                    end: 6
                }),
                frameRate: 8,
                repeat: -1
            });
        });
        // Lanternbearer idle animation
        this.scene.anims.create({
            key: 'lanternbearer_idle',
            frames: this.scene.anims.generateFrameNames('lanternbearer_idle', {
                prefix: 'lanternbearer_idle_',
                start: 1,
                end: 3
            }),
            frameRate: 4,
            repeat: -1
        });
        // Lanternbearer cast animation
        this.scene.anims.create({
            key: 'lanternbearer_cast',
            frames: this.scene.anims.generateFrameNames('lanternbearer_cast', {
                prefix: 'lanternbearer_cast_',
                start: 1,
                end: 6
            }),
            frameRate: 12,
            repeat: 0
        });
        // Sidekick animations
        this.scene.anims.create({
            key: 'sidekick_idle',
            frames: this.scene.anims.generateFrameNames('sidekick_idle', {
                prefix: 'sidekick_idle_',
                start: 1,
                end: 4
            }),
            frameRate: 4,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'sidekick_speak',
            frames: this.scene.anims.generateFrameNames('sidekick_idle', {
                prefix: 'sidekick_speak_',
                start: 1,
                end: 2
            }),
            frameRate: 6,
            repeat: 0
        });
        this.scene.anims.create({
            key: 'sidekick_hint_spark',
            frames: this.scene.anims.generateFrameNames('sidekick_idle', {
                prefix: 'sidekick_hint_spark_',
                start: 1,
                end: 4
            }),
            frameRate: 8,
            repeat: 0
        });
        this.scene.anims.create({
            key: 'sidekick_dash',
            frames: this.scene.anims.generateFrameNames('sidekick_idle', {
                prefix: 'sidekick_dash_',
                start: 1,
                end: 4
            }),
            frameRate: 12,
            repeat: 0
        });
        // Boss animations
        this.scene.anims.create({
            key: 'times_troll_idle',
            frames: this.scene.anims.generateFrameNames('times_troll', {
                prefix: 'times_troll_idle_',
                start: 1,
                end: 4
            }),
            frameRate: 6,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'times_troll_attack',
            frames: this.scene.anims.generateFrameNames('times_troll', {
                prefix: 'times_troll_attack_',
                start: 1,
                end: 6
            }),
            frameRate: 8,
            repeat: 0
        });
        this.scene.anims.create({
            key: 'times_troll_hit',
            frames: this.scene.anims.generateFrameNames('times_troll', {
                prefix: 'times_troll_hit_',
                start: 1,
                end: 2
            }),
            frameRate: 12,
            repeat: 0
        });
    }
}
