import Address from '../models/Address.js';
import { ApiError } from '../utils/apiError.js';
import cacheService from '../services/cacheService.js';

const CACHE_TTL = 300; // 5 minutes

export const createAddress = async (req, res, next) => {
  try {
    const address = await Address.create({
      ...req.body,
      user: req.user.id
    });

    if (req.body.isDefault) {
      await Address.updateMany(
        { user: req.user.id, _id: { $ne: address._id } },
        { isDefault: false }
      );
    }

    // Clear user addresses cache
    cacheService.del(`user-addresses-${req.user.id}`);

    res.status(201).json(address);
  } catch (error) {
    next(error);
  }
};

export const getAddresses = async (req, res, next) => {
  try {
    const cacheKey = `user-addresses-${req.user.id}`;
    const cachedAddresses = cacheService.get(cacheKey);

    if (cachedAddresses) {
      return res.json(cachedAddresses);
    }

    const addresses = await Address.find({ user: req.user.id });
    cacheService.set(cacheKey, addresses, CACHE_TTL);

    res.json(addresses);
  } catch (error) {
    next(error);
  } 
};

export const updateAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!address) {
      throw new ApiError(404, 'Address not found');
    }

    Object.assign(address, req.body);
    
    if (req.body.isDefault) {
      await Address.updateMany(
        { user: req.user.id, _id: { $ne: address._id } },
        { isDefault: false }
      );
    }

    await address.save();
    cacheService.del(`user-addresses-${req.user.id}`);

    res.json(address);
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!address) {
      throw new ApiError(404, 'Address not found');
    }

    cacheService.del(`user-addresses-${req.user.id}`);

    res.json({ message: 'Address deleted' });
  } catch (error) {
    next(error);
  }
};

export const setDefaultAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!address) {
      throw new ApiError(404, 'Address not found');
    }

    await Address.updateMany(
      { user: req.user.id },
      { isDefault: false }
    );

    address.isDefault = true;
    await address.save();

    cacheService.del(`user-addresses-${req.user.id}`);  

    res.json(address);
  } catch (error) {
    next(error);
  }
};