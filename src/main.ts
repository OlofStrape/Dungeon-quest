import Phaser from 'phaser';
import { PreloadScene } from './scenes/PreloadScene';
import { HubScene } from './scenes/HubScene';
import { OverworldScene } from './scenes/OverworldScene';
import { RoomScene } from './scenes/RoomScene';
import { BattleScene } from './scenes/BattleScene';
import { BattleUI } from './ui/BattleUI';
// import { AssetLoader } from './game/AssetLoader';

// Art Bible Color Palette
const COLORS = {
  DEEP_BLUE_GRAY: '#2C3E50',
  COOL_BLUE: '#3F5B6E',
  MOSS_GREEN: '#7DAF66',
  WARM_TORCH: '#E8C170',
  MAGIC_LIGHT: '#C6E4F2',
  SLATE_DARK: '#22313A',
  PALE_TEXT: '#DAE4EA',
  HP_RED: '#E76F51',
  XP_TEAL: '#2A9D8F'
};

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'app',
  width: 1024,
  height: 768,
  backgroundColor: COLORS.DEEP_BLUE_GRAY,
  dom: { createContainer: true },
  scene: [PreloadScene, HubScene, OverworldScene, RoomScene, BattleScene, BattleUI],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
});
