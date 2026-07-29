import { useState } from "react";
import { Link } from "react-router-dom";
import { testimonials } from "../../data/serveiqData";

const reviewDetails = {
  "Nimali Ratnayake": { service: "Electrical repair", date: "May 2026", type: "Customer reviews", rating: 5 },
  "Kasun Perera": { service: "Provider experience", date: "May 2026", type: "Provider reviews", rating: 5 },
  "Amali Silva": { service: "Provider experience", date: "April 2026", type: "Provider reviews", rating: 5 },
};

export default function TestimonialsPage() {
  const [activeFilter, setActiveFilter] = useState("All reviews");
  const filters = ["All reviews", "Customer reviews", "Provider reviews"];
  const reviews = testimonials.map((review) => ({ ...review, ...reviewDetails[review.name] }));
  const visibleReviews = reviews.filter((review) => activeFilter === "All reviews" || review.type === activeFilter);

  return (
    <main className="testimonials-page">
      <section className="reviews-hero">
        <div className="container reviews-hero-inner">
          <div className="reviews-hero-copy">
            <div className="reviews-kicker">Verified customer reviews</div>
            <h1>Confidence before you book.</h1>
            <p>Every review is tied to a completed booking, so you can choose a trusted professional with real local feedback.</p>
            <div className="reviews-hero-actions">
              <Link to="/providers" className="btn btn-primary">Find a provider</Link>
              <Link to="/booking" className="btn btn-ghost">Book a service</Link>
            </div>
          </div>
          <div className="reviews-score-card">
            <div className="reviews-score-label">ServeIQ community rating</div>
            <div className="reviews-score-value">4.9<span>/5</span></div>
            <div className="reviews-stars" aria-label="4.9 out of 5 stars">★★★★★</div>
            <p>Based on verified customer and provider feedback.</p>
          </div>
        </div>
      </section>

      <section className="reviews-content">
        <div className="container">
          <div className="reviews-trust-grid">
            <div className="reviews-trust-item"><strong>100%</strong><span>Reviews linked to a booking</span></div>
            <div className="reviews-trust-item"><strong>24h</strong><span>Average moderation response</span></div>
            <div className="reviews-trust-item"><strong>12k+</strong><span>Customers served across Sri Lanka</span></div>
          </div>

          <div className="reviews-toolbar">
            <div>
              <div className="section-label">Community feedback</div>
              <h2 className="section-title">Recent verified reviews</h2>
              <p className="section-sub">Filter feedback from customers and providers.</p>
            </div>
            <div className="reviews-count"><strong>{visibleReviews.length}</strong> reviews shown</div>
          </div>

          <div className="review-filters" aria-label="Filter reviews">
            {filters.map((filter) => (
              <button
                type="button"
                key={filter}
                className={`review-filter ${activeFilter === filter ? "active" : ""}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="reviews-grid">
            {visibleReviews.map((review) => (
              <article className="review-card" key={review.name}>
                <div className="review-card-top">
                  <div className="review-service">{review.service}</div>
                  <div className="review-verified">Verified booking</div>
                </div>
                <div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>
                  {"★".repeat(review.rating)}<span>{"★".repeat(5 - review.rating)}</span>
                </div>
                <p className="review-text">“{review.text}”</p>
                <div className="review-author">
                  <div className="review-avatar" style={{ background: review.color }}>{review.initials}</div>
                  <div>
                    <strong>{review.name}</strong>
                    <span>{review.role}</span>
                  </div>
                  <time>{review.date}</time>
                </div>
              </article>
            ))}
          </div>

          <div className="reviews-policy">
            <div className="reviews-policy-icon">✓</div>
            <div>
              <strong>How reviews stay trustworthy</strong>
              <p>Only customers and providers connected to a completed booking can leave feedback. Reported reviews are reviewed by our trust and safety team.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
