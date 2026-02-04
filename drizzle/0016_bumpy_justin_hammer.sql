CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`firstName` varchar(100),
	`source` varchar(100) DEFAULT 'wellness_quiz',
	`quizData` text,
	`status` enum('new','contacted','converted','unsubscribed') NOT NULL DEFAULT 'new',
	`discountCodeSent` varchar(50),
	`welcomeEmailSent` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`),
	CONSTRAINT `leads_email_unique` UNIQUE(`email`)
);
