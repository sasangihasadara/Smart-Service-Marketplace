export const serviceCategories = [
  ["Electricians", "⚡", "842 providers"],
  ["Plumbers", "🔧", "631 providers"],
  ["AC Technicians", "❄️", "412 providers"],
  ["Tutors", "📚", "1,204 providers"],
  ["Cleaners", "🧹", "988 providers"],
  ["Photographers", "📸", "376 providers"],
  ["Carpenters", "🏗️", "529 providers"],
  ["Painters", "🎨", "445 providers"],
  ["Home Cooks", "🍳", "312 providers"],
  ["Drivers", "🚗", "678 providers"],
  ["IT Support", "💻", "284 providers"],
  ["Gardeners", "🌿", "198 providers"],
];

export const heroMatches = [
  { initials: "KP", name: "Kasun Perera", role: "Electrician · 8 yrs exp", score: 97, color: "#5B4EFF", stars: "★★★★★" },
  { initials: "AS", name: "Amali Silva", role: "Home Cleaner · 5 yrs exp", score: 94, color: "#00D4AA", stars: "★★★★★" },
  { initials: "RF", name: "Ravi Fernando", role: "Plumber · 12 yrs exp", score: 89, color: "#FF6B6B", stars: "★★★★☆" },
  { initials: "NJ", name: "Nimal Jayasena", role: "AC Technician · 6 yrs exp", score: 85, color: "#F59E0B", stars: "★★★★☆" },
];

export const howItWorks = [
  { num: "01", icon: "🔍", title: "Search & Filter", desc: "Enter the service you need and your location. Our smart filters allow you to narrow down by price, availability, rating, and more.", color: "rgba(91,78,255,0.2)" },
  { num: "02", icon: "🤖", title: "AI Matches You", desc: "Our Intelligent Provider Matching Engine analyzes 9+ factors in real-time to recommend the best-fit providers for your specific needs.", color: "rgba(0,212,170,0.2)" },
  { num: "03", icon: "📋", title: "Compare & Book", desc: "View detailed provider profiles, read verified reviews, check availability on the live calendar, and book with a single tap.", color: "rgba(255,107,107,0.2)" },
  { num: "04", icon: "💳", title: "Pay Securely", desc: "Transactions are processed through PayHere with SSL encryption. Pay advance or full - refunds handled automatically.", color: "rgba(245,158,11,0.2)" },
  { num: "05", icon: "✅", title: "Service Delivered", desc: "Receive real-time SMS and email notifications. Rate your provider after completion to help the AI learn and improve recommendations.", color: "rgba(16,185,129,0.2)" },
  { num: "06", icon: "📊", title: "Track Everything", desc: "Your booking history, invoices, payment receipts, and service records - all accessible from your personal dashboard.", color: "rgba(99,102,241,0.2)" },
];

export const aiFactors = [
  ["Provider Rating", 92, "#5B4EFF"],
  ["Completion Rate", 85, "#5B4EFF"],
  ["Response Time", 78, "#00D4AA"],
  ["Distance", 72, "#00D4AA"],
  ["Years Experience", 68, "#F59E0B"],
  ["Price Competitiveness", 63, "#F59E0B"],
  ["Availability", 58, "#FF6B6B"],
  ["Review Sentiment", 54, "#FF6B6B"],
  ["Customer Preferences", 48, "#8B5CF6"],
];

export const aiFeatures = [
  {
    icon: "🎯",
    title: "Multi-Factor Scoring Algorithm",
    desc: "Weighted ensemble scoring using ratings, experience, completion rate, response time, distance, pricing, and real-time availability - all normalised and ranked.",
  },
  {
    icon: "🧠",
    title: "Collaborative Filtering",
    desc: "Learns from similar customer preferences and booking patterns to improve recommendations over time using matrix factorization techniques.",
  },
  {
    icon: "📈",
    title: "Continuous Model Retraining",
    desc: "Model accuracy improves automatically as new booking data flows in - evaluated using Precision@K, NDCG, and MAP metrics.",
  },
];

