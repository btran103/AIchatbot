# 🤖 AIQuestions (AQ) - AI Assistant & Study/Work Workspace

<p align="center">
  <img src="aiquestions-frontend/public/favicon.svg" alt="AIQuestions Logo" width="80" height="80" />
</p>

<p align="center">
  <b>Hệ thống Trợ lý Trí tuệ Nhân tạo đa năng hỗ trợ Học tập, Lập trình và Quản lý Công việc thông minh</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/.NET-10.0-purple?style=for-the-badge&logo=dotnet" alt=".NET 10" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Gemini API" />
  <img src="https://img.shields.io/badge/SQL_Server-CC292B?style=for-the-badge&logo=microsoft-sql-server&logoColor=white" alt="SQL Server" />
</p>

---

## 📌 Giới thiệu tổng quan

**AIQuestions (AQ)** là ứng dụng trợ lý AI toàn diện được phát triển theo mô hình Full-stack hiện đại (**ASP.NET Core Web API + React TypeScript**). Hệ thống tích hợp mô hình ngôn ngữ lớn **Google Gemini**, được tinh chỉnh với các System Prompts chuyên biệt giúp người dùng giải quyết nhanh các bài toán học tập, gỡ lỗi lập trình, học ngoại ngữ và quản lý kế hoạch dự án cá nhân hiệu quả.

---

## ✨ Tính năng nổi bật

