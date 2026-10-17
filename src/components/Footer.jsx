import { ArrowUp } from "lucide-react";
import { PROFILE } from "../data/content.js";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <span>© {new Date().getFullYear()} {PROFILE.name}</span>
        <nav className="footer-links" aria-label="Footer">
          <a href={`mailto:${PROFILE.email}`}>Email</a>
          <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Back to top <ArrowUp size={14} aria-hidden="true" />
          </button>
        </nav>
      </div>
    </footer>
  );
}
