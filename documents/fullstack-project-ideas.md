# Fullstack Project Ideas

Danh sach cac du an fullstack co the tu lam, tang dan do phuc tap. Phu hop voi stack **Laravel + React**.

---
## Cap do 1 — Tuong duong Todolist
### 1. Note Taking App (Notion mini)

**Mo ta:** Ung dung ghi chu ca nhan voi trinh soan thao markdown.

**Tinh nang chinh:**
- CRUD notes
- Markdown editor va rendering
- Tags / categories
- Search, filter, sort

**Ki nang moi hoc them:**
- Rich text / markdown editor (e.g. react-markdown, TipTap)
- Markdown rendering phia frontend

---
### 2. Expense Tracker

**Mo ta:** Theo doi chi tieu ca nhan theo ngay/thang/danh muc.

**Tinh nang chinh:**
- Them / xoa / sua chi tieu
- Phan loai (an uong, di lai, hoa don...)
- Bieu do thong ke theo thang
- Filter theo khoang thoi gian

**Ki nang moi hoc them:**
- Data visualization (Chart.js / Recharts)
- Date filtering phia backend

---
### 3. Habit Tracker

**Mo ta:** Tao va theo doi cac thoi quen hang ngay.

**Tinh nang chinh:**
- Tao habits, check-in hang ngay
- Streak counting
- Calendar / heatmap view
- Thong ke tuan/thang

**Ki nang moi hoc them:**
- Date logic phuc tap hon
- Heatmap UI (tuong tu GitHub contributions)

---
## Cap do 2 — Phuc tap hon (Auth, Relations)
### 4. Blog / CMS

**Mo ta:** Nen tang viet bai, binh luan, quan ly noi dung.

**Tinh nang chinh:**
- Dang ky / dang nhap nguoi dung
- Viet bai, chinh sua, xoa bai
- Comment, like
- Tags, categories, search
- Phan quyen: admin / author / reader

**Ki nang moi hoc them:**
- Authentication & Authorization (Laravel Sanctum / JWT)
- Role-based access control
- Relations nhieu bang (User, Post, Comment, Tag)

---
### 5. Bookmark Manager

**Mo ta:** Luu va quan ly cac duong dan (URL) yeu thich.

**Tinh nang chinh:**
- Luu URL, tu dong lay metadata (title, thumbnail, description)
- Collections / folders, tags
- Search full-text
- Import / export

**Ki nang moi hoc them:**
- Goi external API tu backend (web scraping co ban)
- Queue / job xu ly background (Laravel Queue)

---
### 6. Budget Planner

**Mo ta:** Quan ly nhieu vi/tai khoan, theo doi thu chi, bao cao tai chinh.

**Tinh nang chinh:**
- Nhieu accounts / wallets
- Transactions (thu / chi)
- Recurring payments (thu chi dinh ky)
- Bao cao theo thang, quy

**Ki nang moi hoc them:**
- Complex DB relationships
- Financial logic (so du, tinh tong theo period)
- Scheduled tasks (Laravel Scheduler)

---
## Cap do 3 — Gan production-ready