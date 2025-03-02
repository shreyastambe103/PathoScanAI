import { analysisResults, type AnalysisResult, type InsertResult } from "@shared/schema";

export interface IStorage {
  createAnalysis(result: InsertResult): Promise<AnalysisResult>;
  getAnalysis(id: number): Promise<AnalysisResult | undefined>;
  getAllAnalyses(): Promise<AnalysisResult[]>;
}

export class MemStorage implements IStorage {
  private analyses: Map<number, AnalysisResult>;
  private currentId: number;

  constructor() {
    this.analyses = new Map();
    this.currentId = 1;
  }

  async createAnalysis(result: InsertResult): Promise<AnalysisResult> {
    const id = this.currentId++;
    const analysis: AnalysisResult = {
      ...result,
      id,
      timestamp: new Date(),
    };
    this.analyses.set(id, analysis);
    return analysis;
  }

  async getAnalysis(id: number): Promise<AnalysisResult | undefined> {
    return this.analyses.get(id);
  }

  async getAllAnalyses(): Promise<AnalysisResult[]> {
    return Array.from(this.analyses.values()).sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }
}

export const storage = new MemStorage();
