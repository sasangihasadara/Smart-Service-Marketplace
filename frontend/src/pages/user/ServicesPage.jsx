import HeroSection from "../../components/sections/HeroSection";
import SearchSection from "../../components/sections/SearchSection";
import CategoriesSection from "../../components/sections/CategoriesSection";
import HowItWorksSection from "../../components/sections/HowItWorksSection";
import ProvidersSection from "../../components/sections/ProvidersSection";
import Footer from "../../components/Footer";

export default function ServicesPage({ onToast, selectedCategory, onCategorySelect, onOpenModal }) {
  return (
    <>
      <HeroSection />
      <SearchSection onToast={onToast} />
      <CategoriesSection
        onToast={onToast}
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
      />
      <HowItWorksSection />
      <ProvidersSection onOpenModal={onOpenModal} selectedCategory={selectedCategory} />
      <Footer />
    </>
  );
}
