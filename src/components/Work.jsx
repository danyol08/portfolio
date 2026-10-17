import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { PROJECTS } from "../data/content.js";
import { useScrollSubscription, clamp } from "../hooks/scrollBus.js";
import { useFinePointer, usePrefersReducedMotion } from "../hooks/useMedia.js";
import { Reveal, SplitHeading } from "./ui.jsx";

/* ============================================================
   Lightbox: portal, focus trap, keyboard + swipe navigation
   ============================================================ */

function Lightbox({ images, index, title, onClose, onIndex }) {
  const overlayRef = useRef(null);
  const closeRef = useRef(null);
  const touchX = useRef(null);
  const live = useRef({ onClose, onIndex, index, len: images.length });
  live.current = { onClose, onIndex, index, len: images.length };

  useEffect(() => {
    const opener = document.activeElement;
    closeRef.current?.focus();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const onKey = (e) => {
      const { onClose: close, onIndex: setIdx, index: i, len } = live.current;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") setIdx((i - 1 + len) % len);
      else if (e.key === "ArrowRight") setIdx((i + 1) % len);
      else if (e.key === "Tab") {
        const f = overlayRef.current?.querySelectorAll("button");
        if (!f || !f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, []);

  // warm the neighbours so next/prev feels instant
  useEffect(() => {
    [-1, 1].forEach((d) => {
      const img = new Image();
      img.src = images[(index + d + images.length) % images.length].src;
    });
  }, [index, images]);

  const step = (d) => onIndex((index + d + images.length) % images.length);
  const multiple = images.length > 1;

  return createPortal(
    <div
      ref={overlayRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} screenshots`}
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (multiple && Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      }}
    >
      <button ref={closeRef} type="button" className="lightbox-btn lightbox-close" onClick={onClose} aria-label="Close preview">
        <X size={22} />
      </button>
      {multiple && (
        <button
          type="button"
          className="lightbox-btn lightbox-prev"
          onClick={(e) => { e.stopPropagation(); step(-1); }}
          aria-label="Previous screenshot"
        >
          <ChevronLeft size={26} />
        </button>
      )}
      <img
        key={index}
        src={images[index].src}
        alt={`${title}, screenshot ${index + 1} of ${images.length}`}
        className="lightbox-image"
        onClick={(e) => e.stopPropagation()}
      />
      {multiple && (
        <button
          type="button"
          className="lightbox-btn lightbox-next"
          onClick={(e) => { e.stopPropagation(); step(1); }}
          aria-label="Next screenshot"
        >
          <ChevronRight size={26} />
        </button>
      )}
      {multiple && <div className="lightbox-count" aria-live="polite">{index + 1} / {images.length}</div>}
    </div>,
    document.body
  );
}

/* ============================================================
   One project "stage"
   ============================================================ */

function ProjectStage({ project, flip }) {
  const stageRef = useRef(null);
  const tiltRef = useRef(null);
  const pointerStart = useRef(null);
  const swiped = useRef(false);
  const [index, setIndex] = useState(project.cover ?? 0);
  const [open, setOpen] = useState(false);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const { images } = project;
  const multiple = images.length > 1;
  const hasImages = images.length > 0;

  // Scroll-linked depth: the device sits angled back and settles flat as it reaches the middle of the screen.
  useScrollSubscription((y, vh) => {
    const el = stageRef.current;
    if (!el) return;
    if (reduced) {
      el.style.setProperty("--sr", "0");
      return;
    }
    const r = el.getBoundingClientRect();
    const sr = clamp((r.top + r.height / 2 - vh * 0.5) / (vh * 0.75), -1, 1);
    el.style.setProperty("--sr", sr.toFixed(3));
  });

  // Cursor tilt + moving glare (mouse only).
  const onTiltMove = useCallback(
    (e) => {
      if (!fine || reduced) return;
      const el = tiltRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--tx", (px * 9).toFixed(2));
      el.style.setProperty("--ty", (-py * 7).toFixed(2));
      el.style.setProperty("--lx", `${((px + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty("--ly", `${((py + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty("--glare", "1");
    },
    [fine, reduced]
  );
  const onTiltLeave = useCallback(() => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty("--tx", "0");
    el.style.setProperty("--ty", "0");
    el.style.setProperty("--glare", "0");
  }, []);

  const go = (d) => setIndex((i) => (i + d + images.length) % images.length);

  // swipe on touch, click/tap to expand
  const onDown = (e) => {
    pointerStart.current = e.clientX;
    swiped.current = false;
  };
  const onUp = (e) => {
    if (pointerStart.current == null) return;
    const dx = e.clientX - pointerStart.current;
    pointerStart.current = null;
    if (multiple && Math.abs(dx) > 45) {
      swiped.current = true;
      go(dx < 0 ? 1 : -1);
    }
  };
  const onOpenClick = () => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    setOpen(true);
  };

  return (
    <article ref={stageRef} className={`project ${flip ? "is-flip" : ""}`} style={{ "--dir": flip ? -1 : 1 }}>
      <div className="project-media">
        <div className="device-depth">
          <div
            ref={tiltRef}
            className="device-tilt"
            onPointerMove={onTiltMove}
            onPointerLeave={onTiltLeave}
          >
            <div className="device-frame">
              <div className="device-screen">
                {images.map((img, i) => (
                  <img
                    key={img.src}
                    src={img.src}
                    alt={i === index ? `${project.title}, screenshot ${i + 1} of ${images.length}` : ""}
                    aria-hidden={i === index ? undefined : true}
                    className={i === index ? "is-active" : ""}
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                  />
                ))}
                <div className="device-glare" aria-hidden="true" />
                {!hasImages && (
                  <a
                    className="device-fallback"
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.title} live site`}
                  >
                    <span className="device-fallback-name">{project.title}</span>
                    <span className="device-fallback-cta">Open live site <ArrowUpRight size={16} aria-hidden="true" /></span>
                  </a>
                )}
                {hasImages && (
                <button
                  type="button"
                  className="device-open"
                  onPointerDown={onDown}
                  onPointerUp={onUp}
                  onPointerCancel={() => (pointerStart.current = null)}
                  onClick={onOpenClick}
                  aria-label={`Open ${project.title} screenshot ${index + 1} full screen`}
                >
                  <span className="device-expand" aria-hidden="true"><Expand size={15} /></span>
                </button>
                )}
                {multiple && (
                  <>
                    <button type="button" className="device-arrow device-prev" onClick={() => go(-1)} aria-label="Previous screenshot">
                      <ChevronLeft size={18} />
                    </button>
                    <button type="button" className="device-arrow device-next" onClick={() => go(1)} aria-label="Next screenshot">
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {multiple && (
          <ul className="thumbs" aria-label={`${project.title} screenshots`}>
            {images.map((img, i) => (
              <li key={img.src}>
                <button
                  type="button"
                  className={i === index ? "is-active" : ""}
                  onClick={() => setIndex(i)}
                  aria-label={`Show screenshot ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                >
                  <img src={img.thumb} alt="" loading="lazy" decoding="async" draggable="false" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="project-info">
        {project.context && <Reveal as="p" className="project-context">{project.context}</Reveal>}
        <SplitHeading as="h3" text={project.title} className="project-title" />
        <Reveal as="p" className="project-desc" delay={120}>{project.description}</Reveal>
        {project.tags?.length > 0 && (
          <Reveal as="ul" className="project-tags" delay={180} aria-label="Technologies">
            {project.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </Reveal>
        )}
        <Reveal className="project-actions" delay={220}>
          {project.link && (
            <a className="link-btn" href={project.link} target="_blank" rel="noopener noreferrer">
              Visit live site <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
          {hasImages && (
            <button type="button" className="link-btn" onClick={() => setOpen(true)}>
              View screenshots full screen
            </button>
          )}
        </Reveal>
      </div>

      {open && hasImages && (
        <Lightbox
          images={images}
          index={index}
          title={project.title}
          onClose={() => setOpen(false)}
          onIndex={setIndex}
        />
      )}
    </article>
  );
}

export default function Work() {
  return (
    <section id="work" className="work sheet">
      <div className="wrap">
        <header className="section-head">
          <SplitHeading text="Selected work" className="section-title" />
          <Reveal as="p" className="section-blurb" delay={150}>
            Systems and apps I've developed, from a salon transaction tracker to asset management, parking operations and fitness tracking.
          </Reveal>
        </header>

        <div className="projects">
          {PROJECTS.map((p, i) => (
            <ProjectStage project={p} flip={i % 2 === 1} key={p.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
