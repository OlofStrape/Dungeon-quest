import Phaser from 'phaser';
import type { RoomRow } from '../types/content';

export class DungeonScene extends Phaser.Scene {
  static KEY = 'DungeonScene';
  private dungeon!: string;
  private rows!: RoomRow[];

  init(data: { dungeon: string, rows: RoomRow[] }) {
    this.dungeon = data.dungeon;
    this.rows = data.rows;
  }

  create() {
    this.add.text(20, 20, this.dungeon, { fontSize:'22px' });
    const sorted = this.rows.slice().sort((a,b)=>a["Nivå"].localeCompare(b["Nivå"]));
    sorted.forEach((r, i) => {
      this.add.text(40, 70 + i*28, `${r["Nivå"]} – ${r["Rum"]} (${r["Typ"]})`, { fontSize:'16px', backgroundColor:'#eef' })
        .setInteractive()
        .on('pointerup', () => {
          this.scene.start('BattleScene', { row: r });
        });
    });

    this.add.text(20, 520, 'Tillbaka till Hub', { fontSize:'16px', backgroundColor:'#ddd' })
      .setInteractive()
      .on('pointerup', () => this.scene.start('HubScene'));
  }
}
