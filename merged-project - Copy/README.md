# Web Group Schedule - Fullstack Application

Ứng dụng web quản lý lịch trình nhóm với backend Express.js và frontend React.

## Cấu trúc dự án

```
merged-project/
├── backend/          # Backend API (Express.js + MySQL)
├── frontend/         # Frontend (React + Vite)
├── package.json      # Scripts quản lý toàn bộ dự án
└── README.md
```

## Cài đặt

### 1. Cài đặt dependencies cho toàn bộ dự án
```bash
npm install
npm run install:all
```

### 2. Cài đặt riêng lẻ (nếu cần)
```bash
# Backend
npm run install:backend

# Frontend
npm run install:frontend
```

## Cấu hình

### Backend
1. Cập nhật file `.env` trong thư mục `backend/` (file đã được tạo sẵn):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
PORT=5000
CORS_ORIGIN=
```

2. Tạo database MySQL và chạy script schema:
```bash

### Frontend
Frontend sẽ tự động kết nối đến backend trên port 3000.

## Chạy ứng dụng

### Chạy cả backend và frontend cùng lúc
```bash
npm run dev
```

### Chạy riêng lẻ
```bash
# Backend (port 5000)
npm run dev:backend

# Frontend (port 5173)
npm run dev:frontend
```

## Build

```bash
# Build frontend cho production
npm run build
```

## Công nghệ sử dụng

### Backend
- Express.js
- MySQL2
- bcrypt
- CORS

### Frontend
- React 19
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- React Icons

## API Endpoints

Backend API sẽ chạy trên `http://localhost:5000` với các endpoints:
- `/api/users` - Quản lý người dùng
- `/api/groups` - Quản lý nhóm
- `/api/events` - Quản lý sự kiện
- `/api/bookings` - Quản lý đặt chỗ
- `/api/enterprises` - Quản lý doanh nghiệp

Frontend sẽ chạy trên `http://localhost:5173` 
