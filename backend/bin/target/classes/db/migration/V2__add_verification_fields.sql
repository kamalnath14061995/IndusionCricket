-- Add email and phone verification fields to users table
ALTER TABLE users 
ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN email_verification_pending VARCHAR(255),
ADD COLUMN phone_verification_pending VARCHAR(255);

-- Set existing users as verified (since they already registered with these details)
UPDATE users SET email_verified = TRUE, phone_verified = TRUE WHERE id > 0;