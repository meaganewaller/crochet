# Crochet Tracker

Static TypeScript + MDX site for managing your crochet workflow.

## What this includes

- Next.js App Router project in TypeScript.
- Static export mode (`next build` emits `out/`).
- MDX content folders for:
  - In-progress/finished projects
  - Work sessions (with progress deltas)
  - Queue
  - Purchased/saved/wishlist patterns
  - Yarn inventory and yarn wishlist
  - Project ideas

## Run locally

```bash
npm install
npm run dev
```

Build static output:

```bash
npm run build
```

## Content model

All data lives in `content/**` as `.mdx` files.

### `content/projects/*.mdx`

```mdx
---
title: "Project name"
status: "in-progress" # in-progress | paused | finished
startedOn: "2026-02-01"
targetFinish: "2026-03-15"
pattern: "Pattern name"
hookSize: "5.0 mm"
yarns:
  - "Yarn A"
  - "Yarn B"
progressPercent: 42
summary: "Short summary"
---

Detailed notes in MDX.
```

### `content/work-sessions/*.mdx`

```mdx
---
title: "Session title"
projectSlug: "project-file-name"
sessionDate: "2026-02-08"
minutes: 90
progressBefore: 35
progressAfter: 42
summary: "What changed"
---

Optional deep notes.
```

### Other folders

- `content/queue`: `title`, `priority` (`high|medium|low`), `intendedStart`, `pattern`, `summary`
- `content/patterns/purchased`: `title`, `designer`, `source`, `pricePaid`, `tags[]`, `summary`
- `content/patterns/wishlist`: `title`, `designer`, `source`, `tags[]`, `summary`
- `content/patterns/saved`: `title`, `designer`, `source`, `tags[]`, `summary`
- `content/yarn/inventory`: `title`, `brand`, `colorway`, `fiber`, `weight`, `quantity`, `unit`, `summary`
- `content/yarn/wishlist`: `title`, `brand`, `colorway`, `weight`, `summary`
- `content/ideas`: `title`, `level` (`easy|intermediate|advanced`), `season`, `summary`

## Notes

- This is intentionally single-user and file-based.
- No authentication or database is included.
- Routes are generated from file names (`my-project.mdx` -> `/projects/my-project`).
