import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TruckIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import useAuthStore from '../store/authStore';
import DeliveryAnimation from '../components/animations/DeliveryAnimation';
import { XPBar, AchievementBadge } from '../components/common/GameElements';

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

function Dashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        <motion.div 
          variants={itemVariants} 
          className="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-8 border border-gray-800"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <motion.h1 
                className="text-4xl font-bold text-white neon-text"
                animate={{ textShadow: ['0 0 10px #00f3ff', '0 0 20px #9d00ff', '0 0 10px #00f3ff'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Welcome, Commander {user?.fullName || 'User'}
              </motion.h1>
              <p className="text-xl text-gray-300">Your Intergalactic Logistics Dashboard</p>
              <XPBar level={5} xp={350} maxXp={1000} />
            </div>
            <DeliveryAnimation className="w-48 h-48" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/order/new">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(0,243,255,0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-800 text-white"
            >
              <motion.div
                // animate={{ rotate: 360 }}
                // transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <TruckIcon className="h-12 w-12 mb-4 text-blue-400" />
              </motion.div>
              <h2 className="text-2xl font-semibold mb-2 neon-text">New Mission</h2>
              <p className="text-gray-300">Launch a new delivery mission</p>
            </motion.div>
          </Link>

          <Link to="/orders">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(157,0,255,0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-800 text-white"
            >
              <motion.div
                // animate={{ rotate: 360 }}
                // transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <ClockIcon className="h-12 w-12 mb-4 text-purple-400" />
              </motion.div>
              <h2 className="text-2xl font-semibold mb-2 neon-text">Track Fleet</h2>
              <p className="text-gray-300">Monitor your active missions</p>
            </motion.div>
          </Link>

          <Link to="/addresses">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(0,243,255,0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-800 text-white"
            >
              <motion.div
                // animate={{ rotate: 360 }}
                // transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <MapPinIcon className="h-12 w-12 mb-4 text-cyan-400" />
              </motion.div>
              <h2 className="text-2xl font-semibold mb-2 neon-text">Star Charts</h2>
              <p className="text-gray-300">Manage saved coordinates</p>
            </motion.div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-white neon-text mb-6">Mission Updates</h2>
          <div className="space-y-4">
            <motion.div
              whileHover={{ x: 10 }}
              className="border-l-4 border-blue-500 pl-4 transition-all"
            >
              <h3 className="font-semibold text-white neon-text">Quantum Tracking</h3>
              <p className="text-gray-300">Real-time fleet monitoring with quantum precision</p>
            </motion.div>
            <motion.div
              whileHover={{ x: 10 }}
              className="border-l-4 border-purple-500 pl-4 transition-all"
            >
              <h3 className="font-semibold text-white neon-text">Network Expansion</h3>
              <p className="text-gray-300">New hyperspace routes unlocked for faster delivery</p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Dashboard;