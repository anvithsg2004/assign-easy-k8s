import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Clock, CheckCircle, XCircle, MessageCircle, X } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { useAuth } from '../context/AuthContext';
import { taskAPI, submissionAPI, userAPI } from '../api';
import LoaderPlanet from '../components/LoaderPlanet';
import CommentSection from '../components/CommentSection';

const MySubmissions = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    fetchMySubmissions();
  }, [user]);

  const fetchMySubmissions = async () => {
    try {
      // Get user's assigned tasks to find submissions
      const tasksResponse = await taskAPI.getAssignedTasks(user.id);
      const userTasks = tasksResponse.data.content || tasksResponse.data || [];

      // Create a map of task IDs to task details
      const taskMap = {};
      userTasks.forEach(task => {
        taskMap[task.id] = task;
      });
      setTasks(taskMap);

      // Get submissions for each task
      const submissionPromises = userTasks.map(task =>
        submissionAPI.getTaskSubmissions(task.id)
      );

      const submissionResponses = await Promise.all(submissionPromises);
      const allSubmissions = submissionResponses.flatMap(response => {
        const submissionData = response.data.content || response.data || [];
        return submissionData.filter(submission => submission.userId === user.id);
      });

      setSubmissions(allSubmissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-5 w-5 text-slate-400" />;
      case 'ACCEPTED':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-slate-500/20 text-slate-300';
      case 'ACCEPTED':
        return 'bg-green-500/20 text-green-300';
      case 'REJECTED':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-slate-500/20 text-slate-300';
    }
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
      <div>
        <h1 className="text-3xl font-bold text-white">My Submissions</h1>
        <p className="text-slate-400 mt-1">Track your task submission history</p>
      </div>

      {/* Submissions Timeline */}
      <div className="space-y-4">
        {submissions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-700/50"
          >
            <div className="text-slate-400 text-lg">No submissions yet</div>
            <div className="text-slate-500 text-sm mt-2">Complete some tasks to see your submissions here</div>
          </motion.div>
        ) : (
          submissions
            .sort((a, b) => new Date(b.submissionTime) - new Date(a.submissionTime))
            .map((submission, index) => {
              const task = tasks[submission.taskId];
              return (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-neon-cyan/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {task?.title || `Task ${submission.taskId}`}
                      </h3>
                      {task?.description && (
                        <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(submission.status)}
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(submission.status)}`}>
                        {submission.status}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setShowCommentsModal(true);
                        }}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span>Submitted: {new Date(submission.submissionTime).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <ExternalLink className="h-4 w-4 text-neon-cyan" />
                      <a
                        href={submission.gitHubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neon-cyan hover:text-neon-purple transition-colors text-sm truncate"
                      >
                        View GitHub Repository
                      </a>
                    </div>
                  </div>

                  {task?.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {task.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-neon-purple/20 text-neon-purple text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })
        )}
      </div>

      {/* Comments Modal */}
      <Dialog open={showCommentsModal} onClose={() => setShowCommentsModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold text-white">
                Submission Comments
              </Dialog.Title>
              <button
                onClick={() => setShowCommentsModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {selectedSubmission && (
              <CommentSection submissionId={selectedSubmission.id} />
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </motion.div>
  );
};

export default MySubmissions;