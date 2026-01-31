CREATE TABLE `presale_campaign` (
	`id` int AUTO_INCREMENT NOT NULL,
	`launch_date` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	`product_ship_date` timestamp,
	`founders_limit` int NOT NULL DEFAULT 500,
	`founders_remaining` int NOT NULL DEFAULT 500,
	`early_adopter_limit` int NOT NULL DEFAULT 2000,
	`early_adopter_remaining` int NOT NULL DEFAULT 2000,
	`founders_price` decimal(10,2) NOT NULL DEFAULT '89.00',
	`early_adopter_price` decimal(10,2) NOT NULL DEFAULT '69.00',
	`pre_launch_price` decimal(10,2) NOT NULL DEFAULT '59.00',
	`regular_price` decimal(10,2) NOT NULL DEFAULT '99.00',
	`total_reservations` int NOT NULL DEFAULT 0,
	`total_revenue` decimal(10,2) NOT NULL DEFAULT '0.00',
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `presale_campaign_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `presale_reservations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255) NOT NULL,
	`tier` enum('founders','early_adopter','pre_launch') NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`position` int NOT NULL,
	`referral_code` varchar(20),
	`referred_by` varchar(20),
	`referral_count` int NOT NULL DEFAULT 0,
	`referral_credits` decimal(10,2) NOT NULL DEFAULT '0.00',
	`stripe_payment_intent_id` varchar(255),
	`stripe_customer_id` varchar(255),
	`payment_status` enum('pending','paid','refunded') NOT NULL DEFAULT 'pending',
	`lifetime_discount` int NOT NULL,
	`founder_badge` boolean NOT NULL DEFAULT false,
	`early_access` boolean NOT NULL DEFAULT false,
	`converted_to_order` boolean NOT NULL DEFAULT false,
	`order_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `presale_reservations_id` PRIMARY KEY(`id`),
	CONSTRAINT `presale_reservations_referral_code_unique` UNIQUE(`referral_code`)
);
--> statement-breakpoint
CREATE TABLE `waitlist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`source` varchar(100),
	`notified` boolean NOT NULL DEFAULT false,
	`converted_to_reservation` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `waitlist_id` PRIMARY KEY(`id`),
	CONSTRAINT `waitlist_email_unique` UNIQUE(`email`)
);
