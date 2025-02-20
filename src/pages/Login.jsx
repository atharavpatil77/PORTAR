//These are the key libraries used 
import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import Input from '../components/common/Input';

//This is the validation where it ensures the form data is valid 
const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required')
});

// This is the part of setup 
function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState(''); //State Management error: Displays error messages on failed login attempts.
  const [isSubmitting, setIsSubmitting] = useState(false);

  //This is the form state setup where register: Connects input fields to the form.
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  //So this is the form submission Logic 
  const onSubmit = async (data, e) => {
    e.preventDefault(); // Prevent form submission
    try {
      setIsSubmitting(true); // if success
      setError('');
      const result = await login(data);
      if (result && result.user) {
        navigate('/');  // it will navigate to the home page 
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    //this is the outer container 
    <div className="min-h-screen flex items-center justify-center space-background py-12 px-4 sm:px-6 lg:px-8">
      <motion.div //this is animated form wrapper 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8"> 
          <h2 className="text-3xl font-bold text-white neon-text">
            Sign in to Porter
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="cosmic-form" noValidate>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-4 bg-red-900 bg-opacity-20 border border-red-500 text-red-300 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {/* This is the input fields  */}

          <Input
            {...register('email')}
            type="email"
            placeholder="Email address"
            error={errors.email?.message}
            disabled={isSubmitting}
            autoComplete="email"
          />

          <Input
            {...register('password')}
            type="password"
            placeholder="Password"
            error={errors.password?.message}
            disabled={isSubmitting}
            autoComplete="current-password"
          />

          <motion.button //this is the submit button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="cosmic-button w-full"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
