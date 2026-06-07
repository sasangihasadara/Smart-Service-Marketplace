import ProvidersSection from "../../components/sections/ProvidersSection";
import Footer from "../../components/Footer";

export default function ProvidersPage({ onOpenModal }) {
  return (
    <>
      <ProvidersSection onOpenModal={onOpenModal} />
      <Footer />
    </>
  );
}

