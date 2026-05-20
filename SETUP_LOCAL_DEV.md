# Local Development Setup

## Overview
This project is configured to work with both local and production backends. The frontend automatically uses environment variables to determine which API to connect to.

## Backend Setup (Spring Boot)

### Prerequisites
- Java 17+
- Maven
- MySQL (running on port 3306)

### Running Locally
1. Navigate to backend directory:
   ```bash
   cd product_catalog-backend
   ```

2. Build and run:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

3. Backend will run on: `http://localhost:8082`

### CORS Configuration
The backend (`WebConfig.java`) is configured to accept requests from:
- `http://localhost:5173` (React dev server)
- `http://localhost:3000` (alternative dev port)
- `https://techstore-catalog.vercel.app` (production frontend)

## Frontend Setup (React + Vite)

### Prerequisites
- Node.js 16+ with npm

### Running Locally
1. Navigate to frontend directory:
   ```bash
   cd product_catalog-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. The `.env.local` file is already configured for local development:
   ```
   VITE_API_BASE_URL=http://localhost:8082/api
   ```

4. Start dev server:
   ```bash
   npm run dev
   ```

5. Frontend will run on: `http://localhost:5173`

## Switching Between Local & Production Backends

### Option 1: Local Backend (Development)
The `.env.local` file is pre-configured:
```
VITE_API_BASE_URL=http://localhost:8082/api
```
✅ Frontend on `localhost:5173` → Backend on `localhost:8082`

### Option 2: Production Backend
Update `.env.local` to:
```
VITE_API_BASE_URL=https://full-stack-ecommerce-catalog-13.onrender.com/api
```
✅ Frontend on `localhost:5173` → Backend on Render production

**Note:** The production backend's CORS is configured to allow `localhost:5173`, so you can test against production without issues.

## API Base URL Resolution
The app uses this priority:
1. **`.env.local`** (VITE_API_BASE_URL) - if set
2. **Production URL** - fallback: `https://full-stack-ecommerce-catalog-13.onrender.com/api`

## Troubleshooting

### CORS Errors
If you see "Access-Control-Allow-Origin" errors:
1. ✅ Make sure backend CORS config in `WebConfig.java` includes your frontend URL
2. ✅ Verify `.env.local` has correct `VITE_API_BASE_URL`
3. ✅ Restart both frontend and backend servers

### Cannot Connect to Backend
- Verify backend is running on port 8082: `http://localhost:8082`
- Check firewall settings
- Run `mvn spring-boot:run` from `product_catalog-backend` directory

### 403 Forbidden Errors
- Check `SecurityConfig.java` - ensure endpoints are permitted
- Verify correct port in `VITE_API_BASE_URL`

## Files Modified for Local Development

### Backend
- `src/main/java/com/ecom/productcatalog/config/WebConfig.java` - CORS configuration

### Frontend
- `.env.local` - Local development environment variables
- `.env.example` - Template for environment variables
- All component files updated to use `import.meta.env.VITE_API_BASE_URL` instead of hardcoded URLs

## Build for Production

### Frontend
```bash
npm run build
```
Builds static files to `dist/` directory. Ensure CORS is configured on production backend.

### Backend
```bash
mvn clean package
```
Creates executable JAR in `target/` directory.
