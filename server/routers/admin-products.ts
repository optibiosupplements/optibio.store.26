import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { products, productVariants, inventoryAdjustments, lowStockAlerts, auditLogs } from "../../drizzle/schema";
import { eq, desc, asc, like, and, or, sql, lte } from "drizzle-orm";

// Helper to check if user has admin access (staff, admin, or owner)
const hasAdminAccess = (role: string | null | undefined) => {
  return role === "staff" || role === "admin" || role === "owner";
};

// Admin procedure that requires staff+ access
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!hasAdminAccess(ctx.user?.role)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// Log audit action
async function logAudit(
  db: Awaited<ReturnType<typeof getDb>>,
  userId: number,
  userName: string | null,
  userRole: string,
  action: string,
  resourceType: string,
  resourceId: number | null,
  resourceName: string | null,
  previousValue: any,
  newValue: any,
  changeDescription: string,
  ipAddress?: string
) {
  if (!db) return;
  
  await db.insert(auditLogs).values({
    userId,
    userName: userName || undefined,
    userRole,
    action: action as any,
    resourceType: resourceType as any,
    resourceId: resourceId || undefined,
    resourceName: resourceName || undefined,
    previousValue: previousValue ? JSON.stringify(previousValue) : undefined,
    newValue: newValue ? JSON.stringify(newValue) : undefined,
    changeDescription,
    ipAddress: ipAddress || undefined,
  });
}

