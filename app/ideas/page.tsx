import { getProjectIdeas } from "@/lib/content";

export default function IdeasPage() {
  const ideas = getProjectIdeas();

  return (
    <main className="page">
      <section className="panel">
        <div className="page-head">
          <div>
            <h2>Project Ideas</h2>
            <p className="item-meta">Future experiments and inspiration.</p>
          </div>
        </div>

        <div className="stack" style={{ marginTop: "0.8rem" }}>
          {ideas.length === 0 ? <p className="item-meta">No ideas yet.</p> : null}
          {ideas.map((idea) => (
            <article key={idea.slug} className="item-card">
              <div className="page-head">
                <h3>{idea.title}</h3>
                <span className="badge">{idea.level}</span>
              </div>
              <p className="item-meta">{idea.summary ?? "No summary yet."}</p>
              <p className="item-meta" style={{ marginTop: "0.35rem" }}>
                Season: {idea.season ?? "Any"}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
