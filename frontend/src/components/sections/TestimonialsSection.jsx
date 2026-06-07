import { testimonials } from "../../data/serveiqData";
import SectionHeader from "../SectionHeader";

export default function TestimonialsSection() {
  return (
    <section id="testimonials">
      <div className="container">
        <SectionHeader label="💬 Customer Reviews" title="Trusted by Thousands" centered />
        <div className="testimonials-grid fade-up">
          {testimonials.map((testimonial) => (
            <div className="testimonial-card" key={testimonial.name}>
              <div className="test-stars">★★★★★</div>
              <p className="test-text">"{testimonial.text}"</p>
              <div className="test-author">
                <div className="test-avatar" style={{ background: testimonial.color }}>{testimonial.initials}</div>
                <div>
                  <div className="test-name">{testimonial.name}</div>
                  <div className="test-role">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

