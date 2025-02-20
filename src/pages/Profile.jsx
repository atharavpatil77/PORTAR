import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserIcon,
  CurrencyDollarIcon,
  TruckIcon,
  StarIcon,
  PencilIcon,
  CameraIcon,
  BellIcon,
  CogIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../store/authStore';
import { XPBar } from '../components/common/GameElements';
import { Toaster, toast } from 'react-hot-toast';

function Profile() {
  const { user } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    preferences: {
      notifications: true,
      newsletter: false,
      darkMode: true
    }
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        preferences: user.preferences || {
          notifications: true,
          newsletter: false,
          darkMode: true
        }
      });
    }
  }, [user]);

  const [activeOrders] = useState([
    { id: '1', status: 'in_transit', destination: 'Mumbai', eta: '2 hours', amount: 450 },
    { id: '2', status: 'pending', destination: 'Pune', eta: 'Pending', amount: 850 }
  ]);

  const stats = {
    totalSpent: 1234.56,
    totalSaved: 345.67,
    completedOrders: 15,
    memberSince: '2024-01-01',
    rating: 4.8,
    loyaltyPoints: 350
  };

  const handleProfileUpdate = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement profile update logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        setIsLoading(true);
        // TODO: Implement image upload logic
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating upload
        toast.success('Profile picture updated!');
      }
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Image upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen space-background py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="cosmic-form text-center">
          <h2 className="text-xl font-bold text-white neon-text mb-4">Please log in to view your profile</h2>
          <Link to="/login" className="cosmic-button">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-background py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cosmic-form mb-8 relative"
        >
          <div className="flex items-start space-x-6">
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-900 border-2 border-blue-500"
              >
                {user?.photoUrl ? (
                  <img 
                    src={user.photoUrl} 
                    alt={profileData.fullName} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/128';
                    }}
                  />
                ) : (
                  <UserIcon className="w-full h-full p-6 text-gray-400" />
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <CameraIcon className="h-8 w-8 text-white" />
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleImageUpload} 
                    accept="image/*"
                    disabled={isLoading}
                  />
                </label>
              </motion.div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-gray-900" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white neon-text mb-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        className="bg-gray-800 text-white px-2 py-1 rounded"
                        disabled={isLoading}
                      />
                    ) : (
                      profileData.fullName
                    )}
                  </h1>
                  <p className="text-gray-300">{profileData.email}</p>
                  {!isEditing && (
                    <div className="flex items-center space-x-2 mt-2">
                      <StarIcon className="h-5 w-5 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">{stats.rating}</span>
                      <span className="text-gray-400">• Member since {stats.memberSince}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => isEditing ? handleProfileUpdate() : setIsEditing(true)}
                  className={`cosmic-button flex items-center space-x-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span>Loading...</span>
                  ) : isEditing ? (
                    <span>Save</span>
                  ) : (
                    <>
                      <PencilIcon className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </>
                  )}
                </button>
              </div>
              <div className="mt-4 w-full">
                <XPBar level={5} xp={stats.loyaltyPoints} maxXp={1000} />
                <p className="text-sm text-gray-400 mt-1">Loyalty Points: {stats.loyaltyPoints}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="cosmic-form"
          >
            <h2 className="text-xl font-bold text-white neon-text mb-6">Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Total Spent</span>
                </div>
                <span className="text-white font-semibold">₹{stats.totalSpent}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="text-gray-300">Total Saved</span>
                </div>
                <span className="text-white font-semibold">₹{stats.totalSaved}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TruckIcon className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">Completed Orders</span>
                </div>
                <span className="text-white font-semibold">{stats.completedOrders}</span>
              </div>
            </div>
          </motion.div>

          {/* Active Orders Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cosmic-form"
          >
            <h2 className="text-xl font-bold text-white neon-text mb-6">Active Orders</h2>
            {activeOrders.length > 0 ? (
              <div className="space-y-4">
                {activeOrders.map(order => (
                  <Link
                    key={order.id}
                    to={`/track/${order.id}`}
                    className="block p-4 rounded-lg bg-gray-900 bg-opacity-50 hover:bg-opacity-75 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-400">To: {order.destination}</p>
                        <p className="text-sm text-gray-400">ETA: {order.eta}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">₹{order.amount}</p>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500 text-white">
                          {order.status === 'in_transit' ? 'In Transit' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No active orders</p>
            )}
          </motion.div>

          {/* Settings Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="cosmic-form"
          >
            <h2 className="text-xl font-bold text-white neon-text mb-6">Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <BellIcon className="h-5 w-5 text-purple-400" />
                    <span className="text-gray-300">Push Notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.preferences.notifications}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      preferences: {
                        ...profileData.preferences,
                        notifications: e.target.checked
                      }
                    })}
                    className="toggle-checkbox"
                    disabled={isLoading}
                  />
                </label>
              </div>

              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <CogIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-300">Dark Mode</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.preferences.darkMode}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      preferences: {
                        ...profileData.preferences,
                        darkMode: e.target.checked
                      }
                    })}
                    className="toggle-checkbox"
                    disabled={isLoading}
                  />
                </label>
              </div>

              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">Newsletter</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.preferences.newsletter}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      preferences: {
                        ...profileData.preferences,
                        newsletter: e.target.checked
                      }
                    })}
                    className="toggle-checkbox"
                    disabled={isLoading}
                  />
                </label>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Profile;