# Mock Data (DEPRECATED)

Thư mục này chứa các mock data đã được sử dụng trong quá trình phát triển frontend.

**Lưu ý: Các file trong thư mục này đã bị thay thế bằng API thực tế từ backend.**

## Sử dụng

- Các file trong thư mục này chỉ nên được sử dụng trong trường hợp API backend không hoạt động hoặc để tham khảo cấu trúc dữ liệu
- Để sử dụng API thực tế, hãy sử dụng các service trong thư mục `src/services`

## Danh sách mock data

- `userMocks.js`: Mock data cho người dùng
- `postMocks.js`: Mock data cho bài đăng

## Chuyển đổi sang API thực tế

Để chuyển đổi từ mock data sang API thực tế, hãy sửa các import trong các component từ:

```javascript
import { getUsers } from '../mocks/userMocks';
```

sang:

```javascript
import authService from '../services/authService';
```

Tương tự cho các mock data khác. 