export const topProviders = [
  {
    initials: "KP",
    color: "#5B4EFF",
    name: "Kasun Perera",
    title: "Master Electrician",
    category: "Electricians",
    details: "🔌 Wiring • Solar • Industrial · 8 years exp",
    rating: "4.9★",
    jobs: "847",
    complete: "99%",
    price: "LKR 2,500",
    unit: "/hr",
  },
  {
    initials: "AS",
    color: "#00D4AA",
    name: "Amali Silva",
    title: "Home Cleaning Specialist",
    category: "Cleaners",
    details: "🧹 Deep Clean • Post-Renovation • Office · 5 years exp",
    rating: "4.8★",
    jobs: "623",
    complete: "97%",
    price: "LKR 1,800",
    unit: "/hr",
  },
  {
    initials: "RF",
    color: "#FF6B6B",
    name: "Ravi Fernando",
    title: "Senior Plumber",
    category: "Plumbers",
    details: "🚿 Pipes • Drainage • HVAC Plumbing · 12 years exp",
    rating: "4.7★",
    jobs: "1,041",
    complete: "96%",
    price: "LKR 3,000",
    unit: "/hr",
  },
  {
    initials: "NJ",
    color: "#F59E0B",
    name: "Nimal Jayasena",
    title: "AC Technician",
    category: "AC Technicians",
    details: "❄️ AC installation • servicing • repairs · 6 years exp",
    rating: "4.8★",
    jobs: "512",
    complete: "95%",
    price: "LKR 2,200",
    unit: "/hr",
  },
  {
    initials: "ST",
    color: "#8B5CF6",
    name: "Supun Tharaka",
    title: "Private Tutor",
    category: "Tutors",
    details: "📚 Maths • Science • English · 7 years exp",
    rating: "5.0★",
    jobs: "389",
    complete: "98%",
    price: "LKR 2,000",
    unit: "/hr",
  },
  {
    initials: "PW",
    color: "#EC4899",
    name: "Pabasara Weerasinghe",
    title: "Event Photographer",
    category: "Photographers",
    details: "📸 Weddings • Events • Portraits · 9 years exp",
    rating: "4.9★",
    jobs: "214",
    complete: "94%",
    price: "LKR 8,500",
    unit: "/session",
  },
  {
    initials: "MK",
    color: "#10B981",
    name: "Malinga Karunarathna",
    title: "Carpenter",
    category: "Carpenters",
    details: "🏗️ Furniture • Repair • Custom work · 11 years exp",
    rating: "4.7★",
    jobs: "601",
    complete: "96%",
    price: "LKR 3,400",
    unit: "/hr",
  },
  {
    initials: "RP",
    color: "#14B8A6",
    name: "Ruwan Perera",
    title: "Painter",
    category: "Painters",
    details: "🎨 Interior • Exterior • Finishing · 10 years exp",
    rating: "4.8★",
    jobs: "455",
    complete: "97%",
    price: "LKR 2,800",
    unit: "/hr",
  },
  {
    initials: "DL",
    color: "#3B82F6",
    name: "Dinesh Lakmal",
    title: "IT Support Engineer",
    category: "IT Support",
    details: "💻 Hardware • Network • Software · 8 years exp",
    rating: "4.9★",
    jobs: "338",
    complete: "99%",
    price: "LKR 4,000",
    unit: "/hr",
  },
];

export const fraudAlerts = [
  { type: "high", icon: "🚫", title: "Fake Review Cluster Detected", desc: "5 reviews from same IP · Sentiment anomaly", score: "98.2%" },
  { type: "high", icon: "👥", title: "Duplicate Account Flagged", desc: "Device fingerprint matches banned user", score: "94.7%" },
  { type: "medium", icon: "⚠️", title: "Unusual Booking Pattern", desc: "23 bookings in 30 min · likely bot activity", score: "81.3%" },
  { type: "medium", icon: "💰", title: "Payment Anomaly Detected", desc: "Multiple failed transactions from same card", score: "73.5%" },
  { type: "low", icon: "✅", title: "Review Verified Authentic", desc: "NLP analysis passed · Sentiment consistent", score: "Safe" },
];

