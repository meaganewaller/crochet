import { getYarnInventory } from "@/lib/content";

export default function YarnInventoryPage() {
  const yarn = getYarnInventory();

  return (
    <main className="page">
      <section className="panel">
        <div className="page-head">
          <div>
            <h2>Yarn Inventory</h2>
            <p className="item-meta">What you already have on hand.</p>
          </div>
        </div>

        <div className="stack" style={{ marginTop: "0.8rem" }}>
          {yarn.length === 0 ? <p className="item-meta">No yarn inventory yet.</p> : null}
          {yarn.map((item) => (
            <article key={item.slug} className="item-card">
              <h3>{item.title}</h3>
              <p className="item-meta">{item.summary ?? "No summary yet."}</p>
              <p className="item-meta" style={{ marginTop: "0.35rem" }}>
                {item.brand ?? "Unknown brand"} · {item.weight ?? "Unknown weight"} · {item.fiber ?? "Unknown fiber"}
              </p>
              <p className="item-meta" style={{ marginTop: "0.2rem" }}>
                Colorway: {item.colorway ?? "-"} · Qty: {item.quantity ?? "-"} {item.unit ?? ""}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
