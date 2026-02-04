CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`userName` varchar(255),
	`userRole` varchar(50),
	`action` enum('create','update','delete','view','export','import','login','logout','password_change','role_change','refund','cancel','ship','fulfill') NOT NULL,
	`resourceType` enum('product','order','customer','discount','subscription','inventory','content','settings','user','batch') NOT NULL,
	`resourceId` int,
	`resourceName` varchar(255),
	`previousValue` text,
	`newValue` text,
	`changeDescription` text,
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blogPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`excerpt` text,
	`content` text,
	`featuredImage` varchar(500),
	`metaTitle` varchar(255),
	`metaDescription` text,
	`category` varchar(100),
	`tags` text,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`publishedAt` timestamp,
	`authorId` int,
	`authorName` varchar(255),
	`viewCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blogPosts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blogPosts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `contentPages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`metaTitle` varchar(255),
	`metaDescription` text,
	`isPublished` boolean NOT NULL DEFAULT false,
	`publishedAt` timestamp,
	`sortOrder` int DEFAULT 0,
	`createdBy` int,
	`updatedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contentPages_id` PRIMARY KEY(`id`),
	CONSTRAINT `contentPages_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `faqItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`category` varchar(100),
	`sortOrder` int DEFAULT 0,
	`isPublished` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `faqItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventoryAdjustments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`variantId` int,
	`adjustmentType` enum('received','sold','returned','damaged','lost','adjustment','transfer','count') NOT NULL,
	`quantityBefore` int NOT NULL,
	`quantityChange` int NOT NULL,
	`quantityAfter` int NOT NULL,
	`referenceType` varchar(50),
	`referenceId` int,
	`reason` text,
	`notes` text,
	`adjustedBy` int,
	`adjustedByName` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inventoryAdjustments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lowStockAlerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`variantId` int,
	`productName` varchar(255) NOT NULL,
	`currentStock` int NOT NULL,
	`threshold` int NOT NULL,
	`status` enum('active','acknowledged','resolved') NOT NULL DEFAULT 'active',
	`acknowledgedBy` int,
	`acknowledgedAt` timestamp,
	`resolvedAt` timestamp,
	`emailSentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lowStockAlerts_id` PRIMARY KEY(`id`)
);
