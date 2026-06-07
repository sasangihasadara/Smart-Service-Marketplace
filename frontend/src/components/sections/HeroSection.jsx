import { Link } from "react-router-dom";
import { heroMatches } from "../../data/serveiqData";

export default function HeroSection() {
  return (
    <section id="hero">
      <div className="hero-grid">
        <div>
          <div className="hero-badge">
            <span>AI-Powered</span>
            Intelligent Service Matching
          </div>
          <h1 className="hero-title">
            Find the <em>Perfect</em> Service Provider, Instantly
          </h1>
          <p className="hero-desc">
            ServeIQ uses advanced machine learning to match you with the most suitable professionals - electricians, plumbers, tutors, cleaners and more - based on ratings, location, experience, and your exact needs.
          </p>
          <div className="hero-actions">
            <a href="#categories" className="btn btn-primary btn-lg">Browse Services</a>
            <Link to="/register" className="btn btn-ghost btn-lg">Become a Provider</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>12,400+</strong><span>Service Providers</span></div>
            <div className="hero-stat"><strong>98,200+</strong><span>Bookings Completed</span></div>
            <div className="hero-stat"><strong>4.8★</strong><span>Average Rating</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card provider-match-card">
            <div className="match-header">
              <span className="match-title">AI Provider Matches</span>
              <span className="ai-badge">LIVE</span>
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
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: `${provider.score}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="float-badge float-badge-1">
            <span className="badge-icon">🛡️</span> Fraud Protected
          </div>
          <div className="float-badge float-badge-2">
            <span className="badge-icon">💳</span> PayHere Secured
          </div>
        </div>
      </div>
    </section>
  );
}
