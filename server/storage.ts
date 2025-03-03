import { Analysis } from './models/Analysis';

export interface IAnalysis {
  imageUrl: string;
  results: {
    e_coli: number;
    klebsiella: number;
    acinetobacter: number;
    pseudomonas: number;
    enterobacter: number;
  };
  confidence: {
    e_coli: number;
    klebsiella: number;
    acinetobacter: number;
    pseudomonas: number;
    enterobacter: number;
  };
  notes?: string;
  timestamp?: Date;
}

export interface IStorage {
  createAnalysis(result: IAnalysis): Promise<IAnalysis>;
  getAnalysis(id: string): Promise<IAnalysis | null>;
  getAllAnalyses(): Promise<IAnalysis[]>;
}

// Fallback in-memory storage when MongoDB is unavailable
export class MemoryStorage implements IStorage {
  private analyses: Map<string, IAnalysis>;

  constructor() {
    this.analyses = new Map();
  }

  async createAnalysis(result: IAnalysis): Promise<IAnalysis> {
    const id = Math.random().toString(36).substring(7);
    const analysis = { ...result, _id: id, timestamp: new Date() };
    this.analyses.set(id, analysis);
    return analysis;
  }

  async getAnalysis(id: string): Promise<IAnalysis | null> {
    return this.analyses.get(id) || null;
  }

  async getAllAnalyses(): Promise<IAnalysis[]> {
    return Array.from(this.analyses.values()).sort((a, b) => 
      (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0)
    );
  }
}

export class MongoStorage implements IStorage {
  async createAnalysis(result: IAnalysis): Promise<IAnalysis> {
    const analysis = new Analysis(result);
    return await analysis.save();
  }

  async getAnalysis(id: string): Promise<IAnalysis | null> {
    return await Analysis.findById(id);
  }

  async getAllAnalyses(): Promise<IAnalysis[]> {
    return await Analysis.find().sort({ timestamp: -1 });
  }
}

// Create both storage instances
const mongoStorage = new MongoStorage();
const memoryStorage = new MemoryStorage();

// Export a proxy that switches between MongoDB and in-memory storage based on connection state
export const storage = new Proxy({} as IStorage, {
  get: (target, prop) => {
    const isMongoConnected = require('mongoose').connection.readyState === 1;
    const currentStorage = isMongoConnected ? mongoStorage : memoryStorage;
    return currentStorage[prop as keyof IStorage];
  }
});