// Debug script to test route loading
const express = require('express');
const app = express();

try {
  console.log('Testing route loading...');
  
  const adminRoutes = require('./routes/adminRoute');
  console.log('✅ Admin routes loaded');
  
  const tdacRoutes = require('./routes/tdacRoute');
  console.log('✅ TDAC routes loaded');
  
  const mainRoutes = require('./routes/index');
  console.log('✅ Main routes loaded');
  
  app.use('/api', mainRoutes);
  console.log('✅ Routes mounted');
  
  const server = app.listen(3001, () => {
    console.log('✅ Test server running on port 3001');
    
    // Test the routes
    const http = require('http');
    
    // Test admin route
    http.get('http://localhost:3001/api/admin/test', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Admin test result:', data);
        
        // Test TDAC route
        http.get('http://localhost:3001/api/tdac/test', (res2) => {
          let data2 = '';
          res2.on('data', chunk => data2 += chunk);
          res2.on('end', () => {
            console.log('TDAC test result:', data2);
            server.close();
            process.exit(0);
          });
        }).on('error', (err) => {
          console.log('TDAC test error:', err.message);
          server.close();
          process.exit(1);
        });
      });
    }).on('error', (err) => {
      console.log('Admin test error:', err.message);
      server.close();
      process.exit(1);
    });
  });
  
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  console.error(error.stack);
  process.exit(1);
}
