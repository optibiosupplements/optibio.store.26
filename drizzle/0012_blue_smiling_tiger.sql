CREATE TABLE `abandonedCarts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`sessionId` varchar(255),
	`email` varchar(320),
	`cartData` text NOT NULL,
	`totalValue` int NOT NULL,
	`recoveryToken` varchar(100),
	`firstEmailSentAt` timestamp,
	`secondEmailSentAt` timestamp,
	`thirdEmailSentAt` timestamp,
	`isRecovered` boolean DEFAULT false,
	`recoveredAt` timestamp,
	`recoveredOrderId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `abandonedCarts_id` PRIMARY KEY(`id`),
	CONSTRAINT `abandonedCarts_recoveryToken_unique` UNIQUE(`recoveryToken`)
);
--> statement-breakpoint
CREATE TABLE `addresses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('shipping','billing') NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`company` varchar(255),
	`address1` varchar(255) NOT NULL,
	`address2` varchar(255),
	`city` varchar(100) NOT NULL,
	`state` varchar(100) NOT NULL,
	`zipCode` varchar(20) NOT NULL,
	`country` varchar(100) NOT NULL DEFAULT 'United States',
	`phone` varchar(20),
	`isDefault` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cartItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`sessionId` varchar(255),
	`productId` int NOT NULL,
	`variantId` int,
	`quantity` int NOT NULL DEFAULT 1,
	`isSubscription` boolean DEFAULT false,
	`subscriptionPlanId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cartItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `discountCodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`description` text,
	`discountType` enum('percentage','fixed') NOT NULL,
	`discountValue` int NOT NULL,
	`minPurchaseInCents` int DEFAULT 0,
	`maxUsesTotal` int,
	`maxUsesPerCustomer` int DEFAULT 1,
	`usedCount` int DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`startsAt` timestamp,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `discountCodes_id` PRIMARY KEY(`id`),
	CONSTRAINT `discountCodes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `newsletterSubscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`discountCode` varchar(50) NOT NULL,
	`discountPercent` int NOT NULL DEFAULT 10,
	`isUsed` boolean DEFAULT false,
	`usedAt` timestamp,
	`subscribedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsletterSubscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletterSubscribers_email_unique` UNIQUE(`email`),
	CONSTRAINT `newsletterSubscribers_discountCode_unique` UNIQUE(`discountCode`)
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`variantId` int,
	`productName` varchar(255) NOT NULL,
	`variantName` varchar(255),
	`sku` varchar(100),
	`quantity` int NOT NULL,
	`priceInCents` int NOT NULL,
	`totalInCents` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(50) NOT NULL,
	`userId` int,
	`email` varchar(320) NOT NULL,
	`status` enum('pending','processing','shipped','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending',
	`subtotalInCents` int NOT NULL,
	`shippingInCents` int NOT NULL DEFAULT 0,
	`taxInCents` int NOT NULL DEFAULT 0,
	`discountInCents` int NOT NULL DEFAULT 0,
	`totalInCents` int NOT NULL,
	`shippingFirstName` varchar(100) NOT NULL,
	`shippingLastName` varchar(100) NOT NULL,
	`shippingAddress1` varchar(255) NOT NULL,
	`shippingAddress2` varchar(255),
	`shippingCity` varchar(100) NOT NULL,
	`shippingState` varchar(100) NOT NULL,
	`shippingZipCode` varchar(20) NOT NULL,
	`shippingCountry` varchar(100) NOT NULL,
	`shippingPhone` varchar(20),
	`billingFirstName` varchar(100) NOT NULL,
	`billingLastName` varchar(100) NOT NULL,
	`billingAddress1` varchar(255) NOT NULL,
	`billingAddress2` varchar(255),
	`billingCity` varchar(100) NOT NULL,
	`billingState` varchar(100) NOT NULL,
	`billingZipCode` varchar(20) NOT NULL,
	`billingCountry` varchar(100) NOT NULL,
	`paymentMethod` varchar(50),
	`paymentStatus` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
	`transactionId` varchar(255),
	`trackingNumber` varchar(255),
	`shippingCarrier` varchar(100),
	`customerNotes` text,
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`paidAt` timestamp,
	`shippedAt` timestamp,
	`deliveredAt` timestamp,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `postPurchaseEmails` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`userId` int,
	`email` varchar(320) NOT NULL,
	`productId` int NOT NULL,
	`purchaseDate` timestamp NOT NULL,
	`day7EmailSentAt` timestamp,
	`day21EmailSentAt` timestamp,
	`day60EmailSentAt` timestamp,
	`day90EmailSentAt` timestamp,
	`hasReordered` boolean DEFAULT false,
	`reorderDate` timestamp,
	`reorderOrderId` int,
	`hasSubscribed` boolean DEFAULT false,
	`subscribedAt` timestamp,
	`hasReviewed` boolean DEFAULT false,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `postPurchaseEmails_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productBatches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`lotNumber` varchar(100) NOT NULL,
	`manufactureDate` timestamp NOT NULL,
	`expiryDate` timestamp NOT NULL,
	`coaUrl` varchar(500),
	`heavyMetalsTestUrl` varchar(500),
	`microbialTestUrl` varchar(500),
	`potencyTestUrl` varchar(500),
	`testResults` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productBatches_id` PRIMARY KEY(`id`),
	CONSTRAINT `productBatches_lotNumber_unique` UNIQUE(`lotNumber`)
);
--> statement-breakpoint
CREATE TABLE `productVariants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`sku` varchar(100),
	`priceInCents` int NOT NULL,
	`compareAtPriceInCents` int,
	`stockQuantity` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int DEFAULT 0,
	`stripePriceId` varchar(255),
	`stripeSubscriptionPriceId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productVariants_id` PRIMARY KEY(`id`),
	CONSTRAINT `productVariants_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`longDescription` text,
	`priceInCents` int NOT NULL,
	`compareAtPriceInCents` int,
	`sku` varchar(100),
	`stockQuantity` int NOT NULL DEFAULT 0,
	`lowStockThreshold` int DEFAULT 10,
	`imageUrl` varchar(500),
	`galleryImages` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`servingSize` varchar(100),
	`servingsPerContainer` int,
	`ingredients` text,
	`supplementFacts` text,
	`warnings` text,
	`directions` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `products_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `referralCredits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` int NOT NULL,
	`source` varchar(100) NOT NULL,
	`referralId` int,
	`isUsed` boolean DEFAULT false,
	`usedAt` timestamp,
	`orderId` int,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `referralCredits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrerId` int NOT NULL,
	`referralCode` varchar(50) NOT NULL,
	`referredUserId` int,
	`referredEmail` varchar(320),
	`status` enum('pending','completed','credited') NOT NULL DEFAULT 'pending',
	`orderValue` int,
	`creditAmount` int DEFAULT 1000,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`creditedAt` timestamp,
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`),
	CONSTRAINT `referrals_referralCode_unique` UNIQUE(`referralCode`)
);
--> statement-breakpoint
CREATE TABLE `reviewPhotos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reviewId` int NOT NULL,
	`photoUrl` varchar(500) NOT NULL,
	`photoKey` varchar(500) NOT NULL,
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviewPhotos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviewVotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reviewId` int NOT NULL,
	`userId` int NOT NULL,
	`voteType` enum('helpful','not_helpful') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviewVotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`userId` int NOT NULL,
	`orderId` int,
	`rating` int NOT NULL,
	`title` varchar(255),
	`comment` text,
	`isVerifiedPurchase` boolean DEFAULT false,
	`isApproved` boolean DEFAULT true,
	`helpfulCount` int DEFAULT 0,
	`notHelpfulCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptionPlans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`intervalType` enum('monthly','quarterly','annual') NOT NULL,
	`intervalCount` int NOT NULL DEFAULT 1,
	`discountPercentage` int DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptionPlans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`planId` int NOT NULL,
	`productId` int NOT NULL,
	`variantId` int,
	`status` enum('active','paused','cancelled','expired') NOT NULL DEFAULT 'active',
	`quantity` int NOT NULL DEFAULT 1,
	`priceInCents` int NOT NULL,
	`stripeSubscriptionId` varchar(255),
	`stripeCustomerId` varchar(255),
	`stripePriceId` varchar(255),
	`nextBillingDate` timestamp NOT NULL,
	`lastBillingDate` timestamp,
	`cancelledAt` timestamp,
	`pausedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscriptions_stripeSubscriptionId_unique` UNIQUE(`stripeSubscriptionId`)
);
--> statement-breakpoint
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
--> statement-breakpoint
ALTER TABLE `users` ADD `founderTier` enum('founders','early_adopter','pre_launch','regular');--> statement-breakpoint
ALTER TABLE `users` ADD `lifetimeDiscountPercent` int DEFAULT 0;