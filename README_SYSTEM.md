# Hướng Dẫn Chạy Hệ Thống Phát Hiện Tin Giả (KLKS)

Hệ thống bao gồm 3 thành phần chính: **AI Model (Flask/Colab)**, **Backend (Node.js/Express)**, và **Client (Web React & Mobile Flutter)**.

---

## 1. Chuẩn Bị AI Model (Google Colab)
Đây là "bộ não" của hệ thống. Bạn cần chạy nó trước để lấy đường dẫn API.
1. Mở file notebook trên Google Colab.
2. Chạy tất cả các cell.
3. Tìm dòng output có chứa link **Ngrok** (Ví dụ: `https://abcd-1234.ngrok-free.dev`). 
4. **Lưu ý**: Copy link này để cấu hình ở bước tiếp theo.

---

## 2. Cài Đặt & Chạy Backend (Server)
Server đóng vai trò kết nối Database, lưu lịch sử và gọi AI.
1. Truy cập thư mục `server`.
2. Mở file `.env` và cập nhật:
   * `DB_PASSWORD`: Mật khẩu MySQL của bạn.
   * `FLASK_API_URL`: Dán link Ngrok từ Bước 1 vào đây.
3. Mở terminal tại thư mục `server`:
   ```bash
   npm install
   npm run dev
   ```
   *Server sẽ chạy tại cổng `5000`.*

---

## 3. Chạy Web Frontend (Tùy chọn)
Nếu bạn muốn sử dụng giao diện Web:
1. Truy cập thư mục `web`.
2. Mở terminal tại thư mục `web`:
   ```bash
   npm install
   npm run dev
   ```
   *Truy cập `http://localhost:5173` để sử dụng.*

---

## 4. Chạy Mobile App (Flutter)
Để chạy ứng dụng di động:
1. Đảm bảo **Server (Bước 2)** đang chạy.
2. Mở thư mục `mobile/fake_news_detection_app` bằng VS Code hoặc Android Studio.
3. Kiểm tra địa chỉ IP trong `lib/auth_service.dart`:
   * Nếu dùng **Máy ảo (Emulator)**: Giữ nguyên `http://10.0.2.2:5000/api`.
   * Nếu dùng **Điện thoại thật**: Đổi `10.0.2.2` thành địa chỉ IP mạng nội bộ (Wi-Fi) của máy tính bạn (Ví dụ: `http://192.168.1.10:5000/api`).
4. Chạy lệnh hoặc nhấn F5:
   ```bash
   flutter run
   ```

---

## Lưu Ý Quan Trọng
* **Thứ tự chạy**: Phải chạy **AI (Colab)** -> **Backend (Server)** -> Sau đó mới chạy **Web/Mobile**.
* **Database**: Đảm bảo MySQL đã được bật và có database tên là `fakenews`.
* **Mạng**: Điện thoại và máy tính phải dùng chung một mạng Wi-Fi nếu test trên thiết bị thật.
