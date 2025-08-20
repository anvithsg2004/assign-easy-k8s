import React from 'react';
import { motion } from 'framer-motion';

const LoaderPlanet = ({ size = 40, className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="text-neon-cyan"
        >
          {/* Planet body */}
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="currentColor"
            className="opacity-20"
          />
          
          {/* Planet rings */}
          <ellipse
            cx="50"
            cy="50"
            rx="35"
            ry="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-60"
          />
          <ellipse
            cx="50"
            cy="50"
            rx="30"
            ry="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="opacity-40"
          />
          
          {/* Glow effect */}
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="opacity-30"
          />
        </svg>
        
        {/* Orbiting dots */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-neon-purple rounded-full"
          style={{ 
            marginTop: -1, 
            marginLeft: -1,
            transformOrigin: `${size * 0.35}px 0px` 
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
};

export default LoaderPlanet;