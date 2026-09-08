import { howItWorks } from "../../data/serveiqData";
import SectionHeader from "../SectionHeader";

export default function HowItWorksSection() {
  return (
    <section id="how-it-works">
      <div className="container">
        <SectionHeader
          label="How ServeIQ works"
          title="Simple, secure, and built around you."
          subtitle="From your first search to a completed job, every step is designed to be clear and dependable."
          centered
          dark
        />
        <div className="steps-grid fade-up">
          {howItWorks.map((step) => (
            <div className="step-card" key={step.num}>
              <div className="step-num">{step.num}</div>
              <div className="step-icon-wrap" style={{ background: step.color }}>{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
