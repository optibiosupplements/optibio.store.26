/**
 * Shipping Router
 * 
 * Handles shipping-related API endpoints including:
 * - Address validation
 * - Rate shopping
 * - Label generation
 * - Tracking
 */

import { z } from 'zod';
import { router, protectedProcedure, adminProcedure } from '../_core/trpc';
import { TRPCError } from '@trpc/server';
import * as shipping from '../shipping';
import { getOrderById, getOrderItems, getDb } from '../db';
import { orders } from '../../drizzle/schema';
import { sendEnhancedShippingNotificationEmail } from '../email';
import { generatePackingSlip } from '../packing-slip';
import { eq, desc } from 'drizzle-orm';

// Address schema for validation
const addressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
  country: z.string().default('US'),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

// Inline helper functions to avoid import caching issues
async function updateOrderShipping(
  orderId: number,
  data: {
    trackingNumber?: string;
    shippingCarrier?: string;
    status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
    shippedAt?: Date;
  }
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.update(orders)
      .set(data)
      .where(eq(orders.id, orderId));
    return true;
  } catch (error) {
    console.error("[Shipping] Failed to update order shipping:", error);
    return false;
  }
}

async function getOrdersByStatus(
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(orders)
      .where(eq(orders.status, status))
      .orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error("[Shipping] Failed to get orders by status:", error);
    return [];
  }
}

export const shippingRouter = router({
  /**
   * Validate a shipping address
   */
  validateAddress: protectedProcedure
    .input(addressSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await shipping.validateAddress(input);
        return result;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to validate address',
        });
      }
    }),

  /**
   * Get shipping rates for an address
   */
  getRates: protectedProcedure
    .input(z.object({
      address: addressSchema,
      itemCount: z.number().min(1).default(1),
    }))
    .query(async ({ input }) => {
      try {
        const rates = await shipping.getShippingRates(input.address, input.itemCount);
        return rates;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to get shipping rates',
        });
      }
    }),

  /**
   * Get the lowest shipping rate
   */
  getLowestRate: protectedProcedure
    .input(z.object({
      address: addressSchema,
      itemCount: z.number().min(1).default(1),
      carriers: z.array(z.string()).optional(),
    }))
    .query(async ({ input }) => {
      try {
        const rate = await shipping.getLowestRate(
          input.address, 
          input.itemCount,
          input.carriers
        );
        return rate;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to get lowest rate',
        });
      }
    }),

  /**
   * Create shipment and generate label (Admin only)
   */
  createShipment: adminProcedure
    .input(z.object({
      orderId: z.number(),
      preferredCarrier: z.string().optional(),
      preferredService: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Get order details
        const order = await getOrderById(input.orderId);
        if (!order) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Order not found',
          });
        }

        // Get order items to determine package size
        const items = await getOrderItems(input.orderId);
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

        // Create shipment
        const shipment = await shipping.createShipment(
          {
            firstName: order.shippingFirstName,
            lastName: order.shippingLastName,
            address1: order.shippingAddress1,
            address2: order.shippingAddress2 || undefined,
            city: order.shippingCity,
            state: order.shippingState,
            zipCode: order.shippingZipCode,
            country: order.shippingCountry,
            phone: order.shippingPhone || undefined,
            email: order.email,
          },
          totalItems,
          input.preferredCarrier,
          input.preferredService
        );

        // Update order with tracking info
        await updateOrderShipping(input.orderId, {
          trackingNumber: shipment.trackingNumber,
          shippingCarrier: shipment.carrier,
          status: 'shipped',
          shippedAt: new Date(),
        });

        // Send shipping notification email
        try {
          await sendEnhancedShippingNotificationEmail({
            customerEmail: order.email,
            customerName: `${order.shippingFirstName} ${order.shippingLastName}`,
            orderNumber: order.orderNumber,
            trackingNumber: shipment.trackingNumber,
            carrier: shipment.carrier,
            trackingUrl: shipment.trackingUrl,
            estimatedDelivery: shipment.estimatedDeliveryDate || undefined,
            items: items.map(item => ({
              productName: item.productName,
              variantName: item.variantName || undefined,
              quantity: item.quantity,
            })),
          });
        } catch (emailError) {
          console.error('[Shipping] Failed to send notification email:', emailError);
          // Don't fail the shipment creation if email fails
        }

        return {
          success: true,
          shipment,
        };
      } catch (error: any) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to create shipment',
        });
      }
    }),

  /**
   * Get tracking information for an order
   */
  getTracking: protectedProcedure
    .input(z.object({
      orderId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        // Get order
        const order = await getOrderById(input.orderId);
        if (!order) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Order not found',
          });
        }

        // Verify user owns this order (unless admin)
        if (ctx.user.role !== 'admin' && order.userId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have access to this order',
          });
        }

        // Check if order has tracking
        if (!order.trackingNumber) {
          return {
            hasTracking: false,
            message: 'Order has not been shipped yet',
          };
        }

        // Get tracking info
        const tracking = await shipping.getTrackingInfo(
          order.trackingNumber,
          order.shippingCarrier || undefined
        );

        return {
          hasTracking: true,
          tracking,
        };
      } catch (error: any) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to get tracking info',
        });
      }
    }),

  /**
   * Refund a shipping label (Admin only)
   */
  refundLabel: adminProcedure
    .input(z.object({
      shipmentId: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await shipping.refundShipment(input.shipmentId);
        return result;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to refund label',
        });
      }
    }),

  /**
   * Get all pending orders that need shipping (Admin only)
   */
  getPendingShipments: adminProcedure.query(async () => {
    try {
      const pendingOrders = await getOrdersByStatus('processing');
      return pendingOrders;
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Failed to get pending shipments',
      });
    }
  }),

  /**
   * Generate packing slip for an order (Admin only)
   */
  getPackingSlip: adminProcedure
    .input(z.object({
      orderId: z.number(),
    }))
    .query(async ({ input }) => {
      try {
        const order = await getOrderById(input.orderId);
        if (!order) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Order not found',
          });
        }

        const items = await getOrderItems(input.orderId);
        const packingSlipHtml = generatePackingSlip(order, items);

        return {
          html: packingSlipHtml,
          orderNumber: order.orderNumber,
        };
      } catch (error: any) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to generate packing slip',
        });
      }
    }),
});
