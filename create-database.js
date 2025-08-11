// create-database.js - Script to create database and tables
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
  let connection;
  
  try {
    // First connect without specifying database to create it
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    console.log('Connected to MySQL server');

    // Create database
    await connection.execute('CREATE DATABASE IF NOT EXISTS thailanddigital CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ Database "thailanddigital" created successfully');

    // Use the database
    await connection.query('USE thailanddigital');

    // Create admin table
    const adminTableSQL = `
      CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await connection.query(adminTableSQL);
    console.log('✅ Admin table created successfully');

    // Create TDAC registrations table
    const tdacTableSQL = `
      CREATE TABLE IF NOT EXISTS tdac_registrations (
        id VARCHAR(36) PRIMARY KEY,
        occupation ENUM('freelancer', 'employee', 'seller') NOT NULL,
        passportPhotoUrl VARCHAR(500),
        gender ENUM('MALE', 'FEMALE', 'UNDEFINED') NOT NULL,
        phoneNumber VARCHAR(20) NOT NULL,
        visaNumber VARCHAR(50),
        cityStateOfResidence VARCHAR(100) NOT NULL,
        dateOfArrival DATE NOT NULL,
        purposeOfTravel ENUM(
          'HOLIDAY', 'MEETING', 'SPORTS', 'BUSINESS', 'INCENTIVE',
          'MEDICAL & WELLNESS', 'EDUCATION', 'CONVENTION', 'EMPLOYMENT',
          'EXHIBITION', 'TRAVEL', 'OTHERS'
        ) NOT NULL,
        modeOfTravel ENUM('BUS', 'AIR', 'LAND', 'SEA') NOT NULL,
        modeOfTransport VARCHAR(100),
        flightVehicleNumber VARCHAR(50) NOT NULL,
        isTransitPassenger BOOLEAN DEFAULT FALSE,
        typeOfAccommodation VARCHAR(100),
        province VARCHAR(100),
        address TEXT,
        paymentSlipUrl VARCHAR(500),
        status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
        submittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processedAt TIMESTAMP NULL,
        notes TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await connection.query(tdacTableSQL);
    console.log('✅ TDAC registrations table created successfully');

    // Insert default admin user (password is 'admin123')
    const insertAdminSQL = `
      INSERT INTO admin (email, password) VALUES 
      ('admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
      ON DUPLICATE KEY UPDATE email = email
    `;
    await connection.query(insertAdminSQL);
    console.log('✅ Default admin user created (email: admin@example.com, password: admin123)');

    // Show tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('\n📊 Tables in database:');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n🔗 You can now start the server with: npm start');
    
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Please check your MySQL credentials in .env file');
      console.log('💡 Make sure MySQL server is running');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
createDatabase();
