// Test script to verify passportPhotoUrl and paymentSlipUrl are returned
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

async function testFileURLResponse() {
  console.log('🧪 Testing File URL Response...');
  console.log('='.repeat(60));

  const testData = {
    occupation: "employee",
    gender: "MALE",
    phoneNumber: "+856-20-5555-9999",
    cityStateOfResidence: "Vientiane",
    dateOfArrival: "2025-12-30",
    purposeOfTravel: "HOLIDAY",
    modeOfTravel: "AIR",
    modeOfTransport: "COMMERCIAL_FLIGHT",
    flightVehicleNumber: "TEST001",
    isTransitPassenger: "false",
    typeOfAccommodation: "Hotel",
    province: "Bangkok",
    address: "Test Address Bangkok",
    
    // 🎯 ทดสอบ File URLs ที่ส่งมาจาก frontend
    passportPhotoUrl: "https://example.com/uploads/passport-test-123.jpg",
    paymentSlipUrl: "https://example.com/uploads/payment-test-456.jpg"
  };

  try {
    console.log('📤 Sending request with file URLs...');
    console.log('📋 Request Data:');
    console.log(JSON.stringify(testData, null, 2));
    console.log('-'.repeat(50));

    const result = await makeJSONRequest('http://localhost:5000/api/tdac/register', testData);
    
    console.log('📥 Server Response:');
    console.log(`Status: ${result.status}`);
    console.log('Response Body:');
    console.log(JSON.stringify(result.data, null, 2));
    console.log('-'.repeat(50));
    
    if (result.status === 201 && result.data.success) {
      console.log('✅ Registration Successful!');
      console.log('');
      
      // ตรวจสอบว่า file URLs ถูกส่งกลับมาไหม
      const responseData = result.data.data;
      
      console.log('🔍 Checking File URLs in Response:');
      if (responseData.passportPhotoUrl) {
        console.log(`✅ passportPhotoUrl: ${responseData.passportPhotoUrl}`);
      } else {
        console.log('❌ passportPhotoUrl: Missing in response');
      }
      
      if (responseData.paymentSlipUrl) {
        console.log(`✅ paymentSlipUrl: ${responseData.paymentSlipUrl}`);
      } else {
        console.log('❌ paymentSlipUrl: Missing in response');
      }
      
      console.log('');
      console.log('📊 Complete Response Data:');
      console.log(`   Registration ID: ${responseData.id}`);
      console.log(`   Status: ${responseData.status}`);
      console.log(`   Occupation: ${responseData.occupation}`);
      console.log(`   Gender: ${responseData.gender}`);
      console.log(`   Phone: ${responseData.phoneNumber}`);
      console.log(`   Arrival Date: ${responseData.dateOfArrival}`);
      console.log(`   Purpose: ${responseData.purposeOfTravel}`);
      console.log(`   Mode of Travel: ${responseData.modeOfTravel}`);
      console.log(`   Flight: ${responseData.flightVehicleNumber}`);
      console.log(`   Transit: ${responseData.isTransitPassenger}`);
      console.log(`   Province: ${responseData.province}`);
      console.log(`   Address: ${responseData.address}`);
      
      // ตรวจสอบว่า URLs ตรงกับที่ส่งไปไหม
      const urlsMatch = 
        responseData.passportPhotoUrl === testData.passportPhotoUrl &&
        responseData.paymentSlipUrl === testData.paymentSlipUrl;
        
      if (urlsMatch) {
        console.log('');
        console.log('🎉 SUCCESS: File URLs are correctly returned in response!');
        return true;
      } else {
        console.log('');
        console.log('⚠️  WARNING: File URLs in response don\'t match request');
        console.log(`   Expected passportPhotoUrl: ${testData.passportPhotoUrl}`);
        console.log(`   Received passportPhotoUrl: ${responseData.passportPhotoUrl}`);
        console.log(`   Expected paymentSlipUrl: ${testData.paymentSlipUrl}`);
        console.log(`   Received paymentSlipUrl: ${responseData.paymentSlipUrl}`);
        return false;
      }
      
    } else {
      console.log('❌ Registration Failed!');
      console.log(`Error: ${result.data.message}`);
      return false;
    }
    
  } catch (error) {
    console.error('💥 Test Error:', error.message);
    console.error('Stack:', error.stack);
    console.log('❌ Test Failed!');
    return false;
  }
}

async function runTest() {
  console.log('🚀 Testing File URL Response Fix...');
  console.log('📅 Date:', new Date().toLocaleString());
  console.log('🌐 Server: http://localhost:5000');
  console.log('🎯 Endpoint: POST /api/tdac/register');
  console.log('=' .repeat(60));

  const success = await testFileURLResponse();

  console.log('');
  console.log('📊 Test Result:');
  console.log('='.repeat(60));
  
  if (success) {
    console.log('🎉 TEST PASSED! File URLs are now correctly returned in response.');
    console.log('✅ Frontend will receive passportPhotoUrl and paymentSlipUrl');
  } else {
    console.log('❌ TEST FAILED! File URLs are not returned correctly.');
    console.log('⚠️  Frontend will not receive file URLs in response');
  }
}

// รันการทดสอบ
runTest().catch(console.error);
