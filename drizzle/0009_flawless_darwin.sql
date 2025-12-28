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
