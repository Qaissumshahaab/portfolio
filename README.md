# 🚀 Alex Carter — MERN Stack Developer Portfolio

A production-ready, full-stack developer portfolio built with the **MERN** stack (MongoDB optional). Features a vibrant dark UI, smooth animations, a fully validated contact form backed by Express, and one-click Vercel deployment.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🎨 **Vibrant Dark UI** | Electric cyan + hot orange palette, Syne + DM Sans fonts |
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
- **Framer Motion** *(optional)* — Enhanced animations

### Backend
- **Node.js 18+** — Runtime
- **Express 4** — Web framework
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
│   ├── .env.example             # Environment variable template
│   ├── package.json
│   └── server.js                # Express app entry point
│
├── .gitignore
├── package.json                 # Root scripts (concurrently)
├── vercel.json                  # Vercel deployment config
└── README.md
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js `>= 18.0.0`
- npm `>= 9.0.0`

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mern-portfolio.git
cd mern-portfolio
```

### 2. Install All Dependencies

```bash
npm run install:all
```

This installs packages in the root, `/client`, and `/server` directories.

### 3. Configure Environment Variables

```bash
cd server
cp .env.example .env
```

Open `server/.env` and fill in your values:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Email (optional — form still works without this, submissions are logged)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_TO=your_email@gmail.com
```

> **Gmail App Password Setup:**
> Go to Google Account → Security → 2-Step Verification → App Passwords
> Generate a password for "Mail" and paste it as `EMAIL_PASS`.

### 4. Run Development Servers

From the project root:

```bash
npm run dev
```

This starts both servers concurrently:
- **React** → `http://localhost:3000`
- **Express** → `http://localhost:5000`

The React app proxies `/api/*` requests to Express automatically via the `"proxy"` field in `client/package.json`.

### 5. Verify the Backend

```bash
# Health check
curl http://localhost:5000/api/health

# Test contact form
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","subject":"Hello","message":"This is a test message with enough characters."}'
```

---

## 🚀 Deploying to Vercel

### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# From the project root
vercel

# Follow the prompts, then deploy to production:
vercel --prod
```

### Option B: Vercel Dashboard

1. Push your repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Set **Root Directory** to `/` (project root)
5. Set **Build Command** to `cd client && npm install && npm run build`
6. Set **Output Directory** to `client/build`
7. Add Environment Variables (see below)
8. Click Deploy

### Environment Variables on Vercel

In your Vercel project dashboard → Settings → Environment Variables:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_SECURE` | `false` |
| `EMAIL_USER` | `your_email@gmail.com` |
| `EMAIL_PASS` | `your_app_password` |
| `EMAIL_TO` | `your_email@gmail.com` |

> The serverless function in `/api/contact.js` will use these automatically.

---

## 🎨 How to Customize

All personalizable content is clearly marked with `// 🎨 CUSTOMIZE:` comments.

### Personal Info
| File | What to Edit |
|---|---|
| `client/src/components/Hero.jsx` | Name, title, description, stats |
| `client/src/components/About.jsx` | Bio paragraphs, info cards |
| `client/src/components/Contact.jsx` | Email, location info |
| `client/src/components/Footer.jsx` | Social links, tagline |
| `client/public/index.html` | SEO meta tags, site title |

### Projects
Edit the `projectsData` array in `client/src/components/Projects.jsx`:

```js
const projectsData = [
  {
    title:       'Your Project Name',
    description: 'Brief description of what this does.',
    techStack:   ['React', 'Node.js', 'MongoDB'],
    github:      'https://github.com/you/project',
    live:        'https://project.vercel.app',
  },
  // ... more projects
];
```

### Skills
Edit the skill arrays in `client/src/components/Skills.jsx`:

```js
const frontendSkills = [
  { name: 'React.js', icon: '⚛️', pct: 92, hot: false },
  // ...
];
```

### Profile Picture
In `client/src/components/Hero.jsx`, replace the initials placeholder:

```jsx
// Find this block:
<div className={styles['hero-avatar-inner']}>
  {heroData.avatarInitials}   {/* Remove this */}
  {/* Add this: */}
  <img
    src="/your-photo.jpg"
    alt="Your Name"
    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
  />
</div>
```

Place your photo in `client/public/your-photo.jpg`.

### Colors & Theme
Edit CSS custom properties in `client/src/styles/portfolio.module.css`:

```css
:root {
  --electric: #00d4ff;   /* Main accent color */
  --hot:      #ff6b35;   /* Secondary accent */
  --lime:     #b2ff59;   /* Tertiary accent */
  --bg-void:  #0a0a0f;   /* Page background */
}
```

---

## 📬 Contact Form Flow

```
User fills form
      │
      ▼
Frontend Validation (Contact.jsx)
      │ (fail) → show inline errors
      │ (pass) ↓
POST /api/contact
      │
      ▼
Backend Validation (routes/contact.js)
      │ (fail) → 422 + error JSON
      │ (pass) ↓
contactController.js
      ├── Log submission (always)
      ├── Send email to owner (if EMAIL_* vars set)
      └── Send auto-reply to sender (if EMAIL_* vars set)
      │
      ▼
Response: { success: true, message: "..." }
      │
      ▼
Frontend shows success banner, resets form
```

---

## 🧩 Reusable Components

### `SectionWrapper` — Scroll Animation Wrapper

Wrap any section to animate it into view:

```jsx
import SectionWrapper from './SectionWrapper';

// Basic usage
<SectionWrapper>
  <MySection />
</SectionWrapper>

// With stagger delay (milliseconds)
<SectionWrapper delay={200}>
  <MySection />
</SectionWrapper>
```

Under the hood it uses `IntersectionObserver` — no external library needed.

---

## 🔒 Security Features

- **Helmet.js** — Sets 15+ security HTTP headers
- **Rate Limiting** — 10 requests / 15 minutes per IP on `/api/*`
- **Input Sanitization** — `express-validator` trims and normalizes all inputs
- **CORS** — Only allows whitelisted origins
- **Body Limit** — JSON body capped at `10kb`
- **Trust Proxy** — Correct IP detection behind Vercel/CloudFront

---

## 📦 Scripts Reference

| Command | Description |
|---|---|
| `npm run install:all` | Install all dependencies (root + client + server) |
| `npm run dev` | Start React + Express dev servers concurrently |
| `npm run client` | Start React dev server only |
| `npm run server` | Start Express dev server only |
| `npm run build` | Build React for production |
| `npm start` | Run Express in production mode |
| `vercel --prod` | Deploy to Vercel production |

---

## 📄 License

MIT — feel free to use this as your own portfolio template.

---

<div align="center">
  Built with ⚛️ React + 🟢 Node.js · Deployed on ▲ Vercel
</div>
