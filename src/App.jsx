import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as THREE from "three";
import {
  Cpu, Boxes, Network, Server, Smartphone, Cloud, Code2, Database, Wrench,
  ShieldCheck, Mail, Phone, Linkedin, ArrowUpRight, Menu, X, MapPin,
  GraduationCap, Award, ChevronRight, ChevronLeft, Radio, Download, FileText,
} from "lucide-react";

// IMPORTING OF PICTURE/SCREENSHOT
import pos1 from './assets/projects/posproject1.png';
import pos2 from './assets/projects/posproject2.png';
import pos3 from './assets/projects/posproject3.png';
import pos4 from './assets/projects/posproject4.png';
import fams1 from './assets/projects/fams1.png';
import fams2 from './assets/projects/fams2.png';
import fams3 from './assets/projects/fams3.png';
import fams4 from './assets/projects/fams4.png';
import fams5 from './assets/projects/fams5.png';
import park1 from './assets/projects/park1.jpg';
import park2 from './assets/projects/park2.jpg';
import park3 from './assets/projects/park3.jpg';
import park4 from './assets/projects/park4.jpg';
import park5 from './assets/projects/park5.jpg';
import odoo1 from './assets/projects/odoo1.png';
import odoo2 from './assets/projects/odoo2.png';
import cvFile from './assets/Daniel_Cruz_CV.pdf';

/* ============================================================
   DATA — edit everything here, layout code never needs touching
   ============================================================ */

const PROFILE = {
  name: "Daniel Cruz",
  tagline: "Full-Stack Software Developer · AI-Assisted Development · Odoo ERP · API Integration",
  location: "Taytay, Rizal, Philippines",
  email: "danielzurc08@gmail.com",
  phone: "+63 920 291 1355",
  linkedin: "https://www.linkedin.com/in/daniel-cruz-1b3441356/",
  summary:
    "IT professional with over a year of hands-on experience delivering software support and custom ERP solutions for business clients. Specializes in Odoo ERP customization, backend API development with FastAPI, and mobile development with Flutter — paired with an AI-assisted development workflow that accelerates delivery without sacrificing code quality. Independently owns system architecture, API integration, and end-to-end deployment. Backed by a strong networking and hardware foundation, and now available as a freelance developer for ERP customization, AI-assisted system development, API integration, and IT support projects.",
};

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

const SKILL_GROUPS = [
  { category: "AI-Assisted Development", icon: Cpu, items: ["Claude", "Claude Code", "Rapid Prototyping", "Architecture Ownership"] },
  { category: "ERP Development", icon: Boxes, items: ["Odoo 19", "Custom Modules", "Workflow Automation"] },
  { category: "API Integration", icon: Network, items: ["REST APIs", "Auth & Data Flow", "Third-Party Services"] },
  { category: "Backend Development", icon: Server, items: ["FastAPI", "Python"] },
  { category: "Mobile Development", icon: Smartphone, items: ["Flutter", "Dart"] },
  { category: "Deployment & Hosting", icon: Cloud, items: ["Vercel", "Netlify"] },
  { category: "Languages & Scripting", icon: Code2, items: ["Python", "VB.NET", "PHP", "HTML", "CSS"] },
  { category: "Database Management", icon: Database, items: ["MySQL", "PostgreSQL"] },
  { category: "Tools & Platforms", icon: Wrench, items: ["XAMPP", "Visual Studio", "VS Code", "Git", "DBeaver", "MySQL Workbench"] },
  { category: "Networking & Hardware", icon: Radio, items: ["LAN / WAN Setup", "Router & Switch Config", "Cable Crimping", "IP Troubleshooting"] },
  { category: "Systems & Security", icon: ShieldCheck, items: ["CCTV Install & Config", "RG6 Coaxial Cable", "DVR Systems"] },
];

const EXPERIENCE = [
  {
    role: "Software Support Specialist",
    company: "Barcotech Philippines Inc.",
    period: "Aug 2025 — Present",
    points: [
      "Diagnose and resolve software issues across client systems, minimizing downtime.",
      "Design and deploy custom software solutions using an AI-assisted workflow (front-end + back-end).",
      "Independently plan system architecture and manage API integration.",
      "Customize and extend Odoo ERP (v19) through module development and configuration.",
      "Built a custom Fixed Asset Management module for Odoo 19 (tracking, depreciation, asset management).",
      "Deployed and hosted web applications on Vercel and Netlify for client projects.",
    ],
  },
  {
    role: "IT Support Intern",
    company: "Seven Dragons Food Galore Inc.",
    period: "Jan 2025 — Apr 2025",
    points: [
      "Hands-on technical support across a large fleet of desktops and laptops.",
      "Diagnosed and resolved internet connectivity issues.",
      "Maintained and repaired printers.",
      "Installed and configured CCTV systems (RG6 coaxial cable).",
    ],
  },
  {
    role: "Waiter",
    company: "Priva Club, Cainta",
    period: "2023 — 2025",
    points: ["Customer service in a fast-paced environment."],
  },
];

