export const adminFallbackData = {
  overview: {
    generatedAt: "offline",
    metrics: [
      { label: "Total Revenue", value: "LKR 2.4M", trend: "up", change: "18.2% vs last month" },
      { label: "Bookings", value: "8,421", trend: "up", change: "12.7% vs last month" },
      { label: "Active Users", value: "14,203", trend: "up", change: "9.4% vs last month" },
      { label: "Fraud Blocked", value: "247", trend: "down", change: "31 new this week" }
    ],
    chart: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      values: [45, 58, 72, 65, 89, 94, 78, 102, 115, 88, 130, 142],
      series: "Monthly bookings"
    },
    recentBookings: [
      { id: "#BK-8421", customer: "Nimali R.", service: "Electrical Repair", provider: "Kasun P.", amount: "LKR 7,500", status: "Completed" },
      { id: "#BK-8420", customer: "Saman K.", service: "Home Cleaning", provider: "Amali S.", amount: "LKR 4,200", status: "Pending" },
      { id: "#BK-8419", customer: "Priya M.", service: "Plumbing Repair", provider: "Ravi F.", amount: "LKR 5,800", status: "Completed" },
      { id: "#BK-8418", customer: "Dhanush L.", service: "AC Service", provider: "Nimal J.", amount: "LKR 3,500", status: "Cancelled" },
      { id: "#BK-8417", customer: "Kavya T.", service: "Photography", provider: "Supun W.", amount: "LKR 12,000", status: "Completed" }
    ],
    activity: [
      "3 provider applications awaiting review",
      "12 bookings need manual payment confirmation",
      "5 fraud alerts were escalated in the last hour"
    ]
  },
  users: {
    generatedAt: "offline",
    summary: [
      { label: "Registered Users", value: "14,203", trend: "up", change: "1,230 new this month" },
      { label: "Verified Customers", value: "11,842", trend: "up", change: "83.4% verification rate" },
      { label: "Admin Actions", value: "148", trend: "up", change: "18 this week" }
    ],
    users: [
      { id: "USR-2041", name: "Nimali Ranathunga", role: "Customer", location: "Colombo 7", status: "Active", tier: "Gold" },
      { id: "USR-2038", name: "Kasun Perera", role: "Provider", location: "Kandy", status: "Active", tier: "Top Rated" },
      { id: "USR-2031", name: "Amali Silva", role: "Customer", location: "Galle", status: "Suspended", tier: "Risk Review" },
      { id: "USR-2027", name: "Ravi Fernando", role: "Provider", location: "Negombo", status: "Active", tier: "Verified" },
      { id: "USR-2012", name: "Supun Tharaka", role: "Provider", location: "Kurunegala", status: "Pending", tier: "Document Check" }
    ]
  },
  bookings: {
    generatedAt: "offline",
    summary: [
      { label: "Open Bookings", value: "312", trend: "up", change: "44 awaiting action" },
      { label: "Completed", value: "7,644", trend: "up", change: "91.0% completion rate" },
      { label: "Cancelled", value: "109", trend: "down", change: "1.3% cancellation rate" }
    ],
    bookings: [
      { id: "#BK-8421", service: "Electrical Repair", customer: "Nimali R.", provider: "Kasun P.", amount: "LKR 7,500", status: "Completed", paymentMethod: "PayHere", slot: "Today 10:30" },
      { id: "#BK-8420", service: "Home Cleaning", customer: "Saman K.", provider: "Amali S.", amount: "LKR 4,200", status: "Pending", paymentMethod: "Card", slot: "Today 13:00" },
      { id: "#BK-8419", service: "Plumbing Repair", customer: "Priya M.", provider: "Ravi F.", amount: "LKR 5,800", status: "Completed", paymentMethod: "Bank Transfer", slot: "Yesterday 16:10" },
      { id: "#BK-8418", service: "AC Service", customer: "Dhanush L.", provider: "Nimal J.", amount: "LKR 3,500", status: "Cancelled", paymentMethod: "Card", slot: "Yesterday 09:20" },
      { id: "#BK-8417", service: "Photography", customer: "Kavya T.", provider: "Supun W.", amount: "LKR 12,000", status: "Completed", paymentMethod: "Wallet", slot: "2 days ago" }
    ]
  },
  providers: {
    generatedAt: "offline",
    summary: [
      { label: "Active Providers", value: "2,651", trend: "up", change: "214 verified this quarter" },
      { label: "Top Rated", value: "428", trend: "up", change: "4.8+ average rating" },
      { label: "Onboarding Queue", value: "36", trend: "down", change: "Document checks pending" }
    ],
    providers: [
      { name: "Kasun Perera", category: "Electrician", rating: "4.9", jobs: "847 jobs", completionRate: "99%", price: "LKR 2,500/hr", status: "Approved" },
      { name: "Amali Silva", category: "Cleaner", rating: "4.8", jobs: "623 jobs", completionRate: "97%", price: "LKR 1,800/hr", status: "Approved" },
      { name: "Ravi Fernando", category: "Plumber", rating: "4.7", jobs: "1,041 jobs", completionRate: "96%", price: "LKR 3,000/hr", status: "Approved" },
      { name: "Nimal Jayasena", category: "AC Technician", rating: "4.8", jobs: "512 jobs", completionRate: "95%", price: "LKR 2,200/hr", status: "Under Review" },
      { name: "Supun Tharaka", category: "Tutor", rating: "5.0", jobs: "389 jobs", completionRate: "98%", price: "LKR 2,000/hr", status: "Approved" }
    ]
  },
  fraud: {
    generatedAt: "offline",
    summary: [
      { label: "Blocked Today", value: "18", trend: "up", change: "4 high-risk events" },
      { label: "Review Accuracy", value: "98.2%", trend: "up", change: "Model confidence score" },
      { label: "Manual Cases", value: "7", trend: "down", change: "3 under investigation" }
    ],
    alerts: [
      { severity: "high", title: "Fake Review Cluster Detected", description: "5 reviews from same IP", score: "98.2%" },
      { severity: "high", title: "Duplicate Account Flagged", description: "Device fingerprint matches banned user", score: "94.7%" },
      { severity: "medium", title: "Unusual Booking Pattern", description: "23 bookings in 30 min", score: "81.3%" },
      { severity: "medium", title: "Payment Anomaly Detected", description: "Multiple failed transactions from same card", score: "73.5%" },
      { severity: "low", title: "Review Verified Authentic", description: "NLP analysis passed", score: "Safe" }
    ]
  }
};
