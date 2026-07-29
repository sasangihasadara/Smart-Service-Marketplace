import PaymentSection from "../../components/sections/PaymentSection";

export default function PaymentPage({ booking, paymentMethod, setPaymentMethod, onToast, onPay }) {
  return (
    <>
      <PaymentSection
        booking={booking}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        onToast={onToast}
        onPay={onPay}
      />
    </>
  );
}
