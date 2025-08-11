-- SQL script to create the thailanddigital database and tables
-- Run this in your MySQL client

-- Create database
CREATE DATABASE IF NOT EXISTS thailanddigital CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE thailanddigital;

-- Create admin table
CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create TDAC registrations table
CREATE TABLE IF NOT EXISTS tdac_registrations (
  id VARCHAR(36) PRIMARY KEY,
  -- Personal Information
  occupation ENUM('freelancer', 'employee', 'seller') NOT NULL,
  passportPhotoUrl VARCHAR(500),
  gender ENUM('MALE', 'FEMALE', 'UNDEFINED') NOT NULL,
  phoneNumber VARCHAR(20) NOT NULL,
  visaNumber VARCHAR(50),
  cityStateOfResidence VARCHAR(100) NOT NULL,
  
  -- Travel Information
  dateOfArrival DATE NOT NULL,
  purposeOfTravel ENUM(
    'HOLIDAY', 'MEETING', 'SPORTS', 'BUSINESS', 'INCENTIVE',
    'MEDICAL & WELLNESS', 'EDUCATION', 'CONVENTION', 'EMPLOYMENT',
    'EXHIBITION', 'TRAVEL', 'OTHERS'
  ) NOT NULL,
  modeOfTravel ENUM('BUS', 'AIR', 'LAND', 'SEA') NOT NULL,
  modeOfTransport VARCHAR(100),
  flightVehicleNumber VARCHAR(50) NOT NULL,
  
  -- Accommodation Information
  isTransitPassenger BOOLEAN DEFAULT FALSE,
  typeOfAccommodation VARCHAR(100),
  province VARCHAR(100),
  address TEXT,
  
  -- Payment Information
  paymentSlipUrl VARCHAR(500),
  
  -- System fields
  status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
  submittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processedAt TIMESTAMP NULL,
  notes TEXT,
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password is 'admin123' hashed with bcryptjs)
INSERT INTO admin (email, password) VALUES 
('admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE email = email;

-- Show tables to verify creation
SHOW TABLES;
