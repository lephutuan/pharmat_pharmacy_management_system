# PharmaT - Hệ Thống Quản Lý Nhà Thuốc

PharmaT là một hệ thống quản lý nhà thuốc hiện đại với giao diện đơn giản, chuyên nghiệp, được xây dựng bằng Vue 3, TypeScript và TailwindCSS.

## 📋 Mục Lục

- [Tính Năng](#-tính-năng)
- [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
- [Hướng Dẫn Cài Đặt](#-hướng-dẫn-cài-đặt)
  - [Bước 0: Đặt Thư Mục Dự Án](#bước-0-đặt-thư-mục-dự-án-nếu-dùng-xampp)
  - [Bước 1: Cài Đặt Database MySQL](#bước-1-cài-đặt-database-mysql)
  - [Bước 2: Cài Đặt Backend](#bước-2-cài-đặt-backend)
  - [Bước 3: Cài Đặt Frontend](#bước-3-cài-đặt-frontend)
- [Chạy Dự Án](#-chạy-dự-án)
- [Tài Khoản Demo](#-tài-khoản-demo)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Troubleshooting](#-troubleshooting)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)

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

## 💻 Yêu Cầu Hệ Thống

Trước khi bắt đầu, đảm bảo bạn đã cài đặt:

- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **npm** hoặc **yarn** (npm được cài kèm với Node.js)
- **MySQL** >= 8.0 hoặc **XAMPP** ([Download XAMPP](https://www.apachefriends.org/))
- **Git** (để clone repository)

## 📦 Hướng Dẫn Cài Đặt

### Bước 0: Đặt Thư Mục Dự Án (Nếu dùng XAMPP)

**Nếu bạn đang sử dụng XAMPP**, bạn có thể đặt thư mục dự án vào `C:\xampp\htdocs\` để dễ quản lý:

1. **Copy thư mục dự án** vào `C:\xampp\htdocs\PharmaT`
   - Hoặc nếu bạn đã clone vào vị trí khác, di chuyển thư mục `PharmaT` vào `C:\xampp\htdocs\`
2. **Đường dẫn cuối cùng sẽ là:** `C:\xampp\htdocs\PharmaT`

**Lưu ý:** Điều này không bắt buộc, bạn có thể đặt dự án ở bất kỳ đâu. Tuy nhiên, nếu đặt trong `htdocs` sẽ dễ truy cập qua phpMyAdmin.

### Bước 1: Cài Đặt Database MySQL

#### 1.1. Khởi động MySQL

**Nếu dùng XAMPP:**

1. Mở **XAMPP Control Panel**
2. Nhấn nút **Start** cho **MySQL**
3. Đợi đến khi MySQL hiển thị màu xanh (đang chạy)
4. Nhấn nút **Start** cho **Apache** (nếu muốn dùng phpMyAdmin)

**Nếu dùng MySQL riêng:**

- Đảm bảo MySQL service đang chạy

#### 1.2. Tạo Database

Có 4 cách để tạo database:

**Cách 1: Sử dụng phpMyAdmin (Khuyên dùng cho người mới) ⭐**

1. **Mở phpMyAdmin:**

   - Mở trình duyệt web (Chrome, Firefox, Edge...)
   - Truy cập: `http://localhost/phpmyadmin`
   - Hoặc: `http://127.0.0.1/phpmyadmin`
   - Bạn sẽ thấy giao diện phpMyAdmin với menu bên trái

2. **Import file SQL:**

   - Ở **menu trên cùng** (thanh toolbar), tìm và nhấn vào tab **"Import"**
     - Tab này có thể hiển thị là **"Nhập"** nếu phpMyAdmin dùng tiếng Việt
     - Hoặc có icon hình mũi tên đi lên (↑)
   - Ở phần **"File to import"**, nhấn nút **"Chọn file"** (hoặc **"Choose File"**)
   - Trong cửa sổ chọn file, điều hướng đến file:
     - Đường dẫn: `C:\xampp\htdocs\PharmaT\database\install_all.sql`
     - Chọn file `install_all.sql` và nhấn **"Open"** (hoặc **"Mở"**)
   - **Để các tùy chọn mặc định** (không cần thay đổi gì):
     - Format: SQL (mặc định)
     - Charset: utf8 (mặc định)
     - Partial import: Không tích (mặc định)
   - Cuộn xuống **cuối trang** và tìm nút **"Go"** (hoặc **"Thực hiện"**)
   - Nhấn nút **"Go"** để bắt đầu import

3. **Chờ xử lý:**

   - phpMyAdmin sẽ xử lý file SQL (có thể mất vài giây đến vài phút tùy vào tốc độ máy)
   - Bạn sẽ thấy thanh progress bar hoặc thông báo "Processing..."

4. **Kiểm tra kết quả:**
   - Nếu thành công, bạn sẽ thấy thông báo màu xanh:
     - **"Import has been successfully finished"** (tiếng Anh)
     - Hoặc **"Nhập đã hoàn thành thành công"** (tiếng Việt)
   - Ở **menu bên trái**, bạn sẽ thấy database **"pharmat"** xuất hiện trong danh sách
   - Nhấn vào **"pharmat"** để xem các bảng đã được tạo (sẽ có 10 bảng)
   - Kiểm tra dữ liệu mẫu: Nhấn vào bảng **"users"** để xem 3 tài khoản demo

**Cách 2: Sử dụng Command Line (Khuyên dùng cho người có kinh nghiệm)**

```bash
# Mở Command Prompt hoặc PowerShell
# Di chuyển đến thư mục database
cd C:\xampp\htdocs\PharmaT\database

# Chạy file SQL tổng hợp
mysql -u root -p < install_all.sql
```

Khi được hỏi mật khẩu, nhập mật khẩu MySQL của bạn (mặc định là rỗng nếu dùng XAMPP, chỉ cần nhấn Enter).

**Cách 3: Sử dụng MySQL Workbench**

1. Mở MySQL Workbench
2. Tạo kết nối mới (nếu chưa có)
3. Kết nối đến MySQL server
4. Mở file `database/install_all.sql`
5. Copy toàn bộ nội dung và paste vào query editor
6. Nhấn **Execute** (hoặc Ctrl + Enter)

**Cách 4: Sử dụng script tự động (Windows)**

```bash
cd database
quick_setup.bat
```

#### 1.3. Kiểm tra Database

Mở MySQL và chạy các lệnh sau để kiểm tra:

```sql
USE pharmat;
SHOW TABLES;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_medicines FROM medicines;
```

Bạn sẽ thấy 10 bảng và có dữ liệu mẫu.

### Bước 2: Cài Đặt Backend

#### 2.1. Di chuyển vào thư mục backend

```bash
cd backend
```

#### 2.2. Cài đặt các gói cần thiết

```bash
npm install
```

#### 2.3. Tạo file cấu hình .env

Tạo file `.env` trong thư mục `backend/` với nội dung:

```env
# Cổng chạy backend (mặc định: 5000)
PORT=5000

# Secret key cho JWT (bạn có thể đặt bất kỳ chuỗi nào)
JWT_SECRET=pharmat-secret-key-2024-change-this-in-production

# Cấu hình Database MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=pharmat
```

**Lưu ý:**

- Nếu MySQL của bạn có mật khẩu, thay `DB_PASSWORD=` bằng mật khẩu của bạn
- Nếu MySQL chạy trên cổng khác, thay đổi `DB_PORT`
- Nếu database name khác, thay đổi `DB_NAME`

**Ví dụ với mật khẩu:**

```env
DB_PASSWORD=your_mysql_password
```

#### 2.4. Kiểm tra Backend

```bash
npm run dev
```

Nếu thấy dòng:

```
✅ Connected to MySQL database successfully!
🚀 Server is running on http://localhost:5000
```

Thì backend đã chạy thành công! Nhấn `Ctrl + C` để dừng tạm thời.

### Bước 3: Cài Đặt Frontend

#### 3.1. Quay lại thư mục gốc

```bash
cd ..
```

#### 3.2. Cài đặt các gói cần thiết

```bash
npm install
```

## ▶️ Chạy Dự Án

### Cách 1: Chạy riêng biệt (Khuyên dùng cho development)

#### Terminal 1: Chạy Backend

```bash
cd backend
npm run dev
```

Backend sẽ chạy tại: `http://localhost:5000`

#### Terminal 2: Chạy Frontend

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

### Cách 2: Chạy cùng lúc (Windows PowerShell)

Tạo file `start.ps1` trong thư mục gốc:

```powershell
# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
```

Chạy file:

```powershell
.\start.ps1
```

### Truy cập ứng dụng

1. Mở trình duyệt
2. Truy cập: `http://localhost:3000`
3. Đăng nhập bằng một trong các tài khoản demo bên dưới

## 🔐 Tài Khoản Demo

Sau khi cài đặt database, bạn có thể đăng nhập với các tài khoản sau:

| Vai Trò                   | Email                 | Password | Quyền Truy Cập       |
| ------------------------- | --------------------- | -------- | -------------------- |
| **Admin**                 | admin@pharmat.com     | password | Toàn quyền           |
| **Nhân viên bán hàng**    | sales@pharmat.com     | password | Bán hàng, Thành viên |
| **Nhân viên quản lý kho** | inventory@pharmat.com | password | Quản lý kho, Thuốc   |

## 📁 Cấu Trúc Dự Án

```
PharmaT/
├── backend/                 # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── config/         # Cấu hình database
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Middleware (auth, error handling)
│   │   └── utils/          # Utilities
│   ├── package.json
│   └── .env                 # File cấu hình (tạo mới)
│
├── database/                # Database scripts
│   ├── install_all.sql     # File SQL tổng hợp (⭐ Dùng file này)
│   ├── 01_create_database.sql
│   ├── 02_create_tables.sql
│   ├── 03_create_indexes.sql
│   ├── 04_seed_data.sql
│   ├── 05_create_views.sql
│   └── 06_create_triggers.sql
│
├── src/                     # Frontend (Vue 3)
│   ├── components/         # Components
│   ├── views/             # Pages
│   ├── stores/            # Pinia stores
│   ├── services/          # API services
│   ├── router/            # Vue Router
│   └── types/             # TypeScript types
│
├── package.json
├── vite.config.ts
└── README.md
```

## 🔧 Troubleshooting

### ❌ Lỗi: "Cannot connect to MySQL"

**Nguyên nhân:** MySQL chưa chạy hoặc cấu hình sai

**Giải pháp:**

1. Kiểm tra MySQL đang chạy (XAMPP Control Panel)
2. Kiểm tra file `.env` trong `backend/` có đúng thông tin không
3. Test kết nối thủ công:
   ```bash
   mysql -u root -p
   ```
4. Kiểm tra database đã tồn tại:
   ```sql
   SHOW DATABASES;
   USE pharmat;
   SHOW TABLES;
   ```

### ❌ Lỗi: "Database 'pharmat' does not exist"

**Nguyên nhân:** Database chưa được tạo

**Giải pháp:**

1. Chạy lại file SQL:
   ```bash
   mysql -u root -p < database/install_all.sql
   ```

### ❌ Lỗi: "Access denied for user 'root'@'localhost'"

**Nguyên nhân:** Sai mật khẩu MySQL

**Giải pháp:**

1. Kiểm tra mật khẩu trong file `backend/.env`
2. Nếu không có mật khẩu, để trống: `DB_PASSWORD=`
3. Nếu có mật khẩu, nhập đúng: `DB_PASSWORD=your_password`

### ❌ Lỗi: Frontend không kết nối được Backend

**Nguyên nhân:** Backend chưa chạy hoặc sai cổng

**Giải pháp:**

1. Đảm bảo backend đang chạy tại `http://localhost:5000`
2. Kiểm tra console của trình duyệt (F12) xem có lỗi gì không
3. Test backend thủ công:
   ```bash
   curl http://localhost:5000/api/health
   ```
   Nếu thấy `{"status":"ok",...}` thì backend đang chạy tốt

### ❌ Lỗi: "Module not found" khi chạy

**Nguyên nhân:** Thiếu dependencies

**Giải pháp:**

```bash
# Cài đặt lại dependencies cho frontend
npm install

# Cài đặt lại dependencies cho backend
cd backend
npm install
```

### ❌ Lỗi: Port 3000 hoặc 5000 đã được sử dụng

**Nguyên nhân:** Cổng đang bị chiếm bởi ứng dụng khác

**Giải pháp:**

1. Đóng ứng dụng đang dùng cổng đó
2. Hoặc đổi cổng trong:
   - Frontend: `vite.config.ts` (thay đổi `port: 3000`)
   - Backend: `backend/.env` (thay đổi `PORT=5000`)

## 💻 Công Nghệ Sử Dụng

### Frontend

- **Vue 3** (Composition API)
- **TypeScript**
- **TailwindCSS** - Styling
- **Vite** - Build tool
- **Vue Router** - Routing
- **Pinia** - State management
- **Axios** - HTTP client
- **Heroicons** - Icons

### Backend

- **Node.js**
- **Express** - Web framework
- **TypeScript**
- **MySQL2** - Database driver
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Database

- **MySQL 8.0+**
- Views và Triggers tự động

## 📝 Scripts Hữu Ích

### Frontend

```bash
npm run dev          # Chạy development server
npm run build        # Build cho production
npm run preview      # Preview build production
npm run type-check   # Kiểm tra TypeScript errors
```

### Backend

```bash
npm run dev          # Chạy development server (với hot reload)
npm run build        # Build TypeScript
npm start            # Chạy production (sau khi build)
```

## 🔄 Reset Database

Nếu muốn xóa và tạo lại database từ đầu:

```bash
# Xóa database cũ
mysql -u root -p -e "DROP DATABASE IF EXISTS pharmat;"

# Tạo lại database
mysql -u root -p < database/install_all.sql
```

## 📞 Hỗ Trợ

Nếu gặp vấn đề, vui lòng:

1. Kiểm tra lại các bước trong hướng dẫn
2. Xem phần [Troubleshooting](#-troubleshooting)
3. Kiểm tra console/logs để xem lỗi chi tiết
4. Tạo issue trên GitHub

## 📄 License

MIT License

---

**Chúc bạn cài đặt thành công! 🎉**
