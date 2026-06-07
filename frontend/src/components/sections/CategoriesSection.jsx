import { serviceCategories } from "../../data/serveiqData";
import SectionHeader from "../SectionHeader";

export default function CategoriesSection({ onToast }) {
  return (
    <section id="categories">
      <div className="container">
        <SectionHeader label="📋 Service Categories" title="Every Service You Need" />
        <div className="category-grid">
          {serviceCategories.map(([name, icon, count]) => (
            <a
              href="#"
              className="cat-card"
              key={name}
              onClick={(event) => {
                event.preventDefault();
                onToast(`Loading ${name}...`, icon);
              }}
            >
              <div className="cat-icon">{icon}</div>
              <div className="cat-name">{name}</div>
              <div className="cat-count">{count}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

