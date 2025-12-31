import { drizzle } from "drizzle-orm/mysql2";
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

// Define schemas inline to avoid TypeScript import issues
const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  longDescription: text("longDescription"),
  priceInCents: int("priceInCents").notNull(),
  compareAtPriceInCents: int("compareAtPriceInCents"),
  sku: varchar("sku", { length: 100 }).unique(),
  stockQuantity: int("stockQuantity").default(0).notNull(),
  lowStockThreshold: int("lowStockThreshold").default(10),
  imageUrl: varchar("imageUrl", { length: 500 }),
  galleryImages: text("galleryImages"),
  isActive: boolean("isActive").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  servingSize: varchar("servingSize", { length: 100 }),
  servingsPerContainer: int("servingsPerContainer"),
  ingredients: text("ingredients"),
  supplementFacts: text("supplementFacts"),
  warnings: text("warnings"),
  directions: text("directions"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

const productVariants = mysqlTable("productVariants", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 100 }).unique(),
  priceInCents: int("priceInCents").notNull(),
  compareAtPriceInCents: int("compareAtPriceInCents"),
  stockQuantity: int("stockQuantity").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

const subscriptionPlans = mysqlTable("subscriptionPlans", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  intervalType: mysqlEnum("intervalType", ["monthly", "quarterly", "annual"]).notNull(),
  intervalCount: int("intervalCount").default(1).notNull(),
  discountPercentage: int("discountPercentage").default(0),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

const discountCodes = mysqlTable("discountCodes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  discountType: mysqlEnum("discountType", ["percentage", "fixed"]).notNull(),
  discountValue: int("discountValue").notNull(),
  minPurchaseInCents: int("minPurchaseInCents").default(0),
  maxUsesTotal: int("maxUsesTotal"),
  maxUsesPerCustomer: int("maxUsesPerCustomer").default(1),
  usedCount: int("usedCount").default(0),
  isActive: boolean("isActive").default(true).notNull(),
  startsAt: timestamp("startsAt"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

const db = drizzle(process.env.DATABASE_URL);

async function seedProducts() {
  console.log("Seeding OptiBio products...");

  // Create main product
  const [product] = await db.insert(products).values({
    name: "OptiBio Ashwagandha KSM-66",
    slug: "ashwagandha-ksm-66",
    description: "Premium full-spectrum Ashwagandha root extract with clinically-studied KSM-66®. Supports stress management, restful sleep, and overall wellness.",
    longDescription: `OptiBio Ashwagandha KSM-66 is the gold standard in ashwagandha supplementation, featuring the most clinically-researched ashwagandha extract available. 

**Backed by 20+ Clinical Studies**

Our premium formula uses KSM-66®, a full-spectrum root extract that has been the subject of extensive peer-reviewed research demonstrating its effectiveness in supporting:

- Healthy stress response and stress management
- Restful sleep and sleep quality
- Physical endurance and performance
- Cognitive function and mental clarity
- Overall wellness and vitality

**The KSM-66® Difference**

Unlike inferior ashwagandha products, KSM-66® is produced using a unique, patented extraction process that preserves the natural balance of active compounds found in the ashwagandha root. This water-based extraction uses no chemical solvents, ensuring the purest, most bioavailable form of ashwagandha.

**Quality You Can Trust**

- ✓ Full-spectrum root extract (no leaves)
- ✓ Standardized withanolide content
- ✓ Third-party tested for purity and potency
- ✓ Non-GMO and gluten-free
- ✓ GMP certified manufacturing
- ✓ Made in USA

**Clinically-Studied Dosage**

Each serving provides 600mg of KSM-66® ashwagandha root extract - the same dosage used in clinical research studies showing significant benefits for stress management and overall wellness.

*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.*`,
    priceInCents: 4999, // $49.99
    compareAtPriceInCents: 8900, // $89.00
    sku: "OPTIBIO-ASH-60",
    stockQuantity: 1000,
    lowStockThreshold: 50,
    imageUrl: "/products/optibio-authentic-front-transparent.png",
    galleryImages: JSON.stringify([
      "/products/optibio-authentic-front-transparent.png",
      "/products/optibio-authentic-angle-marble.png",
      "/products/optibio-authentic-front-transparent.png"
    ]),
    isActive: true,
    isFeatured: true,
    servingSize: "2 capsules",
    servingsPerContainer: 30,
    ingredients: "KSM-66® Ashwagandha (Withania somnifera) Root Extract (600mg per serving), Vegetable Cellulose (capsule), Rice Flour, Magnesium Stearate",
    supplementFacts: JSON.stringify({
      servingSize: "2 capsules",
      servingsPerContainer: 30,
      amountPerServing: [
        { ingredient: "KSM-66® Ashwagandha Root Extract", amount: "600mg", dailyValue: "†" }
      ],
      otherIngredients: "Vegetable Cellulose (capsule), Rice Flour, Magnesium Stearate",
      footnote: "† Daily Value not established"
    }),
    warnings: "Consult your healthcare provider before use if you are pregnant, nursing, taking medication, or have a medical condition. Keep out of reach of children. Do not use if safety seal is broken or missing. Store in a cool, dry place.",
    directions: "Take 2 capsules daily with water, preferably with meals, or as directed by your healthcare professional. For best results, use consistently for at least 8-12 weeks."
  }).$returningId();

  console.log("Created product:", product);

  // Create product variants
  const variants = await db.insert(productVariants).values([
    {
      productId: product.id,
      name: "60 Capsules (30-Day Supply)",
      sku: "OPTIBIO-ASH-60",
      priceInCents: 4999,
      compareAtPriceInCents: 8900,
      stockQuantity: 1000,
      isActive: true,
      sortOrder: 1
    },
    {
      productId: product.id,
      name: "120 Capsules (60-Day Supply)",
      sku: "OPTIBIO-ASH-120",
      priceInCents: 8999, // $89.99 (10% savings)
      compareAtPriceInCents: 12999,
      stockQuantity: 500,
      isActive: true,
      sortOrder: 2
    },
    {
      productId: product.id,
      name: "180 Capsules (90-Day Supply)",
      sku: "OPTIBIO-ASH-180",
      priceInCents: 11999, // $119.99 (20% savings)
      compareAtPriceInCents: 17999,
      stockQuantity: 300,
      isActive: true,
      sortOrder: 3
    }
  ]).$returningId();

  console.log("Created variants:", variants);

  // Create subscription plans
  const plans = await db.insert(subscriptionPlans).values([
    {
      name: "Monthly Subscription",
      description: "Save 15% with monthly auto-delivery. Cancel anytime.",
      intervalType: "monthly",
      intervalCount: 1,
      discountPercentage: 15,
      isActive: true
    },
    {
      name: "Quarterly Subscription",
      description: "Save 20% with quarterly auto-delivery (every 3 months). Cancel anytime.",
      intervalType: "quarterly",
      intervalCount: 3,
      discountPercentage: 20,
      isActive: true
    },
    {
      name: "Annual Subscription",
      description: "Save 25% with annual auto-delivery. Best value! Cancel anytime.",
      intervalType: "annual",
      intervalCount: 12,
      discountPercentage: 25,
      isActive: true
    }
  ]).$returningId();

  console.log("Created subscription plans:", plans);

  // Create discount codes
  const codes = await db.insert(discountCodes).values([
    {
      code: "WELCOME15",
      description: "15% off first order for new customers",
      discountType: "percentage",
      discountValue: 15,
      minPurchaseInCents: 0,
      maxUsesPerCustomer: 1,
      isActive: true,
      expiresAt: new Date("2026-12-31")
    },
    {
      code: "SAVE25",
      description: "$25 off orders over $100",
      discountType: "fixed",
      discountValue: 2500, // $25 in cents
      minPurchaseInCents: 10000, // $100 minimum
      maxUsesPerCustomer: 1,
      isActive: true,
      expiresAt: new Date("2026-12-31")
    },
    {
      code: "FOUNDER50",
      description: "Founder's exclusive - 50% off (limited to 100 uses)",
      discountType: "percentage",
      discountValue: 50,
      minPurchaseInCents: 0,
      maxUsesTotal: 100,
      maxUsesPerCustomer: 1,
      isActive: true,
      expiresAt: new Date("2026-03-31")
    }
  ]).$returningId();

  console.log("Created discount codes:", codes);

  console.log("✅ Seeding complete!");
}

seedProducts().catch(console.error);
