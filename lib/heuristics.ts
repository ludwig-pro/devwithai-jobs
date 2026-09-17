import type { FilterTag, Job, RawJob } from "./types";

const ACCENTS = ["#0061ff", "#ff40ff", "#ff2600", "#ff9300"] as const;

const URL_RE = /https?:\/\/[^\s<>"')\]]+/gi;
const BARE_URL_RE =
  /(?:https?:\/\/)?(?:www\.)?(?:lnkd\.in|linkedin\.com|notion\.site|bit\.ly|t\.co)\/[^\s]+/gi;

function stripUrls(text: string): string {
  return text.replace(URL_RE, " ").replace(BARE_URL_RE, " ");
}

function isUrlOnlyLine(line: string): boolean {
  const t = line.trim();
  if (!t) return true;
  // short URL stubs or pure URLs
  if (/^https?:\/\//i.test(t) && t.length < 120 && !/\s/.test(t)) return true;
  if (/^(?:www\.)?(?:lnkd\.in|linkedin\.com|notion\.site|bit\.ly|t\.co)\//i.test(t))
    return true;
  if (/^lnkd\.in\//i.test(t)) return true;
  // line is mostly a bare path-like URL
  if (/^[a-z0-9.-]+\.[a-z]{2,}\/[^\s]*$/i.test(t) && t.length < 100) return true;
  return false;
}

function truncate(s: string, max = 100): string {
  const clean = s.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > 60 ? cut.slice(0, lastSpace) : cut;
  return base.replace(/[,:;.\-–—|/]+$/, "") + "…";
}

function usefulLines(message: string): string[] {
  return message
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !isUrlOnlyLine(l));
}

export function deriveTitle(message: string): string {
  const lines = usefulLines(message);
  for (const line of lines) {
    // Prefer human text; never return a raw URL
    if (isUrlOnlyLine(line)) continue;
    if (/^https?:\/\//i.test(line.trim())) continue;
    const title = truncate(line, 105);
    if (title && !/^https?:\/\//i.test(title)) return title;
  }
  // fallback: strip urls from whole message
  const stripped = stripUrls(message).replace(/\s+/g, " ").trim();
  if (stripped) return truncate(stripped, 105);
  return "Offre partagée sur Slack";
}

export function derivePrimaryUrl(urls: string[], permalink: string): string {
  const first = (urls || []).find((u) => /^https?:\/\//i.test(u));
  return first || permalink;
}

export function deriveTags(message: string): FilterTag[] {
  const text = stripUrls(message);
  const tags: FilterTag[] = [];

  if (
    /\bremote\b/i.test(text) ||
    /\bfull\s*remote\b/i.test(text) ||
    /\bt[eé]l[eé]travail\b/i.test(text)
  ) {
    tags.push("Remote");
  }

  if (/\bCDI\b/.test(text)) {
    tags.push("CDI");
  }

  if (
    /\bfreelance\b/i.test(text) ||
    /\bind[eé]pendant\b/i.test(text) ||
    /\bTJ\b/.test(text) ||
    /\bTJM\b/.test(text)
  ) {
    tags.push("Freelance");
  }

  if (
    /\bIA\b/.test(text) ||
    /\bAI\b/.test(text) ||
    /\bLLM\b/i.test(text) ||
    /\bGenAI\b/i.test(text) ||
    /\bagentique\b/i.test(text) ||
    /\bagents?\b/i.test(text)
  ) {
    tags.push("IA");
  }

  return tags;
}

function deriveCompany(message: string, title: string): string {
  const lines = usefulLines(message);
  // second useful line as soft subtitle if distinct
  for (const line of lines) {
    const t = truncate(line, 70);
    if (t && t !== title && !title.startsWith(t.slice(0, 40))) {
      return t;
    }
  }
  return "";
}

function deriveExcerpt(message: string): string {
  const stripped = stripUrls(message).replace(/\s+/g, " ").trim();
  return truncate(stripped, 220);
}

function shortDate(dateFull: string): string {
  // "Sep 10th at 3:02:21 AM" → "Sep 10th"
  const at = dateFull.indexOf(" at ");
  if (at > 0) return dateFull.slice(0, at);
  return dateFull;
}

function initialsFromTitle(title: string): string {
  const words = title
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "JB";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function normalizeJob(raw: RawJob, index: number): Job {
  const title = deriveTitle(raw.message_text);
  const filterTags = deriveTags(raw.message_text);
  const primaryUrl = derivePrimaryUrl(raw.urls || [], raw.slack_permalink);
  return {
    id: `${index}-${raw.slack_permalink}`,
    title,
    company: deriveCompany(raw.message_text, title),
    author: raw.author || "Anonyme",
    date: shortDate(raw.date_time_shown || ""),
    dateFull: raw.date_time_shown || "",
    excerpt: deriveExcerpt(raw.message_text),
    filterTags,
    primaryUrl,
    permalink: raw.slack_permalink,
    accent: ACCENTS[index % ACCENTS.length],
    initials: initialsFromTitle(title),
  };
}
