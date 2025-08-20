import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Tag,
  User,
  ExternalLink,
  X,
  MessageCircle,
  History,
  Star
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskAPI, submissionAPI, userAPI } from '../api';
import LoaderPlanet from '../components/LoaderPlanet';
import CommentSection from '../components/CommentSection';
import TaskHistory from '../components/TaskHistory';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [task, setTask] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gitHubLink, setGitHubLink] = useState('');

  useEffect(() => {
    fetchTaskDetails();
    if (isAdmin()) {
      fetchUsers();
    }
  }, [id, isAdmin]);

  const fetchTaskDetails = async () => {
    try {
      const [taskResponse, submissionsResponse] = await Promise.all([
        taskAPI.getTask(id),
        submissionAPI.getTaskSubmissions(id)
      ]);

      setTask(taskResponse.data);
      setSubmissions(submissionsResponse.data.content || submissionsResponse.data || []);
    } catch (error) {
      console.error('Error fetching task details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmitTask = async () => {
    try {
      await submissionAPI.submitTask(id, gitHubLink);
      setShowSubmitModal(false);
      setGitHubLink('');
      fetchTaskDetails();
    } catch (error) {
      console.error('Error submitting task:', error);
      alert('Error submitting task: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEditTask = async (taskData) => {
    try {
      await taskAPI.updateTask(id, taskData);
      setShowEditModal(false);
      fetchTaskDetails();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error updating task: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task? This will also delete all task history.')) {
      try {
        await taskAPI.deleteTask(id);
        navigate('/tasks');
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error deleting task: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleUpdateSubmissionStatus = async (submissionId, status) => {
    try {
      await submissionAPI.updateSubmissionStatus(submissionId, status);
      fetchTaskDetails(); // Refresh task and submissions to reflect status change
    } catch (error) {
      console.error('Error updating submission status:', error);
    }
  };

  const getUserName = (userId) => {
    const foundUser = users.find(u => u.id === userId);
    return foundUser ? foundUser.fullName : 'Unknown User';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-slate-500/20 text-slate-300';
      case 'ASSIGNED':
        return 'bg-blue-500/20 text-blue-300';
      case 'DONE':
        return 'bg-green-500/20 text-green-300';
      default:
        return 'bg-slate-500/20 text-slate-300';
    }
  };

  const getSubmissionStatusColor = (status) => {
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

  const isTaskAssignedToUser = () => {
    if (!task?.assignedUserIds || task.assignedUserIds.length === 0) {
      return true; // Task is available to all users
    }
    return task.assignedUserIds.includes(user?.id);
  };

  const isTaskSpecificallyAssigned = () => {
    return task?.assignedUserIds && task.assignedUserIds.length > 0 && task.assignedUserIds.includes(user?.id);
  };

  const userSubmissions = submissions.filter(sub => sub.userId === user?.id);
  const hasAcceptedSubmission = userSubmissions.some(sub => sub.status === 'ACCEPTED');
  const canSubmit = !isAdmin() &&
    task?.status === 'ASSIGNED' &&
    isTaskAssignedToUser() &&
    !hasAcceptedSubmission;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoaderPlanet size={60} />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400 text-lg">Task not found</div>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/tasks')}
            className="p-2 bg-slate-800/50 rounded-lg text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-3xl font-bold text-white">{task.title}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline - flex px - 3 py - 1 rounded - lg text - sm font - medium ${getStatusColor(task.status)} `}>
                  {task.status}
                </span>
                {!isAdmin() && isTaskSpecificallyAssigned() && (
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-xs">Specifically assigned to you</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHistoryModal(true)}
            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            <History className="h-5 w-5" />
          </motion.button>

          {isAdmin() && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEditModal(true)}
                className="p-2 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
              >
                <Edit className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeleteTask}
                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </motion.button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Details */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
            <p className="text-slate-300 leading-relaxed">
              {task.description || 'No description provided'}
            </p>
          </motion.div>

          {/* Your Submissions Section for Non-Admins */}
          {!isAdmin() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Your Submissions</h2>
              {userSubmissions.length > 0 ? (
                <div className="space-y-4">
                  {userSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
                    >
                      <p className="text-slate-300">Status: <span className={getSubmissionStatusColor(submission.status)}>{submission.status}</span></p>
                      <p className="text-slate-300">Submitted on: {new Date(submission.submissionTime).toLocaleDateString()}</p>
                      <a
                        href={submission.gitHubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neon-cyan hover:text-neon-purple transition-colors text-sm flex items-center space-x-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>View Your Submission</span>
                      </a>
                      {submission.status === 'REJECTED' && (
                        <p className="text-red-400 mt-2">Your submission was rejected. You can submit again.</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">You haven't submitted any solutions yet.</p>
              )}
              {canSubmit && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSubmitModal(true)}
                  className="mt-4 flex items-center space-x-2 bg-gradient-to-r from-neon-cyan to-neon-purple px-4 py-2 rounded-lg text-white font-medium shadow-lg hover:shadow-neon transition-all"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Submit Solution</span>
                </motion.button>
              )}
            </motion.div>
          )}

          {/* All Submissions Section for Admins */}
          {isAdmin() && submissions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Submissions</h2>
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-medium">{getUserName(submission.userId)}</p>
                        <p className="text-sm text-slate-400">
                          {new Date(submission.submissionTime).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px - 2 py - 1 rounded text - xs ${getSubmissionStatusColor(submission.status)} `}>
                          {submission.status}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowCommentsModal(true);
                          }}
                          className="p-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                    <a
                      href={submission.gitHubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-cyan hover:text-neon-purple transition-colors text-sm flex items-center space-x-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>View GitHub Repository</span>
                    </a>
                    {isAdmin() && submission.status === 'PENDING' && (
                      <div className="flex space-x-2 mt-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUpdateSubmissionStatus(submission.id, 'ACCEPTED')}
                          className="px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors text-sm"
                        >
                          Accept
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUpdateSubmissionStatus(submission.id, 'REJECTED')}
                          className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors text-sm"
                        >
                          Reject
                        </motion.button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Task Info Sidebar */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Task Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-400">Deadline</p>
                  <p className="text-white">{formatDate(task.deadline)}</p>
                </div>
              </div>

              {task.assignedUserIds && task.assignedUserIds.length > 0 && (
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-slate-400 mt-1" />
                  <div>
                    <p className="text-sm text-slate-400">Assigned to</p>
                    <div className="space-y-1">
                      {task.assignedUserIds.map(userId => (
                        <p key={userId} className="text-white text-sm">
                          {getUserName(userId)}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(!task.assignedUserIds || task.assignedUserIds.length === 0) && (
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">Assignment</p>
                    <p className="text-white">Available to all users</p>
                  </div>
                </div>
              )}

              {task.tags && task.tags.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Tag className="h-5 w-5 text-slate-400" />
                    <p className="text-sm text-slate-400">Tags</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-neon-purple/20 text-neon-purple text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditTask}
        users={users}
        initialData={task}
      />

      {/* Submit Task Modal */}
      <Dialog open={showSubmitModal} onClose={() => setShowSubmitModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold text-white">
                Submit Solution
              </Dialog.Title>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  GitHub Repository Link
                </label>
                <input
                  type="url"
                  value={gitHubLink}
                  onChange={(e) => setGitHubLink(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-neon-cyan focus:border-transparent text-white"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitTask}
                  disabled={!gitHubLink.trim()}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-purple text-white rounded-lg hover:shadow-neon transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

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

      {/* Task History Modal */}
      <Dialog open={showHistoryModal} onClose={() => setShowHistoryModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold text-white">
                Task History
              </Dialog.Title>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <TaskHistory taskId={id} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </motion.div>
  );
};

const EditTaskModal = ({ isOpen, onClose, onSubmit, users, initialData }) => {
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
              Edit Task
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
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
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-purple text-white rounded-lg hover:shadow-neon transition-all"
              >
                Update Task
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TaskDetail;
