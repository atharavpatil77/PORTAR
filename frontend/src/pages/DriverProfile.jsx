import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  UserIcon,
  PhoneIcon,
  TruckIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

function DriverProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    vehicleType: '',
    vehicleNumber: '',
  });

  useEffect(() => {
    const fetchDriver = async () => {
      if (!id) {
        console.error('No driver ID provided');
        navigate('/drivers');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view driver details');
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:5001/api/drivers/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            throw new Error('Session expired. Please log in again.');
          }
          const data = await response.json();
          throw new Error(data.message || 'Failed to fetch driver details');
        }

        const data = await response.json();
        if (!data) {
          throw new Error('No driver data found');
        }

        setDriver(data);
        setEditFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          vehicleType: data.vehicleType || '',
          vehicleNumber: data.vehicleNumber || '',
        });
      } catch (err) {
        console.error('Error fetching driver:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:5001/api/drivers/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update driver');
      }

      setDriver(data);
      setShowEditModal(false);
      setError(null);
    } catch (err) {
      console.error('Error updating driver:', err);
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:5001/api/drivers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete driver');
      }

      navigate('/drivers');
    } catch (err) {
      console.error('Error deleting driver:', err);
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen space-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent cosmic-loader"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen space-background flex items-center justify-center">
        <div className="cosmic-error p-6 rounded-lg max-w-md w-full mx-4 text-center">
          <h2 className="text-xl font-bold text-white mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate('/drivers')}
            className="cosmic-button w-full"
          >
            Back to Drivers
          </button>
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen space-background flex items-center justify-center">
        <div className="cosmic-error p-6 rounded-lg max-w-md w-full mx-4 text-center">
          <h2 className="text-xl font-bold text-white mb-4">Driver Not Found</h2>
          <p className="text-gray-300 mb-6">The driver you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => navigate('/drivers')}
            className="cosmic-button w-full"
          >
            Back to Drivers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cosmic-form p-8"
        >
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center profile-picture-glow">
                <UserIcon className="w-8 h-8 text-blue-400" />
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-white neon-text">
                  {driver.firstName} {driver.lastName}
                </h1>
                <div className="flex items-center mt-2 text-gray-400">
                  <PhoneIcon className="w-5 h-5 mr-2" />
                  <span>{driver.phone}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEditModal(true)}
                className="cosmic-button flex items-center space-x-2"
              >
                <PencilSquareIcon className="w-5 h-5" />
                <span>Edit</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDeleteModal(true)}
                className="cosmic-button bg-red-500 bg-opacity-20 hover:bg-opacity-30 flex items-center space-x-2"
              >
                <TrashIcon className="w-5 h-5" />
                <span>Delete</span>
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="cosmic-card p-6">
              <h3 className="text-xl font-semibold text-white neon-text mb-4">Vehicle Information</h3>
              <div className="space-y-4">
                <div className="flex items-center text-gray-400">
                  <TruckIcon className="w-5 h-5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Vehicle Type</p>
                    <p className="text-white capitalize">{driver.vehicleType}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-400">
                  <div className="w-5 h-5 mr-3 flex items-center justify-center">
                    <span className="text-lg">#</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vehicle Number</p>
                    <p className="text-white">{driver.vehicleNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="cosmic-card p-6">
              <h3 className="text-xl font-semibold text-white neon-text mb-4">Status</h3>
              <div className="flex items-center">
                <span className={`status-indicator px-4 py-2 rounded-full text-sm font-medium ${
                  driver.status === 'available' ? 'bg-green-900 text-green-300' :
                  driver.status === 'busy' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-gray-700 text-gray-300'
                }`}>
                  {driver.status || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="cosmic-form max-w-md w-full mx-4 p-6"
          >
            <h2 className="text-2xl font-bold text-white neon-text mb-6">Edit Driver</h2>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  value={editFormData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="cosmic-input w-full"
                />
              </div>

              <div>
                <input
                  type="text"
                  name="lastName"
                  value={editFormData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="cosmic-input w-full"
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="cosmic-input w-full"
                />
              </div>

              <div>
                <select
                  name="vehicleType"
                  value={editFormData.vehicleType}
                  onChange={handleInputChange}
                  className="cosmic-input w-full"
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="bike">Bike</option>
                  <option value="car">Car</option>
                  <option value="van">Van</option>
                  <option value="truck">Truck</option>
                </select>
              </div>

              <div>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={editFormData.vehicleNumber}
                  onChange={handleInputChange}
                  placeholder="Vehicle Number"
                  className="cosmic-input w-full"
                />
              </div>

              {error && (
                <div className="cosmic-error text-center p-3 rounded-lg bg-red-900 bg-opacity-20">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setError(null);
                  }}
                  className="cosmic-button bg-opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cosmic-button"
                >
                  Update Driver
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="cosmic-form max-w-md w-full mx-4 p-6"
          >
            <h2 className="text-2xl font-bold text-white neon-text mb-6">Delete Driver</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this driver? This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setError(null);
                }}
                className="cosmic-button bg-opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="cosmic-button bg-red-500 bg-opacity-20 hover:bg-opacity-30"
              >
                Delete Driver
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default DriverProfile;
