import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { getProjectBySlug, getProjects, getWorkSessions } from "@/lib/content";
import { formatDate } from "@/lib/date";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getProjects().map((project) => ({
    slug: project.slug
  }));
}

export const dynamicParams = false;

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  const sessions = getWorkSessions().filter((session) => session.projectSlug === project.slug);

  return (
    <main className="page">
      <section className="panel">
        <div className="page-head">
          <div>
            <h2>{project.title}</h2>
            <p className="item-meta">{project.summary ?? "No summary yet."}</p>
          </div>
          <span className={`badge ${project.status}`}>{project.status}</span>
        </div>

        <p className="item-meta" style={{ marginTop: "0.65rem" }}>
          Started {formatDate(project.startedOn)} · Target {formatDate(project.targetFinish)} · Hook{" "}
          {project.hookSize ?? "-"}
        </p>

        <div className="progress-wrap" style={{ marginTop: "0.65rem" }}>
          <div className="progress-bar" style={{ width: `${project.progressPercent}%` }} />
        </div>
        <p className="item-meta" style={{ marginTop: "0.35rem" }}>
          {project.progressPercent}% complete
        </p>

        {project.yarns.length > 0 ? (
          <p className="item-meta" style={{ marginTop: "0.45rem" }}>
            Yarns: {project.yarns.join(", ")}
          </p>
        ) : null}

        {project.pattern ? (
          <p className="item-meta" style={{ marginTop: "0.15rem" }}>
            Pattern: {project.pattern}
          </p>
        ) : null}

        <article className="prose" style={{ marginTop: "0.8rem" }}>
          <MDXRemote source={project.body} />
        </article>
      </section>

      <section className="panel">
        <div className="page-head">
          <h3>Work Sessions</h3>
          <Link href="/work-sessions" className="item-meta">
            All sessions
          </Link>
        </div>
        {sessions.length === 0 ? (
          <p className="item-meta" style={{ marginTop: "0.8rem" }}>
            No work sessions logged yet.
          </p>
        ) : (
          <ol className="project-session-timeline" style={{ marginTop: "0.8rem" }}>
            {sessions.map((session) => {
              const thumbnail = session.photos[0];
              const progressText =
                typeof session.progressBefore === "number" && typeof session.progressAfter === "number"
                  ? `${session.progressBefore}% -> ${session.progressAfter}%`
                  : "Progress not tracked";

              return (
                <li key={session.slug} className="project-session-entry">
                  <article className="project-session-card">
                    <Link href={`/work-sessions/${session.slug}`} className="project-session-thumb-link">
                      {thumbnail ? (
                        <Image
                          src={thumbnail.src}
                          alt={thumbnail.alt ?? session.title}
                          width={780}
                          height={560}
                          className="project-session-thumb"
                        />
                      ) : (
                        <div className="project-session-thumb project-session-thumb-fallback">No photo</div>
                      )}
                    </Link>
                    <div className="project-session-body">
                      <p className="project-session-date">{formatDate(session.sessionDate)}</p>
                      <h4 className="project-session-title">
                        <Link href={`/work-sessions/${session.slug}`}>{session.title}</Link>
                      </h4>
                      <p className="item-meta">{session.summary ?? "No summary yet."}</p>
                      <div className="project-session-meta">
                        <span>{session.minutes} min</span>
                        <span>{progressText}</span>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </main>
  );
}
