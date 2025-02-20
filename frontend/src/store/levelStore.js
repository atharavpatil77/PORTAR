import { create } from 'zustand';
import { levelApi } from '../services/api/levelApi';
import { subscribeToMissions, unsubscribeFromMissions } from '../services/api/missionApi';

const initialState = {
  levels: [],
  currentLevel: null,
  nextLevel: null,
  loading: false,
  error: null,
  completedTrips: 0
};

const useLevelStore = create((set, get) => ({
  ...initialState,

  // Fetch all levels
  fetchLevels: async () => {
    try {
      set({ loading: true, error: null });
      const response = await levelApi.getLevels();
      console.log('Fetched levels:', response);
      set({ levels: response || [], loading: false });
    } catch (error) {
      console.error('Error fetching levels:', error);
      set({ error: error.message || 'Failed to fetch levels', loading: false, levels: [] });
    }
  },

  // Fetch user's current level
  fetchCurrentLevel: async () => {
    try {
      set({ loading: true, error: null });
      const response = await levelApi.getCurrentLevel();
      console.log('Fetched current level:', response);
      set({ currentLevel: response, loading: false });
    } catch (error) {
      console.error('Error fetching current level:', error);
      set({ error: error.message || 'Failed to fetch current level', loading: false });
    }
  },

  // Fetch next level
  fetchNextLevel: async () => {
    try {
      set({ loading: true, error: null });
      const response = await levelApi.getNextLevel();
      console.log('Fetched next level:', response);
      set({ nextLevel: response, loading: false });
    } catch (error) {
      console.error('Error fetching next level:', error);
      set({ error: error.message || 'Failed to fetch next level', loading: false });
    }
  },

  // Update levels after mission completion
  updateLevelsAfterMission: async () => {
    try {
      // Fetch updated data
      await Promise.all([
        get().fetchCurrentLevel(),
        get().fetchNextLevel()
      ]);

      // Check for level up
      const oldLevel = get().currentLevel;
      const newLevel = await levelApi.getCurrentLevel();

      // If leveled up, show celebration
      if (oldLevel && newLevel && oldLevel._id !== newLevel._id) {
        // You can add a notification or celebration here
        console.log('Level Up!', newLevel);
        return {
          leveledUp: true,
          oldLevel,
          newLevel
        };
      }

      return { leveledUp: false };
    } catch (error) {
      console.error('Error updating levels after mission:', error);
      return { leveledUp: false, error };
    }
  },

  // Initialize level updates
  initializeLevelUpdates: () => {
    const handleMissionUpdate = (mission) => {
      if (mission.status === 'COMPLETED') {
        get().updateLevelsAfterMission();
      }
    };

    // Subscribe to mission updates and store the unsubscribe function
    const unsubscribe = subscribeToMissions(handleMissionUpdate);

    // Return the unsubscribe function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  },

  // Set completed trips
  setCompletedTrips: (trips) => {
    set({ completedTrips: trips });
  },

  // Get level progress
  getLevelProgress: () => {
    const { currentLevel, nextLevel, completedTrips } = get();
    if (!currentLevel || !nextLevel) return 0;

    const currentTrips = completedTrips;
    const currentLevelTrips = currentLevel.requiredTrips;
    const nextLevelTrips = nextLevel.requiredTrips;

    if (nextLevelTrips === currentLevelTrips) return 100;

    const progress = ((currentTrips - currentLevelTrips) / (nextLevelTrips - currentLevelTrips)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  },

  // Reset store
  reset: () => {
    set(initialState);
  }
}));

export default useLevelStore;
