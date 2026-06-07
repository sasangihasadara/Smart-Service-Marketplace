import { fraudAlerts } from "../../data/serveiqData";
import SectionHeader from "../SectionHeader";

export default function FraudSection() {
  return (
    <section id="fraud">
      <div className="container">
        <div className="fraud-grid">
          <div>
            <SectionHeader label="🛡️ Research Module 2" title="ML-Based Fraud Detection" />
            <p className="section-sub">
              A dedicated machine learning module continuously monitors for fake reviews, suspicious booking patterns, duplicate accounts, and abnormal activity.
            </p>
            <div className="ml-tags">
              {["Isolation Forest", "Random Forest Classifier", "NLP Sentiment Analysis", "Anomaly Detection", "Duplicate Account Detection", "Behavioral Biometrics"].map((tag) => (
                <span className="ml-tag" key={tag}>{tag}</span>
              ))}
            </div>
            <div className="fraud-stats">
              <div><strong className="fraud-rate">97.4%</strong><br /><span>Fraud Detection Rate</span></div>
              <div><strong className="safe-rate">1.8%</strong><br /><span>False Positive Rate</span></div>
              <div><strong className="time-rate">&lt;200ms</strong><br /><span>Detection Latency</span></div>
            </div>
          </div>
          <div className="fraud-visual">
            <div className="mini-title">🚨 Live Fraud Alert Feed</div>
            <div className="fraud-alerts">
              {fraudAlerts.map((alert) => (
                <div className={`fraud-alert ${alert.type}`} key={alert.title}>
                  <span className="alert-icon">{alert.icon}</span>
                  <div className="alert-text">
                    <h5>{alert.title}</h5>
                    <p>{alert.desc}</p>
                  </div>
                  <span className="alert-score">{alert.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

