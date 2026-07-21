# 🛒 Full-Stack eCommerce Catalog

A modern **Full-Stack eCommerce Catalog** application built with **React.js, Spring Boot, and MySQL** that delivers a seamless online shopping experience. The platform enables users to browse products, manage their shopping cart, securely authenticate, and complete online purchases using **Razorpay Payment Gateway**.

Designed with a production-ready architecture, the application integrates a responsive React frontend with a scalable Spring Boot backend using secure REST APIs, JWT authentication, and persistent MySQL storage.

---

# 🚀 Features

* 🛍️ Browse products with category-based filtering and search
* 🛒 Persistent shopping cart for each authenticated user
* 🔐 Secure JWT Authentication & Authorization
* 🔑 Google OAuth 2.0 Sign-In
* 💳 Razorpay Payment Gateway Integration
* 📦 Order placement and order history
* 👤 User profile management
* 📱 Responsive UI for desktop and mobile devices
* ⚡ RESTful API architecture
* 🔒 Role-based access control (Admin/User)

---

# 🛠️ Tech Stack

## Frontend

* React.js
* JavaScript
* Axios
* Tailwind CSS
* HTML5
* CSS3

## Backend

* Java
* Spring Boot
* Spring Security
* Spring MVC
* Hibernate / JPA
* RESTful APIs
* Maven

## Database

* MySQL

## Authentication

* JWT Authentication
* Google OAuth 2.0
* Role-Based Authorization

## Payment

* Razorpay Payment Gateway
* Payment Verification
* Secure Checkout

## Tools

* Git & GitHub
* Postman
* IntelliJ IDEA
* VS Code

---

# 🏗️ System Architecture

```text
React.js Frontend
        │
        ▼
REST API Communication
        │
        ▼
Spring Boot Backend
        │
        ▼
MySQL Database
```

### Authentication Flow

```text
User Login
      │
JWT Authentication / Google OAuth
      │
Security Validation
      │
Protected APIs
```

### Payment Flow

```text
Customer Checkout
        │
Create Razorpay Order
        │
Complete Payment
        │
Backend Payment Verification
        │
Order Confirmation
```

---

# 📚 Modules

## 🛍️ Product Catalog

* View all products
* Product details
* Category filtering
* Product search

---

## 🛒 Cart Management

* Add products
* Remove products
* Update quantity
* Persistent user cart
* Database-backed cart storage

---

## 👤 User Module

* Registration
* Login
* Google Sign-In
* Profile Management
* Order History

---

## 📦 Order Module

* Place Orders
* View Order History
* Order Status Tracking
* Purchase Summary

---

## 💳 Payment Module

* Razorpay Payment Gateway
* Secure Checkout
* UPI Payments
* Card Payments
* Net Banking
* Wallet Payments
* Backend Payment Verification
* Failed Payment Handling
* Automatic Order Confirmation

---

## 🔐 Security

* JWT Authentication
* Google OAuth 2.0
* Role-Based Authorization
* Protected REST APIs
* Secure Password Encryption
* Spring Security

---

# 🌐 REST APIs

The backend exposes REST APIs for:

* Authentication
* User Management
* Product Management
* Cart Management
* Order Processing
* Payment Processing

Example Endpoints:

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| POST   | `/auth/register`        | Register User         |
| POST   | `/auth/login`           | User Login            |
| GET    | `/products`             | Get Products          |
| GET    | `/products/{id}`        | Product Details       |
| POST   | `/cart/add`             | Add to Cart           |
| POST   | `/orders`               | Place Order           |
| POST   | `/payment/create-order` | Create Razorpay Order |
| POST   | `/payment/verify`       | Verify Payment        |

---

# 📈 Project Highlights

* ✅ Complete Full-Stack eCommerce Application
* ✅ Spring Boot REST API Development
* ✅ React.js Responsive Frontend
* ✅ JWT Authentication
* ✅ Google OAuth 2.0 Login
* ✅ Razorpay Payment Gateway Integration
* ✅ Persistent Database Cart
* ✅ Secure Order Processing
* ✅ Role-Based Authorization
* ✅ MVC Architecture
* ✅ Production-Ready Backend
* ✅ Deployment Configuration with CORS Support

---

# 📂 Project Structure

```text
TechStore
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   ├── security
│   └── config
│
├── frontend
│   ├── components
│   ├── pages
│   ├── services
│   ├── assets
│   └── hooks
│
└── README.md
```

---

# ⚙️ Installation

## Prerequisites

* Java 17+
* Node.js
* MySQL
* Maven

### Clone Repository

```bash
git clone https://github.com/Faiz-Khan01/TechStore.git
```

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

# 🔮 Future Enhancements

* Wishlist
* Product Reviews & Ratings
* Coupon & Discount System
* Inventory Management
* Email Notifications
* Admin Dashboard Analytics
* Docker Support
* AWS Deployment
* CI/CD Pipeline

---

# 👨‍💻 Author

**Faiz Khan**

Java Backend Developer | Full-Stack Developer

---

# 🤝 Contributing

Contributions, suggestions, and feedback are always welcome.

If you found this project useful, please consider giving it a ⭐ on GitHub.
