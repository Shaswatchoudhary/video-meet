# 🎥 Video Meet SaaS

A powerful, high-performance Video Calling SaaS platform built with **Node.js**, **Express**, and **MongoDB**. Designed for scalability, this project features robust user authentication, subscription management, and is fully containerized with **Docker** for seamless deployment.

---

## 🚀 Overview

This repository contains the backend infrastructure for the Video Meet platform. It handles user lifecycle management, meeting room persistence, and integrates with professional monitoring tools like **Site24x7 APM Insight**.

## 📊 Progress Dashboard

Here is the current status of the project development:

### **Backend Core**
- [x] **Project Scaffolding**: Modular architecture (MVC-ish pattern).
- [x] **Database Integration**: MongoDB connection via Mongoose.
- [x] **API Security**: Helmet for security headers and CORS configuration.
- [x] **Env Configuration**: Dotenv for environment variable management.

### **Authentication & User Management**
- [x] **User Schema**: Secure password hashing with `bcryptjs`.
- [x] **Registration & Login**: Fully functional Auth routes.
- [x] **JWT Security**: Token-based authentication for protected routes.
- [x] **Subscription Model**: In-built status checking for `active` vs `inactive`.

### **Meeting & Communication**
- [x] **Meeting Schema**: Host-based persisted meeting rooms.
- [ ] **Real-time Logic**: Socket.io / WebRTC signaling (Pending).
- [ ] **Meeting Controls**: Mute/Unmute, Camera toggle logic (Pending).

### **Subscription & Payments**
- [x] **Subscription Middleware**: Guarding premium features.
- [ ] **Stripe/Payment Integration**: External payment gateway (Pending).

### **DevOps & Monitoring**
- [x] **Dockerization**: Optimized multi-stage Dockerfile and Docker Compose.
- [x] **APM Monitoring**: Site24x7 APM Insight agent integrated.
- [ ] **CI/CD Pipeline**: GitHub Actions (Pending).

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Language** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB / Mongoose |
| **Security** | Helmet, BcryptJS, JWT |
| **DevOps** | Docker, Docker Compose |
| **Monitoring** | Site24x7 APM Insight |

---

## ⚙️ Installation & Setup

### **Prerequisites**
- Docker & Docker Compose installed on your system.
- An `.env` file in the `backend` directory (see configuration below).

### **Configuration**
Create a `.env` file in `backend/` with the following:
```env
PORT=8000
MONGO_URI=mongodb://mongo:27017/videomeet
JWT_SECRET=your_secret_here
APMINSIGHT_LICENSE_KEY=your_license_key
```

### **Running Locally**

1. Clone the repository:
   ```bash
   git clone https://github.com/Shaswatchoudhary/video-meet.git
   cd video-meet/video-call-saas/backend
   ```

2. Start the services using Docker Compose:
   ```bash
   docker-compose up --build -d
   ```

3. Access the API at:
   `http://localhost:8000`

---

## 📈 Current Project Stats

- **Back-end Completion**: ~70%
- **Database Schema**: 100%
- **Infrastructure**: 100%
- **Front-end Completion**: 0% (Starting soon)

---

## 🛡️ License

This project is licensed under the **ISC License**.
