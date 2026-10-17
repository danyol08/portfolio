import { useEffect, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { NAV_LINKS, PROFILE, cvFile, CV_FILENAME } from "../data/content.js";
import { useScrollSubscription } from "../hooks/scrollBus.js";
import { Magnetic } from "./ui.jsx";

function goTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  // only re-render when the boolean actually flips
  useScrollSubscription((y) => {
    const next = y > 24;
    setScrolled((prev) => (prev === next ? prev : next));
  });

  // which section is under the middle of the viewport
  useEffect(() => {
    const targets = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    if (!targets.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    targets.forEach((t) => io.observe(t));
    const hero = document.getElementById("hero");
    const heroIo = new IntersectionObserver(([e]) => e.isIntersecting && setActive(""), {
      rootMargin: "-45% 0px -50% 0px",
    });
    if (hero) heroIo.observe(hero);
    return () => {
      io.disconnect();
      heroIo.disconnect();
    };
  }, []);

  // mobile menu: lock page scroll, close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onLink = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    goTo(id);
  };

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <div className="nav-bar">
        <a
          href="#hero"
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            setOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
            history.replaceState(null, "", window.location.pathname);
          }}
          aria-label={`${PROFILE.name}, back to top`}
        >
          <span className="brand-mark" aria-hidden="true">DC</span>
          <span className="brand-name">{PROFILE.name}</span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={onLink(l.id)}
              className={active === l.id ? "is-active" : ""}
              aria-current={active === l.id ? "true" : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <a href={cvFile} download={CV_FILENAME} className="nav-resume">
            <Download size={14} aria-hidden="true" /> Resume
          </a>
          <Magnetic strength={0.28}>
            <a href="#contact" onClick={onLink("contact")} className="btn btn-solid btn-sm">
              Hire me
            </a>
          </Magnetic>
        </div>

        <button
          type="button"
          className="nav-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div id="mobile-menu" className="nav-sheet" aria-hidden={!open}>
        <nav aria-label="Mobile">
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={onLink(l.id)}
              style={{ "--i": i }}
              tabIndex={open ? 0 : -1}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-sheet-foot" style={{ "--i": NAV_LINKS.length }}>
          <a href={cvFile} download={CV_FILENAME} className="btn btn-line-night" tabIndex={open ? 0 : -1}>
            <Download size={16} aria-hidden="true" /> Download resume
          </a>
          <a href={`mailto:${PROFILE.email}`} tabIndex={open ? 0 : -1}>{PROFILE.email}</a>
        </div>
      </div>
    </header>
  );
}
