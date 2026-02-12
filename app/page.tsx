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
    <main className="page">
      <section className="panel">
        <div className="page-head">
          <div>
            <h2>Dashboard</h2>
            <p className="item-meta">Everything in one place, backed by local MDX files.</p>
          </div>
        </div>
        <div className="panel-grid" style={{ marginTop: "0.8rem" }}>
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href} className="stat-card">
              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="page-head">
          <h3>In Progress Projects</h3>
        </div>
        <div className="stack" style={{ marginTop: "0.8rem" }}>
          {inProgress.length === 0 ? <p className="item-meta">No active projects yet.</p> : null}
          {inProgress.map((project) => (
            <article key={project.slug} className="item-card">
              <div className="page-head">
                <div>
                  <h4>
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  </h4>
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

      <section className="panel">
        <div className="page-head">
          <h3>Recent Work Sessions</h3>
          <Link href="/work-sessions" className="item-meta">
            View all
          </Link>
        </div>
        <div style={{ marginTop: "0.6rem", overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Session</th>
                <th>Project</th>
                <th>Minutes</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="item-meta">
                    Add files in <code>content/work-sessions</code> to populate this.
                  </td>
                </tr>
              ) : null}
              {sessions.map((session) => (
                <tr key={session.slug}>
                  <td>{formatDate(session.sessionDate)}</td>
                  <td>
                    <Link href={`/work-sessions/${session.slug}`}>{session.title}</Link>
                  </td>
                  <td>
                    <Link href={`/projects/${session.projectSlug}`}>{session.projectSlug}</Link>
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
