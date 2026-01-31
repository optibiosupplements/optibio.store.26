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
