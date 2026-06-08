package com.serveiq.service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class AdminDashboardService {

    public Map<String, Object> overview() {
        return Map.of(
                "generatedAt", OffsetDateTime.now().toString(),
                "metrics", List.of(
                        metric("Total Revenue", "LKR 2.4M", "up", "18.2% vs last month"),
                        metric("Bookings", "8,421", "up", "12.7% vs last month"),
                        metric("Active Users", "14,203", "up", "9.4% vs last month"),
                        metric("Fraud Blocked", "247", "down", "31 new this week")
                ),
                "chart", Map.of(
                        "labels", List.of("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"),
                        "values", List.of(45, 58, 72, 65, 89, 94, 78, 102, 115, 88, 130, 142),
                        "series", "Monthly bookings"
                ),
                "recentBookings", List.of(
                        booking("#BK-8421", "Nimali R.", "Electrical Repair", "Kasun P.", "LKR 7,500", "Completed"),
                        booking("#BK-8420", "Saman K.", "Home Cleaning", "Amali S.", "LKR 4,200", "Pending"),
                        booking("#BK-8419", "Priya M.", "Plumbing Repair", "Ravi F.", "LKR 5,800", "Completed"),
                        booking("#BK-8418", "Dhanush L.", "AC Service", "Nimal J.", "LKR 3,500", "Cancelled"),
                        booking("#BK-8417", "Kavya T.", "Photography", "Supun W.", "LKR 12,000", "Completed")
                ),
                "activity", List.of(
                        "3 provider applications awaiting review",
                        "12 bookings need manual payment confirmation",
                        "5 fraud alerts were escalated in the last hour"
                )
        );
    }

    public Map<String, Object> users() {
        return Map.of(
                "generatedAt", OffsetDateTime.now().toString(),
                "summary", List.of(
                        metric("Registered Users", "14,203", "up", "1,230 new this month"),
                        metric("Verified Customers", "11,842", "up", "83.4% verification rate"),
                        metric("Admin Actions", "148", "up", "18 this week")
                ),
                "users", List.of(
                        user("USR-2041", "Nimali Ranathunga", "Customer", "Colombo 7", "Active", "Gold"),
                        user("USR-2038", "Kasun Perera", "Provider", "Kandy", "Active", "Top Rated"),
                        user("USR-2031", "Amali Silva", "Customer", "Galle", "Suspended", "Risk Review"),
                        user("USR-2027", "Ravi Fernando", "Provider", "Negombo", "Active", "Verified"),
                        user("USR-2012", "Supun Tharaka", "Provider", "Kurunegala", "Pending", "Document Check")
                )
        );
    }

    public Map<String, Object> bookings() {
        return Map.of(
                "generatedAt", OffsetDateTime.now().toString(),
                "summary", List.of(
                        metric("Open Bookings", "312", "up", "44 awaiting action"),
                        metric("Completed", "7,644", "up", "91.0% completion rate"),
                        metric("Cancelled", "109", "down", "1.3% cancellation rate")
                ),
                "bookings", List.of(
                        bookingDetail("#BK-8421", "Electrical Repair", "Nimali R.", "Kasun P.", "LKR 7,500", "Completed", "PayHere", "Today 10:30"),
                        bookingDetail("#BK-8420", "Home Cleaning", "Saman K.", "Amali S.", "LKR 4,200", "Pending", "Card", "Today 13:00"),
                        bookingDetail("#BK-8419", "Plumbing Repair", "Priya M.", "Ravi F.", "LKR 5,800", "Completed", "Bank Transfer", "Yesterday 16:10"),
                        bookingDetail("#BK-8418", "AC Service", "Dhanush L.", "Nimal J.", "LKR 3,500", "Cancelled", "Card", "Yesterday 09:20"),
                        bookingDetail("#BK-8417", "Photography", "Kavya T.", "Supun W.", "LKR 12,000", "Completed", "Wallet", "2 days ago")
                )
        );
    }

    public Map<String, Object> providers() {
        return Map.of(
                "generatedAt", OffsetDateTime.now().toString(),
                "summary", List.of(
                        metric("Active Providers", "2,651", "up", "214 verified this quarter"),
                        metric("Top Rated", "428", "up", "4.8+ average rating"),
                        metric("Onboarding Queue", "36", "down", "Document checks pending")
                ),
                "providers", List.of(
                        provider("Kasun Perera", "Electrician", "4.9", "847 jobs", "99%", "LKR 2,500/hr", "Approved"),
                        provider("Amali Silva", "Cleaner", "4.8", "623 jobs", "97%", "LKR 1,800/hr", "Approved"),
                        provider("Ravi Fernando", "Plumber", "4.7", "1,041 jobs", "96%", "LKR 3,000/hr", "Approved"),
                        provider("Nimal Jayasena", "AC Technician", "4.8", "512 jobs", "95%", "LKR 2,200/hr", "Under Review"),
                        provider("Supun Tharaka", "Tutor", "5.0", "389 jobs", "98%", "LKR 2,000/hr", "Approved")
                )
        );
    }

    public Map<String, Object> fraud() {
        return Map.of(
                "generatedAt", OffsetDateTime.now().toString(),
                "summary", List.of(
                        metric("Blocked Today", "18", "up", "4 high-risk events"),
                        metric("Review Accuracy", "98.2%", "up", "Model confidence score"),
                        metric("Manual Cases", "7", "down", "3 under investigation")
                ),
                "alerts", List.of(
                        fraudAlert("high", "Fake Review Cluster Detected", "5 reviews from same IP", "98.2%"),
                        fraudAlert("high", "Duplicate Account Flagged", "Device fingerprint matches banned user", "94.7%"),
                        fraudAlert("medium", "Unusual Booking Pattern", "23 bookings in 30 min", "81.3%"),
                        fraudAlert("medium", "Payment Anomaly Detected", "Multiple failed transactions from same card", "73.5%"),
                        fraudAlert("low", "Review Verified Authentic", "NLP analysis passed", "Safe")
                )
        );
    }

    private Map<String, Object> metric(String label, String value, String trend, String change) {
        return Map.of(
                "label", label,
                "value", value,
                "trend", trend,
                "change", change
        );
    }

    private Map<String, Object> booking(String id, String customer, String service, String provider, String amount, String status) {
        return Map.of(
                "id", id,
                "customer", customer,
                "service", service,
                "provider", provider,
                "amount", amount,
                "status", status
        );
    }

    private Map<String, Object> bookingDetail(String id, String service, String customer, String provider, String amount, String status, String paymentMethod, String slot) {
        return Map.of(
                "id", id,
                "service", service,
                "customer", customer,
                "provider", provider,
                "amount", amount,
                "status", status,
                "paymentMethod", paymentMethod,
                "slot", slot
        );
    }

    private Map<String, Object> user(String id, String name, String role, String location, String status, String tier) {
        return Map.of(
                "id", id,
                "name", name,
                "role", role,
                "location", location,
                "status", status,
                "tier", tier
        );
    }

    private Map<String, Object> provider(String name, String category, String rating, String jobs, String completionRate, String price, String status) {
        return Map.of(
                "name", name,
                "category", category,
                "rating", rating,
                "jobs", jobs,
                "completionRate", completionRate,
                "price", price,
                "status", status
        );
    }

    private Map<String, Object> fraudAlert(String severity, String title, String description, String score) {
        return Map.of(
                "severity", severity,
                "title", title,
                "description", description,
                "score", score
        );
    }
}
