import React, { useState } from 'react';
import { 
  UserIcon, 
  PhoneIcon, 
  TruckIcon, 
  MagnifyingGlassIcon as SearchIcon,
  StarIcon,
  MapPinIcon,
  CheckBadgeIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { gql, useQuery, useMutation } from '@apollo/client';
import { toast, Toaster } from 'react-hot-toast';

const SEARCH_DRIVERS = gql`
  query SearchDrivers($query: String, $vehicleType: String, $status: String, $page: Int, $limit: Int) {
    searchDrivers(query: $query, vehicleType: $vehicleType, status: $status, page: $page, limit: $limit) {
      drivers {
        _id
        firstName
        lastName
        email
        phone
        vehicleType
        vehicleNumber
        vehicleCapacity
        status
        isVerified
        rating
        totalTrips
        currentLocation {
          type
          coordinates
        }
        createdAt
        updatedAt
      }
      totalCount
      hasMore
    }
  }
`;

const CREATE_DRIVER = gql`
  mutation CreateDriver($input: CreateDriverInput!) {
    createDriver(input: $input) {
      _id
      firstName
      lastName
      email
      phone
      vehicleType
      vehicleNumber
      status
      rating
      totalTrips
    }
  }
`;

const vehicleTypes = ['BIKE', 'CAR', 'VAN', 'TRUCK'];
const statusTypes = ['AVAILABLE', 'BUSY', 'OFFLINE'];

// Shared utility functions
const getVehicleIcon = (type) => {
  switch (type?.toUpperCase()) {
    case 'BIKE':
      return '🏍️';
    case 'CAR':
      return '🚗';
    case 'VAN':
      return '🚐';
    case 'TRUCK':
      return '🚛';
    default:
      return '🚗';
  }
};

const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'AVAILABLE':
      return 'bg-green-500 shadow-lg shadow-green-500/50';
    case 'BUSY':
      return 'bg-yellow-500 shadow-lg shadow-yellow-500/50';
    case 'OFFLINE':
      return 'bg-gray-500 shadow-lg shadow-gray-500/50';
    default:
      return 'bg-gray-500 shadow-lg shadow-gray-500/50';
  }
};

