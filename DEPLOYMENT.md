# Hướng Dẫn Deploy Web & Xuất File APK

Khi bạn muốn mang ứng dụng đi demo hoặc cài lên máy người khác, bạn cần thực hiện các bước "đóng gói" sau đây.

---

## 1. Xuất File APK cho Mobile
Để tạo file cài đặt (.apk) cho điện thoại Android:

1. **Quan trọng**: Mở file `lib/auth_service.dart`.
   * Thay đổi `baseUrl` từ `localhost` hoặc `10.0.2.2` thành **Địa chỉ IP Public** của Server hoặc dùng **Ngrok** để tunnel cổng 5000 của Node.js ra ngoài. 
   * Nếu chỉ muốn test trong cùng mạng Wi-Fi, hãy dùng địa chỉ IP nội bộ của máy tính (ví dụ: `192.168.1.x`).
2. Mở terminal tại thư mục `mobile/fake_news_detection_app`.
3. Chạy lệnh:
   ```bash
   flutter build apk --release
   ```
4. Sau khi chạy xong, file APK sẽ nằm tại:
   `build/app/outputs/flutter-apk/app-release.apk`
   *Bạn có thể gửi file này qua Zalo/Drive để cài lên điện thoại Android khác.*

---

## 2. Đóng Gói & Deploy Web (Cách Đơn Giản Nhất)
Cách chuyên nghiệp nhất cho đồ án là để Server Node.js "gánh" luôn phần giao diện Web.

### Bước A: Build giao diện React
1. Mở terminal tại thư mục `web`.
2. Chạy lệnh:
   ```bash
   npm run build
   ```
3. Một thư mục tên là `dist` sẽ được tạo ra. Hãy copy toàn bộ nội dung trong thư mục `dist` này.

### Bước B: Đưa vào Server Node.js
1. Tạo một thư mục mới tên là `public` bên trong thư mục `server`.
2. Dán (Paste) toàn bộ nội dung đã copy từ thư mục `dist` vào thư mục `public` của server.
3. Cập nhật file `server/server.js` để phục vụ các file tĩnh này:
   ```javascript
   const path = require('path');
   // ... (Dưới các dòng routes)
   app.use(express.static(path.join(__dirname, 'public')));
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, 'public', 'index.html'));
   });
   ```

### Bước C: Chạy thực tế
Bây giờ, bạn chỉ cần chạy đúng **1 mình Server Node.js** (`npm start`). Khi truy cập vào `http://localhost:5000` (hoặc IP của bạn), nó sẽ hiện ra giao diện Web hoàn chỉnh.

---

## 3. Cách để người khác truy cập từ xa (Ngrok)
Nếu bạn không có tiền thuê Server (VPS), bạn có thể dùng Ngrok để mở cửa cho máy khách truy cập vào Server của bạn:
1. Mở terminal và chạy:
   ```bash
   ngrok http 5000
   ```
2. Ngrok sẽ cho bạn một link (ví dụ: `https://xyz.ngrok-free.app`).
3. Gửi link này cho bạn bè, họ có thể vào Web của bạn từ bất cứ đâu.
4. **Lưu ý**: Link này cũng chính là `baseUrl` bạn cần điền vào App Mobile (Bước 1) để App có thể kết nối từ xa.
