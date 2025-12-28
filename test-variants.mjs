import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function testVariants() {
  console.log('🧪 Testing Product Variants...\n');
  
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    // Get product
    const [products] = await connection.query(
      'SELECT * FROM products WHERE slug = ?',
      ['ashwagandha-ksm-66']
    );
    
    if (products.length === 0) {
      console.log('❌ Product not found');
      return;
    }
    
    const product = products[0];
    console.log('✅ Product found:', product.name);
    console.log('   Product ID:', product.id);
    console.log('');
    
    // Get variants
    const [variants] = await connection.query(
      'SELECT * FROM productVariants WHERE productId = ? AND isActive = true ORDER BY sortOrder',
      [product.id]
    );
    
    console.log(`📦 Found ${variants.length} variants:\n`);
    
    variants.forEach((variant, index) => {
      console.log(`${index + 1}. ${variant.name}`);
      console.log(`   SKU: ${variant.sku}`);
      console.log(`   Price: $${(variant.priceInCents / 100).toFixed(2)}`);
      console.log(`   Compare At: $${(variant.compareAtPriceInCents / 100).toFixed(2)}`);
      console.log(`   Stock: ${variant.stockQuantity}`);
      console.log(`   Active: ${variant.isActive}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

testVariants();
