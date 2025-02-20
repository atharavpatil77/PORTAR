import Driver from '../models/Driver.js';
import Level from '../models/Level.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const resolvers = {
  Query: {
    searchDrivers: async (_, { query, vehicleType, status, page = 1, limit = 10 }) => {
      try {
        const filter = {};
        
        if (query) {
          filter.$or = [
            { firstName: { $regex: query, $options: 'i' } },
            { lastName: { $regex: query, $options: 'i' } },
            { phone: { $regex: query, $options: 'i' } },
            { vehicleNumber: { $regex: query, $options: 'i' } }
          ];
        }
        
        if (vehicleType) {
          filter.vehicleType = vehicleType.toLowerCase();
        }
        
        if (status) {
          filter.status = status.toLowerCase();
        }

        const skip = (page - 1) * limit;
        
        const [drivers, totalCount] = await Promise.all([
          Driver.find(filter).skip(skip).limit(limit),
          Driver.countDocuments(filter)
        ]);

        // For each driver, find their current level
        const driversWithLevels = await Promise.all(drivers.map(async (driver) => {
          const level = await Level.findOne({
            requiredTrips: { $lte: driver.totalTrips }
          }).sort({ requiredTrips: -1 });
          
          const driverObj = driver.toObject();
          driverObj.currentLevel = level;
          return driverObj;
        }));

        return {
          drivers: driversWithLevels,
          totalCount,
          hasMore: skip + drivers.length < totalCount
        };
      } catch (error) {
        console.error('Search drivers error:', error);
        throw new Error('Failed to search drivers');
      }
    },

    getLevels: async () => {
      try {
        return await Level.find().sort({ requiredTrips: 1 });
      } catch (error) {
        console.error('Get levels error:', error);
        throw new Error('Failed to fetch levels');
      }
    },

    getCurrentUserLevel: async (_, __, { user }) => {
      if (!user || user.role !== 'DRIVER') {
        throw new Error('Not authorized');
      }

      try {
        const driver = await Driver.findById(user._id);
        if (!driver) {
          throw new Error('Driver not found');
        }

        return await Level.findOne({
          requiredTrips: { $lte: driver.totalTrips }
        }).sort({ requiredTrips: -1 });
      } catch (error) {
        console.error('Get current level error:', error);
        throw error;
      }
    },

    getNextLevel: async (_, __, { user }) => {
      if (!user || user.role !== 'DRIVER') {
        throw new Error('Not authorized');
      }

      try {
        const driver = await Driver.findById(user._id);
        if (!driver) {
          throw new Error('Driver not found');
        }

        return await Level.findOne({
          requiredTrips: { $gt: driver.totalTrips }
        }).sort({ requiredTrips: 1 });
      } catch (error) {
        console.error('Get next level error:', error);
        throw error;
      }
    }
  },
  
  Mutation: {
    createDriver: async (_, { input }) => {
      try {
        const { firstName, lastName, phone, vehicleType, vehicleNumber, password } = input;
        
        // Check if driver with same phone number exists
        const existingDriver = await Driver.findOne({ phone });
        if (existingDriver) {
          throw new Error('Driver with this phone number already exists');
        }

        // Check if vehicle number is already registered
        const existingVehicle = await Driver.findOne({ vehicleNumber });
        if (existingVehicle) {
          throw new Error('Vehicle number is already registered');
        }

        // Generate email from name
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@porter.com`;

        // Create new driver
        const driver = new Driver({
          firstName,
          lastName,
          email,
          phone,
          password, // Will be hashed by pre-save middleware
          vehicleType: vehicleType.toLowerCase(),
          vehicleNumber: vehicleNumber.toUpperCase(),
          status: 'available',
          isVerified: true,
          rating: 5.0,
          totalTrips: 0,
          role: 'DRIVER'
        });

        await driver.save();
        
        // Remove password from response
        const driverResponse = driver.toObject();
        delete driverResponse.password;
        
        return driverResponse;
      } catch (error) {
        console.error('Create driver error:', error);
        throw error;
      }
    },

    createUser: async (_, { input }) => {
      try {
        const { firstName, lastName, email, password } = input;
        
        // Check if user with same email exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error('User with this email already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role: 'USER'
        });

        await user.save();
        
        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;
        
        return userResponse;
      } catch (error) {
        console.error('Create user error:', error);
        throw error;
      }
    },

    updateDriverStatus: async (_, { id, status }) => {
      try {
        const driver = await Driver.findByIdAndUpdate(
          id,
          { status: status.toLowerCase() },
          { new: true }
        );
        
        if (!driver) {
          throw new Error('Driver not found');
        }
        
        return driver;
      } catch (error) {
        console.error('Update driver status error:', error);
        throw error;
      }
    },

    updateDriverLocation: async (_, { id, coordinates }) => {
      try {
        const driver = await Driver.findByIdAndUpdate(
          id,
          {
            currentLocation: {
              type: 'Point',
              coordinates
            }
          },
          { new: true }
        );
        
        if (!driver) {
          throw new Error('Driver not found');
        }
        
        return driver;
      } catch (error) {
        console.error('Update driver location error:', error);
        throw error;
      }
    }
  }
};
