import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const analysisResults = pgTable("analysis_results", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  results: jsonb("results").$type<{
    e_coli: number;
    klebsiella: number;
    acinetobacter: number;
    pseudomonas: number;
    enterobacter: number;
  }>().notNull(),
  confidence: jsonb("confidence").$type<{
    e_coli: number;
    klebsiella: number;
    acinetobacter: number;
    pseudomonas: number;
    enterobacter: number;
  }>().notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  notes: text("notes"),
});

export const insertResultSchema = createInsertSchema(analysisResults).omit({
  id: true,
  timestamp: true
});

export type InsertResult = z.infer<typeof insertResultSchema>;
export type AnalysisResult = typeof analysisResults.$inferSelect;
