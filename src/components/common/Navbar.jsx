import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TruckIcon, UserIcon, MapIcon, ClipboardIcon, StarIcon, CogIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import useAuthStore from '../../store/authStore';

function Navbar() {
  const { isAuthenticated, logout, user } = useAuthStore();

  const getNavLinks = () => {
    if (!user) return [];

    const commonLinks = [
      { to: '/profile', icon: UserIcon, text: 'Profile' }
    ];

    switch (user.role) {
      case 'ADMIN':
        return [
          { to: '/admin', icon: ChartBarIcon, text: 'Dashboard' },
          { to: '/drivers', icon: UserIcon, text: 'Drivers' },
          { to: '/admin/orders', icon: TruckIcon, text: 'Orders' },
          ...commonLinks
        ];
      case 'DRIVER':
        return [
          { to: '/orders', icon: TruckIcon, text: 'Orders' },
          { to: '/levels', icon: StarIcon, text: 'Levels' },
          { to: '/addresses', icon: MapIcon, text: 'Addresses' },
          ...commonLinks
        ];
      case 'USER':
        return [
          { to: '/order/new', icon: ClipboardIcon, text: 'New Order' },
          { to: '/orders', icon: TruckIcon, text: 'Orders' },
          { to: '/addresses', icon: MapIcon, text: 'Addresses' },
          { to: '/levels', icon: StarIcon, text: 'Levels' },
          ...commonLinks
        ];
      default:
        return commonLinks;
    }
  };

  return (
    <motion.nav 
      className="bg-gray-900 bg-opacity-50 backdrop-blur-lg border-b border-gray-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <TruckIcon className="h-8 w-8 text-white" />
            </motion.div>
            <span className="text-white font-bold text-xl neon-text">Porter</span>
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-6">
              {getNavLinks().map(link => (
                <NavLink key={link.to} to={link.to} icon={link.icon}>
                  {link.text}
                </NavLink>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="text-white hover:text-gray-200 transition-colors cosmic-button"
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ to, icon: Icon, children }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link 
        to={to} 
        className="flex items-center space-x-1 text-white hover:text-gray-200 transition-colors"
      >
        {Icon && <Icon className="h-5 w-5" />}
        <span>{children}</span>
      </Link>
    </motion.div>
  );
}

export default Navbar;