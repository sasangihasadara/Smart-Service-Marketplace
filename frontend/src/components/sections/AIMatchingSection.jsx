import { aiFeatures, aiFactors } from "../../data/serveiqData";
import SectionHeader from "../SectionHeader";

export default function AIMatchingSection() {
  return (
    <section id="ai-matching">
      <div className="container">
        <div className="ai-grid">
          <div>
            <SectionHeader label="🤖 Core Research Contribution" title="Intelligent Provider Matching Engine" />
            <p className="section-sub">
              Our ML model uses Scikit-learn to compute a weighted match score across 9 key factors, delivering recommendation accuracy above 93% in evaluation tests.
            </p>
            <div className="ai-features">
              {aiFeatures.map((feature) => (
                <div className="ai-feature" key={feature.title}>
                  <div className="ai-feature-icon">{feature.icon}</div>
                  <div className="ai-feature-text">
                    <h4>{feature.title}</h4>
                    <p>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="ai-visual">
            <div className="mini-title">Match Score Factor Weights</div>
            <div className="factor-list">
              {aiFactors.map(([label, value, color]) => (
                <div className="factor-row" key={label}>
                  <span className="factor-label">{label}</span>
                  <div className="factor-bar-bg">
                    <div className="factor-bar-fill" style={{ width: `${value}%`, background: color }} />
                  </div>
                  <span className="factor-val">{value}%</span>
                </div>
              ))}
            </div>
            <div className="mini-panel">
              <div className="mini-panel-label">Model Performance (Test Set)</div>
              <div className="mini-panel-stats">
                <div><strong className="accent-stat">93.2%</strong><span>Accuracy</span></div>
                <div><strong className="green-stat">0.891</strong><span>NDCG@10</span></div>
                <div><strong className="gold-stat">0.874</strong><span>Precision@5</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

