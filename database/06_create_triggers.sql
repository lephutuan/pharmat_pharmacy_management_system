USE pharmat;

-- Trigger: Update Medicine Stock After Inventory Record
DELIMITER //
CREATE TRIGGER IF NOT EXISTS tr_inventory_update_stock
AFTER INSERT ON inventory_records
FOR EACH ROW
BEGIN
  IF NEW.type = 'import' THEN
    UPDATE medicines 
    SET quantity = quantity + NEW.quantity 
    WHERE id = NEW.medicine_id;
  ELSE
    UPDATE medicines 
    SET quantity = GREATEST(0, quantity - NEW.quantity)
    WHERE id = NEW.medicine_id;
  END IF;
END//

-- Trigger: Update Medicine Stock After Sale
CREATE TRIGGER IF NOT EXISTS tr_sale_update_stock
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
  UPDATE medicines 
  SET quantity = GREATEST(0, quantity - NEW.quantity)
  WHERE id = NEW.medicine_id;
END//

-- Trigger: Auto-generate Alerts for Expiring Medicines
CREATE TRIGGER IF NOT EXISTS tr_check_expiry_alert
AFTER UPDATE ON medicines
FOR EACH ROW
BEGIN
  -- Check for expiring medicines (within 30 days)
  IF NEW.expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) 
     AND NEW.expiry_date > CURDATE() 
     AND NEW.quantity > 0 THEN
    INSERT INTO alerts (id, type, title, message, severity)
    VALUES (
      CONCAT('ALRT-', UNIX_TIMESTAMP(NOW()), '-', NEW.id),
      'expiry',
      CONCAT('Thuốc sắp hết hạn: ', NEW.name),
      CONCAT(NEW.name, ' sẽ hết hạn vào ', DATE_FORMAT(NEW.expiry_date, '%d/%m/%Y')),
      'high'
    );
  END IF;
  
  -- Check for low stock
  IF NEW.quantity <= NEW.stock_alert AND NEW.quantity > 0 THEN
    INSERT INTO alerts (id, type, title, message, severity)
    VALUES (
      CONCAT('ALRT-', UNIX_TIMESTAMP(NOW()), '-', NEW.id),
      'low_stock',
      CONCAT('Hàng sắp hết: ', NEW.name),
      CONCAT(NEW.name, ' còn ', NEW.quantity, ' sản phẩm trong kho'),
      'medium'
    );
  END IF;
  
  -- Check for out of stock
  IF NEW.quantity = 0 AND OLD.quantity > 0 THEN
    INSERT INTO alerts (id, type, title, message, severity)
    VALUES (
      CONCAT('ALRT-', UNIX_TIMESTAMP(NOW()), '-', NEW.id),
      'low_stock',
      CONCAT('Hết hàng: ', NEW.name),
      CONCAT(NEW.name, ' đã hết hàng'),
      'high'
    );
  END IF;
END//
DELIMITER ;

