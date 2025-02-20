import mongoose from 'mongoose';

const levelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['USER', 'DRIVER'],
    default: 'USER'
  },
  requiredTrips: {
    type: Number,
    required: true,
    min: 0
  },
  rewards: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Add index for faster queries
levelSchema.index({ role: 1, requiredTrips: 1 });

const Level = mongoose.model('Level', levelSchema);

export default Level;
