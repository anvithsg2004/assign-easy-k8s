import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, User, Rocket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/signin';
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              <Rocket className="h-8 w-8 text-neon-cyan" />
              <div className="absolute inset-0 h-8 w-8 text-neon-cyan opacity-30 animate-ping" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              Mission Control
            </span>
          </motion.div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-slate-300">
              <User className="h-5 w-5" />
              <span className="font-medium">{user?.fullName}</span>
              <span className="px-2 py-1 text-xs rounded-full bg-neon-cyan/20 text-neon-cyan">
                {user?.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;