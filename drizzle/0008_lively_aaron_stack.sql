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
