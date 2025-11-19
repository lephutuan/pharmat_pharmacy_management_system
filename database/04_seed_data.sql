USE pharmat;

-- Insert Danh Mục Mặc Định
INSERT INTO medicine_categories (name, description) VALUES
('Kháng sinh', 'Thuốc kháng sinh điều trị nhiễm khuẩn'),
('Giảm đau', 'Thuốc giảm đau và hạ sốt'),
('Vitamin', 'Bổ sung vitamin và khoáng chất')
ON DUPLICATE KEY UPDATE name=name;

-- Insert Admin User (password: password - bcrypt hashed)
INSERT INTO users (id, name, email, password, role, phone, avatar) VALUES
('U001', 'Nguyễn Văn A', 'admin@pharmat.com', '$2a$10$zdfnOwycHte6BOWDOK/8tela7Dgz0bpzkFDTaRSFC2hbGya878/Jq', 'admin', '0901234567', 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=313fb2&color=fff'),
('U002', 'Trần Thị B', 'sales@pharmat.com', '$2a$10$zdfnOwycHte6BOWDOK/8tela7Dgz0bpzkFDTaRSFC2hbGya878/Jq', 'sales_staff', '0902345678', 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=4361ee&color=fff'),
('U003', 'Lê Văn C', 'inventory@pharmat.com', '$2a$10$zdfnOwycHte6BOWDOK/8tela7Dgz0bpzkFDTaRSFC2hbGya878/Jq', 'inventory_staff', '0903456789', 'https://ui-avatars.com/api/?name=Le+Van+C&background=10b981&color=fff')
ON DUPLICATE KEY UPDATE name=name;

-- Insert Settings
INSERT INTO settings (`key`, value, description) VALUES
('pharmacy_name', 'Nhà Thuốc PharmaT', 'Tên nhà thuốc'),
('pharmacy_address', '123 Đường ABC, Quận XYZ, TP.HCM', 'Địa chỉ nhà thuốc'),
('pharmacy_phone', '0901234567', 'Số điện thoại'),
('pharmacy_email', 'info@pharmat.com', 'Email nhà thuốc')
ON DUPLICATE KEY UPDATE value=value;

-- Insert Sample Medicines
INSERT INTO medicines (id, name, description, category_id, price, quantity, expiry_date, stock_alert, barcode, manufacturer) VALUES
('M001', 'Paracetamol 500mg', 'Thuốc giảm đau, hạ sốt', 2, 15000.00, 150, '2025-12-31', 20, '8936017180001', 'Công ty ABC'),
('M002', 'Amoxicillin 500mg', 'Kháng sinh điều trị nhiễm khuẩn', 1, 45000.00, 5, '2024-12-15', 30, '8936017180002', 'Công ty XYZ'),
('M003', 'Vitamin C 1000mg', 'Bổ sung vitamin C tăng cường miễn dịch', 3, 25000.00, 200, '2025-06-30', 50, '8936017180003', 'Công ty DEF'),
('M004', 'Ibuprofen 400mg', 'Giảm đau, chống viêm', 2, 30000.00, 80, '2025-08-20', 20, '8936017180004', 'Công ty GHI'),
('M005', 'Aspirin 75mg', 'Giảm đau, chống đông máu', 2, 12000.00, 120, '2025-09-15', 30, '8936017180005', 'Công ty JKL'),
('M006', 'Vitamin D3 1000IU', 'Bổ sung vitamin D hỗ trợ xương', 3, 28000.00, 180, '2026-01-20', 40, '8936017180006', 'Công ty Sunshine'),
('M007', 'Vitamin B Complex', 'Hỗ trợ thần kinh – bổ sung vitamin nhóm B', 3, 32000.00, 150, '2025-11-15', 30, '8936017180007', 'Công ty MegaCare'),
('M008', 'Naproxen 250mg', 'Giảm đau, kháng viêm mạnh', 2, 35000.00, 90, '2025-10-10', 25, '8936017180008', 'Dược Hòa Bình'),
('M009', 'Diclofenac 50mg', 'Giảm đau – kháng viêm', 2, 27000.00, 110, '2025-12-05', 20, '8936017180009', 'Công ty MedHealth'),
('M010', 'Ciprofloxacin 500mg', 'Kháng sinh phổ rộng điều trị nhiễm khuẩn', 1, 55000.00, 60, '2026-03-12', 20, '8936017180010', 'Công ty Dược Phẩm Việt'),
('M011', 'Azithromycin 250mg', 'Kháng sinh điều trị viêm họng, viêm phổi', 1, 68000.00, 50, '2025-09-30', 20, '8936017180011', 'Công ty AstraMed'),
('M012', 'Calcium + D3', 'Bổ sung canxi cho xương chắc khỏe', 3, 45000.00, 140, '2026-05-02', 30, '8936017180012', 'Công ty NutriLife'),
('M013', 'Meloxicam 7.5mg', 'Giảm đau – kháng viêm xương khớp', 2, 33000.00, 70, '2026-02-18', 20, '8936017180013', 'Dược An Khang'),
('M014', 'Cephalexin 500mg', 'Kháng sinh nhóm Cephalosporin', 1, 42000.00, 100, '2025-08-30', 25, '8936017180014', 'PharmaTech'),
('M015', 'Vitamin E 400IU', 'Chống oxy hóa, tốt cho da và tóc', 3, 29000.00, 160, '2026-04-01', 30, '8936017180015', 'Công ty BeautyLife')
ON DUPLICATE KEY UPDATE name=name;

-- Insert Sample Members
INSERT INTO members (id, name, email, phone, level, points) VALUES
('C001', 'Nguyễn Thị Lan', 'lan.nguyen@email.com', '0901234567', 'gold', 1560),
('C002', 'Trần Văn Nam', 'nam.tran@email.com', '0902345678', 'silver', 850),
('C003', 'Lê Thị Hoa', 'hoa.le@email.com', '0903456789', 'bronze', 320),
('C004', 'Phạm Minh Tuấn', 'tuan.pham@email.com', '0904567890', 'bronze', 150)
ON DUPLICATE KEY UPDATE name=name;

-- Insert Sample Orders
INSERT INTO orders (id, customer_id, staff_id, total_amount, discount, final_amount, status, created_at) VALUES
('ORD-001', 'C001', 'U002', 75000.00, 5000.00, 70000.00, 'completed', NOW() - INTERVAL 1 DAY),
('ORD-002', 'C002', 'U002', 45000.00, 0, 45000.00, 'completed', NOW() - INTERVAL 2 HOUR),
('ORD-003', 'C003', 'U002', 35000.00, 0, 35000.00, 'completed', NOW() - INTERVAL 5 HOUR),
('ORD-004', NULL, 'U002', 20000.00, 0, 20000.00, 'completed', NOW() - INTERVAL 1 HOUR),
('ORD-005', 'C004', 'U002', 65000.00, 5000.00, 60000.00, 'completed', NOW() - INTERVAL 3 DAY),
('ORD-006', 'C002', 'U002', 90000.00, 10000.00, 80000.00, 'completed', NOW() - INTERVAL 12 HOUR),
('ORD-007', NULL, 'U002', 30000.00, 0, 30000.00, 'completed', NOW() - INTERVAL 25 MINUTE),
('ORD-008', 'C001', 'U002', 105000.00, 5000.00, 100000.00, 'completed', NOW() - INTERVAL 2 DAY),
('ORD-009', 'C003', 'U002', 45000.00, 0, 45000.00, 'completed', NOW() - INTERVAL 3 HOUR),
('ORD-010', NULL, 'U002', 15000.00, 0, 15000.00, 'completed', NOW() - INTERVAL 10 MINUTE)
ON DUPLICATE KEY UPDATE id=id;

-- Insert Sample Order Items
INSERT INTO order_items (id, order_id, medicine_id, quantity, price, subtotal) VALUES
('OI001', 'ORD-001', 'M001', 3, 15000.00, 45000.00),
('OI002', 'ORD-001', 'M003', 1, 25000.00, 25000.00),
('OI003', 'ORD-002', 'M001', 2, 15000.00, 30000.00),
('OI004', 'ORD-002', 'M004', 1, 30000.00, 30000.00),
('OI005', 'ORD-003', 'M005', 2, 12000.00, 24000.00),
('OI006', 'ORD-003', 'M003', 1, 25000.00, 25000.00),
('OI007', 'ORD-004', 'M001', 1, 15000.00, 15000.00),
  -- ORD-005
('OI008', 'ORD-005', 'M004', 1, 30000.00, 30000.00),
('OI009', 'ORD-005', 'M003', 2, 25000.00, 50000.00),

-- ORD-006
('OI010', 'ORD-006', 'M002', 1, 45000.00, 45000.00),
('OI011', 'ORD-006', 'M001', 3, 15000.00, 45000.00),

-- ORD-007
('OI012', 'ORD-007', 'M005', 2, 12000.00, 24000.00),

-- ORD-008
('OI013', 'ORD-008', 'M003', 1, 25000.00, 25000.00),
('OI014', 'ORD-008', 'M001', 4, 15000.00, 60000.00),
('OI015', 'ORD-008', 'M005', 1, 12000.00, 12000.00),

-- ORD-009
('OI016', 'ORD-009', 'M004', 1, 30000.00, 30000.00),
('OI017', 'ORD-009', 'M001', 1, 15000.00, 15000.00),

-- ORD-010
('OI018', 'ORD-010', 'M001', 1, 15000.00, 15000.00)
ON DUPLICATE KEY UPDATE id=id;

