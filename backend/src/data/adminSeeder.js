import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const adminUser = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@porter.com',
  password: 'admin123', // This will be hashed by the User model's pre-save middleware
  role: 'ADMIN'
};

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (!existingAdmin) {
      await User.create(adminUser);
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

// Run the seeder
seedAdmin();