export const adminProductsRouter = router({
  // List all products with pagination and search
  list: adminProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
      search: z.string().optional(),
      status: z.enum(["all", "active", "inactive"]).default("all"),
      sortBy: z.enum(["name", "price", "stock", "createdAt"]).default("createdAt"),
      sortOrder: z.enum(["asc", "desc"]).default("desc"),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { page = 1, limit = 20, search, status = "all", sortBy = "createdAt", sortOrder = "desc" } = input || {};
      const offset = (page - 1) * limit;
      
      // Build where conditions
      const conditions = [];
      if (search) {
        conditions.push(
          or(
            like(products.name, `%${search}%`),
            like(products.sku, `%${search}%`),
            like(products.description, `%${search}%`)
          )
        );
      }
      if (status === "active") {
        conditions.push(eq(products.isActive, true));
      } else if (status === "inactive") {
        conditions.push(eq(products.isActive, false));
      }
      
      // Build order by
      const orderByMap = {
        name: products.name,
        price: products.priceInCents,
        stock: products.stockQuantity,
        createdAt: products.createdAt,
      };
      const orderByColumn = orderByMap[sortBy];
      const orderByDirection = sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);
      
      // Get products
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      const productList = await db
        .select()
        .from(products)
        .where(whereClause)
        .orderBy(orderByDirection)
        .limit(limit)
        .offset(offset);
      
      // Get total count
      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(whereClause);
      const total = countResult[0]?.count || 0;
      
      return {
        products: productList,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  // Get single product with variants
  get: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const product = await db.select().from(products).where(eq(products.id, input.id)).limit(1);
      if (!product[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }
      
      const variants = await db.select().from(productVariants).where(eq(productVariants.productId, input.id)).orderBy(asc(productVariants.sortOrder));
      
      return {
        ...product[0],
        variants,
      };
    }),

  // Create new product
  create: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      longDescription: z.string().optional(),
      priceInCents: z.number().min(0),
      compareAtPriceInCents: z.number().optional(),
      sku: z.string().optional(),
      stockQuantity: z.number().min(0).default(0),
      lowStockThreshold: z.number().min(0).default(10),
      imageUrl: z.string().optional(),
      galleryImages: z.array(z.string()).optional(),
      isActive: z.boolean().default(true),
      isFeatured: z.boolean().default(false),
      servingSize: z.string().optional(),
      servingsPerContainer: z.number().optional(),
      ingredients: z.string().optional(),
      supplementFacts: z.string().optional(),
      warnings: z.string().optional(),
      directions: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      // Check for duplicate slug
      const existing = await db.select().from(products).where(eq(products.slug, input.slug)).limit(1);
      if (existing[0]) {
        throw new TRPCError({ code: "CONFLICT", message: "A product with this slug already exists" });
      }
      
      const result = await db.insert(products).values({
        ...input,
        galleryImages: input.galleryImages ? JSON.stringify(input.galleryImages) : undefined,
      });
      
      const productId = Number(result[0].insertId);
      
      // Log audit
      await logAudit(
        db,
        ctx.user!.id,
        ctx.user!.name,
        ctx.user!.role,
        "create",
        "product",
        productId,
        input.name,
        null,
        input,
        `Created product: ${input.name}`
      );
      
      return { id: productId, message: "Product created successfully" };
    }),

  // Update product
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      slug: z.string().min(1).optional(),
      description: z.string().optional(),
      longDescription: z.string().optional(),
      priceInCents: z.number().min(0).optional(),
      compareAtPriceInCents: z.number().nullable().optional(),
      sku: z.string().nullable().optional(),
      stockQuantity: z.number().min(0).optional(),
      lowStockThreshold: z.number().min(0).optional(),
      imageUrl: z.string().nullable().optional(),
      galleryImages: z.array(z.string()).optional(),
      isActive: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      servingSize: z.string().nullable().optional(),
      servingsPerContainer: z.number().nullable().optional(),
      ingredients: z.string().nullable().optional(),
      supplementFacts: z.string().nullable().optional(),
      warnings: z.string().nullable().optional(),
      directions: z.string().nullable().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { id, ...updates } = input;
      
      // Get current product for audit
      const current = await db.select().from(products).where(eq(products.id, id)).limit(1);
      if (!current[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }
      
      // Check for duplicate slug if updating
      if (updates.slug && updates.slug !== current[0].slug) {
        const existing = await db.select().from(products).where(eq(products.slug, updates.slug)).limit(1);
        if (existing[0]) {
          throw new TRPCError({ code: "CONFLICT", message: "A product with this slug already exists" });
        }
      }
      
      // Handle stock quantity change with inventory adjustment
      if (updates.stockQuantity !== undefined && updates.stockQuantity !== current[0].stockQuantity) {
        const quantityChange = updates.stockQuantity - current[0].stockQuantity;
        await db.insert(inventoryAdjustments).values({
          productId: id,
          adjustmentType: "adjustment",
          quantityBefore: current[0].stockQuantity,
          quantityChange,
          quantityAfter: updates.stockQuantity,
          reason: "Manual adjustment via admin",
          adjustedBy: ctx.user!.id,
          adjustedByName: ctx.user!.name || undefined,
        });
      }
      
      await db.update(products).set({
        ...updates,
        galleryImages: updates.galleryImages ? JSON.stringify(updates.galleryImages) : undefined,
      }).where(eq(products.id, id));
      
      // Log audit
      await logAudit(
        db,
        ctx.user!.id,
        ctx.user!.name,
        ctx.user!.role,
        "update",
        "product",
        id,
        current[0].name,
        current[0],
        updates,
        `Updated product: ${current[0].name}`
      );
      
      return { message: "Product updated successfully" };
    }),

  // Delete product (soft delete by setting inactive)
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const current = await db.select().from(products).where(eq(products.id, input.id)).limit(1);
      if (!current[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }
      
      // Soft delete - set inactive
      await db.update(products).set({ isActive: false }).where(eq(products.id, input.id));
      
      // Log audit
      await logAudit(
        db,
        ctx.user!.id,
        ctx.user!.name,
        ctx.user!.role,
        "delete",
        "product",
        input.id,
        current[0].name,
        current[0],
        { isActive: false },
        `Deleted (deactivated) product: ${current[0].name}`
      );
      
      return { message: "Product deleted successfully" };
    }),

  // ============================================
  // PRODUCT VARIANTS
  // ============================================

  // Create variant
  createVariant: adminProcedure
    .input(z.object({
      productId: z.number(),
      name: z.string().min(1),
      sku: z.string().optional(),
      priceInCents: z.number().min(0),
      compareAtPriceInCents: z.number().optional(),
      stockQuantity: z.number().min(0).default(0),
      isActive: z.boolean().default(true),
      sortOrder: z.number().default(0),
      stripePriceId: z.string().optional(),
      stripeSubscriptionPriceId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const result = await db.insert(productVariants).values(input);
      const variantId = Number(result[0].insertId);
      
      // Log audit
      await logAudit(
        db,
        ctx.user!.id,
        ctx.user!.name,
        ctx.user!.role,
        "create",
        "product",
        variantId,
        input.name,
        null,
        input,
        `Created variant: ${input.name} for product ID ${input.productId}`
      );
      
      return { id: variantId, message: "Variant created successfully" };
    }),

  // Update variant
  updateVariant: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      sku: z.string().nullable().optional(),
      priceInCents: z.number().min(0).optional(),
      compareAtPriceInCents: z.number().nullable().optional(),
      stockQuantity: z.number().min(0).optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().optional(),
      stripePriceId: z.string().nullable().optional(),
      stripeSubscriptionPriceId: z.string().nullable().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { id, ...updates } = input;
      
      const current = await db.select().from(productVariants).where(eq(productVariants.id, id)).limit(1);
      if (!current[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Variant not found" });
      }
      
      // Handle stock quantity change with inventory adjustment
      if (updates.stockQuantity !== undefined && updates.stockQuantity !== current[0].stockQuantity) {
        const quantityChange = updates.stockQuantity - current[0].stockQuantity;
        await db.insert(inventoryAdjustments).values({
          productId: current[0].productId,
          variantId: id,
          adjustmentType: "adjustment",
          quantityBefore: current[0].stockQuantity,
          quantityChange,
          quantityAfter: updates.stockQuantity,
          reason: "Manual adjustment via admin",
          adjustedBy: ctx.user!.id,
          adjustedByName: ctx.user!.name || undefined,
        });
      }
      
      await db.update(productVariants).set(updates).where(eq(productVariants.id, id));
      
      // Log audit
      await logAudit(
        db,
        ctx.user!.id,
        ctx.user!.name,
        ctx.user!.role,
        "update",
        "product",
        id,
        current[0].name,
        current[0],
        updates,
        `Updated variant: ${current[0].name}`
      );
      
      return { message: "Variant updated successfully" };
    }),

  // Delete variant
  deleteVariant: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const current = await db.select().from(productVariants).where(eq(productVariants.id, input.id)).limit(1);
      if (!current[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Variant not found" });
      }
      
      // Soft delete - set inactive
      await db.update(productVariants).set({ isActive: false }).where(eq(productVariants.id, input.id));
      
      // Log audit
      await logAudit(
        db,
        ctx.user!.id,
        ctx.user!.name,
        ctx.user!.role,
        "delete",
        "product",
        input.id,
        current[0].name,
        current[0],
        { isActive: false },
        `Deleted (deactivated) variant: ${current[0].name}`
      );
      
      return { message: "Variant deleted successfully" };
    }),

  // ============================================
  // INVENTORY MANAGEMENT
  // ============================================

  // Get low stock products
  getLowStock: adminProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      // Get products where stock is at or below threshold
      const lowStockProducts = await db
        .select()
        .from(products)
        .where(
          and(
            eq(products.isActive, true),
            lte(products.stockQuantity, products.lowStockThreshold)
          )
        )
        .orderBy(asc(products.stockQuantity));
      
      return lowStockProducts;
    }),

  // Get inventory adjustments history
  getInventoryHistory: adminProcedure
    .input(z.object({
      productId: z.number().optional(),
      limit: z.number().min(1).max(100).default(50),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { productId, limit = 50 } = input || {};
      
      if (productId) {
        return db.select().from(inventoryAdjustments).where(eq(inventoryAdjustments.productId, productId)).orderBy(desc(inventoryAdjustments.createdAt)).limit(limit);
      }
      
      return db.select().from(inventoryAdjustments).orderBy(desc(inventoryAdjustments.createdAt)).limit(limit);
    }),

  // Adjust inventory
  adjustInventory: adminProcedure
    .input(z.object({
      productId: z.number(),
      variantId: z.number().optional(),
      adjustmentType: z.enum(["received", "sold", "returned", "damaged", "lost", "adjustment", "transfer", "count"]),
      quantityChange: z.number(),
      reason: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      // Get current stock
      let currentStock: number;
      let productName: string;
      
      if (input.variantId) {
        const variant = await db.select().from(productVariants).where(eq(productVariants.id, input.variantId)).limit(1);
        if (!variant[0]) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Variant not found" });
        }
        currentStock = variant[0].stockQuantity;
        productName = variant[0].name;
      } else {
        const product = await db.select().from(products).where(eq(products.id, input.productId)).limit(1);
        if (!product[0]) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
        }
        currentStock = product[0].stockQuantity;
        productName = product[0].name;
      }
      
      const newStock = currentStock + input.quantityChange;
      if (newStock < 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot reduce stock below 0" });
      }
      
      // Create adjustment record
      await db.insert(inventoryAdjustments).values({
        productId: input.productId,
        variantId: input.variantId || undefined,
        adjustmentType: input.adjustmentType,
        quantityBefore: currentStock,
        quantityChange: input.quantityChange,
        quantityAfter: newStock,
        reason: input.reason || undefined,
        notes: input.notes || undefined,
        adjustedBy: ctx.user!.id,
        adjustedByName: ctx.user!.name || undefined,
      });
      
      // Update stock
      if (input.variantId) {
        await db.update(productVariants).set({ stockQuantity: newStock }).where(eq(productVariants.id, input.variantId));
      } else {
        await db.update(products).set({ stockQuantity: newStock }).where(eq(products.id, input.productId));
      }
      
      // Check for low stock alert
      const product = await db.select().from(products).where(eq(products.id, input.productId)).limit(1);
      if (product[0] && newStock <= (product[0].lowStockThreshold || 10)) {
        // Create or update low stock alert
        const existingAlert = await db.select().from(lowStockAlerts)
          .where(
            and(
              eq(lowStockAlerts.productId, input.productId),
              eq(lowStockAlerts.status, "active")
            )
          ).limit(1);
        
        if (!existingAlert[0]) {
          await db.insert(lowStockAlerts).values({
            productId: input.productId,
            variantId: input.variantId || undefined,
            productName,
            currentStock: newStock,
            threshold: product[0].lowStockThreshold || 10,
            status: "active",
          });
        } else {
          await db.update(lowStockAlerts)
            .set({ currentStock: newStock })
            .where(eq(lowStockAlerts.id, existingAlert[0].id));
        }
      }
      
      // Log audit
      await logAudit(
        db,
        ctx.user!.id,
        ctx.user!.name,
        ctx.user!.role,
        "update",
        "inventory",
        input.productId,
        productName,
        { stockQuantity: currentStock },
        { stockQuantity: newStock, adjustmentType: input.adjustmentType },
        `Inventory ${input.adjustmentType}: ${input.quantityChange > 0 ? '+' : ''}${input.quantityChange} units for ${productName}`
      );
      
      return { 
        message: "Inventory adjusted successfully",
        previousStock: currentStock,
        newStock,
      };
    }),
});
