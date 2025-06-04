const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const db = require('./utils/db');

const app = express();
const PORT = config.port;

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Sử dụng routes
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/enterprises', enterpriseRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

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
