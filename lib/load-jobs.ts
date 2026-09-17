import { readFileSync } from "fs";
import { join } from "path";
import { normalizeJob } from "./heuristics";
import type { Job, RawJob } from "./types";

export function loadJobs(): Job[] {
  const path = join(process.cwd(), "data", "board.jsonl");
  const text = readFileSync(path, "utf8");
  const jobs: Job[] = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const raw = JSON.parse(line) as RawJob;
    jobs.push(normalizeJob(raw, jobs.length));
  }
  // newest first if dates appear chronological ascending in file — keep file order (already oldest→newest in source; reverse for board)
  return jobs.slice().reverse();
}
