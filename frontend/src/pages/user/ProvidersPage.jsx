import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import { serviceCategoryPages, topProviders } from "../../data/serveiqData";

const heroMetrics = [
  { value: "6.4K+", label: "Verified providers" },
  { value: "4.8★", label: "Average rating" },
  { value: "< 12 min", label: "Avg response" },
  { value: "AI ranked #1", label: "Featured now" },
];

const trustSignals = [
  "Background checked",
  "Verified reviews",
  "AI relevance scoring",
];

const categoryMap = new Map(
  serviceCategoryPages.map((category) => [category.name, category.slug]),
);

const featuredProvider =
  topProviders.find((provider) => provider.initials === "ST") ?? topProviders[0];

const supportingSpotlights = topProviders
  .filter((provider) => provider.initials !== featuredProvider.initials)
  .slice(0, 3);

function parseRating(rating) {
  return Number.parseFloat(String(rating).replace(/[^0-9.]/g, "")) || 0;
}

function parseMoney(price) {
  return Number.parseInt(String(price).replace(/[^0-9]/g, ""), 10) || 0;
}

function getCategorySlug(categoryName) {
  return categoryMap.get(categoryName) ?? "services";
}

export default function ProvidersPage({ onOpenModal }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Services");
  const [sortBy, setSortBy] = useState("rating");

  const filteredProviders = useMemo(() => {
    const base =
      selectedCategory === "All Services"
        ? topProviders
        : topProviders.filter((provider) => provider.category === selectedCategory);

    const searched = base.filter((provider) =>
      `${provider.name} ${provider.title} ${provider.details} ${provider.category}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );

    return [...searched].sort((a, b) => {
      if (sortBy === "rating") return parseRating(b.rating) - parseRating(a.rating);
      if (sortBy === "jobs") return parseMoney(b.jobs) - parseMoney(a.jobs);
      if (sortBy === "price") return parseMoney(a.price) - parseMoney(b.price);
      return 0;
    });
  }, [query, selectedCategory, sortBy]);

  const hasFilters = query.trim() !== "" || selectedCategory !== "All Services" || sortBy !== "rating";

  const activeHeadline =
    selectedCategory === "All Services"
      ? "Top providers across the marketplace"
      : `${selectedCategory} specialists`;

  const clearFilters = () => {
    setQuery("");
    setSelectedCategory("All Services");
    setSortBy("rating");
  };

  const openBooking = (provider = featuredProvider) => {
    const baseRate = parseMoney(provider.price);
    const serviceFee = Math.round(baseRate * 2.5);
    const callOutFee = 1250;

    onOpenModal?.("booking", {
      serviceRequired: provider.category,
      providerName: provider.name,
      serviceFee,
      callOutFee,
      totalAmount: serviceFee + callOutFee,
      paymentMethod: "card",
    });
  };

  return (
    <>
      <main className="providers-page">
        <section className="providers-hero">
          <div className="providers-hero-orb providers-hero-orb-left" />
          <div className="providers-hero-orb providers-hero-orb-right" />

          <div className="container providers-hero-shell">
            <div className="providers-breadcrumb">
              <Link to="/services">Services</Link>
              <span>/</span>
              <span>Providers</span>
            </div>

            <div className="providers-hero-grid">
              <div className="providers-hero-copy">
                <div className="providers-hero-kicker">
                  <span className="providers-hero-pill">Live AI ranking</span>
                  <span className="providers-hero-pill providers-hero-pill--muted">
                    Updated in real time
                  </span>
                </div>

                <div className="section-label">⭐ Top Rated Providers</div>
                <h1 className="providers-title">Trusted professionals across every service category</h1>
                <p className="providers-description">
                  Every provider is verified, background-checked, and ranked by our AI system in
                  real-time. Discover the best professionals by rating, response time, experience,
                  and value.
                </p>

                <div className="providers-hero-actions">
                  <button type="button" className="btn btn-primary btn-lg" onClick={() => openBooking(featuredProvider)}>
                    Book a Provider
                  </button>
                  <Link to="/services" className="btn btn-ghost btn-lg">
                    Explore Services
                  </Link>
                </div>

                <div className="providers-mini-stats">
                  {heroMetrics.map((metric) => (
                    <div className="providers-mini-stat" key={metric.label}>
                      <strong>{metric.value}</strong>
                      <span>{metric.label}</span>
                    </div>
                  ))}
                </div>

                <div className="providers-trust-row">
                  {trustSignals.map((signal) => (
                    <span key={signal} className="providers-trust-pill">
                      {signal}
                    </span>
                  ))}
                </div>
              </div>

              <aside className="providers-spotlight-card">
                <div className="providers-spotlight-top">
                  <span className="provider-spotlight">Featured now</span>
                  <span className="provider-response">AI ranked #1</span>
                </div>

                <div className="providers-spotlight-profile">
                  <div
                    className="providers-spotlight-avatar"
                    style={{ background: featuredProvider.color }}
                  >
                    {featuredProvider.initials}
                  </div>

                  <div className="providers-spotlight-heading">
                    <h3>{featuredProvider.name}</h3>
                    <p>{featuredProvider.title}</p>
                  </div>
                </div>

                <div className="providers-spotlight-meta">
                  <span>{featuredProvider.rating}</span>
                  <span>{featuredProvider.category}</span>
                  <span>
                    {featuredProvider.price}
                    {featuredProvider.unit}
                  </span>
                </div>

                <p className="providers-spotlight-copy">
                  Private tutoring with a calm, high-trust learning style for students who need
                  focused exam prep, homework guidance, and long-term academic support.
                </p>

                <div className="providers-spotlight-stats">
                  <div>
                    <strong>98%</strong>
                    <span>match confidence</span>
                  </div>
                  <div>
                    <strong>7 yrs</strong>
                    <span>experience</span>
                  </div>
                  <div>
                    <strong>&lt; 12 min</strong>
                    <span>response time</span>
                  </div>
                </div>

                <div className="providers-spotlight-stack">
                  {supportingSpotlights.map((provider) => (
                    <div className="providers-spotlight-row" key={provider.name}>
                      <div className="providers-spotlight-row-avatar" style={{ background: provider.color }}>
                        {provider.initials}
                      </div>
                      <div className="providers-spotlight-row-copy">
                        <strong>{provider.name}</strong>
                        <span>{provider.title}</span>
                      </div>
                      <div className="providers-spotlight-row-meta">
                        <span>{provider.rating}</span>
                        <span>{provider.category}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button type="button" className="btn btn-primary btn-lg providers-spotlight-btn" onClick={() => openBooking(featuredProvider)}>
                  Book Featured Provider
                </button>
              </aside>
            </div>
          </div>
        </section>

        <section className="providers-tools">
          <div className="container">
            <div className="providers-toolbar">
              <div className="providers-search-panel">
                <label htmlFor="provider-search">Search providers</label>
                <div className="providers-search-field">
                  <span className="providers-search-icon">⌕</span>
                  <input
                    id="provider-search"
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by name, service, or expertise..."
                  />
                  {query ? (
                    <button type="button" className="providers-clear-btn" onClick={() => setQuery("")}>
                      Clear
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="providers-sort-panel">
                <label htmlFor="provider-sort">Sort by</label>
                <select id="provider-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
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
                  {category.name}
                </button>
              ))}
              {hasFilters ? (
                <button type="button" className="provider-chip provider-chip--clear" onClick={clearFilters}>
                  Reset filters
                </button>
              ) : null}
            </div>
          </div>
        </section>

        <section className="providers-results">
          <div className="container">
            <div className="providers-results-head">
              <div>
                <div className="section-label">Live ranking</div>
                <h2 className="section-title">{activeHeadline}</h2>
              </div>
              <div className="providers-count-pill">{filteredProviders.length} providers found</div>
            </div>

            <div className="providers-results-grid fade-up">
              {filteredProviders.map((provider) => {
                const categorySlug = getCategorySlug(provider.category);

                return (
                  <article className="provider-card provider-card--marketplace" key={provider.name}>
                    <div className="provider-card-topbar">
                      <span className="provider-category-pill">{provider.category}</span>
                      <span className="provider-availability-pill">Verified</span>
                    </div>

                    <div className="prov-header provider-card-header">
                      <div className="prov-avatar" style={{ background: provider.color }}>
                        {provider.initials}
                      </div>
                      <div className="provider-card-heading">
                        <div className="prov-name">{provider.name}</div>
                        <div className="prov-title">{provider.title}</div>
                        <div className="verified-badge">✓ Verified and background checked</div>
                      </div>
                    </div>

                    <p className="provider-card-details">{provider.details}</p>

                    <div className="provider-card-tags">
                      <span>Fast response</span>
                      <span>High completion</span>
                      <span>Best value</span>
                    </div>

                    <div className="provider-activity provider-activity--compact">
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

                    <div className="provider-card-footer">
                      <div className="prov-price">
                        {provider.price} <span>{provider.unit}</span>
                      </div>

                      <div className="provider-card-actions">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => openBooking(provider)}
                        >
                          Book Now
                        </button>
                        <Link to={`/category/${categorySlug}`} className="btn btn-ghost btn-sm">
                          View category
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {filteredProviders.length === 0 ? (
              <div className="providers-empty-state">
                <h3>No providers found</h3>
                <p>Try a different search term or clear the category filter to see more results.</p>
                <div className="providers-empty-actions">
                  <button type="button" className="btn btn-primary" onClick={clearFilters}>
                    Reset filters
                  </button>
                  <Link to="/services" className="btn btn-ghost">
                    Explore Services
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
