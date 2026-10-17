import { useRef } from "react";
import { useInView } from "../hooks/useInView.js";
import { useMagnetic } from "../hooks/useMagnetic.js";
import { usePrefersReducedMotion } from "../hooks/useMedia.js";
import { useScrollSubscription, clamp } from "../hooks/scrollBus.js";

/** Fade/raise a block into view once. Kept for body content; headings use SplitHeading. */
export function Reveal({ as: Tag = "div", className = "", delay = 0, children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "is-in" : ""} ${className}`}
      style={{ "--d": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Heading whose words rise out of a mask, staggered, when it scrolls into view. */
export function SplitHeading({ as: Tag = "h2", text, className = "", delay = 0 }) {
  const [ref, inView] = useInView({ threshold: 0.35 });
  const words = text.split(" ");
  return (
    <Tag ref={ref} className={`split ${inView ? "is-in" : ""} ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          <span className="split-word">
            <span className="split-inner" style={{ transitionDelay: `${delay + i * 55}ms` }}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

/** Statement text that fills in word by word as the reader scrolls through it. */
export function ScrollWords({ as: Tag = "h2", text, className = "" }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const words = text.split(" ");

  useScrollSubscription((y, vh) => {
    const el = ref.current;
    if (!el) return;
    const spans = el.querySelectorAll("[data-w]");
    if (reduced) {
      spans.forEach((s) => (s.style.opacity = "1"));
      return;
    }
    const r = el.getBoundingClientRect();
    const progress = clamp((vh * 0.88 - r.top) / (vh * 0.5));
    const n = spans.length;
    spans.forEach((s, i) => {
      const k = clamp(progress * (n + 2) - i, 0, 1);
      s.style.opacity = (0.2 + 0.8 * k).toFixed(3);
    });
  });

  return (
    <Tag ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i}>
          <span data-w className="scroll-word">{w}</span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

/** Wrap a button/link so it leans toward the cursor (mouse users only). */
export function Magnetic({ children, strength = 0.32 }) {
  const ref = useMagnetic(strength);
  return (
    <span ref={ref} className="magnet">
      {children}
    </span>
  );
}

/** Thin reading-progress line along the top edge. */
export function ScrollProgress() {
  const ref = useRef(null);
  useScrollSubscription((y, vh) => {
    const el = ref.current;
    if (!el) return;
    const max = document.documentElement.scrollHeight - vh;
    el.style.transform = `scaleX(${max > 0 ? clamp(y / max) : 0})`;
  });
  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}
