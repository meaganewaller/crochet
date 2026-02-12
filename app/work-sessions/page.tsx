import Link from "next/link";

import { getWorkSessions } from "@/lib/content";
import { formatDate } from "@/lib/date";

export default function WorkSessionsPage() {
  const sessions = getWorkSessions();

  return (
    <main className="page">
      <section className="panel">
        <div className="page-head">
          <div>
            <h2>Work Sessions</h2>
            <p className="item-meta">Session-by-session progress log.</p>
          </div>
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
                    No sessions yet.
                  </td>
                </tr>
              ) : null}
              {sessions.map((session) => (
                <tr key={session.slug}>
                  <td>{formatDate(session.sessionDate)}</td>
                  <td>{session.title}</td>
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
