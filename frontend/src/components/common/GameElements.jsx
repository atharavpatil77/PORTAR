import { motion } from 'framer-motion';

export const XPBar = ({ level, xp, maxXp }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="neon-text">Level {level}</span>
      <span className="text-gray-400">{xp}/{maxXp} XP</span>
    </div>
    <div className="xp-bar">
      <motion.div
        className="xp-progress"
        initial={{ width: 0 }}
        animate={{ width: `${(xp / maxXp) * 100}%` }}
        transition={{ duration: 1 }}
      />
    </div>
  </div>
);

export const AchievementBadge = ({ icon: Icon, title }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    className="achievement-badge w-16 h-16 rounded-full"
  >
    <div className="absolute inset-0 portal-ring" />
    <Icon className="w-8 h-8 text-white" />
    <span className="absolute -bottom-6 text-xs text-center w-full neon-text">
      {title}
    </span>
  </motion.div>
);

export const LevelBadge = ({ level }) => (
  <div className="level-badge">
    <span className="text-white font-bold">{level}</span>
  </div>
);

export const CosmicButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="cosmic-button"
  >
    {children}
  </button>
);