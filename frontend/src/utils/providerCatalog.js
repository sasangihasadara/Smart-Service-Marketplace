import { useEffect, useState } from "react";
import { getJson } from "../api/adminApi";
import { serviceCategoryPages } from "../data/serveiqData";

const providerPalette = [
  "#5B4EFF",
  "#00D4AA",
  "#FF6B6B",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#10B981",
  "#14B8A6",
  "#3B82F6",
  "#2563EB",
];

const categoryTitleMap = {
  Electricians: "Master Electrician",
  Plumbers: "Senior Plumber",
  "AC Technicians": "AC Technician",
  Tutors: "Private Tutor",
  Cleaners: "Cleaning Specialist",
  Photographers: "Event Photographer",
  Carpenters: "Carpenter",
  Painters: "Painter",
  "Home Cooks": "Home Cook",
  Drivers: "Driver",
  "IT Support": "IT Support Engineer",
  Gardeners: "Gardener",
};

const categoryLookup = new Map();

for (const category of serviceCategoryPages) {
  const name = category.name.trim().toLowerCase();
  categoryLookup.set(name, category.name);
  categoryLookup.set(singularize(category.name).toLowerCase(), category.name);
  categoryLookup.set(category.slug.trim().toLowerCase(), category.name);
}

export async function fetchPublicProviders() {
  return getJson("/providers");
}

export function singularize(value) {
  const text = String(value || "").trim();
  return text.endsWith("s") ? text.slice(0, -1) : text;
}

export function resolveCategoryName(value) {
  const text = String(value || "").trim();
  if (!text) {
    return "";
  }

  return categoryLookup.get(text.toLowerCase()) || text;
}

export function getCategorySlug(categoryName) {
  const resolved = resolveCategoryName(categoryName);
  const match = serviceCategoryPages.find((category) => category.name.toLowerCase() === resolved.toLowerCase());
  return match ? match.slug : "services";
}

export function createInitials(name) {
  const initials = String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "SI";
}

export function parseInteger(value) {
  const parsed = Number.parseInt(String(value || "").replace(/[^0-9-]/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function parseDecimal(value) {
  const parsed = Number.parseFloat(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatCurrency(amount) {
  return `LKR ${Number(amount || 0).toLocaleString("en-US")}`;
}

export function extractPriceParts(priceText, unitFallback = "/hr") {
  const raw = String(priceText || "").trim();
  const amount = parseInteger(raw);
  const unitMatch = raw.match(/\/[a-zA-Z]+$/);
  const unit = unitMatch ? unitMatch[0] : unitFallback;

  return {
    amount,
    label: amount > 0 ? formatCurrency(amount) : raw || formatCurrency(0),
    unit,
  };
}

export function buildProviderTitle(categoryName) {
  const resolved = resolveCategoryName(categoryName);
  return categoryTitleMap[resolved] || `${singularize(resolved) || "Service"} Specialist`;
}

export function buildProviderDetails(provider) {
  const resolvedCategory = resolveCategoryName(provider.category || provider.serviceCategory || "");
  const jobsValue = provider.jobsValue ?? parseInteger(provider.jobs ?? provider.jobsCompleted ?? provider.totalJobs);
  const completionRate = provider.completionRate || provider.complete || "100%";

  return `${resolvedCategory || "Service"} professional - ${jobsValue.toLocaleString("en-US")} jobs completed - ${completionRate} completion`;
}

export function normalizeProvider(provider, index = 0) {
  const resolvedCategory = resolveCategoryName(provider.category || provider.serviceCategory || "");
  const priceParts = extractPriceParts(provider.price || provider.priceText || "", provider.unit || "/hr");
  const jobsValue = parseInteger(provider.jobs ?? provider.jobsCompleted ?? provider.totalJobs);
  const ratingValue = parseDecimal(provider.rating ?? provider.ratingText);
  const name = provider.name || [provider.firstName, provider.lastName].filter(Boolean).join(" ").trim() || "Provider";
  const status = String(provider.status || provider.statusText || "active").toLowerCase();
  const completionRate = provider.completionRate || provider.complete || "100%";
  const title = provider.title || buildProviderTitle(resolvedCategory);
  const details = buildProviderDetails({
    ...provider,
    category: resolvedCategory,
    jobsValue,
    completionRate,
  });

  return {
    ...provider,
    id: provider.id,
    name,
    category: resolvedCategory || provider.category || provider.serviceCategory || "Services",
    categorySlug: getCategorySlug(resolvedCategory || provider.category || provider.serviceCategory || ""),
    title,
    details,
    initials: provider.initials || createInitials(name),
    color: provider.color || providerPalette[index % providerPalette.length],
    ratingValue,
    rating: provider.rating ? `${ratingValue.toFixed(1)}*` : `${ratingValue.toFixed(1)}*`,
    jobsValue,
    jobs: jobsValue.toLocaleString("en-US"),
    completionRate,
    complete: completionRate,
    priceValue: priceParts.amount,
    price: priceParts.label,
    unit: priceParts.unit,
    status,
    reviewedAt: provider.reviewedAt || null,
    reviewNote: provider.reviewNote || "",
    isActive: status === "active",
    searchText: [
      name,
      title,
      resolvedCategory,
      details,
      priceParts.label,
      priceParts.unit,
      status,
      completionRate,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  };
}

export function buildBookingContext(provider, overrides = {}) {
  const normalized = normalizeProvider(provider, 0);
  const serviceFee = overrides.serviceFee ?? Math.max(Math.round((normalized.priceValue || 2500) * 2.5), 2500);
  const callOutFee = overrides.callOutFee ?? 1250;

  return {
    serviceRequired: overrides.serviceRequired ?? normalized.category,
    providerName: overrides.providerName ?? normalized.name,
    bookingDate: overrides.bookingDate ?? "",
    bookingTime: overrides.bookingTime ?? "",
    location: overrides.location ?? "",
    description: overrides.description ?? "",
    customerName: overrides.customerName ?? "",
    customerEmail: overrides.customerEmail ?? "",
    customerPhone: overrides.customerPhone ?? "",
    serviceFee,
    callOutFee,
    totalAmount: serviceFee + callOutFee,
    paymentMethod: overrides.paymentMethod ?? "card",
  };
}

export function useLiveProviders(fallbackProviders = []) {
  const [state, setState] = useState(() => ({
    providers: fallbackProviders.map((provider, index) => normalizeProvider(provider, index)),
    loading: true,
    error: "",
    source: "loading",
  }));

  useEffect(() => {
    let active = true;

    async function loadProviders() {
      setState((current) => ({ ...current, loading: true, error: "" }));

      try {
        const response = await fetchPublicProviders();
        if (!active) {
          return;
        }

        const normalized = Array.isArray(response) ? response.map((provider, index) => normalizeProvider(provider, index)) : [];
        setState({
          providers: normalized.length > 0 ? normalized : fallbackProviders.map((provider, index) => normalizeProvider(provider, index)),
          loading: false,
          error: normalized.length > 0 ? "" : "No active providers were returned from the backend.",
          source: normalized.length > 0 ? "live" : "fallback",
        });
      } catch (error) {
        if (!active) {
          return;
        }

        setState({
          providers: fallbackProviders.map((provider, index) => normalizeProvider(provider, index)),
          loading: false,
          error: "Showing demo providers while live data is unavailable.",
          source: "fallback",
        });
      }
    }

    loadProviders();

    return () => {
      active = false;
    };
  }, [fallbackProviders]);

  return state;
}
