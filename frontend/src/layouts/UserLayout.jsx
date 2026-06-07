import Navbar from "../components/Navbar";

export default function UserLayout({ children, onOpenModal }) {
  return (
    <div className="app-shell">
      <Navbar onOpenModal={onOpenModal} />
      {children}
    </div>
  );
}

