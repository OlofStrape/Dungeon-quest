import type { DungeonDataset } from "../types/content";

export async function loadDataset(): Promise<DungeonDataset> {
  const res = await fetch('/data/ak4_gameplay_params_enriched.json');
  if (!res.ok) throw new Error('Could not load dataset');
  return await res.json();
}
