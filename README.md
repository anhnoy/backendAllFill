"# Login API

A simple and secure login API built with Node.js, Express, and JWT authentication.

## Features

- 🔐 JWT-based authentication
- 🛡️ Secure password hashing with bcryptjs
- 📝 Comprehensive logging with Winston
- 🚀 Express.js framework
- 🗄️ Sequelize ORM with MySQL
- 🔒 Security headers with Helmet
- 🌐 CORS enabled

## API Endpoints

### Authentication

#### POST `/api/admin/login`
Login with email and password to get JWT token.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "your_password"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "email": "admin@example.com"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### GET `/api/admin/dashboard`
Get dashboard data (requires valid JWT token).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Dashboard data fetched successfully!",
  "data": {}
}
```

#### GET `/api/admin/test`
Simple test endpoint to check if API is working.

**Response:**
```json
{
  "status": "ok"
}
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   DB_DIALECT=mysql
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=24h
   PORT=5000
   ```

4. Create the admin table in your MySQL database:
   ```sql
   CREATE TABLE admin (
     id INT AUTO_INCREMENT PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL
   );
   ```

5. Insert a test admin user (password should be hashed with bcryptjs):
   ```sql
   INSERT INTO admin (email, password) VALUES 
   ('admin@example.com', '$2a$10$your_hashed_password_here');
   ```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on `http://localhost:5000`

## Testing

Run the test script to verify all endpoints:

```bash
node test-login-api.js
```

This will test:
- ✅ Successful login with valid credentials
- ❌ Failed login with invalid credentials
- ⚠️ Validation errors for incomplete data
- 🔒 Protected dashboard endpoint with token
- 🚫 Protected dashboard endpoint without token

## Project Structure

```
backend/
├── config/
│   ├── database.js          # Database configuration
│   └── logger.js            # Winston logger setup
├── controllers/
│   └── adminController.js   # Login and dashboard logic
├── middlewares/
│   ├── authMiddleware.js    # JWT verification middleware
│   └── errorHandler.js     # Error handling middleware
├── models/
│   ├── admin.js            # Admin model
│   └── index.js           # Models index
├── repositories/
│   └── adminRepository.js  # Database operations
├── routes/
│   ├── adminRoute.js       # Admin routes
│   └── index.js           # Main router
├── logs/                   # Log files
├── .env                   # Environment variables
├── package.json
├── server.js             # Main server file
└── test-login-api.js     # API test script
```

## Security Features

- 🔐 **JWT Authentication**: Secure token-based authentication
- 🔒 **Password Hashing**: bcryptjs for secure password storage
- 🛡️ **Security Headers**: Helmet.js for security headers
- 🚫 **CORS Protection**: Configurable CORS policy
- 📝 **Request Logging**: Comprehensive logging for monitoring
- ⚠️ **Input Validation**: Server-side validation for all inputs

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `DB_HOST` | Database host | localhost |
| `DB_USER` | Database username | - |
| `DB_PASSWORD` | Database password | - |
| `DB_NAME` | Database name | - |
| `DB_DIALECT` | Database dialect | mysql |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 24h |

## License

MIT License" 
