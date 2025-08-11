// Test script for TDAC Registration API
const http = require('http');
const fs = require('fs');
const FormData = require('form-data');

const BASE_URL = 'http://localhost:5000/api/tdac';

// Test data matching frontend form
const testTDACData = {
  // Personal Information
  occupation: "employee",
  gender: "MALE",
  phoneNumber: "+66812345678",
  visaNumber: "LA123456",
  cityStateOfResidence: "Vientiane",
  
  // Travel Information
  dateOfArrival: "2025-12-01",
  purposeOfTravel: "HOLIDAY",
  modeOfTravel: "AIR",
  modeOfTransport: "COMMERCIAL_FLIGHT",
  flightVehicleNumber: "TG001",
  
  // Accommodation Information
  isTransitPassenger: "false",
  typeOfAccommodation: "Hotel",
  province: "Bangkok",
  address: "123 Test Street, Bangkok, Thailand"
};

// Helper function to make HTTP requests with FormData
function makeFormRequest(url, formData) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, {
      method: 'POST',
      headers: formData.getHeaders()
    }, (res) => {
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

    formData.pipe(req);
  });
}

// Helper function to make regular HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const data = options.body ? JSON.stringify(options.body) : null;
    
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    if (data) {
      requestOptions.headers['Content-Length'] = Buffer.byteLength(data);
    }

    const req = http.request(url, requestOptions, (res) => {
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

    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

// Test functions
async function testTDACRegistration() {
  console.log('🧪 Testing TDAC Registration...');
  
  try {
    const formData = new FormData();
    
    // Add form fields
    Object.keys(testTDACData).forEach(key => {
      formData.append(key, testTDACData[key]);
    });
    
    // Note: In a real test, you would add actual image files
    // formData.append('passportPhoto', fs.createReadStream('path/to/test-image.jpg'));
    // formData.append('paymentSlip', fs.createReadStream('path/to/test-payment.jpg'));
    
    const result = await makeFormRequest(`${BASE_URL}/register`, formData);
    
    console.log(`Status: ${result.status}`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    console.log('---'.repeat(20));
    
    if (result.status === 201 && result.data.success) {
      console.log('✅ TDAC Registration test passed');
      return result.data.data.id;
    } else {
      console.log('❌ TDAC Registration test failed');
      return null;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('❌ TDAC Registration test failed');
    return null;
  }
}

async function testTDACValidation() {
  console.log('🧪 Testing TDAC Validation (missing required fields)...');
  
  try {
    const formData = new FormData();
    
    // Only add some fields to test validation
    formData.append('occupation', 'employee');
    formData.append('gender', 'MALE');
    // Missing phoneNumber and other required fields
    
    const result = await makeFormRequest(`${BASE_URL}/register`, formData);
    
    console.log(`Status: ${result.status}`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    console.log('---'.repeat(20));
    
    if (result.status === 400 && !result.data.success) {
      console.log('✅ TDAC Validation test passed');
    } else {
      console.log('❌ TDAC Validation test failed');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('❌ TDAC Validation test failed');
  }
}

async function testGetTDACRegistration(registrationId) {
  if (!registrationId) {
    console.log('⏭️  Skipping GET Registration test (no ID available)');
    return;
  }
  
  console.log('🧪 Testing GET TDAC Registration by ID...');
  
  try {
    const result = await makeRequest(`${BASE_URL}/registration/${registrationId}`);
    
    console.log(`Status: ${result.status}`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    console.log('---'.repeat(20));
    
    if (result.status === 200 && result.data.success) {
      console.log('✅ GET TDAC Registration test passed');
    } else {
      console.log('❌ GET TDAC Registration test failed');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('❌ GET TDAC Registration test failed');
  }
}

async function testTransitPassenger() {
  console.log('🧪 Testing TDAC Registration (Transit Passenger)...');
  
  try {
    const formData = new FormData();
    
    // Add form fields for transit passenger
    const transitData = {
      ...testTDACData,
      isTransitPassenger: "true"
      // No accommodation details needed for transit
    };
    
    Object.keys(transitData).forEach(key => {
      if (!['typeOfAccommodation', 'province', 'address'].includes(key)) {
        formData.append(key, transitData[key]);
      }
    });
    
    const result = await makeFormRequest(`${BASE_URL}/register`, formData);
    
    console.log(`Status: ${result.status}`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    console.log('---'.repeat(20));
    
    if (result.status === 201 && result.data.success) {
      console.log('✅ Transit Passenger test passed');
      return result.data.data.id;
    } else {
      console.log('❌ Transit Passenger test failed');
      return null;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('❌ Transit Passenger test failed');
    return null;
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting TDAC Registration API Tests...');
  console.log('=' .repeat(60));
  
  try {
    // Test successful registration
    const registrationId = await testTDACRegistration();
    
    // Test validation errors
    await testTDACValidation();
    
    // Test getting registration by ID
    await testGetTDACRegistration(registrationId);
    
    // Test transit passenger registration
    await testTransitPassenger();
    
  } catch (error) {
    console.error('Test runner error:', error);
  }
  
  console.log('=' .repeat(60));
  console.log('🏁 All tests completed!');
  console.log('\n💡 Note: Admin endpoints require JWT token authentication');
  console.log('💡 File uploads require actual image files in a real test');
}

// Check if this script is run directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testTDACRegistration,
  testTDACValidation,
  testGetTDACRegistration,
  testTransitPassenger
};
