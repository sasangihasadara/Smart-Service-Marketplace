import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import BookingSection from "../../components/sections/BookingSection";
import { topProviders } from "../../data/serveiqData";
import { buildBookingContext, useLiveProviders } from "../../utils/providerCatalog";

const bookingSignals = ["Approved providers only", "Instant confirmation", "Saved to MySQL"];

function buildBookingMetrics(providers) {
  const activeProviders = providers.filter((provider) => provider.isActive !== false);
  const ratingValues = activeProviders.map((provider) => provider.ratingValue).filter((value) => value > 0);
  const averageRating = ratingValues.length
    ? (ratingValues.reduce((sum, value) => sum + value, 0) / ratingValues.length).toFixed(1)
    : "0.0";

  return [
    { value: `${activeProviders.length.toLocaleString("en-US")}+`, label: "Available providers" },
    { value: `${averageRating}*`, label: "Average rating" },
    { value: "< 12 min", label: "Avg response" },
    { value: "Live sync", label: "Backend source" },
  ];
}

export default function BookingPage({ onOpenModal }) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const { providers, loading, error, source } = useLiveProviders(topProviders);

  const activeProviders = useMemo(
    () => providers.filter((provider) => provider.isActive !== false),
    [providers],
  );

  const filteredProviders = useMemo(() => {
    const searched = activeProviders.filter((provider) =>
      provider.searchText.includes(query.toLowerCase()),
    );

    return [...searched].sort((a, b) => {
      if (sortBy === "rating") return b.ratingValue - a.ratingValue;
      if (sortBy === "jobs") return b.jobsValue - a.jobsValue;
      if (sortBy === "price") return a.priceValue - b.priceValue;
      return 0;
    });
  }, [activeProviders, query, sortBy]);

  const featuredProvider = filteredProviders[0] ?? activeProviders[0] ?? providers[0];
  const bookingMetrics = useMemo(() => buildBookingMetrics(providers), [providers]);

  const openBooking = (provider = featuredProvider) => {
    if (!provider) {
      return;
    }

    onOpenModal?.("booking", buildBookingContext(provider, { serviceRequired: provider.category }));
  };

  const syncLabel = source === "live" ? "Synced from backend API" : "Showing fallback provider catalog";

  return (
    <main className="providers-page booking-page">
      <section className="providers-hero">
        <div className="providers-hero-orb providers-hero-orb-left" />
        <div className="providers-hero-orb providers-hero-orb-right" />

        <div className="container providers-hero-shell">
          <div className="providers-breadcrumb">
            <Link to="/services">Services</Link>
            <span>/</span>
            <span>Booking</span>
          </div>

          <div className="providers-hero-grid">
            <div className="providers-hero-copy">
              <div className="providers-hero-kicker">
                <span className="providers-hero-pill">{loading ? "Loading providers..." : syncLabel}</span>
                <span className="providers-hero-pill providers-hero-pill--muted">
                  {activeProviders.length.toLocaleString("en-US")} active providers
                </span>
              </div>

              <div className="section-label">Live booking marketplace</div>
              <h1 className="providers-title">Choose an approved provider and confirm your booking</h1>
              <p className="providers-description">
                Pick from live provider records, open the booking form, and save the request into
                MySQL with a real provider name and price estimate.
              </p>

              <div className="providers-hero-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => openBooking(featuredProvider)}
                  disabled={!featuredProvider}
                >
                  Book featured provider
                </button>
                <Link to="/providers" className="btn btn-ghost btn-lg">
                  Browse all providers
                </Link>
              </div>

              <div className="providers-mini-stats">
                {bookingMetrics.map((metric) => (
                  <div className="providers-mini-stat" key={metric.label}>
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>

              <div className="providers-trust-row">
                {bookingSignals.map((signal) => (
                  <span key={signal} className="providers-trust-pill">
                    {signal}
                  </span>
                ))}
              </div>
            </div>

            <aside className="providers-spotlight-card">
              <div className="providers-spotlight-top">
                <span className="provider-spotlight">Quick booking</span>
                <span className="provider-response">{syncLabel}</span>
              </div>

              {featuredProvider ? (
                <>
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

                  <p className="providers-spotlight-copy">{featuredProvider.details}</p>

                  <div className="providers-spotlight-stats">
                    <div>
                      <strong>{featuredProvider.completionRate}</strong>
                      <span>completion</span>
                    </div>
                    <div>
                      <strong>{featuredProvider.jobs}</strong>
                      <span>jobs</span>
                    </div>
                    <div>
                      <strong>{featuredProvider.status === "active" ? "Active" : featuredProvider.status}</strong>
                      <span>status</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary btn-lg providers-spotlight-btn"
                    onClick={() => openBooking(featuredProvider)}
                  >
                    Book featured provider
                  </button>
                </>
              ) : (
                <div className="providers-empty-state">
                  <h3>No approved providers yet</h3>
                  <p>Once providers are approved by an admin, they will appear here automatically.</p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      <section className="providers-tools">
        <div className="container">
          <div className="providers-toolbar">
            <div className="providers-search-panel">
              <label htmlFor="booking-provider-search">Search providers</label>
              <div className="providers-search-field">
                <span className="providers-search-icon">?</span>
                <input
                  id="booking-provider-search"
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
              <label htmlFor="booking-provider-sort">Sort by</label>
              <select id="booking-provider-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="rating">Best rating</option>
                <option value="jobs">Most jobs</option>
                <option value="price">Lowest price</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="providers-results">
        <div className="container">
          <div className="providers-results-head">
            <div>
              <div className="section-label">Book live providers</div>
              <h2 className="section-title">Available providers right now</h2>
            </div>
            <div className="providers-count-pill">{filteredProviders.length} providers found</div>
          </div>

          {error && source === "fallback" ? (
            <div className="providers-hero-pill providers-hero-pill--muted" style={{ marginBottom: "1rem" }}>
              {error}
            </div>
          ) : null}

          <div className="providers-results-grid fade-up">
            {filteredProviders.map((provider) => (
              <article className="provider-card provider-card--marketplace" key={provider.id || provider.name}>
                <div className="provider-card-topbar">
                  <span className="provider-category-pill">{provider.category}</span>
                  <span className="provider-availability-pill">Active now</span>
                </div>

                <div className="prov-header provider-card-header">
                  <div className="prov-avatar" style={{ background: provider.color }}>
                    {provider.initials}
                  </div>
                  <div className="provider-card-heading">
                    <div className="prov-name">{provider.name}</div>
                    <div className="prov-title">{provider.title}</div>
                    <div className="verified-badge">Verified and ready to book</div>
                  </div>
                </div>

                <p className="provider-card-details">{provider.details}</p>

                <div className="provider-card-tags">
                  <span>{provider.completionRate} completion</span>
                  <span>{provider.jobs} jobs</span>
                  <span>{provider.status === "active" ? "Live" : provider.status}</span>
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
                    <strong>{provider.completionRate}</strong>
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
                    <Link to="/providers" className="btn btn-ghost btn-sm">
                      View providers
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredProviders.length === 0 ? (
            <div className="providers-empty-state">
              <h3>No providers found</h3>
              <p>Try a different search term or clear the filters to see more results.</p>
              <div className="providers-empty-actions">
                <button type="button" className="btn btn-primary" onClick={() => setQuery("")}>
                  Reset search
                </button>
                <Link to="/providers" className="btn btn-ghost">
                  Browse providers
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <BookingSection />
      <Footer />
    </main>
  );
}
