import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, Calendar, Tag, User, ExternalLink, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { submissionAPI } from '../api';

const TaskTable = ({ tasks, onEdit, onDelete, onView, onRefresh }) => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  const [submittingTasks, setSubmittingTasks] = useState(new Set());

  const statusColors = {
    PENDING: 'bg-slate-500/20 text-slate-300',
    ASSIGNED: 'bg-blue-500/20 text-blue-300',
    DONE: 'bg-green-500/20 text-green-300',
  };

  const taskList = tasks?.content || tasks || [];

  const filteredTasks = taskList.filter(task =>
    filter === 'ALL' || task.status === filter
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewTask = (task) => {
    navigate(`/tasks/${task.id}`);
  };

  const isTaskAssignedToUser = (task) => {
    if (!task.assignedUserIds || task.assignedUserIds.length === 0) {
      return true; // Task is available to all users
    }
    return task.assignedUserIds.includes(user?.id);
  };

  const isTaskSpecificallyAssigned = (task) => {
    return task.assignedUserIds && task.assignedUserIds.length > 0 && task.assignedUserIds.includes(user?.id);
  };

  return (
    <div className="space-y-4">
      {/* Filter Chips */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {['ALL', 'PENDING', 'ASSIGNED', 'DONE'].map((status) => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filter === status
                ? 'bg-neon-cyan/20 text-neon-cyan ring-2 ring-neon-cyan/30 ring-offset-1 ring-offset-slate-900'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
          >
            {status}
          </motion.button>
        ))}
      </div>

      {/* Tasks Grid/List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-neon-cyan/30 transition-colors relative"
          >
            {/* Star icon for specifically assigned tasks */}
            {!isAdmin() && isTaskSpecificallyAssigned(task) && (
              <div className="absolute top-4 right-4">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
            )}

            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-white text-lg truncate pr-8">{task.title}</h3>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[task.status]}`}>
                {task.status}
              </span>
            </div>

            <p className="text-slate-400 text-sm mb-4 line-clamp-2">{task.description}</p>

            {/* Task Info */}
            <div className="space-y-2 mb-4">
              {task.deadline && (
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(task.deadline)}</span>
                </div>
              )}

              {task.tags && task.tags.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-slate-400" />
                  <div className="flex flex-wrap gap-1">
                    {task.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-2 py-1 bg-neon-purple/20 text-neon-purple text-xs rounded">
                        {tag}
                      </span>
                    ))}
                    {task.tags.length > 2 && (
                      <span className="text-xs text-slate-400">+{task.tags.length - 2} more</span>
                    )}
                  </div>
                </div>
              )}

              {task.assignedUserIds && task.assignedUserIds.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <User className="h-4 w-4" />
                  <span>Assigned to {task.assignedUserIds.length} user(s)</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewTask(task)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span className="text-sm">View</span>
              </motion.button>

              <div className="flex space-x-2">
                {isAdmin() && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onEdit && onEdit(task)}
                      className="p-2 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onDelete && onDelete(task)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </>
                )}
                {/* Submit button removed from here */}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-slate-400 text-lg">No tasks found</div>
          <div className="text-slate-500 text-sm mt-2">Try adjusting your filters</div>
        </motion.div>
      )}
    </div>
  );
};

export default TaskTable;