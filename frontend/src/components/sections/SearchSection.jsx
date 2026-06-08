import { useState } from "react";

export default function SearchSection({ onToast, onSearch }) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = async () => {
    if (!query.trim() || !location.trim()) {
      onToast?.("Please enter both a service and a location.");
      return;
    }

    try {
      await onSearch?.({ query, location });
      onToast?.("Search saved and AI matching started.");
    } catch (error) {
      onToast?.(error?.message || "Search could not be saved.");
    }
  };

  return (
    <div className="search-section">
      <div className="search-bar">
        <div className="search-field">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="What service do you need? e.g. Electrician, Plumber, Tutor..."
          />
        </div>
        <div className="search-divider" />
        <div className="search-field">
          <span className="search-icon">📍</span>
          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Location - e.g. Colombo, Kandy"
          />
        </div>
        <button type="button" className="btn btn-primary search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
}
