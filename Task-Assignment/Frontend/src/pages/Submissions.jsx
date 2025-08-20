import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { submissionAPI } from '../api';
import SubmissionTable from '../components/SubmissionTable';
import LoaderPlanet from '../components/LoaderPlanet';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await submissionAPI.getAllSubmissions();
      // Handle paginated response
      setSubmissions(response.data.content || response.data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (submissionId, status) => {
    try {
      await submissionAPI.updateSubmissionStatus(submissionId, status);
      fetchSubmissions(); // Refresh the list
    } catch (error) {
      console.error('Error updating submission status:', error);
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
        <h1 className="text-3xl font-bold text-white">Task Submissions</h1>
        <p className="text-slate-400 mt-1">Review and manage task submissions</p>
      </div>

      {/* Submissions Table */}
      <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <SubmissionTable
          submissions={submissions}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </motion.div>
  );
};

export default Submissions;