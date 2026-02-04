/**
 * EasyPost Shipping Integration
 * 
 * Handles shipping label generation, rate shopping, and tracking
 * for OptiBio e-commerce orders.
 */

import EasyPost from '@easypost/api';

// Initialize EasyPost client
const easypost = new EasyPost(process.env.EASYPOST_API_KEY || '');

// OptiBio warehouse/return address
const FROM_ADDRESS = {
  company: 'OptiBio Supplements',
  street1: '131 Heartland Blvd',
  street2: '',
  city: 'Edgewood',
  state: 'NY',
  zip: '11717',
  country: 'US',
  phone: '555-123-4567', // TODO: Update with actual phone
  email: 'shipping@optibio.com',
};

// Default package dimensions for supplement bottles
const DEFAULT_PARCEL = {
  length: 6, // inches
  width: 4,
  height: 4,
  weight: 8, // ounces (single bottle ~4oz, with packaging)
};

// Parcel presets for different order sizes
const PARCEL_PRESETS = {
  single: { length: 6, width: 4, height: 4, weight: 8 },
  double: { length: 8, width: 5, height: 4, weight: 14 },
  triple: { length: 8, width: 6, height: 5, weight: 20 },
  bulk: { length: 10, width: 8, height: 6, weight: 32 },
};

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface ShippingRate {
  id: string;
  carrier: string;
  service: string;
  rate: number; // in cents
  deliveryDays: number | null;
  deliveryDate: string | null;
}

export interface ShipmentResult {
  shipmentId: string;
  trackingNumber: string;
  trackingUrl: string;
  labelUrl: string;
  carrier: string;
  service: string;
  rateInCents: number;
  estimatedDeliveryDate: string | null;
}

export interface TrackingInfo {
  trackingNumber: string;
  carrier: string;
  status: string;
  statusDetail: string;
  estimatedDeliveryDate: string | null;
  trackingDetails: Array<{
    datetime: string;
    message: string;
    status: string;
    location?: string;
  }>;
}

/**
 * Verify the EasyPost API key is valid
 */
export async function verifyApiKey(): Promise<{ valid: boolean; error?: string }> {
  try {
    // Try to retrieve the API key's user info
    const user = await easypost.User.retrieveMe();
    return { valid: true };
  } catch (error: any) {
    return { 
      valid: false, 
      error: error.message || 'Invalid API key' 
    };
  }
}

/**
 * Validate a shipping address using EasyPost
 */
export async function validateAddress(address: ShippingAddress): Promise<{
  valid: boolean;
  verifiedAddress?: ShippingAddress;
  errors?: string[];
}> {
  try {
    const easypostAddress = await easypost.Address.create({
      verify: ['delivery'],
      name: `${address.firstName} ${address.lastName}`,
      street1: address.address1,
      street2: address.address2 || '',
      city: address.city,
      state: address.state,
      zip: address.zipCode,
      country: address.country || 'US',
      phone: address.phone || '',
      email: address.email || '',
    });

    if (easypostAddress.verifications?.delivery?.success) {
      return {
        valid: true,
        verifiedAddress: {
          firstName: address.firstName,
          lastName: address.lastName,
          address1: easypostAddress.street1 || address.address1,
          address2: easypostAddress.street2 || address.address2,
          city: easypostAddress.city || address.city,
          state: easypostAddress.state || address.state,
          zipCode: easypostAddress.zip || address.zipCode,
          country: easypostAddress.country || address.country,
          phone: address.phone,
          email: address.email,
        },
      };
    }

    const errors = easypostAddress.verifications?.delivery?.errors?.map(
      (e: any) => e.message
    ) || ['Address could not be verified'];

    return { valid: false, errors };
  } catch (error: any) {
    return { 
      valid: false, 
      errors: [error.message || 'Address validation failed'] 
    };
  }
}

/**
 * Get shipping rates for an order
 */
export async function getShippingRates(
  toAddress: ShippingAddress,
  itemCount: number = 1
): Promise<ShippingRate[]> {
  try {
    // Determine parcel size based on item count
    let parcel = PARCEL_PRESETS.single;
    if (itemCount === 2) parcel = PARCEL_PRESETS.double;
    else if (itemCount === 3) parcel = PARCEL_PRESETS.triple;
    else if (itemCount > 3) parcel = PARCEL_PRESETS.bulk;

    const shipment = await easypost.Shipment.create({
      from_address: FROM_ADDRESS,
      to_address: {
        name: `${toAddress.firstName} ${toAddress.lastName}`,
        street1: toAddress.address1,
        street2: toAddress.address2 || '',
        city: toAddress.city,
        state: toAddress.state,
        zip: toAddress.zipCode,
        country: toAddress.country || 'US',
        phone: toAddress.phone || '',
        email: toAddress.email || '',
      },
      parcel: parcel,
    });

    // Convert rates to our format
    const rates: ShippingRate[] = (shipment.rates || []).map((rate: any) => ({
      id: rate.id,
      carrier: rate.carrier,
      service: rate.service,
      rate: Math.round(parseFloat(rate.rate) * 100), // Convert to cents
      deliveryDays: rate.delivery_days,
      deliveryDate: rate.delivery_date,
    }));

    // Sort by price
    rates.sort((a, b) => a.rate - b.rate);

    return rates;
  } catch (error: any) {
    console.error('[Shipping] Failed to get rates:', error);
    throw new Error(`Failed to get shipping rates: ${error.message}`);
  }
}

