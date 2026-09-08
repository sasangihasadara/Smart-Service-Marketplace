import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchSection({ onToast, onSearch }) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!query.trim() || !location.trim()) {
      onToast?.("Please enter both a service and a location.");
      return;
    }

    setIsSearching(true);
    try {
      await onSearch?.({ query, location });
      onToast?.("Here are the best professionals for your request.", "✓");
    } catch {
      onToast?.("Showing available professionals while we reconnect.");
    } finally {
      setIsSearching(false);
      navigate(`/providers?q=${encodeURIComponent(query.trim())}&location=${encodeURIComponent(location.trim())}`);
    }
  };

  return (
    <section id="find-service" className="search-section" aria-labelledby="find-service-title">
      <div className="search-intro">
        <span>Find a service</span>
        <h2 id="find-service-title">What can we help you with today?</h2>
      </div>
      <form className="search-bar" onSubmit={handleSearch}>
        <div className="search-field">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="What service do you need? e.g. Electrician"
            aria-label="Service needed"
          />
        </div>
        <div className="search-divider" />
        <div className="search-field">
          <span className="search-icon" aria-hidden="true">⌖</span>
          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Where do you need it? e.g. Colombo"
            aria-label="Location"
          />
        </div>
        <button type="submit" className="btn btn-primary search-button" disabled={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </button>
      </form>
      <div className="search-suggestions" aria-label="Popular services">
        <span>Popular:</span>
        {["Electrician", "Plumber", "Home cleaning", "AC repair"].map((service) => (
          <button type="button" key={service} onClick={() => setQuery(service)}>{service}</button>
        ))}
      </div>
    </section>
  );
}
