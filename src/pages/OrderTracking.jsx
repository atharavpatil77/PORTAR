import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TruckIcon, 
  ClockIcon, 
  CurrencyDollarIcon, 
  MapPinIcon, 
  PhoneIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { getStatusColor, getStatusLabel } from '../utils/orderStatus';

function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        console.log('Fetched order data:', data); // Debug log
        console.log('Pickup Contact:', data.pickupContact); // Debug log
        console.log('Delivery Contact:', data.deliveryContact); // Debug log
        setOrder(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      navigate('/orders', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to delete order');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center space-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent"
          style={{
            boxShadow: '0 0 15px rgba(0, 243, 255, 0.5)'
          }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen space-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="cosmic-form bg-opacity-20 text-white" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen space-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="cosmic-form text-center py-12">
            <h3 className="text-xl font-medium text-white mb-2">Mission Not Found</h3>
            <p className="text-gray-400">The mission you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { status: 'in_transit', label: 'In Transit', icon: TruckIcon },
    { status: 'delivered', label: 'Delivered', icon: MapPinIcon },
  ];

  const currentStepIndex = steps.findIndex(step => step.status === order.status);

  return (
    <div className="min-h-screen space-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white neon-text mb-8"
        >
          Mission Tracking
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="cosmic-form">
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-gray-300 text-sm">
                  Mission ID: {order._id}
                </span>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete Order'}
                </button>
              </div>

              <div className="space-y-6">
                {/* Pickup Details Section */}
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-4">Pickup Details</h3>
                  <div className="space-y-4">
                    {/* Address */}
                    <div className="flex items-start space-x-3">
                      <div className="cosmic-icon-container mt-1">
                        <MapPinIcon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">Address</p>
                        <p className="text-white mt-1">{order.pickupAddress}</p>
                      </div>
                    </div>
                    {/* Phone */}
                    <div className="flex items-start space-x-3">
                      <div className="cosmic-icon-container mt-1">
                        <PhoneIcon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">Contact Number</p>
                        <p className="text-white mt-1">{order.pickupContact}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Details Section */}
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-4">Delivery Details</h3>
                  <div className="space-y-4">
                    {/* Address */}
                    <div className="flex items-start space-x-3">
                      <div className="cosmic-icon-container mt-1">
                        <MapPinIcon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">Address</p>
                        <p className="text-white mt-1">{order.deliveryAddress}</p>
                      </div>
                    </div>
                    {/* Phone */}
                    <div className="flex items-start space-x-3">
                      <div className="cosmic-icon-container mt-1">
                        <PhoneIcon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">Contact Number</p>
                        <p className="text-white mt-1">{order.deliveryContact}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                  <div className="absolute left-0 top-0 h-full w-px bg-gray-700" />
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.status}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative pl-8 pb-8 ${index === steps.length - 1 ? '' : 'border-l border-gray-700'}`}
                    >
                      <div className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full ${
                        index <= currentStepIndex ? 'bg-blue-500' : 'bg-gray-700'
                      }`} />
                      <div className="flex items-center space-x-3">
                        <step.icon className={`h-6 w-6 ${
                          index <= currentStepIndex ? 'text-blue-400' : 'text-gray-500'
                        }`} />
                        <span className={`font-medium ${
                          index <= currentStepIndex ? 'text-white' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="cosmic-form space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Order Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-5 w-5 text-blue-400" />
                      <span className="text-gray-400">Created</span>
                    </div>
                    <span className="text-gray-300">
                      {format(new Date(order.createdAt), 'PPpp')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CurrencyDollarIcon className="h-5 w-5 text-blue-400" />
                      <span className="text-gray-400">Cost</span>
                    </div>
                    <span className="text-gray-300">
                      ${order.cost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;
