import { bookingFlow } from "../../data/serveiqData";
import SectionHeader from "../SectionHeader";

export default function BookingSection() {
  return (
    <section id="booking">
      <div className="container">
        <SectionHeader
          label="📅 Booking System"
          title="Book in 4 Easy Steps"
          subtitle="A streamlined booking process with real-time availability, automated confirmations, and intelligent scheduling."
          centered
          dark
        />
        <div className="booking-flow fade-up">
          {bookingFlow.map((step) => (
            <div className="booking-step" key={step.title}>
              <div className="booking-step-num" style={{ background: step.color, borderColor: step.border }}>{step.icon}</div>
              <div className="booking-step-title">{step.title}</div>
              <div className="booking-step-desc">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

