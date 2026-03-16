# 🎥 VideoMeet SaaS

A premium, high-performance Video Calling SaaS platform built for speed, security, and simplicity. Built with **React**, **Node.js**, **MongoDB**, and powered by **GetStream.io** for industry-leading video quality.

---

## 🚀 Key Features

### **✨ Seamless Video Experience**
-   **HD Video & Audio**: Crystal-clear communication powered by Stream SDK.
-   **Instant & Scheduled Meetings**: Start a meeting now or plan ahead with shareable invite links.
-   **Interactive Tools**: Screen sharing, hand-raise, and real-time reactions (👍 ❤️ 😂 😮 👏 🎉).
-   **Dynamic Layouts**: Speaker view and Paginated Grid layouts for better focus.

### **🛡️ Security & Authentication**
-   **E2E Encrypted**: Private and secure p2p communication.
-   **JWT Protected**: Industry-standard token-based authentication.
-   **Secure Storage**: Encrypted user credentials and MongoDB Atlas persistence.

### **💳 Subscription & Payments (Monetization)**
-   **Tiered Plans**: Enforced participant limits and meeting durations.
    -   **Free**: 5 Participants | 20 Min Limit
    -   **Aarambh**: 10 Participants | 60 Min Limit
    -   **Samraat**: 200 Participants | Unlimited Duration
-   **Cashfree Integration**: Seamless localized payment gateway integration with dynamic Sandbox/Production modes.

### **🎨 Premium UI/UX**
-   **Modern Aesthetics**: HSL-tailored color palettes, glassmorphism, and smooth Framer Motion animations.
-   **Micro-interactions**: Pulsing mute indicators and responsive control bars.
-   **Dark/Light Mode**: Fully responsive theme switching.

---

## 🛠️ Technology Stack

### **Frontend**
-   **Framework**: [React.js](https://reactjs.org/) (Vite)
-   **Styling**: Vanilla CSS + [Lucide React](https://lucide.dev/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Video Engine**: [Stream Video React SDK](https://getstream.io/video/docs/react/)
-   **Routing**: React Router v7

### **Backend**
-   **Runtime**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
-   **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) (Mongoose ODM)
-   **Auth**: JSON Web Tokens (JWT) & BcryptJS
-   **Payments**: [Cashfree SDK](https://www.cashfree.com/)
-   **Monitoring**: Site24x7 APM Insight

---

## ⚙️ Installation & Setup

### **1. Prerequisites**
-   Node.js (v18+)
-   Docker (Optional, for containerized run)
-   Stream.io API Keys
-   Cashfree API Keys

### **2. Environment Configuration**

#### **Backend (`video-call-saas/backend/.env`)**
```env
PORT=8000
MONGO_URI=mongodb+srv://your_atlas_uri
JWT_SECRET=your_secret_key
STREAM_API_KEY=your_stream_key
STREAM_SECRET=your_stream_secret
CASHFREE_APP_ID=your_id
CASHFREE_SECRET_KEY=your_secret
CASHFREE_ENV=SANDBOX // or PRODUCTION
FRONTEND_URL=https://your-frontend.vercel.app
BACKEND_URL=https://your-backend.onrender.com
```

#### **Frontend (`video-call-saas/video-client/.env`)**
```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

### **3. Running Locally**

**Backend:**
```bash
cd video-call-saas/backend
npm install
npm run dev
```

**Frontend:**
```bash
cd video-call-saas/video-client
npm install
npm run dev
```

---

## 🚢 Deployment

-   **Backend**: Best hosted on **Render** (Root Directory: `video-call-saas/backend`).
-   **Frontend**: Best hosted on **Vercel** (Root Directory: `video-call-saas/video-client`).
-   **Database**: Managed **MongoDB Atlas** shared cluster.

---

## 🛡️ License

This project is licensed under the **ISC License**.
