-- V32 Part 3: Financial and contact information
-- Final part of V30 enhancements

-- emergency_contact
ALTER TABLE bookings ADD COLUMN emergency_contact VARCHAR(100);

-- emergency_phone
ALTER TABLE bookings ADD COLUMN emergency_phone VARCHAR(20);

-- medical_conditions
ALTER TABLE bookings ADD COLUMN medical_conditions TEXT;

-- dietary_requirements
ALTER TABLE bookings ADD COLUMN dietary_requirements TEXT;

-- special_needs
ALTER TABLE bookings ADD COLUMN special_needs TEXT;

-- preferred_language
ALTER TABLE bookings ADD COLUMN preferred_language VARCHAR(20) DEFAULT 'English';

-- communication_preference
ALTER TABLE bookings ADD COLUMN communication_preference VARCHAR(20) DEFAULT 'EMAIL';

-- notification_preference
ALTER TABLE bookings ADD COLUMN notification_preference VARCHAR(20) DEFAULT 'ALL';

-- timezone
ALTER TABLE bookings ADD COLUMN timezone VARCHAR(50) DEFAULT 'Asia/Kolkata';

-- currency
ALTER TABLE bookings ADD COLUMN currency VARCHAR(10) DEFAULT 'INR';

-- tax_rate
ALTER TABLE bookings ADD COLUMN tax_rate DECIMAL(5,2) DEFAULT 18.0;

-- tax_amount
ALTER TABLE bookings ADD COLUMN tax_amount DECIMAL(10,2) DEFAULT 0.0;

-- subtotal
ALTER TABLE bookings ADD COLUMN subtotal DECIMAL(10,2) DEFAULT 0.0;

-- grand_total
ALTER TABLE bookings ADD COLUMN grand_total DECIMAL(10,2) DEFAULT 0.0;

-- deposit_amount
ALTER TABLE bookings ADD COLUMN deposit_amount DECIMAL(10,2) DEFAULT 0.0;

-- balance_amount
ALTER TABLE bookings ADD COLUMN balance_amount DECIMAL(10,2) DEFAULT 0.0;

-- payment_due_date
ALTER TABLE bookings ADD COLUMN payment_due_date DATE;

-- cancellation_deadline
ALTER TABLE bookings ADD COLUMN cancellation_deadline TIMESTAMP;

-- modification_deadline
ALTER TABLE bookings ADD COLUMN modification_deadline TIMESTAMP;

-- confirmation_sent
ALTER TABLE bookings ADD COLUMN confirmation_sent BOOLEAN DEFAULT FALSE;

-- reminder_sent
ALTER TABLE bookings ADD COLUMN reminder_sent BOOLEAN DEFAULT FALSE;

-- feedback_requested
ALTER TABLE bookings ADD COLUMN feedback_requested BOOLEAN DEFAULT FALSE;

-- review_completed
ALTER TABLE bookings ADD COLUMN review_completed BOOLEAN DEFAULT FALSE;

-- rating
ALTER TABLE bookings ADD COLUMN rating INTEGER;

-- review
ALTER TABLE bookings ADD COLUMN review TEXT;

-- referral_source
ALTER TABLE bookings ADD COLUMN referral_source VARCHAR(50);

-- marketing_consent
ALTER TABLE bookings ADD COLUMN marketing_consent BOOLEAN DEFAULT FALSE;

-- terms_accepted
ALTER TABLE bookings ADD COLUMN terms_accepted BOOLEAN DEFAULT FALSE;

-- privacy_accepted
ALTER TABLE bookings ADD COLUMN privacy_accepted BOOLEAN DEFAULT FALSE;

-- age_verified
ALTER TABLE bookings ADD COLUMN age_verified BOOLEAN DEFAULT FALSE;

-- identity_verified
ALTER TABLE bookings ADD COLUMN identity_verified BOOLEAN DEFAULT FALSE;

-- payment_verified
ALTER TABLE bookings ADD COLUMN payment_verified BOOLEAN DEFAULT FALSE;

-- booking_confirmed
ALTER TABLE bookings ADD COLUMN booking_confirmed BOOLEAN DEFAULT FALSE;

-- booking_completed
ALTER TABLE bookings ADD COLUMN booking_completed BOOLEAN DEFAULT FALSE;

-- booking_cancelled
ALTER TABLE bookings ADD COLUMN booking_cancelled BOOLEAN DEFAULT FALSE;

