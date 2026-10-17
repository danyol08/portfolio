import {
  Cpu, Boxes, Network, Server, Smartphone, Cloud, Code2, Database, Wrench,
  ShieldCheck, Radio,
} from "lucide-react";
import cvFile from "../assets/Daniel_Cruz_CV.pdf";

/* ============================================================
   CONTENT: edit everything here, layout code never needs touching.
   Screenshots live in src/assets/projects/web (WebP + thumbnails).
   ============================================================ */

const shots = import.meta.glob("../assets/projects/web/*.webp", {
  eager: true,
  import: "default",
});
const shot = (name) => ({
  src: shots[`../assets/projects/web/${name}.webp`],
  thumb: shots[`../assets/projects/web/${name}-thumb.webp`],
});

export { cvFile };
export const CV_FILENAME = "Daniel_Cruz_CV.pdf";

export const PROFILE = {
  name: "Daniel Cruz",
  tagline: "Full-Stack Software Developer · AI-Assisted Development · Odoo ERP · API Integration",
  location: "Taytay, Rizal, Philippines",
  email: "danielzurc08@gmail.com",
  phone: "+63 920 291 1355",
  linkedin: "https://www.linkedin.com/in/daniel-cruz-1b3441356/",
  summary:
    "IT professional with over a year of hands-on experience delivering software support and custom ERP solutions for business clients. Specializes in Odoo ERP customization, backend API development with FastAPI, and mobile development with Flutter — paired with an AI-assisted development workflow that accelerates delivery without sacrificing code quality. Independently owns system architecture, API integration, and end-to-end deployment. Backed by a strong networking and hardware foundation, and now available as a freelance developer for ERP customization, AI-assisted system development, API integration, and IT support projects.",
};

export const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export const ABOUT_STATEMENT = "An engineer who treats AI as a teammate, not a shortcut.";

export const ABOUT_PILLARS = [
  {
    icon: Cpu,
    title: "AI-assisted, not AI-replaced",
    body: "Claude and Claude Code accelerate the boilerplate; architecture, integration, and quality checks stay in human hands.",
  },
  {
    icon: Boxes,
    title: "ERP-native thinking",
    body: "Odoo customization means reasoning about real business workflows, not just writing code in isolation.",
  },
  {
    icon: Network,
    title: "Full-stack ownership",
    body: "From LAN cabling to REST APIs to deployment — comfortable across the entire stack a small business actually runs on.",
  },
];

export const AVAILABILITY =
  "Available for freelance custom software development, ERP customization, AI-assisted system development, API integration, and IT support projects.";

// Ordered the way a system is actually layered: from the AI workflow at the top down to the cabling.
export const SKILL_GROUPS = [
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

export const EXPERIENCE = [
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

// Optional per project: `link` (live site), `context`, `tags`, `images`.
// `cover` is the index of the screenshot shown first (dashboards read better than login screens).
export const PROJECTS = [
  {
    id: 1,
    title: "Nail Salon Transaction Monitoring System",
    context: "Freelance Project",
    description:
      "A web-based transaction monitoring system developed to help nail salon businesses efficiently track, record, and manage daily sales and service transactions. The system centralizes transaction data, provides real-time visibility into revenue and service performance, and reduces the manual effort involved in bookkeeping — enabling business owners to make faster, more informed decisions.",
    tags: ["Flutter / Dart", "Supabase", "PostgreSQL"],
    cover: 1,
    images: ["posproject1", "posproject2", "posproject3", "posproject4"].map(shot),
  },
  {
    id: 2,
    title: "Fixed Asset Management System",
    context: "Developed at Barcotech Philippines Inc.",
    description:
      "A web-based system designed to help organizations efficiently track, manage, and monitor their fixed assets throughout their lifecycle. The system integrates barcode technology to simplify asset identification and tracking — allowing quick scanning for asset registration, verification, and audits. It centralizes asset records and provides better visibility into asset status, location, and value, helping reduce losses, improve accountability, and support more accurate financial and operational decision-making.",
    tags: ["Flutter / Dart", "FastAPI", "PostgreSQL"],
    cover: 1,
    images: ["fams1", "fams2", "fams3", "fams4", "fams5"].map(shot),
  },
  {
    id: 3,
    title: "Parking Monitoring System",
    context: "Developed at Barcotech Philippines Inc.",
    description:
      "An automated parking management platform built to streamline vehicle entry and exit monitoring in parking facilities. Upon check-in, the system generates a unique QR code-based parking ticket linked to the vehicle's plate number, which is scanned upon exit to process checkout. It features an admin dashboard that provides real-time visibility into currently parked vehicles, complete transaction history, revenue reports, and guard accountability tracking — enabling better oversight of daily parking operations.",
    tags: ["Flutter / Dart", "PostgreSQL", "FastAPI"],
    cover: 2,
    images: ["park1", "park2", "park3", "park4", "park5"].map(shot),
  },
  {
    id: 4,
    title: "Odoo Custom Module",
    context: "Developed at Barcotech Philippines Inc.",
    description:
      "A custom-developed Odoo module built to extend the platform's capabilities for tracking, managing, and monitoring company fixed assets. Designed to integrate seamlessly with Odoo's existing framework, the module centralizes asset records and automates key processes involved in the asset lifecycle — from registration to disposal — helping organizations improve accountability, accuracy, and efficiency in asset management.",
    tags: ["Python", "XML", "JavaScript", "Odoo SH"],
    cover: 0,
    images: ["odoo1", "odoo2"].map(shot),
  },
  {
    id: 5,
    title: "Ironlog",
    // context: "Personal project",   // optional: add a line like this above the title
    description:
      "A fitness tracking web app for logging workouts and meals and following your progress over time. It is organised into Home, Workout, Food, Progress, History and Profile sections.",
    tags: [], // optional: add the stack, e.g. ["React", "Supabase"]
    link: "https://bakallogs.netlify.app/",
    images: ["ironlog1", "ironlog2", "ironlog3", "ironlog4"].map(shot), // optional: add screenshots, same as the other projects
  },
];

// Order the screens are stacked in the 3D hero, front to back (by project id).
export const HERO_ORDER = [2, 1, 3, 4];
export const HERO_COVERS = HERO_ORDER.map((id) => {
  const p = PROJECTS.find((x) => x.id === id);
  return { src: p.images[p.cover].src, label: p.title };
});

export const EDUCATION = {
  degree: "Bachelor of Science in Information Technology",
  school: "University of Rizal System, Binangonan",
  period: "2021 — 2025",
};

export const CERTIFICATIONS = ["Cisco Computer Hardware Basics", "Cisco Networking Basics"];

// Formspree form endpoint (https://formspree.io/f/<id>)
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/mbgrzgjl";
