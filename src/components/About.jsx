import { useRef } from "react";
import { PROFILE, EXPERIENCE, ABOUT_STATEMENT, ABOUT_PILLARS, AVAILABILITY } from "../data/content.js";
import { useScrollSubscription, clamp } from "../hooks/scrollBus.js";
import { usePrefersReducedMotion } from "../hooks/useMedia.js";
import { Reveal, ScrollWords } from "./ui.jsx";

export default function About() {
  const gridRef = useRef(null);
  const asideRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const current = EXPERIENCE[0];

  // The facts column drifts slightly slower than the text: quiet depth, wide screens only (CSS gates it).
  useScrollSubscription((y, vh) => {
    const grid = gridRef.current;
    const aside = asideRef.current;
    if (!grid || !aside) return;
    if (reduced) {
      aside.style.setProperty("--py", "0px");
      return;
    }
    const r = grid.getBoundingClientRect();
    const d = clamp((r.top + r.height / 2 - vh / 2) / vh, -1, 1);
    aside.style.setProperty("--py", `${(d * -42).toFixed(1)}px`);
  });

  return (
    <section id="about" className="about">
      <div className="wrap about-grid" ref={gridRef}>
        <ScrollWords className="about-statement" text={ABOUT_STATEMENT} />

        <div className="about-main">
          <Reveal as="p" className="about-lede">{PROFILE.summary}</Reveal>

          <ul className="pillars">
            {ABOUT_PILLARS.map(({ icon: Icon, title, body }, i) => (
              <Reveal as="li" className="pillar" delay={i * 90} key={title}>
                <Icon size={20} className="pillar-icon" aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        <aside className="about-aside" ref={asideRef}>
          <dl className="facts">
            <div>
              <dt>Based in</dt>
              <dd>{PROFILE.location}</dd>
            </div>
            <div>
              <dt>Currently</dt>
              <dd>{current.role} at {current.company}</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>{AVAILABILITY}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
