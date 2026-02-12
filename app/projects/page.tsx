import Image from "next/image";
import Link from "next/link";

import { getProjects, getWorkSessions } from "@/lib/content";
import { formatDate } from "@/lib/date";

export default function ProjectsPage() {
  const projects = getProjects();
  const latestSessionByProject = new Map(getWorkSessions().map((session) => [session.projectSlug, session]));

  return (
    <main className="page">
      <section className="panel panel-checker">
        <div className="page-head">
          <div>
            <h2>Projects</h2>
            <p className="item-meta">A visual library of active, paused, and completed makes.</p>
          </div>
        </div>

        <div className="project-gallery-grid" style={{ marginTop: "0.9rem" }}>
          {projects.length === 0 ? <p className="item-meta">No projects yet.</p> : null}
          {projects.map((project) => {
            const latestSession = latestSessionByProject.get(project.slug);
            const thumbnail = latestSession?.photos[0];

            return (
              <article key={project.slug} className="project-gallery-card">
                <Link href={`/projects/${project.slug}`} className="project-gallery-media">
                  {thumbnail ? (
                    <Image
                      src={thumbnail.src}
                      alt={thumbnail.alt ?? project.title}
                      width={980}
                      height={760}
                      className="project-gallery-image"
                    />
                  ) : (
                    <div className="project-gallery-image project-gallery-fallback">No gallery image yet</div>
                  )}
                </Link>

                <div className="project-gallery-body">
                  <div className="page-head">
                    <h3>
                      <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                    </h3>
                    <span className={`badge ${project.status}`}>{project.status}</span>
                  </div>

                  <p className="item-meta">{project.summary ?? "No summary yet."}</p>

                  <div className="project-chip-row">
                    <span>Started {formatDate(project.startedOn)}</span>
                    <span>Target {formatDate(project.targetFinish)}</span>
                    <span>Hook {project.hookSize ?? "-"}</span>
                  </div>

                  <div className="progress-wrap">
                    <div className="progress-bar" style={{ width: `${project.progressPercent}%` }} />
                  </div>

                  <p className="item-meta" style={{ marginTop: "0.35rem" }}>
                    {project.progressPercent}% complete
                    {latestSession ? ` · Last session ${formatDate(latestSession.sessionDate)}` : ""}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
