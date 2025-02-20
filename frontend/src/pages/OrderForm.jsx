import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { MapPinIcon, TruckIcon, ScaleIcon, DocumentTextIcon, CalendarIcon, CurrencyDollarIcon, PhoneIcon } from '@heroicons/react/24/outline';

const schema = yup.object().shape({
  pickupAddress: yup.string()
    .required('Pickup address is required'),
  pickupContact: yup.string()
    .matches(/^[0-9]{10}$/, 'Contact number must be 10 digits')
    .required('Pickup contact is required'),
  deliveryAddress: yup.string()
    .required('Delivery address is required'),
  deliveryContact: yup.string()
    .matches(/^[0-9]{10}$/, 'Contact number must be 10 digits')
    .required('Delivery contact is required'),
  packageType: yup.string()
    .oneOf(['document', 'parcel', 'fragile', 'heavy'], 'Invalid package type')
    .required('Package type is required'),
  weight: yup.number()
    .positive('Weight must be positive')
    .required('Weight is required'),
  description: yup.string()
    .max(500, 'Description cannot exceed 500 characters'),
  scheduledDate: yup.date()
    .min(new Date(), 'Scheduled date must be in the future')
    .required('Scheduled date is required'),
  priority: yup.string()
    .oneOf(['standard', 'express', 'priority'], 'Invalid priority level')
    .required('Priority level is required')
});

const packageTypes = [
  { value: 'document', label: 'Document' },
  { value: 'parcel', label: 'Parcel' },
  { value: 'fragile', label: 'Fragile' },
  { value: 'heavy', label: 'Heavy' }
];

const priorityLevels = [
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'priority', label: 'Priority' }
];

function OrderForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      priority: 'standard'
    }
  });

  const weight = watch('weight');
  const priority = watch('priority');

  // Calculate estimated cost whenever weight or priority changes
  React.useEffect(() => {
    if (weight && priority) {
      let baseRate = 50; // Base rate per kg
      let priorityMultiplier = {
        standard: 1,
        express: 1.5,
        priority: 2
      };
      
      const cost = weight * baseRate * priorityMultiplier[priority];
      setEstimatedCost(Math.round(cost));
    }
  }, [weight, priority]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError('');

      // Calculate estimated delivery based on priority
      const estimatedDeliveryDays = {
        standard: 3,
        express: 2,
        priority: 1
      };

      const scheduledDate = new Date(data.scheduledDate);
      const estimatedDelivery = new Date(scheduledDate);
      estimatedDelivery.setDate(estimatedDelivery.getDate() + estimatedDeliveryDays[data.priority]);

      // Calculate cost based on weight and priority
      const baseRate = 50; // Base rate per kg
      const priorityMultiplier = {
        standard: 1,
        express: 1.5,
        priority: 2
      };
      const cost = parseFloat(data.weight) * baseRate * priorityMultiplier[data.priority];

      const formattedData = {
        pickupAddress: data.pickupAddress,
        pickupContact: data.pickupContact,
        deliveryAddress: data.deliveryAddress,
        deliveryContact: data.deliveryContact,
        packageType: data.packageType,
        weight: parseFloat(data.weight),
        description: data.description || '',
        scheduledDate: scheduledDate.toISOString(),
        priority: data.priority,
        status: 'in_transit',
        cost: Math.round(cost),
        estimatedDelivery: estimatedDelivery.toISOString(),
        timeline: [{
          status: 'in_transit',
          timestamp: new Date().toISOString()
        }]
      };

      console.log('Sending data:', formattedData); // Debug log

      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData); // Debug log
        throw new Error(Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message);
      }

      const result = await response.json();
      navigate('/orders', { replace: true }); // Navigate to orders list after successful creation
    } catch (err) {
      console.error('Submit error:', err); // Debug log
      setError(err.message || 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen space-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white neon-text mb-8"
        >
          Create New Mission
        </motion.h1>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-900 bg-opacity-20 border border-red-500 text-red-300 rounded-lg backdrop-blur-sm"
          >
            {error}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cosmic-form space-y-6"
        >
          {/* Pickup Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-white neon-text">Pickup Details</h2>
            <div className="relative">
              <textarea
                {...register('pickupAddress')}
                rows={2}
                placeholder="Enter complete pickup address"
                className="cosmic-input pl-10 w-full"
              />
              <MapPinIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              {errors.pickupAddress && (
                <p className="mt-1 text-sm text-red-400">{errors.pickupAddress.message}</p>
              )}
            </div>

            <div className="relative">
              <input
                {...register('pickupContact')}
                type="text"
                placeholder="Contact Number"
                className="cosmic-input pl-10 w-full"
              />
              <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              {errors.pickupContact && (
                <p className="mt-1 text-sm text-red-400">{errors.pickupContact.message}</p>
              )}
            </div>
          </div>

          {/* Delivery Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-white neon-text">Delivery Details</h2>
            <div className="relative">
              <textarea
                {...register('deliveryAddress')}
                rows={2}
                placeholder="Enter complete delivery address"
                className="cosmic-input pl-10 w-full"
              />
              <TruckIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              {errors.deliveryAddress && (
                <p className="mt-1 text-sm text-red-400">{errors.deliveryAddress.message}</p>
              )}
            </div>

            <div className="relative">
              <input
                {...register('deliveryContact')}
                type="text"
                placeholder="Contact Number"
                className="cosmic-input pl-10 w-full"
              />
              <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              {errors.deliveryContact && (
                <p className="mt-1 text-sm text-red-400">{errors.deliveryContact.message}</p>
              )}
            </div>
          </div>

          {/* Package Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-white neon-text">Package Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Package Type</label>
                <div className="relative">
                  <select
                    {...register('packageType')}
                    className="cosmic-input pl-10 w-full"
                  >
                    <option value="">Select Type</option>
                    {packageTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <DocumentTextIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                {errors.packageType && (
                  <p className="mt-1 text-sm text-red-400">{errors.packageType.message}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-1">Weight (kg)</label>
                <div className="relative">
                  <input
                    {...register('weight')}
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="Weight in kg"
                    className="cosmic-input pl-10 w-full"
                  />
                  <ScaleIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                {errors.weight && (
                  <p className="mt-1 text-sm text-red-400">{errors.weight.message}</p>
                )}
              </div>
            </div>

            <div className="relative">
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Package Description (optional)"
                className="cosmic-input pl-10 w-full"
              />
              <DocumentTextIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Shipping Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-white neon-text">Shipping Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-1">Scheduled Date</label>
                <div className="relative">
                  <input
                    {...register('scheduledDate')}
                    type="datetime-local"
                    className="cosmic-input pl-10 w-full"
                  />
                  <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                {errors.scheduledDate && (
                  <p className="mt-1 text-sm text-red-400">{errors.scheduledDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Priority Level</label>
                <select
                  {...register('priority')}
                  className="cosmic-input w-full"
                >
                  {priorityLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
                {errors.priority && (
                  <p className="mt-1 text-sm text-red-400">{errors.priority.message}</p>
                )}
              </div>
            </div>
          </div>

          {estimatedCost && (
            <div className="p-4 bg-blue-900 bg-opacity-20 border border-blue-500 rounded-lg backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Estimated Cost:</span>
                <span className="text-2xl font-bold text-white">₹{estimatedCost}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="cosmic-button inline-flex items-center"
            >
              {isSubmitting ? 'Creating...' : 'Create Mission'}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

export default OrderForm;