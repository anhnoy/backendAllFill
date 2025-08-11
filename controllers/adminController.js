// backend/controllers/adminController.js
const logger = require('../config/logger');      // สำหรับการบันทึก Log
const Admin = require('../models/admin');         // สำหรับการโต้ตอบกับฐานข้อมูล (Admin Model)
const bcrypt = require('bcryptjs');               // สำหรับการ Hash และเปรียบเทียบรหัสผ่าน (Security)
const jwt = require('jsonwebtoken');              // สำหรับการสร้าง JSON Web Token (Security)
require('dotenv').config();                       // สำหรับการเข้าถึงตัวแปรสภาพแวดล้อม (เช่น JWT_SECRET)

const getDashboardData = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Dashboard data fetched successfully!',
      data: {
        // ... add dashboard data here ...
      }
    });
  } catch (error) {
    logger.error(`Error fetching dashboard data: ${error.message}`);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {

    const { email, password } = req.body;
    console.log('Login attempt with email:', email); // สำหรับ Debugging

    if (!email || !password) {
      logger.warn('Login attempt: Missing email or password.');
      // ส่งคืน HTTP Status 400 (Bad Request) สำหรับข้อมูลที่ไม่สมบูรณ์
      return res.status(400).json({
        success: false,
        message: 'email and password are required.',
        errors: {
          email: email ? undefined : 'email is required',
          password: password ? undefined : 'Password is required'
        }
      });
    }

    // 2. Security (ความปลอดภัย) - การยืนยันตัวตน (Authentication)
    // 2.1 ค้นหาผู้ดูแลระบบจากฐานข้อมูลด้วย username
    // Sequelize จะป้องกัน SQL Injection อัตโนมัติเมื่อใช้ findOne/findByPk
    const adminUser = await Admin.findOne({ where: { email: email } });

    // 2.2 ตรวจสอบว่าพบผู้ใช้หรือไม่
    if (!adminUser) {
      logger.warn(`Login attempt: User '${email}' not found.`);
      // ส่งคืน HTTP Status 401 (Unauthorized) สำหรับข้อมูลรับรองที่ไม่ถูกต้อง
      // หลีกเลี่ยงการระบุเจาะจงว่าผิดที่ username หรือ password เพื่อป้องกันการโจมตีแบบ Brute-force/Enumeration
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 2.3 เปรียบเทียบรหัสผ่านที่ส่งมากับรหัสผ่านที่ถูก Hash ในฐานข้อมูล
    // bcrypt.compare() เป็นมาตรฐานที่ปลอดภัยในการเปรียบเทียบรหัสผ่านที่ถูก Hash
    const isMatch = await bcrypt.compare(password, adminUser.password);

    // 2.4 ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
    if (!isMatch) {
      logger.warn(`Login attempt: Incorrect password for user '${email}'.`);
      // ส่งคืน HTTP Status 401 (Unauthorized)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 3. Security (ความปลอดภัย) - การสร้าง Token (Authorization)
    // สร้าง JWT (JSON Web Token) เมื่อ Login สำเร็จ
    // JWT จะถูกใช้ในการยืนยันตัวตนสำหรับการเรียก API ที่ต้องการการป้องกัน
    const token = jwt.sign(
      { id: adminUser.id, email: adminUser.email }, // Payload ของ Token
      process.env.JWT_SECRET, // Secret key จาก .env เพื่อเข้ารหัส/ถอดรหัส Token
      { expiresIn: '1h' } // กำหนดอายุของ Token (1 ชั่วโมง) เพื่อลดความเสี่ยงจากการถูกขโมย
    );

    logger.info(`Admin user '${email}' logged in successfully. Token issued.`);
    // ส่งคืน HTTP Status 200 (OK) สำหรับการ Login สำเร็จ
    res.status(200).json({
      success: true,
      message: 'Admin Login successful!',
      data: {
        token: token,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          // ไม่ควรส่งรหัสผ่านหรือข้อมูลที่ละเอียดอ่อนอื่นๆ กลับไป
        }
      }
    });

  } catch (error) {

    logger.error(`Error during admin login for user: ${req.body.email || 'N/A'}. Error: ${error.message}`);
    next(error); 
  }
};

module.exports = {
  getDashboardData,
  login,
};