CREATE TABLE IF NOT EXISTS serveiq_admin_metrics (
  id BIGINT PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  value_text VARCHAR(50) NOT NULL,
  trend VARCHAR(10) NOT NULL,
  change_text VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS serveiq_admin_users (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  role_name VARCHAR(30) NOT NULL,
  location_text VARCHAR(100) NOT NULL,
  status_text VARCHAR(30) NOT NULL,
  tier_text VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS serveiq_admin_bookings (
  id VARCHAR(32) PRIMARY KEY,
  service_name VARCHAR(120) NOT NULL,
  customer_name VARCHAR(120) NOT NULL,
  provider_name VARCHAR(120) NOT NULL,
  amount_text VARCHAR(50) NOT NULL,
  status_text VARCHAR(30) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  slot_text VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS serveiq_admin_providers (
  id BIGINT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  category_name VARCHAR(80) NOT NULL,
  rating_text VARCHAR(20) NOT NULL,
  jobs_text VARCHAR(30) NOT NULL,
  completion_rate VARCHAR(20) NOT NULL,
  price_text VARCHAR(50) NOT NULL,
  status_text VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS serveiq_admin_fraud_alerts (
  id BIGINT PRIMARY KEY,
  severity_text VARCHAR(20) NOT NULL,
  title_text VARCHAR(150) NOT NULL,
  description_text VARCHAR(255) NOT NULL,
  score_text VARCHAR(20) NOT NULL
);
