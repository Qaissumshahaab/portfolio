/**
 * server.js — Express Application Entry Point
 * ─────────────────────────────────────────────
 * Sets up:
 *  • Security middleware (helmet, cors, rate-limit)
 *  • Request logging (morgan)
 *  • Body parsing
 *  • API routes
 *  • Static file serving (production: serves React build)
 *  • Global error handler
 */

const dotenv=require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const rateLimit    = require('express-rate-limit');
const mongoose     = require('mongoose');
const path         = require('path');

const contactRoutes  = require('./routes/contact');
const errorHandler   = require('./middleware/errorHandler');

// ── App Initialization ────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 5000;
const isDev = process.env.NODE_ENV !== 'production';

// ── Security: Helmet (HTTP headers) ──────────────────────
app.use(helmet({
  contentSecurityPolicy: isDev ? false : undefined,  // relax CSP in dev
}));


// ── CORS Configuration ────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL

  
//   // Add your Vercel domain here after deployment:
//   // 'https://your-portfolio.vercel.app',
 ];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: Origin "${origin}" not allowed.`));
  },
  methods:     ['GET', 'POST', 'OPTIONS']
  
}));

// ── Rate Limiting (protect /api endpoints) ────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 min
  max:      parseInt(process.env.RATE_LIMIT_MAX        || '10'),    // 10 req/window
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    success: false,
    message: 'Too many requests. Please wait a few minutes and try again.',
  },
});

app.use('/api/', limiter);

// ── Body Parsing ──────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Request Logging ───────────────────────────────────────
app.use(morgan(isDev ? 'dev' : 'combined'));

// ── Trust Proxy (for Vercel / Railway / Heroku) ───────────
app.set('trust proxy', 1);

// ── API Routes ────────────────────────────────────────────
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success:     true,
    status:      'OK',
    environment: process.env.NODE_ENV,
    timestamp:   new Date().toISOString(),
    uptime:      `${Math.floor(process.uptime())}s`,
  });
});

// ── Serve React Build in Production ──────────────────────
if (!isDev) {
  const buildPath = path.join(__dirname, '..', 'client', 'build');
  app.use(express.static(buildPath));

  // React router fallback — serve index.html for any non-API route
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// ── 404 handler for undefined API routes ─────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

// ── Global Error Handler ──────────────────────────────────
app.use(errorHandler);

// ── Connect to MongoDB ────────────────────────────────────
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI ;
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Server will continue without database. Contact form will not save submissions.');
    console.log('   To enable database storage:');
    console.log('   1. Install MongoDB locally or use MongoDB Atlas');
    console.log('   2. Set MONGODB_URI in .env file\n');
  }
};

// ── Start Server ──────────────────────────────────────────
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log('\n🚀 Portfolio Server Running');
    console.log(`   Mode:    ${isDev ? 'Development' : 'Production'}`);
    console.log(`   Port:    ${PORT}`);
    console.log(`   Health:  http://localhost:${PORT}/api/health`);
    console.log(`   Contact: http://localhost:${PORT}/api/contact\n`);
  });
};

startServer();
