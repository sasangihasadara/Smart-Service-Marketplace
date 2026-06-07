import HeroSection from "../../components/sections/HeroSection";
import SearchSection from "../../components/sections/SearchSection";
import CategoriesSection from "../../components/sections/CategoriesSection";
import HowItWorksSection from "../../components/sections/HowItWorksSection";
import ProvidersSection from "../../components/sections/ProvidersSection";
import BookingSection from "../../components/sections/BookingSection";
import PaymentSection from "../../components/sections/PaymentSection";
import TestimonialsSection from "../../components/sections/TestimonialsSection";
import RegisterSection from "../../components/sections/RegisterSection";
import Footer from "../../components/Footer";

export default function UserHomePage({ onOpenModal, onToast, paymentMethod, setPaymentMethod }) {
  return (
    <>
      <HeroSection />
      <SearchSection onToast={onToast} />
      <CategoriesSection onToast={onToast} />
      <HowItWorksSection />
      <ProvidersSection onOpenModal={onOpenModal} />
      <BookingSection />
      <PaymentSection paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} onToast={onToast} />
      <TestimonialsSection />
      <RegisterSection onOpenModal={onOpenModal} />
      <Footer />
    </>
  );
}
