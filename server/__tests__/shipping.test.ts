/**
 * Shipping Integration Tests
 * 
 * Tests for EasyPost shipping integration including:
 * - API key validation
 * - Address validation
 * - Rate shopping
 * - Packing slip generation
 */

import { describe, it, expect } from 'vitest';
import { verifyApiKey, validateAddress, getShippingRates, getLowestRate } from '../shipping';
import { generatePackingSlip, OPTIBIO_COMPANY_INFO } from '../packing-slip';

describe('EasyPost Shipping Integration', () => {
  it('should have a valid EasyPost API key configured', async () => {
    // Verify the API key is set
    expect(process.env.EASYPOST_API_KEY).toBeDefined();
    expect(process.env.EASYPOST_API_KEY).not.toBe('');
    
    // Verify the API key works by calling EasyPost
    const result = await verifyApiKey();
    
    expect(result.valid).toBe(true);
    if (!result.valid) {
      console.error('EasyPost API key validation failed:', result.error);
    }
  }, 30000);

  it('should validate a correct US address', async () => {
    const validAddress = {
      firstName: 'John',
      lastName: 'Doe',
      address1: '417 Montgomery Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94104',
      country: 'US',
    };

    const result = await validateAddress(validAddress);
    
    expect(result.valid).toBe(true);
    expect(result.verifiedAddress).toBeDefined();
  }, 30000);

  it('should get shipping rates for an address', async () => {
    const address = {
      firstName: 'John',
      lastName: 'Doe',
      address1: '417 Montgomery Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94104',
      country: 'US',
    };

    const rates = await getShippingRates(address, 1);
    
    expect(Array.isArray(rates)).toBe(true);
    // In test mode, we should get some rates back
    if (rates.length > 0) {
      expect(rates[0]).toHaveProperty('carrier');
      expect(rates[0]).toHaveProperty('service');
      expect(rates[0]).toHaveProperty('rate');
    }
  }, 30000);
});

describe('Packing Slip Generation', () => {
  it('should have company info configured', () => {
    expect(OPTIBIO_COMPANY_INFO).toBeDefined();
    expect(OPTIBIO_COMPANY_INFO.name).toBe('OptiBio Supplements');
    expect(OPTIBIO_COMPANY_INFO.email).toBeDefined();
  });

  it('should generate valid HTML packing slip', () => {
    const mockOrder = {
      id: 1,
      orderNumber: 'OPT-TEST-123',
      userId: 1,
      email: 'test@example.com',
      status: 'processing' as const,
      subtotalInCents: 4999,
      shippingInCents: 0,
      taxInCents: 400,
      discountInCents: 0,
      totalInCents: 5399,
      shippingFirstName: 'John',
      shippingLastName: 'Doe',
      shippingAddress1: '123 Test St',
      shippingAddress2: null,
      shippingCity: 'San Francisco',
      shippingState: 'CA',
      shippingZipCode: '94104',
      shippingCountry: 'US',
      shippingPhone: '555-123-4567',
      billingFirstName: 'John',
      billingLastName: 'Doe',
      billingAddress1: '123 Test St',
      billingAddress2: null,
      billingCity: 'San Francisco',
      billingState: 'CA',
      billingZipCode: '94104',
      billingCountry: 'US',
      trackingNumber: null,
      shippingCarrier: null,
      shippedAt: null,
      customerNotes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockItems = [
      {
        id: 1,
        orderId: 1,
        productId: 1,
        variantId: 1,
        productName: 'OptiBio Ashwagandha KSM-66',
        variantName: '60 Capsules',
        sku: 'OPT-ASH-60',
        quantity: 2,
        priceInCents: 2499,
        totalInCents: 4998,
        createdAt: new Date(),
      },
    ];

    const html = generatePackingSlip(mockOrder, mockItems);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('PACKING SLIP');
    expect(html).toContain('OPT-TEST-123');
    expect(html).toContain('John Doe');
    expect(html).toContain('OptiBio Ashwagandha KSM-66');
    expect(html).toContain('60 Capsules');
    expect(html).toContain('$49.99'); // subtotal
    expect(html).toContain('Fulfillment Checklist');
  });

  it('should include customer notes when present', () => {
    const mockOrder = {
      id: 1,
      orderNumber: 'OPT-TEST-456',
      userId: 1,
      email: 'test@example.com',
      status: 'processing' as const,
      subtotalInCents: 4999,
      shippingInCents: 0,
      taxInCents: 400,
      discountInCents: 0,
      totalInCents: 5399,
      shippingFirstName: 'Jane',
      shippingLastName: 'Smith',
      shippingAddress1: '456 Test Ave',
      shippingAddress2: 'Apt 2B',
      shippingCity: 'Los Angeles',
      shippingState: 'CA',
      shippingZipCode: '90001',
      shippingCountry: 'US',
      shippingPhone: null,
      billingFirstName: 'Jane',
      billingLastName: 'Smith',
      billingAddress1: '456 Test Ave',
      billingAddress2: 'Apt 2B',
      billingCity: 'Los Angeles',
      billingState: 'CA',
      billingZipCode: '90001',
      billingCountry: 'US',
      trackingNumber: null,
      shippingCarrier: null,
      shippedAt: null,
      customerNotes: 'Please leave at front door',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockItems = [
      {
        id: 1,
        orderId: 1,
        productId: 1,
        variantId: null,
        productName: 'Test Product',
        variantName: null,
        sku: null,
        quantity: 1,
        priceInCents: 4999,
        totalInCents: 4999,
        createdAt: new Date(),
      },
    ];

    const html = generatePackingSlip(mockOrder, mockItems);

    expect(html).toContain('Customer Notes');
    expect(html).toContain('Please leave at front door');
    expect(html).toContain('Apt 2B');
  });
});
