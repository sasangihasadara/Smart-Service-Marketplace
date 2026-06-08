import HeroSection from "../../components/sections/HeroSection";
import SearchSection from "../../components/sections/SearchSection";
import CategoriesSection from "../../components/sections/CategoriesSection";
import HowItWorksSection from "../../components/sections/HowItWorksSection";
import Footer from "../../components/Footer";

export default function ServicesPage({ onToast, onSearch }) {
  return (
    <>
      <HeroSection />
      <SearchSection onToast={onToast} onSearch={onSearch} />
      <CategoriesSection onToast={onToast} />
      <HowItWorksSection />
      <Footer />
    </>
  );
}
