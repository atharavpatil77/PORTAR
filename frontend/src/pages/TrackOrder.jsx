import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  TruckIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
  PhoneIcon,
  CurrencyDollarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { ORDER_STATUS, getStatusColor, getStatusLabel } from '../utils/orderStatus';

const timelineStatuses = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PICKED_UP,
  ORDER_STATUS.IN_TRANSIT,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED
];

function TrackOrder() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen space-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent"
          style={{ boxShadow: '0 0 15px rgba(0, 243, 255, 0.5)' }}
        />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen space-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="cosmic-form text-center py-12">
            <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-white mb-2">Error Loading Mission</h2>
            <p className="text-gray-400 mb-6">{error || 'Mission not found'}</p>
            <Link to="/orders" className="cosmic-button inline-flex items-center">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Missions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStatusIndex = timelineStatuses.indexOf(order.status);

  return (
    <div className="min-h-screen space-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-white neon-text"
          >
            Mission Tracking
          </motion.h1>
          <Link to="/orders" className="cosmic-button inline-flex items-center">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Missions
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cosmic-form space-y-8"
        >
          {/* Status Timeline */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-white neon-text">Mission Status</h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gray-700" />
              <div className="space-y-8">
                {timelineStatuses.map((status, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  
                  return (
                    <motion.div
                      key={`timeline-${status}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative flex items-center ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        key={`dot-${status}-${index}`}
                        className={`w-4 h-4 rounded-full absolute left-1/2 transform -translate-x-1/2 ${
                          isCompleted ? 'bg-blue-500' : 'bg-gray-700'
                        } ${isCurrent ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                      />
                      <div
                        key={`content-${status}-${index}`}
                        className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}
                      >
                        <div className={`inline-flex items-center space-x-2 ${
                          isCompleted ? 'text-blue-400' : 'text-gray-500'
                        }`}>
                          <span className="font-medium">{getStatusLabel(status)}</span>
                          {isCompleted && <CheckCircleIcon className="h-5 w-5" />}
                        </div>
                        {isCurrent && order.statusUpdateTime && (
                          <p className="text-sm text-gray-400">
                            {format(new Date(order.statusUpdateTime), 'PPp')}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mission Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pickup Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-white neon-text">Pickup Details</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="h-5 w-5 text-blue-400 mt-1" />
                  <div>
                    <p className="text-gray-300">{order.pickupAddress}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-blue-400" />
                  <p className="text-gray-300">{order.pickupContact}</p>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-white neon-text">Delivery Details</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="h-5 w-5 text-blue-400 mt-1" />
                  <div>
                    <p className="text-gray-300">{order.deliveryAddress}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-blue-400" />
                  <p className="text-gray-300">{order.deliveryContact}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-white neon-text">Package Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Package Type</p>
                  <p className="text-gray-300">{order.packageType}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <TruckIcon className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Weight</p>
                  <p className="text-gray-300">{order.weight} kg</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ClockIcon className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Scheduled Date</p>
                  <p className="text-gray-300">{format(new Date(order.scheduledDate), 'PPp')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CurrencyDollarIcon className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Cost</p>
                  <p className="text-gray-300">₹{order.cost}</p>
                </div>
              </div>
            </div>
            {order.description && (
              <div className="mt-4">
                <p className="text-sm text-gray-400">Description</p>
                <p className="text-gray-300 mt-1">{order.description}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default TrackOrder;