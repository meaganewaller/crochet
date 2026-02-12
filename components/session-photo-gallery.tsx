"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Photo = {
  src: string;
  alt?: string;
  caption?: string;
};

type SessionPhotoGalleryProps = {
  photos: Photo[];
  sessionTitle: string;
};

export default function SessionPhotoGallery({ photos, sessionTitle }: SessionPhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activePhoto = useMemo(
    () => (typeof activeIndex === "number" ? photos[activeIndex] : undefined),
    [activeIndex, photos]
  );
  const activePosition = typeof activeIndex === "number" ? activeIndex + 1 : 1;
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      } else if (event.key === "ArrowRight") {
        setActiveIndex((current) => {
          if (current === null) {
            return null;
          }

          return (current + 1) % photos.length;
        });
      } else if (event.key === "ArrowLeft") {
        setActiveIndex((current) => {
          if (current === null) {
            return null;
          }

          return (current - 1 + photos.length) % photos.length;
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, photos.length]);

  return (
    <>
      <div className="photo-grid" style={{ marginTop: "0.65rem" }}>
        {photos.map((photo, index) => (
          <figure key={`${photo.src}-${index}`} className="photo-card">
            <button
              type="button"
              className="photo-trigger"
              onClick={() => {
                setActiveIndex(index);
              }}
            >
              <Image
                src={photo.src}
                alt={photo.alt ?? `${sessionTitle} photo ${index + 1}`}
                width={1200}
                height={900}
                className="session-photo"
              />
            </button>
            {photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
          </figure>
        ))}
      </div>

      {activePhoto ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Session photo viewer"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setActiveIndex(null);
            }
          }}
          ref={dialogRef}
          tabIndex={-1}
        >
          <div className="lightbox-content">
            <button
              type="button"
              className="lightbox-close"
              onClick={() => {
                setActiveIndex(null);
              }}
              aria-label="Close photo viewer"
            >
              Close
            </button>

            <div className="lightbox-frame">
              <Image
                src={activePhoto.src}
                alt={activePhoto.alt ?? sessionTitle}
                width={1800}
                height={1400}
                className="lightbox-photo"
                priority
              />
            </div>

            <div className="lightbox-controls">
              <button
                type="button"
                className="lightbox-nav"
                onClick={() => {
                  setActiveIndex((current) => {
                    if (current === null) {
                      return null;
                    }

                    return (current - 1 + photos.length) % photos.length;
                  });
                }}
                aria-label="Previous image"
              >
                Prev
              </button>

              <p className="item-meta">
                {activePosition} / {photos.length}
              </p>

              <button
                type="button"
                className="lightbox-nav"
                onClick={() => {
                  setActiveIndex((current) => {
                    if (current === null) {
                      return null;
                    }

                    return (current + 1) % photos.length;
                  });
                }}
                aria-label="Next image"
              >
                Next
              </button>
            </div>

            {activePhoto.caption ? <p className="lightbox-caption">{activePhoto.caption}</p> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
