import React from 'react';
import { motion } from 'framer-motion';

const CardStat = ({ title, value, icon: Icon, color = 'cyan', trend, delay = 0 }) => {
  const colorClasses = {
    cyan: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
    orange: 'from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(125, 211, 252, 0.3)' }}
      className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-md rounded-xl border p-6 shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: 'spring' }}
            className="text-3xl font-bold text-white mt-2"
          >
            {value}
          </motion.p>
          {trend && (
            <p className={`text-sm mt-1 ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.value}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
};

export default CardStat;
