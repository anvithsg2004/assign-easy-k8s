import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, Key, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api';
import LoaderPlanet from '../components/LoaderPlanet';

const Profile = () => {
  const { user, refreshUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    mobile: user?.mobile || '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        fullName: formData.fullName,
        mobile: formData.mobile,
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }

      await userAPI.updateProfile(updateData);
      await refreshUserProfile();
      setIsEditing(false);
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-slate-400 mt-1">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Personal Information</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </motion.button>
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-neon-cyan/20 rounded-lg">
                    <User className="h-6 w-6 text-neon-cyan" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-neon-cyan focus:border-transparent text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-neon-purple/20 rounded-lg">
                    <Mail className="h-6 w-6 text-neon-purple" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full px-3 py-2 bg-slate-800/30 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg">
                    <Phone className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-neon-cyan focus:border-transparent text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-lg">
                    <Key className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-400 mb-2">New Password (optional)</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-neon-cyan focus:border-transparent text-white"
                    />
                  </div>
                </div>

                {formData.password && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-lg">
                      <Key className="h-6 w-6 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-400 mb-2">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-neon-cyan focus:border-transparent text-white"
                      />
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple text-white rounded-lg hover:shadow-neon transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <LoaderPlanet size={20} />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </motion.button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-neon-cyan/20 rounded-lg">
                    <User className="h-6 w-6 text-neon-cyan" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Full Name</label>
                    <p className="text-lg text-white font-medium">{user?.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-neon-purple/20 rounded-lg">
                    <Mail className="h-6 w-6 text-neon-purple" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Email Address</label>
                    <p className="text-lg text-white font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg">
                    <Phone className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Mobile Number</label>
                    <p className="text-lg text-white font-medium">{user?.mobile}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-500/20 rounded-lg">
                    <Shield className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Role</label>
                    <span className={`inline-flex px-3 py-1 rounded-lg text-sm font-medium ${
                      user?.role === 'ROLE_ADMIN' 
                        ? 'bg-neon-cyan/20 text-neon-cyan' 
                        : 'bg-neon-purple/20 text-neon-purple'
                    }`}>
                      {user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'User'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Account Stats */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Account Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Member since</span>
                <span className="text-white font-medium">Recently joined</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last login</span>
                <span className="text-white font-medium">Today</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account status</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;