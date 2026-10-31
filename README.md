# 🚀 TechStore PRO — Enterprise Full-Stack Luxury E-Commerce & Virtual Fitting Room Studio

<div align="center">

![TechStore PRO Banner](https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80)

### *Next-Generation Haute Couture & Tech Retail Ecosystem*

[![Live Storefront](https://img.shields.io/badge/Live%20Storefront-techstore--catalog.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://techstore-catalog.vercel.app)
[![Backend REST API](https://img.shields.io/badge/Backend%20API-Render%20Cloud-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://full-stack-ecommerce-catalog.onrender.com)
[![Aiven MySQL 8.0](https://img.shields.io/badge/Database-Aiven%20Cloud%20MySQL-FF5E00?style=for-the-badge&logo=mysql&logoColor=white)](https://aiven.io)
[![Java 17](https://img.shields.io/badge/Java-17%20LTS-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot 3.2.5](https://img.shields.io/badge/Spring%20Boot-3.2.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Redis](https://img.shields.io/badge/Caching-Redis%207%20%2B%20Spring%20Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io)
[![CI/CD](https://github.com/Faiz-Khan01/Full-Stack-eCommerce-Catalog/actions/workflows/deploy.yml/badge.svg)](https://github.com/Faiz-Khan01/Full-Stack-eCommerce-Catalog/actions)
[![Testing](https://img.shields.io/badge/Testing-JUnit%205%20%7C%20Mockito%20%7C%20Vitest-25A162?style=for-the-badge&logo=junit5&logoColor=white)](https://junit.org)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Razorpay](https://img.shields.io/badge/Payments-Razorpay%20UPI%20%26%20Cards-02042B?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**An enterprise-grade, full-stack luxury eCommerce and apparel platform engineered with Spring Boot 3, React 18 (Vite), Aiven Cloud MySQL, Redis Caching, and Razorpay.**  
Features an **Interactive 3D Virtual Fitting Room**, **AI Personal Stylist**, **Smart Sizing & Volume Engine**, **Spring Cache + Redis Performance Layer**, **Executive Real-Time Admin Suite**, **Automated CI/CD Pipeline (GitHub Actions)**, and **38+ Automated Unit & Integration Tests**.

[Explore Storefront ➔](https://techstore-catalog.vercel.app) • [View Backend Health ➔](https://full-stack-ecommerce-catalog.onrender.com) • [Admin Console ➔](https://techstore-catalog.vercel.app/admin/dashboard)

</div>

---

## ⚡ Live Deployments & Demo Access

| Environment | Service | Platform | URL |
| :--- | :--- | :--- | :--- |
| **Frontend Storefront** | Client Single Page Application (React 18 + Vite) | **Vercel** Edge CDN | [techstore-catalog.vercel.app](https://techstore-catalog.vercel.app) |
| **Backend REST API** | Microservice-ready Spring Boot 3 Web Application | **Render** Cloud Containers | [full-stack-ecommerce-catalog.onrender.com](https://full-stack-ecommerce-catalog.onrender.com) |
| **Relational Database** | Managed MySQL 8.0 Instance (SSL Required) | **Aiven** Cloud | `mysql-230ef735-faizkhan966563-8d25.e.aivencloud.com:14977` |

### 🔑 Demo Credentials
- **Admin Access**: Sign in with email `ukharry128@gmail.com` or `faizkhan966563@gmail.com` to access `/admin/dashboard`.
- **Customer Access**: Use one-click **Google Sign-In** or register a new customer account instantly.

---

## 📑 Table of Contents

1. [🌟 Feature Matrix](#-feature-matrix)
2. [🏗️ Architecture & Data Flow](#-architecture--data-flow)
3. [🧥 Deep Dive: Core Platform Modules](#-deep-dive-core-platform-modules)
   - [1. 3D Virtual Fitting Room Studio](#1-3d-virtual-fitting-room-studio)
   - [2. AI Personal Stylist & Fragrance Concierge](#2-ai-personal-stylist--fragrance-concierge)
   - [3. Smart Sizing & Volume Matrix](#3-smart-sizing--volume-matrix)
   - [4. Razorpay Payment Gateway & INR Pricing](#4-razorpay-payment-gateway--inr-pricing)
   - [5. Courier Tracking & Pincode Resolution](#5-courier-tracking--pincode-resolution)
   - [6. Executive Admin Operations Suite](#6-executive-admin-operations-suite)
   - [7. AI Model Photo & Video Motion Studio](#7-ai-model-photo--video-motion-studio)
   - [8. Customer Support Ticketing System](#8-customer-support-ticketing-system)
   - [9. Promotional Coupons & Discount Engine](#9-promotional-coupons--discount-engine)
   - [10. Verified Reviews & Star Ratings](#10-verified-reviews--star-ratings)
   - [11. Automated GST Tax Invoicing (PDF)](#11-automated-gst-tax-invoicing-pdf)
   - [12. Dual Authentication & Role Security](#12-dual-authentication--role-security)
4. [🛠️ Technology Stack](#-technology-stack)
5. [🌐 Complete REST API Documentation](#-complete-rest-api-documentation)
6. [💾 Database Schema & ER Diagram](#-database-schema--er-diagram)
7. [⚙️ Local Development Setup](#-local-development-setup)
8. [🐳 Docker Containerization](#-docker-containerization)
9. [☁️ Cloud Deployment Guide](#-cloud-deployment-guide)
10. [👨‍💻 Author & Connect](#-author--connect)

---

## 🌟 Feature Matrix

| Capability | Customer Storefront | Admin Control Suite |
| :--- | :---: | :---: |
| **Interactive 3D Virtual Fitting Room** | ✅ Full Mannequin Studio | ✅ Preview in Product Studio |
| **AI Personal Stylist & In-Chat Mini Cards** | ✅ Live Fragrance & Apparel Advisor | ✅ AI Catalog Management Assistant |
| **Smart Sizing Engine (S-XL, 30-36", UK 7-11, 50-150ml)** | ✅ Dynamic Variant Selector | ✅ SKU & Variant Inventory Control |
| **Unified Indian Rupee (`₹` INR) & Razorpay** | ✅ UPI, Netbanking, Cards, COD | ✅ Transaction & Settlement View |
| **Indian Pincode Auto-Location Detection** | ✅ Real-Time Postal Resolution | ❌ N/A |
| **Order Tracking & Multi-Courier AWB Links** | ✅ Visual 4-Stage Timeline | ✅ Assign Courier & Dispatch AWB |
| **Automated Tax Invoice Generation** | ✅ 1-Click Client-Side PDF Download | ✅ Download Invoices per Order |
| **Support Ticket Desk & Audit Logs** | ✅ Create & Monitor Support Tickets | ✅ Triage, Prioritize & Reply to Tickets |
| **Inventory Low-Stock Warning System** | ❌ N/A | ✅ Live Threshold & Restock Dialog |
| **Category Taxonomy & Hierarchy Control** | ❌ N/A | ✅ Dual Grid/Table + 6 Luxury Presets |
| **Verified Product Reviews & Ratings** | ✅ Submit Ratings with Stars | ✅ Moderate & Inspect Reviews |
| **Promotional Coupon Discount Engine** | ✅ Apply at Cart & Checkout | ✅ Manage Promo Codes & Caps |
| **Adaptive Glassmorphic Dark/Light Mode** | ✅ Instant Theme Toggle | ✅ Consistent Admin Dark Theme |

---

## 🏗️ Architecture & Data Flow

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 CLIENT LAYER (Browser)                                 │
│  React 18.3 (Vite 7) • React Router 7 • Tailwind CSS • Three.js 3D • Recharts • jsPDF  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ HTTPS / REST JSON
                                            │ Bearer JWT / CORS Managed
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                            APPLICATION LAYER (Spring Boot 3.2.5)                       │
│  Render Docker Container • Java 17 LTS • Tomcat 10.1 • Spring Security 6               │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│  • JwtAuthFilter (Stateless Bearer JWT)   │  • Razorpay Java SDK 1.4.3                 │
│  • Spring Security CORS Configuration     │  • Spring Mail (Gmail SMTP TLS 587)        │
│  • Catalog & Virtual Fitting Room API     │  • Courier AWB & Tracking Adapter          │
│  • Order Fulfillment & Inventory Engine   │  • Customer Support Ticket Triage Service  │
│  • Indian Postal Pincode Resolver         │  • Coupon & Pricing Promotion Calculation  │
└─────────────────────┬─────────────────────┴───────────────────────┬────────────────────┘
                      │ Cache-Aside (@Cacheable/@CacheEvict)        │ JDBC / SSL Required
                      ▼                                             │ Hibernate ORM
┌───────────────────────────────────────────┐                       ▼
│        CACHING LAYER (Redis 7)            │  ┌─────────────────────────────────────────┐
│ • Categories: 60m TTL                     │  │      PERSISTENCE LAYER (Aiven Cloud)    │
│ • Products: 15m TTL                       │  │ MySQL 8.0 Instance • HikariCP • InnoDB  │
│ • Fault-tolerant DB fallback              │  │ users • products • categories • orders  │
└───────────────────────────────────────────┘  └─────────────────────────────────────────┘
```

---

## 🧥 Deep Dive: Core Platform Modules

### 1. 3D Virtual Fitting Room Studio
- **3D Sculpted Atelier Mannequin Bust**: Renders high-fashion garments draped directly onto a three-dimensional bust model with real-time lighting and shadow effects.
- **Dynamic Scale Adjustment**: Selecting different sizes (`S`, `M`, `L`, `XL` or shoes `UK 7–11`) seamlessly scales the garment visually on the mannequin.
- **Active Garment Removal Controls**:
  - `✕` button on the floating active piece badge to remove the worn garment.
  - `✕` on individual wardrobe rack thumbnails to remove them from your personal wardrobe.
  - **"Clear"** button in the wardrobe header to reset the entire fitting studio.
- **Add Outfit to Cart**:
  - Persists the active garment with chosen size into `guestCart` (for guest visitors) and synchronizes with `/api/cart/add/...` for authenticated users.
  - Fires real-time `cartUpdated` events to immediately update the navigation badge, followed by an interactive **"View Cart 🛒"** confirmation popup.

### 2. AI Personal Stylist & Fragrance Concierge
- **Real-Time Catalog Search**: Powered by dynamic catalog queries, the AI assistant analyzes queries for specific departments (Perfumes, Shoes, Jackets, Pants).
- **Interactive In-Chat Product Mini-Cards**:
  - Renders thumbnail image, title, Indian Rupee price (`₹`), **"🧥 Fit"** button (sends product directly to the Virtual Fitting Room), and **"↗ View"** button (opens Product Detail).
- **Domain-Specific Styling Presets**:
  - *Perfumes*: Recommends signature 50ml, 100ml, and 150ml flacons with scent notes and occasions.
  - *Outerwear & Apparel*: Provides chest and shoulder measurement recommendations.
  - *Footwear*: Advises on UK/EU shoe conversions.
  - *Order Assistance*: Directs customers to live tracking.

### 3. Smart Sizing & Volume Matrix
The platform features an intelligent, category-aware sizing engine (`productSizes.js`) that automatically assigns the correct variant structure based on item attributes:

| Category | Available Sizes | Details | Scale Factor |
| :--- | :--- | :--- | :--- |
| **Apparel** *(Shirts, Jackets, Tees)* | `S`, `M`, `L`, `XL` | Chest: 38", 40", 42", 44" | 0.94x → 1.12x |
| **Bottoms** *(Pants, Trousers, Jeans)* | `S (30")`, `M (32")`, `L (34")`, `XL (36")` | Waist measurements | 0.94x → 1.12x |
| **Footwear** *(Shoes, Boots, Sneakers)*| `UK 7`, `UK 8`, `UK 9`, `UK 10`, `UK 11` | EU 41 through EU 45 | 0.94x → 1.08x |
| **Fragrances** *(Perfumes, Colognes)* | `50 ml`, `100 ml`, `150 ml` | Travel Spray, Signature, Atelier | 0.95x → 1.08x |
| **Accessories** *(Watches, Bags, Belts)*| `Standard` | One Size / Bespoke Fit | 1.00x |

Integrated seamlessly into:
- **Product Detail Page**: Selectable pill buttons with dynamic modal **"Size Guide 📏"**.
- **Cart & Checkout**: Size and volume badges persist under each item (e.g. `Size: UK 9`, `Volume: 100 ml`).

### 4. Razorpay Payment Gateway & INR Pricing
- **Unified Indian Rupee (`₹` INR)**: Consistent currency formatting across storefront, admin, cart, checkout, emails, and invoices.
- **Complete Razorpay Checkout Integration**:
  - Instant UPI payments (Google Pay, PhonePe, Paytm, BHIM).
  - Credit & Debit Cards (Visa, Mastercard, RuPay, Amex).
  - Net Banking across 50+ Indian banks.
  - Cash on Delivery (COD) with automated validation.
- **Cryptographic Webhook & Signature Verification**: Validates `razorpay_signature` using HMAC-SHA256 with the backend API secret before marking orders as `PAID`.

### 5. Courier Tracking & Pincode Resolution
- **Indian Postal Pincode API**: Typing a 6-digit Indian pincode instantly resolves and autofills City, District, and State on checkout and location modals.
- **Multi-Courier Support**: Supports automated AWB linking for **Delhivery**, **BlueDart**, **DTDC**, **Shadowfax**, **Ekart**, and **FedEx**.
- **Visual Order Lifecycle**:
  ```text
  [PLACED] ➔ [PROCESSING] ➔ [SHIPPED] ➔ [DELIVERED]
  ```
- Public order tracking at `/track` by either Order Number (`ORD-2026-XXXX`) or Courier AWB number.

### 6. Executive Admin Operations Suite
- **📊 Real-Time Analytics Dashboard (`/admin/dashboard`)**:
  - **Zero Mock Numbers**: Revenue, order count, unique customers, and catalog inventory calculated live from database records.
  - **Weekday Sales Scrubber**: Interactive slider to inspect sales revenue for Sat, Sun, Mon, Tue, Wed, Thu, and Fri.
  - **Revenue Goal Progress Ring**: Dynamic SVG circle tracking progress against monthly revenue targets.
  - **Order Fulfillment Rate**: Live percentage of completed vs total orders.
  - **Recent Transactions**: Filterable table with direct customer emails and Indian Rupee totals.
- **🗂️ Redesigned Category Taxonomy Manager (`/admin/categories`)**:
  - Executive KPI cards (Total Departments, Cataloged Products, Category Density Index).
  - Dual View Modes: **Luxury Grid (⊞)** with product preview thumbnails & **High-Density Table (☰)** with density meters.
  - Category Inspector Drawer: Click *"👁️ Products"* to inspect all items assigned to a category.
  - Curated 1-Click Unsplash Cover Presets: Apparel, Footwear, Fragrances, Watches, Bags, and Electronics.
- **🏷️ Product & Inventory Control (`/admin/products`, `/admin/inventory`)**:
  - Create, update, and delete products with SKU, compare prices, cost prices, and category assignments.
  - Low-stock and out-of-stock badges with inline restock dialogs.
- **👥 Customer Directory (`/admin/customers`)**:
  - Customer lifetime spending, order frequency, and contact information.

### 7. AI Model Photo & Video Motion Studio
- **Generative Model Photography**: Studio modal inside product administration with curated lifestyle prompts and diverse model demographics.
- **Video Motion Presets**:
  - Turntable 360° product rotation
  - Runway model walk with garment flow
  - Macro fabric zoom and lighting shifts
  - High-fashion editorial lookbook panning

### 8. Customer Support Ticketing System
- **Customer Self-Service (`/contact`)**:
  - File tickets with Priority (`LOW`, `MEDIUM`, `HIGH`) and Category (`ORDER`, `PAYMENT`, `PRODUCT`, `RETURN`, `DELIVERY`, etc.).
- **Admin Support Desk (`/admin/support`)**:
  - Real-time ticket queue, priority filtering, status toggling (`OPEN`, `IN_PROGRESS`, `RESOLVED`), and direct customer reply threads.

### 9. Promotional Coupons & Discount Engine
- Apply discount promo codes at Cart and Checkout.
- Percentage-based or fixed-value deductions with minimum cart thresholds and expiration dates.

### 10. Verified Reviews & Star Ratings
- 5-star customer review system on product pages with verified purchaser badges, review timestamps, and average rating breakdowns.

### 11. Automated GST Tax Invoicing (PDF)
- Client-side PDF generation using **jsPDF** & **jsPDF-AutoTable**.
- Branded header, company GST details, customer billing address, itemized product table, tax breakdown, and courier tracking details.

### 12. Dual Authentication & Role Security
- **Google OAuth 2.0**: One-click social sign-in with automatic user provisioning and profile synchronization.
- **Email & Password**: BCrypt password hashing, role-based authorization (`ROLE_USER`, `ROLE_ADMIN`), and stateless JWT token issuance.

---

## 🛠️ Technology Stack

```text
┌────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND STACK                            │
├───────────────────────┬────────────────────────────────────────────────┤
│ Framework             │ React 18.3.1 (Vite 7.3.6)                      │
│ Routing               │ React Router 7.0                               │
│ State Management      │ React Context API + LocalStorage Sync          │
│ Styling & Design      │ Tailwind CSS + Glassmorphism CSS Architecture  │
│ 3D Visualization      │ Three.js 0.160 + HTML5 Canvas                  │
│ Data Visualization    │ Recharts 2.12 (Responsive Area & Bar Charts)   │
│ PDF Generation        │ jsPDF 2.5.1 + jsPDF-AutoTable 3.8.2            │
│ Dialogs & Toasts      │ SweetAlert2 11.10                              │
│ HTTP Client           │ Axios 1.6 with JWT Request Interceptors        │
└───────────────────────┴────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                              BACKEND STACK                             │
├───────────────────────┬────────────────────────────────────────────────┤
│ Language & Runtime    │ Java 17 LTS (Eclipse Adoptium OpenJDK)         │
│ Core Framework        │ Spring Boot 3.2.5                              │
│ Caching Layer         │ Redis 7 + Spring Boot Starter Cache            │
│ Security Architecture │ Spring Security 6.2 + JJWT 0.11.5              │
│ Data Access & ORM     │ Spring Data JPA + Hibernate Core 6.4           │
│ Connection Pooling    │ HikariCP 5.0                                   │
│ Relational Database   │ MySQL 8.0 (Connector/J 8.3)                    │
│ Payment Integration   │ Razorpay Java SDK 1.4.3                        │
│ Transactional Emails  │ Spring Mail + Jakarta Mail (Gmail SMTP 587)    │
│ Testing Suite         │ JUnit 5 + Mockito + MockMvc                    │
│ Build Tool            │ Apache Maven 3.9+                              │
└───────────────────────┴────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                             DEVOPS & CI/CD                             │
├───────────────────────┬────────────────────────────────────────────────┤
│ CI/CD Automation      │ GitHub Actions (.github/workflows/deploy.yml)  │
│ Unit Testing (FE)     │ Vitest 5.0 (Unit & Utility Suites)             │
│ Unit Testing (BE)     │ JUnit 5 + Mockito (27+ Passing Suites)         │
│ Containerization      │ Docker Multi-Stage Build                       │
│ Cloud Hosting         │ Vercel (Frontend Edge) + Render (Docker API)   │
│ Cloud Database        │ Aiven Managed Cloud MySQL 8.0 (SSL)            │
└───────────────────────┴────────────────────────────────────────────────┘
```

---

## ⚡ Enterprise Highlights: Redis Caching, Automated Tests & CI/CD

### 1. ⚡ Redis Caching & Fault-Tolerant Fallback
- **Spring Cache + Redis 7**: Reduces database queries by up to 80% on catalog read traffic.
- **Granular TTL Policies**:
  - `categories` cache: **60-minute TTL** (infrequently updated catalog hierarchy).
  - `products` cache: **15-minute TTL** (dynamically kept in sync with stock & price changes).
- **Automated Cache Invalidation**:
  - Mutations (`POST /api/products`, `PUT`, `DELETE`) trigger `@CacheEvict(allEntries = true)`.
  - Category changes trigger cascading cache eviction on both categories and related products.
- **Resilient Circuit Fallback (`CacheErrorHandler`)**:
  - Custom error handler gracefully intercepts Redis connection issues (e.g. during maintenance or local test runs) and seamlessly falls back to direct database queries without throwing errors to end users.

### 2. 🧪 Automated Testing Suite (JUnit 5 + Mockito + Vitest)
- **Backend (27 Tests, 0 Failures)**:
  - `ProductServiceTest`: Catalog search, category filters, CRUD lifecycle, and price validation.
  - `CategoryServiceTest`: Taxonomy retrieval, caching, updates, and deletion.
  - `UserServiceTest`: User creation, duplicate email prevention, role assignment.
  - `OrderServiceTest`: Razorpay order creation, status transitions, user order history.
  - `CategoryControllerTest`: Standalone MockMvc HTTP status and payload serialization.
  - `CacheConfigTest`: RedisCacheManager bean configuration and CacheErrorHandler fault-tolerance.
- **Frontend (11 Tests, 0 Failures)**:
  - `productSizes.test.js`: Sizing matrix logic across Perfumes (50-150ml), Footwear (UK 7-11), Pants (30"-36"), and Apparel (S-XL).
  - `pricing.test.js`: Dynamic Indian Rupee (`₹`) calculations, free delivery threshold (>= ₹500), coupon logic, and subtotal rounding.

### 3. 🔄 Automated CI/CD Pipeline (GitHub Actions)
- Located at `.github/workflows/deploy.yml`, triggered automatically on every `push` and `pull_request` to `main`:
  - **Job 1: Backend CI**: Boots an Ubuntu runner with a live Redis 7 service container, configures JDK 17, and runs `mvn clean test` and `mvn package`.
  - **Job 2: Frontend CI**: Sets up Node.js 20, runs `npm test` with Vitest, and compiles production assets with Vite (`npm run build`).

---

## 🌐 Complete REST API Documentation

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register customer with name, email & password | Public |
| `POST` | `/api/auth/login` | Authenticate customer or admin and return JWT | Public |
| `GET` | `/api/users/profile` | Retrieve profile of authenticated token owner | User / Admin |

### 🛍️ Products & Catalog (`/api/products`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Get list of all active products | Public |
| `GET` | `/api/products/{id}` | Get detailed product specifications by ID | Public |
| `GET` | `/api/products/category/{catId}`| Get products belonging to a category | Public |
| `POST` | `/api/admin/products` | Create product (name, price, stock, category, etc.) | Admin |
| `PUT` | `/api/admin/products/{id}` | Update product details or inventory | Admin |
| `DELETE`| `/api/admin/products/{id}` | Delete product permanently | Admin |

### 🗂️ Categories (`/api/categories`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Retrieve all product departments | Public |
| `POST` | `/api/admin/categories` | Create new category department | Admin |
| `PUT` | `/api/admin/categories/{id}` | Update category name, description, cover image | Admin |
| `DELETE`| `/api/admin/categories/{id}` | Delete category department | Admin |

### 🛒 Shopping Cart (`/api/cart`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart?email={email}` | Retrieve customer's active shopping cart | User |
| `POST` | `/api/cart/add/{id}?email={email}`| Add product and selected size to cart | User |
| `PUT` | `/api/cart/update/{id}` | Increment, decrement, or set item quantity | User |
| `DELETE`| `/api/cart/remove/{id}` | Remove specific product from cart | User |
| `DELETE`| `/api/cart/clear` | Empty all items from cart | User |

### 📦 Orders & Fulfillment (`/api/orders`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Place order (COD or Pre-paid Razorpay) | User |
| `GET` | `/api/orders/user/{email}` | Retrieve customer's order history | User |
| `GET` | `/api/orders/track/{query}` | Public track by Order Number or Courier AWB | Public |
| `POST` | `/api/orders/{id}/cancel` | Cancel order and automatically restore inventory | User / Admin |
| `GET` | `/api/admin/orders` | Retrieve all platform orders for administration | Admin |
| `PUT` | `/api/admin/orders/{id}/shipping` | Assign courier service and AWB tracking number | Admin |
| `PUT` | `/api/admin/orders/{id}/status` | Update order state (`PROCESSING`, `DELIVERED`, etc.) | Admin |

### 💳 Razorpay Payments (`/api/payment`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payment/create-order` | Create Razorpay order entity with amount in paise | User |
| `POST` | `/api/payment/verify` | Verify HMAC-SHA256 signature for payment success | User |

### 🎧 Support Tickets (`/api/support`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/support/tickets` | File new support request | User |
| `GET` | `/api/support/tickets` | Retrieve customer's support tickets | User |
| `GET` | `/api/admin/support/tickets` | View all customer tickets in admin portal | Admin |
| `PUT` | `/api/admin/support/tickets/{id}`| Respond to ticket and update status | Admin |

---

## 💾 Database Schema & ER Diagram

```text
  ┌──────────────┐          ┌───────────────────┐          ┌──────────────────┐
  │  categories  │          │     products      │          │      users       │
  ├──────────────┤          ├───────────────────┤          ├──────────────────┤
  │ id (PK)      │◄───1:N───┤ id (PK)           │          │ id (PK)          │
  │ name         │          │ name              │          │ name             │
  │ description  │          │ price             │          │ email (UQ)       │
  │ image_url    │          │ stock             │          │ password         │
  └──────────────┘          │ category_id (FK)  │          │ role             │
                            │ sku               │          └────────┬─────────┘
                            │ image_url         │                   │
                            └─────────┬─────────┘                   │ 1:N
                                      │                             │
                                      │ 1:N                         ▼
                            ┌─────────▼─────────┐          ┌──────────────────┐
                            │    order_items    │          │      orders      │
                            ├───────────────────┤          ├──────────────────┤
                            │ id (PK)           │          │ id (PK)          │
                            │ order_id (FK)     │◄───1:N───┤ order_number (UQ)│
                            │ product_id (FK)   │          │ user_id (FK)     │
                            │ quantity          │          │ total_amount     │
                            │ price             │          │ order_status     │
                            │ size              │          │ payment_method   │
                            └───────────────────┘          │ courier_name     │
                                                           │ tracking_number  │
                                                           │ shipping_address │
                                                           └──────────────────┘
```

---

## ⚙️ Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/Faiz-Khan01/Full-Stack-eCommerce-Catalog.git
cd Full-Stack-eCommerce-Catalog
```

### 2. Backend Setup
1. Open `product_catalog-backend/src/main/resources/application.yml` or create `.env` in `product_catalog-backend`:
   ```properties
   PORT=8082
   FRONTEND_URL=http://localhost:5173
   
   # Database Configuration (Aiven Cloud MySQL or Local MySQL)
   DB_URL=jdbc:mysql://localhost:3306/product_catalog?createDatabaseIfNotExist=true&useSSL=false
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password
   
   # Security & JWT
   JWT_SECRET=your_32_character_secret_key_here_12345
   JWT_EXPIRATION_MS=86400000
   ADMIN_EMAIL=admin@example.com
   
   # Payment Gateway (Razorpay Test Keys)
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   
   # Mail (Gmail SMTP App Password)
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your_gmail@gmail.com
   MAIL_PASSWORD=your_gmail_app_password
   ```
2. Build and start the backend service:
   ```bash
   cd product_catalog-backend
   mvn clean spring-boot:run
   ```
   *Spring Boot will launch at:* `http://localhost:8082`

### 3. Frontend Setup
1. Create `product_catalog-frontend/.env.local`:
   ```properties
   VITE_API_BASE_URL=http://localhost:8082/api
   VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
   ```
2. Install dependencies and start the Vite development server:
   ```bash
   cd ../product_catalog-frontend
   npm install
   npm run dev
   ```
   *Frontend will launch at:* `http://localhost:5173`

---

## 🐳 Docker Containerization

To run the entire full-stack ecosystem (Frontend, Backend, and MySQL) in isolated Docker containers:

```bash
docker-compose up --build -d
```

### Container Status & Port Mappings
| Service | Container Name | Port Mapping | Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | `ecom_frontend` | `5173:80` | React SPA served via Nginx with reverse proxy |
| **Backend** | `ecom_backend` | `8082:8082` | Spring Boot 3 Java runtime container |
| **Database** | `ecom_mysql` | `3306:3306` | MySQL 8.0 with persistent storage volume |

To view logs or stop containers:
```bash
docker-compose logs -f
docker-compose down
```

---

## ☁️ Cloud Deployment Guide

### Vercel (Frontend SPA)
1. Import repository in [Vercel Dashboard](https://vercel.com).
2. Set **Root Directory** to `product_catalog-frontend`.
3. Configure Environment Variables:
   - `VITE_API_BASE_URL` = `https://full-stack-ecommerce-catalog.onrender.com/api`
   - `VITE_RAZORPAY_KEY_ID` = `rzp_test_your_key_id`
4. Deploy!

### Render (Spring Boot Docker Backend)
1. Create a **Web Service** in [Render Dashboard](https://render.com).
2. Connect repository and set **Root Directory** to `product_catalog-backend`.
3. Choose **Docker** as the runtime environment.
4. Add Environment Variables:
   - `DB_URL` = Aiven Cloud MySQL connection URI with `?sslMode=REQUIRED`
   - `DB_USERNAME` = `avnadmin`
   - `DB_PASSWORD` = Your Aiven MySQL password
   - `FRONTEND_URL` = `https://techstore-catalog.vercel.app`
   - `JWT_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `ADMIN_EMAIL`
5. Deploy!

---

## 👨‍💻 Author & Connect

<div align="center">

### **Faiz Khan**
*Full Stack Software Engineer • Java & Spring Boot Specialist • React Developer*

Nagpur, Maharashtra, India • [faizkhan966563@gmail.com](mailto:faizkhan966563@gmail.com)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-faiz--khan-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/faiz-khan-743ba62a8)
[![GitHub](https://img.shields.io/badge/GitHub-Faiz--Khan01-181717?style=for-the-badge&logo=github)](https://github.com/Faiz-Khan01)
[![Portfolio](https://img.shields.io/badge/Portfolio-Live-brightgreen?style=for-the-badge&logo=vercel)](https://faiz-khan-portfolio-omega.vercel.app)
[![Email](https://img.shields.io/badge/Email-faizkhan966563@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:faizkhan966563@gmail.com)

---

⭐ **If you find TechStore PRO inspiring or useful for your projects, please star this repository!** ⭐

</div>
