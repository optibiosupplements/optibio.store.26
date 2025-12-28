import { drizzle } from "drizzle-orm/mysql2";
import { int, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

// Define schema inline
const productBatches = mysqlTable("productBatches", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  lotNumber: varchar("lotNumber", { length: 100 }).notNull().unique(),
  manufactureDate: timestamp("manufactureDate").notNull(),
  expiryDate: timestamp("expiryDate").notNull(),
  coaUrl: varchar("coaUrl", { length: 500 }),
  heavyMetalsTestUrl: varchar("heavyMetalsTestUrl", { length: 500 }),
  microbialTestUrl: varchar("microbialTestUrl", { length: 500 }),
  potencyTestUrl: varchar("potencyTestUrl", { length: 500 }),
  testResults: text("testResults"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

const db = drizzle(process.env.DATABASE_URL);

async function seedBatches() {
  console.log("Seeding product batches...");

  const batches = [
    {
      productId: 1, // OptiBio Ashwagandha KSM-66
      lotNumber: "ASH-2024-11-001",
      manufactureDate: new Date("2024-11-01"),
      expiryDate: new Date("2026-11-01"),
      coaUrl: "/supplement-facts.png",
      heavyMetalsTestUrl: "/heavy-metals-test.pdf",
      microbialTestUrl: "/microbial-test.pdf",
      potencyTestUrl: "/potency-test.pdf",
      testResults: JSON.stringify({
        withanolides: "5.2%",
        heavyMetals: {
          lead: "< 0.5 ppm",
          arsenic: "< 0.2 ppm",
          cadmium: "< 0.1 ppm",
          mercury: "< 0.05 ppm"
        },
        microbial: {
          totalPlateCount: "< 1,000 CFU/g",
          yeastMold: "< 100 CFU/g",
          ecoli: "Negative",
          salmonella: "Negative"
        },
        purity: "99.8%"
      }),
      isActive: true
    },
    {
      productId: 1,
      lotNumber: "ASH-2024-10-015",
      manufactureDate: new Date("2024-10-15"),
      expiryDate: new Date("2026-10-15"),
      coaUrl: "/supplement-facts.png",
      heavyMetalsTestUrl: "/heavy-metals-test.pdf",
      microbialTestUrl: "/microbial-test.pdf",
      potencyTestUrl: "/potency-test.pdf",
      testResults: JSON.stringify({
        withanolides: "5.1%",
        heavyMetals: {
          lead: "< 0.5 ppm",
          arsenic: "< 0.2 ppm",
          cadmium: "< 0.1 ppm",
          mercury: "< 0.05 ppm"
        },
        microbial: {
          totalPlateCount: "< 1,000 CFU/g",
          yeastMold: "< 100 CFU/g",
          ecoli: "Negative",
          salmonella: "Negative"
        },
        purity: "99.7%"
      }),
      isActive: true
    },
    {
      productId: 1,
      lotNumber: "ASH-2024-09-028",
      manufactureDate: new Date("2024-09-28"),
      expiryDate: new Date("2026-09-28"),
      coaUrl: "/supplement-facts.png",
      heavyMetalsTestUrl: "/heavy-metals-test.pdf",
      microbialTestUrl: "/microbial-test.pdf",
      potencyTestUrl: "/potency-test.pdf",
      testResults: JSON.stringify({
        withanolides: "5.3%",
        heavyMetals: {
          lead: "< 0.5 ppm",
          arsenic: "< 0.2 ppm",
          cadmium: "< 0.1 ppm",
          mercury: "< 0.05 ppm"
        },
        microbial: {
          totalPlateCount: "< 1,000 CFU/g",
          yeastMold: "< 100 CFU/g",
          ecoli: "Negative",
          salmonella: "Negative"
        },
        purity: "99.9%"
      }),
      isActive: true
    }
  ];

  for (const batch of batches) {
    try {
      await db.insert(productBatches).values(batch);
      console.log(`✓ Created batch: ${batch.lotNumber}`);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⊘ Batch ${batch.lotNumber} already exists, skipping...`);
      } else {
        console.error(`✗ Error creating batch ${batch.lotNumber}:`, error.message);
      }
    }
  }

  console.log("✅ Batch seeding complete!");
}

seedBatches().catch(console.error);
