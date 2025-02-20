//these are the all imports 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { UserIcon, EnvelopeIcon, PhoneIcon, KeyIcon } from '@heroicons/react/24/outline';
import Input from '../components/common/Input';
import useAuthStore from '../store/authStore';

// Thhis is the validation schema where Ensures all fields meet specific criteria:
const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().matches(/^\+?[\d\s-]+$/, 'Invalid phone number').required('Phone number is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password')
});

// This is the part of setup 
function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  //State and Form Setup where registerField: Used to connect input fields to react-hook-form.
  const { register: registerField, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  // This is Form Submission logic 
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError('');
      
      // Remove confirmPassword before sending
      const { confirmPassword, ...registrationData } = data;
      await register(registrationData);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // this is the UI design and layout 
  return (
    <div className="min-h-screen flex items-center justify-center space-background py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <motion.h2
            className="text-3xl font-bold text-white neon-text"
            animate={{ textShadow: ['0 0 10px #00f3ff', '0 0 20px #9d00ff', '0 0 10px #00f3ff'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Join the Cosmic Network
          </motion.h2>
          <p className="mt-2 text-gray-300">Begin your intergalactic journey</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="cosmic-form space-y-6" noValidate>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-4 bg-red-900 bg-opacity-20 border border-red-500 text-red-300 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              {...registerField('firstName')}
              type="text"
              placeholder="First Name"
              error={errors.firstName?.message}
              icon={<UserIcon className="h-5 w-5 text-gray-400" />}
              disabled={isSubmitting}
            />

            <Input
              {...registerField('lastName')}
              type="text"
              placeholder="Last Name"
              error={errors.lastName?.message}
              icon={<UserIcon className="h-5 w-5 text-gray-400" />}
              disabled={isSubmitting}
            />
          </div>

          <Input
            {...registerField('email')}
            type="email"
            placeholder="Email Address"
            error={errors.email?.message}
            icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
            disabled={isSubmitting}
            autoComplete="email"
          />

          <Input
            {...registerField('phone')}
            type="tel"
            placeholder="Phone Number"
            error={errors.phone?.message}
            icon={<PhoneIcon className="h-5 w-5 text-gray-400" />}
            disabled={isSubmitting}
            autoComplete="tel"
          />

          <Input
            {...registerField('password')}
            type="password"
            placeholder="Password"
            error={errors.password?.message}
            icon={<KeyIcon className="h-5 w-5 text-gray-400" />}
            disabled={isSubmitting}
            autoComplete="new-password"
          />

          <Input
            {...registerField('confirmPassword')}
            type="password"
            placeholder="Confirm Password"
            error={errors.confirmPassword?.message}
            icon={<KeyIcon className="h-5 w-5 text-gray-400" />}
            disabled={isSubmitting}
            autoComplete="new-password"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="cosmic-button w-full"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Register;