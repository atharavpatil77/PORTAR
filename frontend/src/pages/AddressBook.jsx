import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { MapPinIcon, BuildingOfficeIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import Input from '../components/common/Input';

const schema = yup.object().shape({
  label: yup.string().required('Label is required'),
  street: yup.string().required('Street address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('ZIP code is required'),
  country: yup.string().required('Country is required')
});

function AddressBook() {
  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAddresses([
          {
            id: '1',
            label: 'Home Base',
            street: '123 Stellar Way',
            city: 'Nebula City',
            state: 'Mars',
            zipCode: 'MARS-001',
            country: 'Solar System'
          },
          {
            id: '2',
            label: 'Command Center',
            street: '456 Galaxy Boulevard',
            city: 'Cosmos City',
            state: 'Venus',
            zipCode: 'VEN-002',
            country: 'Solar System'
          }
        ]);
      } catch (err) {
        setError('Failed to fetch coordinates');
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleDelete = async (id) => {
    try {
      // In a real app, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAddresses(addresses.filter(addr => addr.id !== id));
      setSuccessMessage('Coordinates deleted successfully');
      
      // Clear form if we're deleting the address we're currently editing
      if (editingId === id) {
        setEditingId(null);
        reset();
      }
    } catch (err) {
      setError('Failed to delete coordinates');
    }
  };

  const handleEdit = (address) => {
    setEditingId(address.id);
    // Set form values
    setValue('label', address.label);
    setValue('street', address.street);
    setValue('city', address.city);
    setValue('state', address.state);
    setValue('zipCode', address.zipCode);
    setValue('country', address.country);
  };

  const onSubmit = async (data) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingId) {
        setAddresses(addresses.map(addr => 
          addr.id === editingId ? { ...data, id: editingId } : addr
        ));
        setSuccessMessage('Coordinates updated successfully');
      } else {
        const newAddress = { ...data, id: Date.now().toString() };
        setAddresses([...addresses, newAddress]);
        setSuccessMessage('New coordinates added successfully');
      }
      
      reset();
      setEditingId(null);
    } catch (err) {
      setError('Failed to save coordinates');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.h1 
        className="text-3xl font-bold text-white neon-text mb-8"
        animate={{ textShadow: ['0 0 10px #00f3ff', '0 0 20px #9d00ff', '0 0 10px #00f3ff'] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Star Chart Registry
      </motion.h1>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-green-900 bg-opacity-20 border border-green-500 text-green-300 rounded-lg backdrop-blur-sm"
        >
          {successMessage}
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-red-900 bg-opacity-20 border border-red-500 text-red-300 rounded-lg backdrop-blur-sm"
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl border border-gray-800">
            <ul className="divide-y divide-gray-800">
              {addresses.map((address) => (
                <motion.li
                  key={address.id}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  className="px-6 py-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white neon-text">{address.label}</h3>
                      <p className="mt-1 text-gray-300">
                        {address.street}<br />
                        {address.city}, {address.state} {address.zipCode}<br />
                        {address.country}
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(address)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(address.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="cosmic-form">
            <h2 className="text-xl font-medium text-white neon-text mb-6">
              {editingId ? 'Update Coordinates' : 'Add New Coordinates'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                {...register('label')}
                placeholder="Location Name"
                error={errors.label?.message}
                icon={<MapPinIcon className="h-5 w-5 text-gray-400" />}
              />

              <Input
                {...register('street')}
                placeholder="Stellar Address"
                error={errors.street?.message}
                icon={<BuildingOfficeIcon className="h-5 w-5 text-gray-400" />}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  {...register('city')}
                  placeholder="City"
                  error={errors.city?.message}
                />

                <Input
                  {...register('state')}
                  placeholder="Planet/Region"
                  error={errors.state?.message}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  {...register('zipCode')}
                  placeholder="Sector Code"
                  error={errors.zipCode?.message}
                />

                <Input
                  {...register('country')}
                  placeholder="Star System"
                  error={errors.country?.message}
                  icon={<GlobeAltIcon className="h-5 w-5 text-gray-400" />}
                />
              </div>

              <div className="flex justify-end space-x-4">
                {editingId && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      reset({});
                    }}
                    className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:border-gray-500 hover:text-gray-200 transition-colors"
                  >
                    Cancel
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="cosmic-button"
                >
                  {editingId ? 'Update Coordinates' : 'Add Coordinates'}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AddressBook;