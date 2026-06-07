import { techCategories } from "../../data/serveiqData";
import SectionHeader from "../SectionHeader";

export default function TechSection() {
  return (
    <section id="tech">
      <div className="container">
        <SectionHeader label="🛠️ Technology Stack" title="Built with Modern Technologies" centered />
        <div className="tech-categories">
          {techCategories.map((category) => (
            <div className="tech-cat" key={category.title}>
              <div className="tech-cat-title">{category.title}</div>
              <div className="tech-items">
                {category.items.map(([name, color]) => (
                  <div className="tech-item" key={name}>
                    <div className="tech-dot" style={{ background: color }} />
                    {name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

