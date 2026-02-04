CREATE TABLE `processedWebhookEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` varchar(255) NOT NULL,
	`eventType` varchar(100) NOT NULL,
	`processedAt` timestamp NOT NULL DEFAULT (now()),
	`status` enum('success','failed','skipped') NOT NULL DEFAULT 'success',
	`metadata` text,
	CONSTRAINT `processedWebhookEvents_id` PRIMARY KEY(`id`),
	CONSTRAINT `processedWebhookEvents_eventId_unique` UNIQUE(`eventId`)
);
