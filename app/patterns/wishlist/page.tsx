import { getPatternWishlist } from "@/lib/content";

export default function PatternWishlistPage() {
  const patterns = getPatternWishlist();

  return (
    <main className="page">
      <section className="panel panel-checker">
        <div className="page-head">
          <div>
            <h2>Pattern Wishlist</h2>
            <p className="item-meta">Patterns to buy next.</p>
          </div>
        </div>

        <div className="stack" style={{ marginTop: "0.8rem" }}>
          {patterns.length === 0 ? <p className="item-meta">No wishlist patterns yet.</p> : null}
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
