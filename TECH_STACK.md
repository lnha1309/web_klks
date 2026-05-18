# CÁC CÔNG NGHỆ SỬ DỤNG

Tài liệu liệt kê toàn bộ ngôn ngữ, framework, thư viện, dịch vụ và công cụ phát triển được dùng trong dự án **Hệ thống phát hiện tin giả (KLKS)** — bao gồm cả phần web và phần mobile.

---

## 1. IDE & công cụ phát triển

| Công cụ | Vai trò |
|---|---|
| **Visual Studio Code** | IDE chính cho phần web (frontend + backend Node.js) |
| **Android Studio** | IDE phụ cho phần mobile (Flutter / Android SDK / Emulator) |
| **Git** | Quản lý mã nguồn |
| **GitHub** | Lưu trữ repository |
| **Postman** | Test REST API trong quá trình phát triển |
| **DBeaver / MySQL Workbench** | Quản lý cơ sở dữ liệu MySQL |
| **Chrome DevTools** | Debug frontend, kiểm tra network, console |
| **Ngrok** | Expose Flask API (model AI) ra public domain để backend gọi tới |

---

## 2. Ngôn ngữ lập trình

| Ngôn ngữ | Sử dụng ở |
|---|---|
| **JavaScript (ES2022+)** | Frontend (React) và Backend (Node.js / Express) |
| **JSX** | Markup React component |
| **HTML5 / CSS3** | Cấu trúc & style cơ bản của web |
| **Dart** | Toàn bộ ứng dụng mobile (Flutter) |
| **Python** | Mô hình AI phát hiện tin giả (Flask service) |
| **SQL (MySQL dialect)** | Truy vấn cơ sở dữ liệu |
| **Kotlin** | Code Android native bridge của Flutter |
| **YAML / JSON** | File cấu hình (`pubspec.yaml`, `package.json`, `vercel.json`, ...) |

---

## 3. Frontend Web (`web/`)

**Framework & build tool**
- **React 18** — thư viện UI chính
- **Vite 7** — bundler, dev server, HMR
- **React Router DOM 7** — định tuyến (SPA routing)

**UI / Styling**
- **Tailwind CSS 3** — utility-first CSS framework
- **shadcn/ui** + **Radix UI** — bộ component accessible (dialog, dropdown, tabs, tooltip, ...)
- **Lucide React** — icon set
- **Framer Motion** — animation
- **tailwindcss-animate**, **tailwind-merge**, **class-variance-authority**, **clsx** — tiện ích styling

**State, form, validation**
- **React Hook Form** + **@hookform/resolvers** — quản lý form
- **Zod** — schema validation

**Networking & utilities**
- **Axios** — HTTP client gọi backend
- **Sonner** — toast notification
- **React Helmet** — quản lý `<head>` (SEO, title)
- **date-fns** — xử lý ngày giờ
- **Recharts** — biểu đồ thống kê
- **Embla Carousel**, **cmdk**, **input-otp**, **vaul**, **react-resizable-panels**, **react-day-picker** — các component phụ trợ

**Lint & format**
- **ESLint 8** + plugin React, React Hooks, Import Resolver Alias
- **PostCSS** + **Autoprefixer**
- **Terser** — minify production build

---

## 4. Backend Node.js (`server/` & `api/`)

**Framework & runtime**
- **Node.js (>= 18)** — runtime
- **Express 5** — framework REST API
- **Vercel Serverless Functions** — host các route trong `api/` (production)
- **Nodemon** — auto-reload trong môi trường dev

**Database & ORM**
- **MySQL 8** — cơ sở dữ liệu quan hệ
- **mysql2** — driver MySQL
- **Sequelize 6** — ORM, quản lý model `User`, `NewsCheck`, `Feedback`, ...

**Auth & bảo mật**
- **JSON Web Token (jsonwebtoken)** — phát hành & xác thực JWT
- **bcryptjs** — hash mật khẩu
- **CORS** — cho phép web/mobile gọi cross-origin

**Tích hợp & tiện ích**
- **Axios** — gọi sang Flask AI service
- **dotenv** — đọc biến môi trường (`.env`)

---

## 5. AI Service (Python — chạy độc lập)

- **Python 3** — ngôn ngữ chính
- **Flask** — REST API endpoint `/predict`
- **PyTorch / Transformers (Hugging Face)** — load model phân loại tin giả
- **scikit-learn**, **NumPy**, **pandas** — tiền xử lý dữ liệu, tính metric (flip ratio, ensemble std, ...)
- **Qwen LLM** — branch reasoning để giải thích & override kết quả khi cần
- **Ngrok** — public tunnel để Node.js backend gọi tới Flask service
- **Google Colab** — môi trường training/experiment model

---

## 6. Mobile App (`fake_news_detection_app/`)

**Framework & SDK**
- **Flutter 3.x** — framework UI đa nền tảng
- **Dart SDK ^3.10** — ngôn ngữ chính
- **Android SDK + Gradle (Kotlin DSL)** — build APK
- **Xcode + CocoaPods** — build iOS (đã có cấu hình)

**Thư viện**
- **http** — gọi REST API tới backend
- **shared_preferences** — lưu JWT token & session
- **cupertino_icons** — icon iOS-style
- **Material Design** — bộ component UI mặc định Flutter

**Lint**
- **flutter_lints** — quy tắc code style chuẩn

---

## 7. Hạ tầng & dịch vụ cloud

| Dịch vụ | Vai trò |
|---|---|
| **Vercel** | Deploy frontend (Vite) + backend serverless (`/api/*`) |
| **Railway** | Host MySQL database (production) |
| **Ngrok** | Public tunnel cho Flask AI service |
| **Google Colab** | Train & thử nghiệm mô hình AI |
| **Gmail SMTP / Mail provider** | Gửi mail xác thực (nếu áp dụng) |

---

## 8. Quy ước cấu hình

- **`.env`** — biến môi trường (DB credentials, `JWT_SECRET`, `FLASK_API_URL`, `DOMAIN_BACKEND`)
- **`vercel.json`** — cấu hình deploy Vercel (rewrite, build command)
- **`pubspec.yaml`** — khai báo dependency Flutter
- **`package.json`** — khai báo dependency Node.js cho `web/`, `server/` và root
- **`AndroidManifest.xml`** — khai báo permission Android (INTERNET, ACCESS_NETWORK_STATE)

---

## 9. Tổng kết kiến trúc

```
┌──────────────┐     HTTPS      ┌────────────────────┐     Sequelize      ┌──────────────┐
│  Web (React) │ ─────────────▶ │  Backend Node.js   │ ──────────────────▶│  MySQL       │
│  Vite + Tail │                │  Express + Vercel  │                    │  (Railway)   │
└──────────────┘                └────────────────────┘                    └──────────────┘
                                          │
┌──────────────┐     HTTPS                │ axios
│  Mobile      │ ─────────────────────────┤
│  (Flutter)   │                          ▼
└──────────────┘                ┌────────────────────┐
                                │  Flask AI Service  │
                                │  (Python + PyTorch)│
                                │   ngrok tunnel     │
                                └────────────────────┘
```

Toàn bộ stack được chọn theo hướng **mã nguồn mở, miễn phí, dễ deploy, chạy tốt trên cả desktop browser, Android, iOS**.
