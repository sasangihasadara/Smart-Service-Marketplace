import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import RouteGuard from "./components/RouteGuard";
import ServicesPage from "./pages/user/ServicesPage";
import ProvidersPage from "./pages/user/ProvidersPage";
import BookingPage from "./pages/user/BookingPage";
import PaymentPage from "./pages/user/PaymentPage";
import TestimonialsPage from "./pages/user/TestimonialsPage";
import RegisterPage from "./pages/user/RegisterPage";
import ResearchPage from "./pages/user/ResearchPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import Modal from "./components/Modal";
import Toast from "./components/Toast";
import { modalDefaults } from "./data/serveiqData";

function AppShell() {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null);
  const [modalTab, setModalTab] = useState("customer");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [toast, setToast] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".fade-up").forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message, icon = "✅") => {
    setToast({ message, icon });
  };

  const openModal = (type) => {
    setModalType(type);
    setModalTab(modalDefaults[type] || "customer");
  };

  const closeModal = () => setModalType(null);

  const goToRegister = () => {
    closeModal();
    navigate("/register");
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    navigate("/services");

    window.requestAnimationFrame(() => {
      document.getElementById("providers")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleSignIn = () => {
    const role = modalTab === "admin" ? "admin" : modalTab === "provider" ? "provider" : "customer";
    localStorage.setItem("serveiq_role", role);
    closeModal();
    showToast(`Signed in as ${role}.`, "✅");

    if (role === "admin") {
      navigate("/admin");
      return;
    }

    navigate(role === "provider" ? "/providers" : "/services");
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/services" replace />} />
        <Route path="/user" element={<Navigate to="/services" replace />} />
        <Route
          path="/services"
          element={
            <UserLayout onOpenModal={openModal}>
              <ServicesPage
                onToast={showToast}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                onOpenModal={openModal}
              />
            </UserLayout>
          }
        />
        <Route
          path="/providers"
          element={
            <UserLayout onOpenModal={openModal}>
              <ProvidersPage onOpenModal={openModal} />
            </UserLayout>
          }
        />
        <Route
          path="/booking"
          element={
            <UserLayout onOpenModal={openModal}>
              <BookingPage />
            </UserLayout>
          }
        />
        <Route
          path="/payment"
          element={
            <UserLayout onOpenModal={openModal}>
              <PaymentPage
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                onToast={showToast}
              />
            </UserLayout>
          }
        />
        <Route
          path="/testimonials"
          element={
            <UserLayout onOpenModal={openModal}>
              <TestimonialsPage />
            </UserLayout>
          }
        />
        <Route
          path="/register"
          element={
            <UserLayout onOpenModal={openModal}>
              <RegisterPage onOpenModal={openModal} />
            </UserLayout>
          }
        />
        <Route
          path="/research"
          element={
            <UserLayout onOpenModal={openModal}>
              <ResearchPage />
            </UserLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <RouteGuard allowedRole="admin">
              <AdminLayout onToast={showToast}>
                <AdminDashboardPage />
              </AdminLayout>
            </RouteGuard>
          }
        />
        <Route path="*" element={<Navigate to="/services" replace />} />
      </Routes>

      <Modal
        modalType={modalType}
        modalTab={modalTab}
        setModalTab={setModalTab}
        onClose={closeModal}
        onOpenModal={openModal}
        onToast={showToast}
        onSignIn={handleSignIn}
        onGoToRegister={goToRegister}
      />
      <Toast toast={toast} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
