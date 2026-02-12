import Link from "next/link";
import Image from "next/image";

import { getProjects, getWorkSessions } from "@/lib/content";
import { formatDate } from "@/lib/date";

export default function WorkSessionsPage() {
  const sessions = getWorkSessions();
  const projectTitleBySlug = new Map(getProjects().map((project) => [project.slug, project.title]));

  return (
    <main className="page">
      <section className="panel panel-timeline">
        <div className="page-head">
          <div>
            <h2>Work Sessions</h2>
            <p className="item-meta">Session-by-session timeline with gallery snapshots.</p>
          </div>
        </div>

        {sessions.length === 0 ? <p className="item-meta" style={{ marginTop: "0.8rem" }}>No sessions yet.</p> : null}

        <div className="ws-timeline" style={{ marginTop: "1rem" }}>
          {sessions.map((session, index) => {
            const thumbnail = session.photos[0];
            const progressText =
              typeof session.progressBefore === "number" && typeof session.progressAfter === "number"
                ? `${session.progressBefore}% -> ${session.progressAfter}%`
                : "Progress not tracked";

            return (
              <article
                key={session.slug}
                className={index % 2 === 0 ? "ws-entry ws-entry-left" : "ws-entry ws-entry-right"}
              >
                <div className="ws-node" aria-hidden />
                <div className="ws-card">
                  <Link href={`/work-sessions/${session.slug}`} className="ws-thumb-link" aria-label={session.title}>
                    {thumbnail ? (
                      <Image
                        src={thumbnail.src}
                        alt={thumbnail.alt ?? session.title}
                        width={900}
                        height={680}
                        className="ws-thumb"
                      />
                    ) : (
                      <div className="ws-thumb ws-thumb-fallback">No photo</div>
                    )}
                  </Link>
                  <div className="ws-body">
                    <p className="ws-date">{formatDate(session.sessionDate)}</p>
                    <h3 className="ws-title">
                      <Link href={`/work-sessions/${session.slug}`}>{session.title}</Link>
                    </h3>
                    <p className="item-meta">{session.summary ?? "No summary yet."}</p>
                    <div className="ws-meta">
                      <Link href={`/projects/${session.projectSlug}`}>
                        {projectTitleBySlug.get(session.projectSlug) ?? session.projectSlug}
                      </Link>
                      <span>{session.minutes} min</span>
                      <span>{progressText}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