-- booking_refunded
ALTER TABLE bookings ADD COLUMN booking_refunded BOOLEAN DEFAULT FALSE;

-- booking_modified
ALTER TABLE bookings ADD COLUMN booking_modified BOOLEAN DEFAULT FALSE;

-- booking_extended
ALTER TABLE bookings ADD COLUMN booking_extended BOOLEAN DEFAULT FALSE;

-- booking_shortened
ALTER TABLE bookings ADD COLUMN booking_shortened BOOLEAN DEFAULT FALSE;

-- booking_rescheduled
ALTER TABLE bookings ADD COLUMN booking_rescheduled BOOLEAN DEFAULT FALSE;

-- booking_transferred
ALTER TABLE bookings ADD COLUMN booking_transferred BOOLEAN DEFAULT FALSE;

-- booking_shared
ALTER TABLE bookings ADD COLUMN booking_shared BOOLEAN DEFAULT FALSE;

-- booking_group
ALTER TABLE bookings ADD COLUMN booking_group BOOLEAN DEFAULT FALSE;

-- booking_corporate
ALTER TABLE bookings ADD COLUMN booking_corporate BOOLEAN DEFAULT FALSE;

-- booking_event
ALTER TABLE bookings ADD COLUMN booking_event BOOLEAN DEFAULT FALSE;

-- booking_tournament
ALTER TABLE bookings ADD COLUMN booking_tournament BOOLEAN DEFAULT FALSE;

-- booking_league
ALTER TABLE bookings ADD COLUMN booking_league BOOLEAN DEFAULT FALSE;

-- booking_match
ALTER TABLE bookings ADD COLUMN booking_match BOOLEAN DEFAULT FALSE;

-- booking_practice
ALTER TABLE bookings ADD COLUMN booking_practice BOOLEAN DEFAULT FALSE;

-- booking_training
ALTER TABLE bookings ADD COLUMN booking_training BOOLEAN DEFAULT FALSE;

-- booking_coaching
ALTER TABLE bookings ADD COLUMN booking_coaching BOOLEAN DEFAULT FALSE;

-- booking_workshop
ALTER TABLE bookings ADD COLUMN booking_workshop BOOLEAN DEFAULT FALSE;

-- booking_seminar
ALTER TABLE bookings ADD COLUMN booking_seminar BOOLEAN DEFAULT FALSE;

-- booking_conference
ALTER TABLE bookings ADD COLUMN booking_conference BOOLEAN DEFAULT FALSE;

-- booking_exhibition
ALTER TABLE bookings ADD COLUMN booking_exhibition BOOLEAN DEFAULT FALSE;

-- booking_showcase
ALTER TABLE bookings ADD COLUMN booking_showcase BOOLEAN DEFAULT FALSE;

-- booking_demo
ALTER TABLE bookings ADD COLUMN booking_demo BOOLEAN DEFAULT FALSE;

-- booking_trial
ALTER TABLE bookings ADD COLUMN booking_trial BOOLEAN DEFAULT FALSE;

-- booking_introductory
ALTER TABLE bookings ADD COLUMN booking_introductory BOOLEAN DEFAULT FALSE;

-- booking_experiential
ALTER TABLE bookings ADD COLUMN booking_experiential BOOLEAN DEFAULT FALSE;

-- booking_recreational
ALTER TABLE bookings ADD COLUMN booking_recreational BOOLEAN DEFAULT FALSE;

-- booking_competitive
ALTER TABLE bookings ADD COLUMN booking_competitive BOOLEAN DEFAULT FALSE;

-- booking_social
ALTER TABLE bookings ADD COLUMN booking_social BOOLEAN DEFAULT FALSE;

-- booking_charity
ALTER TABLE bookings ADD COLUMN booking_charity BOOLEAN DEFAULT FALSE;

-- booking_fundraising
ALTER TABLE bookings ADD COLUMN booking_fundraising BOOLEAN DEFAULT FALSE;

-- booking_sponsorship
ALTER TABLE bookings ADD COLUMN booking_sponsorship BOOLEAN DEFAULT FALSE;

-- booking_promotional
ALTER TABLE bookings ADD COLUMN booking_promotional BOOLEAN DEFAULT FALSE;

-- booking_advertising
ALTER TABLE bookings ADD COLUMN booking_advertising BOOLEAN DEFAULT FALSE;

-- booking_marketing
ALTER TABLE bookings ADD COLUMN booking_marketing BOOLEAN DEFAULT FALSE;

