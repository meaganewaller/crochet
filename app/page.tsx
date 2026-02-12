import Image from "next/image";
import Link from "next/link";

import {
  getPatternWishlist,
  getProjectIdeas,
  getProjects,
  getPurchasedPatterns,
  getQueueItems,
  getSavedPatterns,
  getWorkSessions,
  getYarnInventory,
  getYarnWishlist
} from "@/lib/content";
import { formatDate } from "@/lib/date";

export default function DashboardPage() {
  const projects = getProjects();
  const inProgress = projects.filter((project) => project.status !== "finished");
  const sessions = getWorkSessions().slice(0, 6);
  const featuredProject = inProgress[0] ?? projects[0];
  const projectTitleBySlug = new Map(projects.map((project) => [project.slug, project.title]));

  const stats = [
    { label: "In Progress", value: inProgress.length, href: "/projects" },
    { label: "Queued", value: getQueueItems().length, href: "/queue" },
    {
      label: "Pattern Library",
      value: getPurchasedPatterns().length + getSavedPatterns().length,
      href: "/patterns/purchased"
    },
    { label: "Pattern Wishlist", value: getPatternWishlist().length, href: "/patterns/wishlist" },
    { label: "Yarn Inventory", value: getYarnInventory().length, href: "/yarn/inventory" },
    { label: "Yarn Wishlist", value: getYarnWishlist().length, href: "/yarn/wishlist" },
    { label: "Ideas", value: getProjectIdeas().length, href: "/ideas" }
  ];

  return (
    <main className="page page-dashboard">
      <section className="panel dashboard-hero">
        <div className="dashboard-hero-copy">
          <p className="eyebrow">Studio Overview</p>
          <h2>Your Crochet Studio At A Glance</h2>
          <p className="item-meta">
            Track what is active, what is next, and what has momentum this week.
          </p>
          <div className="dashboard-pill-row">
            <span>{inProgress.length} active projects</span>
            <span>{sessions.length} recent sessions</span>
            <span>{getQueueItems().length} queued ideas</span>
          </div>
        </div>

        {featuredProject ? (
          <Link href={`/projects/${featuredProject.slug}`} className="feature-card">
            <p className="eyebrow">Featured Project</p>
            <h3>{featuredProject.title}</h3>
            <p className="item-meta">{featuredProject.summary ?? "No summary yet."}</p>
            <div className="progress-wrap" style={{ marginTop: "0.6rem" }}>
              <div className="progress-bar" style={{ width: `${featuredProject.progressPercent}%` }} />
            </div>
            <p className="item-meta" style={{ marginTop: "0.35rem" }}>
              {featuredProject.progressPercent}% complete
            </p>
          </Link>
        ) : (
          <div className="feature-card">
            <p className="item-meta">Add your first project in `content/projects` to populate this card.</p>
          </div>
        )}
      </section>

      <section className="panel panel-checker">
        <div className="page-head">
          <div>
            <h3>Collection Snapshot</h3>
            <p className="item-meta">Quick links to each part of your crochet library.</p>
          </div>
        </div>

        <div className="quilt-grid" style={{ marginTop: "0.85rem" }}>
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href} className="quilt-card">
              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="panel panel-ribbon">
        <div className="page-head">
          <h3>Recent Work Sessions</h3>
          <Link href="/work-sessions" className="item-meta">
            View full timeline
          </Link>
        </div>

        {sessions.length === 0 ? (
          <p className="item-meta" style={{ marginTop: "0.8rem" }}>
            Add files in <code>content/work-sessions</code> to populate this.
          </p>
        ) : (
          <div className="session-strip-list" style={{ marginTop: "0.85rem" }}>
            {sessions.map((session) => {
              const thumbnail = session.photos[0];
              return (
                <article key={session.slug} className="session-strip">
                  <Link href={`/work-sessions/${session.slug}`} className="session-strip-media">
                    {thumbnail ? (
                      <Image
                        src={thumbnail.src}
                        alt={thumbnail.alt ?? session.title}
                        width={720}
                        height={520}
                        className="session-strip-image"
                      />
                    ) : (
                      <div className="session-strip-image session-strip-fallback">No photo</div>
                    )}
                  </Link>
                  <div className="session-strip-body">
                    <p className="session-strip-date">{formatDate(session.sessionDate)}</p>
                    <h4>
                      <Link href={`/work-sessions/${session.slug}`}>{session.title}</Link>
                    </h4>
                    <p className="item-meta">{session.summary ?? "No summary yet."}</p>
                    <p className="item-meta" style={{ marginTop: "0.2rem" }}>
                      <Link href={`/projects/${session.projectSlug}`}>
                        {projectTitleBySlug.get(session.projectSlug) ?? session.projectSlug}
                      </Link>{" "}
                      · {session.minutes} min
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