// Edit this array to swap in real projects — image, title, description, tags, link.
const PROJECTS = [
  { id: 1, title: "Nail Salon Transaction Monitoring System", context: "Freelance Project", description: "A web-based transaction monitoring system developed to help nail salon businesses efficiently track, record, and manage daily sales and service transactions. The system centralizes transaction data, provides real-time visibility into revenue and service performance, and reduces the manual effort involved in bookkeeping — enabling business owners to make faster, more informed decisions.", tags: ["Flutter - Dart", "Supabase", "PostgreSQL"], link: "#", images: [pos1, pos2, pos3, pos4] },
  { id: 2, title: "Fixed Asset Management System", context: "Develop at Barcotech Philippines Inc.", description: "A web-based system designed to help organizations efficiently track, manage, and monitor their fixed assets throughout their lifecycle. The system integrates barcode technology to simplify asset identification and tracking — allowing quick scanning for asset registration, verification, and audits. It centralizes asset records and provides better visibility into asset status, location, and value, helping reduce losses, improve accountability, and support more accurate financial and operational decision-making.", tags: ["Flutter-Dart", "FastAPI", "Postgressql"], link: "#", images: [fams1, fams2, fams3, fams4, fams5] },
  { id: 3, title: "Parking Monitoring System", context: "Develop at Barcotech Philippines Inc.", description: "An automated parking management platform built to streamline vehicle entry and exit monitoring in parking facilities. Upon check-in, the system generates a unique QR code-based parking ticket linked to the vehicle's plate number, which is scanned upon exit to process checkout. It features an admin dashboard that provides real-time visibility into currently parked vehicles, complete transaction history, revenue reports, and guard accountability tracking — enabling better oversight of daily parking operations.", tags: ["Flutter-Dart", "PostgreSQL", "FastAPI"], link: "#", images: [park1, park2, park3, park4, park5] },
  { id: 4, title: "Odoo Custom Module", context: "Develop at Barcotech Philippines Inc.", description: "A custom-developed Odoo module built to extend the platform's capabilities for tracking, managing, and monitoring company fixed assets. Designed to integrate seamlessly with Odoo's existing framework, the module centralizes asset records and automates key processes involved in the asset lifecycle — from registration to disposal — helping organizations improve accountability, accuracy, and efficiency in asset management.", tags: ["Python", "XML", "JavaScript", "Odoo SH"], link: "#", images: [odoo1, odoo2] },
];

const EDUCATION = {
  degree: "Bachelor of Science in Information Technology",
  school: "University of Rizal System, Binangonan",
  period: "2021 — 2025",
};

const CERTIFICATIONS = ["Cisco Computer Hardware Basics", "Cisco Networking Basics"];

// Sign up free at formspree.io, create a form, then paste your form ID below
// (replace YOUR_FORM_ID — looks like https://formspree.io/f/abcdwxyz)
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mbgrzgjl";

/* ============================================================
   HOOKS
   ============================================================ */

function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  return reduced;
}

/* ============================================================
   3D NODE NETWORK — the site's signature element.
   A field of points connected like a live integration graph
   (APIs / ERP modules / AI calls talking to each other),
   drifting in space and tilting toward the cursor.
   ============================================================ */

function NodeNetwork({ density = 70, linkDistance = 2.6, interactive = true, className = "" }) {
  const mountRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isSmall = window.innerWidth < 640;
    const effectiveDensity = reducedMotion ? Math.round(density * 0.3) : isSmall ? Math.round(density * 0.55) : density;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090c11, 0.035);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 9.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall ? 1.5 : 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const starGroup = new THREE.Group();
    scene.add(starGroup);

    // ---- Distant starfield for parallax depth ----
    const starCount = isSmall ? 90 : 180;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const STAR_TEAL = new THREE.Color(0x3ee8c8);
    const STAR_BLUE = new THREE.Color(0x5b8cff);
    for (let i = 0; i < starCount; i++) {
      const r = 14 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);
      const c = STAR_TEAL.clone().lerp(STAR_BLUE, Math.random());
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    starGroup.add(stars);

    const TEAL = new THREE.Color(0x3ee8c8);
    const BLUE = new THREE.Color(0x5b8cff);
    const WHITE = new THREE.Color(0xd8fff5);

    // ---- Node positions inside a soft spherical volume ----
    const nodeCount = effectiveDensity;
    const radius = 4.6;
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);
    const sizes = new Float32Array(nodeCount);

    for (let i = 0; i < nodeCount; i++) {
      const r = radius * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Gradient: teal near the "bottom", blue near the "top", with a few brighter hero nodes
      const mixT = (y / radius + 1) / 2;
      const c = TEAL.clone().lerp(BLUE, mixT);
      if (Math.random() < 0.08) c.lerp(WHITE, 0.6);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = Math.random() < 0.12 ? 1.8 : 1;
    }

    function buildPointGeo() {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      return g;
    }

    // Soft halo layer behind the nodes (cheap fake-bloom via large, faint, additive points)
    const haloGeo = buildPointGeo();
    const haloMat = new THREE.PointsMaterial({
      size: 0.34,
      vertexColors: true,
      transparent: true,
      opacity: 0.17,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const halo = new THREE.Points(haloGeo, haloMat);
    group.add(halo);

    // Crisp node layer on top
    const pointGeo = buildPointGeo();
    const pointMat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(pointGeo, pointMat);
    group.add(points);

    // ---- Connect nearby nodes with thin gradient lines ----
    const linePositions = [];
    const lineColors = [];
    const edges = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < linkDistance) {
          linePositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          );
          lineColors.push(
            colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2],
            colors[j * 3], colors[j * 3 + 1], colors[j * 3 + 2]
          );
          edges.push(i, j);
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePositions), 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(lineColors), 3));
    const lineMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);

    // ---- Traveling "data pulse" points along a handful of edges ----
    const pulseCount = reducedMotion ? 0 : Math.min(10, Math.floor(edges.length / 2 / 4));
    const pulseGeo = new THREE.BufferGeometry();
    const pulsePositions = new Float32Array(pulseCount * 3);
    const pulseColors = new Float32Array(pulseCount * 3);
    const pulseState = [];
    for (let p = 0; p < pulseCount; p++) {
      const edgeIdx = Math.floor(Math.random() * (edges.length / 2)) * 2;
      pulseState.push({
        a: edges[edgeIdx],
        b: edges[edgeIdx + 1],
        t: Math.random(),
        speed: 0.15 + Math.random() * 0.2,
      });
      pulseColors[p * 3] = WHITE.r;
      pulseColors[p * 3 + 1] = WHITE.g;
      pulseColors[p * 3 + 2] = WHITE.b;
    }
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePositions, 3));
    pulseGeo.setAttribute("color", new THREE.BufferAttribute(pulseColors, 3));
    const pulseMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const pulses = new THREE.Points(pulseGeo, pulseMat);
    if (pulseCount > 0) group.add(pulses);

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    function handlePointerMove(e) {
      const rect = mount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      target.x = x * 0.35;
      target.y = y * 0.35;
    }
    if (interactive && !reducedMotion) {
      mount.addEventListener("pointermove", handlePointerMove);
    }

    let scrollFactor = 0;
    function handleScroll() {
      scrollFactor = Math.min(window.scrollY / 1200, 1);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

    let raf;
    let t = 0;
    function animate() {
      raf = requestAnimationFrame(animate);
      t += reducedMotion ? 0.0009 : 0.0022;
      current.x += (target.y - current.x) * 0.04;
      current.y += (target.x - current.y) * 0.04;
      group.rotation.x = current.x + t * 0.35 + scrollFactor * 0.6;
      group.rotation.y = current.y + t * 0.5 + scrollFactor * 0.9;
      starGroup.rotation.x = current.x * 0.3 + t * 0.08 + scrollFactor * 0.15;
      starGroup.rotation.y = current.y * 0.3 + t * 0.12 + scrollFactor * 0.22;

      // Subtle cinematic camera breathing
      camera.position.z = 9.2 + Math.sin(t * 0.6) * 0.18;

      // Advance data pulses along their edges
      if (pulseCount > 0) {
        const posAttr = pulseGeo.attributes.position;
        for (let p = 0; p < pulseCount; p++) {
          const st = pulseState[p];
          st.t += st.speed * 0.01;
          if (st.t > 1) {
            st.t = 0;
            const edgeIdx = Math.floor(Math.random() * (edges.length / 2)) * 2;
            st.a = edges[edgeIdx];
            st.b = edges[edgeIdx + 1];
          }
          const ax = positions[st.a * 3], ay = positions[st.a * 3 + 1], az = positions[st.a * 3 + 2];
          const bx = positions[st.b * 3], by = positions[st.b * 3 + 1], bz = positions[st.b * 3 + 2];
          posAttr.array[p * 3] = ax + (bx - ax) * st.t;
          posAttr.array[p * 3 + 1] = ay + (by - ay) * st.t;
          posAttr.array[p * 3 + 2] = az + (bz - az) * st.t;
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    }
    animate();

    function handleResize() {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      if (interactive) mount.removeEventListener("pointermove", handlePointerMove);
      haloGeo.dispose();
      haloMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      pointGeo.dispose();
      pointMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      pulseGeo.dispose();
      pulseMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [density, linkDistance, interactive, reducedMotion]);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}

/* ============================================================
   UI PRIMITIVES
   ============================================================ */

function Reveal({ children, className = "", as: Tag = "div", delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "reveal-in" : ""} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}

function Eyebrow({ children }) {
  return <div className="eyebrow">{children}</div>;
}

function SectionHeading({ eyebrow, title, blurb }) {
  return (
    <Reveal className="section-heading">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="section-title">{title}</h2>
      {blurb && <p className="section-blurb">{blurb}</p>}
    </Reveal>
  );
}

/* ============================================================
   NAVBAR
   ============================================================ */

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-inner">
        <a href="#hero" onClick={handleClick("hero")} className="brand">
          <span className="brand-mark" />
          <span>Daniel Cruz</span>
        </a>
        <nav className="nav-links">
          {NAV_LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={handleClick(l.id)}>
              {l.label}
            </a>
          ))}
          <a href={cvFile} download="Daniel_Cruz_CV.pdf" className="nav-resume">
            <Download size={14} /> Resume
          </a>
          <a href="#contact" onClick={handleClick("contact")} className="btn btn-primary btn-sm">
            Hire Me
          </a>
        </nav>
        <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="nav-mobile">
          {NAV_LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={handleClick(l.id)}>
              {l.label}
            </a>
          ))}
          <a href={cvFile} download="Daniel_Cruz_CV.pdf" className="nav-resume nav-resume-mobile">
            <Download size={15} /> Download Resume
          </a>
          <a href="#contact" onClick={handleClick("contact")} className="btn btn-primary btn-sm">
            Hire Me
          </a>
        </div>
      )}
    </header>
  );
}