-- booking_brand
ALTER TABLE bookings ADD COLUMN booking_brand BOOLEAN DEFAULT FALSE;

-- booking_product
ALTER TABLE bookings ADD COLUMN booking_product BOOLEAN DEFAULT FALSE;

-- booking_service
ALTER TABLE bookings ADD COLUMN booking_service BOOLEAN DEFAULT FALSE;

-- booking_solution
ALTER TABLE bookings ADD COLUMN booking_solution BOOLEAN DEFAULT FALSE;

-- booking_package
ALTER TABLE bookings ADD COLUMN booking_package BOOLEAN DEFAULT FALSE;

-- booking_bundle
ALTER TABLE bookings ADD COLUMN booking_bundle BOOLEAN DEFAULT FALSE;

-- booking_subscription
ALTER TABLE bookings ADD COLUMN booking_subscription BOOLEAN DEFAULT FALSE;

-- booking_membership
ALTER TABLE bookings ADD COLUMN booking_membership BOOLEAN DEFAULT FALSE;

-- booking_loyalty
ALTER TABLE bookings ADD COLUMN booking_loyalty BOOLEAN DEFAULT FALSE;

-- booking_rewards
ALTER TABLE bookings ADD COLUMN booking_rewards BOOLEAN DEFAULT FALSE;

-- booking_points
ALTER TABLE bookings ADD COLUMN booking_points BOOLEAN DEFAULT FALSE;

-- booking_credits
ALTER TABLE bookings ADD COLUMN booking_credits BOOLEAN DEFAULT FALSE;

-- booking_vouchers
ALTER TABLE bookings ADD COLUMN booking_vouchers BOOLEAN DEFAULT FALSE;

-- booking_coupons
ALTER TABLE bookings ADD COLUMN booking_coupons BOOLEAN DEFAULT FALSE;

-- booking_discounts
ALTER TABLE bookings ADD COLUMN booking_discounts BOOLEAN DEFAULT FALSE;

-- booking_offers
ALTER TABLE bookings ADD COLUMN booking_offers BOOLEAN DEFAULT FALSE;

-- booking_deals
ALTER TABLE bookings ADD COLUMN booking_deals BOOLEAN DEFAULT FALSE;

-- booking_promotions
ALTER TABLE bookings ADD COLUMN booking_promotions BOOLEAN DEFAULT FALSE;

-- booking_campaigns
ALTER TABLE bookings ADD COLUMN booking_campaigns BOOLEAN DEFAULT FALSE;

-- booking_contests
ALTER TABLE bookings ADD COLUMN booking_contests BOOLEAN DEFAULT FALSE;

-- booking_challenges
ALTER TABLE bookings ADD COLUMN booking_challenges BOOLEAN DEFAULT FALSE;

-- booking_games
ALTER TABLE bookings ADD COLUMN booking_games BOOLEAN DEFAULT FALSE;

-- booking_activities
ALTER TABLE bookings ADD COLUMN booking_activities BOOLEAN DEFAULT FALSE;

-- booking_experiences
ALTER TABLE bookings ADD COLUMN booking_experiences BOOLEAN DEFAULT FALSE;

-- booking_adventures
ALTER TABLE bookings ADD COLUMN booking_adventures BOOLEAN DEFAULT FALSE;

-- booking_exploration
ALTER TABLE bookings ADD COLUMN booking_exploration BOOLEAN DEFAULT FALSE;

-- booking_discovery
ALTER TABLE bookings ADD COLUMN booking_discovery BOOLEAN DEFAULT FALSE;

-- booking_learning
ALTER TABLE bookings ADD COLUMN booking_learning BOOLEAN DEFAULT FALSE;

-- booking_education
ALTER TABLE bookings ADD COLUMN booking_education BOOLEAN DEFAULT FALSE;

-- booking_development
ALTER TABLE bookings ADD COLUMN booking_development BOOLEAN DEFAULT FALSE;

-- booking_growth
ALTER TABLE bookings ADD COLUMN booking_growth BOOLEAN DEFAULT FALSE;

-- booking_improvement
ALTER TABLE bookings ADD COLUMN booking_improvement BOOLEAN DEFAULT FALSE;

-- booking_enhancement
ALTER TABLE bookings ADD COLUMN booking_enhancement BOOLEAN DEFAULT FALSE;

-- booking_enrichment
ALTER TABLE bookings ADD COLUMN booking_enrichment BOOLEAN DEFAULT FALSE;
