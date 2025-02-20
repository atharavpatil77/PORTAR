import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import useLevelStore from '../store/levelStore';
import { FaTrophy, FaLock, FaUnlock, FaStar } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import confetti from 'canvas-confetti';

const LevelUpCelebration = ({ level, onClose }) => {
  useEffect(() => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Close after 5 seconds
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <div className="bg-gray-900 border-2 border-blue-500 rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <FaStar className="text-6xl text-yellow-500 mx-auto mb-4" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-4">Level Up!</h2>
        <p className="text-xl text-blue-400 mb-4">
          Congratulations! You've reached Level {level.name}
        </p>
        <div className="bg-blue-900 bg-opacity-50 rounded p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">New Rewards:</h3>
          <p className="text-gray-300">{level.rewards}</p>
        </div>
        <button
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
};

const Levels = () => {
  const { user } = useAuthStore();
  const { 
    levels, 
    currentLevel, 
    nextLevel, 
    loading, 
    error,
    fetchLevels,
    fetchCurrentLevel,
    fetchNextLevel,
    initializeLevelUpdates,
    updateLevelsAfterMission
  } = useLevelStore();
  
  const [progress, setProgress] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchLevels();
        await Promise.all([
          fetchCurrentLevel(),
          fetchNextLevel()
        ]);
      } catch (error) {
        console.error('Error loading levels:', error);
      }
    };

    let unsubscribe;
    if (user) {
      loadData();
      // Initialize mission updates subscription
      unsubscribe = initializeLevelUpdates();
    }

    // Cleanup function
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user, fetchLevels, fetchCurrentLevel, fetchNextLevel, initializeLevelUpdates]);

  useEffect(() => {
    if (currentLevel && nextLevel && user) {
      const currentTrips = user.completedTrips || 0;
      const currentLevelTrips = currentLevel.requiredTrips;
      const nextLevelTrips = nextLevel.requiredTrips;
      
      const progressValue = nextLevelTrips === currentLevelTrips 
        ? 100 
        : ((currentTrips - currentLevelTrips) / (nextLevelTrips - currentLevelTrips)) * 100;
      
      setProgress(Math.min(Math.max(progressValue, 0), 100));
    }
  }, [currentLevel, nextLevel, user]);

  // Handle mission completion
  const handleMissionComplete = async () => {
    const result = await updateLevelsAfterMission();
    if (result.leveledUp) {
      setNewLevel(result.newLevel);
      setShowLevelUp(true);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (!levels || levels.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold text-gray-300">No levels available at the moment.</h2>
      </div>
    );
  }

  const roleText = user?.role === 'DRIVER' ? 'Driver' : 'Customer';

  return (
    <>
      <AnimatePresence>
        {showLevelUp && newLevel && (
          <LevelUpCelebration 
            level={newLevel} 
            onClose={() => setShowLevelUp(false)} 
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 space-background">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white neon-text mb-4">
              {roleText} Levels
            </h1>
            <p className="text-gray-300">
              {user?.role === 'DRIVER' 
                ? 'Complete more deliveries to unlock new levels and rewards'
                : 'Book more deliveries to unlock exclusive benefits and rewards'}
            </p>
          </motion.div>

          {/* Current Level Section */}
          {currentLevel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 bg-opacity-60 rounded-lg p-6 mb-12 border border-blue-500"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Current Level: {currentLevel.name}
                  </h2>
                  <p className="text-gray-300">{currentLevel.description}</p>
                </div>
                <FaTrophy className="h-12 w-12 text-yellow-500" />
              </div>

              <div className="mb-6">
                <p className="font-medium text-green-400 mb-2">Current Rewards:</p>
                <p className="text-gray-300">{currentLevel.rewards}</p>
              </div>

              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-500 bg-blue-200 bg-opacity-20">
                      Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-400">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 bg-opacity-20">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{user?.completedTrips || 0} trips completed</span>
                  <span>{nextLevel ? nextLevel.requiredTrips : currentLevel.requiredTrips} trips needed</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* All Levels Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {levels.map((level, index) => {
              const isCurrentLevel = currentLevel && currentLevel._id === level._id;
              const isUnlocked = (user?.completedTrips || 0) >= level.requiredTrips;

              return (
                <motion.div
                  key={level._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-lg border ${
                    isCurrentLevel
                      ? 'bg-blue-900 bg-opacity-40 border-blue-500'
                      : isUnlocked
                      ? 'bg-green-900 bg-opacity-40 border-green-500'
                      : 'bg-gray-900 bg-opacity-60 border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{level.name}</h3>
                      {isUnlocked ? (
                        <FaUnlock className="text-green-400" />
                      ) : (
                        <FaLock className="text-gray-500" />
                      )}
                    </div>
                    {isCurrentLevel && (
                      <FaTrophy className="h-8 w-8 text-yellow-500" />
                    )}
                  </div>

                  <p className="text-gray-300 mb-4">{level.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-300">
                      <span className="font-semibold mr-2">Required Trips:</span>
                      {level.requiredTrips}
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="font-semibold mr-2">Rewards:</span>
                      {level.rewards}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Levels;
