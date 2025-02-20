import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const driverSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  profilePicture: {
    type: String,
    default: 'default-avatar.png'
  },

  // Vehicle Information
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: ['bike', 'car', 'van', 'truck']
  },
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle number is required'],
    unique: true,
    uppercase: true
  },
  vehicleCapacity: {
    type: Number,
    default: 1000
  },

  // Status
  status: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available'
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  
  // Optional fields with defaults
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalTrips: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
driverSchema.index({ currentLocation: '2dsphere' });

// Pre-save middleware to hash password
driverSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Driver = mongoose.model('Driver', driverSchema);

export default Driver;
