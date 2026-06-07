import { Link } from "react-router-dom";
import { serviceCategoryPages } from "../../data/serveiqData";
import SectionHeader from "../SectionHeader";

export default function CategoriesSection({ onToast }) {
  return (
    <section id="categories">
      <div className="container">
        <SectionHeader label="📋 Service Categories" title="Every Service You Need" />
        <div className="category-grid">
          {serviceCategoryPages.map((category) => (
            <Link
              to={`/category/${category.slug}`}
              className="cat-card"
              key={category.slug}
              onClick={() => {
                onToast(`Opening ${category.name} page...`, category.icon);
              }}
            >
              <div className="cat-icon">{category.icon}</div>
              <div className="cat-name">{category.name}</div>
              <div className="cat-count">{category.stats.providers} providers</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
