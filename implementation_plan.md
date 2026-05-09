# Refactor Web KLKS — Kiến trúc hiện đại cho đồ án tốt nghiệp

## Bối cảnh

Project hiện tại đã có foundation tốt: React + Vite + TailwindCSS + shadcn/ui + PocketBase + Axios. Tuy nhiên cần **tái cấu trúc** theo kiến trúc chuyên nghiệp hơn, bổ sung các chức năng còn thiếu (feedback, fullName trong auth, title trong checker), và chuẩn hóa code theo production-style.

### Hiện trạng vs Yêu cầu

| Hiện có | Cần thêm/sửa |
|---------|---------------|
| Flat structure (pages, components, hooks, lib, contexts) | Thêm `services/`, `layouts/`, `routes/` |
| PocketBase collection `checks` (tên không chuẩn) | Đổi sang `news_checks` + thêm `feedbacks` |
| `useCheckerLogic.js` dùng axios trực tiếp | Tạo axios instance riêng với interceptor |
| Hardcode PocketBase URL | Dùng `.env` cho cả PB lẫn API |
| Signup chỉ có email/password | Thêm `fullName` |
| CheckerPage chỉ có `content` | Thêm `title` field |
| Không có feedback | Thêm feedback flow |
| `SaveCheckModal` lưu thủ công | Auto-save sau khi phân tích |
| Không có `.env` | Tạo `.env` + `.env.example` |
| Comment code cũ trong `useCheckerLogic.js` | Dọn sạch |

---

## Proposed Changes

### Phase 1: Foundation — Cấu trúc thư mục & Config

#### [NEW] `.env` và `.env.example`
```
VITE_API_URL=/api
VITE_POCKETBASE_URL=http://127.0.0.1:8090
VITE_NGROK_URL=https://ouch-shield-everyday.ngrok-free.dev
```

#### [MODIFY] vite.config.js
- Đọc ngrok URL từ `env` thay vì hardcode
- Giữ proxy `/api` → ngrok

#### [MODIFY] pocketbaseClient.js
- Đọc PocketBase URL từ `import.meta.env.VITE_POCKETBASE_URL`

---

### Phase 2: Axios Service Layer

#### [NEW] `src/services/apiClient.js`
- Tạo axios instance với `baseURL: import.meta.env.VITE_API_URL`
- Request interceptor: thêm `Content-Type: application/json`
- Response interceptor: unwrap data, handle errors
- Export instance

#### [NEW] `src/services/predictService.js`
- `predictText(title, content)` → POST `/predict` → trả `{ label, confidence }`
- Thay thế `useCheckerLogic.js` cũ

#### [NEW] `src/services/newsCheckService.js`
- `create(data)` → PocketBase `news_checks.create()`
- `getByUser(userId, page)` → PocketBase `news_checks.getList()`
- `deleteOne(id)` → PocketBase `news_checks.delete()`

#### [NEW] `src/services/feedbackService.js`
- `create(data)` → PocketBase `feedbacks.create()`
- `getByCheck(checkId)` → PocketBase `feedbacks.getList()`

#### [DELETE] `src/hooks/useCheckerLogic.js`
- Replaced by service layer

---

### Phase 3: Auth — Bổ sung fullName

#### [MODIFY] AuthContext.jsx
- `signup()` nhận thêm `fullName`
- Truyền `name: fullName` khi create user

#### [MODIFY] SignupPage.jsx
- Thêm input "Họ và tên" (`fullName`)

---

### Phase 4: Routing & Layout

#### [NEW] `src/layouts/MainLayout.jsx`
- Wrap Header + `<Outlet />` + Footer
- Chuyển logic layout từ `App.jsx` sang đây

#### [NEW] `src/routes/AppRoutes.jsx`
- Tập trung định nghĩa routes
- `ProtectedRoute` wrapper

#### [MODIFY] App.jsx
- Import `AppRoutes` thay vì inline routes
- Cleaner, chỉ còn providers + router

---

### Phase 5: CheckerPage — Thêm Title + Auto-save

#### [MODIFY] CheckerPage.jsx
- Thêm input "Tiêu đề tin tức" (`title`)
- Gửi `{ title, content }` thay vì `{ text }`
- Sau khi nhận kết quả → auto-save vào `news_checks` (nếu đã login)
- Bỏ `SaveCheckModal` (không cần nữa, auto-save)
- Dùng `predictService` thay vì `useCheckerLogic`
- UI giữ style hiện tại (đã redesign đẹp)

