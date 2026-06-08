import { Link, Navigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { serviceCategoryPages, topProviders } from "../../data/serveiqData";
import { buildBookingContext, formatCurrency, useLiveProviders } from "../../utils/providerCatalog";

function singularize(name) {
  return name.endsWith("s") ? name.slice(0, -1) : name;
}

export default function CategoryPage({ onOpenModal }) {
  const { slug } = useParams();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const { providers, loading, error, source } = useLiveProviders(topProviders);

  const category = serviceCategoryPages.find((item) => item.slug === slug);

  const categoryProviders = useMemo(() => {
    if (!category) {
      return [];
    }

    return providers.filter((provider) => provider.category.toLowerCase() === category.name.toLowerCase());
  }, [category, providers]);

  const filteredProviders = useMemo(() => {
    const searched = categoryProviders.filter((provider) =>
      provider.searchText.includes(query.toLowerCase()),
    );

    return [...searched].sort((a, b) => {
      if (sortBy === "rating") {
        return b.ratingValue - a.ratingValue;
      }

      if (sortBy === "price") {
        return a.priceValue - b.priceValue;
      }

      if (sortBy === "jobs") {
        return b.jobsValue - a.jobsValue;
      }

      return 0;
    });
  }, [categoryProviders, query, sortBy]);

  if (!category) {
    return <Navigate to="/services" replace />;
  }

  const featuredProvider = filteredProviders[0] ?? categoryProviders[0];
  const averageRating = categoryProviders.length
    ? (
        categoryProviders.reduce((sum, provider) => sum + provider.ratingValue, 0) /
        categoryProviders.length
      ).toFixed(1)
    : category.stats.rating.replace(/[^0-9.]/g, "");
  const averagePrice = categoryProviders.length
    ? formatCurrency(
        Math.round(
          categoryProviders.reduce((sum, provider) => sum + provider.priceValue, 0) /
            categoryProviders.length,
        ),
      )
    : category.stats.avgPrice;

  const openBooking = (provider = featuredProvider) => {
    if (!provider) {
      return;
    }

    onOpenModal?.("booking", buildBookingContext(provider, { serviceRequired: category.name }));
  };

  const syncLabel = source === "live" ? "Synced from backend API" : "Showing fallback provider catalog";

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
                <div className="category-live-pill">{loading ? "Loading providers..." : syncLabel}</div>
              </div>

              <h1 className="category-title">{category.name}</h1>
              <p className="category-headline">{category.headline}</p>
              <p className="category-description">{category.description}</p>

              <div className="category-hero-actions">
                <button type="button" className="btn btn-primary btn-lg" onClick={() => openBooking(featuredProvider)} disabled={!featuredProvider}>
                  Book a {singularize(category.name)}
                </button>
                <Link to="/providers" className="btn btn-ghost btn-lg">
                  Browse all providers
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
                  <strong>{categoryProviders.length || category.stats.providers}</strong>
                  <span>Providers</span>
                </div>
                <div>
                  <strong>{averageRating}*</strong>
                  <span>Average Rating</span>
                </div>
                <div>
                  <strong>{averagePrice}</strong>
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
                  <strong>{featuredProvider?.name || "-"}</strong>
                </div>
                <div>
                  <span>Available Now</span>
                  <strong>{filteredProviders.length}</strong>
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
              <strong>{filteredProviders.length} providers</strong>
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
              Curated provider list with live stats, verified approval status, and instant booking.
            </p>
          </div>

          {error && source === "fallback" ? (
            <div className="category-live-pill" style={{ marginBottom: "1rem" }}>
              {error}
            </div>
          ) : null}

          <div className="providers-grid category-providers-grid">
            {filteredProviders.map((provider) => (
              <article className="provider-card provider-card--large" key={provider.id || provider.name}>
                <div className="provider-card-topline">
                  <span className="provider-spotlight">Live provider</span>
                  <span className="provider-response">Active now</span>
                </div>
                <div className="prov-header">
                  <div className="prov-avatar" style={{ background: provider.color }}>
                    {provider.initials}
                  </div>
                  <div>
                    <div className="prov-name">{provider.name}</div>
                    <div className="prov-title">{provider.title}</div>
                    <div className="verified-badge">Verified</div>
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
                    <strong>{provider.completionRate}</strong>
                    <span>Complete</span>
                  </div>
                </div>
                <div className="prov-footer">
                  <div className="prov-price">
                    {provider.price} <span>{provider.unit}</span>
                  </div>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => openBooking(provider)}>
                    Book Now
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredProviders.length === 0 ? (
            <div className="empty-state">No approved providers found for this category yet.</div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
