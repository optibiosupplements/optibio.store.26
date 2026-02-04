CREATE TABLE `loyaltyAccounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`pointsBalance` int NOT NULL DEFAULT 0,
	`lifetimePoints` int NOT NULL DEFAULT 0,
	`tier` enum('bronze','silver','gold','platinum') NOT NULL DEFAULT 'bronze',
	`tierExpiresAt` timestamp,
	`referralCode` varchar(20),
	`referredBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `loyaltyAccounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `loyaltyAccounts_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `loyaltyAccounts_referralCode_unique` UNIQUE(`referralCode`)
);
--> statement-breakpoint
CREATE TABLE `loyaltyRewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`pointsCost` int NOT NULL,
	`rewardType` enum('discount_percent','discount_fixed','free_shipping','free_product','exclusive_access') NOT NULL,
	`rewardValue` int NOT NULL,
	`minTier` enum('bronze','silver','gold','platinum') DEFAULT 'bronze',
	`isActive` boolean NOT NULL DEFAULT true,
	`limitPerUser` int,
	`totalLimit` int,
	`timesRedeemed` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `loyaltyRewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `loyaltyTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`loyaltyAccountId` int NOT NULL,
	`userId` int NOT NULL,
	`type` enum('earn','redeem','expire','bonus','referral') NOT NULL,
	`points` int NOT NULL,
	`description` varchar(255) NOT NULL,
	`orderId` int,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `loyaltyTransactions_id` PRIMARY KEY(`id`)
);
