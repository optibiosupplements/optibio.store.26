CREATE TABLE `analyticsEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(255) NOT NULL,
	`userId` int,
	`eventType` varchar(100) NOT NULL,
	`eventCategory` varchar(100) NOT NULL,
	`eventLabel` varchar(255),
	`pagePath` varchar(500) NOT NULL,
	`eventData` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analyticsEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversionFunnel` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(255) NOT NULL,
	`userId` int,
	`viewedHomepage` boolean DEFAULT false,
	`viewedProduct` boolean DEFAULT false,
	`addedToCart` boolean DEFAULT false,
	`startedCheckout` boolean DEFAULT false,
	`completedPurchase` boolean DEFAULT false,
	`homepageViewedAt` timestamp,
	`productViewedAt` timestamp,
	`addedToCartAt` timestamp,
	`checkoutStartedAt` timestamp,
	`purchaseCompletedAt` timestamp,
	`orderId` int,
	`orderValue` int,
	`source` varchar(100),
	`medium` varchar(100),
	`campaign` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `conversionFunnel_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dailyMetrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`uniqueVisitors` int DEFAULT 0,
	`totalPageViews` int DEFAULT 0,
	`totalSessions` int DEFAULT 0,
	`addToCartEvents` int DEFAULT 0,
	`checkoutStartedEvents` int DEFAULT 0,
	`purchasesCompleted` int DEFAULT 0,
	`totalRevenueInCents` int DEFAULT 0,
	`averageOrderValueInCents` int DEFAULT 0,
	`mobileViews` int DEFAULT 0,
	`tabletViews` int DEFAULT 0,
	`desktopViews` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dailyMetrics_id` PRIMARY KEY(`id`),
	CONSTRAINT `dailyMetrics_date_unique` UNIQUE(`date`)
);
--> statement-breakpoint
CREATE TABLE `pageViews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(255) NOT NULL,
	`userId` int,
	`pagePath` varchar(500) NOT NULL,
	`pageTitle` varchar(255),
	`referrer` varchar(500),
	`userAgent` text,
	`ipAddress` varchar(45),
	`countryCode` varchar(2),
	`deviceType` enum('mobile','tablet','desktop') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pageViews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trafficSources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`source` varchar(100) NOT NULL,
	`medium` varchar(100) NOT NULL,
	`campaign` varchar(255),
	`sessions` int DEFAULT 0,
	`pageViews` int DEFAULT 0,
	`users` int DEFAULT 0,
	`conversions` int DEFAULT 0,
	`revenue` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trafficSources_id` PRIMARY KEY(`id`)
);
