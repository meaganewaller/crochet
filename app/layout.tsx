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
        <div className="shell">
          <header className="site-header">
            <div>
              <p className="eyebrow">Studio Log</p>
              <h1>Crochet Tracker</h1>
            </div>
            <p className="subhead">
              Static TypeScript + MDX workspace for projects, yarn, and future makes.
            </p>
          </header>
          <nav className="site-nav" aria-label="Primary">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="nav-pill">
                {item.label}
              </Link>
            ))}
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
