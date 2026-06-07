export default function SearchSection({ onToast }) {
  return (
    <div className="search-section">
      <div className="search-bar">
        <div className="search-field">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="What service do you need? e.g. Electrician, Plumber, Tutor..." />
        </div>
        <div className="search-divider" />
        <div className="search-field">
          <span className="search-icon">📍</span>
          <input type="text" placeholder="Location - e.g. Colombo, Kandy" />
        </div>
        <button type="button" className="btn btn-primary search-button" onClick={() => onToast("Searching with AI matching engine...")}>
          Search
        </button>
      </div>
    </div>
  );
}

