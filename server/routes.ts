import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertResultSchema } from "@shared/schema";
import sharp from "sharp";

export async function registerRoutes(app: Express) {
  app.post("/api/analyze", async (req, res) => {
    try {
      const imageData = req.body.image;
      if (!imageData) {
        return res.status(400).json({ message: "No image provided" });
      }

      // Basic image preprocessing with Sharp
      const processedImage = await sharp(Buffer.from(imageData, 'base64'))
        .resize(512, 512, { fit: 'contain' })
        .normalize()
        .toBuffer();

      // Mock ML analysis results for now
      const mockResults = {
        imageUrl: `data:image/jpeg;base64,${processedImage.toString('base64')}`,
        results: {
          e_coli: Math.random(),
          klebsiella: Math.random(),
          acinetobacter: Math.random(),
          pseudomonas: Math.random(),
          enterobacter: Math.random(),
        },
        confidence: {
          e_coli: Math.random(),
          klebsiella: Math.random(),
          acinetobacter: Math.random(),
          pseudomonas: Math.random(),
          enterobacter: Math.random(),
        },
        notes: req.body.notes,
      };

      const validatedData = insertResultSchema.parse(mockResults);
      const result = await storage.createAnalysis(validatedData);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.get("/api/analyses", async (_req, res) => {
    const analyses = await storage.getAllAnalyses();
    res.json(analyses);
  });

  app.get("/api/analysis/:id", async (req, res) => {
    const analysis = await storage.getAnalysis(Number(req.params.id));
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }
    res.json(analysis);
  });

  return createServer(app);
}
