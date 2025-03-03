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

export const storage = new MongoStorage();