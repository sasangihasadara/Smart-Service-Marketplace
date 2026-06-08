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
import CategoryPage from "./pages/user/CategoryPage";
import ResearchPage from "./pages/user/ResearchPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminBookingsPage from "./pages/admin/AdminBookingsPage";
import AdminProvidersPage from "./pages/admin/AdminProvidersPage";
import AdminFraudPage from "./pages/admin/AdminFraudPage";
import Modal from "./components/Modal";
import Toast from "./components/Toast";
import { modalDefaults } from "./data/serveiqData";
import { postJson } from "./api/adminApi";

function AppShell() {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null);
  const [modalTab, setModalTab] = useState("customer");
  const [modalContext, setModalContext] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [latestBooking, setLatestBooking] = useState(null);
  const [latestUser, setLatestUser] = useState(null);
  const [toast, setToast] = useState(null);

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

  const openModal = (type, context = {}) => {
    setModalType(type);
    setModalContext(context);
    setModalTab(modalDefaults[type] || "customer");
  };

  const closeModal = () => {
    setModalType(null);
    setModalContext({});
  };

  const goToRegister = () => {
    closeModal();
    navigate("/register");
  };

  const handleSignIn = async ({ email, password, role }) => {
    const result = await postJson("/auth/login", { email, password, role });
    localStorage.setItem("serveiq_role", result.role);
    localStorage.setItem("serveiq_email", result.email);
    setLatestUser(result);
    closeModal();
    showToast(result.message || `Signed in as ${result.role}.`);

    if (result.role === "admin") {
      navigate("/admin");
      return;
    }

    navigate(result.role === "provider" ? "/providers" : "/services");
  };

  const handleRegister = async (form) => {
    const result = await postJson("/auth/register", form);
    localStorage.setItem("serveiq_role", result.role);
    localStorage.setItem("serveiq_email", result.email);
    setLatestUser(result);
    closeModal();
    showToast(result.message || "Account created.");

    navigate(result.role === "provider" ? "/providers" : "/services");
  };

  const handleBooking = async (form) => {
    const result = await postJson("/bookings", {
      ...form,
      paymentMethod: form.paymentMethod || paymentMethod,
    });

    setLatestBooking(result);
    closeModal();
    showToast(result.message || "Booking saved.");
    navigate("/payment");
  };

  const handleSearch = async (form) => {
    const result = await postJson("/searches", form);
    showToast(result.message || "Search saved.");
    return result;
  };

  const handlePay = async (form) => {
    const bookingCode = latestBooking?.bookingCode || form.bookingCode;

    if (!bookingCode) {
      throw new Error("Save a booking first.");
    }

    const result = await postJson("/payments", {
      bookingCode,
      payerName: form.payerName,
      payerEmail: form.payerEmail,
      method: form.method || paymentMethod,
      amount: form.amount,
    });

    showToast(result.message || "Payment recorded.");
    navigate("/services");
    return result;
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
              <ServicesPage onToast={showToast} onSearch={handleSearch} />
            </UserLayout>
          }
        />
        <Route
          path="/category/:slug"
          element={
            <UserLayout onOpenModal={openModal}>
              <CategoryPage onOpenModal={openModal} />
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
                booking={latestBooking}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                onToast={showToast}
                onPay={handlePay}
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
              <AdminLayout onToast={showToast} />
            </RouteGuard>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="providers" element={<AdminProvidersPage />} />
          <Route path="fraud" element={<AdminFraudPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/services" replace />} />
      </Routes>

      <Modal
        modalType={modalType}
        modalTab={modalTab}
        setModalTab={setModalTab}
        modalContext={modalContext}
        onClose={closeModal}
        onOpenModal={openModal}
        onToast={showToast}
        onGoToRegister={goToRegister}
        onSignIn={handleSignIn}
        onRegister={handleRegister}
        onBook={handleBooking}
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
