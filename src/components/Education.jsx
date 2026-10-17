import { EDUCATION, CERTIFICATIONS } from "../data/content.js";
import { Reveal, SplitHeading } from "./ui.jsx";

export default function Education() {
  return (
    <section id="education" className="education">
      <div className="wrap">
        <header className="section-head">
          <SplitHeading text="Foundations" className="section-title" />
        </header>
        <div className="edu-grid">
          <Reveal className="edu-block">
            <h3>Education</h3>
            <p className="edu-main">{EDUCATION.degree}</p>
            <p>{EDUCATION.school}</p>
            <p className="edu-period">{EDUCATION.period}</p>
          </Reveal>
          <Reveal className="edu-block" delay={100}>
            <h3>Certifications</h3>
            <ul className="cert-list">
              {CERTIFICATIONS.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
