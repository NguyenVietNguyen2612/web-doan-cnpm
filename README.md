# Web Group Schedule - Hệ thống Quản lý Lịch trình Nhóm - 1 sản phẩm của đồ án môn Nhập môn Công nghệ phần mềm của nhóm 6 mã lớp SE104.P29
Ứng dụng web toàn diện cho việc quản lý lịch trình nhóm với backend Express.js và frontend React.

##  Tính năng chính

###  Quản lý Nhóm
- Tạo và quản lý nhóm với vai trò Leader/Member
- Mời thành viên qua email
- Quản lý quyền truy cập nhóm

###  Quản lý Sự kiện & Lịch trình  
- Tạo và chỉnh sửa sự kiện
- Tích hợp Google Calendar
- Đồng bộ lịch cá nhân
- Quản lý thời gian rảnh của thành viên

###  Hệ thống Doanh nghiệp
- Đăng ký và quản lý doanh nghiệp
- Tạo và quản lý bài đăng
- Hệ thống đặt chỗ/booking
- Dashboard doanh nghiệp

###  Xác thực & Bảo mật
- Đăng nhập/đăng ký truyền thống
- Đăng nhập Google OAuth
- JWT Authentication
- Quản lý phiên đăng nhập

###  Hệ thống Email
- Gửi thông báo sự kiện
- Email xác nhận đăng ký
- Template email chuyên nghiệp
- Tùy chỉnh nội dung email

###  Admin Dashboard
- Quản lý người dùng
- Quản lý doanh nghiệp
- Phê duyệt bài đăng
- Thống kê hệ thống

##  Cấu trúc dự án

```
merged-project/
├── backend/                    # Backend API (Express.js + MySQL)
│   ├── controllers/           # Controllers xử lý logic
│   ├── models/               # Models tương tác database
│   ├── routes/               # Route definitions
│   ├── services/             # Business logic services
│   ├── middlewares/          # Authentication & validation
│   ├── migrations/           # Database migrations
│   └── utils/                # Utilities
├── frontend/                  # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   └── utils/           # Utilities
│   └── public/              # Static assets
├── package.json             # Root package.json
└── README.md
```

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js 18+ 
- MySQL 8.0+
- npm hoặc yarn

### 1. Clone và cài đặt
```bash
git clone <repository-url>
cd merged-project
npm install
npm run install:all
```

### 2. Cấu hình môi trường

Tạo file `.env` trong thư mục gốc với nội dung:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=web_scheduler
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-here
JWT_EXPIRATION=24h

# Session Configuration
SESSION_SECRET=your-session-secret-key-here

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175
FRONTEND_URL=http://localhost:5173

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_SENDER_NAME=Hệ thống Quản lý Sự kiện

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Cài đặt Database
```bash
# Tạo database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS web_scheduler;"

# Import schema và dữ liệu
cd backend
mysql -u root -p web_scheduler < schema.sql
mysql -u root -p web_scheduler < data.sql

# Chạy migrations (nếu có)
npm run migrate
```

### 4. Chạy ứng dụng

#### Chạy cả frontend và backend
```bash
npm run dev
```

#### Chạy riêng lẻ
```bash
# Backend (http://localhost:5000)
npm run dev:backend

# Frontend (http://localhost:5173)  
npm run dev:frontend
```


##  Công nghệ sử dụng

### Backend
- **Express.js** - Web framework
- **MySQL2** - Database driver
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Passport.js** - OAuth authentication
- **Nodemailer** - Email service
- **Google APIs** - Calendar integration

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Icons** - Icon library

##  API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/auth/google` - Google OAuth

### Users
- `GET /api/users/profile` - Lấy thông tin user
- `PUT /api/users/profile` - Cập nhật profile

### Groups
- `GET /api/groups` - Danh sách nhóm
- `POST /api/groups` - Tạo nhóm mới
- `PUT /api/groups/:id` - Cập nhật nhóm
- `DELETE /api/groups/:id` - Xóa nhóm

### Events
- `GET /api/events` - Danh sách sự kiện
- `POST /api/events` - Tạo sự kiện
- `PUT /api/events/:id` - Cập nhật sự kiện
- `DELETE /api/events/:id` - Xóa sự kiện

### Enterprises
- `GET /api/enterprises` - Danh sách doanh nghiệp
- `POST /api/enterprises` - Đăng ký doanh nghiệp
- `GET /api/enterprises/:id/posts` - Bài đăng của doanh nghiệp

### Bookings
- `GET /api/bookings` - Danh sách booking
- `POST /api/bookings` - Tạo booking mới
- `PUT /api/bookings/:id` - Cập nhật booking

### Admin
- `GET /api/admin/dashboard` - Dashboard admin
- `GET /api/admin/users` - Quản lý users
- `GET /api/admin/enterprises` - Quản lý enterprises

##  Hướng dẫn sử dụng

### Đăng ký và Đăng nhập
1. Truy cập `http://localhost:5173`
2. Đăng ký tài khoản mới hoặc đăng nhập
3. Có thể sử dụng Google OAuth để đăng nhập nhanh

### Tạo và Quản lý Nhóm
1. Sau khi đăng nhập, click "Tạo nhóm mới"
2. Điền thông tin nhóm và mời thành viên
3. Quản lý sự kiện và lịch trình nhóm

### Đăng ký Doanh nghiệp
1. Chọn "Đăng ký Doanh nghiệp" 
2. Điền thông tin doanh nghiệp
3. Tạo bài đăng và quản lý booking

##  Scripts có sẵn

```bash
# Development
npm run dev              # Chạy cả frontend và backend
npm run dev:frontend     # Chỉ chạy frontend
npm run dev:backend      # Chỉ chạy backend

# Installation
npm run install:all      # Cài đặt tất cả dependencies
npm run install:frontend # Cài đặt frontend dependencies
npm run install:backend  # Cài đặt backend dependencies

# Build
npm run build           # Build frontend cho production
npm run build:frontend  # Build frontend
npm run start:backend   # Chạy backend production
npm run start:production # Build frontend và chạy backend production
npm run preview          # Xem thử bản build frontend

# Database
npm run migrate         # Chạy database migrations
npm run seed           # Seed dữ liệu mẫu
```

##  License



