import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Trash2, Shield, Mail, Phone, User } from 'lucide-react';
import { userAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import LoaderPlanet from './LoaderPlanet';

const UserManagement = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin()) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.deleteUser(userId);
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (!isAdmin()) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoaderPlanet size={60} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-3">
        <Users className="h-6 w-6 text-neon-cyan" />
        <h2 className="text-2xl font-bold text-white">User Management</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-neon-cyan/30 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-neon-cyan" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{user.fullName}</h3>
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${user.role === 'ROLE_ADMIN'
                    ? 'bg-neon-cyan/20 text-neon-cyan'
                    : 'bg-neon-purple/20 text-neon-purple'
                    }`}>
                    {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                  </span>
                </div>
              </div>

              {user.role !== 'ROLE_ADMIN' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteUser(user.id)}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              )}

            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Phone className="h-4 w-4" />
                <span>{user.mobile}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {users.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-slate-400 text-lg">No users found</div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserManagement;