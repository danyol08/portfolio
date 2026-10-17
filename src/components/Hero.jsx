import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Download, MapPin } from "lucide-react";
import { PROFILE, HERO_COVERS, cvFile, CV_FILENAME } from "../data/content.js";
import { useScrollSubscription, clamp } from "../hooks/scrollBus.js";
import { usePrefersReducedMotion } from "../hooks/useMedia.js";
import { Magnetic } from "./ui.jsx";

/* ---------- capability checks ---------- */

function canUseWebGL() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function isLowPowerDevice() {
  const n = navigator;
  return Boolean(
    (n.hardwareConcurrency && n.hardwareConcurrency <= 2) ||
      (n.deviceMemory && n.deviceMemory <= 2) ||
      n.connection?.saveData
  );
}

/* ---------- 3D stage ---------- */

/** Pure-CSS version of the same composition: used while the WebGL scene loads,
 *  and permanently when WebGL is unavailable, the device is low-powered,
 *  or the visitor prefers reduced motion. */
function StaticDeck({ hidden }) {
  return (
    <div className={`deck ${hidden ? "is-hidden" : ""}`} aria-hidden="true">
      {HERO_COVERS.map((c, i) => (
        <div className="deck-card" key={c.src} style={{ "--i": i }}>
          <img src={c.src} alt="" decoding="async" loading={i === 0 ? "eager" : "lazy"} />
        </div>
      ))}
    </div>
  );
}

function HeroStage({ progressRef }) {
  const reduced = usePrefersReducedMotion();
  const mountRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const wantsWebGL = useMemo(() => !reduced && canUseWebGL() && !isLowPowerDevice(), [reduced]);
  const useGL = wantsWebGL && !failed;

  useEffect(() => {
    if (!useGL || !mountRef.current) return;
    let cancelled = false;
    let dispose = null;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    import("../scene/heroSceneCore.js")
      .then((m) =>
        m.createHeroScene({
          mount: mountRef.current,
          covers: HERO_COVERS,
          progressRef,
          coarse,
          onReady: () => !cancelled && setReady(true),
          onFail: () => !cancelled && setFailed(true),
        })
      )
      .then((d) => {
        if (cancelled) d?.();
        else dispose = d;
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      dispose?.();
      setReady(false);
    };
  }, [useGL, progressRef]);

  return (
    <div className="hero-stage">
      <StaticDeck hidden={useGL && ready} />
      {useGL && <div ref={mountRef} className={`hero-canvas ${ready ? "is-ready" : ""}`} aria-hidden="true" />}
    </div>
  );
}

/* ---------- section ---------- */

export default function Hero() {
  const heroRef = useRef(null);
  const progressRef = useRef({ p: 0, active: true });
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);

  const roles = PROFILE.tagline.split(" · ");
  const nameParts = PROFILE.name.split(" ");

  // Wait for fonts so the masked name reveal doesn't play on fallback metrics.
  useEffect(() => {
    const go = () => setReady(true);
    const t = setTimeout(go, 1400);
    (document.fonts?.ready ?? Promise.resolve()).then(go);
    return () => clearTimeout(t);
  }, []);

  // Scroll position -> 0..1 progress through the pinned section. Written to a ref
  // (for the 3D scene) and a CSS variable (for the copy and the CSS deck): no re-renders.
  useScrollSubscription((y, vh) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const length = el.offsetHeight - vh * 2; // pinned scroll distance
    const scrolled = -rect.top;
    const p = reduced || length <= 0 ? 0 : clamp(scrolled / length);
    progressRef.current.p = p;
    // stop rendering once the next section fully covers the stage
    progressRef.current.active = rect.top < vh && (length <= 0 ? rect.bottom > 0 : scrolled < length + vh);
    el.style.setProperty("--p", p.toFixed(4));
    el.classList.toggle("is-away", p > 0.55);
  });

  const go = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="hero" ref={heroRef} className={`hero ${ready ? "is-ready" : ""}`}>
      <div className="hero-stick">
        <HeroStage progressRef={progressRef} />

        <div className="hero-copy">
          <p className="hero-status">
            <span className="status-dot" aria-hidden="true" />
            Open to work: freelance and full-time
          </p>

          <h1 className="hero-name" aria-label={PROFILE.name}>
            {nameParts.map((part, i) => (
              <span className="hero-line" key={part} aria-hidden="true">
                <span style={{ transitionDelay: `${120 + i * 110}ms` }}>{part}</span>
              </span>
            ))}
          </h1>

          <ul className="hero-roles">
            {roles.map((r, i) => (
              <li key={r} className={i === 0 ? "hero-role-main" : ""}>{r}</li>
            ))}
          </ul>

          <div className="hero-actions">
            <Magnetic>
              <a href="#work" onClick={go("work")} className="btn btn-solid">
                View work <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" onClick={go("contact")} className="btn btn-line">
                Hire me
              </a>
            </Magnetic>
            <a href={cvFile} download={CV_FILENAME} className="hero-cv">
              <Download size={15} aria-hidden="true" /> Download CV
            </a>
          </div>
        </div>

        <p className="hero-loc">
          <MapPin size={14} aria-hidden="true" /> {PROFILE.location}
        </p>

        <button type="button" className="scroll-cue" onClick={go("about")} aria-label="Scroll to About">
          <span className="scroll-cue-line" />
        </button>
      </div>
    </section>
  );
}
