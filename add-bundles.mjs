import { drizzle } from 'drizzle-orm/mysql2';
import { products, productVariants } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL);

async function addBundles() {
  console.log('Adding 3-month and 6-month bundle variants...');
  
  // Get the main Ashwagandha product
  const [product] = await db.select().from(products).where(eq(products.slug, 'ashwagandha-ksm-66')).limit(1);
  
  if (!product) {
    console.error('Product not found!');
    return;
  }
  
  console.log('Found product:', product.name);
  
  // Add 3-Month Bundle (180 capsules)
  const threeMonthBundle = await db.insert(productVariants).values({
    productId: product.id,
    name: '3-Month Supply (180 Capsules)',
    sku: 'OPTIBIO-ASH-180',
    priceInCents: 12700, // $127
    compareAtPriceInCents: 14997, // $149.97 (3 x $49.99)
    inventory: 500,
    isActive: true,
    sortOrder: 2,
  });
  
  console.log('✅ Added 3-Month Bundle');
  
  // Add 6-Month Bundle (360 capsules) 
  const sixMonthBundle = await db.insert(productVariants).values({
    productId: product.id,
    name: '6-Month Supply (360 Capsules)',
    sku: 'OPTIBIO-ASH-360',
    priceInCents: 23999, // $239.99
    compareAtPriceInCents: 29994, // $299.94 (6 x $49.99)
    inventory: 300,
    isActive: true,
    sortOrder: 3,
  });
  
  console.log('✅ Added 6-Month Bundle');
  console.log('Done! Bundles added successfully.');
}

addBundles().catch(console.error);
