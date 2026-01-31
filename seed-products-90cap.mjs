import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

console.log('Updating OptiBio products to 90 capsules...\n');

// Clear existing data
await db.delete(schema.subscriptions);
await db.delete(schema.orderItems);
await db.delete(schema.orders);
await db.delete(schema.cartItems);
await db.delete(schema.discountCodes);
await db.delete(schema.subscriptionPlans);
await db.delete(schema.productVariants);
await db.delete(schema.products);

console.log('✓ Cleared existing product data\n');

// Insert main product
const [product] = await db.insert(schema.products).values({
  name: 'OptiBio Ashwagandha KSM-66',
  slug: 'ashwagandha-ksm66',
  description: 'Premium full-spectrum Ashwagandha root extract standardized to 5% withanolides. Clinically studied KSM-66® formula for stress management, mental clarity, and overall wellness.',
  priceInCents: 5999, // Base price for 90 capsules
  compareAtPriceInCents: 7999,
  sku: 'OPTIBIO-ASH',
  stockQuantity: 1000,
  longDescription: `OptiBio Ashwagandha KSM-66 represents the gold standard in ashwagandha supplementation. Our formula uses only the highest-quality KSM-66® extract—the most clinically studied ashwagandha on the market with over 20 peer-reviewed studies demonstrating its efficacy.

**Why KSM-66?**
Unlike generic ashwagandha supplements that use leaf extracts or inferior processing methods, KSM-66 is made exclusively from ashwagandha roots using a proprietary extraction process that preserves the full spectrum of bioactive compounds. This "root-only" extract maintains the natural balance of withanolides found in the whole herb, delivering superior results.

**Clinical Research:**
- 44% reduction in stress and anxiety (measured by validated PSS and HAM-A scales)
- 27.9% reduction in cortisol levels
- Significant improvements in sleep quality and duration
- Enhanced cognitive function and memory
- Increased energy and physical performance

**Quality You Can Trust:**
- Third-party tested for purity and potency
- Non-GMO, Organic, Vegan, Kosher, and Halal certified
- No fillers, binders, or artificial ingredients
- Manufactured in GMP-certified facilities
- Seed-to-shelf traceability with QR code verification

**Optimal Dosage:**
Each capsule delivers 600mg of KSM-66® extract standardized to 5% withanolides (30mg withanolide A)—the exact clinical dose used in research studies.`,
  imageUrl: '/products/optibio-bottle-front.png',
  category: 'Adaptogens',
  featured: true,
  status: 'active'
});

console.log('✓ Created main product');

const productId = product.insertId;

// Insert product variants (90 capsules)
const variants = [
  {
    productId,
    name: '90 Capsules',
    sku: 'OPTIBIO-ASH-90',
    priceInCents: 5999, // $59.99
    compareAtPriceInCents: 7999, // $79.99 (25% off)
    capsuleCount: 90,
    servingsPerContainer: 90,
    servingSize: '1 capsule',
    dosageMg: 600,
    daysSupply: 90,
    stock: 1000,
    imageUrl: '/products/optibio-bottle-front.png',
    upcCode: '850123456789',
    qrCodeUrl: '/products/codes/OPTIBIO-ASH-90-qr.png'
  },
  {
    productId,
    name: '180 Capsules (2-Month Supply)',
    sku: 'OPTIBIO-ASH-180',
    priceInCents: 10999, // $109.99
    compareAtPriceInCents: 15998, // $159.98 (31% off)
    capsuleCount: 180,
    servingsPerContainer: 180,
    servingSize: '1 capsule',
    dosageMg: 600,
    daysSupply: 180,
    stock: 500,
    imageUrl: '/products/optibio-bottle-angle.png',
    upcCode: '850123456796',
    qrCodeUrl: '/products/codes/OPTIBIO-ASH-180-qr.png'
  },
  {
    productId,
    name: '270 Capsules (3-Month Supply)',
    sku: 'OPTIBIO-ASH-270',
    priceInCents: 14999, // $149.99
    compareAtPriceInCents: 23997, // $239.97 (38% off)
    capsuleCount: 270,
    servingsPerContainer: 270,
    servingSize: '1 capsule',
    dosageMg: 600,
    daysSupply: 270,
    stock: 250,
    imageUrl: '/products/optibio-bottle-lifestyle.jpg',
    upcCode: '850123456802',
    qrCodeUrl: '/products/codes/OPTIBIO-ASH-270-qr.png'
  }
];

const variantResults = await db.insert(schema.productVariants).values(variants);
console.log('✓ Created 3 product variants (90, 180, 270 capsules)');

// Insert subscription plans
const subscriptionPlans = [
  {
    productId,
    name: 'Monthly Subscription',
    intervalDays: 30,
    discountPercent: 15,
    description: 'Save 15% with monthly delivery. Cancel anytime.'
  },
  {
    productId,
    name: 'Every 2 Months',
    intervalDays: 60,
    discountPercent: 20,
    description: 'Save 20% with delivery every 2 months. Cancel anytime.'
  },
  {
    productId,
    name: 'Quarterly (Every 3 Months)',
    intervalDays: 90,
    discountPercent: 25,
    description: 'Save 25% with quarterly delivery. Cancel anytime.'
  }
];

await db.insert(schema.subscriptionPlans).values(subscriptionPlans);
console.log('✓ Created 3 subscription plans');

// Insert discount codes
const discountCodes = [
  {
    code: 'WELCOME15',
    discountType: 'percentage',
    discountValue: 15,
    description: 'Welcome offer: 15% off your first order',
    maxUsesTotal: 1000,
    usedCount: 0,
    expiresAt: new Date('2026-12-31')
  },
  {
    code: 'FOUNDER25',
    discountType: 'percentage',
    discountValue: 25,
    description: 'Founder\'s Edition: 25% off (limited to 500 uses)',
    maxUsesTotal: 500,
    usedCount: 0,
    expiresAt: new Date('2026-06-30')
  },
  {
    code: 'EARLYBIRD20',
    discountType: 'percentage',
    discountValue: 20,
    description: 'Early Adopter: 20% off',
    maxUsesTotal: 2000,
    usedCount: 0,
    expiresAt: new Date('2026-03-31')
  }
];

await db.insert(schema.discountCodes).values(discountCodes);
console.log('✓ Created 3 discount codes');

console.log('\n✅ Database seeded successfully with 90-capsule products!');
console.log('\nProduct Variants:');
console.log('- 90 Capsules: $59.99 (3-month supply)');
console.log('- 180 Capsules: $109.99 (6-month supply, 31% off)');
console.log('- 270 Capsules: $149.99 (9-month supply, 38% off)');

await connection.end();
