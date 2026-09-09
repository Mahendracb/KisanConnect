require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initMandiCron } = require('./services/mandiCron');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const cropRoutes = require('./routes/cropRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const eMandiRoutes = require('./routes/eMandiRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Initialize Cron Service (Daily 6 AM Mandi updates)
initMandiCron();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/emandi', eMandiRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'farmX MERN Platform',
    version: '2.1.0',
    architecture: 'MVC (Controllers & Protected Routes)',
    services: {
      aiAdvisor: 'active',
      weatherAdvisory: 'active',
      eMandi: 'active',
      mandiCron: 'registered'
    }
  });
});

// 404 & Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`[farmX MERN Server]: Running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[Server Error]: Port ${PORT} is already in use!`);
    console.error(`To kill the process occupying port ${PORT} in PowerShell, run:`);
    console.error(`  Get-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess | Stop-Process -Force\n`);
  } else {
    console.error(`[Server Error]:`, err);
  }
});
