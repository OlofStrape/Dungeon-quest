export type ECALevel = 'E' | 'C' | 'A' | 'Boss' | 'Adaptiv';

export interface RoomRow {
  "Årskurs": string;
  "Område": string;
  "Lgr22-tag": string;
  "Dungeon": string;
  "Rum": string;
  "Nivå": ECALevel;
  "Typ": string; // e.g. combat, progress, choice-logic, drag-drop, ... boss-combat
  "Beskrivning": string;
  "Frågemall": string;        // e.g. "calc: {a} × {b}"
  "Param-intervall": string;  // JSON string
  "Distraktorer": string;     // e.g. nearest_miss
  "UI-layout": string;        // e.g. BattleUI(...), ProgressUI(...)
  "Spelar-HP": number;
  "Fiende-HP/Segment": number;
  "Frågor/uppgifter": number;
  "Skada vid rätt": number;
  "Skada vid fel": number;
  "Tid/gräns (sek)": number | null;
  "Svarsläge": 'Input' | 'MCQ' | 'DragDrop' | 'Input/MCQ mix';
  "Hint-kostnad": number;
  "Standard-hint": string;
  "Belöning(JSON)": string;   // JSON {xp, loot, ability_unlock?}
  "Unlock-regel": string;
  "Telemetri-nycklar": string;
  "Asset-tema": string;
  "Musik-cue": string;
  "SFX-cue": string;
  "Boss_mods"?: string;
}

export type DungeonDataset = Record<string, RoomRow[]>;
