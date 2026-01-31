ALTER TABLE `subscriptions` ADD `stripeSubscriptionId` varchar(255);--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `stripeCustomerId` varchar(255);--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `stripePriceId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `founderTier` enum('founders','early_adopter','pre_launch','regular');--> statement-breakpoint
ALTER TABLE `users` ADD `lifetimeDiscountPercent` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_stripeSubscriptionId_unique` UNIQUE(`stripeSubscriptionId`);