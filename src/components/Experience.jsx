import { useRef } from "react";
import { EXPERIENCE } from "../data/content.js";
import { useInView } from "../hooks/useInView.js";
import { useScrollSubscription, clamp } from "../hooks/scrollBus.js";
import { usePrefersReducedMotion } from "../hooks/useMedia.js";
import { SplitHeading } from "./ui.jsx";

function TimelineItem({ role }) {
  const itemRef = useRef(null);
  const fillRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [inViewRef, inView] = useInView({ threshold: 0.2, rootMargin: "0px 0px -22% 0px" });

  // The rail fills as this entry passes the reading line (~62% down the screen).
  useScrollSubscription((y, vh) => {
    const el = itemRef.current;
    const fill = fillRef.current;
    if (!el || !fill) return;
    if (reduced) {
      fill.style.transform = "scaleY(1)";
      return;
    }
    const r = el.getBoundingClientRect();
    fill.style.transform = `scaleY(${clamp((vh * 0.62 - r.top) / r.height).toFixed(4)})`;
  });

  const setRefs = (node) => {
    itemRef.current = node;
    inViewRef.current = node;
  };

  return (
    <li ref={setRefs} className={`tl-item ${inView ? "is-in" : ""}`}>
      <div className="tl-meta">
        <time>{role.period}</time>
        <p>{role.company}</p>
      </div>
      <div className="tl-rail" aria-hidden="true">
        <span className="tl-line"><span className="tl-fill" ref={fillRef} /></span>
        <span className="tl-dot" />
      </div>
      <div className="tl-body">
        <h3>{role.role}</h3>
        <ul>
          {role.points.map((pt, i) => (
            <li key={pt} style={{ "--i": i }}>{pt}</li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="experience">
      <div className="wrap">
        <header className="section-head">
          <SplitHeading text="Where the work happened" className="section-title" />
        </header>
        <ol className="timeline">
          {EXPERIENCE.map((role) => (
            <TimelineItem role={role} key={role.role} />
          ))}
        </ol>
      </div>
    </section>
  );
}
