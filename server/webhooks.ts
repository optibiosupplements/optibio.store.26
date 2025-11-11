import { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from "./stripe";
import { ENV } from "./_core/env";
import * as db from "./db";
import { sendOrderConfirmationEmail, sendSubscriptionWelcomeEmail } from "./email";
import { getSubscriptionWelcomeEmail } from "./email-templates";

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

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
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

    // Send order confirmation email
    const emailSent = await sendOrderConfirmationEmail({
      orderNumber,
      customerEmail,
      customerName: shippingDetails.name || customerName,
      items: orderItemsData.map(item => ({
        productName: item.productName,
        variantName: item.variantName || undefined,
        quantity: item.quantity,
        priceInCents: item.priceInCents,
      })),
      subtotalInCents,
      shippingInCents,
      taxInCents,
      totalInCents,
      shippingAddress: {
        name: shippingDetails.name || customerName,
        address1: shippingDetails.address.line1 || "",
        address2: shippingDetails.address.line2 || undefined,
        city: shippingDetails.address.city || "",
        state: shippingDetails.address.state || "",
        zipCode: shippingDetails.address.postal_code || "",
        country: shippingDetails.address.country || "US",
      },
    });

    if (emailSent) {
      console.log("[Stripe Webhook] Order confirmation email sent successfully");
    } else {
      console.error("[Stripe Webhook] Failed to send order confirmation email");
    }

  } catch (error: any) {
    console.error("[Stripe Webhook] Error creating order:", error);
    throw error;
  }
}

/**
 * Handle successful subscription invoice payment
 * This creates an order for the subscription renewal
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("[Stripe Webhook] Processing invoice payment:", invoice.id);

  try {
    // Check if this is a subscription invoice
    const invoiceData = invoice as any;
    const subscriptionId = typeof invoiceData.subscription === 'string' ? invoiceData.subscription : invoiceData.subscription?.id;
    if (!subscriptionId) {
      console.log("[Stripe Webhook] Invoice is not for a subscription, skipping");
      return;
    }

    // Get subscription from database
    const subscription = await db.getSubscriptionByStripeId(subscriptionId);
    if (!subscription) {
      console.error("[Stripe Webhook] Subscription not found:", subscriptionId);
      return;
    }

    // Get user info
    const user = await db.getUserById(subscription.userId);
    if (!user) {
      console.error("[Stripe Webhook] User not found:", subscription.userId);
      return;
    }

    // Handle the first invoice (send welcome email)
    if (invoice.billing_reason === "subscription_create") {
      console.log("[Stripe Webhook] Processing initial subscription payment");
      
      // Send subscription welcome email
      const emailData = getSubscriptionWelcomeEmail({
        name: user.name || "",
        email: user.email || "",
        founderTier: (user as any).founderTier || "regular",
        lifetimeDiscountPercent: (user as any).lifetimeDiscountPercent || 0,
        priceInCents: subscription.priceInCents,
        nextBillingDate: subscription.nextBillingDate,
      });
      
      await sendSubscriptionWelcomeEmail(
        user.email || "",
        emailData.subject,
        emailData.html,
        emailData.text
      );
      
      console.log("[Stripe Webhook] Welcome email sent for initial subscription");
      return;
    }

    // Generate unique order number
    const orderNumber = `SUB-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Create order for subscription renewal
    const orderResult = await db.createOrder({
      orderNumber,
      userId: subscription.userId,
      email: user.email || "",
      subtotalInCents: subscription.priceInCents,
      shippingInCents: 0, // Free shipping for subscriptions
      taxInCents: 0,
      discountInCents: 0,
      totalInCents: subscription.priceInCents,
      // Use user's saved shipping address or default values
      shippingFirstName: user.name?.split(" ")[0] || "",
      shippingLastName: user.name?.split(" ").slice(1).join(" ") || "",
      shippingAddress1: "Address on file",
      shippingAddress2: null,
      shippingCity: "",
      shippingState: "",
      shippingZipCode: "",
      shippingCountry: "US",
      shippingPhone: null,
      billingFirstName: user.name?.split(" ")[0] || "",
      billingLastName: user.name?.split(" ").slice(1).join(" ") || "",
      billingAddress1: "Address on file",
      billingAddress2: null,
      billingCity: "",
      billingState: "",
      billingZipCode: "",
      billingCountry: "US",
    });

    const orderId = (orderResult as any).insertId;

    // Create order item for subscription product
    await db.createOrderItems([{
      orderId,
      productId: subscription.productId,
      variantId: subscription.variantId || null,
      productName: "OptiBio Ashwagandha KSM-66 (Subscription)",
      variantName: null,
      sku: null,
      quantity: subscription.quantity,
      priceInCents: subscription.priceInCents,
      totalInCents: subscription.priceInCents * subscription.quantity,
    }]);

    // Update subscription billing dates
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    await db.updateSubscriptionBillingDates(
      subscriptionId,
      new Date(),
      nextBillingDate
    );

    console.log("[Stripe Webhook] Subscription order created:", orderNumber);

    // Send subscription renewal confirmation email
    const emailSent = await sendOrderConfirmationEmail({
      orderNumber,
      customerEmail: user.email || "",
      customerName: user.name || "",
      items: [{
        productName: "OptiBio Ashwagandha KSM-66 (Subscription Renewal)",
        quantity: subscription.quantity,
        priceInCents: subscription.priceInCents,
      }],
      subtotalInCents: subscription.priceInCents,
      shippingInCents: 0,
      taxInCents: 0,
      totalInCents: subscription.priceInCents,
      shippingAddress: {
        name: user.name || "",
        address1: "Address on file",
        city: "",
        state: "",
        zipCode: "",
        country: "US",
      },
    });

    if (emailSent) {
      console.log("[Stripe Webhook] Subscription renewal email sent successfully");
    }

  } catch (error: any) {
    console.error("[Stripe Webhook] Error processing invoice:", error);
    throw error;
  }
}

/**
 * Handle subscription status updates
 */
async function handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
  console.log("[Stripe Webhook] Processing subscription update:", stripeSubscription.id);

  try {
    const subscription = await db.getSubscriptionByStripeId(stripeSubscription.id);
    if (!subscription) {
      console.error("[Stripe Webhook] Subscription not found:", stripeSubscription.id);
      return;
    }

    // Map Stripe status to our status
    let status: "active" | "paused" | "cancelled" | "expired" = "active";
    
    if (stripeSubscription.status === "canceled") {
      status = "cancelled";
    } else if (stripeSubscription.pause_collection) {
      status = "paused";
    } else if (stripeSubscription.status === "active") {
      status = "active";
    } else if (stripeSubscription.status === "past_due" || stripeSubscription.status === "unpaid") {
      status = "expired";
    }

    await db.updateSubscriptionStatus(stripeSubscription.id, status);
    console.log("[Stripe Webhook] Subscription status updated to:", status);

  } catch (error: any) {
    console.error("[Stripe Webhook] Error updating subscription:", error);
    throw error;
  }
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
  console.log("[Stripe Webhook] Processing subscription deletion:", stripeSubscription.id);

  try {
    await db.updateSubscriptionStatus(stripeSubscription.id, "cancelled");
    console.log("[Stripe Webhook] Subscription marked as cancelled");

  } catch (error: any) {
    console.error("[Stripe Webhook] Error deleting subscription:", error);
    throw error;
  }
}
