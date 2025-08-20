import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Check, X, Calendar, User, MessageCircle } from 'lucide-react';
import CommentSection from './CommentSection';
import { Dialog } from '@headlessui/react';

const SubmissionTable = ({ submissions, onUpdateStatus }) => {
  const [filter, setFilter] = useState('ALL');
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const statusColors = {
    PENDING: 'bg-slate-500/20 text-slate-300',
    ACCEPTED: 'bg-green-500/20 text-green-300',
    REJECTED: 'bg-red-500/20 text-red-300',
  };

  // Handle both paginated and non-paginated responses
  const submissionList = submissions?.content || submissions || [];
  
  const filteredSubmissions = submissionList.filter(submission => 
    filter === 'ALL' || submission.status === filter
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Filter Chips */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'].map((status) => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              filter === status
                ? 'bg-neon-cyan/20 text-neon-cyan ring-2 ring-neon-cyan/30 ring-offset-1 ring-offset-slate-900'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            {status}
          </motion.button>
        ))}
      </div>

      {/* Submissions Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {filteredSubmissions.map((submission, index) => (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-neon-cyan/30 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-white">Task ID: {submission.taskId}</h3>
                <p className="text-sm text-slate-400">User ID: {submission.userId}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${statusColors[submission.status]}`}>
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

            {/* Submission Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Calendar className="h-4 w-4" />
                <span>Submitted: {formatDate(submission.submissionTime)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <ExternalLink className="h-4 w-4 text-neon-cyan" />
                <a 
                  href={submission.gitHubLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neon-cyan hover:text-neon-purple transition-colors text-sm truncate"
                >
                  {submission.gitHubLink}
                </a>
              </div>
            </div>

            {/* Actions */}
            {submission.status === 'PENDING' && onUpdateStatus && (
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onUpdateStatus(submission.id, 'ACCEPTED')}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors flex-1"
                >
                  <Check className="h-4 w-4" />
                  <span className="text-sm">Accept</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onUpdateStatus(submission.id, 'REJECTED')}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex-1"
                >
                  <X className="h-4 w-4" />
                  <span className="text-sm">Reject</span>
                </motion.button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredSubmissions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-slate-400 text-lg">No submissions found</div>
          <div className="text-slate-500 text-sm mt-2">Try adjusting your filters</div>
        </motion.div>
      )}

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
    </div>
  );
};

export default SubmissionTable;