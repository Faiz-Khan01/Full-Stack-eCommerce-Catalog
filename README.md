# 🚀 TechStore PRO — Enterprise Full-Stack E-Commerce & Virtual Fitting Room Platform

<div align="center">

[![Live Demo](https://img.shields.io/badge/Demo-techstore--catalog.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://techstore-catalog.vercel.app)
[![API Status](https://img.shields.io/badge/API-Render%20Cloud-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://full-stack-ecommerce-catalog.onrender.com)
[![Database](https://img.shields.io/badge/Database-Aiven%20MySQL%208.0-FF5E00?style=for-the-badge&logo=mysql&logoColor=white)](https://aiven.io)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**A production-ready, full-stack luxury eCommerce ecosystem built with Spring Boot 3, React 18 (Vite), Aiven Cloud MySQL, and Razorpay.**  
Featuring an **Interactive 3D Virtual Fitting Room**, **AI Personal Stylist**, **Smart Sizing Engine**, **Executive Admin Analytics**, and **Logistics Tracking**.

[Explore Live Storefront ➔](https://techstore-catalog.vercel.app) • [View Backend API ➔](https://full-stack-ecommerce-catalog.onrender.com)

</div>

---

## 📑 Table of Contents

- [Key Highlights & New Features](#-key-highlights--new-features)
- [System Architecture](#-system-architecture)
- [Core Features & Modules](#-core-features--modules)
  - [1. 🧥 3D Virtual Fitting Room](#1--3d-virtual-fitting-room)
  - [2. 🤖 AI Personal Stylist & Fragrance Concierge](#2--ai-personal-stylist--fragrance-concierge)
  - [3. 📏 Smart Sizing & Volume Engine](#3--smart-sizing--volume-engine)
  - [4. 🛡️ Executive Admin Management Suite](#4-️-executive-admin-management-suite)
  - [5. 💳 Razorpay & Indian Currency (₹ INR)](#5--razorpay--indian-currency--inr)
  - [6. 🚚 Courier Tracking & Pincode Resolution](#6--courier-tracking--pincode-resolution)
  - [7. 📄 Automated PDF Tax Invoices](#7--automated-pdf-tax-invoices)
- [Technology Stack](#-technology-stack)
- [REST API Reference](#-rest-api-reference)
- [Local Installation & Setup](#-local-installation--setup)
- [Docker Deployment](#-docker-deployment)
- [Environment Configuration](#-environment-configuration)
- [Author & Connect](#-author--connect)

---

## 🌟 Key Highlights & New Features

| Feature | Description |
| :--- | :--- |
| **🧥 3D Virtual Fitting Room** | Interactive studio draped onto a 3D mannequin bust with live size scaling, garment removal, wardrobe carousel, and instant *Add Outfit to Cart*. |
| **🤖 AI Personal Stylist** | Real-time catalog search concierge with interactive product mini-cards, fit recommendations, and direct fitting room transfer. |
| **📏 Smart Sizing Engine** | Automatic variant mapping: Apparel (`S - XL`), Pants (`30" - 36"`), Footwear (`UK 7 - 11`), Perfumes (`50ml - 150ml`). |
| **🗂️ Admin Taxonomy Suite** | Redesigned Category Manager with Executive KPIs, dual Grid/Table views, category inspector drawer, and 6 curated high-res cover presets. |
| **📊 Real-Time Admin Analytics** | 100% database-calculated dashboard metrics (live revenue, customer base, weekday sales scrubber, fulfillment rate ring, no hardcoded stats). |
| **🇮🇳 Indian Rupee (₹ INR) & Razorpay** | Native INR currency formatting across cart, checkout, invoices, and payment gateway (UPI, Netbanking, Cards, COD). |
| **☁️ Cloud-Ready Architecture** | Deployed across Vercel (Frontend), Render (Spring Boot Docker Backend), and Aiven (Cloud MySQL). |

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        React 18 SPA (Vite)                             │
│       Vercel Edge CDN • Tailwind/Glassmorphism • Three.js 3D Viewers    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / REST JSON
                                    │ Bearer JWT / CORS Managed
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    Spring Boot 3.2.5 Backend API                       │
│                       Render Docker Container                          │
├───────────────────────────────────┬────────────────────────────────────┤
│  • Spring Security 6 (Stateless)  │  • Razorpay SDK Integration        │
│  • Dynamic CORS Configuration     │  • Transactional Gmail SMTP        │
│  • Order Fulfillment & Logistics  │  • Support Ticket Service          │
│  • Inventory & Low-Stock Alerts   │  • Pincode Location Resolution     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ JDBC / Spring Data JPA
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Aiven Cloud MySQL 8.0                            │
│           Users • Products • Categories • Orders • Payments            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 💎 Core Features & Modules

### 1. 🧥 3D Virtual Fitting Room
- **3D Mannequin Draping**: Drapes actual catalog product imagery onto an atelier bust model.
- **Dynamic Size Scaling**: Size selection alters garment scaling visually in real-time.
- **Wardrobe Rack**: Browse and wear saved items from your personal rack.
- **Garment Removal**: Click `✕` on the floating piece badge, clear individual items, or reset the fitting room.
- **Add Outfit to Cart**: Adds worn item and chosen size to cart with automatic guest/user synchronization.

### 2. 🤖 AI Personal Stylist & Fragrance Concierge
- **Live Catalog Exploration**: Queries active inventory to recommend specific apparel, footwear, and perfumes.
- **Interactive Mini-Cards**: Product suggestions inside chat with thumbnail, `₹` price, **"🧥 Fit"** (opens fitting room), and **"↗ View"** buttons.
- **Smart Conversational Presets**: Sizing guide, outerwear consultation, fragrance notes, and order tracking.

### 3. 📏 Smart Sizing & Volume Engine
- **Apparel (Shirts, Jackets, Tees)**: `S (38")`, `M (40")`, `L (42")`, `XL (44")`
- **Bottoms (Pants, Trousers, Jeans)**: `S (30")`, `M (32")`, `L (34")`, `XL (36")`
- **Footwear (Sneakers, Shoes, Loafers)**: `UK 7 (EU 41)` to `UK 11 (EU 45)`
- **Fragrances (Perfumes, Colognes)**: `50 ml (Travel Spray)`, `100 ml (Signature Flacon)`, `150 ml (Atelier Edition)`
- **Interactive Size Selector**: Integrated into Product Detail, Cart, and Checkout summaries.

### 4. 🛡️ Executive Admin Management Suite
- **📊 Real-Time Analytics Dashboard**:
  - Live revenue, order count, and customer metrics computed directly from database records.
  - Interactive weekday sales scrubber (Sat - Fri).
  - Dynamic monthly revenue goal progress ring.
  - Live order fulfillment and processing rate indicator.
  - Recent transactions table formatted in Indian Rupees (`₹`).
- **🗂️ Category Taxonomy Manager**:
  - Dual view modes: **Luxury Grid (⊞)** with product previews & **High-Density Table (☰)** with density bars.
  - Category Inspector Drawer to view all products assigned to a department.
  - Curated 1-click Unsplash luxury cover presets.
- **🏷️ Product & Inventory Control**:
  - AI Assistant studio drawer, 3D product turntable viewer, stock level badges, and low-stock alerts.

### 5. 💳 Razorpay & Indian Currency (₹ INR)
- **Unified Indian Currency (`₹`)**: Consistent formatting across all user touchpoints.
- **Razorpay Checkout**: Seamless UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and COD.
- **Webhook & Signature Verification**: SHA-256 HMAC cryptographic signature validation.

### 6. 🚚 Courier Tracking & Pincode Resolution
- **Indian Pincode API**: Auto-populates City, District, and State upon 6-digit pincode entry.
- **Multi-Courier Integration**: Delhivery, BlueDart, DTDC, Shadowfax, Ekart, and FedEx.
- **Interactive Tracking**: Visual 4-stage timeline (`PLACED` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`).

### 7. 📄 Automated PDF Tax Invoices
- Built using **jsPDF** and **jsPDF-AutoTable**.
- Itemized product breakdown, GST calculations, shipping fee, courier AWB, and printable PDF invoice download.

---

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework**: React 18 (Vite 7)
- **Routing**: React Router 7
- **Styling**: Tailwind CSS + Custom Dark/Light Glassmorphism Theme System
- **3D Graphics**: Three.js / Canvas 3D Viewer
- **Visual Analytics**: Recharts (Area, Bar, Pie Charts)
- **PDF Generation**: jsPDF, jsPDF-AutoTable
- **UI Alerts**: SweetAlert2, React Hot Toast

### Backend Architecture
- **Language & Runtime**: Java 17 LTS
- **Framework**: Spring Boot 3.2.5
- **Security**: Spring Security 6, Stateless JWT (JJWT 0.11.5), BCrypt
- **ORM & Data**: Spring Data JPA, Hibernate Core
- **Database**: Aiven Cloud MySQL 8.0 (SSL required)
- **Payments**: Razorpay Java SDK 1.4.3
- **Mailing**: Spring Mail (Gmail SMTP TLS)
- **Build Tool**: Apache Maven 3.9+

---

## 🌐 REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register customer account | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | Public |
| `GET` | `/api/users/profile` | Fetch authenticated profile details | User / Admin |

### 🛍️ Products & Categories
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieve active catalog products | Public |
| `GET` | `/api/products/{id}` | Get product details by ID | Public |
| `GET` | `/api/categories` | Retrieve all categories | Public |
| `POST` | `/api/admin/products` | Create new catalog item | Admin |
| `PUT` | `/api/admin/products/{id}` | Update product specifications | Admin |
| `DELETE`| `/api/admin/products/{id}` | Delete product | Admin |
| `POST` | `/api/admin/categories` | Create new department | Admin |
| `PUT` | `/api/admin/categories/{id}` | Update category metadata | Admin |
| `DELETE`| `/api/admin/categories/{id}` | Delete category | Admin |

### 🛒 Shopping Cart (`/api/cart`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart?email={email}` | Fetch user cart items | User |
| `POST` | `/api/cart/add/{productId}?email={email}` | Add item to cart | User |
| `PUT` | `/api/cart/update/{productId}` | Update item quantity | User |
| `DELETE`| `/api/cart/remove/{productId}` | Remove item from cart | User |
| `DELETE`| `/api/cart/clear` | Clear shopping cart | User |

### 📦 Orders & Logistics
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Place order (COD or Pre-paid) | User |
| `GET` | `/api/orders/user/{email}` | Customer order history | User |
| `GET` | `/api/orders/track/{query}` | Track by Order ID or Courier AWB | Public |
| `POST` | `/api/orders/{id}/cancel` | Cancel order & restore inventory | User / Admin |
| `GET` | `/api/admin/orders` | View all customer orders | Admin |
| `PUT` | `/api/admin/orders/{id}/shipping` | Assign courier & AWB tracking number | Admin |
| `PUT` | `/api/admin/orders/{id}/status` | Update order/refund status | Admin |

### 💳 Payments (`/api/payment`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payment/create-order` | Generate Razorpay order ID | User |
| `POST` | `/api/payment/verify` | Verify cryptographic payment signature | User |

---

## ⚙️ Local Installation & Setup

### Prerequisites
- **Java JDK 17+**
- **Node.js 18+ & npm**
- **MySQL 8.0+** (or Aiven Cloud MySQL URI)
- **Maven 3.8+**

### 1. Clone the Repository
```bash
git clone https://github.com/Faiz-Khan01/Full-Stack-eCommerce-Catalog.git
cd Full-Stack-eCommerce-Catalog
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the backend root:
```properties
PORT=8082
FRONTEND_URL=http://localhost:5173

# Database (Local or Aiven Cloud)
DB_URL=jdbc:mysql://localhost:3306/product_catalog?createDatabaseIfNotExist=true&useSSL=false
DB_USERNAME=root
DB_PASSWORD=your_password

# JWT & Security
JWT_SECRET=your_32_char_secret_key_here_12345
JWT_EXPIRATION_MS=86400000
ADMIN_EMAIL=admin@example.com

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Mail
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

### 3. Run Backend
```bash
cd product_catalog-backend
mvn clean spring-boot:run
```
*Backend runs on:* `http://localhost:8082`

### 4. Run Frontend
```bash
cd ../product_catalog-frontend
npm install
npm run dev
```
*Frontend runs on:* `http://localhost:5173`

---

## 🐳 Docker Deployment

To launch the complete application stack (Backend, Frontend, and MySQL) in Docker containers:

```bash
docker-compose up --build -d
```

| Container | Service | Port Mapping |
| :--- | :--- | :--- |
| `ecom_backend` | Spring Boot 3 API | `8082:8082` |
| `ecom_frontend` | React SPA (Nginx) | `5173:80` |
| `ecom_mysql` | MySQL 8.0 Database | `3306:3306` |

---

## 👨‍💻 Author & Connect

<div align="center">

### **Faiz Khan**
*Full Stack Software Engineer • Java & Spring Boot Developer*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-faiz--khan-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/faiz-khan-743ba62a8)
[![GitHub](https://img.shields.io/badge/GitHub-Faiz--Khan01-181717?style=for-the-badge&logo=github)](https://github.com/Faiz-Khan01)
[![Email](https://img.shields.io/badge/Email-faizkhan966563@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:faizkhan966563@gmail.com)

⭐ **If you find this project helpful or inspiring, please give this repository a star!** ⭐

</div>
