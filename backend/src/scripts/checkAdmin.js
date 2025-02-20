import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@porter.com';
    
    // Find admin user
    const admin = await User.findOne({ email: adminEmail }).select('+password');
    if (!admin) {
      console.log('Admin user not found');
      process.exit(1);
    }

    console.log('Admin user found:');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('First Name:', admin.firstName);
    console.log('Last Name:', admin.lastName);

    // Create test password hash
    const testPassword = 'admin123';
    const isMatch = await admin.matchPassword(testPassword);
    console.log('Password match test:', isMatch);

    await mongoose.disconnect();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error checking admin:', error);
    process.exit(1);
  }
};

checkAdmin();
