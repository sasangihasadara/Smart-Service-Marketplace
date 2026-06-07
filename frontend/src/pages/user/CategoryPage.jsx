import { Link, Navigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { serviceCategoryPages, topProviders } from "../../data/serveiqData";

export default function CategoryPage({ onOpenModal }) {
  const { slug } = useParams();

  const category = serviceCategoryPages.find((item) => item.slug === slug);

  const providers = useMemo(() => {
    if (!category) {
      return [];
    }

    return topProviders.filter((provider) => provider.category === category.name);
  }, [category]);

  if (!category) {
    return <Navigate to="/services" replace />;
  }

  return (
    <main className="category-page" style={{ "--category-accent": category.accent }}>
      <section className="category-hero">
        <div className="container">
          <div className="category-breadcrumb">
            <Link to="/services">Services</Link>
            <span>/</span>
            <span>{category.name}</span>
          </div>

          <div className="category-hero-grid">
            <div className="category-hero-copy">
              <div className="category-icon-badge">{category.icon}</div>
              <h1 className="category-title">{category.name}</h1>
              <p className="category-headline">{category.headline}</p>
              <p className="category-description">{category.description}</p>

              <div className="category-hero-actions">
                <button type="button" className="btn btn-primary btn-lg" onClick={() => onOpenModal("booking")}>
                  Book a {category.name.slice(0, -1)}
                </button>
                <Link to="/services" className="btn btn-ghost btn-lg">
                  Back to Services
                </Link>
              </div>
            </div>

            <div className="category-stats-card">
              <div className="category-stats-title">Live Category Snapshot</div>
              <div className="category-stats-grid">
                <div>
                  <strong>{category.stats.providers}</strong>
                  <span>Providers</span>
                </div>
                <div>
                  <strong>{category.stats.rating}</strong>
                  <span>Average Rating</span>
                </div>
                <div>
                  <strong>{category.stats.avgPrice}</strong>
                  <span>Average Price</span>
                </div>
                <div>
                  <strong>{category.stats.response}</strong>
                  <span>Response Time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="category-benefits">
        <div className="container">
          <div className="section-label">Why this category works</div>
          <div className="category-benefit-grid">
            {category.benefits.map((benefit) => (
              <div className="category-benefit-card" key={benefit}>
                <div className="category-benefit-dot" />
                <div>{benefit}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="category-providers">
        <div className="container">
          <div className="category-section-head">
            <div>
              <div className="section-label">Featured Providers</div>
              <h2 className="section-title">Modern UI, tailored for {category.name}</h2>
            </div>
            <p className="section-sub">
              These are the top-rated professionals currently available in this category.
            </p>
          </div>

          <div className="providers-grid category-providers-grid">
            {providers.map((provider) => (
              <article className="provider-card provider-card--large" key={provider.name}>
                <div className="prov-header">
                  <div className="prov-avatar" style={{ background: provider.color }}>
                    {provider.initials}
                  </div>
                  <div>
                    <div className="prov-name">{provider.name}</div>
                    <div className="prov-title">{provider.title}</div>
                    <div className="verified-badge">✓ Verified</div>
                  </div>
                </div>
                <div className="provider-details">{provider.details}</div>
                <div className="prov-stats">
                  <div className="prov-stat"><strong>{provider.rating}</strong><span>Rating</span></div>
                  <div className="prov-stat"><strong>{provider.jobs}</strong><span>Jobs</span></div>
                  <div className="prov-stat"><strong>{provider.complete}</strong><span>Complete</span></div>
                </div>
                <div className="prov-footer">
                  <div className="prov-price">{provider.price} <span>{provider.unit}</span></div>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => onOpenModal("booking")}>
                    Book Now
                  </button>
                </div>
              </article>
            ))}
          </div>

          {providers.length === 0 ? (
            <div className="empty-state">No featured providers found for this category yet.</div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
