import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { leads } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const leadsRouter = router({
  captureQuizLead: publicProcedure
    .input(z.object({
      email: z.string().email(),
      firstName: z.string().min(1),
      source: z.string().default("wellness_quiz"),
      quizData: z.object({
        goals: z.array(z.string()),
        stressLevel: z.number(),
        sleepQuality: z.number(),
        exerciseFrequency: z.string(),
        timingPreference: z.string(),
      }).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        console.warn("[Leads] Database not available");
        return { success: false };
      }

      try {
        // Check if lead already exists
        const existingLead = await db
          .select()
          .from(leads)
          .where(eq(leads.email, input.email))
          .limit(1);

        if (existingLead.length > 0) {
          // Update existing lead with quiz data
          await db
            .update(leads)
            .set({
              firstName: input.firstName,
              source: input.source,
              quizData: input.quizData ? JSON.stringify(input.quizData) : null,
              updatedAt: new Date(),
            })
            .where(eq(leads.email, input.email));
        } else {
          // Create new lead
          await db.insert(leads).values({
            email: input.email,
            firstName: input.firstName,
            source: input.source,
            quizData: input.quizData ? JSON.stringify(input.quizData) : null,
            status: "new",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        // TODO: Trigger welcome email sequence
        // TODO: Send personalized plan email with discount code

        console.log(`[Leads] Captured quiz lead: ${input.email}`);
        return { success: true };
      } catch (error) {
        console.error("[Leads] Error capturing lead:", error);
        return { success: false };
      }
    }),

  captureEbookLead: publicProcedure
    .input(z.object({
      email: z.string().email(),
      firstName: z.string().min(1).optional(),
      source: z.string().default("ebook_download"),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        console.warn("[Leads] Database not available");
        return { success: false, downloadUrl: null };
      }

      try {
        // Check if lead already exists
        const existingLead = await db
          .select()
          .from(leads)
          .where(eq(leads.email, input.email))
          .limit(1);

        if (existingLead.length === 0) {
          // Create new lead
          await db.insert(leads).values({
            email: input.email,
            firstName: input.firstName || null,
            source: input.source,
            status: "new",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        // Return the ebook download URL
        const ebookUrl = "/downloads/optibio-stress-management-guide.pdf";
        
        console.log(`[Leads] Captured ebook lead: ${input.email}`);
        return { success: true, downloadUrl: ebookUrl };
      } catch (error) {
        console.error("[Leads] Error capturing ebook lead:", error);
        return { success: false, downloadUrl: null };
      }
    }),
});
