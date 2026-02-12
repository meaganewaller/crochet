import Link from "next/link";
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
        <div style={{ marginTop: "0.6rem", overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Minutes</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="item-meta">
                    No work sessions logged yet.
                  </td>
                </tr>
              ) : null}
              {sessions.map((session) => (
                <tr key={session.slug}>
                  <td>{formatDate(session.sessionDate)}</td>
                  <td>
                    <Link href={`/work-sessions/${session.slug}`}>{session.title}</Link>
                  </td>
                  <td>{session.minutes}</td>
                  <td>
                    {typeof session.progressBefore === "number" && typeof session.progressAfter === "number"
                      ? `${session.progressBefore}% -> ${session.progressAfter}%`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
