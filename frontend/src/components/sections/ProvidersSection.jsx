import { topProviders } from "../../data/serveiqData";
import SectionHeader from "../SectionHeader";

export default function ProvidersSection({ onOpenModal }) {
  return (
    <section id="providers">
      <div className="container">
        <SectionHeader
          label="⭐ Top Rated Providers"
          title="Trusted Professionals"
          subtitle="Every provider is verified, background-checked, and ranked by our AI system in real-time."
          centered
        />
        <div className="providers-grid fade-up">
          {topProviders.map((provider) => (
            <div className="provider-card" key={provider.name}>
              <div className="prov-header">
                <div className="prov-avatar" style={{ background: provider.color }}>{provider.initials}</div>
                <div>
                  <div className="prov-name">{provider.name}</div>
                  <div className="prov-title">{provider.title}</div>
                  <div className="verified-badge">✓ Verified</div>
                </div>
              </div>
              <div className="provider-details">{provider.details}</div>
              <div className="prov-stats">
                <div className="prov-stat"><strong className="rating-stat">{provider.rating}</strong><span>Rating</span></div>
                <div className="prov-stat"><strong>{provider.jobs}</strong><span>Jobs</span></div>
                <div className="prov-stat"><strong>{provider.complete}</strong><span>Complete</span></div>
              </div>
              <div className="prov-footer">
                <div className="prov-price">{provider.price} <span>{provider.unit}</span></div>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => onOpenModal("booking")}>Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

