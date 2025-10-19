-- Insert test booking data for admin dashboard testing
INSERT INTO bookings (
    booking_type, facility_id, facility_name, booking_date, start_time, end_time, 
    price, customer_name, customer_email, customer_phone, status, payment_status, payment_id
) VALUES 
(
    'ground', '1', 'Main Ground A', '2024-01-25', '10:00:00', '11:00:00', 
    500.00, 'John Doe', 'john.doe@example.com', '+1234567890', 'CONFIRMED', 'PAID', 'PAY_123456'
),
(
    'net', '2', 'Net 1-3', '2024-01-25', '14:00:00', '15:00:00', 
    150.00, 'Jane Smith', 'jane.smith@example.com', '+1234567891', 'PENDING', 'PENDING', 'PAY_123457'
),
(
    'ground', '2', 'Practice Ground B', '2024-01-26', '18:00:00', '19:00:00', 
    350.00, 'Mike Johnson', 'mike.johnson@example.com', '+1234567892', 'CONFIRMED', 'PAID', 'PAY_123458'
),
(
    'net', '1', 'Net 4-6', '2024-01-26', '16:00:00', '17:00:00', 
    100.00, 'Sarah Wilson', 'sarah.wilson@example.com', '+1234567893', 'CANCELLED', 'REFUNDED', 'PAY_123459'
),
(
    'ground', '3', 'Youth Ground C', '2024-01-27', '09:00:00', '10:00:00', 
    300.00, 'David Brown', 'david.brown@example.com', '+1234567894', 'PENDING', 'PENDING', 'PAY_123460'
);