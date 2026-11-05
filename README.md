# 🌍 Travel Hub — Full-Stack Travel Booking Platform

> A production-ready, full-stack travel booking platform built with Next.js 16, Node.js, Express, MongoDB, and SSLCommerz payment integration. Features role-based dashboards (User / Guide / Admin / Super Admin), real-time seat reservation, and Cloudinary image management.

## 📸 Screenshots
![Travel Hub Banner](https://res.cloudinary.com/dpgjlcycl/image/upload/v1793897772/Travel1_b0t6qd.png)
### Super Admin Dashboard
![Super Admin Dashboard](https://res.cloudinary.com/dpgjlcycl/image/upload/v1793897768/travel4_v860cd.png)
### Booking Flow
![Booking Flow](https://res.cloudinary.com/dpgjlcycl/image/upload/v1793900313/travel6_t3ve4j.png)
### Super Admin Dashboard
![Super Admin Dashboard](https://res.cloudinary.com/dpgjlcycl/image/upload/v1793897768/travel4_v860cd.png)
### Tour Listing
![Tour Listing](https://res.cloudinary.com/dpgjlcycl/image/upload/v1793897764/travel5_aqueir.png)

---

## 🔗 Live Demo

- **Frontend:** [https://travel-hub-kohl-eight.vercel.app/](https://travel-hub-kohl-eight.vercel.app/)
- **Backend API:** [https://travelhub-backend-xcjz.onrender.com](https://travelhub-backend-xcjz.onrender.com)

**Test Credentials:**
| Role | Email | Password |
|---|---|---|
| Super Admin | super-admin@gmail.com | `Pa$$w0rd!` |
| Admin | admin@gmail.com | `Pa$$w0rd!` |
| User | user@gmail.com | `Pa$$w0rd!` |

---

## ✨ Features

### 👤 User Features

- 🔐 Secure authentication (JWT + Google OAuth)
- 🔍 Browse tours with advanced filters (category, price, rating, search)
- 📅 View tour details with itinerary, departures, amenities
- 🎫 Book tours with dynamic traveler forms (adults/children)
- 💳 Pay securely via SSLCommerz (sandbox + production)
- 📄 Download PDF invoices automatically sent via email
- 📊 Track bookings (pending, confirmed, completed, cancelled)
- ❌ Cancel bookings with automatic seat release
- 👤 Manage profile + upload profile picture (Cloudinary)
- 🔑 Change password with session invalidation

### 🛡️ Admin Features

- 📊 Real-time dashboard with revenue, bookings, users, tours stats
- 🗺️ Full Tour CRUD (create/edit/delete with image upload, dynamic itinerary)
- 📅 Tour Departure management (dates, seats, pricing, status)
- 🌍 Division & Destination management with thumbnails
- 🎫 Booking management (confirm, complete, cancel with reasons)
- 👥 User management (role change, block/unblock, soft/hard delete)
- 📈 Recent bookings and new users activity feed

### 👑 Super Admin Features

- 🎨 Premium dashboard with role distribution
- 🛡️ Admin team management (promote, demote, block, delete)
- 📊 Platform-wide analytics (revenue this-month, growth trends)
- ⚡ Quick action cards for all management areas
- 🔒 Exclusive access to admin management endpoints

### ⚙️ System Features

- 🚦 Role-based access control (USER / GUIDE / ADMIN / SUPER_ADMIN)
- 🔄 Atomic seat reservation (prevents overbooking)
- 📝 Soft delete with restore + hard delete with booking guards
- ⏱️ Auto-expire unpaid reservations (15-min cron)
- 🎯 Custom 404, Error, and Loading skeletons
- 📱 Fully responsive UI (mobile → desktop)
- 🌐 SEO-friendly with server-side rendering

---

## 🛠️ Tech Stack

### Frontend

| Technology                  | Purpose                          |
| --------------------------- | -------------------------------- |
| **Next.js 16** (App Router) | React framework with SSR         |
| **TypeScript**              | Type safety                      |
| **Tailwind CSS v4**         | Utility-first styling            |
| **shadcn/ui**               | Pre-built accessible components  |
| **Lucide React**            | Icon library                     |
| **Sonner**                  | Toast notifications              |
| **jose**                    | Edge-compatible JWT verification |
| **Zod**                     | Form validation                  |

### Backend

| Technology              | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| **Node.js + Express**   | REST API server                          |
| **TypeScript**          | Type safety                              |
| **MongoDB + Mongoose**  | NoSQL database & ODM                     |
| **JWT**                 | Authentication (access + refresh tokens) |
| **Passport.js**         | Google OAuth strategy                    |
| **Zod**                 | Request validation                       |
| **Multer + Cloudinary** | Image upload & storage                   |
| **Nodemailer**          | Email notifications                      |
| **PDFKit**              | Invoice generation                       |
| **SSLCommerz**          | Payment gateway                          |

### DevOps & Deployment

| Technology        | Purpose          |
| ----------------- | ---------------- |
| **Vercel**        | Frontend hosting |
| **Render**        | Backend hosting  |
| **MongoDB Atlas** | Cloud database   |
| **Cloudinary**    | CDN for images   |

---

## 🏗️ Architecture

### Folder Structure — Frontend

frontend/
├── src/
│ ├── app/ # Next.js App Router
│ │ ├── (commonLayout)/ # Public routes
│ │ │ ├── (auth)/ # Login, Register
│ │ │ ├── tours/ # Tour listing + detail + booking
│ │ │ ├── payment/ # Success, Fail, Cancel pages
│ │ │ └── page.tsx # Home
│ │ ├── (dashboardLayout)/ # Protected routes
│ │ │ ├── (commonProtectedLayout)/ # Profile, Change Password
│ │ │ ├── (userDashboardLayout)/ # User dashboard
│ │ │ ├── admin/ # Admin dashboards
│ │ │ └── super-admin/ # Super Admin dashboard
│ │ ├── not-found.tsx # 404 page
│ │ └── error.tsx # Error boundary
│ ├── components/
│ │ ├── modules/ # Feature-based components
│ │ ├── shared/ # Reusable (Modals, Skeletons)
│ │ └── ui/ # shadcn components
│ ├── services/ # Server actions (API calls)
│ ├── types/ # TypeScript interfaces
│ ├── lib/ # Utilities, providers, proxy
│ └── proxy.ts # Route middleware (Next.js 16)

### Folder Structure — Backend

backend/
├── src/
│ ├── app/
│ │ ├── modules/
│ │ │ ├── auth/ # Login, OAuth, password reset
│ │ │ ├── user/ # User CRUD, soft/hard delete
│ │ │ ├── tour/ # Tour + TourType
│ │ │ ├── tour-departure/ # Departure management
│ │ │ ├── booking/ # Booking + seat logic
│ │ │ ├── payment/ # SSLCommerz integration
│ │ │ ├── division/ # Division management
│ │ │ ├── destination/ # Destination management
│ │ │ └── admin/ # Admin stats endpoints
│ │ ├── middlewares/ # Auth, validation, errors
│ │ ├── config/ # Env, DB, Cloudinary, Multer
│ │ └── router/ # Central route registry
│ └── server.ts # Server entry point

---

## 🔐 Security Features

- ✅ **JWT tokens** (access + refresh with rotation)
- ✅ **httpOnly cookies** for token storage
- ✅ **Password hashing** with bcrypt (10 rounds)
- ✅ **Role-based access control** at route + API level
- ✅ **Zod validation** on all inputs (client + server)
- ✅ **CORS with credentials** whitelist
- ✅ **Rate limiting** on auth endpoints
- ✅ **Soft delete** prevents foreign key corruption
- ✅ **Atomic seat reservation** prevents overbooking
- ✅ **Session invalidation** on password change
- ✅ **Open redirect protection** on OAuth callback

---

## 💡 Key Technical Decisions

## 1. Atomic Seat Reservation (Preventing Overbooking)
Problem: Two users booking the last seat at the same time would both read "1 seat left" and both succeed — classic race condition.
Decision: Seat decrement uses a conditional $inc inside a MongoDB transaction:

findOneAndUpdate(
  { _id: departureId, availableSeats: { $gte: requestedSeats } },
  { $inc: { availableSeats: -requestedSeats } },
  { new: true }
)
The $gte guard makes the decrement conditional. If the condition fails, no seat is taken and the transaction aborts.

Result: Overbooking is impossible under concurrent load, without application-level locks.

## 4. Payment Verification via Webhook (Never Trust the Client)
Problem: A client can fake a "payment success" redirect. Trusting it would confirm unpaid bookings.

Decision: The booking is confirmed only after the backend receives SSLCommerz's IPN/webhook, validates the transaction against SSLCommerz's validation API, and matches the amount and booking ID server-side.

Result: A user cannot obtain a confirmed booking without a real, verified payment. The flow is: User → SSLCommerz → Backend webhook → Verify → CONFIRMED → Invoice email.
---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB Atlas account
- Cloudinary account
- SSLCommerz sandbox account
- Google OAuth credentials (optional)

### 1. Clone the repository

```bash
git clone https://github.com/Mdnajimuddinhelal70/TravelHub.git
cd TravelHub

cd backend
npm install
# Create .env
cp .env.example .env
# Add your credentials
npm run dev
cd frontend
npm install
# Create .env
cp .env.example .env
# Add NEXT_PUBLIC_BASE_API_URL and JWT_ACCESS_SECRET
npm run dev


Backend (.env)
NODE_ENV=development
PORT=5000
DB_URL=mongodb+srv://...
FRONTEND_URL=http://localhost:3000

# JWT
JWT_ACCESS_SECRET=...
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=...
JWT_REFRESH_EXPIRES=30d
JWT_RESET_PASSWORD_SECRET=...
JWT_RESET_PASSWORD_EXPIRES=10m
BCRYPT_SALT_ROUND=10
EXPRESS_SESSION_SECRET=...

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Email
EMAIL_SENDER_EMAIL=...
EMAIL_SENDER_APP_PASS=...
EMAIL_SENDER_SERVICE=gmail

# SSLCommerz
SSL_STORE_ID=...
SSL_STORE_PASS=...
SSL_PAYMENT_API=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
SSL_VALIDATION_API=https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php
SSL_IPN_URL=http://localhost:5000/api/v1/payment/validate-payment
SSL_SUCCESS_BACKEND_URL=http://localhost:5000/api/v1/payment/success
SSL_FAIL_BACKEND_URL=http://localhost:5000/api/v1/payment/fail
SSL_CANCEL_BACKEND_URL=http://localhost:5000/api/v1/payment/cancel
SSL_SUCCESS_FRONTEND_URL=http://localhost:3000/payment/success
SSL_FAIL_FRONTEND_URL=http://localhost:3000/payment/fail
SSL_CANCEL_FRONTEND_URL=http://localhost:3000/payment/cancel


Frontend (.env)
NEXT_PUBLIC_BASE_API_URL=http://localhost:5000/api/v1
JWT_ACCESS_SECRET=...   # Must match backend

***Tested payment cards (SSLCommerz sandbox):
VISA: 4111111111111111, Expiry: 12/25, CVV: 111,


📊 Project Stats
Total files: 200+
Lines of code: 15,000+
Modules: 10 backend modules + 8 frontend features
API endpoints: 50+
Roles: 4 (User, Guide, Admin, Super Admin)
Build time: ~76s (frontend), ~4s (backend)
```

🎯 What I Learned
Building Travel Hub taught me:
State management — React Server Components vs client components
Atomicity in DB — MongoDB transactions + $inc for seat reservation
Payment integration — Never trust client; always verify via webhook
Role-based routing — Edge middleware with role-based access in Next.js 16
Soft delete patterns — Preserving foreign key integrity
Cloudinary + Multer — Buffer uploads vs multipart forms
TypeScript strict mode — Catching real bugs at compile time
Production deployment — Render + Vercel + environment mismatches

📞 Contact
Md Najim Uddin Helal

📧 Email: najimuddin77288@gmail.com
💼 LinkedIn: https://www.linkedin.com/in/najim-uddin-7994a1363/
🐙 GitHub: github.com/Mdnajimuddinhelal70
🌐 Portfolio: [https://travel-hub-kohl-eight.vercel.app](https://travel-hub-kohl-eight.vercel.app/)

📜 License
This project is licensed under the MIT License — feel free to use it as a learning reference.

🙏 Acknowledgments
SSLCommerz for payment gateway sandbox
Cloudinary for image hosting
shadcn for beautiful UI components
Vercel + Render for free deployment tiers

<div align="center">
⭐ If you found this project useful, please give it a star! ⭐

Made with ❤️ by Md Najim Uddin Helal

</div> ```
