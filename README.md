# ⚡ TechStore PRO — Enterprise Full-Stack eCommerce & Logistics Platform

<div align="center">

![Java 17](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-brightgreen?style=for-the-badge&logo=springboot)
![React 18](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.x-purple?style=for-the-badge&logo=vite)
![MySQL](https://img.shields.io/badge/MySQL-8.0-informational?style=for-the-badge&logo=mysql)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)
![Razorpay](https://img.shields.io/badge/Razorpay-Payment_Gateway-0C2340?style=for-the-badge&logo=razorpay)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge&logo=jsonwebtokens)

**A high-performance, full-featured eCommerce and Order Fulfillment platform engineered with Spring Boot, React.js (Vite), and MySQL.**

[Live Demo](https://techstore-catalog.vercel.app/) • [Portfolio](https://faiz-khan-portfolio-omega.vercel.app/) • [API Documentation](#-rest-api-reference) • [Docker Deployment](#-docker--container-deployment)

</div>

---

## 📖 Table of Contents
1. [🌟 Platform Overview](#-platform-overview)
2. [✨ Core Features](#-core-features)
   - [🛍️ Customer Storefront](#-customer-storefront)
   - [🚚 Shipping, Logistics & Realtime Courier Tracking](#-shipping-logistics--realtime-courier-tracking)
   - [🛡️ Enterprise Admin Control Center](#-enterprise-admin-control-center)
   - [📄 Automated PDF Tax Invoice Generator](#-automated-pdf-tax-invoice-generator)
3. [🏗️ System Architecture & Data Flow](#-system-architecture--data-flow)
4. [🛠️ Tech Stack](#️-tech-stack)
5. [🌐 REST API Reference](#-rest-api-reference)
6. [⚙️ Local Installation & Development](#-local-installation--development)
7. [🐳 Docker & Container Deployment](#-docker--container-deployment)
8. [🔐 Authentication & Authorization](#-authentication--authorization)
9. [👨‍💻 Author & Connect](#-author--connect)

---

## 🌟 Platform Overview

**TechStore PRO** is an end-to-end eCommerce ecosystem designed for modern retail. It goes beyond simple product browsing by delivering an integrated **shipping engine, automated courier assignment, live parcel milestone tracking, visual status steppers, instant PDF invoice generation, and a powerful multi-tab administrative portal**.

The frontend features a sleek **dark glassmorphism design** (`rgba(9, 13, 22, 0.88)` backdrop blur, vibrant emerald/cyan glows, live postal pincode detection) paired with a **code-split bundle architecture** (lazy loaded routes down to **44.9 kB**).

---

## ✨ Core Features

### 🛍️ Customer Storefront
* **Glassmorphism Navbar**: Real-time cart badge powered by `CartContext`, wishlist counter, Indian Postal API pincode locator, and animated dropdowns.
* **Smart Catalog**: Category filtering, instant multi-field search, price sorting, and detailed product specification views.
* **Shopping Cart & Checkout**: Database-backed cart synchronization with local state fallback, instant quantity steppers, and free shipping calculation.
* **Dual Payment Methods**: Secure **Razorpay Online Gateway** (UPI, Credit/Debit cards, NetBanking, Wallets) and **Cash on Delivery (COD)**.

### 🚚 Shipping, Logistics & Realtime Courier Tracking
1. **Visual Progress Stepper**: 4-step real-time order lifecycle tracker (`Placed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`).
2. **Courier Integration Engine**: Integrates with major Indian carriers (**Delhivery, BlueDart, DTDC, Shadowfax, Ekart, FedEx**) with official tracking links.
3. **Automated AWB Generation**: Auto-generates unique carrier airway bill numbers (`prefix-orderId-randomSuffix`).
4. **Delivery History & Audit Trail**: Comprehensive milestone timeline recording timestamps, event notes, and transit hubs.
5. **Shipping Charges Engine**: Tiered fee logic (e.g., standard ₹50 fee, automatic **FREE Shipping** on orders ≥ ₹500).
6. **Cancellation & Automated Restock**: 1-click customer order cancellation with automated inventory stock restoration and refund status tracking.
7. **Automated Email Dispatch**: Automated transactional emails for order confirmations, shipping dispatch with AWB links, and cancellations.

### 🛡️ Enterprise Admin Control Center
* **📊 Dashboard (`/admin/dashboard`)**: Real-time store KPIs, 7-month revenue area charts (`Recharts`), order status distribution donut charts, low-stock warnings, and top-selling product metrics.
* **📦 Shipping & Order Management (`/admin/orders`)**: Fulfill orders, change lifecycle states, assign courier partners, generate tracking numbers, view delivery history logs, and cancel/refund orders.
* **🏷️ Product Catalog (`/admin/products`)**: Create, update, delete products with live image URL previews, categories, and inline quick-stock adjusters.
* **🗂️ Category Management (`/admin/categories`)**: Manage store departments, cover banners, descriptions, and view live product-depth counts.
* **📊 Inventory & Stock Alert (`/admin/inventory`)**: Interactive stock adjusters, low-stock and out-of-stock badges, and one-click restock dialogs.
* **👤 Customer Directory (`/admin/customers`)**: Lifetime customer spend analytics, order history inspection modal, and contact directories.
* **⚙️ Operations Settings (`/admin/settings`)**: Configurable store profile, shipping thresholds, COD / Razorpay toggles, and notification preferences.

### 📄 Automated PDF Tax Invoice Generator
* Custom-branded invoice generator built with `jspdf` and `jspdf-autotable`.
* Generates formatted PDF tax invoices complete with order numbers, customer billing address, itemized product tables, shipping breakdowns, grand totals, and payment status stamps.

---

## 🏗️ System Architecture & Data Flow

```
                               ┌───────────────────────────────────┐
                               │       React 18 Single Page App    │
                               │   (Vite + Glassmorphism UI + CSS) │
                               └─────────────────┬─────────────────┘
                                                 │ HTTPS / REST (JSON)
                                                 │ Bearer JWT Authentication
                                                 ▼
                               ┌───────────────────────────────────┐
                               │     Spring Boot 3.x Backend API   │
                               │       (Java 17 Temurin JRE)       │
                               ├───────────────────────────────────┤
                               │ • Spring Security + JWT Filter    │
                               │ • Order & Shipping Service        │
                               │ • Courier Tracking Adapter        │
                               │ • Inventory & Stock Service       │
                               │ • JavaMailSender Email Service    │
                               └─────────────────┬─────────────────┘
                                                 │ Spring Data JPA / Hibernate
                                                 ▼
                               ┌───────────────────────────────────┐
                               │          MySQL 8.0 Database       │
                               │   (Orders, Products, Cart, Users) │
                               └───────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Description |
|---|---|
| **React 18** | Functional components with Hooks & Context API (`AuthContext`, `CartContext`) |
| **Vite 7** | Next-generation build tool with Rollup code-splitting & lazy loading |
| **React Router 7** | Client-side routing with role-based `ProtectedRoute` guards |
| **Recharts** | Interactive SVG AreaCharts, BarCharts, and PieCharts for Admin Analytics |
| **jsPDF & autoTable** | Client-side PDF tax invoice generation |
| **SweetAlert2** | Interactive toast notifications, confirmation modals, and dialogs |
| **Axios** | HTTP client configured with JWT interceptors |
| **Bootstrap 5 & Custom CSS** | Modern responsive grid & custom dark glassmorphism system |

### Backend
| Technology | Description |
|---|---|
| **Java 17 (LTS)** | Modern Java platform with Temurin OpenJDK |
| **Spring Boot 3.x** | Enterprise application framework |
| **Spring Security** | Stateless JWT authentication, role authorization, and CORS filters |
| **Spring Data JPA** | Hibernate ORM with transactional persistence |
| **MySQL 8.0** | Relational database storage |
| **Razorpay Java SDK** | Payment order creation, webhook verification, and refund flows |
| **Spring Mail** | Transactional HTML email notifications |
| **Maven** | Dependency management and build lifecycle |

---

## 🌐 REST API Reference

### 🔐 Authentication & Users
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new customer account | Public |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | Public |
| `GET` | `/api/users/profile` | Get authenticated user profile | User / Admin |

### 🛍️ Products & Categories
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/products` | Get all active products with category data | Public |
| `GET` | `/api/products/{id}` | Get product details by ID | Public |
| `GET` | `/api/categories` | List all departments/categories | Public |
| `POST` | `/api/admin/products` | Create a new product | Admin |
| `PUT` | `/api/admin/products/{id}` | Update product details | Admin |
| `DELETE` | `/api/admin/products/{id}` | Delete product from catalog | Admin |
| `POST` | `/api/admin/categories` | Create category | Admin |
| `PUT` | `/api/admin/categories/{id}` | Update category | Admin |
| `DELETE` | `/api/admin/categories/{id}` | Delete category | Admin |

### 🛒 Shopping Cart
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/cart?email={email}` | Fetch user cart items (Wrapped in `ApiResponse`) | User |
| `POST` | `/api/cart/add/{productId}?email={email}` | Add item to cart | User |
| `PUT` | `/api/cart/update/{productId}` | Update item quantity in cart | User |
| `DELETE` | `/api/cart/remove/{productId}` | Remove item from cart | User |
| `DELETE` | `/api/cart/clear` | Empty user cart | User |

### 📦 Orders & Shipping Logistics
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/orders` | Place new order with shipping fee computation | User |
| `GET` | `/api/orders/user/{email}` | Retrieve customer order history & tracking | User |
| `GET` | `/api/orders/track/{query}` | Track order by ID or Courier AWB | Public / User |
| `POST` | `/api/orders/{id}/cancel` | Cancel order & auto-restore product stock | User / Admin |
| `GET` | `/api/admin/orders` | List all platform orders with customer metrics | Admin |
| `PUT` | `/api/admin/orders/{id}/shipping` | Update status, assign courier & AWB, trigger email | Admin |
| `PUT` | `/api/admin/orders/{id}/status` | Update order/refund status | Admin |
| `GET` | `/api/admin/inventory/low-stock` | Get products below safety stock threshold | Admin |
| `PUT` | `/api/admin/inventory/{id}?stock={qty}` | Restock product inventory | Admin |

### 💳 Payments
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/payment/create-order` | Create Razorpay order | User |
| `POST` | `/api/payment/verify` | Verify payment signature and mark order paid | User |

---

## ⚙️ Local Installation & Development

### 1. Prerequisites
* **Java Development Kit (JDK 17+)**
* **Node.js (v18+)** and **npm**
* **MySQL Server 8.0+**
* **Maven 3.8+**

---

### 2. Clone Repository
```bash
git clone https://github.com/Faiz-Khan01/TechStore.git
cd TechStore
```

---

### 3. Backend Setup
1. Create a MySQL database:
   ```sql
   CREATE DATABASE product_catalog;
   ```
2. Configure credentials in `product_catalog-backend/src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/product_catalog?createDatabaseIfNotExist=true&useSSL=false
       username: root
       password: your_mysql_password
     jpa:
       hibernate:
         ddl-auto: update
   server:
     port: 8082
   ```
3. Compile and launch the backend:
   ```bash
   cd product_catalog-backend
   mvn clean spring-boot:run
   ```
   *Backend runs on: `http://localhost:8082`*

---

### 4. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd product_catalog-frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Frontend runs on: `http://localhost:5173`*

---

## 🐳 Docker & Container Deployment

The project includes production-ready Dockerfiles and a root `docker-compose.yml` for unified deployment.

### Launch Complete Stack with Docker Compose
```bash
docker-compose up --build -d
```

### Services Started:
* **`ecom_mysql`**: MySQL 8.0 Database (Port `3306`)
* **`ecom_backend`**: Spring Boot 3 API (Port `8082`)
* **`ecom_frontend`**: React SPA on Nginx Reverse Proxy (Port `5173` ➔ `80`)

To stop all services:
```bash
docker-compose down
```

---

## 🔐 Authentication & Authorization

TechStore PRO implements an enterprise-grade, multi-tiered security and authentication architecture:

* 🌐 **Google OAuth 2.0 / Google Sign-In**: Instant 1-click customer authentication directly using Google accounts, automatically syncing profile details and issuing secure JWT sessions.
* 📧 **Secure Email / Password Login & Signup**: User registration and login protected with **BCrypt password hashing**, email format validation, and signed HMAC-SHA256 JWT tokens.
* 🛡️ **Role-Based Access Control (RBAC)**: Fine-grained authorization separating **Customer (`ROLE_USER`)** and **Administrator (`ROLE_ADMIN`)** capabilities across REST endpoints and UI components.
* 🔒 **Protected Customer & Admin Routes**: Client-side route guards via `ProtectedRoute.jsx` preventing unauthorized URL access, paired with Spring Security stateless filters on backend APIs.

### 🛡️ RBAC Permissions Matrix

| Capability | Customer (`ROLE_USER`) | Administrator (`ROLE_ADMIN`) |
|---|:---:|:---:|
| Google OAuth & Email Signup/Login | ✅ | ✅ |
| Browse Products & Categories | ✅ | ✅ |
| Persistent Shopping Cart & Checkout | ✅ | ✅ |
| Order History & Live Parcel Tracking | ✅ | ✅ |
| Cancel Order & Automated Stock Restock | ✅ | ✅ |
| Admin Dashboard Analytics (`Recharts`) | ❌ | ✅ |
| Fulfill Orders, Assign Courier & AWB | ❌ | ✅ |
| Product & Category CRUD Management | ❌ | ✅ |
| Warehouse Inventory & Instant Restock | ❌ | ✅ |
| Customer Directory & Lifetime Value Metrics | ❌ | ✅ |
| Store Operations, Shipping & Gateway Settings | ❌ | ✅ |

### ⚡ Client State & Performance Architecture
* **Stateless JWT Authorization**: Bearer tokens persisted in secure browser storage with automated 401/403 Axios response interceptors.
* **React Context Providers**: Centralized `AuthProvider` and `CartProvider` wrapped at the root eliminate redundant component re-renders and cross-tab race conditions.
* **Dynamic Code Splitting**: Route-level `React.lazy()` chunking with custom Rollup manual chunks reduces initial bundle size to just **44.9 kB (11.4 kB gzipped)**.

---

## 👨‍💻 Author & Connect

**Faiz Khan**  
*Java Backend Developer & Full Stack Software Engineer*  

* 🌐 **Portfolio**: [faiz-khan-portfolio-omega.vercel.app](https://faiz-khan-portfolio-omega.vercel.app/)
* 💼 **LinkedIn**: [linkedin.com/in/faiz-khan-dev](https://www.linkedin.com/)
* 🐙 **GitHub**: [github.com/Faiz-Khan01](https://github.com/Faiz-Khan01)
* 📧 **Email**: [faizkhan966563@gmail.com](mailto:faizkhan966563@gmail.com)

---

<div align="center">
⭐ If you found this project helpful, please consider giving it a star on GitHub! ⭐
</div>
