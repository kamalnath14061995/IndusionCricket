-- Fix contact_info table auto increment issue
-- Ensure the table has AUTO_INCREMENT properly set

-- Alter the table to ensure AUTO_INCREMENT is set
ALTER TABLE contact_info MODIFY COLUMN id BIGINT AUTO_INCREMENT;

-- Reset AUTO_INCREMENT to the next available value
SET @max_id = (SELECT IFNULL(MAX(id), 0) FROM contact_info);
SET SQL_MODE = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';
ALTER TABLE contact_info AUTO_INCREMENT = @max_id + 1;
