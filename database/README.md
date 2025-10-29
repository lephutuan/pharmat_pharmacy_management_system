# Database Setup Hướng Dẫn

## Cấu Trúc Database PharmaT

Database bao gồm 10 bảng chính:

1. **users** - Nhân viên hệ thống
2. **medicine_categories** - Danh mục thuốc
3. **medicines** - Thông tin thuốc
4. **inventory_records** - Lịch sử nhập xuất kho
5. **members** - Thành viên (khách hàng)
6. **orders** - Đơn hàng bán
7. **order_items** - Chi tiết đơn hàng
8. **alerts** - Cảnh báo hệ thống
9. **settings** - Cài đặt hệ thống
10. **notifications** - Thông báo người dùng

## Cài Đặt Nhanh

### Phương án 1: Chạy từng file SQL

```bash
# 1. Kết nối MySQL
mysql -u root -p

# 2. Chạy các file theo thứ tự
source database/01_create_database.sql;
source database/02_create_tables.sql;
source database/03_create_indexes.sql;
source database/04_seed_data.sql;
source database/05_create_views.sql;
source database/06_create_triggers.sql;
```

### Phương án 2: Chạy file tổng hợp

```bash
mysql -u root -p < database/install.sql
```

## Xác Minh Cài Đặt

```sql
-- Kiểm tra các bảng đã được tạo
SHOW TABLES;

-- Đếm số lượng dữ liệu mẫu
SELECT
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM medicine_categories) as total_categories,
  (SELECT COUNT(*) FROM medicines) as total_medicines,
  (SELECT COUNT(*) FROM members) as total_members;
```

## Tài Khoản Demo

### Admin

- Email: `admin@pharmat.com`
- Password: `password`

### Sales Staff

- Email: `sales@pharmat.com`
- Password: `password`

### Inventory Staff

- Email: `inventory@pharmat.com`
- Password: `password`

## Tính Năng Tự Động

### 1. Trigger Cập Nhật Tồn Kho

- Tự động cập nhật số lượng thuốc khi có nhập/xuất kho
- Tự động cập nhật số lượng khi bán hàng

### 2. Trigger Cảnh Báo

- Tự động tạo cảnh báo khi thuốc sắp hết hạn (30 ngày)
- Tự động tạo cảnh báo khi số lượng <= stock_alert
- Tự động tạo cảnh báo khi hết hàng (quantity = 0)

## Views Hữu Ích

### v_top_selling_medicines

- Top 10 thuốc bán chạy nhất
- Kèm theo doanh thu

### v_expiring_medicines

- Danh sách thuốc sắp hết hạn trong 30 ngày
- Kèm số ngày còn lại

### v_low_stock_medicines

- Danh sách thuốc sắp hết
- Sort theo số lượng tăng dần

### v_daily_sales

- Thống kê doanh thu theo ngày
- Số đơn hàng, doanh thu, giá trị trung bình

### v_staff_performance

- Hiệu suất nhân viên
- Tổng đơn hàng, doanh thu

## Backup & Restore

### Backup

```bash
mysqldump -u root -p pharmat > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore

```bash
mysql -u root -p pharmat < backup_YYYYMMDD_HHMMSS.sql
```

## Reset Database

```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS pharmat;"
mysql -u root -p < database/install.sql
```

## Troubleshooting

### Lỗi: "Table already exists"

```sql
DROP DATABASE IF EXISTS pharmat;
-- Chạy lại install.sql
```

### Lỗi: "Foreign key constraint fails"

- Đảm bảo chạy đúng thứ tự các file SQL
- Kiểm tra dữ liệu seed có đúng định dạng

### Lỗi: "DELIMITER" not recognized

- Sử dụng MySQL client dòng lệnh
- Hoặc chia nhỏ trigger ra file riêng
