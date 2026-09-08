import { Link } from "react-router-dom";
import { heroMatches } from "../../data/serveiqData";

export default function HeroSection() {
  return (
    <section id="hero">
      <div className="hero-noise" aria-hidden="true" />
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="hero-badge">
            <span>Verified pros</span>
            For homes and businesses across Sri Lanka
          </div>
          <h1 className="hero-title">
            The right professional,<br /> <em>right when you need them.</em>
          </h1>
          <p className="hero-desc">
            Tell us what you need, compare trusted local professionals, and book with confidence.
            Clear prices, verified reviews, and secure payments in one place.
          </p>
          <div className="hero-actions">
            <a href="#find-service" className="btn btn-primary btn-lg">Find a professional <span aria-hidden="true">→</span></a>
            <Link to="/register?mode=register&role=provider" className="btn btn-ghost btn-lg">Join as a provider</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>12,400+</strong><span>professionals</span></div>
            <div className="hero-stat"><strong>98,200+</strong><span>jobs completed</span></div>
            <div className="hero-stat"><strong>4.8/5</strong><span>average rating</span></div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-glow" aria-hidden="true" />
          <div className="hero-card provider-match-card">
            <div className="match-header">
              <div>
                <span className="match-eyebrow">Recommended for you</span>
                <span className="match-title">Top matches near Colombo</span>
              </div>
              <span className="ai-badge"><i /> Available</span>
            </div>
            {heroMatches.map((provider) => (
              <div className="provider-row" key={provider.name}>
                <div className="provider-avatar" style={{ background: provider.color }}>{provider.initials}</div>
                <div className="provider-info">
                  <div className="provider-name">{provider.name}</div>
                  <div className="provider-role">{provider.role}</div>
                  <div className="stars">{provider.stars}</div>
                </div>
                <div className="match-score">
                  <div className="score-num">{provider.score}%</div>
                  <div className="score-bar"><div className="score-fill" style={{ width: `${provider.score}%` }} /></div>
                </div>
              </div>
            ))}
          </div>
          <div className="float-badge float-badge-1"><span className="badge-icon">✓</span> Identity checked</div>
          <div className="float-badge float-badge-2"><span className="badge-icon">⌁</span> Secure payments</div>
        </div>
      </div>
    </section>
  );
}
