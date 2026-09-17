"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Job } from "@/lib/types";

const CHIPS = ["Remote", "CDI", "Freelance"] as const;
type ChipFilter = (typeof CHIPS)[number];
const SLACK_URL = "https://devw.ai/slack";

type Props = {
  jobs: Job[];
};

export default function JobsBoard({ jobs }: Props) {
  const [q, setQ] = useState("");
  const [chips, setChips] = useState<Set<ChipFilter>>(new Set());

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return jobs.filter((j) => {
      if (chips.size) {
        for (const c of chips) {
          if (!j.filterTags.includes(c)) return false;
        }
      }
      if (!query) return true;
      const blob = [
        j.title,
        j.company,
        j.excerpt,
        j.author,
        j.filterTags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(query);
    });
  }, [jobs, q, chips]);

  const hasFilters = chips.size > 0 || q.trim().length > 0;
  const emptyData = jobs.length === 0;
  const emptyFilter = !emptyData && filtered.length === 0 && hasFilters;
  const showList = !emptyData && !emptyFilter;

  function toggleChip(c: ChipFilter) {
    setChips((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }

  function clearFilters() {
    setQ("");
    setChips(new Set());
  }

  const count = emptyData || emptyFilter ? 0 : filtered.length;
  const countLabel = count <= 1 ? "offre" : "offres";

  return (
    <>
      <header className="header">
        <div className="wrap header-inner">
          <a
            className="brand"
            href="https://devw.ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Dev With AI" width={36} height={36} />
            <span className="brand-name">Dev With AI</span>
            <span className="brand-sep">·</span>
            <span className="brand-jobs">Jobs</span>
          </a>
          <a
            className="btn-slack"
            href={SLACK_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Slack
          </a>
        </div>
      </header>

      <main>
        <div className="wrap hero">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            <span>Communauté · Slack #jobs</span>
          </div>
          <h1>
            Offres <span className="grad">dev &amp; IA</span>
          </h1>
          <p className="hero-sub">
            Board filtrable des opportunités partagées sur le Slack Dev With AI.
          </p>
        </div>

        <div className="filters">
          <div className="wrap">
            <div className="filters-row">
              <div className="search">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
                </svg>
                <input
                  type="search"
                  placeholder="Rechercher un titre, une boîte, un mot-clé…"
                  autoComplete="off"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  aria-label="Rechercher"
                />
              </div>
              <div className="chips" role="group" aria-label="Filtres">
                {CHIPS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`chip${chips.has(c) ? " active" : ""}`}
                    aria-pressed={chips.has(c)}
                    onClick={() => toggleChip(c)}
                  >
                    {c}
                  </button>
                ))}
                {hasFilters && (
                  <button
                    type="button"
                    className="chip chip-clear"
                    onClick={clearFilters}
                  >
                    Effacer
                  </button>
                )}
              </div>
            </div>
            <div className="meta-bar">
              <div className="count">
                {count} <span>{countLabel}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="wrap">
          {showList && (
            <div className="list">
              {filtered.map((j) => (
                <Link
                  key={j.id}
                  className="row"
                  href={`/job/${j.id}`}
                  style={{ ["--accent" as string]: j.accent }}
                >
                  <div
                    className="logo"
                    style={{ background: j.accent }}
                    aria-hidden
                  >
                    {j.initials}
                  </div>
                  <div className="row-body">
                    <div className="row-top">
                      <div>
                        <div className="row-title">{j.title}</div>
                        {j.company ? (
                          <div className="row-company">{j.company}</div>
                        ) : null}
                      </div>
                      <div className="freshness" title={j.dateFull}>
                        {j.date}
                      </div>
                    </div>
                    <p className="excerpt">{j.excerpt}</p>
                    <div className="row-meta">
                      <span className="author">
                        par <strong>{j.author}</strong>
                      </span>
                      {j.filterTags.length > 0 && (
                        <div className="tags">
                          {j.filterTags.map((t) => (
                            <span key={t} className={`tag ft-${t}`}>
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <svg
                    className="ext"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path
                      d="M9 5l7 7-7 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          )}

          {emptyFilter && (
            <div className="empty show">
              <div className="eyebrow">
                <span className="eyebrow-line" />
                <span>Filtres</span>
              </div>
              <h2>
                Aucune offre ne <span className="grad">match</span>.
              </h2>
              <p>
                Essaie d’élargir les chips ou la recherche — ou jette un œil au
                Slack, y’a souvent du frais.
              </p>
              <div className="empty-actions">
                <button
                  type="button"
                  className="cta-black"
                  onClick={clearFilters}
                >
                  Élargir les filtres
                </button>
                <a
                  className="cta-link"
                  href={SLACK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Rejoindre le Slack →
                </a>
              </div>
            </div>
          )}

          {emptyData && (
            <div className="empty show">
              <div className="eyebrow">
                <span className="eyebrow-line" />
                <span>Board</span>
              </div>
              <h2>
                Pas encore d’<span className="grad">offres</span>.
              </h2>
              <p>
                Le canal #jobs se remplit au fil des partages communauté. Reviens
                bientôt, ou passe sur Slack.
              </p>
              <div className="empty-actions">
                <a
                  className="cta-black"
                  href={SLACK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ouvrir le Slack
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <span>Dev With AI · Jobs</span>
          <a href="https://devw.ai" target="_blank" rel="noopener noreferrer">
            devw.ai
          </a>
        </div>
      </footer>
    </>
  );
}
