# Web Scheduler API

API Backend cho ứng dụng Web Scheduler, hỗ trợ quản lý nhóm, sự kiện và đặt chỗ.

## Cài đặt

1. Clone repository
2. Cài đặt dependencies:
```
cd backend
npm install
```
3. Thiết lập cơ sở dữ liệu:
```
mysql -u root -p < schema.sql
mysql -u root -p < data.sql
```
4. Tạo file `.env` với nội dung:
```
# Server Configuration
PORT=8080

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=

# JWT Configuration
JWT_SECRET=
JWT_EXPIRES_IN=
```
5. Chạy server:
```
npm run dev
```

## API Endpoints

### Xác thực

- `POST /api/users/register`: Đăng ký người dùng mới
- `POST /api/users/login`: Đăng nhập và nhận token JWT

### Người dùng

- `GET /api/users`: Lấy danh sách người dùng (Admin)
- `GET /api/users/:id`: Lấy thông tin người dùng theo ID
- `PUT /api/users/:id`: Cập nhật thông tin người dùng
- `DELETE /api/users/:id`: Xóa người dùng (Admin)

### Nhóm

- `GET /api/groups`: Lấy danh sách nhóm
- `GET /api/groups/:id`: Lấy thông tin nhóm theo ID
- `POST /api/groups`: Tạo nhóm mới
- `PUT /api/groups/:id`: Cập nhật thông tin nhóm
- `DELETE /api/groups/:id`: Xóa nhóm
- `GET /api/groups/:id/members`: Lấy danh sách thành viên của nhóm
- `POST /api/groups/:id/members`: Thêm thành viên vào nhóm
- `DELETE /api/groups/:groupId/members/:userId`: Xóa thành viên khỏi nhóm

### Doanh nghiệp

- `GET /api/enterprises`: Lấy danh sách doanh nghiệp
- `GET /api/enterprises/:id`: Lấy thông tin doanh nghiệp theo ID
- `POST /api/enterprises`: Tạo doanh nghiệp mới
- `PUT /api/enterprises/:id`: Cập nhật thông tin doanh nghiệp
- `DELETE /api/enterprises/:id`: Xóa doanh nghiệp
- `GET /api/enterprises/:id/posts`: Lấy danh sách bài đăng của doanh nghiệp
- `POST /api/enterprises/:id/posts`: Tạo bài đăng mới
- `PUT /api/enterprises/:id/posts/:postId`: Cập nhật bài đăng
- `DELETE /api/enterprises/:id/posts/:postId`: Xóa bài đăng
- `GET /api/enterprises/:id/bookings`: Lấy danh sách đặt chỗ của doanh nghiệp
- `PUT /api/enterprises/:id/bookings/:bookingId`: Cập nhật trạng thái đặt chỗ

### Sự kiện

- `GET /api/events`: Lấy danh sách sự kiện
- `GET /api/events/:id`: Lấy thông tin sự kiện theo ID
- `POST /api/events`: Tạo sự kiện mới
- `PUT /api/events/:id`: Cập nhật thông tin sự kiện
- `DELETE /api/events/:id`: Xóa sự kiện
- `GET /api/events/:id/bookings`: Lấy danh sách đặt chỗ cho sự kiện
- `POST /api/events/:id/bookings`: Tạo đặt chỗ mới cho sự kiện
- `PUT /api/events/:id/bookings/:bookingId`: Cập nhật trạng thái đặt chỗ

### Đặt chỗ

- `GET /api/bookings`: Lấy danh sách đặt chỗ (Admin)
- `GET /api/bookings/:id`: Lấy thông tin đặt chỗ theo ID
- `POST /api/bookings`: Tạo đặt chỗ mới
- `PUT /api/bookings/:id`: Cập nhật thông tin đặt chỗ
- `DELETE /api/bookings/:id`: Xóa đặt chỗ
- `PUT /api/bookings/:id/status`: Cập nhật trạng thái đặt chỗ

## Xác thực

API sử dụng JWT (JSON Web Token) để xác thực. Để truy cập các endpoint được bảo vệ, bạn cần thêm header `Authorization` với giá trị `Bearer <token>` vào request.

## Vai trò người dùng

- `Admin`: Có quyền truy cập tất cả các tính năng
- `Leader`: Có quyền quản lý nhóm và sự kiện của nhóm
- `Member`: Có quyền xem thông tin nhóm và sự kiện
- `Enterprise`: Có quyền quản lý thông tin doanh nghiệp và đặt chỗ 
