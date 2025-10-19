-- Create contact_info table
CREATE TABLE contact_info (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    address VARCHAR(500),
    phone VARCHAR(20),
    email VARCHAR(100)
);

-- Insert default contact info
-- INSERT INTO contact_info (id, address, phone, email) VALUES (1, '', '', '');
