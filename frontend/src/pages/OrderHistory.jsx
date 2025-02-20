import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TruckIcon, 
  ClockIcon, 
  MapPinIcon, 
  TrashIcon,
  PlusIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { getStatusColor, getStatusLabel } from '../utils/orderStatus';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // API Call for Orders
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // this is for deleting the order 
  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      // Set deleting state for this specific order
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, isDeleting: true } : order
        )
      );

      const response = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete order');
      }

      // Remove only the deleted order from the list
      setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
      alert('Order deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.message || 'Failed to delete order');
      
      // Reset deleting state on error
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, isDeleting: false } : order
        )
      );
    }
  };

  return (
    <div className="min-h-screen space-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Missions</h1>
          <Link
            to="/orders/new"
            className="cosmic-button inline-flex items-center px-4 py-2"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Mission
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent"
            />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="cosmic-form bg-opacity-20 text-white p-4 rounded-lg" role="alert">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="cosmic-form text-center py-12">
                <p className="text-white text-lg">No missions found</p>
                <Link
                  to="/orders/new"
                  className="cosmic-button inline-flex items-center px-4 py-2 mt-4"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Your First Mission
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="cosmic-form"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="cosmic-icon-container">
                          <TruckIcon className="h-6 w-6 text-blue-400" />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-center space-x-3">
                          <MapPinIcon className="h-5 w-5 text-blue-400" />
                          <div>
                            <p className="text-gray-300">From: {order.pickupAddress}</p>
                            <p className="text-gray-300">To: {order.deliveryAddress}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <ClockIcon className="h-5 w-5 text-blue-400" />
                          <span className="text-gray-300">
                            {format(new Date(order.createdAt), 'PPpp')}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <CurrencyDollarIcon className="h-5 w-5 text-blue-400" />
                          <span className="text-gray-300">
                            ${order.cost.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Link
                        to={`/orders/${order._id}`}
                        className="cosmic-button inline-flex items-center px-4 py-2"
                      >
                        <TruckIcon className="h-5 w-5 mr-2" />
                        Track
                      </Link>
                      <button
                        onClick={() => handleDelete(order._id)}
                        disabled={order.isDeleting}
                        className="cosmic-button-danger inline-flex items-center px-4 py-2 disabled:opacity-50"
                      >
                        <TrashIcon className="h-5 w-5 mr-2" />
                        {order.isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;