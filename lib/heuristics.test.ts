import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { deriveSkills, normalizeJob, skillMentioned } from "./heuristics.ts";
import type { RawJob } from "./types.ts";

const HONES = `Hello ! On recrute pour un de nos clients un·e dev fullstack senior NestJS / React, en CDI et full remote (déplacements ponctuels à La Roche-sur-Yon), package 45–60 k€. Claude Code au quotidien, fonctionnalités LLM déjà en prod, et le dev IA est une vraie pratique d’équipe. Équipe expérimentée, bonnes pratiques d’ingénierie, autonomie et projet qui accélère.

Développeur·euse fullstack senior (NestJS / ReactJS) – CDI – Remote | Notion`;

const PYTHON_AGENTIQUE = `Mission freelance Senior Software Engineer Python / IA agentique, mi-temps, secteur bancaire, Paris | Manon Langlais. Plateforme agentique utilisée par 6 000 utilisateurs. Stack Python, Django/FastAPI, React/TypeScript, AWS, Kubernetes, LangGraph, RAG, LLM, MCP — extrait tronqué par Slack.`;

const SOFT_ONLY =
  "Profil senior, team player, passion, autonomie, aisance à l’oral, startup spirit, scale, impact.";

function loadRawJobs(): RawJob[] {
  const path = join(process.cwd(), "data", "board.jsonl");
  return readFileSync(path, "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as RawJob);
}

test("Hones post: stack in appearance order, no senior/soft", () => {
  const skills = deriveSkills(HONES);
  assert.deepEqual(skills, ["NestJS", "React", "Claude", "LLM", "IA"]);
  assert.ok(!skills.includes("senior"));
});

test("Python / agentique post: first 8 mentions, no invent", () => {
  const skills = deriveSkills(PYTHON_AGENTIQUE);
  assert.deepEqual(skills, [
    "Python",
    "IA",
    "Agents",
    "Django",
    "FastAPI",
    "React",
    "TypeScript",
    "AWS",
  ]);
  assert.equal(skills.length, 8);
  assert.ok(!skills.includes("Kubernetes"));
});

test("soft skills and seniority yield nothing", () => {
  assert.deepEqual(deriveSkills(SOFT_ONLY), []);
});

test("stack inside a URL is ignored", () => {
  const text =
    "On recrute https://jobs.example.com/react-nestjs-python-aws\n\nCDI Paris.";
  assert.deepEqual(deriveSkills(text), []);
});

test("empty / no stack stays empty", () => {
  assert.deepEqual(deriveSkills("Poste dev backend chez Lydia, si jamais ça vous tente !"), []);
  assert.deepEqual(deriveSkills(""), []);
});

test("Next.js is not JavaScript", () => {
  assert.deepEqual(deriveSkills("Stack Next.js, TypeScript, Supabase."), [
    "Next.js",
    "TypeScript",
    "Supabase",
  ]);
});

test("Go does not match going", () => {
  assert.deepEqual(deriveSkills("We're going to hire a product person."), []);
  assert.deepEqual(deriveSkills("Stack Go and Rust."), ["Go", "Rust"]);
});

test("every skill on the real board is grounded in the post", () => {
  const raw = loadRawJobs();
  assert.ok(raw.length > 0);
  for (const job of raw) {
    const skills = deriveSkills(job.message_text);
    assert.ok(skills.length <= 8, job.message_text.slice(0, 80));
    for (const skill of skills) {
      assert.ok(
        skillMentioned(skill, job.message_text),
        `invented ${skill} from: ${job.message_text.slice(0, 120)}`,
      );
    }
  }
});

test("normalizeJob attaches skills and still hides missing salary", () => {
  const raw = loadRawJobs().find((j) => j.message_text.includes("NestJS"));
  assert.ok(raw);
  const job = normalizeJob(raw, 0);
  assert.deepEqual(job.skills, ["NestJS", "React", "Claude", "LLM", "IA"]);
  assert.equal(job.salary, "45–60 k€");
});
