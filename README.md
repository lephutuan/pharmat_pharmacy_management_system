# PharmaT - Hệ Thống Quản Lý Nhà Thuốc

PharmaT là một hệ thống quản lý nhà thuốc hiện đại với giao diện đơn giản, chuyên nghiệp, được xây dựng bằng Vue 3, TypeScript và TailwindCSS.

## 🚀 Tính Năng

### Hệ Thống Quản Lý

- **Dashboard**: Tổng quan hệ thống với các thống kê quan trọng
- **Quản Lý Thuốc**: CRUD thuốc với phân loại và theo dõi tồn kho
- **Quản Lý Kho**: Nhập/xuất kho, theo dõi hết hạn
- **Bán Hàng**: Tạo đơn hàng, in hóa đơn
- **Cảnh Báo**: Thông báo thuốc hết hạn, hết hàng
- **Báo Cáo**: Phân tích doanh thu và tồn kho
- **Quản Lý Nhân Viên**: Quản lý người dùng và phân quyền
- **Quản Lý Thành Viên**: Quản lý khách hàng và hội viên
- **Cài Đặt**: Cấu hình hệ thống

### Phân Quyền Người Dùng

- **Chủ tiệm thuốc (Admin)**: Toàn quyền truy cập
- **Nhân viên bán hàng**: Chỉ truy cập bán hàng và thành viên
- **Nhân viên quản lý kho**: Chỉ truy cập quản lý kho và thuốc

## 💻 Công Nghệ

### Frontend

- Vue 3 (Composition API)
- TypeScript
- TailwindCSS
- Vite
- Vue Router
- Pinia
- Axios
- Heroicons

### Backend (Kế hoạch)

- Node.js
- Express
- TypeScript
- MySQL

## 📦 Cài Đặt

### Yêu Cầu

- Node.js >= 18
- npm hoặc yarn
- MySQL >= 8.0 (cho backend)

### Chạy Ứng Dụng

#### Frontend

1. Clone repository:

```bash
git clone https://github.com/yourusername/pharmat.git
cd pharmat
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Chạy development server:

```bash
npm run dev
```

4. Mở browser và truy cập: `http://localhost:3000`

#### Backend

1. Vào thư mục backend:

```bash
cd backend
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

4. Cấu hình thông tin database trong `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pharmat
JWT_SECRET=your-secret-key
```

5. Chạy development server:

```bash
npm run dev
```

Backend API sẽ chạy tại: `http://localhost:5000`

### Build cho Production

```bash
npm run build
```

### Kiểm tra TypeScript

```bash
npm run type-check
```

## 📁 Cấu Trúc Thư Mục

```
pharmat/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.vue
│   │   │   ├── Header.vue
│   │   │   └── Footer.vue
│   │   └── ChatModal.vue
│   ├── layouts/
│   │   └── AppLayout.vue
│   ├── views/
│   │   ├── LoginView.vue
│   │   ├── DashboardView.vue
│   │   ├── MedicinesView.vue
│   │   ├── InventoryView.vue
│   │   ├── SalesView.vue
│   │   ├── AlertsView.vue
│   │   ├── ReportsView.vue
│   │   ├── StaffView.vue
│   │   ├── MembersView.vue
│   │   └── SettingsView.vue
│   ├── stores/
│   │   └── auth.ts
│   ├── services/
│   │   └── api.ts
│   ├── router/
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🎨 Design System

### Màu Sắc

- **Primary**: #313fb2 (Xanh dương đậm)
- **Secondary**: #4361ee (Xanh dương)
- **Accent**: #10b981 (Xanh lá)
- **Background**: #ebeef1 (Xám nhạt)

### Fonts

- **Title**: Cal Sans (Bold)
- **Body**: Poppins (Regular)

## 🔐 Tài Khoản Demo

- **Admin**: admin@pharmat.com / password
- **Sales**: sales@pharmat.com / password
- **Inventory**: inventory@pharmat.com / password

## 📝 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build cho production
- `npm run preview` - Preview build production
- `npm run type-check` - Kiểm tra TypeScript errors

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.

## 📄 License

MIT License

## 👥 Authors

- PharmaT Team

## 📞 Liên Hệ

Email: info@pharmat.com
Website: https://pharmat.com
