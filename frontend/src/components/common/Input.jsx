import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(({ label, error, ...props }, ref) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label className="cosmic-label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className="cosmic-input"
        {...props}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="cosmic-error"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
});

export default Input;