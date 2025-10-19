-- Create hero_image table
CREATE TABLE hero_image (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    image_url VARCHAR(1000)
);

-- Insert default hero image
INSERT INTO hero_image (image_url) VALUES ('https://drive.google.com/drive/folders/12yu1Q0A8o8oylAVVc_C68UcG8iciMinx');
