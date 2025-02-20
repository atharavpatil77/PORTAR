import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { generateToken } from '../utils/auth.js';
import emailService from '../services/emailService.js';
import notificationService from '../services/notificationService.js';

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new ApiError(400, 'User already exists');
    }

    // By default, new registrations are USER role
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: 'USER'
    });

    // Send welcome email
    await emailService.sendWelcomeEmail(user);

    res.status(201).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Remove password from response
    user.password = undefined;

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        throw new ApiError(400, 'Email already in use');
      }
    }

    if (req.body.currentPassword) {
      const isMatch = await user.matchPassword(req.body.currentPassword);
      if (!isMatch) {
        throw new ApiError(401, 'Current password is incorrect');
      }
      user.password = req.body.newPassword;
    }

    // Don't allow role updates through profile update
    delete req.body.role;

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.json({
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Admin only endpoint to change user roles
export const updateUserRole = async (req, res, next) => {
  try {
    // Check if requester is admin
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== 'ADMIN') {
      throw new ApiError(403, 'Not authorized to update roles');
    }

    const { userId, role } = req.body;
    if (!['ADMIN', 'USER', 'DRIVER'].includes(role)) {
      throw new ApiError(400, 'Invalid role');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    user.role = role;
    await user.save();

    res.json({
      message: 'User role updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
