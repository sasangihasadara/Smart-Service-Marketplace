import RegisterSection from "../../components/sections/RegisterSection";
import Footer from "../../components/Footer";

export default function RegisterPage({ onOpenModal }) {
  return (
    <>
      <RegisterSection onOpenModal={onOpenModal} />
      <Footer />
    </>
  );
}

