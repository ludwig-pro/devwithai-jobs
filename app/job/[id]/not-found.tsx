import Link from "next/link";

export default function JobNotFound() {
  return (
    <main className="wrap" style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
      <div className="eyebrow" style={{ justifyContent: "center" }}>
        <span className="eyebrow-line" />
        <span>404</span>
      </div>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em", margin: "0.75rem 0 1rem" }}>
        Offre <span className="grad">introuvable</span>
      </h1>
      <p style={{ color: "var(--sec)", marginBottom: "1.75rem" }}>
        Cette offre n’existe pas (ou plus) sur le board.
      </p>
      <Link className="cta-black" href="/" style={{ display: "inline-flex" }}>
        ← Toutes les offres
      </Link>
    </main>
  );
}
