# 🛒 TechStore — Full-Stack eCommerce Catalog

A modern **Full-Stack eCommerce Catalog application** built with **React.js, Spring Boot, and MySQL** that delivers a seamless online shopping experience.

The platform allows users to browse products, manage shopping carts, authenticate securely, and complete purchases using the **Razorpay Payment Gateway**.

Designed with a production-ready architecture, TechStore combines a responsive React frontend with a scalable Spring Boot backend using secure REST APIs, JWT authentication, Google OAuth 2.0, role-based authorization, and persistent MySQL storage.

---

# 🚀 Features

## 🛍️ Product Catalog

* Browse products with category-based filtering
* Product search functionality
* Product details view
* Responsive product listing

## 🛒 Shopping Cart

* Add products to cart
* Update product quantity
* Remove products
* Persistent user cart storage
* Database-backed cart management

## 🔐 Authentication & Security

* JWT Authentication
* Google OAuth 2.0 Sign-In
* Secure password encryption
* Role-based access control
* Protected REST APIs

## 💳 Payment & Orders

* Razorpay Payment Gateway integration
* Secure checkout flow
* UPI payments
* Card payments
* Net banking
* Wallet payments
* Payment verification
* Automatic order confirmation

## 👤 User Management

* User registration
* User login
* Google Sign-In
* Profile management
* Order history

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

* Java 17
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
* Docker

---

# 🏗️ System Architecture

```
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

---

# 🔐 Authentication Flow

```
User Login
      │
      ▼
JWT Authentication / Google OAuth
      │
      ▼
Security Validation
      │
      ▼
Protected APIs
```

---

# 💳 Payment Flow

```
Customer Checkout
        │
        ▼
Create Razorpay Order
        │
        ▼
Complete Payment
        │
        ▼
Backend Payment Verification
        │
        ▼
Order Confirmation
```

---

# 📚 Application Modules

## 🛍️ Product Module

* View products
* Product details
* Category filtering
* Product search

## 🛒 Cart Module

* Add products
* Remove products
* Update quantity
* Persistent cart storage

## 👤 User Module

* Registration
* Login
* Google authentication
* Profile management
* Order history

## 📦 Order Module

* Place orders
* View order history
* Purchase summary
* Order tracking

## 💳 Payment Module

* Razorpay integration
* Secure checkout
* Payment verification
* Failed payment handling
* Automatic order confirmation

---

# 🌐 REST API

The backend provides APIs for:

* Authentication
* User management
* Product management
* Cart management
* Order processing
* Payment processing

Example endpoints:

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| POST   | `/auth/register`        | Register user         |
| POST   | `/auth/login`           | User login            |
| GET    | `/products`             | Get products          |
| GET    | `/products/{id}`        | Product details       |
| POST   | `/cart/add`             | Add to cart           |
| POST   | `/orders`               | Place order           |
| POST   | `/payment/create-order` | Create Razorpay order |
| POST   | `/payment/verify`       | Verify payment        |

---

# 📈 Project Highlights

✅ Complete Full-Stack eCommerce Application
✅ Spring Boot REST API Development
✅ React.js Responsive UI
✅ JWT Authentication
✅ Google OAuth 2.0 Login
✅ Razorpay Payment Integration
✅ Persistent Database Cart
✅ Secure Order Processing
✅ Role-Based Authorization
✅ MVC Architecture
✅ Production-ready Backend
✅ Docker Deployment Support
✅ Render Cloud Deployment Configuration

---

# 📂 Project Structure

```
TechStore
│
├── backend
│   ├── src/main/java
│   │   ├── controller
│   │   ├── service
│   │   ├── repository
│   │   ├── entity
│   │   ├── security
│   │   └── config
│   │
│   ├── Dockerfile
│   └── pom.xml
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

# ⚙️ Installation & Setup

## Prerequisites

Install:

* Java 17+
* Node.js
* MySQL
* Maven
* Docker

---

# Clone Repository

```bash
git clone https://github.com/Faiz-Khan01/TechStore.git

cd TechStore
```

---

# Backend Setup

Navigate to backend:

```bash
cd backend
```

Run application:

```bash
mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8082
```

---

# Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start application:

```bash
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

# 🐳 Docker Deployment

The backend uses a multi-stage Docker build.

## Build Docker Image

```bash
docker build -t techstore-backend .
```

## Run Docker Container

```bash
docker run -p 8082:8082 techstore-backend
```

Application URL:

```
http://localhost:8082
```

---

# ☁️ Render Deployment

## Deploy Backend on Render

1. Push the repository to GitHub.
2. Open Render Dashboard.
3. Create a new **Web Service**.
4. Connect your GitHub repository.
5. Select **Docker** as the environment.
6. Deploy the service.

---

## Render Environment Configuration

Add required environment variables:

```
DATABASE_URL=<mysql_database_url>
DATABASE_USERNAME=<database_username>
DATABASE_PASSWORD=<database_password>

JWT_SECRET=<jwt_secret>

RAZORPAY_KEY_ID=<razorpay_key>
RAZORPAY_SECRET=<razorpay_secret>
```

---

## Spring Boot Render Port Configuration

Configure `application.properties`:

```properties
server.port=${PORT:8082}
```

This allows the application to use Render's assigned port while keeping `8082` as the local default.

---

# 🔮 Future Enhancements

* Wishlist functionality
* Product reviews and ratings
* Coupon and discount system
* Inventory management
* Email notifications
* Admin dashboard analytics
* AWS deployment
* CI/CD pipeline

---

# 👨‍💻 Author

**Faiz Khan**

Java Backend Developer | Full-Stack Developer

---

# 🤝 Contributing

Contributions, suggestions, and feedback are welcome.

If you find this project useful, consider giving it a ⭐ on GitHub.
