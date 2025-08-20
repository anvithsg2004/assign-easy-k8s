import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, Clock, User, Edit } from 'lucide-react';
import { taskAPI } from '../api';
import LoaderPlanet from './LoaderPlanet';

const TaskHistory = ({ taskId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTaskHistory();
  }, [taskId]);

  const fetchTaskHistory = async () => {
    try {
      const response = await taskAPI.getTaskHistory(taskId);
      setHistory(response.data || []);
    } catch (error) {
      console.error('Error fetching task history:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (fieldChanged) => {
    switch (fieldChanged) {
      case 'title':
      case 'description':
        return <Edit className="h-4 w-4 text-blue-400" />;
      case 'status':
        return <Clock className="h-4 w-4 text-purple-400" />;
      case 'assignedUserId':
        return <User className="h-4 w-4 text-green-400" />;
      default:
        return <History className="h-4 w-4 text-slate-400" />;
    }
  };

  const getActionColor = (fieldChanged) => {
    switch (fieldChanged) {
      case 'title':
      case 'description':
        return 'text-blue-400';
      case 'status':
        return 'text-purple-400';
      case 'assignedUserId':
        return 'text-green-400';
      default:
        return 'text-slate-400';
    }
  };

  const formatFieldName = (fieldChanged) => {
    switch (fieldChanged) {
      case 'assignedUserId':
        return 'Assigned User';
      default:
        return fieldChanged.charAt(0).toUpperCase() + fieldChanged.slice(1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoaderPlanet size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <History className="h-5 w-5 text-neon-cyan" />
        <h3 className="text-lg font-semibold text-white">Task History</h3>
      </div>

      {history.length === 0 ? (
        <p className="text-slate-400 text-sm">No history available</p>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {history.map((entry, index) => (
            <motion.div
              key={entry.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30"
            >
              <div className="flex-shrink-0 mt-1">
                {getActionIcon(entry.fieldChanged)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`text-sm font-medium ${getActionColor(entry.fieldChanged)}`}>
                    {formatFieldName(entry.fieldChanged)} Changed
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(entry.changedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-slate-300 text-sm">
                  <span className="text-red-400">From:</span> {entry.oldValue || 'None'} 
                  <br />
                  <span className="text-green-400">To:</span> {entry.newValue}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskHistory;