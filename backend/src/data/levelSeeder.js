import mongoose from 'mongoose';
import Level from '../models/Level.js';
import { sampleLevels } from './sampleLevels.js';
import dotenv from 'dotenv';

dotenv.config();

const seedLevels = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing levels
    await Level.deleteMany({});
    console.log('Cleared existing levels');

    // Insert sample levels
    const levels = await Level.insertMany(sampleLevels);
    console.log(`Seeded ${levels.length} levels`);

    await mongoose.disconnect();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding levels:', error);
    process.exit(1);
  }
};

seedLevels();
