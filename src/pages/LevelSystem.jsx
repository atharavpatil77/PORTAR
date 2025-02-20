import { motion } from 'framer-motion';
import { TrophyIcon, StarIcon, SparklesIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { XPBar, AchievementBadge, LevelBadge } from '../components/common/GameElements';

const achievements = [
  {
    icon: TrophyIcon,
    title: 'First Mission',
    description: 'Complete your first delivery mission',
    xp: 100
  },
  {
    icon: StarIcon,
    title: 'Speed Runner',
    description: 'Complete 5 deliveries ahead of schedule',
    xp: 250
  },
  {
    icon: SparklesIcon,
    title: 'Perfect Route',
    description: 'Achieve 100% efficiency rating on a delivery',
    xp: 500
  },
  {
    icon: RocketLaunchIcon,
    title: 'Space Explorer',
    description: 'Deliver to 10 different star systems',
    xp: 1000
  }
];

const levels = [
  {
    level: 1,
    title: 'Cadet',
    requiredXp: 0,
    perks: ['Basic delivery missions', 'Standard cargo capacity']
  },
  {
    level: 5,
    title: 'Navigator',
    requiredXp: 1000,
    perks: ['Priority routing', 'Extended cargo capacity', '5% speed boost']
  },
  {
    level: 10,
    title: 'Commander',
    requiredXp: 5000,
    perks: ['VIP missions', 'Premium cargo handling', '10% speed boost', 'Special cargo types']
  },
  {
    level: 20,
    title: 'Fleet Admiral',
    requiredXp: 15000,
    perks: ['Intergalactic missions', 'Unlimited cargo capacity', '20% speed boost', 'Exclusive routes']
  }
];

function LevelSystem() {
  return (
    <div className="min-h-screen space-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white neon-text mb-4">
            Intergalactic Ranking System
          </h1>
          <p className="text-xl text-gray-300">
            Rise through the ranks and unlock cosmic rewards
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="cosmic-form"
          >
            <h2 className="text-2xl font-bold text-white neon-text mb-6">
              Your Progress
            </h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <LevelBadge level={5} />
                <div className="flex-1">
                  <h3 className="text-white font-semibold">Navigator</h3>
                  <XPBar level={5} xp={350} maxXp={1000} />
                </div>
              </div>
              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-white font-semibold mb-4">Active Perks</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-300">
                    <SparklesIcon className="h-5 w-5 mr-2 text-blue-400" />
                    Priority routing
                  </li>
                  <li className="flex items-center text-gray-300">
                    <RocketLaunchIcon className="h-5 w-5 mr-2 text-purple-400" />
                    Extended cargo capacity
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="cosmic-form"
          >
            <h2 className="text-2xl font-bold text-white neon-text mb-6">
              Recent Achievements
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <AchievementBadge
                    icon={achievement.icon}
                    title={achievement.title}
                  />
                  <p className="mt-8 text-sm text-gray-300">{achievement.description}</p>
                  <span className="mt-1 text-sm text-blue-400">+{achievement.xp} XP</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cosmic-form"
        >
          <h2 className="text-2xl font-bold text-white neon-text mb-6">
            Rank Progression
          </h2>
          <div className="space-y-8">
            {levels.map((level, index) => (
              <motion.div
                key={level.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-4 rounded-lg bg-gray-900 bg-opacity-50"
              >
                <LevelBadge level={level.level} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white neon-text">
                      {level.title}
                    </h3>
                    <span className="text-sm text-gray-400">
                      {level.requiredXp} XP required
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {level.perks.map((perk, perkIndex) => (
                      <li
                        key={perkIndex}
                        className="text-sm text-gray-300 flex items-center"
                      >
                        <SparklesIcon className="h-4 w-4 mr-2 text-blue-400" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LevelSystem;