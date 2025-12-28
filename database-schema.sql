-- OptiBio E-commerce Database Schema
-- Generated for Railway MySQL deployment
-- Compatible with MySQL 8.0+

-- ============================================
-- Core User Management
-- ============================================

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `openId` VARCHAR(64) NOT NULL UNIQUE,
  `name` TEXT,
  `email` VARCHAR(320),
  `loginMethod` VARCHAR(64),
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  `founderTier` ENUM('founders', 'early_adopter', 'pre_launch', 'regular'),
  `lifetimeDiscountPercent` INT DEFAULT 0,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_users_openid` (`openId`),
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Product Management
-- ============================================

CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT,
  `longDescription` TEXT,
  `priceInCents` INT NOT NULL,
  `compareAtPriceInCents` INT,
  `sku` VARCHAR(100) UNIQUE,
  `stockQuantity` INT NOT NULL DEFAULT 0,
  `lowStockThreshold` INT DEFAULT 10,
  `imageUrl` VARCHAR(500),
  `galleryImages` TEXT,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `isFeatured` BOOLEAN NOT NULL DEFAULT FALSE,
  `servingSize` VARCHAR(100),
  `servingsPerContainer` INT,
  `ingredients` TEXT,
  `supplementFacts` TEXT,
  `warnings` TEXT,
  `directions` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_products_slug` (`slug`),
  INDEX `idx_products_sku` (`sku`),
  INDEX `idx_products_active` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `productVariants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `productId` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `sku` VARCHAR(100) UNIQUE,
  `priceInCents` INT NOT NULL,
  `compareAtPriceInCents` INT,
  `stockQuantity` INT NOT NULL DEFAULT 0,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `sortOrder` INT DEFAULT 0,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_variants_product` (`productId`),
  INDEX `idx_variants_sku` (`sku`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `productBatches` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `productId` INT NOT NULL,
  `lotNumber` VARCHAR(100) NOT NULL UNIQUE,
  `manufactureDate` TIMESTAMP NOT NULL,
  `expiryDate` TIMESTAMP NOT NULL,
  `coaUrl` VARCHAR(500),
  `heavyMetalsTestUrl` VARCHAR(500),
  `microbialTestUrl` VARCHAR(500),
  `potencyTestUrl` VARCHAR(500),
  `testResults` TEXT,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_batches_product` (`productId`),
  INDEX `idx_batches_lot` (`lotNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Subscription Management
-- ============================================

CREATE TABLE IF NOT EXISTS `subscriptionPlans` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `intervalType` ENUM('monthly', 'quarterly', 'annual') NOT NULL,
  `intervalCount` INT NOT NULL DEFAULT 1,
  `discountPercentage` INT DEFAULT 0,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `planId` INT NOT NULL,
  `productId` INT NOT NULL,
  `variantId` INT,
  `status` ENUM('active', 'paused', 'cancelled', 'expired') NOT NULL DEFAULT 'active',
  `quantity` INT NOT NULL DEFAULT 1,
  `priceInCents` INT NOT NULL,
  `stripeSubscriptionId` VARCHAR(255) UNIQUE,
  `stripeCustomerId` VARCHAR(255),
  `stripePriceId` VARCHAR(255),
  `nextBillingDate` TIMESTAMP NOT NULL,
  `lastBillingDate` TIMESTAMP,
  `cancelledAt` TIMESTAMP,
  `pausedAt` TIMESTAMP,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_subscriptions_user` (`userId`),
  INDEX `idx_subscriptions_stripe` (`stripeSubscriptionId`),
  INDEX `idx_subscriptions_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Address Management
-- ============================================

CREATE TABLE IF NOT EXISTS `addresses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `type` ENUM('shipping', 'billing') NOT NULL,
  `firstName` VARCHAR(100) NOT NULL,
  `lastName` VARCHAR(100) NOT NULL,
  `company` VARCHAR(255),
  `address1` VARCHAR(255) NOT NULL,
  `address2` VARCHAR(255),
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `zipCode` VARCHAR(20) NOT NULL,
  `country` VARCHAR(100) NOT NULL DEFAULT 'United States',
  `phone` VARCHAR(20),
  `isDefault` BOOLEAN DEFAULT FALSE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_addresses_user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Order Management
-- ============================================

CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `orderNumber` VARCHAR(50) NOT NULL UNIQUE,
  `userId` INT,
  `email` VARCHAR(320) NOT NULL,
  `status` ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending',
  `subtotalInCents` INT NOT NULL,
  `shippingInCents` INT NOT NULL DEFAULT 0,
  `taxInCents` INT NOT NULL DEFAULT 0,
  `discountInCents` INT NOT NULL DEFAULT 0,
  `totalInCents` INT NOT NULL,
  `shippingFirstName` VARCHAR(100) NOT NULL,
  `shippingLastName` VARCHAR(100) NOT NULL,
  `shippingAddress1` VARCHAR(255) NOT NULL,
  `shippingAddress2` VARCHAR(255),
  `shippingCity` VARCHAR(100) NOT NULL,
  `shippingState` VARCHAR(100) NOT NULL,
  `shippingZipCode` VARCHAR(20) NOT NULL,
  `shippingCountry` VARCHAR(100) NOT NULL,
  `shippingPhone` VARCHAR(20),
  `billingFirstName` VARCHAR(100) NOT NULL,
  `billingLastName` VARCHAR(100) NOT NULL,
  `billingAddress1` VARCHAR(255) NOT NULL,
  `billingAddress2` VARCHAR(255),
  `billingCity` VARCHAR(100) NOT NULL,
  `billingState` VARCHAR(100) NOT NULL,
  `billingZipCode` VARCHAR(20) NOT NULL,
  `billingCountry` VARCHAR(100) NOT NULL,
  `paymentMethod` VARCHAR(50),
  `paymentStatus` ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  `transactionId` VARCHAR(255),
  `trackingNumber` VARCHAR(255),
  `shippingCarrier` VARCHAR(100),
  `customerNotes` TEXT,
  `adminNotes` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `paidAt` TIMESTAMP,
  `shippedAt` TIMESTAMP,
  `deliveredAt` TIMESTAMP,
  INDEX `idx_orders_number` (`orderNumber`),
  INDEX `idx_orders_user` (`userId`),
  INDEX `idx_orders_email` (`email`),
  INDEX `idx_orders_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `orderItems` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `orderId` INT NOT NULL,
  `productId` INT NOT NULL,
  `variantId` INT,
  `productName` VARCHAR(255) NOT NULL,
  `variantName` VARCHAR(255),
  `sku` VARCHAR(100),
  `quantity` INT NOT NULL,
  `priceInCents` INT NOT NULL,
  `totalInCents` INT NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_order_items_order` (`orderId`),
  INDEX `idx_order_items_product` (`productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Shopping Cart
-- ============================================

CREATE TABLE IF NOT EXISTS `cartItems` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT,
  `sessionId` VARCHAR(255),
  `productId` INT NOT NULL,
  `variantId` INT,
  `quantity` INT NOT NULL DEFAULT 1,
  `isSubscription` BOOLEAN DEFAULT FALSE,
  `subscriptionPlanId` INT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_cart_user` (`userId`),
  INDEX `idx_cart_session` (`sessionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Discount Codes
-- ============================================

CREATE TABLE IF NOT EXISTS `discountCodes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `description` TEXT,
  `discountType` ENUM('percentage', 'fixed') NOT NULL,
  `discountValue` INT NOT NULL,
  `minPurchaseInCents` INT DEFAULT 0,
  `maxUsesTotal` INT,
  `maxUsesPerCustomer` INT DEFAULT 1,
  `usedCount` INT DEFAULT 0,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `startsAt` TIMESTAMP,
  `expiresAt` TIMESTAMP,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_discount_code` (`code`),
  INDEX `idx_discount_active` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Pre-Sale System
-- ============================================

CREATE TABLE IF NOT EXISTS `presale_reservations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(320) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `tier` ENUM('founders', 'early_adopter', 'pre_launch') NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `position` INT NOT NULL,
  `referral_code` VARCHAR(20) UNIQUE,
  `referred_by` VARCHAR(20),
  `referral_count` INT NOT NULL DEFAULT 0,
  `referral_credits` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `stripe_payment_intent_id` VARCHAR(255),
  `stripe_customer_id` VARCHAR(255),
  `payment_status` ENUM('pending', 'paid', 'refunded') NOT NULL DEFAULT 'pending',
  `lifetime_discount` INT NOT NULL,
  `founder_badge` BOOLEAN NOT NULL DEFAULT FALSE,
  `early_access` BOOLEAN NOT NULL DEFAULT FALSE,
  `converted_to_order` BOOLEAN NOT NULL DEFAULT FALSE,
  `order_id` INT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_presale_email` (`email`),
  INDEX `idx_presale_referral` (`referral_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `presale_campaign` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `launch_date` TIMESTAMP NOT NULL,
  `end_date` TIMESTAMP NOT NULL,
  `product_ship_date` TIMESTAMP,
  `founders_limit` INT NOT NULL DEFAULT 500,
  `founders_remaining` INT NOT NULL DEFAULT 500,
  `early_adopter_limit` INT NOT NULL DEFAULT 2000,
  `early_adopter_remaining` INT NOT NULL DEFAULT 2000,
  `founders_price` DECIMAL(10, 2) NOT NULL DEFAULT 89.00,
  `early_adopter_price` DECIMAL(10, 2) NOT NULL DEFAULT 69.00,
  `pre_launch_price` DECIMAL(10, 2) NOT NULL DEFAULT 59.00,
  `regular_price` DECIMAL(10, 2) NOT NULL DEFAULT 99.00,
  `total_reservations` INT NOT NULL DEFAULT 0,
  `total_revenue` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `waitlist` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(320) NOT NULL UNIQUE,
  `name` VARCHAR(255),
  `source` VARCHAR(100),
  `notified` BOOLEAN NOT NULL DEFAULT FALSE,
  `converted_to_reservation` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_waitlist_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Initial Data (Optional)
-- ============================================

-- Create default subscription plans
INSERT INTO `subscriptionPlans` (`name`, `description`, `intervalType`, `intervalCount`, `discountPercentage`, `isActive`) VALUES
('Monthly Subscription', 'Save 15% with monthly auto-delivery', 'monthly', 1, 15, TRUE),
('Quarterly Subscription', 'Save 20% with quarterly auto-delivery', 'monthly', 3, 20, TRUE),
('Annual Subscription', 'Save 25% with annual auto-delivery', 'monthly', 12, 25, TRUE)
ON DUPLICATE KEY UPDATE `name` = `name`;

-- Create default presale campaign
INSERT INTO `presale_campaign` (
  `launch_date`,
  `end_date`,
  `founders_limit`,
  `founders_remaining`,
  `early_adopter_limit`,
  `early_adopter_remaining`,
  `is_active`
) VALUES (
  '2025-11-10 00:00:00',
  DATE_ADD('2025-11-10 00:00:00', INTERVAL 90 DAY),
  500,
  500,
  2000,
  2000,
  TRUE
)
ON DUPLICATE KEY UPDATE `id` = `id`;
