import { getYarnWishlist } from "@/lib/content";

export default function YarnWishlistPage() {
  const yarn = getYarnWishlist();

  return (
    <main className="page">
      <section className="panel panel-ribbon">
        <div className="page-head">
          <div>
            <h2>Yarn Wishlist</h2>
            <p className="item-meta">Yarn you want to buy later.</p>
          </div>
        </div>

        <div className="stack" style={{ marginTop: "0.8rem" }}>
          {yarn.length === 0 ? <p className="item-meta">No yarn wishlist yet.</p> : null}
          {yarn.map((item) => (
            <article key={item.slug} className="item-card">
              <h3>{item.title}</h3>
              <p className="item-meta">{item.summary ?? "No summary yet."}</p>
              <p className="item-meta" style={{ marginTop: "0.35rem" }}>
                {item.brand ?? "Unknown brand"} · {item.weight ?? "Unknown weight"} · Colorway: {item.colorway ?? "-"}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