---

### Phase 6: History Page — Redesign + Feedback

#### [MODIFY] MyHistoryPage.jsx
- Đổi collection name từ `checks` → `news_checks`
- Cập nhật field names (`title`, `content`, `predictLabel`, `confidenceScore`)
- Thêm nút "Gửi feedback" cho mỗi record
- Loading skeleton thay vì spinner
- Pagination

#### [NEW] `src/components/FeedbackModal.jsx`
- Dialog cho user chọn `actualLabel` (Fake/Real) + viết `comment`
- Submit → `feedbackService.create()`

---

### Phase 7: PocketBase Schema

#### Collection `users` (built-in, customize)
| Field | Type | Note |
|-------|------|------|
| `name` | text | PocketBase built-in field, dùng cho fullName |
| `email` | email | Built-in |

#### [NEW] Collection `news_checks`
| Field | Type | Required |
|-------|------|----------|
| `userId` | relation → users | ✅ |
| `title` | text | ✅ |
| `content` | text | ✅ |
| `predictLabel` | text | ✅ |
| `confidenceScore` | number | ✅ |

#### [NEW] Collection `feedbacks`
| Field | Type | Required |
|-------|------|----------|
| `userId` | relation → users | ✅ |
| `checkId` | relation → news_checks | ✅ |
| `actualLabel` | text | ✅ |
| `comment` | text | ❌ |

> [!IMPORTANT]
> PocketBase collections cần tạo thủ công qua Admin UI (`http://127.0.0.1:8090/_/`). Tôi sẽ viết hướng dẫn chi tiết từng bước.

---

### Phase 8: Polish

- Dọn sạch commented code trong `useCheckerLogic.js` (file sẽ bị xóa)
- Loading skeletons cho HistoryPage
- Error boundaries
- Responsive testing

---

## Cấu trúc thư mục sau refactor

```
web/src/
├── components/
│   ├── ui/              ← shadcn/ui (giữ nguyên)
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProtectedRoute.jsx
│   ├── FeedbackModal.jsx  [NEW]
│   ├── FeatureCard.jsx
│   ├── EducationCard.jsx
│   ├── ScrollToTop.jsx
│   └── LoadingSpinner.jsx
├── contexts/
│   └── AuthContext.jsx
├── hooks/               ← (trống sau refactor, giữ folder)
├── layouts/             [NEW]
│   └── MainLayout.jsx
├── lib/
│   ├── pocketbaseClient.js
│   └── utils.js
├── pages/
│   ├── HomePage.jsx
│   ├── CheckerPage.jsx
│   ├── EducationPage.jsx
│   ├── MyHistoryPage.jsx
│   ├── LoginPage.jsx
│   └── SignupPage.jsx
├── routes/              [NEW]
│   └── AppRoutes.jsx
├── services/            [NEW]
│   ├── apiClient.js
│   ├── predictService.js
│   ├── newsCheckService.js
│   └── feedbackService.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## Verification Plan

### Automated Tests
```bash
npm run dev        # Dev server chạy không lỗi
npm run build      # Build production không lỗi
```

### Manual Verification (Browser)
1. **Auth flow**: Đăng ký (có fullName) → Đăng nhập → Đăng xuất
2. **Checker flow**: Nhập title + content → Phân tích → Xem kết quả → Auto-save
3. **History**: Xem danh sách checks đã lưu → Delete
4. **Feedback**: Click feedback trên history item → Submit
5. **Responsive**: Test trên mobile viewport

---

## Open Questions

> [!IMPORTANT]
> **1. API format**: API hiện tại nhận `{ text }` và trả `{ success, data: { label, confidence, explanation, ... } }`. Yêu cầu mới muốn gửi `{ title, content }` và trả `{ label, confidence }`. Bạn có muốn giữ format API hiện tại không, hay sẽ update Flask API để nhận `title` + `content`?

> [!IMPORTANT]
> **2. Auto-save vs Manual save**: Bạn muốn tự động lưu kết quả vào PocketBase sau khi phân tích (nếu đã login), hay vẫn giữ nút "Lưu kết quả" thủ công?

> [!IMPORTANT]
> **3. Collection `checks` hiện tại**: PocketBase đang có collection `checks`. Bạn muốn tạo mới collection `news_checks` (và migrate data), hay đổi tên collection cũ?
