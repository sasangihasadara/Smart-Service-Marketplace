package com.serveiq.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.serveiq.entity.AccountStatus;
import com.serveiq.entity.AppUser;
import com.serveiq.entity.Booking;
import com.serveiq.entity.BookingStatus;
import com.serveiq.entity.FraudAlert;
import com.serveiq.entity.FraudSeverity;
import com.serveiq.entity.Payment;
import com.serveiq.entity.PaymentStatus;
import com.serveiq.entity.SearchLog;
import com.serveiq.entity.UserRole;
import com.serveiq.repository.AppUserRepository;
import com.serveiq.repository.BookingRepository;
import com.serveiq.repository.FraudAlertRepository;
import com.serveiq.repository.PaymentRepository;
import com.serveiq.repository.SearchLogRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeederService {

    private static final List<String> SEED_SERVICES = List.of(
            "Electrician", "Cleaner", "Plumber", "AC Technician", "Tutor"
    );

    @Bean
    CommandLineRunner seedDatabase(
            AppUserRepository appUserRepository,
            BookingRepository bookingRepository,
            PaymentRepository paymentRepository,
            FraudAlertRepository fraudAlertRepository,
            SearchLogRepository searchLogRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (appUserRepository.count() == 0) {
                seedUsers(appUserRepository, passwordEncoder);
            }

            if (bookingRepository.count() == 0) {
                seedBookings(bookingRepository);
            }

            if (paymentRepository.count() == 0) {
                seedPayments(paymentRepository);
            }

            if (fraudAlertRepository.count() == 0) {
                seedFraudAlerts(fraudAlertRepository);
            }

            if (searchLogRepository.count() == 0) {
                seedSearchLogs(searchLogRepository);
            }
        };
    }

    private void seedUsers(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        appUserRepository.save(createUser("Serve", "Admin", "admin@serveiq.com", "0700000000", UserRole.ADMIN,
                "Platform", 0, "LKR 0", new BigDecimal("5.0"), 0, AccountStatus.ACTIVE, passwordEncoder));

        appUserRepository.save(createUser("Kasun", "Perera", "kasun@serveiq.com", "0712345678", UserRole.PROVIDER,
                "Electrician", 8, "LKR 2,500/hr", new BigDecimal("4.9"), 847, AccountStatus.ACTIVE, passwordEncoder));
        appUserRepository.save(createUser("Amali", "Silva", "amali@serveiq.com", "0723456789", UserRole.PROVIDER,
                "Cleaner", 5, "LKR 1,800/hr", new BigDecimal("4.8"), 623, AccountStatus.ACTIVE, passwordEncoder));
        appUserRepository.save(createUser("Ravi", "Fernando", "ravi@serveiq.com", "0734567890", UserRole.PROVIDER,
                "Plumber", 12, "LKR 3,000/hr", new BigDecimal("4.7"), 1041, AccountStatus.ACTIVE, passwordEncoder));
        appUserRepository.save(createUser("Nimal", "Jayasena", "nimal@serveiq.com", "0745678901", UserRole.PROVIDER,
                "AC Technician", 6, "LKR 2,200/hr", new BigDecimal("4.8"), 512, AccountStatus.ACTIVE, passwordEncoder));
        appUserRepository.save(createUser("Supun", "Tharaka", "supun@serveiq.com", "0756789012", UserRole.PROVIDER,
                "Tutor", 7, "LKR 2,000/hr", new BigDecimal("5.0"), 389, AccountStatus.ACTIVE, passwordEncoder));

        appUserRepository.save(createUser("Nimali", "Ratnayake", "nimali@serveiq.com", "0767890123", UserRole.CUSTOMER,
                "Customer", 0, null, null, 0, AccountStatus.ACTIVE, passwordEncoder));
        appUserRepository.save(createUser("Saman", "Kumara", "saman@serveiq.com", "0778901234", UserRole.CUSTOMER,
                "Customer", 0, null, null, 0, AccountStatus.ACTIVE, passwordEncoder));
    }

    private AppUser createUser(
            String firstName,
            String lastName,
            String email,
            String phoneNumber,
            UserRole role,
            String serviceCategory,
            Integer yearsOfExperience,
            String priceText,
            BigDecimal rating,
            Integer jobsCompleted,
            AccountStatus status,
            PasswordEncoder passwordEncoder
    ) {
        AppUser user = new AppUser();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPhoneNumber(phoneNumber);
        user.setRole(role);
        user.setServiceCategory(serviceCategory);
        user.setYearsOfExperience(yearsOfExperience);
        user.setPriceText(priceText);
        user.setRating(rating);
        user.setJobsCompleted(jobsCompleted);
        user.setStatus(status);
        user.setPasswordHash(passwordEncoder.encode("1234"));
        return user;
    }

    private void seedBookings(BookingRepository bookingRepository) {
        bookingRepository.save(createBooking("#BK-8421", "Electrical Repair", "Nimali R.", "kasun@serveiq.com", "Kasun Perera",
                new BigDecimal("7500"), new BigDecimal("6250"), new BigDecimal("1250"), BookingStatus.COMPLETED));
        bookingRepository.save(createBooking("#BK-8420", "Home Cleaning", "Saman K.", "amali@serveiq.com", "Amali Silva",
                new BigDecimal("4200"), new BigDecimal("3000"), new BigDecimal("1200"), BookingStatus.PENDING));
        bookingRepository.save(createBooking("#BK-8419", "Plumbing Repair", "Nimali R.", "ravi@serveiq.com", "Ravi Fernando",
                new BigDecimal("5800"), new BigDecimal("4500"), new BigDecimal("1300"), BookingStatus.COMPLETED));
        bookingRepository.save(createBooking("#BK-8418", "AC Service", "Dhanush L.", "nimal@serveiq.com", "Nimal Jayasena",
                new BigDecimal("3500"), new BigDecimal("2500"), new BigDecimal("1000"), BookingStatus.CANCELLED));
        bookingRepository.save(createBooking("#BK-8417", "Photography", "Kavya T.", "supun@serveiq.com", "Supun Tharaka",
                new BigDecimal("12000"), new BigDecimal("10000"), new BigDecimal("2000"), BookingStatus.COMPLETED));
    }

    private Booking createBooking(
            String bookingCode,
            String serviceRequired,
            String customerName,
            String customerEmail,
            String providerName,
            BigDecimal totalAmount,
            BigDecimal serviceFee,
            BigDecimal callOutFee,
            BookingStatus status
    ) {
        Booking booking = new Booking();
        booking.setBookingCode(bookingCode);
        booking.setServiceRequired(serviceRequired);
        booking.setBookingDate(LocalDate.now());
        booking.setBookingTime(LocalTime.of(10, 30));
        booking.setLocation("Colombo");
        booking.setDescription(serviceRequired + " request");
        booking.setCustomerName(customerName);
        booking.setCustomerEmail(customerEmail);
        booking.setCustomerPhone("0770000000");
        booking.setProviderName(providerName);
        booking.setTotalAmount(totalAmount);
        booking.setServiceFee(serviceFee);
        booking.setCallOutFee(callOutFee);
        booking.setPaymentMethod("PayHere");
        booking.setStatus(status);
        return booking;
    }

    private void seedPayments(PaymentRepository paymentRepository) {
        paymentRepository.save(createPayment("PAY-842100", "#BK-8421", "Nimali R.", "nimali@serveiq.com", "card", new BigDecimal("7500"), PaymentStatus.PAID));
        paymentRepository.save(createPayment("PAY-841900", "#BK-8419", "Nimali R.", "nimali@serveiq.com", "bank", new BigDecimal("5800"), PaymentStatus.PAID));
        paymentRepository.save(createPayment("PAY-841700", "#BK-8417", "Kavya T.", "kavya@example.com", "wallet", new BigDecimal("12000"), PaymentStatus.PAID));
    }

    private Payment createPayment(
            String paymentReference,
            String bookingCode,
            String payerName,
            String payerEmail,
            String method,
            BigDecimal amount,
            PaymentStatus status
    ) {
        Payment payment = new Payment();
        payment.setPaymentReference(paymentReference);
        payment.setBookingCode(bookingCode);
        payment.setPayerName(payerName);
        payment.setPayerEmail(payerEmail);
        payment.setMethod(method);
        payment.setAmount(amount);
        payment.setStatus(status);
        return payment;
    }

    private void seedFraudAlerts(FraudAlertRepository fraudAlertRepository) {
        fraudAlertRepository.save(createAlert(FraudSeverity.HIGH, "Fake Review Cluster Detected", "5 reviews from same IP", "98.2%"));
        fraudAlertRepository.save(createAlert(FraudSeverity.HIGH, "Duplicate Account Flagged", "Device fingerprint matches banned user", "94.7%"));
        fraudAlertRepository.save(createAlert(FraudSeverity.MEDIUM, "Unusual Booking Pattern", "23 bookings in 30 min", "81.3%"));
        fraudAlertRepository.save(createAlert(FraudSeverity.MEDIUM, "Payment Anomaly Detected", "Multiple failed transactions from same card", "73.5%"));
        fraudAlertRepository.save(createAlert(FraudSeverity.LOW, "Review Verified Authentic", "NLP analysis passed", "Safe"));
    }

    private FraudAlert createAlert(FraudSeverity severity, String title, String description, String score) {
        FraudAlert alert = new FraudAlert();
        alert.setSeverity(severity);
        alert.setTitle(title);
        alert.setDescription(description);
        alert.setScore(score);
        return alert;
    }

    private void seedSearchLogs(SearchLogRepository searchLogRepository) {
        SearchLog searchLog1 = new SearchLog();
        searchLog1.setQueryText("Electrician");
        searchLog1.setLocationText("Colombo");
        searchLogRepository.save(searchLog1);

        SearchLog searchLog2 = new SearchLog();
        searchLog2.setQueryText("Plumber");
        searchLog2.setLocationText("Kandy");
        searchLogRepository.save(searchLog2);
    }
}
