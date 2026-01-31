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
