# 🚀 Muhammad Qaissum Shahaab — MERN Stack Developer Portfolio

A production-ready, full-stack developer portfolio built with the MERN stack. Features a vibrant dark UI, smooth animations, a fully validated contact form backed by Express, and one-click Vercel deployment.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🎨 **Vibrant Dark UI**
| 📱 **Fully Responsive** | Mobile-first, tested across all breakpoints |
| 🎞️ **Scroll Animations** | IntersectionObserver-powered section reveals |
| 📊 **Skills Progress Bars** | Animated bars triggered on scroll |
| 🃏 **Project Cards** | Hover glow, gradient top-border, tech tags |
| 📬 **Contact Form** | Frontend + backend validation, email notification |
| ⚡ **Express Backend** | Rate-limited, secured with Helmet, CORS-configured |
| 🔒 **Form Security** | Rate limiting (10 req/15min), input sanitization |
| 🚀 **Vercel Ready** | Serverless functions + static React build |
| 🔝 **Scroll-to-Top** | Smooth scroll button appears after 400px |
| 📧 **Auto-Reply Email** | Sender gets a confirmation email automatically |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** — Functional components, hooks
- **Bootstrap 5** — Grid, utility classes
- **CSS Modules** — Scoped component styling


### Backend
- **Node.js** — Runtime
- **Express** — Web framework
- **Nodemailer** — Email sending
- **express-validator** — Input validation
- **Helmet** — HTTP security headers
- **express-rate-limit** — DDoS protection
- **Morgan** — Request logging
- **dotenv** — Environment variable management

### Deployment
- **Vercel** — Frontend (static) + Serverless API functions

---

## 📁 Project Structure

```
portfolio/
├── api/                         # Vercel Serverless Functions
│   └── contact.js               # POST /api/contact (serverless)
│
├── client/                      # React Frontend
│   ├── public/
│   │   └── index.html           # SEO meta tags, Bootstrap CDN
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx        # Fixed navbar with scroll detection
│       │   ├── Hero.jsx          # Full-viewport landing section
│       │   ├── About.jsx         # Bio + cards
│       │   ├── Skills.jsx        # Animated progress bars
│       │   ├── Projects.jsx      # Project cards grid
│       │   ├── Contact.jsx       # Validated form + API call
│       │   ├── Footer.jsx        # Social links + quick nav
│       │   └── SectionWrapper.jsx # Reusable scroll animation HOC
│       ├── styles/
│       │   ├── portfolio.module.css # Main design system CSS Module
│       │   └── global.css           # Global resets
│       ├── App.jsx               # Root component
│       └── index.js              # React entry point
│
├── server/                      # Express Backend (local dev)
│   ├── controllers/
│   │   └── contactController.js # Business logic + email
│   ├── middleware/
│   │   └── errorHandler.js      # Global error handler
│   ├── routes/
│   │   └── contact.js           # Route definitions + validation
│   ├── .env            # Environment variable template
│   ├── package.json
│   └── server.js                # Express app entry point
│
├── .gitignore
├── package.json                 # Root scripts (concurrently)
├── vercel.json                  # Vercel deployment config
└── README.md
```

