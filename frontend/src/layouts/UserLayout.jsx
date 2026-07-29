import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function UserLayout({ children, onOpenModal, theme, onToggleTheme }) {
  return (
    <div className="app-shell">
      <Navbar onOpenModal={onOpenModal} theme={theme} onToggleTheme={onToggleTheme} />
      {children}
      <Footer />
    </div>
  );
}

