import { Link } from "react-router-dom";
import { Sparkles, Palette, Globe, LayoutTemplate } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="landing-layout">
      <nav className="navbar">
        <div className="logo"><Sparkles size={24} /> VibeKit</div>
        <div className="nav-links">
          <Link to="/login" className="btn-text">Login</Link>
          <Link to="/signup" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      <main className="hero">
        <h1 className="hero-title">Custom vibes, stunning pages.</h1>
        <p className="hero-subtitle">Generate a theme, build a mini-site, publish it to a public URL in seconds.</p>
        <Link to="/signup" className="btn-primary hero-cta">Create your first page</Link>
      </main>

      <section className="features-grid">
        <div className="feature-card">
          <Palette className="accent-icon" />
          <h3>Generate a Vibe</h3>
          <p>Choose from 6 stunning, meticulously crafted presets styling everything from typography to spacing.</p>
        </div>
        <div className="feature-card">
          <LayoutTemplate className="accent-icon" />
          <h3>Intuitive Builder</h3>
          <p>Snap together Hero, Features, Gallery, and Contact sections in a beautiful live preview.</p>
        </div>
        <div className="feature-card">
          <Globe className="accent-icon" />
          <h3>Instant Publish</h3>
          <p>Get a live, ultra-fast public URL immediately. Your preview is exactly what your users see.</p>
        </div>
      </section>
    </div>
  );
}