export const bookingFlow = [
  { icon: "🔍", title: "Search & Match", desc: "AI recommends best providers based on your location, budget, and preferences", color: "rgba(91,78,255,0.15)", border: "rgba(91,78,255,0.4)" },
  { icon: "📅", title: "Select Slot", desc: "Choose from provider's real-time available time slots via live calendar", color: "rgba(0,212,170,0.15)", border: "rgba(0,212,170,0.4)" },
  { icon: "💳", title: "Secure Payment", desc: "Pay advance or full via PayHere - card, bank transfer, or mobile wallet", color: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)" },
  { icon: "✅", title: "Confirmed!", desc: "Instant SMS + email confirmation with booking ID, invoice, and reminders", color: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.4)" },
];

export const paymentFeatures = [
  { icon: "🔒", title: "SSL/TLS Encrypted", desc: "All payment data transmitted via PayHere's PCI-DSS compliant gateway" },
  { icon: "🔄", title: "Refund Management", desc: "Automated refund processing with admin approval workflow and audit trail" },
  { icon: "🧾", title: "Invoice Generation", desc: "Auto-generated PDF invoices sent via email on every successful booking" },
  { icon: "📊", title: "Transaction History", desc: "Full payment history with filtering, export to CSV, and monthly statements" },
];

export const kpis = [
  { label: "Total Revenue", value: "LKR 2.4M", change: "↑ 18.2% vs last month", trend: "up" },
  { label: "Bookings", value: "8,421", change: "↑ 12.7% vs last month", trend: "up" },
  { label: "Active Users", value: "14,203", change: "↑ 9.4% vs last month", trend: "up" },
  { label: "Fraud Blocked", value: "247", change: "↑ 31 new this week", trend: "down" },
];

export const chartData = [45, 58, 72, 65, 89, 94, 78, 102, 115, 88, 130, 142];
export const chartColors = ["#5B4EFF", "#5B4EFF", "#5B4EFF", "#00D4AA", "#00D4AA", "#00D4AA", "#5B4EFF", "#5B4EFF", "#00D4AA", "#00D4AA", "#5B4EFF", "#5B4EFF"];

export const recentBookings = [
  ["#BK-8421", "Nimali R.", "Electrical Repair", "Kasun P.", "LKR 7,500", "Completed"],
  ["#BK-8420", "Saman K.", "Home Cleaning", "Amali S.", "LKR 4,200", "Pending"],
  ["#BK-8419", "Priya M.", "Plumbing Repair", "Ravi F.", "LKR 5,800", "Completed"],
  ["#BK-8418", "Dhanush L.", "AC Service", "Nimal J.", "LKR 3,500", "Cancelled"],
  ["#BK-8417", "Kavya T.", "Photography", "Supun W.", "LKR 12,000", "Completed"],
];

export const testimonials = [
  {
    initials: "NR",
    color: "#5B4EFF",
    name: "Nimali Ratnayake",
    role: "Customer · Colombo 7",
    text: "ServeIQ's AI matched me with the perfect electrician within minutes. The whole booking and payment process was seamless - I got the invoice in my email immediately.",
  },
  {
    initials: "KP",
    color: "#00D4AA",
    name: "Kasun Perera",
    role: "Electrician · ServeIQ Pro",
    text: "As a service provider, ServeIQ has completely transformed my business. I went from 5 clients to 40+ in just 3 months. The platform is professional and the payments arrive on time.",
  },
  {
    initials: "AS",
    color: "#FF6B6B",
    name: "Amali Silva",
    role: "Cleaner · ServeIQ Provider",
    text: "The fraud detection is real - a fake review was removed within hours when I reported it. The platform genuinely cares about fairness for honest providers. Highly recommend!",
  },
];

export const registerFeatures = [
  "Free to Register",
  "AI-Powered Visibility",
  "Secure Payments",
  "24/7 Support",
  "Performance Analytics",
];

