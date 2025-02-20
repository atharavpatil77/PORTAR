import { motion } from 'framer-motion';

function Footer() {
  return (
    <footer className="bg-gray-900 bg-opacity-50 backdrop-blur-lg text-white py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 neon-text">Porter Logistics</h3>
            <p className="text-gray-300">Reliable logistics solutions for your business</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-4 neon-text">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <motion.a 
                  whileHover={{ x: 5 }}
                  href="/about" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About Us
                </motion.a>
              </li>
              <li>
                <motion.a 
                  whileHover={{ x: 5 }}
                  href="/contact" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact
                </motion.a>
              </li>
              <li>
                <motion.a 
                  whileHover={{ x: 5 }}
                  href="/terms" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Terms of Service
                </motion.a>
              </li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold mb-4 neon-text">Contact Us</h3>
            <p className="text-gray-300">Email: atharavpatil01@gmail.com</p>
            <p className="text-gray-300">Phone: 9021678455</p>
          </motion.div>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 pt-8 border-t border-gray-800 text-center"
        >
          <p className="text-gray-300">&copy; {new Date().getFullYear()} Porter Logistics. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;