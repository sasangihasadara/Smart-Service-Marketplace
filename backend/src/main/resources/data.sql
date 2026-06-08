INSERT IGNORE INTO serveiq_admin_metrics (id, label, value_text, trend, change_text) VALUES
  (1, 'Total Revenue', 'LKR 2.4M', 'up', '18.2% vs last month'),
  (2, 'Bookings', '8,421', 'up', '12.7% vs last month'),
  (3, 'Active Users', '14,203', 'up', '9.4% vs last month'),
  (4, 'Fraud Blocked', '247', 'down', '31 new this week');

INSERT IGNORE INTO serveiq_admin_users (id, name, role_name, location_text, status_text, tier_text) VALUES
  ('USR-2041', 'Nimali Ranathunga', 'Customer', 'Colombo 7', 'Active', 'Gold'),
  ('USR-2038', 'Kasun Perera', 'Provider', 'Kandy', 'Active', 'Top Rated'),
  ('USR-2031', 'Amali Silva', 'Customer', 'Galle', 'Suspended', 'Risk Review'),
  ('USR-2027', 'Ravi Fernando', 'Provider', 'Negombo', 'Active', 'Verified'),
  ('USR-2012', 'Supun Tharaka', 'Provider', 'Kurunegala', 'Pending', 'Document Check');

INSERT IGNORE INTO serveiq_admin_bookings (id, service_name, customer_name, provider_name, amount_text, status_text, payment_method, slot_text) VALUES
  ('#BK-8421', 'Electrical Repair', 'Nimali R.', 'Kasun P.', 'LKR 7,500', 'Completed', 'PayHere', 'Today 10:30'),
  ('#BK-8420', 'Home Cleaning', 'Saman K.', 'Amali S.', 'LKR 4,200', 'Pending', 'Card', 'Today 13:00'),
  ('#BK-8419', 'Plumbing Repair', 'Priya M.', 'Ravi F.', 'LKR 5,800', 'Completed', 'Bank Transfer', 'Yesterday 16:10'),
  ('#BK-8418', 'AC Service', 'Dhanush L.', 'Nimal J.', 'LKR 3,500', 'Cancelled', 'Card', 'Yesterday 09:20'),
  ('#BK-8417', 'Photography', 'Kavya T.', 'Supun W.', 'LKR 12,000', 'Completed', 'Wallet', '2 days ago');

INSERT IGNORE INTO serveiq_admin_providers (id, name, category_name, rating_text, jobs_text, completion_rate, price_text, status_text) VALUES
  (1, 'Kasun Perera', 'Electrician', '4.9', '847 jobs', '99%', 'LKR 2,500/hr', 'Approved'),
  (2, 'Amali Silva', 'Cleaner', '4.8', '623 jobs', '97%', 'LKR 1,800/hr', 'Approved'),
  (3, 'Ravi Fernando', 'Plumber', '4.7', '1,041 jobs', '96%', 'LKR 3,000/hr', 'Approved'),
  (4, 'Nimal Jayasena', 'AC Technician', '4.8', '512 jobs', '95%', 'LKR 2,200/hr', 'Under Review'),
  (5, 'Supun Tharaka', 'Tutor', '5.0', '389 jobs', '98%', 'LKR 2,000/hr', 'Approved');

INSERT IGNORE INTO serveiq_admin_fraud_alerts (id, severity_text, title_text, description_text, score_text) VALUES
  (1, 'high', 'Fake Review Cluster Detected', '5 reviews from same IP', '98.2%'),
  (2, 'high', 'Duplicate Account Flagged', 'Device fingerprint matches banned user', '94.7%'),
  (3, 'medium', 'Unusual Booking Pattern', '23 bookings in 30 min', '81.3%'),
  (4, 'medium', 'Payment Anomaly Detected', 'Multiple failed transactions from same card', '73.5%'),
  (5, 'low', 'Review Verified Authentic', 'NLP analysis passed', 'Safe');
