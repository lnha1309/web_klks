# Ứng dụng Web Kiểm Tra Tin Giả (KLKS)

Dự án này bao gồm Frontend (React), Backend (Node.js) và kết nối với AI Server (Flask).

---

## 🚀 Hướng Dẫn Bắt Đầu Nhanh (Sau khi Pull/Tải code)

Nếu bạn vừa mới tải code về máy, hãy thực hiện các bước sau theo thứ tự:

### 1. Cài đặt thư viện (Dependencies)
Bạn cần cài đặt thư viện cho cả phần Web và Server. Mở terminal tại thư mục gốc và chạy:
```bash
# Cài đặt cho Server
cd server
npm install

# Cài đặt cho Web
cd ../web
npm install
```

### 2. Thiết lập Database (MySQL)
1. Bật MySQL (qua XAMPP hoặc MySQL Server).
2. Tạo một database tên là: `fakenews`.
3. Kiểm tra file `server/.env` để đảm bảo `DB_PASSWORD` đúng với mật khẩu MySQL của bạn.

### 3. Cấu hình AI API
1. Chạy AI Model trên Colab để lấy link Ngrok.
2. Mở file `server/.env` và cập nhật link Ngrok vào dòng:
   `FLASK_API_URL=https://your-ngrok-link.ngrok-free.dev/predict`

---

## 🛠 Cách Chạy Hệ Thống

Để hệ thống hoạt động hoàn chỉnh, bạn cần chạy 2 terminal song song:

### Terminal 1: Chạy Backend (Server)
```bash
cd server
npm run dev
```
*Server sẽ chạy tại `http://localhost:5000`.*

### Terminal 2: Chạy Frontend (Web)
```bash
cd web
npm run dev
```
*Truy cập Web tại `http://localhost:5173`.*

---

## 📂 Cấu Trúc Thư Mục
* `/server`: Mã nguồn Backend (Node.js, Express, Sequelize).
* `/web`: Mã nguồn Frontend (React, Vite, Tailwind CSS).
* `README_SYSTEM.md`: Hướng dẫn vận hành chi tiết toàn hệ thống.
* `DEPLOYMENT.md`: Hướng dẫn đóng gói APK và Deploy thực tế.
