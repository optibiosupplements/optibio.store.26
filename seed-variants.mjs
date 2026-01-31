import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
// Simplified seed script without schema import

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log('🌱 Seeding product variants...');

try {
  // Insert 3 variants for Ashwagandha KSM-66
  await connection.query(`
    INSERT INTO productVariants (productId, name, sku, priceInCents, compareAtPriceInCents, stockQuantity, isActive, sortOrder)
    VALUES
      (1, '90 Capsules (1-Month Supply)', 'OPTIBIO-ASH-90', 4999, 6999, 100, true, 1),
      (1, '180 Capsules (3-Month Supply)', 'OPTIBIO-ASH-180', 12749, 14997, 100, true, 2),
      (1, '270 Capsules (6-Month Supply)', 'OPTIBIO-ASH-270', 18749, 24995, 100, true, 3)
  `);
  /*await db.insert(productVariants).values([
    {
      productId: 1,
      name: '90 Capsules (1-Month Supply)',
      sku: 'OPTIBIO-ASH-90',
      priceInCents: 4999,
      compareAtPriceInCents: 6999,
      stockQuantity: 100,
      isActive: true,
      sortOrder: 1,
    },
    {
      productId: 1,
      name: '180 Capsules (3-Month Supply)',
      sku: 'OPTIBIO-ASH-180',
      priceInCents: 12749, // $127.49 (save 15%)
      compareAtPriceInCents: 14997, // Was $149.97
      stockQuantity: 100,
      isActive: true,
      sortOrder: 2,
    },
    {
      productId: 1,
      name: '270 Capsules (6-Month Supply)',
      sku: 'OPTIBIO-ASH-270',
      priceInCents: 18749, // $187.49 (save 25%)
      compareAtPriceInCents: 24995, // Was $249.95
      stockQuantity: 100,
      isActive: true,
      sortOrder: 3,
    },
  ]);*/

  console.log('✅ Product variants seeded successfully!');
  console.log('   - 90 Capsules: $49.99 (was $69.99)');
  console.log('   - 180 Capsules: $127.49 (was $149.97, save 15%)');
  console.log('   - 270 Capsules: $187.49 (was $249.95, save 25%)');
} catch (error) {
  console.error('❌ Error seeding variants:', error);
  process.exit(1);
}

await connection.end();
console.log('🎉 Done!');
process.exit(0);
