import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import SessionPhotoGallery from "@/components/session-photo-gallery";
import { getPurchasedPatternBySlug, getPurchasedPatterns } from "@/lib/content";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getPurchasedPatterns().map((pattern) => ({
    slug: pattern.slug
  }));
}

export const dynamicParams = false;

export default async function PurchasedPatternDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pattern = getPurchasedPatternBySlug(slug);

  if (!pattern) {
    notFound();
  }

  const galleryImages = pattern.images.map((src) => ({ src }));

  return (
    <main className="page">
      <section className="panel panel-ribbon">
        <div className="page-head">
          <div>
            <p className="eyebrow">Purchased Pattern</p>
            <h2>{pattern.title}</h2>
            <p className="item-meta">{pattern.summary ?? "No summary yet."}</p>
          </div>
          <Link href="/patterns/purchased" className="item-meta">
            Back to purchased
          </Link>
        </div>

        <div className="pattern-detail-meta" style={{ marginTop: "0.8rem" }}>
          <span>Designer: {pattern.designer ?? "Unknown"}</span>
          <span>Source: {pattern.source ?? "Unknown"}</span>
          <span>Paid: {pattern.pricePaid ?? "Unknown"}</span>
        </div>

        {pattern.tags.length > 0 ? (
          <p className="item-meta" style={{ marginTop: "0.45rem" }}>
            Tags: {pattern.tags.join(", ")}
          </p>
        ) : null}
      </section>

      <section className="panel panel-checker">
        <div className="page-head">
          <h3>Pattern Gallery</h3>
        </div>

        {galleryImages.length > 0 ? (
          <SessionPhotoGallery photos={galleryImages} titleForAlt={pattern.title} />
        ) : (
          <p className="item-meta" style={{ marginTop: "0.8rem" }}>
            No gallery images yet. Add image paths to the <code>images</code> frontmatter field.
          </p>
        )}
      </section>

      <section className="panel">
        <h3>Notes</h3>
        <article className="prose" style={{ marginTop: "0.6rem" }}>
          <MDXRemote source={pattern.body} />
        </article>
      </section>
    </main>
  );
}
