import Driver from '../models/Driver.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

// Get all drivers
export const getAllDrivers = asyncHandler(async (req, res) => {
  const drivers = await Driver.find()
    .select('-password -verificationToken -resetPasswordToken')
    .sort({ createdAt: -1 });
  res.json(drivers);
});

// Get single driver
export const getDriver = asyncHandler(async (req, res) => {
  console.log('Getting driver with ID:', req.params.id);
  console.log('User from request:', req.user);

  const driver = await Driver.findById(req.params.id)
    .select('-password -verificationToken -resetPasswordToken');
  
  console.log('Found driver:', driver);

  if (!driver) {
    console.log('Driver not found');
    throw new ApiError(404, 'Driver not found');
  }
  
  res.json(driver);
});

// Create driver
export const createDriver = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    vehicleType,
    vehicleNumber
  } = req.body;

  // Check if driver already exists with the same phone number
  const driverExists = await Driver.findOne({ phone });
  if (driverExists) {
    throw new ApiError(400, 'A driver with this phone number already exists');
  }

  // Check if vehicle number is already registered
  const vehicleExists = await Driver.findOne({ vehicleNumber });
  if (vehicleExists) {
    throw new ApiError(400, 'This vehicle number is already registered');
  }

  // Create a temporary email using phone number
  const tempEmail = `driver${phone}@porter.com`;
  const tempPassword = `Driver@${phone}`; // Default password format

  const driver = await Driver.create({
    firstName,
    lastName,
    email: tempEmail,
    phone,
    password: tempPassword,
    vehicleType,
    vehicleNumber,
    vehicleCapacity: 1000, // Default capacity
    status: 'available',
    isVerified: true // Since we're not doing email verification
  });

  // Remove sensitive information before sending response
  const driverResponse = {
    _id: driver._id,
    firstName: driver.firstName,
    lastName: driver.lastName,
    phone: driver.phone,
    vehicleType: driver.vehicleType,
    vehicleNumber: driver.vehicleNumber,
    status: driver.status
  };

  res.status(201).json(driverResponse);
});

// Update driver
export const updateDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);

  if (!driver) {
    throw new ApiError(404, 'Driver not found');
  }

  // Update fields
  Object.assign(driver, req.body);
  
  const updatedDriver = await driver.save();
  res.json(updatedDriver);
});

// Update driver status
export const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const driver = await Driver.findById(req.params.id);

  if (!driver) {
    throw new ApiError(404, 'Driver not found');
  }

  driver.status = status;
  driver.lastActive = new Date();
  await driver.save();

  res.json({ status: driver.status, lastActive: driver.lastActive });
});

// Update driver location
export const updateLocation = asyncHandler(async (req, res) => {
  const { longitude, latitude } = req.body;
  const driver = await Driver.findById(req.params.id);

  if (!driver) {
    throw new ApiError(404, 'Driver not found');
  }

  await driver.updateLocation(longitude, latitude);
  res.json({ location: driver.currentLocation });
});

// Get nearby drivers
export const getNearbyDrivers = asyncHandler(async (req, res) => {
  const { longitude, latitude, maxDistance = 5000 } = req.query; // maxDistance in meters

  const drivers = await Driver.find({
    status: 'available',
    currentLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        $maxDistance: parseInt(maxDistance)
      }
    }
  }).select('-password');

  res.json(drivers);
});

// Delete driver
export const deleteDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  
  if (!driver) {
    throw new ApiError(404, 'Driver not found');
  }

  await driver.deleteOne();
  res.json({ message: 'Driver removed' });
});
