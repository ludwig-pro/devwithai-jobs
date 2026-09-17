import Link from "next/link";
import type { Job } from "@/lib/types";

const SLACK_URL = "https://devw.ai/slack";

type Props = {
  job: Job;
};

function contractType(job: Job): string {
  if (job.filterTags.includes("CDI")) return "CDI";
  if (job.filterTags.includes("Freelance")) return "Freelance";
  return "";
}

function remoteLabel(job: Job): string {
  if (job.filterTags.includes("Remote")) return "Full remote";
  return "";
}

export default function JobDetail({ job }: Props) {
  const type = contractType(job);
  const remote = remoteLabel(job);
  const showSlack =
    Boolean(job.permalink) && job.permalink !== job.primaryUrl;
  const paragraphs = job.body
    ? job.body.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
    : [];

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

      <main className="detail-main">
        <div className="wrap back-wrap">
          <Link className="back" href="/">
            <span className="back-arrow" aria-hidden>
              ←
            </span>{" "}
            Toutes les offres
          </Link>
        </div>

        <section className="detail-hero">
          <div className="wrap">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              <span>Offre · partagée sur Slack</span>
            </div>
            <div className="hero-grid">
              <div className="hero-main">
                <div
                  className="company-mark"
                  style={{ background: job.accent }}
                  aria-hidden
                >
                  {job.initials}
                </div>
                <h1 className="detail-title">{job.title}</h1>
                {job.company ? (
                  <p className="detail-company">
                    <strong>{job.company}</strong>
                  </p>
                ) : null}
              </div>
              {job.date ? (
                <div className="hero-aside">
                  <time className="date" title={job.dateFull || undefined}>
                    Publié · {job.date}
                  </time>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <div className="wrap content-grid">
          <article className="article">
            <h2>À propos de l’offre</h2>
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : job.excerpt ? (
              <p>{job.excerpt}</p>
            ) : null}

            <div className="article-divider" />

            <h2>Intéressé·e ?</h2>
            <p>
              Consulte la fiche complète et les modalités de candidature sur la
              source de l’offre.
            </p>

            <div className="actions">
              <a
                className="cta cta-primary"
                href={job.primaryUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Voir l’offre <span className="external">↗</span>
              </a>
              {showSlack ? (
                <a
                  className="cta cta-secondary"
                  href={job.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Voir sur Slack <span className="external">↗</span>
                </a>
              ) : null}
            </div>
          </article>

          <aside className="meta-card" aria-label="Résumé de l'offre">
            <div className="card-label">En bref</div>
            {job.filterTags.length > 0 ? (
              <div className="tags">
                {job.filterTags.map((t) => (
                  <span key={t} className={`tag ft-${t}`}>
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="meta-list">
              {type ? (
                <div className="meta-row">
                  <span className="meta-key">Type</span>
                  <span className="meta-value">{type}</span>
                </div>
              ) : null}
              {remote ? (
                <div className="meta-row">
                  <span className="meta-key">Télétravail</span>
                  <span className="meta-value">{remote}</span>
                </div>
              ) : null}
              {job.author ? (
                <div className="meta-row">
                  <span className="meta-key">Auteur</span>
                  <span className="meta-value">{job.author}</span>
                </div>
              ) : null}
              {job.date ? (
                <div className="meta-row">
                  <span className="meta-key">Date</span>
                  <span className="meta-value">{job.date}</span>
                </div>
              ) : null}
              {job.company ? (
                <div className="meta-row">
                  <span className="meta-key">Entreprise</span>
                  <span className="meta-value">{job.company}</span>
                </div>
              ) : null}
            </div>
          </aside>
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
