import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, User } from 'lucide-react';
import { submissionAPI, userAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import LoaderPlanet from './LoaderPlanet';

const CommentSection = ({ submissionId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState({});
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
    fetchUsers();
  }, [submissionId]);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      const userMap = {};
      response.data.forEach(u => {
        userMap[u.id] = u.fullName;
      });
      setUsers(userMap);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await submissionAPI.getComments(submissionId);
      setComments(response.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await submissionAPI.addComment(submissionId, newComment);
      setNewComment('');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
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
        <MessageCircle className="h-5 w-5 text-neon-cyan" />
        <h3 className="text-lg font-semibold text-white">Comments</h3>
      </div>

      {/* Comments List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-slate-400 text-sm">No comments yet</p>
        ) : (
          comments.map((comment, index) => (
            <motion.div
              key={comment.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30"
            >
              <div className="flex items-center space-x-2 mb-2">
                <User className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-white">
                  {users[comment.userId] || 'User'}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-300 text-sm">{comment.comment}</p>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-neon-cyan focus:border-transparent text-white placeholder-slate-400 resize-none"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!newComment.trim() || submitting}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-purple text-white rounded-lg hover:shadow-neon transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <LoaderPlanet size={16} />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
        </motion.button>
      </form>
    </div>
  );
};

export default CommentSection;
