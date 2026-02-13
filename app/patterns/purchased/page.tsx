import Image from "next/image";
import Link from "next/link";

import { getPurchasedPatterns } from "@/lib/content";

function formatPurchasedOn(value?: string): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export default function PurchasedPatternsPage() {
  const patterns = getPurchasedPatterns();

  return (
    <main className="page">
      <section className="panel panel-ribbon">
        <div className="page-head">
          <div>
            <h2>Purchased Patterns</h2>
            <p className="item-meta">Patterns you already own.</p>
          </div>
        </div>

        <div className="stack" style={{ marginTop: "0.8rem" }}>
          {patterns.length === 0 ? <p className="item-meta">No purchased patterns yet.</p> : null}
          {patterns.map((pattern) => (
            <article key={pattern.slug} className="item-card pattern-list-card">
              <Link href={`/patterns/purchased/${pattern.slug}`} className="pattern-list-media">
                {pattern.images[0] ? (
                  <Image
                    src={pattern.images[0]}
                    alt={pattern.title}
                    width={920}
                    height={700}
                    className="pattern-list-image"
                  />
                ) : (
                  <div className="pattern-list-image pattern-list-fallback">No thumbnail</div>
                )}
              </Link>
              <div className="pattern-list-body">
                <h3>
                  <Link href={`/patterns/purchased/${pattern.slug}`}>{pattern.title}</Link>
                </h3>
                <p className="item-meta">{pattern.summary ?? "No summary yet."}</p>
                <p className="item-meta" style={{ marginTop: "0.35rem" }}>
                  Designer: {pattern.designer ?? "-"} · Source: {pattern.source ?? "-"} · Purchased:{" "}
                  {formatPurchasedOn(pattern.purchasedOn)} · Paid: {pattern.pricePaid ?? "-"}
                </p>
                {pattern.tags.length > 0 ? (
                  <p className="item-meta" style={{ marginTop: "0.2rem" }}>
                    Tags: {pattern.tags.join(", ")}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
