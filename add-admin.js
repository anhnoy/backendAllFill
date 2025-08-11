// Script to add new admin user to database
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function addAdmin() {
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'thailanddigital'
    });

    console.log('✅ Connected to database');

    // Admin data
    const email = 'admin@example.com';
    const password = 'admin123';

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log('✅ Password hashed successfully');
    console.log('Original password:', password);
    console.log('Hashed password:', hashedPassword);

    // Check if admin already exists
    const [existingAdmin] = await connection.query(
      'SELECT id FROM admin WHERE email = ?',
      [email]
    );

    if (existingAdmin.length > 0) {
      console.log('⚠️  Admin user already exists, updating password...');
      
      // Update existing admin
      await connection.query(
        'UPDATE admin SET password = ?, updatedAt = NOW() WHERE email = ?',
        [hashedPassword, email]
      );
      
      console.log('✅ Admin password updated successfully');
    } else {
      console.log('➕ Creating new admin user...');
      
      // Insert new admin
      await connection.query(
        'INSERT INTO admin (email, password, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
        [email, hashedPassword]
      );
      
      console.log('✅ New admin user created successfully');
    }

    // Verify the admin was added/updated
    const [adminResult] = await connection.query(
      'SELECT id, email, createdAt, updatedAt FROM admin WHERE email = ?',
      [email]
    );

    if (adminResult.length > 0) {
      console.log('\n📋 Admin user details:');
      console.log('ID:', adminResult[0].id);
      console.log('Email:', adminResult[0].email);
      console.log('Created:', adminResult[0].createdAt);
      console.log('Updated:', adminResult[0].updatedAt);
    }

    // Test password verification
    console.log('\n🧪 Testing password verification...');
    const testResult = await bcrypt.compare(password, hashedPassword);
    console.log('Password verification test:', testResult ? '✅ PASSED' : '❌ FAILED');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the script
if (require.main === module) {
  addAdmin();
}

module.exports = { addAdmin };
