import PaymentSection from "../../components/sections/PaymentSection";
import Footer from "../../components/Footer";

export default function PaymentPage({ paymentMethod, setPaymentMethod, onToast }) {
  return (
    <>
      <PaymentSection paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} onToast={onToast} />
      <Footer />
    </>
  );
}

