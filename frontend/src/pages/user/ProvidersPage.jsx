import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import { serviceCategoryPages, topProviders } from "../../data/serveiqData";

function parseRating(rating) {
  return Number.parseFloat(String(rating).replace("★", "")) || 0;
}

function parseMoney(price) {
  return Number.parseInt(String(price).replace(/[^0-9]/g, ""), 10) || 0;
}

export default function ProvidersPage({ onOpenModal }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Services");
  const [sortBy, setSortBy] = useState("rating");

  const filteredProviders = useMemo(() => {
    const base = selectedCategory === "All Services"
      ? topProviders
      : topProviders.filter((provider) => provider.category === selectedCategory);

    const searched = base.filter((provider) =>
      `${provider.name} ${provider.title} ${provider.details} ${provider.category}`.toLowerCase().includes(query.toLowerCase())
    );

    return [...searched].sort((a, b) => {
      if (sortBy === "rating") return parseRating(b.rating) - parseRating(a.rating);
      if (sortBy === "jobs") return parseMoney(b.jobs) - parseMoney(a.jobs);
      if (sortBy === "price") return parseMoney(a.price) - parseMoney(b.price);
      return 0;
    });
  }, [query, selectedCategory, sortBy]);

  const topProvider = filteredProviders[0] || topProviders[0];

  return (
    <>
      <main className="providers-page">
        <section className="providers-hero">
          <div className="container">
            <div className="category-breadcrumb providers-breadcrumb">
              <Link to="/services">Services</Link>
              <span>/</span>
              <span>Providers</span>
            </div>

            <div className="providers-hero-grid">
              <div className="providers-hero-copy">
                <div className="section-label">⭐ Top Rated Providers</div>
                <h1 className="providers-title">Trusted professionals across every service category</h1>
                <p className="providers-description">
                  Every provider is verified, background-checked, and ranked by our AI system in real-time.
                  Discover the best professionals by rating, response time, experience, and value.
                </p>

                <div className="providers-hero-actions">
                  <button type="button" className="btn btn-primary btn-lg" onClick={() => onOpenModal("booking")}>
                    Book a Provider
                  </button>
                  <Link to="/services" className="btn btn-ghost btn-lg">
                    Explore Services
                  </Link>
                </div>

                <div className="providers-mini-stats">
                  <div>
                    <strong>6.4K+</strong>
                    <span>Verified providers</span>
                  </div>
                  <div>
                    <strong>4.8★</strong>
                    <span>Average rating</span>
                  </div>
                  <div>
                    <strong>&lt; 12 min</strong>
                    <span>Avg response</span>
                  </div>
                </div>
              </div>

              <div className="providers-spotlight-card">
                <div className="providers-spotlight-top">
                  <span className="provider-spotlight">Featured now</span>
                  <span className="provider-response">AI ranked #1</span>
                </div>

                <div className="providers-spotlight-avatar" style={{ background: topProvider.color }}>
                  {topProvider.initials}
                </div>

                <h3>{topProvider.name}</h3>
                <p>{topProvider.title}</p>
                <div className="providers-spotlight-meta">
                  <span>{topProvider.rating}</span>
                  <span>{topProvider.category}</span>
                  <span>{topProvider.price}</span>
                </div>

                <button type="button" className="btn btn-primary btn-lg providers-spotlight-btn" onClick={() => onOpenModal("booking")}>
                  Book Featured Provider
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="providers-tools">
          <div className="container">
            <div className="providers-toolbar">
              <div className="providers-search">
                <label>Search providers</label>
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by name, service, or expertise..."
                />
              </div>
              <div className="providers-sort">
                <label>Sort by</label>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <option value="rating">Best rating</option>
                  <option value="jobs">Most jobs</option>
                  <option value="price">Lowest price</option>
                </select>
              </div>
            </div>

            <div className="providers-category-chips">
              <button
                type="button"
                className={`provider-chip ${selectedCategory === "All Services" ? "active" : ""}`}
                onClick={() => setSelectedCategory("All Services")}
              >
                All Services
              </button>
              {serviceCategoryPages.map((category) => (
                <button
                  type="button"
                  className={`provider-chip ${selectedCategory === category.name ? "active" : ""}`}
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="providers-results">
          <div className="container">
            <div className="providers-results-head">
              <div>
                <div className="section-label">Live results</div>
                <h2 className="section-title">
                  {selectedCategory === "All Services" ? "Top providers across the marketplace" : `${selectedCategory} providers`}
                </h2>
              </div>
              <div className="providers-count-pill">
                {filteredProviders.length} providers found
              </div>
            </div>

            <div className="providers-grid providers-page-grid fade-up">
              {filteredProviders.map((provider) => (
                <article className="provider-card provider-card--modern" key={provider.name}>
                  <div className="provider-card-topline">
                    <span className="provider-spotlight">{provider.category}</span>
                    <span className="provider-response">{provider.complete} complete</span>
                  </div>
                  <div className="prov-header">
                    <div className="prov-avatar" style={{ background: provider.color }}>{provider.initials}</div>
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
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => onOpenModal("booking")}>
                      Book Now
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {filteredProviders.length === 0 ? (
              <div className="empty-state">No providers found. Try a different search or category.</div>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
