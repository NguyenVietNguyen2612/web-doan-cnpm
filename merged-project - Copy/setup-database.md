# Hướng dẫn setup Database

## 1. Cài đặt MySQL Server
Đảm bảo MySQL Server đã được cài đặt và đang chạy trên máy.

## 2. Tạo database
Mở MySQL Command Line hoặc MySQL Workbench và chạy:

```sql
CREATE DATABASE IF NOT EXISTS web_scheduler;
```

## 3. Import schema
Từ thư mục `backend/`, chạy:

```bash
mysql -u root -p web_scheduler < schema.sql
```

Hoặc sao chép nội dung từ file `schema.sql` và thực thi trong MySQL Workbench.

## 4. Import dữ liệu mẫu (tùy chọn)
```bash
mysql -u root -p web_scheduler < data.sql
```

## 5. Cập nhật file .env
Cập nhật thông tin database trong file `backend/.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=web_scheduler
DB_PORT=3306
```

## 6. Kiểm tra kết nối
Chạy backend để kiểm tra kết nối database:

```bash
npm run dev:backend
``` 