/**
 * Create a shipment and purchase a shipping label
 */
export async function createShipment(
  toAddress: ShippingAddress,
  itemCount: number = 1,
  preferredCarrier?: string,
  preferredService?: string
): Promise<ShipmentResult> {
  try {
    // Determine parcel size based on item count
    let parcel = PARCEL_PRESETS.single;
    if (itemCount === 2) parcel = PARCEL_PRESETS.double;
    else if (itemCount === 3) parcel = PARCEL_PRESETS.triple;
    else if (itemCount > 3) parcel = PARCEL_PRESETS.bulk;

    const shipment = await easypost.Shipment.create({
      from_address: FROM_ADDRESS,
      to_address: {
        name: `${toAddress.firstName} ${toAddress.lastName}`,
        street1: toAddress.address1,
        street2: toAddress.address2 || '',
        city: toAddress.city,
        state: toAddress.state,
        zip: toAddress.zipCode,
        country: toAddress.country || 'US',
        phone: toAddress.phone || '',
        email: toAddress.email || '',
      },
      parcel: parcel,
    });

    // Find the best rate (cheapest by default, or preferred carrier/service)
    let selectedRate = shipment.rates?.[0];
    
    if (preferredCarrier && preferredService) {
      const preferred = shipment.rates?.find(
        (r: any) => r.carrier === preferredCarrier && r.service === preferredService
      );
      if (preferred) selectedRate = preferred;
    } else if (preferredCarrier) {
      const preferred = shipment.rates?.find((r: any) => r.carrier === preferredCarrier);
      if (preferred) selectedRate = preferred;
    }

    // If no rate found, get the lowest rate
    if (!selectedRate) {
      selectedRate = await shipment.lowestRate();
    }

    // Buy the label
    const purchasedShipment = await easypost.Shipment.buy(shipment.id, selectedRate);

    return {
      shipmentId: purchasedShipment.id,
      trackingNumber: purchasedShipment.tracking_code || '',
      trackingUrl: purchasedShipment.tracker?.public_url || 
                   `https://track.easypost.com/djE6dHJrXzEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNA==${purchasedShipment.tracking_code}`,
      labelUrl: purchasedShipment.postage_label?.label_url || '',
      carrier: purchasedShipment.selected_rate?.carrier || '',
      service: purchasedShipment.selected_rate?.service || '',
      rateInCents: Math.round(parseFloat(purchasedShipment.selected_rate?.rate || '0') * 100),
      estimatedDeliveryDate: purchasedShipment.selected_rate?.delivery_date || null,
    };
  } catch (error: any) {
    console.error('[Shipping] Failed to create shipment:', error);
    throw new Error(`Failed to create shipment: ${error.message}`);
  }
}

/**
 * Get tracking information for a shipment
 */
export async function getTrackingInfo(trackingNumber: string, carrier?: string): Promise<TrackingInfo> {
  try {
    const tracker = await easypost.Tracker.create({
      tracking_code: trackingNumber,
      carrier: carrier,
    });

    return {
      trackingNumber: tracker.tracking_code || trackingNumber,
      carrier: tracker.carrier || carrier || 'Unknown',
      status: tracker.status || 'unknown',
      statusDetail: tracker.status_detail || '',
      estimatedDeliveryDate: tracker.est_delivery_date || null,
      trackingDetails: (tracker.tracking_details || []).map((detail: any) => ({
        datetime: detail.datetime,
        message: detail.message,
        status: detail.status,
        location: detail.tracking_location ? 
          `${detail.tracking_location.city}, ${detail.tracking_location.state}` : undefined,
      })),
    };
  } catch (error: any) {
    console.error('[Shipping] Failed to get tracking info:', error);
    throw new Error(`Failed to get tracking info: ${error.message}`);
  }
}

/**
 * Refund a shipping label (if unused)
 */
export async function refundShipment(shipmentId: string): Promise<{ success: boolean; message: string }> {
  try {
    const refund = await easypost.Shipment.refund(shipmentId);
    return {
      success: refund.refund_status === 'submitted' || refund.refund_status === 'refunded',
      message: `Refund status: ${refund.refund_status}`,
    };
  } catch (error: any) {
    console.error('[Shipping] Failed to refund shipment:', error);
    return {
      success: false,
      message: error.message || 'Refund failed',
    };
  }
}

/**
 * Get the lowest rate for a shipment
 */
export async function getLowestRate(
  toAddress: ShippingAddress,
  itemCount: number = 1,
  carriers?: string[]
): Promise<ShippingRate | null> {
  const rates = await getShippingRates(toAddress, itemCount);
  
  if (carriers && carriers.length > 0) {
    const filteredRates = rates.filter(r => carriers.includes(r.carrier));
    return filteredRates[0] || null;
  }
  
  return rates[0] || null;
}

export default {
  verifyApiKey,
  validateAddress,
  getShippingRates,
  createShipment,
  getTrackingInfo,
  refundShipment,
  getLowestRate,
};
