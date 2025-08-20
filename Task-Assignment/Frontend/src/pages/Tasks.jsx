import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { taskAPI, userAPI } from '../api';
import TaskTable from '../components/TaskTable';
import LoaderPlanet from '../components/LoaderPlanet';
import { useToast } from '../hooks/useToast';

const Tasks = () => {
  const { user, isAdmin } = useAuth();
  const { success, error } = useToast();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
    if (isAdmin()) {
      fetchUsers();
    }
  }, [user, isAdmin]);

  const fetchTasks = async () => {
    try {
      let response;
      if (isAdmin()) {
        response = await taskAPI.getAllTasks();
      } else {
        response = await taskAPI.getVisibleTasks();
      }
      // Handle paginated response
      setTasks(response.data.content || response.data || []);
    } catch (err) {
      error('Error fetching tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await taskAPI.createTask(taskData);
      success('Task created successfully');
      fetchTasks();
      setShowCreateModal(false);
    } catch (err) {
      error('Error creating task');
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await taskAPI.updateTask(selectedTask.id, taskData);
      success('Task updated successfully');
      fetchTasks();
      setShowEditModal(false);
      setSelectedTask(null);
    } catch (err) {
      error('Error updating task');
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (task) => {
    if (window.confirm('Are you sure you want to delete this task? This will also delete all task history.')) {
      try {
        await taskAPI.deleteTask(task.id);
        success('Task and its history deleted successfully');
        fetchTasks();
      } catch (err) {
        error('Error deleting task');
        console.error('Error deleting task:', err);
      }
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {isAdmin() ? 'All Tasks' : 'Available Tasks'}
          </h1>
          <p className="text-slate-400 mt-1">
            {isAdmin() ? 'Manage and assign tasks' : 'View available tasks and submit solutions'}
          </p>
        </div>

        {isAdmin() && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-neon-cyan to-neon-purple px-4 py-2 rounded-lg text-white font-medium shadow-lg hover:shadow-neon transition-all"
          >
            <Plus className="h-5 w-5" />
            <span>Create Task</span>
          </motion.button>
        )}
      </div>

      {/* Tasks Table */}
      <TaskTable
        tasks={tasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onRefresh={fetchTasks}
      />

      {/* Create Task Modal */}
      <TaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTask}
        users={users}
        title="Create New Task"
      />

      {/* Edit Task Modal */}
      <TaskModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTask(null);
        }}
        onSubmit={handleUpdateTask}
        users={users}
        title="Edit Task"
        initialData={selectedTask}
      />
    </motion.div>
  );
};

const TaskModal = ({ isOpen, onClose, onSubmit, users, title, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    tags: '',
    assignedUserIds: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        deadline: initialData.deadline ? new Date(initialData.deadline).toISOString().slice(0, 16) : '',
        tags: initialData.tags ? initialData.tags.join(', ') : '',
        assignedUserIds: initialData.assignedUserIds || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        deadline: '',
        tags: '',
        assignedUserIds: [],
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
    };
    onSubmit(taskData);
  };

  const handleUserSelection = (userId) => {
    setFormData(prev => ({
      ...prev,
      assignedUserIds: prev.assignedUserIds.includes(userId)
        ? prev.assignedUserIds.filter(id => id !== userId)
        : [...prev.assignedUserIds, userId]
    }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-semibold text-white">
              {title}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-neon-cyan focus:border-transparent text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-neon-cyan focus:border-transparent text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Deadline
              </label>
              <input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-neon-cyan focus:border-transparent text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="frontend, react, urgent"
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-neon-cyan focus:border-transparent text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Assign to Users (Multiple Selection)
              </label>
              <p className="text-xs text-slate-400 mb-3">
                Leave empty to make task available to all users. Select specific users to assign directly.
              </p>
              <div className="max-h-40 overflow-y-auto border border-slate-700 rounded-lg p-3 bg-slate-800/30">
                {users.map((user) => (
                  <label key={user.id} className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-slate-700/30 rounded px-2">
                    <input
                      type="checkbox"
                      checked={formData.assignedUserIds.includes(user.id)}
                      onChange={() => handleUserSelection(user.id)}
                      className="rounded border-slate-600 text-neon-cyan focus:ring-neon-cyan focus:ring-offset-slate-900"
                    />
                    <span className="text-white text-sm">
                      {user.fullName} ({user.email})
                    </span>
                  </label>
                ))}
              </div>
              {formData.assignedUserIds.length > 0 && (
                <p className="text-xs text-neon-cyan mt-2">
                  {formData.assignedUserIds.length} user(s) selected
                </p>
              )}
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-purple text-white rounded-lg hover:shadow-neon transition-all"
              >
                {initialData ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Tasks;