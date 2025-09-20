import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  results: {
<<<<<<< HEAD
    ec: { type: Number, required: true },      // E.coli
    sa: { type: Number, required: true },      // S.Aureus
    kp: { type: Number, required: true },      // Klebsiella Pneumonae
    invalid: { type: Number, required: true }  // Invalid classification
=======
    s_aureus: Number,
    e_coli: Number,
    invalid: Number
>>>>>>> a47e7aecac876d457013c1d57c25e2fb2aa67360
  },
  notes: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export const Analysis = mongoose.model('Analysis', AnalysisSchema);