import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  xpReward: {
    type: Number,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  criteria: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
});

const Achievement = mongoose.model('achievements', achievementSchema);

export default Achievement;