export const techCategories = [
  {
    title: "Frontend",
    items: [
      ["React 18", "#61DAFB"],
      ["Tailwind CSS", "#38B2AC"],
      ["JavaScript ES6", "#F0DB4F"],
      ["Redux Toolkit", "#EF4444"],
      ["Axios", "#7C3AED"],
    ],
  },
  {
    title: "Backend",
    items: [
      ["Spring Boot 3", "#6DB33F"],
      ["Spring Security", "#6DB33F"],
      ["Java 17", "#007396"],
      ["JWT Auth", "#F7B731"],
      ["REST APIs", "#00ADD8"],
    ],
  },
  {
    title: "AI / ML",
    items: [
      ["Scikit-learn", "#F7931E"],
      ["Pandas", "#150458"],
      ["Python 3.11", "#3776AB"],
      ["NumPy", "#EE4C2C"],
      ["NLTK / NLP", "#8A2BE2"],
    ],
  },
  {
    title: "Database",
    items: [
      ["MySQL 8", "#4479A1"],
      ["Hibernate ORM", "#6DB33F"],
      ["Redis Cache", "#DC382D"],
      ["Liquibase", "#003B57"],
      ["Connection Pool", "#00758F"],
    ],
  },
  {
    title: "Infrastructure",
    items: [
      ["AWS EC2", "#FF9900"],
      ["Docker", "#2496ED"],
      ["PayHere API", "#4285F4"],
      ["Gmail SMTP", "#EA4335"],
      ["Twilio SMS", "#25D366"],
    ],
  },
];

export const modalDefaults = {
  login: "customer",
  register: "provider",
  booking: "booking",
};

