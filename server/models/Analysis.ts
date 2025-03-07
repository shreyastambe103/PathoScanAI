import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  results: {
    s_aureus: Number,
    e_coli: Number
  },
  notes: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export const Analysis = mongoose.model('Analysis', AnalysisSchema);