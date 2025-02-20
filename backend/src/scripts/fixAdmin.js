import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const fixAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@porter.com';
    const password = 'admin123';
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update admin user
    const updatedAdmin = await User.findOneAndUpdate(
      { email: adminEmail },
      {
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        password: hashedPassword
      },
      { new: true }
    );

    if (!updatedAdmin) {
      console.log('Admin user not found');
      process.exit(1);
    }

    console.log('Admin user updated successfully:');
    console.log('Email:', updatedAdmin.email);
    console.log('Role:', updatedAdmin.role);
    console.log('First Name:', updatedAdmin.firstName);
    console.log('Last Name:', updatedAdmin.lastName);

    await mongoose.disconnect();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing admin:', error);
    process.exit(1);
  }
};

fixAdmin();
