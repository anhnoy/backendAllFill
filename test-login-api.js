// Test script for Login API
const http = require('http');

const BASE_URL = 'http://localhost:5000/api/admin';

// Test data
const testCredentials = {
  valid: {
    email: "admin@example.com",
    password: "admin123"
  },
  invalid: {
    email: "wrong@example.com", 
    password: "wrongpassword"
  },
  incomplete: {
    email: "admin@example.com"
    // password missing
  }
};

// Helper function to make HTTP requests
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
async function testLoginSuccess() {
  console.log('🧪 Testing LOGIN with valid credentials...');
  
  try {
    const result = await makeRequest(`${BASE_URL}/login`, {
      method: 'POST',
      body: testCredentials.valid
    });
    
    console.log(`Status: ${result.status}`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    console.log('---'.repeat(20));
    
    if (result.status === 200 && result.data.success && result.data.data && result.data.data.token) {
      console.log('✅ LOGIN SUCCESS test passed');
      return result.data.data.token;
    } else {
      console.log('❌ LOGIN SUCCESS test failed');
      return null;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('❌ LOGIN SUCCESS test failed');
    return null;
  }
}

async function testLoginFailure() {
  console.log('🧪 Testing LOGIN with invalid credentials...');
  
  try {
    const result = await makeRequest(`${BASE_URL}/login`, {
      method: 'POST',
      body: testCredentials.invalid
    });
    
    console.log(`Status: ${result.status}`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    console.log('---'.repeat(20));
    
    if (result.status === 401 && !result.data.success) {
      console.log('✅ LOGIN FAILURE test passed');
    } else {
      console.log('❌ LOGIN FAILURE test failed');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('❌ LOGIN FAILURE test failed');
  }
}

async function testLoginValidation() {
  console.log('🧪 Testing LOGIN validation (missing password)...');
  
  try {
    const result = await makeRequest(`${BASE_URL}/login`, {
      method: 'POST',
      body: testCredentials.incomplete
    });
    
    console.log(`Status: ${result.status}`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    console.log('---'.repeat(20));
    
    if (result.status === 400 && !result.data.success) {
      console.log('✅ LOGIN VALIDATION test passed');
    } else {
      console.log('❌ LOGIN VALIDATION test failed');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('❌ LOGIN VALIDATION test failed');
  }
}

async function testDashboardWithToken(token) {
  if (!token) {
    console.log('⏭️  Skipping DASHBOARD test (no token available)');
    return;
  }
  
  console.log('🧪 Testing DASHBOARD with valid token...');
  
  try {
    const result = await makeRequest(`${BASE_URL}/dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`Status: ${result.status}`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    console.log('---'.repeat(20));
    
    if (result.status === 200 && result.data.success) {
      console.log('✅ DASHBOARD test passed');
    } else {
      console.log('❌ DASHBOARD test failed');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('❌ DASHBOARD test failed');
  }
}

async function testDashboardWithoutToken() {
  console.log('🧪 Testing DASHBOARD without token...');
  
  try {
    const result = await makeRequest(`${BASE_URL}/dashboard`, {
      method: 'GET'
    });
    
    console.log(`Status: ${result.status}`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    console.log('---'.repeat(20));
    
    if (result.status === 401) {
      console.log('✅ DASHBOARD NO TOKEN test passed');
    } else {
      console.log('❌ DASHBOARD NO TOKEN test failed');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('❌ DASHBOARD NO TOKEN test failed');
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Login API Tests...');
  console.log('=' .repeat(60));
  
  try {
    // Test successful login and get token
    const token = await testLoginSuccess();
    
    // Test failed login
    await testLoginFailure();
    
    // Test validation
    await testLoginValidation();
    
    // Test dashboard with token
    await testDashboardWithToken(token);
    
    // Test dashboard without token
    await testDashboardWithoutToken();
    
  } catch (error) {
    console.error('Test runner error:', error);
  }
  
  console.log('=' .repeat(60));
  console.log('🏁 All tests completed!');
}

// Check if this script is run directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testLoginSuccess,
  testLoginFailure,
  testLoginValidation,
  testDashboardWithToken,
  testDashboardWithoutToken
};