/* ============================================================
   HERO
   ============================================================ */

function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleClick = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="hero">
      <div className="hero-glow" />
      <div className="hero-content">
        <div className={`hero-line ${loaded ? "hero-line-in" : ""}`} style={{ transitionDelay: "0ms" }}>
          <span className="status-badge">
            <span className="status-dot" />
            Open to Work — Freelance &amp; Full-Time
          </span>
        </div>
        <div className={`hero-line ${loaded ? "hero-line-in" : ""}`} style={{ transitionDelay: "60ms" }}>
          <span className="eyebrow eyebrow-hero">
            <MapPin size={13} /> {PROFILE.location}
          </span>
        </div>
        <h1 className={`hero-line hero-title ${loaded ? "hero-line-in" : ""}`} style={{ transitionDelay: "160ms" }}>
          {PROFILE.name}
        </h1>
        <p className={`hero-line hero-tagline ${loaded ? "hero-line-in" : ""}`} style={{ transitionDelay: "260ms" }}>
          {PROFILE.tagline}
        </p>
        <div className={`hero-line hero-actions ${loaded ? "hero-line-in" : ""}`} style={{ transitionDelay: "360ms" }}>
          <a href="#work" onClick={handleClick("work")} className="btn btn-primary">
            View Work <ArrowUpRight size={16} />
          </a>
          <a href="#contact" onClick={handleClick("contact")} className="btn btn-ghost">
            Hire Me
          </a>
          <a href={cvFile} download="Daniel_Cruz_CV.pdf" className="btn btn-outline">
            <Download size={16} /> Download CV
          </a>
        </div>
      </div>
      <button className="scroll-cue" onClick={handleClick("about")} aria-label="Scroll to About">
        <span />
      </button>
    </section>
  );
}

/* ============================================================
   ABOUT
   ============================================================ */