export const serviceCategoryPages = [
  {
    slug: "electricians",
    name: "Electricians",
    icon: "⚡",
    headline: "Power, wiring, repairs, and safe electrical work done right.",
    description:
      "Book verified electricians for home wiring, solar connections, circuit repairs, appliance issues, and emergency electrical support.",
    accent: "#5B4EFF",
    stats: {
      providers: 842,
      rating: "4.9★",
      avgPrice: "LKR 2,500",
      response: "< 10 min",
    },
    benefits: [
      "Emergency fault detection",
      "Certified safety-first work",
      "Home, office, and industrial support",
    ],
  },
  {
    slug: "plumbers",
    name: "Plumbers",
    icon: "🔧",
    headline: "Leak fixes, pipe installation, drainage, and water system care.",
    description:
      "Find experienced plumbers for leak repairs, drainage issues, bathroom fittings, pipe replacement, and urgent water problems.",
    accent: "#00D4AA",
    stats: {
      providers: 631,
      rating: "4.8★",
      avgPrice: "LKR 3,000",
      response: "< 12 min",
    },
    benefits: [
      "Leak detection and repair",
      "Drainage and bathroom solutions",
      "Trusted for home and office plumbing",
    ],
  },
  {
    slug: "ac-technicians",
    name: "AC Technicians",
    icon: "❄️",
    headline: "Fast AC installation, servicing, and cooling system repairs.",
    description:
      "Book AC technicians for installation, gas refills, maintenance, filter cleaning, compressor issues, and seasonal servicing.",
    accent: "#F59E0B",
    stats: {
      providers: 412,
      rating: "4.8★",
      avgPrice: "LKR 2,200",
      response: "< 15 min",
    },
    benefits: [
      "Preventive AC maintenance",
      "Fast diagnostic support",
      "Residential and commercial service",
    ],
  },
  {
    slug: "tutors",
    name: "Tutors",
    icon: "📚",
    headline: "Personalized learning support for school, university, and skills.",
    description:
      "Discover tutors for maths, science, languages, coding, exam prep, and one-to-one academic improvement.",
    accent: "#8B5CF6",
    stats: {
      providers: 1204,
      rating: "5.0★",
      avgPrice: "LKR 2,000",
      response: "< 20 min",
    },
    benefits: [
      "Flexible online or in-person sessions",
      "Exam-focused learning plans",
      "Student progress tracking",
    ],
  },
  {
    slug: "cleaners",
    name: "Cleaners",
    icon: "🧹",
    headline: "Reliable home, office, and deep cleaning services.",
    description:
      "Hire trusted cleaners for regular housekeeping, deep cleaning, post-renovation cleanup, and office hygiene support.",
    accent: "#10B981",
    stats: {
      providers: 988,
      rating: "4.8★",
      avgPrice: "LKR 1,800",
      response: "< 8 min",
    },
    benefits: [
      "Flexible one-time or recurring jobs",
      "Deep cleaning and sanitizing",
      "Background-checked professionals",
    ],
  },
  {
    slug: "photographers",
    name: "Photographers",
    icon: "📸",
    headline: "Modern event, portrait, and commercial photography services.",
    description:
      "Book photographers for weddings, birthdays, corporate events, portraits, products, and social media content.",
    accent: "#EC4899",
    stats: {
      providers: 376,
      rating: "4.9★",
      avgPrice: "LKR 8,500",
      response: "< 30 min",
    },
    benefits: [
      "Event and portrait coverage",
      "High-resolution editing",
      "Session-based pricing options",
    ],
  },
  {
    slug: "carpenters",
    name: "Carpenters",
    icon: "🏗️",
    headline: "Furniture, repairs, custom builds, and woodwork made easy.",
    description:
      "Connect with carpenters for custom furniture, wood repairs, shelving, doors, and home improvement projects.",
    accent: "#14B8A6",
    stats: {
      providers: 529,
      rating: "4.7★",
      avgPrice: "LKR 3,400",
      response: "< 14 min",
    },
    benefits: [
      "Custom woodwork solutions",
      "Home and office repair work",
      "Design-friendly craftsmanship",
    ],
  },
  {
    slug: "painters",
    name: "Painters",
    icon: "🎨",
    headline: "Interior and exterior painting with a professional finish.",
    description:
      "Hire painters for walls, ceilings, exteriors, waterproofing, and decorative finishing with clean execution.",
    accent: "#14B8A6",
    stats: {
      providers: 445,
      rating: "4.8★",
      avgPrice: "LKR 2,800",
      response: "< 16 min",
    },
    benefits: [
      "Interior and exterior painting",
      "Color consultation options",
      "Clean and timely project completion",
    ],
  },
  {
    slug: "home-cooks",
    name: "Home Cooks",
    icon: "🍳",
    headline: "Personal chefs and home-cooked meal service on demand.",
    description:
      "Find home cooks for family meals, event catering, meal prep, and special dietary menus.",
    accent: "#F97316",
    stats: {
      providers: 312,
      rating: "4.9★",
      avgPrice: "LKR 2,000",
      response: "< 25 min",
    },
    benefits: [
      "Custom meal planning",
      "Event and family catering",
      "Dietary preferences supported",
    ],
  },
  {
    slug: "drivers",
    name: "Drivers",
    icon: "🚗",
    headline: "Safe, punctual, and flexible driver booking for daily needs.",
    description:
      "Book drivers for errands, personal trips, airport transfers, school runs, and corporate transport support.",
    accent: "#2563EB",
    stats: {
      providers: 678,
      rating: "4.8★",
      avgPrice: "LKR 2,400",
      response: "< 9 min",
    },
    benefits: [
      "Daily and long-distance rides",
      "Professional, trusted drivers",
      "Flexible booking windows",
    ],
  },
  {
    slug: "it-support",
    name: "IT Support",
    icon: "💻",
    headline: "Technical support for devices, networks, and software.",
    description:
      "Get IT support for laptops, desktops, Wi-Fi issues, software installation, troubleshooting, and office setups.",
    accent: "#3B82F6",
    stats: {
      providers: 284,
      rating: "4.9★",
      avgPrice: "LKR 4,000",
      response: "< 18 min",
    },
    benefits: [
      "Remote or on-site support",
      "Hardware and software troubleshooting",
      "Fast issue diagnosis",
    ],
  },
  {
    slug: "gardeners",
    name: "Gardeners",
    icon: "🌿",
    headline: "Gardening, landscaping, and outdoor maintenance services.",
    description:
      "Book gardeners for lawn care, trimming, planting, landscaping, and seasonal garden cleanups.",
    accent: "#22C55E",
    stats: {
      providers: 198,
      rating: "4.7★",
      avgPrice: "LKR 2,100",
      response: "< 22 min",
    },
    benefits: [
      "Lawn and garden maintenance",
      "Planting and landscaping",
      "Scheduled care or one-time jobs",
    ],
  },
];
