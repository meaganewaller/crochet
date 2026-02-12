import { getQueueItems } from "@/lib/content";
import { formatDate } from "@/lib/date";

export default function QueuePage() {
  const items = getQueueItems();

  return (
    <main className="page">
      <section className="panel panel-checker">
        <div className="page-head">
          <div>
            <h2>Queue</h2>
            <p className="item-meta">Planned projects in order of priority.</p>
          </div>
        </div>

        <div className="stack" style={{ marginTop: "0.8rem" }}>
          {items.length === 0 ? <p className="item-meta">No queued projects yet.</p> : null}
          {items.map((item) => (
            <article key={item.slug} className="item-card">
              <div className="page-head">
                <h3>{item.title}</h3>
                <span className="badge">{item.priority}</span>
              </div>
              <p className="item-meta">{item.summary ?? "No summary yet."}</p>
              <p className="item-meta" style={{ marginTop: "0.4rem" }}>
                Intended start: {formatDate(item.intendedStart)}
              </p>
              {item.pattern ? (
                <p className="item-meta" style={{ marginTop: "0.2rem" }}>
                  Pattern: {item.pattern}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
