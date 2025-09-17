import { parseJsonSafe, rollInt } from "./ParamUtils";
import type { RoomRow } from "../types/content";

export interface GeneratedQuestion {
  prompt: string;
  options?: string[];       // for MCQ
  answer: string;
}

export class QuestionGenerator {
  static generate(row: RoomRow): GeneratedQuestion {
    const tpl = row["Frågemall"] || "generic: svara";
    const params = parseJsonSafe<Record<string, any>>(row["Param-intervall"]) ?? {};
    const mode = row["Svarsläge"];

    if (tpl.startsWith("calc:")) {
      if (tpl.includes("×")) {
        const a = pickOrRoll(params.a, 2, 9);
        const b = pickOrRoll(params.b, 2, 10);
        const ans = String(a * b);
        return mcqIfNeeded(mode, `${a} × ${b} = ?`, ans, row["Distraktorer"]);
      } else if (tpl.includes("÷")) {
        const a = pickOrRoll(params.a, 10, 50);
        const b = pickOrRoll(params.b, 2, 9);
        const ans = String(Math.floor(a / b));
        return mcqIfNeeded(mode, `${a} ÷ ${b} = ?`, ans, row["Distraktorer"]);
      }
    }

    if (tpl.startsWith("clock:")) {
      // simple 5-min steps
      const t = random5Min();
      const ans = t;
      return mcqIfNeeded(mode, `Visa tiden: ${t}`, ans, "time_close");
    }

    if (tpl.startsWith("interval:")) {
      const [t1, t2] = randomInterval();
      const diff = minutesBetween(t1, t2);
      return mcqIfNeeded(mode, `Hur långt är det mellan ${t1} och ${t2}? (minuter)`, String(diff), "time_close");
    }

    if (tpl.startsWith("perimeter:")) {
      const w = pickOrRoll(params.w, 2, 12);
      const h = pickOrRoll(params.h, 2, 12);
      const ans = String(2*(w+h));
      return mcqIfNeeded(mode, `Omkrets för rektangel ${w}×${h}?`, ans, row["Distraktorer"]);
    }

    if (tpl.startsWith("sequence:")) {
      const seq = genSequence();
      const ans = String(seq[seq.length-1] + (seq[1]-seq[0]));
      return mcqIfNeeded(mode, `Nästa tal i serien: ${seq.join(", ")}, ?`, ans, "pattern_variant");
    }

    if (tpl.startsWith("equation:")) {
      const a = pickOrRoll(params.a, 2, 9);
      const b = pickOrRoll(params.b, 5, 20);
      const x = b - a;
      return mcqIfNeeded(mode, `□ + ${a} = ${b} → □ = ?`, String(x), "inverse_trap");
    }

    // fallback
    return { prompt: "Svara på uppgiften", answer: "" };
  }
}

function pickOrRoll(p: any, min: number, max: number) {
  if (Array.isArray(p)) return rollInt(p[0], p[1]);
  if (typeof p === 'number') return p;
  if (typeof p === 'object' && p.min != null && p.max != null) return rollInt(p.min, p.max);
  return rollInt(min, max);
}

function mcqIfNeeded(mode: RoomRow["Svarsläge"], prompt: string, ans: string, strategy?: string): GeneratedQuestion {
  if (mode === 'MCQ' || mode === 'Input/MCQ mix') {
    const options = buildDistractors(ans, strategy);
    return { prompt, options, answer: ans };
  }
  return { prompt, answer: ans };
}

function buildDistractors(correct: string, strategy?: string): string[] {
  const c = Number(correct);
  const set = new Set<string>([correct]);
  while (set.size < 4) {
    let d = c + rollInt(-5, 5);
    if (d === c || d < 0) d = c + rollInt(1, 7);
    set.add(String(d));
  }
  return Array.from(set).sort(() => Math.random()-0.5);
}

function random5Min() {
  const h = rollInt(0, 23);
  const m = [0,5,10,15,20,25,30,35,40,45,50,55][rollInt(0,11)];
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

function randomInterval(): [string, string] {
  const h1 = rollInt(7, 15);
  const m1 = [0,15,30,45][rollInt(0,3)];
  let h2 = h1 + rollInt(0,2);
  let m2 = [0,15,30,45][rollInt(0,3)];
  if (h2 < h1 || (h2===h1 && m2<=m1)) h2 = h1 + 1;
  return [`${pad(h1)}:${pad(m1)}`, `${pad(h2)}:${pad(m2)}`];
}

function minutesBetween(t1: string, t2: string) {
  const [h1,m1] = t1.split(':').map(Number);
  const [h2,m2] = t2.split(':').map(Number);
  return (h2*60+m2) - (h1*60+m1);
}

function pad(n: number) { return String(n).padStart(2,'0'); }

function genSequence() {
  const start = rollInt(1,10);
  const step = [1,2,3,5][rollInt(0,3)];
  return [start, start+step, start+2*step, start+3*step];
}
