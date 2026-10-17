import { useRef, useState } from "react";
import { Download, FileText, Linkedin, Mail, Phone } from "lucide-react";
import { PROFILE, AVAILABILITY, FORMSPREE_ENDPOINT, cvFile, CV_FILENAME } from "../data/content.js";
import { useFinePointer, usePrefersReducedMotion } from "../hooks/useMedia.js";
import { Magnetic, Reveal, SplitHeading } from "./ui.jsx";

export default function Contact() {
  const sectionRef = useRef(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  // Ambient light follows the cursor and the headline leans a few degrees toward it.
  const onMove = (e) => {
    if (!fine || reduced) return;
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
    el.style.setProperty("--ry", `${((px - 0.5) * 6).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${(-(py - 0.5) * 4).toFixed(2)}deg`);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    const form = e.currentTarget;
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="contact sheet" onPointerMove={onMove}>
      <div className="contact-glow" aria-hidden="true" />
      <div className="wrap contact-wrap">
        <div className="contact-title-tilt">
          <SplitHeading text="Let’s build something." className="contact-title" />
        </div>
        <Reveal as="p" className="contact-blurb" delay={150}>{AVAILABILITY}</Reveal>

        <div className="contact-grid">
          <Reveal className="contact-links" delay={100}>
            <Magnetic strength={0.2}>
              <a href={`mailto:${PROFILE.email}`} className="contact-mail">
                <Mail size={20} aria-hidden="true" />
                <span>{PROFILE.email}</span>
              </a>
            </Magnetic>
            <a href={`tel:${PROFILE.phone.replace(/\s/g, "")}`} className="contact-line">
              <Phone size={17} aria-hidden="true" /> {PROFILE.phone}
            </a>
            <a href={PROFILE.linkedin} className="contact-line" target="_blank" rel="noopener noreferrer">
              <Linkedin size={17} aria-hidden="true" /> LinkedIn profile
            </a>

            <a href={cvFile} download={CV_FILENAME} className="cv-card">
              <span className="cv-card-icon"><FileText size={20} aria-hidden="true" /></span>
              <span className="cv-card-text">
                <span className="cv-card-title">{CV_FILENAME}</span>
                <span className="cv-card-sub">Download full resume</span>
              </span>
              <Download size={18} aria-hidden="true" />
            </a>
          </Reveal>

          <Reveal delay={200}>
            <form className="contact-form" onSubmit={onSubmit} onChange={() => status === "sent" && setStatus("idle")}>
              <input type="hidden" name="_subject" value="New message from your portfolio" />
              <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />

              <label>
                <span>Name</span>
                <input type="text" name="name" required autoComplete="name" placeholder="Your name" />
              </label>
              <label>
                <span>Email</span>
                <input type="email" name="email" required autoComplete="email" placeholder="you@company.com" />
              </label>
              <label>
                <span>Message</span>
                <textarea name="message" rows={4} required placeholder="Tell me about the project" />
              </label>

              <div className="form-foot">
                <Magnetic strength={0.25}>
                  <button type="submit" className="btn btn-signal" disabled={status === "sending"}>
                    {status === "sending" ? "Sending…" : status === "sent" ? "Message sent" : "Send message"}
                  </button>
                </Magnetic>
                <p className={`form-note ${status}`} role="status" aria-live="polite">
                  {status === "sent" && "Thanks, your message is in. I'll get back to you soon."}
                  {status === "error" && `That didn't send. Please email me directly at ${PROFILE.email}.`}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