function About() {
  return (
    <section id="about" className="section">
      <div className="section-inner about-grid">
        <SectionHeading eyebrow="About" title="An engineer who treats AI as a teammate, not a shortcut." />
        <Reveal delay={100} className="about-body">
          <p>{PROFILE.summary}</p>
          <div className="about-pillars">
            <div className="pillar">
              <Cpu size={18} className="pillar-icon" />
              <div>
                <h3>AI-assisted, not AI-replaced</h3>
                <p>Claude and Claude Code accelerate the boilerplate; architecture, integration, and quality checks stay in human hands.</p>
              </div>
            </div>
            <div className="pillar">
              <Boxes size={18} className="pillar-icon" />
              <div>
                <h3>ERP-native thinking</h3>
                <p>Odoo customization means reasoning about real business workflows, not just writing code in isolation.</p>
              </div>
            </div>
            <div className="pillar">
              <Network size={18} className="pillar-icon" />
              <div>
                <h3>Full-stack ownership</h3>
                <p>From LAN cabling to REST APIs to deployment — comfortable across the entire stack a small business actually runs on.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   SKILLS
   ============================================================ */

function SkillCard({ group, index }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * -8, ry: px * 10 });
  }, []);

  const reset = useCallback(() => setTilt({ rx: 0, ry: 0 }), []);
  const Icon = group.icon;

  return (
    <Reveal delay={(index % 3) * 80}>
      <div
        ref={cardRef}
        className="skill-card"
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ transform: `perspective(700px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
      >
        <div className="skill-card-icon">
          <Icon size={18} />
        </div>
        <h3>{group.category}</h3>
        <div className="skill-tags">
          {group.items.map((item) => (
            <span key={item} className="tag tag-mono">{item}</span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function Skills() {
  return (
    <section id="skills" className="section section-alt">
      <div className="section-inner">
        <SectionHeading
          eyebrow="Skills"
          title="A toolkit built for connecting systems"
          blurb="Grouped the way they get used on a real engagement — from AI-assisted scaffolding down to the router that keeps the office online."
        />
        <div className="skill-grid">
          {SKILL_GROUPS.map((group, i) => (
            <SkillCard group={group} index={i} key={group.category} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   EXPERIENCE — vertical timeline
   ============================================================ */

function Experience() {
  return (
    <section id="experience" className="section">
      <div className="section-inner">
        <SectionHeading eyebrow="Experience" title="Where the work happened" />
        <div className="timeline">
          {EXPERIENCE.map((role, i) => (
            <Reveal key={role.role} delay={i * 100} className="timeline-item">
              <div className="timeline-marker">
                <span className="timeline-dot" />
                {i !== EXPERIENCE.length - 1 && <span className="timeline-line" />}
              </div>
              <div className="timeline-card">
                <span className="timeline-period tag-mono">{role.period}</span>
                <h3>{role.role}</h3>
                <p className="timeline-company">{role.company}</p>
                <ul>
                  {role.points.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PROJECTS
   ============================================================ */

function Lightbox({ images, index, title, onClose, onPrev, onNext }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close preview" type="button">
        <X size={22} />
      </button>
      {images.length > 1 && (
        <button
          className="lightbox-nav lightbox-nav-left"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="Previous screenshot"
          type="button"
        >
          <ChevronLeft size={26} />
        </button>
      )}
      <img
        src={images[index]}
        alt={`${title} — screenshot ${index + 1}`}
        className="lightbox-image"
        onClick={(e) => e.stopPropagation()}
      />
      {images.length > 1 && (
        <button
          className="lightbox-nav lightbox-nav-right"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Next screenshot"
          type="button"
        >
          <ChevronRight size={26} />
        </button>
      )}
      {images.length > 1 && (
        <div className="lightbox-counter">{index + 1} / {images.length}</div>
      )}
    </div>
  );
}

function ProjectImageCarousel({ images, title, projectId, index, onIndexChange, onExpand }) {
  const hasImages = images && images.length > 0;
  const hasMultiple = hasImages && images.length > 1;

  const goPrev = (e) => {
    e.stopPropagation();
    onIndexChange((index - 1 + images.length) % images.length);
  };
  const goNext = (e) => {
    e.stopPropagation();
    onIndexChange((index + 1) % images.length);
  };

  if (!hasImages) {
    return (
      <div className="project-image-placeholder">
        <span>{String(projectId).padStart(2, "0")}</span>
      </div>
    );
  }

  return (
    <div className="project-carousel">
      <img
        src={images[index]}
        alt={`${title} — screenshot ${index + 1}`}
        onClick={onExpand}
        className="carousel-image-clickable"
      />
      {hasMultiple && (
        <>
          <button className="carousel-arrow carousel-arrow-left" onClick={goPrev} aria-label="Previous screenshot" type="button">
            <ChevronLeft size={18} />
          </button>
          <button className="carousel-arrow carousel-arrow-right" onClick={goNext} aria-label="Next screenshot" type="button">
            <ChevronRight size={18} />
          </button>
          <div className="carousel-dots">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`carousel-dot ${i === index ? "carousel-dot-active" : ""}`}
                aria-label={`Go to screenshot ${i + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onIndexChange(i);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [imgIndex, setImgIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const images = project.images || [];

  const handleMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * -6, ry: px * 8 });
  }, []);
  const reset = useCallback(() => setTilt({ rx: 0, ry: 0 }), []);

  return (
    <>
      <Reveal delay={(index % 2) * 100}>
        <div
          ref={cardRef}
          className="project-card"
          onMouseMove={handleMove}
          onMouseLeave={reset}
          style={{ transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
        >
          <div className="project-image">
            <ProjectImageCarousel
              images={images}
              title={project.title}
              projectId={project.id}
              index={imgIndex}
              onIndexChange={setImgIndex}
              onExpand={() => setLightboxOpen(true)}
            />
          </div>
          <div className="project-body">
            {project.context && <span className="project-context tag-mono">{project.context}</span>}
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-tags">
              {project.tags.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
      {lightboxOpen && images.length > 0 && (
        <Lightbox
          images={images}
          index={imgIndex}
          title={project.title}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
          onNext={() => setImgIndex((i) => (i + 1) % images.length)}
        />
      )}
    </>
  );
}

function Projects() {
  return (
    <section id="work" className="section section-alt">
      <div className="section-inner">
        <SectionHeading
          eyebrow="Selected Work"
          title="Portfolio"
          blurb="Placeholder cards, wired to a single data array — swap in real screenshots and links without touching layout code."
        />
        <div className="project-grid">
          {PROJECTS.map((p, i) => (
            <ProjectCard project={p} index={i} key={p.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   EDUCATION & CERTIFICATIONS
   ============================================================ */

function EducationSection() {
  return (
    <section id="education" className="section">
      <div className="section-inner">
        <SectionHeading eyebrow="Education & Certifications" title="Foundations" />
        <div className="edu-grid">
          <Reveal className="edu-card">
            <GraduationCap size={20} className="edu-icon" />
            <div>
              <h3>{EDUCATION.degree}</h3>
              <p className="timeline-company">{EDUCATION.school}</p>
              <span className="tag-mono edu-period">{EDUCATION.period}</span>
            </div>
          </Reveal>
          <Reveal delay={100} className="edu-card">
            <Award size={20} className="edu-icon" />
            <div>
              <h3>Certifications</h3>
              <ul className="cert-list">
                {CERTIFICATIONS.map((c) => (
                  <li key={c}>
                    <ChevronRight size={14} /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CONTACT
   ============================================================ */

function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    const form = e.target;
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
    <section id="contact" className="section section-contact">
      <div className="section-inner contact-grid">
        <Reveal className="contact-info">
          <Eyebrow>Contact</Eyebrow>
          <h2 className="section-title">Let's build something.</h2>
          <p className="section-blurb">
            Available for freelance custom software development, ERP customization, AI-assisted system development, API integration, and IT support projects.
          </p>
          <div className="contact-links">
            <a href={`mailto:${PROFILE.email}`} className="contact-link">
              <Mail size={16} /> {PROFILE.email}
            </a>
            <a href={`tel:${PROFILE.phone.replace(/\s/g, "")}`} className="contact-link">
              <Phone size={16} /> {PROFILE.phone}
            </a>
            <a href={PROFILE.linkedin} className="contact-link">
              <Linkedin size={16} /> LinkedIn Profile
            </a>
          </div>
          <a href={cvFile} download="Daniel_Cruz_CV.pdf" className="cv-card">
            <span className="cv-card-icon"><FileText size={20} /></span>
            <span className="cv-card-text">
              <span className="cv-card-title">Daniel_Cruz_CV.pdf</span>
              <span className="cv-card-sub">Download full resume</span>
            </span>
            <span className="cv-card-download"><Download size={17} /></span>
          </a>
        </Reveal>
        <Reveal delay={120} className="contact-form-wrap">
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input type="text" name="name" required placeholder="Your name" />
            </label>
            <label>
              Email
              <input type="email" name="email" required placeholder="you@company.com" />
            </label>
            <label>
              Message
              <textarea name="message" rows={4} required placeholder="Tell me about the project..." />
            </label>
            <button type="submit" className="btn btn-primary" disabled={status === "sending" || status === "sent"}>
              {status === "sending" ? "Sending..." : status === "sent" ? "Message sent" : "Send Message"}
            </button>
            {status === "sent" && (
              <p className="form-note form-note-success">Thanks — your message was sent. I'll get back to you soon.</p>
            )}
            {status === "error" && (
              <p className="form-note form-note-error">Something went wrong sending this. Please email me directly at {PROFILE.email}.</p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */

function Footer() {
  return (
    <footer className="footer">
      <div className="section-inner footer-inner">
        <span>© {new Date().getFullYear()} {PROFILE.name}.</span>
        <div className="footer-links">
          <a href={`mailto:${PROFILE.email}`}>Email</a>
          <a href={PROFILE.linkedin}>LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   APP
   ============================================================ */

export default function App() {
  return (
    <div className="site">
      <GlobalStyles />
      <NodeNetwork density={95} linkDistance={2.4} className="global-canvas" />
      <div className="site-content">
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <EducationSection />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

      :root {
        --bg: #090c11;
        --bg-elevated: #0d1218;
        --surface: #121822;
        --surface-2: #161e2a;
        --border: #212b38;
        --teal: #3ee8c8;
        --blue: #5b8cff;
        --text: #e7edf5;
        --text-muted: #8a97ac;
        --radius: 14px;
        --font-display: 'Space Grotesk', ui-sans-serif, sans-serif;
        --font-body: 'Inter', ui-sans-serif, sans-serif;
        --font-mono: 'JetBrains Mono', ui-monospace, monospace;
      }

      .site {
        background: var(--bg);
        color: var(--text);
        font-family: var(--font-body);
        overflow-x: hidden;
        position: relative;
      }
      .site-content {
        position: relative;
        z-index: 1;
      }
      .global-canvas {
        position: fixed;
        inset: 0;
        z-index: 0;
        opacity: 0.7;
        pointer-events: none;
      }
      @media (max-width: 640px) {
        .global-canvas { opacity: 0.5; }
      }
      .site * { box-sizing: border-box; }
      .site h1, .site h2, .site h3 { font-family: var(--font-display); letter-spacing: -0.01em; margin: 0; }
      .site p { margin: 0; color: var(--text-muted); line-height: 1.65; }
      .site a { text-decoration: none; color: inherit; }
      .site ::selection { background: rgba(62,232,200,0.28); color: #fff; }
      .site button { font-family: inherit; cursor: pointer; }
      .site :focus-visible { outline: 2px solid var(--teal); outline-offset: 3px; }

      .section-inner { max-width: 1120px; margin: 0 auto; padding: 0 24px; }
      .section { position: relative; padding: 112px 0; }
      .section-alt { background: linear-gradient(180deg, transparent, rgba(91,140,255,0.035), transparent); }

      .reveal { opacity: 0; transform: translateY(22px); transition: opacity 0.7s ease, transform 0.7s ease; }
      .reveal-in { opacity: 1; transform: translateY(0); }
      @media (prefers-reduced-motion: reduce) {
        .reveal { transition: none; opacity: 1; transform: none; }
      }

      .eyebrow {
        display: inline-flex; align-items: center; gap: 6px;
        font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em;
        text-transform: uppercase; color: var(--teal);
      }
      .eyebrow-hero { color: rgba(231,237,245,0.7); }

      .status-badge {
        display: inline-flex; align-items: center; gap: 8px;
        font-family: var(--font-mono); font-size: 12px; font-weight: 500; letter-spacing: 0.02em;
        color: var(--teal); background: rgba(62,232,200,0.09);
        border: 1px solid rgba(62,232,200,0.3); border-radius: 999px;
        padding: 6px 14px 6px 10px; margin-bottom: 4px;
      }
      .status-dot {
        position: relative; width: 7px; height: 7px; border-radius: 50%;
        background: var(--teal); flex-shrink: 0;
      }
      .status-dot::after {
        content: ""; position: absolute; inset: -4px; border-radius: 50%;
        border: 1.5px solid var(--teal); animation: statusPulse 1.8s ease-out infinite;
      }
      @keyframes statusPulse {
        0% { transform: scale(0.6); opacity: 0.9; }
        100% { transform: scale(1.8); opacity: 0; }
      }
      @media (prefers-reduced-motion: reduce) {
        .status-dot::after { animation: none; opacity: 0.4; }
      }
      @media (max-width: 640px) {
        .status-badge { font-size: 11px; padding: 5px 12px 5px 9px; }
      }

      .section-heading { margin-bottom: 44px; max-width: 640px; }
      .section-title { font-size: clamp(28px, 4vw, 40px); font-weight: 700; margin-top: 10px; }
      .section-blurb { margin-top: 14px; font-size: 16px; max-width: 560px; }

      /* Navbar */
      .navbar {
        position: fixed; top: 0; left: 0; right: 0; z-index: 50;
        transition: background 0.3s ease, border-color 0.3s ease;
        border-bottom: 1px solid transparent;
      }
      .navbar-scrolled { background: rgba(9,12,17,0.82); backdrop-filter: blur(14px); border-color: var(--border); }
      .navbar-inner {
        max-width: 1120px; margin: 0 auto; padding: 16px 24px;
        display: flex; align-items: center; justify-content: space-between;
      }
      .brand { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 600; font-size: 15px; }
      .brand-mark { width: 9px; height: 9px; border-radius: 2px; background: var(--teal); box-shadow: 0 0 12px var(--teal); }
      .nav-links { display: none; align-items: center; gap: 28px; font-size: 14px; color: var(--text-muted); }
      .nav-links a:hover { color: var(--text); }
      .nav-toggle { display: inline-flex; background: none; border: none; color: var(--text); }
      @media (min-width: 900px) {
        .nav-links { display: flex; }
        .nav-toggle { display: none; }
      }
      .nav-mobile { display: flex; flex-direction: column; gap: 4px; padding: 8px 24px 20px; background: rgba(9,12,17,0.96); border-bottom: 1px solid var(--border); }
      .nav-mobile a { padding: 10px 0; font-size: 15px; color: var(--text-muted); border-bottom: 1px solid rgba(255,255,255,0.04); }
      .nav-mobile .btn { margin-top: 10px; justify-content: center; }

      /* Buttons */
      .btn {
        display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600;
        padding: 12px 20px; border-radius: 999px; border: 1px solid transparent; transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
      }
      .btn-sm { padding: 9px 16px; font-size: 13px; }
      .btn-primary { background: linear-gradient(135deg, var(--teal), var(--blue)); color: #06110e; box-shadow: 0 0 0 rgba(62,232,200,0); }
      .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 28px -8px rgba(62,232,200,0.55); }
      .btn-ghost { border-color: var(--border); color: var(--text); background: rgba(255,255,255,0.02); }
      .btn-ghost:hover { border-color: var(--teal); color: var(--teal); transform: translateY(-2px); }
      .btn-outline {
        border-color: rgba(62,232,200,0.4); color: var(--teal); background: rgba(62,232,200,0.06);
      }
      .btn-outline:hover { border-color: var(--teal); background: rgba(62,232,200,0.14); transform: translateY(-2px); }
      .nav-resume {
        display: inline-flex; align-items: center; gap: 6px; font-size: 13.5px; color: var(--text-muted);
        padding: 7px 12px; border-radius: 999px; border: 1px solid var(--border); transition: border-color 0.2s ease, color 0.2s ease;
      }
      .nav-resume:hover { color: var(--teal); border-color: rgba(62,232,200,0.4); }
      .nav-resume-mobile { justify-content: center; margin-top: 4px; }
      .btn:disabled { opacity: 0.7; cursor: default; transform: none; }

      /* Hero */
      .hero {
        position: relative; min-height: 100vh; display: flex; flex-direction: column;
        align-items: center; justify-content: center; text-align: center; padding: 140px 24px 80px;
        overflow: hidden;
      }
      .hero-glow {
        position: absolute; inset: 0; z-index: 0; pointer-events: none;
        background: radial-gradient(60% 50% at 50% 30%, rgba(62,232,200,0.10), transparent 70%),
                    radial-gradient(40% 40% at 70% 70%, rgba(91,140,255,0.08), transparent 70%);
      }
      .hero-content { position: relative; z-index: 1; max-width: 780px; }
      .hero-line { opacity: 0; transform: translateY(18px); transition: opacity 0.7s ease, transform 0.7s ease; }
      .hero-line-in { opacity: 1; transform: translateY(0); }
      .hero-title { font-size: clamp(40px, 7vw, 72px); font-weight: 700; margin: 18px 0 14px; line-height: 1.04; }
      .hero-tagline { font-size: clamp(15px, 2vw, 18px); color: var(--text-muted); max-width: 560px; margin: 0 auto; }
      .hero-actions { display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 34px; flex-wrap: wrap; }

      .scroll-cue {
        position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
        width: 26px; height: 42px; border-radius: 999px; border: 1px solid var(--border);
        background: none; z-index: 1;
      }
      .scroll-cue span { display: block; width: 4px; height: 8px; margin: 8px auto 0; border-radius: 2px; background: var(--teal); animation: scrollDot 1.8s ease-in-out infinite; }
      @keyframes scrollDot { 0%,100% { transform: translateY(0); opacity: 1; } 50% { transform: translateY(12px); opacity: 0.3; } }

      /* About */
      .about-grid { }
      .about-body p { font-size: 16px; max-width: 760px; margin-bottom: 40px; }
      .about-pillars { display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
      .pillar { display: flex; gap: 14px; padding: 20px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); }
      .pillar-icon { color: var(--teal); flex-shrink: 0; margin-top: 3px; }
      .pillar h3 { font-size: 15px; margin-bottom: 6px; }
      .pillar p { font-size: 13.5px; }

      /* Skills */
      .skill-grid { display: grid; gap: 18px; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); align-items: stretch; }
      .skill-card {
        background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
        padding: 22px; transition: border-color 0.25s ease, box-shadow 0.25s ease;
        display: flex; flex-direction: column; height: 100%;
      }
      .skill-card:hover { border-color: rgba(62,232,200,0.4); box-shadow: 0 16px 40px -20px rgba(62,232,200,0.35); }
      .skill-card-icon {
        width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
        background: rgba(62,232,200,0.1); color: var(--teal); margin-bottom: 14px;
      }
      .skill-card h3 { font-size: 15px; margin-bottom: 12px; }
      .skill-tags { display: flex; flex-wrap: wrap; gap: 6px; }

      .tag {
        font-size: 11.5px; padding: 5px 10px; border-radius: 999px; border: 1px solid var(--border);
        color: var(--text-muted); background: rgba(255,255,255,0.02);
      }
      .tag-mono { font-family: var(--font-mono); }

      /* Timeline */
      .timeline { margin-top: 10px; }
      .timeline-item { display: grid; grid-template-columns: 24px 1fr; gap: 20px; }
      .timeline-marker { display: flex; flex-direction: column; align-items: center; }
      .timeline-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--teal); box-shadow: 0 0 0 4px rgba(62,232,200,0.15); margin-top: 6px; flex-shrink: 0; }
      .timeline-line { flex: 1; width: 1px; background: var(--border); margin-top: 4px; }
      .timeline-card { padding-bottom: 44px; }
      .timeline-period { display: inline-block; font-size: 12px; color: var(--teal); margin-bottom: 8px; }
      .timeline-card h3 { font-size: 19px; margin-bottom: 3px; }
      .timeline-company { font-size: 14px; color: var(--text-muted); margin-bottom: 12px; }
      .timeline-card ul { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 6px; }
      .timeline-card li { font-size: 14.5px; color: var(--text-muted); line-height: 1.6; }

      /* Projects */
      .project-grid { display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); align-items: stretch; }
      .project-card {
        background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
        overflow: hidden; transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
        display: flex; flex-direction: column; height: 100%;
      }
      .project-card:hover { border-color: rgba(91,140,255,0.4); box-shadow: 0 20px 48px -22px rgba(91,140,255,0.4); transform: translateY(-3px); }
      .project-image { aspect-ratio: 16/10; overflow: hidden; position: relative; flex-shrink: 0; }
      .project-image::after {
        content: ""; position: absolute; inset: 0; pointer-events: none;
        background: linear-gradient(180deg, transparent 60%, rgba(9,12,17,0.5) 100%);
      }
      .project-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
      .project-card:hover .project-image img { transform: scale(1.05); }
      .project-carousel { position: relative; width: 100%; height: 100%; }
      .project-carousel img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
      .project-card:hover .project-carousel img { transform: scale(1.05); }
      .carousel-image-clickable { cursor: zoom-in; }
      .carousel-arrow {
        position: absolute; top: 50%; transform: translateY(-50%);
        width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.18);
        background: rgba(9,12,17,0.55); backdrop-filter: blur(6px); color: #fff;
        display: flex; align-items: center; justify-content: center; z-index: 1;
        opacity: 0; transition: opacity 0.2s ease, background 0.2s ease;
      }
      .project-carousel:hover .carousel-arrow { opacity: 1; }
      .carousel-arrow:hover { background: rgba(62,232,200,0.35); }
      .carousel-arrow-left { left: 10px; }
      .carousel-arrow-right { right: 10px; }
      .carousel-dots {
        position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); z-index: 1;
        display: flex; gap: 6px; padding: 5px 8px; border-radius: 999px;
        background: rgba(9,12,17,0.5); backdrop-filter: blur(4px);
      }
      .carousel-dot { width: 6px; height: 6px; border-radius: 50%; border: none; background: rgba(255,255,255,0.35); padding: 0; }
      .carousel-dot-active { background: var(--teal); width: 16px; border-radius: 3px; }
      @media (hover: none) {
        .carousel-arrow { opacity: 0.85; }
      }
      .project-image-placeholder {
        width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg, rgba(62,232,200,0.16), rgba(91,140,255,0.16));
      }
      .project-image-placeholder span { font-family: var(--font-mono); font-size: 32px; color: rgba(255,255,255,0.35); }
      .project-body { padding: 22px; display: flex; flex-direction: column; flex: 1; }
      .project-context { display: inline-block; font-size: 11px; color: var(--teal); margin-bottom: 8px; }
      .project-body h3 { font-size: 17px; margin-bottom: 8px; }
      .project-body p {
        font-size: 14px; margin-bottom: 16px; flex: 1;
        display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden;
      }
      .project-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: auto; }
      .project-link { display: inline-flex; align-items: center; gap: 6px; font-size: 13.5px; font-weight: 600; color: var(--teal); margin-top: auto; }
      .project-link:hover { color: var(--blue); }

      /* Lightbox */
      .lightbox-overlay {
        position: fixed; inset: 0; z-index: 100;
        background: rgba(4,6,9,0.92); backdrop-filter: blur(6px);
        display: flex; align-items: center; justify-content: center;
        padding: 40px; animation: lightboxFade 0.2s ease;
      }
      @keyframes lightboxFade { from { opacity: 0; } to { opacity: 1; } }
      .lightbox-overlay img.lightbox-image {
        max-width: min(92vw, 1100px); max-height: 86vh; width: auto !important; height: auto !important;
        object-fit: contain; border-radius: 10px; box-shadow: 0 30px 80px -20px rgba(0,0,0,0.6);
        cursor: default;
      }
      .lightbox-close {
        position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); color: #fff;
        display: flex; align-items: center; justify-content: center;
      }
      .lightbox-close:hover { background: rgba(255,255,255,0.14); }
      .lightbox-nav {
        position: absolute; top: 50%; transform: translateY(-50%);
        width: 46px; height: 46px; border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); color: #fff;
        display: flex; align-items: center; justify-content: center;
      }
      .lightbox-nav:hover { background: rgba(62,232,200,0.3); }
      .lightbox-nav-left { left: 20px; }
      .lightbox-nav-right { right: 20px; }
      .lightbox-counter {
        position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
        font-family: var(--font-mono); font-size: 12px; color: rgba(255,255,255,0.7);
        padding: 6px 12px; border-radius: 999px; background: rgba(255,255,255,0.08);
      }
      @media (max-width: 640px) {
        .lightbox-overlay { padding: 16px; }
        .lightbox-nav { width: 38px; height: 38px; }
        .lightbox-nav-left { left: 8px; }
        .lightbox-nav-right { right: 8px; }
        .lightbox-close { top: 12px; right: 12px; }
      }

      /* Education */
      .edu-grid { display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
      .edu-card { display: flex; gap: 16px; padding: 24px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); }
      .edu-icon { color: var(--teal); flex-shrink: 0; margin-top: 2px; }
      .edu-card h3 { font-size: 16px; margin-bottom: 6px; }
      .edu-period { display: inline-block; margin-top: 10px; font-size: 11.5px; color: var(--text-muted); }
      .cert-list { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
      .cert-list li { display: flex; align-items: center; gap: 6px; font-size: 14px; color: var(--text-muted); }
      .cert-list svg { color: var(--teal); flex-shrink: 0; }

      /* Contact */
      .section-contact { position: relative; overflow: hidden; }
      .contact-grid { position: relative; z-index: 1; display: grid; gap: 48px; grid-template-columns: 1fr; }
      @media (min-width: 860px) { .contact-grid { grid-template-columns: 1fr 1fr; align-items: start; } }
      .contact-links { display: flex; flex-direction: column; gap: 14px; margin-top: 28px; }
      .cv-card {
        display: flex; align-items: center; gap: 14px; margin-top: 26px; padding: 16px 18px;
        border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface);
        transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
      }
      .cv-card:hover { border-color: rgba(62,232,200,0.45); box-shadow: 0 16px 40px -20px rgba(62,232,200,0.4); transform: translateY(-2px); }
      .cv-card-icon {
        width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        background: rgba(62,232,200,0.12); color: var(--teal);
      }
      .cv-card-text { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
      .cv-card-title { font-size: 14px; font-weight: 600; color: var(--text); }
      .cv-card-sub { font-size: 12px; color: var(--text-muted); }
      .cv-card-download { color: var(--teal); flex-shrink: 0; }
      .contact-link { display: inline-flex; align-items: center; gap: 10px; font-size: 15px; color: var(--text); }
      .contact-link svg { color: var(--teal); }
      .contact-link:hover { color: var(--teal); }
      .contact-form { display: flex; flex-direction: column; gap: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; }
      .contact-form label { display: flex; flex-direction: column; gap: 6px; font-size: 12.5px; color: var(--text-muted); font-family: var(--font-mono); }
      .contact-form input, .contact-form textarea {
        font-family: var(--font-body); background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px;
        padding: 11px 12px; color: var(--text); font-size: 14px; resize: vertical;
      }
      .contact-form input:focus, .contact-form textarea:focus { border-color: var(--teal); outline: none; }
      .form-note { font-size: 12px; color: var(--text-muted); }
      .form-note-success { color: var(--teal); }
      .form-note-error { color: #ff8080; }

      /* Footer */
      .footer { border-top: 1px solid var(--border); padding: 28px 0; }
      .footer-inner { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; font-size: 13px; color: var(--text-muted); }
      .footer-links { display: flex; gap: 18px; }
      .footer-links a:hover { color: var(--teal); }

      /* ===== Responsive tightening ===== */
      @media (max-width: 900px) {
        .section-inner { padding: 0 20px; }
        .section { padding: 88px 0; }
      }

      @media (max-width: 640px) {
        .section { padding: 64px 0; }
        .section-inner { padding: 0 18px; }
        .hero { padding: 116px 18px 64px; min-height: 92vh; }
        .hero-title { font-size: clamp(34px, 10vw, 48px); }
        .hero-tagline { font-size: 15px; }
        .hero-actions { flex-direction: column; align-items: stretch; gap: 12px; margin-top: 28px; }
        .hero-actions .btn { justify-content: center; width: 100%; }
        .navbar-inner { padding: 14px 18px; }
        .brand span:last-child { font-size: 14px; }
        .section-title { font-size: clamp(24px, 7vw, 32px); }
        .about-pillars { grid-template-columns: 1fr; }
        .pillar { padding: 16px; }
        .skill-grid { grid-template-columns: 1fr; }
        .skill-card { padding: 18px; }
        .project-grid { grid-template-columns: 1fr; gap: 18px; }
        .project-body { padding: 18px; }
        .carousel-arrow { opacity: 0.85; width: 28px; height: 28px; }
        .edu-grid { grid-template-columns: 1fr; }
        .edu-card { padding: 18px; flex-direction: column; }
        .timeline-item { grid-template-columns: 16px 1fr; gap: 14px; }
        .timeline-card { padding-bottom: 34px; }
        .timeline-card h3 { font-size: 17px; }
        .contact-form { padding: 20px; }
        .contact-links { gap: 12px; }
        .footer-inner { flex-direction: column; align-items: flex-start; gap: 10px; }
        .nav-mobile { padding: 8px 18px 18px; }
      }

      @media (max-width: 380px) {
        .hero-title { font-size: 30px; }
        .btn { padding: 11px 16px; font-size: 13px; }
      }

      /* Respect notches / safe areas on iOS */
      @supports (padding: max(0px)) {
        .navbar-inner { padding-left: max(24px, env(safe-area-inset-left)); padding-right: max(24px, env(safe-area-inset-right)); }
        .footer-inner { padding-bottom: env(safe-area-inset-bottom); }
      }
    `}</style>
  );
}