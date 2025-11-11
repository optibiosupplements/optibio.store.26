import { eq, and, sql, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  products, 
  productVariants,
  subscriptionPlans,
  cartItems,
  orders,
  orderItems,
  discountCodes,
  subscriptions
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Product queries
export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(products).where(eq(products.isActive, true));
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getProductVariants(productId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(productVariants)
    .where(and(
      eq(productVariants.productId, productId),
      eq(productVariants.isActive, true)
    ))
    .orderBy(productVariants.sortOrder);
}

export async function getSubscriptionPlans() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
}

// Cart queries
export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const items = await db.select({
    id: cartItems.id,
    userId: cartItems.userId,
    productId: cartItems.productId,
    variantId: cartItems.variantId,
    quantity: cartItems.quantity,
    isSubscription: cartItems.isSubscription,
    subscriptionPlanId: cartItems.subscriptionPlanId,
    priceInCents: sql<number>`COALESCE(${productVariants.priceInCents}, ${products.priceInCents})`,
    productName: products.name,
    productSlug: products.slug,
    productImage: products.imageUrl,
    variantName: productVariants.name,
  })
  .from(cartItems)
  .leftJoin(products, eq(cartItems.productId, products.id))
  .leftJoin(productVariants, eq(cartItems.variantId, productVariants.id))
  .where(eq(cartItems.userId, userId));
  
  return items;
}

export async function addToCart(item: typeof cartItems.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(cartItems).values(item);
}

export async function updateCartItem(id: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id));
}

export async function removeCartItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(cartItems).where(eq(cartItems.id, id));
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(cartItems).where(eq(cartItems.userId, userId));
}

// Order queries
export async function createOrder(order: typeof orders.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(orders).values(order);
}

export async function createOrderItems(items: typeof orderItems.$inferInsert[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(orderItems).values(items);
}

export async function getOrdersByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}

export async function getOrderById(orderId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

// Discount code queries
export async function getDiscountCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(discountCodes)
    .where(and(
      eq(discountCodes.code, code),
      eq(discountCodes.isActive, true)
    ))
    .limit(1);
    
  return result.length > 0 ? result[0] : null;
}

export async function incrementDiscountCodeUsage(codeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const code = await db.select().from(discountCodes).where(eq(discountCodes.id, codeId)).limit(1);
  if (code.length === 0) throw new Error("Discount code not found");
  
  const currentCount = code[0]?.usedCount ?? 0;
  return db.update(discountCodes)
    .set({ usedCount: currentCount + 1 })
    .where(eq(discountCodes.id, codeId));
}
