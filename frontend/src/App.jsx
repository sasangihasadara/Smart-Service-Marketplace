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
import AuthPage from "./pages/user/AuthPage";
import CategoryPage from "./pages/user/CategoryPage";
import ResearchPage from "./pages/user/ResearchPage";
import ProviderDashboardPage from "./pages/provider/ProviderDashboardPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminBookingsPage from "./pages/admin/AdminBookingsPage";
import AdminProvidersPage from "./pages/admin/AdminProvidersPage";
import AdminFraudPage from "./pages/admin/AdminFraudPage";
import Modal from "./components/Modal";
import Toast from "./components/Toast";
import { modalDefaults } from "./data/serveiqData";
import { postJson } from "./api/adminApi";

const THEME_STORAGE_KEY = "serveiq_theme_v2";

function AppShell() {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null);
  const [modalTab, setModalTab] = useState("customer");
  const [modalContext, setModalContext] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [latestBooking, setLatestBooking] = useState(null);
  const [latestUser, setLatestUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

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
    navigate(`/register?mode=register&role=${modalTab === "provider" ? "provider" : "customer"}`);
  };

  const handleSignIn = async ({ email, password, role }) => {
    const result = await postJson("/auth/login", { email, password, role });
    localStorage.setItem("serveiq_role", result.role);
    localStorage.setItem("serveiq_email", result.email);
    localStorage.setItem("serveiq_status", result.status || "active");
    setLatestUser(result);
    closeModal();
    showToast(result.message || `Signed in as ${result.role}.`);

    if (result.role === "admin") {
      navigate("/admin");
      return;
    }

    if (result.role === "provider" && result.status !== "active") {
      showToast("Your provider account is waiting for admin approval.");
      navigate("/login?mode=login&role=provider&notice=pending");
      return;
    }

    navigate(result.role === "provider" ? "/provider/dashboard" : "/services");
  };

  const handleRegister = async (form) => {
    const result = await postJson("/auth/register", form);
    localStorage.setItem("serveiq_role", result.role);
    localStorage.setItem("serveiq_email", result.email);
    localStorage.setItem("serveiq_status", result.status || "active");
    setLatestUser(result);
    closeModal();
    showToast(result.role === "provider" ? "Account created. Await admin approval." : result.message || "Account created.");

    if (result.role === "provider") {
      navigate("/login?mode=login&role=provider&notice=pending");
      return;
    }

    if (result.role === "admin") {
      navigate("/admin");
      return;
    }

    navigate("/services");
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
    setLatestBooking((current) =>
      current
        ? {
            ...current,
            paymentStatus: result.status,
            paymentReference: result.paymentReference,
            paymentMethod: result.method || current.paymentMethod || paymentMethod,
          }
        : current
    );
    return result;
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/services" replace />} />
        <Route path="/user" element={<Navigate to="/services" replace />} />
        <Route
          path="/auth"
          element={
            <UserLayout onOpenModal={openModal} theme={theme} onToggleTheme={toggleTheme}>
              <AuthPage onToast={showToast} onSignIn={handleSignIn} onRegister={handleRegister} />
            </UserLayout>
          }
        />
        <Route
          path="/login"
          element={
            <UserLayout onOpenModal={openModal} theme={theme} onToggleTheme={toggleTheme}>
              <AuthPage initialMode="login" initialRole="customer" onToast={showToast} onSignIn={handleSignIn} onRegister={handleRegister} />
            </UserLayout>
          }
        />
        <Route
          path="/register"
          element={
            <UserLayout onOpenModal={openModal} theme={theme} onToggleTheme={toggleTheme}>
              <AuthPage initialMode="register" initialRole="provider" onToast={showToast} onSignIn={handleSignIn} onRegister={handleRegister} />
            </UserLayout>
          }
        />
        <Route
          path="/services"
          element={
            <UserLayout onOpenModal={openModal} theme={theme} onToggleTheme={toggleTheme}>
              <ServicesPage onToast={showToast} onSearch={handleSearch} />
            </UserLayout>
          }
        />
        <Route
          path="/category/:slug"
          element={
            <UserLayout onOpenModal={openModal} theme={theme} onToggleTheme={toggleTheme}>
              <CategoryPage onOpenModal={openModal} />
            </UserLayout>
          }
        />
        <Route
          path="/providers"
          element={
            <UserLayout onOpenModal={openModal} theme={theme} onToggleTheme={toggleTheme}>
              <ProvidersPage onOpenModal={openModal} />
            </UserLayout>
          }
        />
        <Route path="/provider" element={<Navigate to="/provider/dashboard" replace />} />
        <Route
          path="/provider/dashboard"
          element={
            <RouteGuard allowedRole="provider">
              <UserLayout onOpenModal={openModal} theme={theme} onToggleTheme={toggleTheme}>
                <ProviderDashboardPage />
              </UserLayout>
            </RouteGuard>
          }
        />
        <Route
          path="/booking"
          element={
            <UserLayout onOpenModal={openModal} theme={theme} onToggleTheme={toggleTheme}>
              <BookingPage onOpenModal={openModal} />
            </UserLayout>
          }
        />
        <Route
          path="/payment"
          element={
            <UserLayout onOpenModal={openModal} theme={theme} onToggleTheme={toggleTheme}>
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
            <UserLayout onOpenModal={openModal} theme={theme} onToggleTheme={toggleTheme}>
              <TestimonialsPage />
            </UserLayout>
          }
        />
        <Route
          path="/research"
          element={
            <UserLayout onOpenModal={openModal} theme={theme} onToggleTheme={toggleTheme}>
              <ResearchPage />
            </UserLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <RouteGuard allowedRole="admin">
              <AdminLayout onToast={showToast} theme={theme} onToggleTheme={toggleTheme} />
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
