import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Crochet Tracker",
  description: "Track crochet projects, patterns, yarn, and ideas in one static MDX site."
};

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/work-sessions", label: "Work Sessions" },
  { href: "/queue", label: "Queue" },
  { href: "/patterns/purchased", label: "Purchased Patterns" },
  { href: "/patterns/wishlist", label: "Pattern Wishlist" },
  { href: "/patterns/saved", label: "Saved Patterns" },
  { href: "/yarn/inventory", label: "Yarn Inventory" },
  { href: "/yarn/wishlist", label: "Yarn Wishlist" },
  { href: "/ideas", label: "Project Ideas" }
];

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="background-wash" aria-hidden />
        <div className="shell">
          <header className="site-header">
            <div className="site-header-main">
              <p className="eyebrow">Studio Log</p>
              <h1>Crochet Tracker</h1>
              <p className="subhead">
                Static TypeScript + MDX workspace for projects, yarn, and future makes.
              </p>
            </div>
            <div className="header-badges" aria-label="Site tags">
              <span>Single Maker</span>
              <span>Pastel Archive</span>
              <span>Project Timeline</span>
            </div>
          </header>
          <div className="checker-ribbon" aria-hidden />
          <nav className="site-nav" aria-label="Primary">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="nav-pill">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="wave-divider" aria-hidden>
            <svg viewBox="0 0 1200 34" preserveAspectRatio="none">
              <path d="M0 16 Q 120 0 240 16 T 480 16 T 720 16 T 960 16 T 1200 16 V34 H0 Z" />
            </svg>
          </div>
          <div className="site-main">
            <section className="page-intro panel">
              <p className="eyebrow">Crochet Command Center</p>
              <h2>Keep Every Session, Pattern, And Idea In One Place</h2>
            </section>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
