

# 🎥 VideoMeet SaaS

<p align="center">
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"></a>
  <a href="https://getstream.io/video/"><img src="https://img.shields.io/badge/Stream_SDK-005FFF?style=for-the-badge&logo=stream&logoColor=white" alt="Stream"></a>
</p>

VideoMeet is a premium, high-performance Video Calling SaaS platform engineered for low latency, ultimate security, and a stunning user experience. Built with a modern tech stack and powered by **GetStream.io**, it offers industrial-grade video quality and reliability.

---

## ✨ Key Features

### **🚀 Seamless Video Experience**
-   **Ultra-HD Video & Audio**: Crystal-clear communication optimized for low bandwidth.
-   **Instant & Scheduled Meetings**: Start a meeting in one click or plan ahead with persistent invite links.
-   **Interactive Collaboration**: Real-time screen sharing, hand-raise functionality, and expressive emoji reactions.
-   **Intelligent Layouts**: Toggle between Speaker Focus and Paginated Grid layouts seamlessly.

### **🛡️ Enterprise-Grade Security**
-   **End-to-End Encryption**: Secure, private p2p communication paths for every call.
-   **JWT-Based Auth**: Robust token-based authentication system.
-   **Bcrypt Hashing**: Encrypted user credentials stored securely in MongoDB Atlas.

### **💳 Monetization & Subscriptions**
-   **Tiered Access Control**: Dynamic participant limits and meeting durations based on user plans.
    -   **Free**: 5 Participants | 20 Min Limit
    -   **Aarambh**: 10 Participants | 60 Min Limit
    -   **Samraat**: 200 Participants | Unlimited Duration
-   **Seamless Payments**: Integrated with **Cashfree SDK** for secure, localized global payments.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | [React.js](https://reactjs.org/) (Vite), [Framer Motion](https://www.framer.com/motion/) |
| **Styling** | Vanilla CSS, [Lucide Icons](https://lucide.dev/) |
| **Video Engine** | [Stream Video SDK](https://getstream.io/video/docs/react/) |
| **Backend** | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) (Mongoose ODM) |
| **Auth** | JSON Web Tokens (JWT) |
| **Payments** | [Cashfree SDK](https://www.cashfree.com/) |
| **Monitoring** | Site24x7 APM Insight |

---

## ⚙️ Quick Start

### **1. Prerequisites**
-   **Node.js** (v18+)
-   **Stream.io** API Credentials
-   **Cashfree** API Credentials
-   **MongoDB Atlas** URI

### **2. Environment Setup**

#### **Backend (`backend/.env`)**
```env
PORT=8000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
STREAM_API_KEY=your_stream_key
STREAM_SECRET=your_stream_secret
CASHFREE_APP_ID=your_cashfree_id
CASHFREE_SECRET_KEY=your_cashfree_secret
CASHFREE_ENV=SANDBOX // or PRODUCTION
```

#### **Frontend (`video-client/.env`)**
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### **3. Running Locally**

```bash
# Terminal 1: Backend
cd backend && npm install && npm run dev

# Terminal 2: Frontend
cd video-call-saas/video-client && npm install && npm run dev
```

---

## 🏗️ Architecture Overview

The system follows a modern decoupled architecture:
-   **Client Side**: High-performance React SPA with global state management via Context API.
-   **Server Side**: Distributed Express.js API acting as a secure gateway for Auth, Payments, and Stream Session orchestration.
-   **Real-time Layer**: Stream's edge network for global low-latency video distribution.

---

## 🛡️ License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by the VideoMeet Team
</p>
