# 🚀 Quick Start Guide

## Yêu cầu trước khi bắt đầu
- Node.js (v16 hoặc cao hơn)
- MySQL Server
- Git

## Các bước nhanh để chạy dự án

### 1. Cài đặt dependencies
```bash
npm install
npm run install:all
```

### 2. Setup Database
```bash
# Đăng nhập MySQL và tạo database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS web_scheduler;"

# Import schema
cd backend
mysql -u root -p web_scheduler < schema.sql
cd ..
```

### 3. Cấu hình Environment
Cập nhật file `backend/.env` với thông tin database của bạn:
```env
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_secure_jwt_secret
```

### 4. Chạy ứng dụng
```bash
# Chạy cả backend và frontend
npm run dev
```

### 5. Truy cập ứng dụng
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra MySQL Server đang chạy
- Kiểm tra thông tin đăng nhập trong `.env`
- Đảm bảo database `web_scheduler` đã được tạo

### Lỗi port đã được sử dụng
- Frontend: Thay đổi port trong `frontend/vite.config.js`
- Backend: Thay đổi PORT trong `backend/.env`

### Lỗi CORS
- Kiểm tra `CORS_ORIGIN` trong `backend/.env`
- Đảm bảo frontend URL khớp với CORS_ORIGIN

## Các lệnh hữu ích

```bash
# Chỉ chạy backend
npm run dev:backend

# Chỉ chạy frontend  
npm run dev:frontend

# Build frontend cho production
npm run build

# Cài đặt lại dependencies
npm run install:all
``` 