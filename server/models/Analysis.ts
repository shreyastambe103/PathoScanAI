import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  results: {
    e_coli: Number,
    klebsiella: Number,
    acinetobacter: Number,
    pseudomonas: Number,
    enterobacter: Number
  },
  confidence: {
    e_coli: Number,
    klebsiella: Number,
    acinetobacter: Number,
    pseudomonas: Number,
    enterobacter: Number
  },
  notes: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export const Analysis = mongoose.model('Analysis', AnalysisSchema);
