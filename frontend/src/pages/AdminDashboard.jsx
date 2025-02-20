import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TruckIcon, 
  UserIcon, 
  CurrencyDollarIcon, 
  ClockIcon,
  ChartBarIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

function AdminDashboard() {
  const navigate = useNavigate();
  const stats = {
    totalOrders: 156,
    activeOrders: 23,
    revenue: 4521.75,
    totalDrivers: 12
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-opacity-95 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center space-x-4">
          <RocketLaunchIcon className="h-10 w-10 text-blue-500" />
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 glow-text">Command Center</h1>
            <p className="text-gray-400">Monitor your logistics operations</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Total Orders */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-lg hover:border-blue-500 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-white glow-text">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="p-3 bg-blue-500 bg-opacity-20 rounded-lg">
                <TruckIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </motion.div>

          {/* Active Orders */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-lg hover:border-purple-500 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Orders</p>
                <p className="text-3xl font-bold text-white glow-text">
                  {stats.activeOrders}
                </p>
              </div>
              <div className="p-3 bg-purple-500 bg-opacity-20 rounded-lg">
                <ClockIcon className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </motion.div>

          {/* Revenue */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-lg hover:border-green-500 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-white glow-text">
                  ${stats.revenue.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-green-500 bg-opacity-20 rounded-lg">
                <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </motion.div>

          {/* Drivers */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-lg hover:border-cyan-500 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Drivers</p>
                <p className="text-3xl font-bold text-white glow-text">
                  {stats.totalDrivers}
                </p>
              </div>
              <div className="p-3 bg-cyan-500 bg-opacity-20 rounded-lg">
                <UserIcon className="h-8 w-8 text-cyan-500" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white glow-text">
                Quick Actions
              </h2>
              <ChartBarIcon className="h-6 w-6 text-blue-500" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/drivers')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
              >
                <UserIcon className="h-5 w-5 mr-2" />
                Manage Drivers
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/orders')}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
              >
                <TruckIcon className="h-5 w-5 mr-2" />
                View Orders
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div variants={itemVariants}>
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white glow-text">
                Performance Metrics
              </h2>
              <ChartBarIcon className="h-6 w-6 text-purple-500" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Success Rate</p>
                <p className="text-2xl font-bold text-green-500">98%</p>
              </div>
              <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Avg Delivery Time</p>
                <p className="text-2xl font-bold text-blue-500">2.3 days</p>
              </div>
              <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Customer Rating</p>
                <p className="text-2xl font-bold text-purple-500">4.8/5</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;