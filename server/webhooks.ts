import { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from "./stripe";
import { ENV } from "./_core/env";
import * as db from "./db";

/**
 * Stripe webhook handler for processing payment events
 * This endpoint receives events from Stripe when payments are completed
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("[Stripe Webhook] Missing stripe-signature header");
    return res.status(400).send("Missing stripe-signature header");
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      ENV.stripeWebhookSecret
    );
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("[Stripe Webhook] Received event:", event.type);

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[Stripe Webhook] PaymentIntent succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error("[Stripe Webhook] PaymentIntent failed:", paymentIntent.id);
        break;
      }

      default:
        console.log("[Stripe Webhook] Unhandled event type:", event.type);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error("[Stripe Webhook] Error processing event:", error);
    res.status(500).send(`Webhook Error: ${error.message}`);
  }
}

/**
 * Handle completed checkout session
 * Create order in database with payment details
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log("[Stripe Webhook] Processing checkout session:", session.id);

  try {
    // Extract customer and order information
    const userId = session.metadata?.user_id ? parseInt(session.metadata.user_id) : null;
    const customerEmail = session.customer_email || session.metadata?.customer_email || "";
    const customerName = session.metadata?.customer_name || "";

    if (!userId) {
      console.error("[Stripe Webhook] Missing user_id in session metadata");
      return;
    }

    // Retrieve line items from the session
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    });

    // Get shipping details (need to retrieve full session with expanded data)
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['customer', 'line_items'],
    });

    const shippingDetails = (fullSession as any).shipping_details;
    const customerDetails = (fullSession as any).customer_details;

    if (!shippingDetails || !shippingDetails.address) {
      console.error("[Stripe Webhook] Missing shipping details");
      return;
    }

    // Calculate totals (Stripe amounts are in cents)
    const subtotalInCents = session.amount_subtotal || 0;
    const shippingInCents = session.total_details?.amount_shipping || 0;
    const taxInCents = session.total_details?.amount_tax || 0;
    const discountInCents = session.total_details?.amount_discount || 0;
    const totalInCents = session.amount_total || 0;

    // Generate unique order number
    const orderNumber = `OPT-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Create order in database
    const orderResult = await db.createOrder({
      orderNumber,
      userId,
      email: customerEmail,
      subtotalInCents,
      shippingInCents,
      taxInCents,
      discountInCents,
      totalInCents,
      shippingFirstName: shippingDetails.name?.split(" ")[0] || customerName.split(" ")[0] || "",
      shippingLastName: shippingDetails.name?.split(" ").slice(1).join(" ") || customerName.split(" ").slice(1).join(" ") || "",
      shippingAddress1: shippingDetails.address.line1 || "",
      shippingAddress2: shippingDetails.address.line2 || null,
      shippingCity: shippingDetails.address.city || "",
      shippingState: shippingDetails.address.state || "",
      shippingZipCode: shippingDetails.address.postal_code || "",
      shippingCountry: shippingDetails.address.country || "US",
      shippingPhone: customerDetails?.phone || null,
      // Use shipping as billing for now (Stripe doesn't collect separate billing by default)
      billingFirstName: shippingDetails.name?.split(" ")[0] || customerName.split(" ")[0] || "",
      billingLastName: shippingDetails.name?.split(" ").slice(1).join(" ") || customerName.split(" ").slice(1).join(" ") || "",
      billingAddress1: shippingDetails.address.line1 || "",
      billingAddress2: shippingDetails.address.line2 || null,
      billingCity: shippingDetails.address.city || "",
      billingState: shippingDetails.address.state || "",
      billingZipCode: shippingDetails.address.postal_code || "",
      billingCountry: shippingDetails.address.country || "US",
    });

    const orderId = (orderResult as any).insertId;

    // Create order items from line items
    const orderItemsData = lineItems.data.map((item) => {
      const product = item.price?.product as Stripe.Product | undefined;
      return {
        orderId,
        productId: 1, // Default to first product (we only have one product for now)
        variantId: null,
        productName: item.description || product?.name || "OptiBio Ashwagandha KSM-66",
        variantName: null,
        sku: product?.metadata?.sku || null,
        quantity: item.quantity || 1,
        priceInCents: item.price?.unit_amount || 0,
        totalInCents: (item.price?.unit_amount || 0) * (item.quantity || 1),
      };
    });

    await db.createOrderItems(orderItemsData);

    console.log("[Stripe Webhook] Order created successfully:", orderNumber, "Order ID:", orderId);

    // Clear user's cart after successful order
    await db.clearCart(userId);
    console.log("[Stripe Webhook] Cart cleared for user:", userId);

  } catch (error: any) {
    console.error("[Stripe Webhook] Error creating order:", error);
    throw error;
  }
}