function DriverCard({ driver, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="cosmic-card relative overflow-hidden rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 shadow-xl cursor-pointer"
      onClick={() => onClick(driver)}
    >
      <div className="absolute top-3 right-3">
        <div className={`h-3 w-3 rounded-full ${getStatusColor(driver.status)}`} />
      </div>

      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-gray-800 text-2xl">
            {getVehicleIcon(driver.vehicleType)}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                {driver.firstName} {driver.lastName}
              </h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-gray-400">
                <PhoneIcon className="h-4 w-4 mr-2" />
                <span>{driver.phone}</span>
              </div>

              <div className="flex items-center text-gray-400">
                <TruckIcon className="h-4 w-4 mr-2" />
                <span>{driver.vehicleNumber}</span>
              </div>

              <div className="flex items-center text-gray-400">
                <StarIcon className="h-4 w-4 mr-2 text-yellow-500" />
                <span>{driver.rating?.toFixed(1) || '0.0'}</span>
              </div>

              <div className="flex items-center text-gray-400">
                <CheckBadgeIcon className="h-4 w-4 mr-2" />
                <span>{driver.totalTrips || 0} trips</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DriverDetailModal({ driver, onClose }) {
  if (!driver) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="cosmic-modal w-full max-w-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 flex justify-between items-start border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-800 text-3xl">
              {getVehicleIcon(driver.vehicleType)}
            </div>
            
            {/* Main Info Section */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                {driver.firstName} {driver.lastName}
              </h2>
              <p className="text-gray-400 mt-1">{driver.email}</p>

              <div className="flex items-center gap-2 mt-2">
                <div className={`h-2 w-2 rounded-full ${getStatusColor(driver.status)}`} />
                <span className="text-sm text-gray-400 capitalize">{driver.status}</span>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-400">
                <PhoneIcon className="h-5 w-5 mr-2" />
                <span>{driver.phone}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <UserIcon className="h-5 w-5 mr-2" />
                <span>{driver.email}</span>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Vehicle Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-400">
                <TruckIcon className="h-5 w-5 mr-2" />
                <span className="capitalize">{driver.vehicleType}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <CheckBadgeIcon className="h-5 w-5 mr-2" />
                <span>{driver.vehicleNumber}</span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-400">
                <StarIcon className="h-5 w-5 mr-2 text-yellow-500" />
                <span>{driver.rating?.toFixed(1) || '0.0'} Rating</span>
              </div>
              <div className="flex items-center text-gray-400">
                <CheckBadgeIcon className="h-5 w-5 mr-2" />
                <span>{driver.totalTrips || 0} Completed Trips</span>
              </div>
            </div>
          </div>

          {/* Location Information */}
          {driver.currentLocation && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Current Location</h3>
              <div className="flex items-center text-gray-400">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>
                  {driver.currentLocation.coordinates.join(', ')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="cosmic-button"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AddDriverModal({ show, onClose }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    vehicleType: '',
    vehicleNumber: '',
    password: 'porter123' // Default password for all drivers
  });

  const [createDriver] = useMutation(CREATE_DRIVER, {
    refetchQueries: ['SearchDrivers'],
    onCompleted: () => {
      toast.success('Driver added successfully!');
      onClose();
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        vehicleType: '',
        vehicleNumber: '',
        password: 'porter123'
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add driver');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDriver({
        variables: {
          input: formData
        }
      });
    } catch (error) {
      console.error('Error adding driver:', error);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="cosmic-modal w-full max-w-md p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add New Driver</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="cosmic-input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="cosmic-input w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="cosmic-input w-full"
                  pattern="[0-9]{10}"
                  placeholder="10-digit phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Vehicle Type</label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  className="cosmic-input w-full"
                  required
                >
                  <option value="">Select Vehicle Type</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Vehicle Number</label>
                <input
                  type="text"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  className="cosmic-input w-full"
                  placeholder="e.g., MH01AB1234"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cosmic-button"
                >
                  Add Driver
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Drivers() {
  const [showModal, setShowModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useQuery(SEARCH_DRIVERS, {
    variables: {
      query: searchQuery,
      vehicleType: selectedVehicleType || undefined,
      status: selectedStatus || undefined,
      page,
      limit: 10
    },
    fetchPolicy: 'network-only'
  });

  const handleAddDriver = async (formData) => {
    try {
      // The actual mutation is now handled in the AddDriverModal component
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to add driver');
      console.error('Add driver error:', error);
    }
  };

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver);
  };

  return (
    <div className="min-h-screen space-background py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-3xl font-bold text-white neon-text">Drivers</h1>
          <button
            onClick={() => setShowModal(true)}
            className="cosmic-button flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Driver</span>
          </button>
        </div>

        {/* Filters */}
        <div className="cosmic-form mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search drivers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cosmic-input pl-10 w-full"
              />
            </div>

            <select
              value={selectedVehicleType}
              onChange={(e) => setSelectedVehicleType(e.target.value)}
              className="cosmic-input"
            >
              <option value="">All Vehicle Types</option>
              {vehicleTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="cosmic-input"
            >
              <option value="">All Statuses</option>
              {statusTypes.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Drivers Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="cosmic-spinner" />
            <p className="text-gray-400 mt-4">Loading drivers...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">Error loading drivers. Please try again.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.searchDrivers.drivers.map(driver => (
                <DriverCard 
                  key={driver._id} 
                  driver={driver}
                  onClick={handleDriverClick}
                />
              ))}
            </div>

            {data?.searchDrivers.hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setPage(prev => prev + 1)}
                  className="cosmic-button"
                >
                  Load More
                </button>
              </div>
            )}

            {data?.searchDrivers.drivers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No drivers found</p>
              </div>
            )}
          </>
        )}
      </div>

      <AddDriverModal
        show={showModal}
        onClose={() => setShowModal(false)}
      />

      <AnimatePresence>
        {selectedDriver && (
          <DriverDetailModal
            driver={selectedDriver}
            onClose={() => setSelectedDriver(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Drivers;
