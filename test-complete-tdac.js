// Test TDAC Registration API with complete user data
const http = require('http');

function makeJSONRequest(url, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: url.replace('http://localhost:5000', ''),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: jsonData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function testCompleteUserRegistration() {
  console.log('🧪 Testing TDAC Registration with Complete User Data');
  console.log('=' .repeat(70));

  // ข้อมูลผู้ใช้งานจริงตัวอย่าง - ชาวลาวที่ต้องการเดินทางมาไทย
  const completeUserData = {
    // ข้อมูลส่วนตัว
    occupation: "employee",           // อาชีพ: พนักงาน
    gender: "MALE",                  // เพศ: ชาย
    phoneNumber: "+856-20-5555-1234", // เบอร์โทรลาว
    visaNumber: "LA2024001234",      // หมายเลขวีซ่า
    cityStateOfResidence: "Vientiane", // เมืองที่อาศัย: เวียงจันทน์
    
    // ข้อมูลการเดินทาง
    dateOfArrival: "2025-12-25",     // วันที่เดินทางมา: วันคริสต์มาส
    purposeOfTravel: "HOLIDAY",      // วัตถุประสงค์: ท่องเที่ยว
    modeOfTravel: "AIR",            // การเดินทาง: ทางอากาศ
    modeOfTransport: "COMMERCIAL_FLIGHT", // ประเภทยานพาหนะ: เครื่องบินเชิงพาณิชย์
    flightVehicleNumber: "QV301",    // หมายเลขเที่ยวบิน Lao Airlines
    
    // ข้อมูลที่พัก (ไม่ใช่ผู้โดยสารขนส่ง)
    isTransitPassenger: "false",     // ไม่ใช่ transit passenger
    typeOfAccommodation: "Hotel",    // ประเภทที่พัก: โรงแรม
    province: "Bangkok",             // จังหวัด: กรุงเทพ
    address: "Siam Paragon Hotel, 991 Rama I Road, Pathumwan, Bangkok 10330", // ที่อยู่ที่พัก
    
    // URLs ของไฟล์อัปโหลด (จำลอง)
    passportPhotoUrl: "https://example.com/uploads/passport-somchai-2024.jpg",
    paymentSlipUrl: "https://example.com/uploads/payment-slip-001234.jpg"
  };

  try {
    console.log('👤 User Profile:');
    console.log(`   Name: Somchai Laovilai (ตัวอย่าง)`);
    console.log(`   Nationality: Lao PDR`);
    console.log(`   Purpose: Christmas Holiday in Thailand`);
    console.log('');

    console.log('📤 Sending Registration Request...');
    console.log('URL: POST http://localhost:5000/api/tdac/register');
    console.log('Content-Type: application/json');
    console.log('');
    console.log('📋 Request Data:');
    console.log(JSON.stringify(completeUserData, null, 2));
    console.log('-'.repeat(50));

    const result = await makeJSONRequest('http://localhost:5000/api/tdac/register', completeUserData);
    
    console.log('📥 Server Response:');
    console.log(`Status Code: ${result.status}`);
    console.log('Response Body:');
    console.log(JSON.stringify(result.data, null, 2));
    console.log('-'.repeat(50));
    
    // วิเคราะห์ผลลัพธ์
    if (result.status === 201 && result.data.success) {
      console.log('✅ REGISTRATION SUCCESSFUL!');
      console.log('');
      console.log('📝 Registration Details:');
      console.log(`   Registration ID: ${result.data.data.id}`);
      console.log(`   Status: ${result.data.data.status}`);
      console.log(`   Submitted At: ${new Date(result.data.data.createdAt).toLocaleString()}`);
      console.log(`   Occupation: ${result.data.data.occupation}`);
      console.log(`   Gender: ${result.data.data.gender}`);
      console.log(`   Phone: ${result.data.data.phoneNumber}`);
      console.log(`   Arrival Date: ${result.data.data.dateOfArrival}`);
      console.log(`   Purpose: ${result.data.data.purposeOfTravel}`);
      console.log(`   Flight: ${result.data.data.flightVehicleNumber}`);
      console.log(`   Accommodation: ${result.data.data.typeOfAccommodation} in ${result.data.data.province}`);
      console.log(`   Transit Passenger: ${result.data.data.isTransitPassenger ? 'Yes' : 'No'}`);
      
      if (result.data.data.passportPhotoUrl) {
        console.log(`   Passport Photo: ${result.data.data.passportPhotoUrl}`);
      }
      if (result.data.data.paymentSlipUrl) {
        console.log(`   Payment Slip: ${result.data.data.paymentSlipUrl}`);
      }
      
      return result.data.data.id;
    } else {
      console.log('❌ REGISTRATION FAILED!');
      console.log('');
      console.log('💬 Error Message:', result.data.message || 'Unknown error');
      if (result.data.errors) {
        console.log('🔍 Validation Errors:');
        Object.entries(result.data.errors).forEach(([field, error]) => {
          console.log(`   ${field}: ${error}`);
        });
      }
      return null;
    }
    
  } catch (error) {
    console.error('💥 Network/Connection Error:', error.message);
    console.log('❌ REGISTRATION FAILED!');
    return null;
  }
}

async function testBusinessTraveler() {
  console.log('\n🧪 Testing Business Traveler Registration');
  console.log('=' .repeat(70));

  // ข้อมูลนักธุรกิจ
  const businessTravelerData = {
    occupation: "seller",             // เปลี่ยนจาก business_owner เป็น seller
    gender: "FEMALE",
    phoneNumber: "+856-21-444-5678",
    visaNumber: "LA2024005678",
    cityStateOfResidence: "Luang Prabang",
    dateOfArrival: "2025-11-15",
    purposeOfTravel: "BUSINESS",
    modeOfTravel: "AIR",
    modeOfTransport: "PRIVATE_PLANE",
    flightVehicleNumber: "PVT-001",
    isTransitPassenger: "false",
    typeOfAccommodation: "Hotel",
    province: "Chiang Mai",
    address: "The Dhara Dhevi, 51/4 Chiang Mai-Sankampaeng Road, Mueang Chiang Mai, Chiang Mai 50000",
    passportPhotoUrl: "https://example.com/uploads/passport-business-001.jpg",
    paymentSlipUrl: "https://example.com/uploads/payment-business-001.jpg"
  };

  try {
    console.log('👩‍💼 Business Traveler Profile:');
    console.log(`   Name: Kham Phonepadith (ตัวอย่าง)`);
    console.log(`   Occupation: Business Owner`);
    console.log(`   Purpose: Business Meeting in Chiang Mai`);
    console.log('');

    const result = await makeJSONRequest('http://localhost:5000/api/tdac/register', businessTravelerData);
    
    console.log('📥 Server Response:');
    console.log(`Status Code: ${result.status}`);
    console.log('Response Body:');
    console.log(JSON.stringify(result.data, null, 2));
    
    if (result.status === 201 && result.data.success) {
      console.log('✅ BUSINESS TRAVELER REGISTRATION SUCCESSFUL!');
      return result.data.data.id;
    } else {
      console.log('❌ BUSINESS TRAVELER REGISTRATION FAILED!');
      return null;
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
    return null;
  }
}

async function testTransitPassenger() {
  console.log('\n🧪 Testing Transit Passenger Registration');
  console.log('=' .repeat(70));

  // ผู้โดยสารขนส่ง (ไม่ต้องการที่พัก)
  const transitPassengerData = {
    occupation: "freelancer",         // เปลี่ยนจาก student เป็น freelancer
    gender: "MALE",
    phoneNumber: "+856-20-999-1111",
    cityStateOfResidence: "Pakse",
    dateOfArrival: "2025-10-20",
    purposeOfTravel: "OTHERS",        // เปลี่ยนจาก OTHER เป็น OTHERS
    modeOfTravel: "AIR",
    modeOfTransport: "COMMERCIAL_FLIGHT",
    flightVehicleNumber: "TG575",
    isTransitPassenger: "true" // Transit passenger - ไม่ต้องการข้อมูลที่พัก
  };

  try {
    console.log('🎓 Transit Student Profile:');
    console.log(`   Name: Bounmy Sisavath (ตัวอย่าง)`);
    console.log(`   Occupation: Student`);
    console.log(`   Purpose: Transit to Singapore`);
    console.log('');

    const result = await makeJSONRequest('http://localhost:5000/api/tdac/register', transitPassengerData);
    
    console.log('📥 Server Response:');
    console.log(`Status Code: ${result.status}`);
    console.log('Response Body:');
    console.log(JSON.stringify(result.data, null, 2));
    
    if (result.status === 201 && result.data.success) {
      console.log('✅ TRANSIT PASSENGER REGISTRATION SUCCESSFUL!');
      return result.data.data.id;
    } else {
      console.log('❌ TRANSIT PASSENGER REGISTRATION FAILED!');
      return null;
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
    return null;
  }
}

async function runCompleteTests() {
  console.log('🚀 TDAC Registration API - Complete User Testing');
  console.log('📅 Test Date:', new Date().toLocaleString());
  console.log('🌐 Server: http://localhost:5000');
  console.log('🔧 API Endpoint: POST /api/tdac/register');
  console.log('📝 Content-Type: application/json');
  console.log('');

  const results = {};

  // Test 1: Complete Holiday Traveler
  results.holidayTraveler = await testCompleteUserRegistration();

  // Test 2: Business Traveler  
  results.businessTraveler = await testBusinessTraveler();

  // Test 3: Transit Passenger
  results.transitPassenger = await testTransitPassenger();

  // Summary
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('=' .repeat(70));
  
  const testResults = [
    { name: 'Holiday Traveler', id: results.holidayTraveler },
    { name: 'Business Traveler', id: results.businessTraveler },
    { name: 'Transit Passenger', id: results.transitPassenger }
  ];

  testResults.forEach((test, index) => {
    const status = test.id ? '✅ PASSED' : '❌ FAILED';
    const idInfo = test.id ? ` (ID: ${test.id})` : '';
    console.log(`${index + 1}. ${test.name}: ${status}${idInfo}`);
  });

  const passedTests = testResults.filter(test => test.id).length;
  const totalTests = testResults.length;

  console.log('');
  console.log(`🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED! TDAC Registration API is working perfectly!');
    console.log('✨ Ready for production use with frontend integration.');
  } else {
    console.log('⚠️  Some tests failed. Please check the API implementation.');
  }

  console.log('');
  console.log('🔗 Next Steps for Frontend Integration:');
  console.log('   1. Use these JSON examples for frontend form submission');
  console.log('   2. Handle success/error responses appropriately');
  console.log('   3. Display registration ID to users upon success');
  console.log('   4. Implement file upload for passport photos and payment slips');
}

// Run all tests
if (require.main === module) {
  runCompleteTests().catch(console.error);
}

module.exports = {
  testCompleteUserRegistration,
  testBusinessTraveler,
  testTransitPassenger,
  runCompleteTests
};
