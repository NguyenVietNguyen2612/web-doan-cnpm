const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const db = require('./utils/db');

const app = express();
const PORT = config.port;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = Array.isArray(config.corsOrigin) 
      ? config.corsOrigin 
      : [config.corsOrigin];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - Query:`, req.query, '- Body:', req.body);
  next();
});

// Kiểm tra kết nối
app.get('/', (req, res) => {
  res.json({ message: 'Chào mừng đến với API của Web Scheduler' });
});

// Import routes
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const enterpriseRoutes = require('./routes/enterpriseRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const timeRoutes = require('./routes/timeRoutes');
const locationPreferenceRoutes = require('./routes/locationPreferenceRoutes');

// Sử dụng routes
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/enterprises', enterpriseRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/timeslots', timeRoutes);
app.use('/api/groups', locationPreferenceRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Đã xảy ra lỗi!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
