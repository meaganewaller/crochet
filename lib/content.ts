import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

const CONTENT_ROOT = path.join(process.cwd(), "content");

type RawEntry = {
  slug: string;
  body: string;
  data: Record<string, unknown>;
};

export type ProjectStatus = "in-progress" | "paused" | "finished";

export type Project = {
  slug: string;
  title: string;
  status: ProjectStatus;
  startedOn?: string;
  targetFinish?: string;
  pattern?: string;
  hookSize?: string;
  yarns: string[];
  progressPercent: number;
  summary?: string;
  body: string;
};

export type WorkSession = {
  slug: string;
  title: string;
  projectSlug: string;
  sessionDate: string;
  minutes: number;
  progressBefore?: number;
  progressAfter?: number;
  summary?: string;
  body: string;
};

export type QueueItem = {
  slug: string;
  title: string;
  priority: "high" | "medium" | "low";
  intendedStart?: string;
  pattern?: string;
  summary?: string;
  body: string;
};

export type Pattern = {
  slug: string;
  title: string;
  designer?: string;
  source?: string;
  pricePaid?: string;
  tags: string[];
  summary?: string;
  body: string;
};

export type YarnInventoryItem = {
  slug: string;
  title: string;
  brand?: string;
  colorway?: string;
  fiber?: string;
  weight?: string;
  quantity?: number;
  unit?: string;
  summary?: string;
  body: string;
};

export type YarnWishlistItem = {
  slug: string;
  title: string;
  brand?: string;
  weight?: string;
  colorway?: string;
  summary?: string;
  body: string;
};

export type ProjectIdea = {
  slug: string;
  title: string;
  level?: "easy" | "intermediate" | "advanced";
  season?: string;
  summary?: string;
  body: string;
};

function readRawCollection(collection: string): RawEntry[] {
  const collectionPath = path.join(CONTENT_ROOT, collection);
  if (!fs.existsSync(collectionPath)) {
    return [];
  }

  return fs
    .readdirSync(collectionPath)
    .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"))
    .map((fileName) => {
      const fullPath = path.join(collectionPath, fileName);
      const raw = fs.readFileSync(fullPath, "utf8");
      const parsed = matter(raw);
      const slug = fileName.replace(/\.(md|mdx)$/u, "");

      return {
        slug,
        body: parsed.content,
        data: parsed.data
      };
    });
}

function toStringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function toNumber(value: unknown, fallback: number): number;
function toNumber(value: unknown, fallback: undefined): number | undefined;
function toNumber(value: unknown, fallback: number | undefined): number | undefined {
  return typeof value === "number" ? value : fallback;
}

export function getProjects(): Project[] {
  return readRawCollection("projects")
    .map((entry) => {
      const status = entry.data.status;
      const safeStatus: ProjectStatus =
        status === "paused" || status === "finished" ? status : "in-progress";

      return {
        slug: entry.slug,
        title: toStringValue(entry.data.title) ?? entry.slug,
        status: safeStatus,
        startedOn: toStringValue(entry.data.startedOn),
        targetFinish: toStringValue(entry.data.targetFinish),
        pattern: toStringValue(entry.data.pattern),
        hookSize: toStringValue(entry.data.hookSize),
        yarns: toStringArray(entry.data.yarns),
        progressPercent: Math.min(100, Math.max(0, toNumber(entry.data.progressPercent, 0))),
        summary: toStringValue(entry.data.summary),
        body: entry.body
      };
    })
    .sort((a, b) => b.progressPercent - a.progressPercent);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}

export function getWorkSessions(): WorkSession[] {
  return readRawCollection("work-sessions")
    .map((entry) => ({
      slug: entry.slug,
      title: toStringValue(entry.data.title) ?? entry.slug,
      projectSlug: toStringValue(entry.data.projectSlug) ?? "",
      sessionDate: toStringValue(entry.data.sessionDate) ?? "",
      minutes: toNumber(entry.data.minutes, 0),
      progressBefore: toNumber(entry.data.progressBefore, undefined),
      progressAfter: toNumber(entry.data.progressAfter, undefined),
      summary: toStringValue(entry.data.summary),
      body: entry.body
    }))
    .sort((a, b) => {
      const left = new Date(a.sessionDate).valueOf();
      const right = new Date(b.sessionDate).valueOf();
      return Number.isNaN(right) || Number.isNaN(left) ? 0 : right - left;
    });
}

export function getQueueItems(): QueueItem[] {
  return readRawCollection("queue")
    .map((entry) => ({
      slug: entry.slug,
      title: toStringValue(entry.data.title) ?? entry.slug,
      priority:
        entry.data.priority === "high" || entry.data.priority === "low"
          ? entry.data.priority
          : "medium",
      intendedStart: toStringValue(entry.data.intendedStart),
      pattern: toStringValue(entry.data.pattern),
      summary: toStringValue(entry.data.summary),
      body: entry.body
    }))
    .sort((a, b) => {
      const ranking = { high: 3, medium: 2, low: 1 };
      return ranking[b.priority] - ranking[a.priority];
    });
}

function readPatternCollection(pathName: string): Pattern[] {
  return readRawCollection(pathName).map((entry) => ({
    slug: entry.slug,
    title: toStringValue(entry.data.title) ?? entry.slug,
    designer: toStringValue(entry.data.designer),
    source: toStringValue(entry.data.source),
    pricePaid: toStringValue(entry.data.pricePaid),
    tags: toStringArray(entry.data.tags),
    summary: toStringValue(entry.data.summary),
    body: entry.body
  }));
}

export function getPurchasedPatterns(): Pattern[] {
  return readPatternCollection("patterns/purchased");
}

export function getPatternWishlist(): Pattern[] {
  return readPatternCollection("patterns/wishlist");
}

export function getSavedPatterns(): Pattern[] {
  return readPatternCollection("patterns/saved");
}

export function getYarnInventory(): YarnInventoryItem[] {
  return readRawCollection("yarn/inventory").map((entry) => ({
    slug: entry.slug,
    title: toStringValue(entry.data.title) ?? entry.slug,
    brand: toStringValue(entry.data.brand),
    colorway: toStringValue(entry.data.colorway),
    fiber: toStringValue(entry.data.fiber),
    weight: toStringValue(entry.data.weight),
    quantity: toNumber(entry.data.quantity, undefined),
    unit: toStringValue(entry.data.unit),
    summary: toStringValue(entry.data.summary),
    body: entry.body
  }));
}

export function getYarnWishlist(): YarnWishlistItem[] {
  return readRawCollection("yarn/wishlist").map((entry) => ({
    slug: entry.slug,
    title: toStringValue(entry.data.title) ?? entry.slug,
    brand: toStringValue(entry.data.brand),
    weight: toStringValue(entry.data.weight),
    colorway: toStringValue(entry.data.colorway),
    summary: toStringValue(entry.data.summary),
    body: entry.body
  }));
}

export function getProjectIdeas(): ProjectIdea[] {
  return readRawCollection("ideas").map((entry) => ({
    slug: entry.slug,
    title: toStringValue(entry.data.title) ?? entry.slug,
    level:
      entry.data.level === "easy" || entry.data.level === "advanced"
        ? entry.data.level
        : "intermediate",
    season: toStringValue(entry.data.season),
    summary: toStringValue(entry.data.summary),
    body: entry.body
  }));
}
