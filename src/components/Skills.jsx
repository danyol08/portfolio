import { useRef } from "react";
import { SKILL_GROUPS } from "../data/content.js";
import { useScrollSubscription, clamp } from "../hooks/scrollBus.js";
import { usePrefersReducedMotion } from "../hooks/useMedia.js";
import { Reveal, SplitHeading } from "./ui.jsx";

/**
 * Skills as a depth stack. The list reads top to bottom the way a system is layered
 * (AI workflow down to the cabling), and the row nearest the middle of the screen
 * comes forward while the others recede in z. Everything is measured in one pass
 * per frame: read all rects first, then write all styles.
 */
export default function Skills() {
  const listRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useScrollSubscription((y, vh) => {
    const list = listRef.current;
    if (!list) return;
    const rows = Array.from(list.children);
    const mid = vh * 0.5;
    const rects = rows.map((row) => row.getBoundingClientRect());
    rows.forEach((row, i) => {
      const r = rects[i];
      const d = clamp((r.top + r.height / 2 - mid) / (vh * 0.55), -1, 1);
      const f = 1 - Math.abs(d);
      const inner = row.firstElementChild;
      inner.style.setProperty("--f", f.toFixed(3));
      inner.style.setProperty("--d", d.toFixed(3));
    });
  }, !reduced);

  return (
    <section id="skills" className="skills">
      <div className="wrap">
        <header className="section-head">
          <SplitHeading text="A toolkit built for connecting systems" className="section-title" />
          <Reveal as="p" className="section-blurb" delay={150}>
            Grouped the way they get used on a real engagement, from AI-assisted scaffolding down to the router that keeps the office online.
          </Reveal>
        </header>

        <ul className="stack" ref={listRef}>
          {SKILL_GROUPS.map(({ category, icon: Icon, items }) => (
            <li className="stack-row" key={category}>
              <div className="stack-row-inner">
                <span className="stack-icon" aria-hidden="true"><Icon size={18} /></span>
                <h3>{category}</h3>
                <ul className="stack-items">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
