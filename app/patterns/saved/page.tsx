import { getSavedPatterns } from "@/lib/content";

export default function SavedPatternsPage() {
  const patterns = getSavedPatterns();

  return (
    <main className="page">
      <section className="panel">
        <div className="page-head">
          <div>
            <h2>Saved Patterns</h2>
            <p className="item-meta">Interesting patterns to revisit later.</p>
          </div>
        </div>

        <div className="stack" style={{ marginTop: "0.8rem" }}>
          {patterns.length === 0 ? <p className="item-meta">No saved patterns yet.</p> : null}
          {patterns.map((pattern) => (
            <article key={pattern.slug} className="item-card">
              <h3>{pattern.title}</h3>
              <p className="item-meta">{pattern.summary ?? "No summary yet."}</p>
              <p className="item-meta" style={{ marginTop: "0.35rem" }}>
                Designer: {pattern.designer ?? "-"} · Source: {pattern.source ?? "-"}
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
