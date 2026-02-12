import Link from "next/link";

import { getProjects } from "@/lib/content";
import { formatDate } from "@/lib/date";

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <main className="page">
      <section className="panel">
        <div className="page-head">
          <div>
            <h2>Projects</h2>
            <p className="item-meta">Track in-progress work and finished pieces.</p>
          </div>
        </div>

        <div className="stack" style={{ marginTop: "0.8rem" }}>
          {projects.length === 0 ? <p className="item-meta">No projects yet.</p> : null}
          {projects.map((project) => (
            <article key={project.slug} className="item-card">
              <div className="page-head">
                <div>
                  <h3>
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  </h3>
                  <p className="item-meta">{project.summary ?? "No summary yet."}</p>
                </div>
                <span className={`badge ${project.status}`}>{project.status}</span>
              </div>
              <p className="item-meta" style={{ marginTop: "0.35rem" }}>
                Started {formatDate(project.startedOn)} · Target {formatDate(project.targetFinish)}
              </p>
              <div className="progress-wrap">
                <div className="progress-bar" style={{ width: `${project.progressPercent}%` }} />
              </div>
              <p className="item-meta" style={{ marginTop: "0.35rem" }}>
                {project.progressPercent}% complete
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
