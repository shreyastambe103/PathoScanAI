import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import sharp from "sharp";
import mongoose from 'mongoose';

export async function registerRoutes(app: Express) {
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    res.json({
      status: "ok",
      mongodb: dbStatus,
      timestamp: new Date().toISOString()
    });
  });

  app.post("/api/analyze", async (req, res) => {
    try {
      // Check database connection
      if (mongoose.connection.readyState !== 1) {
        throw new Error('Database connection is not available');
      }

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

      const result = await storage.createAnalysis(mockResults);
      res.json(result);
    } catch (error) {
      console.error('Error processing analysis:', error);
      res.status(500).json({ message: "Error processing analysis" });
    }
  });

  app.get("/api/analyses", async (_req, res) => {
    try {
      if (mongoose.connection.readyState !== 1) {
        throw new Error('Database connection is not available');
      }
      const analyses = await storage.getAllAnalyses();
      res.json(analyses);
    } catch (error) {
      console.error('Error fetching analyses:', error);
      res.status(500).json({ 
        message: "Server error",
        details: mongoose.connection.readyState !== 1 ? "Database unavailable" : "Error fetching data"
      });
    }
  });

  app.get("/api/analysis/:id", async (req, res) => {
    try {
      if (mongoose.connection.readyState !== 1) {
        throw new Error('Database connection is not available');
      }
      const analysis = await storage.getAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      res.json(analysis);
    } catch (error) {
      console.error('Error fetching analysis:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  return createServer(app);
}