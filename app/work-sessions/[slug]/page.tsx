import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import {
  getProjectBySlug,
  getWorkSessionBySlug,
  getWorkSessions,
  getWorkSessionsByProject
} from "@/lib/content";
import { formatDate } from "@/lib/date";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getWorkSessions().map((session) => ({
    slug: session.slug
  }));
}

export const dynamicParams = false;

export default async function WorkSessionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const session = getWorkSessionBySlug(slug);

  if (!session) {
    notFound();
  }

  const project = getProjectBySlug(session.projectSlug);
  const orderedSessions = getWorkSessionsByProject(session.projectSlug, "asc");
  const currentIndex = orderedSessions.findIndex((item) => item.slug === session.slug);
  const previousSession = currentIndex > 0 ? orderedSessions[currentIndex - 1] : undefined;
  const nextSession =
    currentIndex >= 0 && currentIndex < orderedSessions.length - 1
      ? orderedSessions[currentIndex + 1]
      : undefined;

  return (
    <main className="page">
      <section className="panel">
        <div className="page-head">
          <div>
            <h2>{session.title}</h2>
            <p className="item-meta">{session.summary ?? "No summary yet."}</p>
          </div>
          <span className="badge">{formatDate(session.sessionDate)}</span>
        </div>

        <p className="item-meta" style={{ marginTop: "0.6rem" }}>
          Project:{" "}
          <Link href={`/projects/${session.projectSlug}`}>{project?.title ?? session.projectSlug}</Link> · Duration: {session.minutes} minutes
        </p>

        {typeof session.progressBefore === "number" && typeof session.progressAfter === "number" ? (
          <p className="item-meta" style={{ marginTop: "0.3rem" }}>
            Progress: {session.progressBefore}% {"->"} {session.progressAfter}%
          </p>
        ) : null}

        {session.photos.length > 0 ? (
          <section style={{ marginTop: "0.8rem" }}>
            <h3>Session Photos</h3>
            <div className="photo-grid" style={{ marginTop: "0.65rem" }}>
              {session.photos.map((photo, index) => (
                <figure key={`${photo.src}-${index}`} className="photo-card">
                  <Image
                    src={photo.src}
                    alt={photo.alt ?? session.title}
                    width={1200}
                    height={900}
                    className="session-photo"
                  />
                  {photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        <article className="prose" style={{ marginTop: "0.9rem" }}>
          <MDXRemote source={session.body} />
        </article>
      </section>

      <section className="panel">
        <div className="page-head">
          <h3>Project Session Timeline</h3>
          <Link href="/work-sessions" className="item-meta">
            All sessions
          </Link>
        </div>

        <div className="session-links" style={{ marginTop: "0.65rem" }}>
          <div>
            <p className="item-meta">Previous</p>
            {previousSession ? (
              <Link href={`/work-sessions/${previousSession.slug}`} className="timeline-link">
                {previousSession.title}
              </Link>
            ) : (
              <p className="item-meta">Start of timeline</p>
            )}
          </div>

          <div>
            <p className="item-meta">Next</p>
            {nextSession ? (
              <Link href={`/work-sessions/${nextSession.slug}`} className="timeline-link">
                {nextSession.title}
              </Link>
            ) : (
              <p className="item-meta">Latest session</p>
            )}
          </div>
        </div>

        <ol className="timeline" style={{ marginTop: "0.8rem" }}>
          {orderedSessions.map((item) => (
            <li key={item.slug} className={item.slug === session.slug ? "timeline-item current" : "timeline-item"}>
              <div>
                {item.slug === session.slug ? (
                  <strong>{item.title}</strong>
                ) : (
                  <Link href={`/work-sessions/${item.slug}`}>{item.title}</Link>
                )}
                <p className="item-meta">
                  {formatDate(item.sessionDate)} · {item.minutes} minutes
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
