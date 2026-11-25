import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Promoted Tuesday, checked into a Marriott, left my hamster Shane in the lobby minibar.";

// Sealed gate (RULES.txt): /output/entry.txt is UTF-8 text of 1 to 100
// characters, not only white space, a single line.
function guard(line: string): void {
  if (line.length < 1 || line.length > 100) {
    throw new Error(`entry length ${line.length} outside sealed gate 1-100`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry is only white space");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

guard(LINE);

// Judge-brief guard: the line must carry the three beats of the week
// (a win, a fail/chaos) and land the punch on the final words.
const BEATS = ["Promoted", "Marriott", "hamster Shane", "minibar"];
for (const beat of BEATS) {
  if (!LINE.includes(beat)) {
    throw new Error(`entry is missing a required beat: ${beat}`);
  }
}
if (!LINE.endsWith("lobby minibar.")) {
  throw new Error("entry must end on the punch: lobby minibar.");
}

// Round-trip check: the file we write must read back byte-identical.
const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");
import { readFileSync } from "node:fs";
if (readFileSync(outPath, "utf8") !== LINE) {
  throw new Error("round-trip mismatch: written file differs from the line");
}
console.log(`entry ok: ${LINE.length} chars, 1 line`);
