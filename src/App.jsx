import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Skills from "./components/Skills.jsx";
import Experience from "./components/Experience.jsx";
import Work from "./components/Work.jsx";
import Education from "./components/Education.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import { ScrollProgress } from "./components/ui.jsx";

export default function App() {
  return (
    <div className="site">
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Work />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
