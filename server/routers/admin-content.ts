import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { contentPages, blogPosts, faqItems, auditLogs } from "../../drizzle/schema";
import { eq, desc, asc, like, and, or, sql } from "drizzle-orm";

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

export const adminContentRouter = router({
  // ============================================
  // CONTENT PAGES
  // ============================================

  // List all pages
  listPages: adminProcedure
    .input(z.object({
      search: z.string().optional(),
      status: z.enum(["all", "published", "draft"]).default("all"),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { search, status = "all" } = input || {};
      
      const conditions = [];
      if (search) {
        conditions.push(
          or(
            like(contentPages.title, `%${search}%`),
            like(contentPages.slug, `%${search}%`)
          )
        );
      }
      if (status === "published") {
        conditions.push(eq(contentPages.isPublished, true));
      } else if (status === "draft") {
        conditions.push(eq(contentPages.isPublished, false));
      }
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      const pages = await db
        .select()
        .from(contentPages)
        .where(whereClause)
        .orderBy(asc(contentPages.sortOrder), desc(contentPages.createdAt));
      
      return pages;
    }),

  // Get single page
  getPage: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const page = await db.select().from(contentPages).where(eq(contentPages.id, input.id)).limit(1);
      if (!page[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Page not found" });
      }
      
      return page[0];
    }),

  // Create page
  createPage: adminProcedure
    .input(z.object({
      slug: z.string().min(1),
      title: z.string().min(1),
      content: z.string().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      isPublished: z.boolean().default(false),
      sortOrder: z.number().default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      // Check for duplicate slug
      const existing = await db.select().from(contentPages).where(eq(contentPages.slug, input.slug)).limit(1);
      if (existing[0]) {
        throw new TRPCError({ code: "CONFLICT", message: "A page with this slug already exists" });
      }
      
      const result = await db.insert(contentPages).values({
        ...input,
        publishedAt: input.isPublished ? new Date() : undefined,
        createdBy: ctx.user!.id,
        updatedBy: ctx.user!.id,
      });
      
      const pageId = Number(result[0].insertId);
      
      // Log audit
      await db.insert(auditLogs).values({
        userId: ctx.user!.id,
        userName: ctx.user!.name || undefined,
        userRole: ctx.user!.role,
        action: "create",
        resourceType: "content",
        resourceId: pageId,
        resourceName: input.title,
        newValue: JSON.stringify(input),
        changeDescription: `Created page: ${input.title}`,
      });
      
      return { id: pageId, message: "Page created successfully" };
    }),

  // Update page
  updatePage: adminProcedure
    .input(z.object({
      id: z.number(),
      slug: z.string().min(1).optional(),
      title: z.string().min(1).optional(),
      content: z.string().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      isPublished: z.boolean().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { id, ...updates } = input;
      
      const current = await db.select().from(contentPages).where(eq(contentPages.id, id)).limit(1);
      if (!current[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Page not found" });
      }
      
      // Check for duplicate slug if updating
      if (updates.slug && updates.slug !== current[0].slug) {
        const existing = await db.select().from(contentPages).where(eq(contentPages.slug, updates.slug)).limit(1);
        if (existing[0]) {
          throw new TRPCError({ code: "CONFLICT", message: "A page with this slug already exists" });
        }
      }
      
      // Set publishedAt if publishing for first time
      const updateData: any = {
        ...updates,
        updatedBy: ctx.user!.id,
      };
      if (updates.isPublished && !current[0].isPublished) {
        updateData.publishedAt = new Date();
      }
      
      await db.update(contentPages).set(updateData).where(eq(contentPages.id, id));
      
      // Log audit
      await db.insert(auditLogs).values({
        userId: ctx.user!.id,
        userName: ctx.user!.name || undefined,
        userRole: ctx.user!.role,
        action: "update",
        resourceType: "content",
        resourceId: id,
        resourceName: current[0].title,
        previousValue: JSON.stringify(current[0]),
        newValue: JSON.stringify(updates),
        changeDescription: `Updated page: ${current[0].title}`,
      });
      
      return { message: "Page updated successfully" };
    }),

  // Delete page
  deletePage: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const current = await db.select().from(contentPages).where(eq(contentPages.id, input.id)).limit(1);
      if (!current[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Page not found" });
      }
      
      await db.delete(contentPages).where(eq(contentPages.id, input.id));
      
      // Log audit
      await db.insert(auditLogs).values({
        userId: ctx.user!.id,
        userName: ctx.user!.name || undefined,
        userRole: ctx.user!.role,
        action: "delete",
        resourceType: "content",
        resourceId: input.id,
        resourceName: current[0].title,
        previousValue: JSON.stringify(current[0]),
        changeDescription: `Deleted page: ${current[0].title}`,
      });
      
      return { message: "Page deleted successfully" };
    }),

  // ============================================
  // BLOG POSTS
  // ============================================

  // List all blog posts
  listPosts: adminProcedure
    .input(z.object({
      search: z.string().optional(),
      status: z.enum(["all", "draft", "published", "archived"]).default("all"),
      category: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { search, status = "all", category } = input || {};
      
      const conditions = [];
      if (search) {
        conditions.push(
          or(
            like(blogPosts.title, `%${search}%`),
            like(blogPosts.excerpt, `%${search}%`)
          )
        );
      }
      if (status !== "all") {
        conditions.push(eq(blogPosts.status, status));
      }
      if (category) {
        conditions.push(eq(blogPosts.category, category));
      }
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      const posts = await db
        .select()
        .from(blogPosts)
        .where(whereClause)
        .orderBy(desc(blogPosts.createdAt));
      
      return posts;
    }),

  // Get single blog post
  getPost: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const post = await db.select().from(blogPosts).where(eq(blogPosts.id, input.id)).limit(1);
      if (!post[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }
      
      return post[0];
    }),

  // Create blog post
  createPost: adminProcedure
    .input(z.object({
      slug: z.string().min(1),
      title: z.string().min(1),
      excerpt: z.string().optional(),
      content: z.string().optional(),
      featuredImage: z.string().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
      status: z.enum(["draft", "published", "archived"]).default("draft"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      // Check for duplicate slug
      const existing = await db.select().from(blogPosts).where(eq(blogPosts.slug, input.slug)).limit(1);
      if (existing[0]) {
        throw new TRPCError({ code: "CONFLICT", message: "A post with this slug already exists" });
      }
      
      const result = await db.insert(blogPosts).values({
        ...input,
        tags: input.tags ? JSON.stringify(input.tags) : undefined,
        publishedAt: input.status === "published" ? new Date() : undefined,
        authorId: ctx.user!.id,
        authorName: ctx.user!.name || undefined,
      });
      
      const postId = Number(result[0].insertId);
      
      // Log audit
      await db.insert(auditLogs).values({
        userId: ctx.user!.id,
        userName: ctx.user!.name || undefined,
        userRole: ctx.user!.role,
        action: "create",
        resourceType: "content",
        resourceId: postId,
        resourceName: input.title,
        newValue: JSON.stringify(input),
        changeDescription: `Created blog post: ${input.title}`,
      });
      
      return { id: postId, message: "Post created successfully" };
    }),

  // Update blog post
  updatePost: adminProcedure
    .input(z.object({
      id: z.number(),
      slug: z.string().min(1).optional(),
      title: z.string().min(1).optional(),
      excerpt: z.string().optional(),
      content: z.string().optional(),
      featuredImage: z.string().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
      status: z.enum(["draft", "published", "archived"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { id, ...updates } = input;
      
      const current = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
      if (!current[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }
      
      // Check for duplicate slug if updating
      if (updates.slug && updates.slug !== current[0].slug) {
        const existing = await db.select().from(blogPosts).where(eq(blogPosts.slug, updates.slug)).limit(1);
        if (existing[0]) {
          throw new TRPCError({ code: "CONFLICT", message: "A post with this slug already exists" });
        }
      }
      
      // Set publishedAt if publishing for first time
      const updateData: any = {
        ...updates,
        tags: updates.tags ? JSON.stringify(updates.tags) : undefined,
      };
      if (updates.status === "published" && current[0].status !== "published") {
        updateData.publishedAt = new Date();
      }
      
      await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id));
      
      // Log audit
      await db.insert(auditLogs).values({
        userId: ctx.user!.id,
        userName: ctx.user!.name || undefined,
        userRole: ctx.user!.role,
        action: "update",
        resourceType: "content",
        resourceId: id,
        resourceName: current[0].title,
        previousValue: JSON.stringify(current[0]),
        newValue: JSON.stringify(updates),
        changeDescription: `Updated blog post: ${current[0].title}`,
      });
      
      return { message: "Post updated successfully" };
    }),

  // Delete blog post
  deletePost: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const current = await db.select().from(blogPosts).where(eq(blogPosts.id, input.id)).limit(1);
      if (!current[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }
      
      await db.delete(blogPosts).where(eq(blogPosts.id, input.id));
      
      // Log audit
      await db.insert(auditLogs).values({
        userId: ctx.user!.id,
        userName: ctx.user!.name || undefined,
        userRole: ctx.user!.role,
        action: "delete",
        resourceType: "content",
        resourceId: input.id,
        resourceName: current[0].title,
        previousValue: JSON.stringify(current[0]),
        changeDescription: `Deleted blog post: ${current[0].title}`,
      });
      
      return { message: "Post deleted successfully" };
    }),

  // ============================================
  // FAQ ITEMS
  // ============================================

  // List all FAQ items
  listFaqs: adminProcedure
    .input(z.object({
      category: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { category } = input || {};
      
      if (category) {
        return db.select().from(faqItems).where(eq(faqItems.category, category)).orderBy(asc(faqItems.sortOrder), desc(faqItems.createdAt));
      }
      
      return db.select().from(faqItems).orderBy(asc(faqItems.sortOrder), desc(faqItems.createdAt));
    }),

  // Get FAQ categories
  getFaqCategories: adminProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const categories = await db
        .select({ category: faqItems.category })
        .from(faqItems)
        .groupBy(faqItems.category);
      
      return categories.map(c => c.category).filter(Boolean);
    }),

  // Create FAQ item
  createFaq: adminProcedure
    .input(z.object({
      question: z.string().min(1),
      answer: z.string().min(1),
      category: z.string().optional(),
      sortOrder: z.number().default(0),
      isPublished: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const result = await db.insert(faqItems).values(input);
      const faqId = Number(result[0].insertId);
      
      // Log audit
      await db.insert(auditLogs).values({
        userId: ctx.user!.id,
        userName: ctx.user!.name || undefined,
        userRole: ctx.user!.role,
        action: "create",
        resourceType: "content",
        resourceId: faqId,
        resourceName: input.question.substring(0, 50),
        newValue: JSON.stringify(input),
        changeDescription: `Created FAQ: ${input.question.substring(0, 50)}...`,
      });
      
      return { id: faqId, message: "FAQ created successfully" };
    }),

  // Update FAQ item
  updateFaq: adminProcedure
    .input(z.object({
      id: z.number(),
      question: z.string().min(1).optional(),
      answer: z.string().min(1).optional(),
      category: z.string().optional(),
      sortOrder: z.number().optional(),
      isPublished: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { id, ...updates } = input;
      
      const current = await db.select().from(faqItems).where(eq(faqItems.id, id)).limit(1);
      if (!current[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "FAQ not found" });
      }
      
      await db.update(faqItems).set(updates).where(eq(faqItems.id, id));
      
      // Log audit
      await db.insert(auditLogs).values({
        userId: ctx.user!.id,
        userName: ctx.user!.name || undefined,
        userRole: ctx.user!.role,
        action: "update",
        resourceType: "content",
        resourceId: id,
        resourceName: current[0].question.substring(0, 50),
        previousValue: JSON.stringify(current[0]),
        newValue: JSON.stringify(updates),
        changeDescription: `Updated FAQ: ${current[0].question.substring(0, 50)}...`,
      });
      
      return { message: "FAQ updated successfully" };
    }),

  // Delete FAQ item
  deleteFaq: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const current = await db.select().from(faqItems).where(eq(faqItems.id, input.id)).limit(1);
      if (!current[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "FAQ not found" });
      }
      
      await db.delete(faqItems).where(eq(faqItems.id, input.id));
      
      // Log audit
      await db.insert(auditLogs).values({
        userId: ctx.user!.id,
        userName: ctx.user!.name || undefined,
        userRole: ctx.user!.role,
        action: "delete",
        resourceType: "content",
        resourceId: input.id,
        resourceName: current[0].question.substring(0, 50),
        previousValue: JSON.stringify(current[0]),
        changeDescription: `Deleted FAQ: ${current[0].question.substring(0, 50)}...`,
      });
      
      return { message: "FAQ deleted successfully" };
    }),
});
