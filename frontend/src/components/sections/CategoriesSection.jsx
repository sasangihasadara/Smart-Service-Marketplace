import { serviceCategories } from "../../data/serveiqData";
import SectionHeader from "../SectionHeader";

export default function CategoriesSection({ onToast, selectedCategory, onCategorySelect }) {
  return (
    <section id="categories">
      <div className="container">
        <SectionHeader label="📋 Service Categories" title="Every Service You Need" />
        <div className="category-grid">
          {serviceCategories.map(([name, icon, count]) => (
            <button
              type="button"
              className={`cat-card ${selectedCategory === name ? "active" : ""}`}
              key={name}
              onClick={() => {
                onCategorySelect(name);
                onToast(`Filtering providers for ${name}...`, icon);
              }}
            >
              <div className="cat-icon">{icon}</div>
              <div className="cat-name">{name}</div>
              <div className="cat-count">{count}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
