import { Link, Navigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { serviceCategoryPages, topProviders } from "../../data/serveiqData";

function singularize(name) {
  return name.endsWith("s") ? name.slice(0, -1) : name;
}

export default function CategoryPage({ onOpenModal }) {
  const { slug } = useParams();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  const category = serviceCategoryPages.find((item) => item.slug === slug);
  const openBooking = (provider = providers[0]) => {
    const baseRate = provider ? parseInt(provider.price.replace(/[^0-9]/g, ""), 10) || 2500 : 2500;
    const serviceFee = Math.round(baseRate * 2.5);
    const callOutFee = 1250;

    onOpenModal?.("booking", {
      serviceRequired: category.name,
      providerName: provider?.name || "",
      serviceFee,
      callOutFee,
      totalAmount: serviceFee + callOutFee,
      paymentMethod: "card",
    });
  };

  const providers = useMemo(() => {
    if (!category) {
      return [];
    }

    const filtered = topProviders.filter(
      (provider) =>
        provider.category === category.name &&
        `${provider.name} ${provider.title} ${provider.details}`.toLowerCase().includes(query.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "rating") {
        return parseFloat(b.rating) - parseFloat(a.rating);
      }

      if (sortBy === "price") {
        return parseInt(a.price.replace(/[^0-9]/g, ""), 10) - parseInt(b.price.replace(/[^0-9]/g, ""), 10);
      }

      if (sortBy === "jobs") {
        return parseInt(b.jobs.replace(/,/g, ""), 10) - parseInt(a.jobs.replace(/,/g, ""), 10);
      }

      return 0;
    });

    return sorted;
  }, [category, query, sortBy]);

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
              <div className="category-hero-top">
                <div className="category-icon-badge">{category.icon}</div>
                <div className="category-live-pill">Live category page</div>
              </div>

              <h1 className="category-title">{category.name}</h1>
              <p className="category-headline">{category.headline}</p>
              <p className="category-description">{category.description}</p>

              <div className="category-hero-actions">
                <button type="button" className="btn btn-primary btn-lg" onClick={() => openBooking(providers[0])}>
                  Book a {singularize(category.name)}
                </button>
                <Link to="/services" className="btn btn-ghost btn-lg">
                  Back to Services
                </Link>
              </div>

              <div className="category-quick-tags">
                <span>Verified professionals</span>
                <span>Fast response</span>
                <span>Secure booking</span>
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
              <div className="category-stats-footer">
                <div>
                  <span>Top Match</span>
                  <strong>{providers[0]?.name || "—"}</strong>
                </div>
                <div>
                  <span>Available Now</span>
                  <strong>{providers.length}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="category-search-panel">
        <div className="container">
          <div className="category-search-card">
            <div className="category-search-field">
              <label>Search providers</label>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search ${category.name.toLowerCase()}...`}
              />
            </div>
            <div className="category-search-field">
              <label>Sort by</label>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="rating">Best rating</option>
                <option value="jobs">Most jobs</option>
                <option value="price">Lowest price</option>
              </select>
            </div>
            <div className="category-search-summary">
              <span>Showing</span>
              <strong>{providers.length} providers</strong>
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
              <h2 className="section-title">Best professionals for {category.name}</h2>
            </div>
            <p className="section-sub">
              Curated provider list with modern cards, live stats, and instant booking actions.
            </p>
          </div>

          <div className="providers-grid category-providers-grid">
            {providers.map((provider) => (
              <article className="provider-card provider-card--large" key={provider.name}>
                <div className="provider-card-topline">
                  <span className="provider-spotlight">Top rated</span>
                  <span className="provider-response">Response: fast</span>
                </div>
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
                <div className="provider-activity">
                  <div>
                    <strong>{provider.rating}</strong>
                    <span>Rating</span>
                  </div>
                  <div>
                    <strong>{provider.jobs}</strong>
                    <span>Jobs</span>
                  </div>
                  <div>
                    <strong>{provider.complete}</strong>
                    <span>Complete</span>
                  </div>
                </div>
                <div className="prov-footer">
                  <div className="prov-price">{provider.price} <span>{provider.unit}</span></div>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => openBooking(provider)}>
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
