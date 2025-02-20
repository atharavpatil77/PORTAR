import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users'
  },
  pickupAddress: {
    type: String,
    required: true
  },
  pickupContact: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Phone number must be 10 digits']
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  deliveryContact: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Phone number must be 10 digits']
  },
  packageType: {
    type: String,
    required: true,
    enum: ['document', 'parcel', 'fragile', 'heavy']
  },
  weight: {
    type: Number,
    required: true,
    min: 0.1
  },
  description: String,
  scheduledDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    required: true,
    enum: ['standard', 'express', 'priority']
  },
  cost: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['in_transit', 'delivered', 'cancelled'],
    default: 'in_transit'
  },
  timeline: [{
    status: {
      type: String,
      enum: ['in_transit', 'delivered', 'cancelled']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  estimatedDelivery: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;