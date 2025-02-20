import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { driverOrdersApi } from '../services/api/driverOrdersApi';

const statusColors = {
  PENDING: 'bg-yellow-500',
  IN_TRANSIT: 'bg-blue-500',
  DELIVERED: 'bg-green-500',
  CANCELLED: 'bg-red-500'
};

function AdminOrders() {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDriversWithOrders();
  }, []);

  const fetchDriversWithOrders = async () => {
    try {
      setLoading(true);
      const data = await driverOrdersApi.getAllDriversWithOrders();
      console.log('Fetched data:', data);
      setDrivers(data || []);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch drivers and orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await driverOrdersApi.updateOrderStatus(orderId, newStatus);
      await fetchDriversWithOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDriverClick = (driver) => {
    console.log('Clicked driver:', driver);
    setSelectedDriver(selectedDriver?.id === driver.id ? null : driver);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] bg-opacity-95 flex justify-center items-center">
        <div className="cosmic-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] bg-opacity-95 flex justify-center items-center">
        <div className="text-white text-lg">{error}</div>
      </div>
    );
  }

  if (!drivers || drivers.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] bg-opacity-95 flex justify-center items-center">
        <div className="text-white text-lg">No drivers found with orders</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-opacity-95 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <TruckIcon className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-white">Driver Orders</h1>
        </div>

        <div className="grid gap-6">
          {drivers.map((driver) => (
            <motion.div
              key={driver.id}
              layout
              className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden"
            >
              {/* Driver Header */}
              <motion.button
                onClick={() => handleDriverClick(driver)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500 bg-opacity-20 rounded-lg">
                    <UserIcon className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-white">{driver.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                      <span>Rating: {driver.rating}</span>
                      <span>•</span>
                      <span>{driver.totalOrders} Orders</span>
                      <span>•</span>
                      <span className="text-green-400">{driver.status}</span>
                    </div>
                  </div>
                </div>
                <ChevronDownIcon
                  className={`h-6 w-6 text-gray-400 transform transition-transform duration-200 ${
                    selectedDriver?.id === driver.id ? 'rotate-180' : ''
                  }`}
                />
              </motion.button>

              {/* Orders List */}
              <AnimatePresence>
                {selectedDriver?.id === driver.id && driver.orders && driver.orders.length > 0 && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-gray-700"
                  >
                    <div className="p-6 space-y-4">
                      {driver.orders.map((order) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="bg-gray-900 bg-opacity-50 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-400">Order ID:</span>
                                <span className="text-white font-medium">{order.id}</span>
                              </div>
                              <div className="text-gray-400 text-sm mt-1">
                                {format(new Date(order.date), 'MMM dd, yyyy HH:mm')}
                              </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm ${statusColors[order.status]} bg-opacity-20 text-white`}>
                              {order.status}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-400 mb-1">Customer</div>
                              <div className="text-white">{order.customer}</div>
                            </div>
                            <div>
                              <div className="text-gray-400 mb-1">Amount</div>
                              <div className="text-white">₹{order.amount.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-gray-400 mb-1">Pickup</div>
                              <div className="text-white">{order.pickup}</div>
                            </div>
                            <div>
                              <div className="text-gray-400 mb-1">Delivery</div>
                              <div className="text-white">{order.delivery}</div>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-end space-x-3">
                            {order.status === 'PENDING' && (
                              <>
                                <button 
                                  onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                                  className="px-4 py-2 bg-red-500 bg-opacity-20 text-red-500 rounded-lg hover:bg-opacity-30 transition-colors duration-200"
                                >
                                  Cancel Order
                                </button>
                                <button 
                                  onClick={() => handleStatusUpdate(order.id, 'IN_TRANSIT')}
                                  className="px-4 py-2 bg-blue-500 bg-opacity-20 text-blue-500 rounded-lg hover:bg-opacity-30 transition-colors duration-200"
                                >
                                  Start Delivery
                                </button>
                              </>
                            )}
                            {order.status === 'IN_TRANSIT' && (
                              <button 
                                onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
                                className="px-4 py-2 bg-green-500 bg-opacity-20 text-green-500 rounded-lg hover:bg-opacity-30 transition-colors duration-200"
                              >
                                Mark as Delivered
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
