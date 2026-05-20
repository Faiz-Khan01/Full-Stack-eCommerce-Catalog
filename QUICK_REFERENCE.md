# Quick Reference - CORS & API Configuration

## 🚀 Start Local Development in 3 Steps

### Terminal 1 - Backend
```bash
cd product_catalog-backend
mvn spring-boot:run
# ✅ Backend runs on http://localhost:8082
```

### Terminal 2 - Frontend
```bash
cd product_catalog-frontend
npm install      # first time only
npm run dev
# ✅ Frontend runs on http://localhost:5173
```

### Terminal 3 - Browser
```
http://localhost:5173
```

---

## 📝 Configuration Files

### Local Development (`.env.local`)
```env
VITE_API_BASE_URL=http://localhost:8082/api
```

### Production (Automatic via code)
```javascript
// Falls back to production URL if env var not set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  'https://full-stack-ecommerce-catalog-13.onrender.com/api';
```

---

## ✅ CORS Allowlist (Backend)

**File:** `WebConfig.java`

The backend accepts requests from:
- ✅ `http://localhost:5173` (React dev)
- ✅ `http://localhost:3000` (alt dev)
- ✅ `https://techstore-catalog.vercel.app` (production)

---

## 🔧 Switching Between Environments

### Use Local Backend
Edit `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8082/api
```

### Use Production Backend
Edit `.env.local`:
```env
VITE_API_BASE_URL=https://full-stack-ecommerce-catalog-13.onrender.com/api
```

**Note:** No code changes needed - just update the env file!

---

## ❌ Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| "CORS policy: No 'Access-Control-Allow-Origin'" | Frontend origin not in CORS allowlist | Add origin to `WebConfig.java` |
| "Failed to fetch" (503/403) | Backend not running | Run `mvn spring-boot:run` |
| "Cannot connect to localhost:8082" | Wrong port or URL in `.env.local` | Check `VITE_API_BASE_URL` |
| Blank page with no errors | Backend returning 403 | Check `SecurityConfig.java` permissions |

---

## 📦 What Was Fixed

✅ Backend CORS allows `localhost:5173`
✅ Frontend uses environment variables for API URLs
✅ `.env.local` pre-configured for local dev
✅ All 12+ component files updated
✅ Production fallback maintained
✅ Documentation provided

---

## 🎯 API Base URLs Used

All API calls now follow this pattern:

```javascript
// Instead of:
fetch("https://full-stack-ecommerce-catalog-13.onrender.com/api/products")

// Components now use:
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://...';
fetch(`${API_BASE_URL}/products`)
```

This works for:
- ✅ `/api/cart`
- ✅ `/api/products`
- ✅ `/api/categories`
- ✅ `/api/orders`
- ✅ `/api/auth/*`
- ✅ `/api/admin/*`
- ✅ `/api/payment/*`

---

## 📞 Questions?

Refer to:
- **Setup Instructions:** `SETUP_LOCAL_DEV.md`
- **Complete Summary:** `FIXES_SUMMARY.md`
- **Backend Config:** `product_catalog-backend/src/main/java/com/ecom/productcatalog/config/WebConfig.java`
- **Frontend Env:** `product_catalog-frontend/.env.local`

