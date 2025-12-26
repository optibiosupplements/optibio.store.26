/**
 * Setup Stripe Products and Prices
 * 
 * This script creates the OptiBio products and prices in Stripe
 * Run with: node setup-stripe-products.mjs
 */

import Stripe from 'stripe';

// Load Stripe with secret key from environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function setupProducts() {
  console.log('🚀 Setting up Stripe products and prices...\n');

  try {
    // Product 1: 90 Capsules (1-Month Supply)
    console.log('Creating Product 1: Ashwagandha KSM-66 (90 Capsules)...');
    const product1 = await stripe.products.create({
      name: 'OptiBio Ashwagandha KSM-66 - 90 Capsules',
      description: 'Premium full-spectrum Ashwagandha root extract with clinically-studied KSM-66®. 1-month supply (90 capsules, 300mg each). Supports stress management, restful sleep, and overall wellness.',
      images: ['https://optibiosupplements.com/products/optibio-90cap-bottle-front.jpg'],
      metadata: {
        sku: 'OPTIBIO-ASH-90',
        capsules: '90',
        supply: '1-month',
        servings: '45',
      },
    });
    console.log(`✅ Product created: ${product1.id}`);

    // Create one-time price for Product 1
    const price1OneTime = await stripe.prices.create({
      product: product1.id,
      unit_amount: 4999, // $49.99
      currency: 'usd',
      metadata: {
        type: 'one_time',
      },
    });
    console.log(`✅ One-time price: ${price1OneTime.id} - $49.99`);

    // Create subscription price for Product 1
    const price1Subscription = await stripe.prices.create({
      product: product1.id,
      unit_amount: 4249, // $42.49 (15% off)
      currency: 'usd',
      recurring: {
        interval: 'month',
        interval_count: 1,
      },
      metadata: {
        type: 'subscription',
        discount: '15%',
      },
    });
    console.log(`✅ Subscription price: ${price1Subscription.id} - $42.49/month\n`);

    // Product 2: 180 Capsules (3-Month Supply)
    console.log('Creating Product 2: Ashwagandha KSM-66 (180 Capsules)...');
    const product2 = await stripe.products.create({
      name: 'OptiBio Ashwagandha KSM-66 - 180 Capsules',
      description: 'Premium full-spectrum Ashwagandha root extract with clinically-studied KSM-66®. 3-month supply (180 capsules, 300mg each). Supports stress management, restful sleep, and overall wellness. Save 15% vs 1-month.',
      images: ['https://optibiosupplements.com/products/optibio-90cap-bottle-front.jpg'],
      metadata: {
        sku: 'OPTIBIO-ASH-180',
        capsules: '180',
        supply: '3-month',
        servings: '90',
      },
    });
    console.log(`✅ Product created: ${product2.id}`);

    // Create one-time price for Product 2
    const price2OneTime = await stripe.prices.create({
      product: product2.id,
      unit_amount: 12749, // $127.49
      currency: 'usd',
      metadata: {
        type: 'one_time',
      },
    });
    console.log(`✅ One-time price: ${price2OneTime.id} - $127.49`);

    // Create subscription price for Product 2
    const price2Subscription = await stripe.prices.create({
      product: product2.id,
      unit_amount: 10837, // $108.37 (15% off)
      currency: 'usd',
      recurring: {
        interval: 'month',
        interval_count: 1,
      },
      metadata: {
        type: 'subscription',
        discount: '15%',
      },
    });
    console.log(`✅ Subscription price: ${price2Subscription.id} - $108.37/month\n`);

    // Product 3: 270 Capsules (6-Month Supply)
    console.log('Creating Product 3: Ashwagandha KSM-66 (270 Capsules)...');
    const product3 = await stripe.products.create({
      name: 'OptiBio Ashwagandha KSM-66 - 270 Capsules',
      description: 'Premium full-spectrum Ashwagandha root extract with clinically-studied KSM-66®. 6-month supply (270 capsules, 300mg each). Supports stress management, restful sleep, and overall wellness. Save 25% vs 1-month.',
      images: ['https://optibiosupplements.com/products/optibio-90cap-bottle-front.jpg'],
      metadata: {
        sku: 'OPTIBIO-ASH-270',
        capsules: '270',
        supply: '6-month',
        servings: '135',
      },
    });
    console.log(`✅ Product created: ${product3.id}`);

    // Create one-time price for Product 3
    const price3OneTime = await stripe.prices.create({
      product: product3.id,
      unit_amount: 18749, // $187.49
      currency: 'usd',
      metadata: {
        type: 'one_time',
      },
    });
    console.log(`✅ One-time price: ${price3OneTime.id} - $187.49`);

    // Create subscription price for Product 3
    const price3Subscription = await stripe.prices.create({
      product: product3.id,
      unit_amount: 15937, // $159.37 (15% off)
      currency: 'usd',
      recurring: {
        interval: 'month',
        interval_count: 1,
      },
      metadata: {
        type: 'subscription',
        discount: '15%',
      },
    });
    console.log(`✅ Subscription price: ${price3Subscription.id} - $159.37/month\n`);

    // Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎉 All products and prices created successfully!\n');
    console.log('Product 1 (90 Capsules):');
    console.log(`  Product ID: ${product1.id}`);
    console.log(`  One-time Price ID: ${price1OneTime.id}`);
    console.log(`  Subscription Price ID: ${price1Subscription.id}\n`);
    console.log('Product 2 (180 Capsules):');
    console.log(`  Product ID: ${product2.id}`);
    console.log(`  One-time Price ID: ${price2OneTime.id}`);
    console.log(`  Subscription Price ID: ${price2Subscription.id}\n`);
    console.log('Product 3 (270 Capsules):');
    console.log(`  Product ID: ${product3.id}`);
    console.log(`  One-time Price ID: ${price3OneTime.id}`);
    console.log(`  Subscription Price ID: ${price3Subscription.id}\n`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n📝 Next Steps:');
    console.log('1. Update your database with these Stripe price IDs');
    console.log('2. Configure webhook endpoint in Stripe dashboard');
    console.log('3. Test checkout flow with test card: 4242 4242 4242 4242');
    console.log('4. Verify orders are created in database');
    console.log('\n✨ Your store is ready to accept payments!');

  } catch (error) {
    console.error('❌ Error setting up products:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.error('\n⚠️  Authentication failed. Please check your STRIPE_SECRET_KEY environment variable.');
    }
    process.exit(1);
  }
}

// Run the setup
setupProducts();
