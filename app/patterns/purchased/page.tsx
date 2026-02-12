import { getPurchasedPatterns } from "@/lib/content";

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
            <article key={pattern.slug} className="item-card">
              <h3>{pattern.title}</h3>
              <p className="item-meta">{pattern.summary ?? "No summary yet."}</p>
              <p className="item-meta" style={{ marginTop: "0.35rem" }}>
                Designer: {pattern.designer ?? "-"} · Source: {pattern.source ?? "-"} · Paid: {pattern.pricePaid ?? "-"}
              </p>
              {pattern.tags.length > 0 ? (
                <p className="item-meta" style={{ marginTop: "0.2rem" }}>
                  Tags: {pattern.tags.join(", ")}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