### 🧠 1. Đa chế độ AI chuyên sâu (AI Modes)
Mỗi chế độ được tối ưu hóa với chỉ dẫn hệ thống (System Prompt) riêng biệt:
- 🎓 **Study (Học tập):** Hướng dẫn học theo phương pháp sư phạm, gợi ý cách tư duy và từng bước giải quyết bài tập thay vì chỉ đưa ra đáp án sẵn.
- 💻 **Coding (Lập trình):** Chuyên gia debug, review code, phân tích nguyên nhân lỗi và tối ưu hiệu năng (.NET, C#, React, TypeScript, SQL Server, Python...).
- 🌐 **English (Tiếng Anh):** Gia sư ngôn ngữ song ngữ Anh - Việt, hỗ trợ từ vựng, ngữ pháp, luyện thi IELTS/TOEIC và dịch thuật theo ngữ cảnh.
- 💼 **Work (Công việc):** Hỗ trợ lập kế hoạch công việc, soạn thảo email, biên soạn báo cáo và tóm tắt tài liệu.
- 🏗️ **Project (Kiến trúc Phần mềm):** Tư vấn thiết kế cơ sở dữ liệu (ERD), thiết kế RESTful API, mô hình kiến trúc hệ thống và lập kế hoạch sprint.
- 💬 **Normal (Trò chuyện thông thường):** Hỏi đáp tổng quát, tìm kiếm và tóm tắt thông tin nhanh chóng.

### 🗂️ 2. Quản lý hội thoại thông minh
- Tự động lưu lịch sử tin nhắn và phân loại theo phiên trò chuyện.
- Hỗ trợ ghim (Pin) các hội thoại quan trọng lên đầu danh sách.
- Trình bày định dạng phong phú: Code snippet với syntax highlighting, Markdown, bảng biểu, danh sách.

### 📝 3. Bộ nhớ ngữ cảnh (Memory System)
- Cho phép người dùng ghi chú thông tin cá nhân, phong cách làm việc, mục tiêu học tập để AI ghi nhớ và cá nhân hóa câu trả lời.

### 📋 4. Quản lý Dự án & Nhiệm vụ (Projects & Tasks)
- Theo dõi danh sách dự án cá nhân, deadline và trạng thái tiến độ.
- Quản lý công việc (Todo/Task) theo mức độ ưu tiên (Priority).

### 🔒 5. Xác thực & Bảo mật
- Đăng ký và đăng nhập bảo mật với **JWT (JSON Web Token)**.
- Mã hóa mật khẩu người dùng bằng thư viện **BCrypt**.
- Phân tách dữ liệu an toàn theo từng người dùng.

### 🎨 6. Giao diện trực quan & Hiện đại
- Hỗ trợ chuyển đổi giao diện **Dark Mode / Light Mode**.
- Responsive hoàn hảo trên máy tính và thiết bị di động.

---

## 🛠️ Công nghệ sử dụng

### Backend
- **Framework:** ASP.NET Core Web API (.NET 10)
- **Database & ORM:** SQL Server / Entity Framework Core (Code-First)
- **Authentication:** JWT Bearer & BCrypt.Net-Next
- **AI Integration:** Google Gemini REST API (hỗ trợ tự động fallback / dò tìm model khả dụng như `gemini-1.5-flash`)

### Frontend
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router DOM v7
- **Icons & UI:** Lucide Icons
- **Markdown Renderer:** React Markdown, Remark GFM
- **HTTP Client:** Axios (cấu hình interceptor tự động đính kèm JWT)

---

## 📂 Cấu trúc thư mục dự án

```text
AIQuestions/
├── AIQuestions.API/                  # Backend ASP.NET Core Web API
│   ├── Controllers/                  # API Controllers (Auth, Chat, Conversations...)
│   ├── Data/                         # EF Core DbContext & Configurations
│   ├── DTOs/                         # Data Transfer Objects
│   ├── Helpers/                      # Tiện ích bổ trợ (JWT, Password hashing...)
│   ├── Migrations/                   # EF Core Database Migrations
│   ├── Models/                       # Database Entities (User, Conversation, Task...)
│   ├── Services/                     # Business Logic & AIService (Gemini)
│   ├── appsettings.json              # Cấu hình chung của ứng dụng
│   └── appsettings.Development.json  # Cấu hình môi trường dev (chứa API Key, bị gitignore)
│
├── aiquestions-frontend/             # Frontend React TypeScript
│   ├── public/                       # Static Assets & Icons
│   ├── src/
│   │   ├── components/               # UI Components (Sidebar, ChatInput, ChatMessage...)
│   │   ├── contexts/                 # React Context (AuthContext, ThemeContext)
│   │   ├── layouts/                  # Layout bọc chính (MainLayout)
│   │   ├── pages/                    # Các trang (Dashboard, Chat, Memory, Projects...)
│   │   ├── services/                 # Cấu hình Axios & gọi API
│   │   └── types/                    # Định nghĩa TypeScript interfaces
│   ├── index.html
│   └── vite.config.ts
│
├── .gitignore                        # Cấu hình các file bỏ qua không commit Git
└── README.md                         # Tài liệu hướng dẫn dự án
```

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy

### Yêu cầu môi trường
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (phiên bản 18+ hoặc 20+)
- [SQL Server](https://www.microsoft.com/sql-server) (hoặc SQL Server Express / LocalDB)
- [Google Gemini API Key](https://aistudio.google.com/)

---

### 1️⃣ Khởi chạy Backend (.NET API)

1. Mở terminal và di chuyển vào thư mục backend:
   ```bash
   cd AIQuestions.API
   ```

2. Tạo hoặc cấu hình file `appsettings.Development.json` để thêm API Key Gemini:
   ```json
   {
     "Gemini": {
       "ApiKey": "YOUR_GEMINI_API_KEY_HERE"
     },
     "Logging": {
       "LogLevel": {
         "Default": "Information",
         "Microsoft.AspNetCore": "Warning"
       }
     }
   }
   ```

3. Cập nhật chuỗi kết nối Database trong file `appsettings.json` nếu cần:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=AIQuestionsDB;Trusted_Connection=True;TrustServerCertificate=True;"
   }
   ```

4. Chạy migration để tự động tạo Database:
   ```bash
   dotnet ef database update
   ```

5. Chạy Backend:
   ```bash
   dotnet run
   ```
   > Backend sẽ lắng nghe tại `http://localhost:5179`.

---

### 2️⃣ Khởi chạy Frontend (React + Vite)

1. Mở một cửa sổ terminal mới và di chuyển vào thư mục frontend:
   ```bash
   cd aiquestions-frontend
   ```

2. Cài đặt các gói thư viện:
   ```bash
   npm install
   ```

3. Khởi chạy server phát triển:
   ```bash
   npm run dev
   ```
   > Ứng dụng Frontend sẽ mở tại `http://localhost:5173`.

---

## 🔐 Bảo mật cấu hình

- Các thông tin nhạy cảm như **Gemini API Key**, chuỗi kết nối database và token bí mật **không được commit lên Git**.
- File `appsettings.Development.json` và file `.env` đã được liệt kê trong `.gitignore` để tránh bị lộ mã bí mật ra kho lưu trữ công khai.

---

## 👤 Tác giả

- **Bảo Trân** - [GitHub Profile](https://github.com/btran103)
- Repository: [AIchatbot](https://github.com/btran103/AIchatbot)
