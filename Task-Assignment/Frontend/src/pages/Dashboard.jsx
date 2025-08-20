import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tab } from '@headlessui/react';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle, 
  Upload,
  TrendingUp,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { taskAPI, submissionAPI } from '../api';
import CardStat from '../components/CardStat';
import TaskTable from '../components/TaskTable';
import UserManagement from '../components/UserManagement';
import LoaderPlanet from '../components/LoaderPlanet';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    doneTasks: 0,
    pendingSubmissions: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (isAdmin()) {
          // Admin dashboard data
          const [allTasks, pendingTasks, submissions] = await Promise.all([
            taskAPI.getAllTasks(),
            taskAPI.getAllTasks('PENDING'),
            submissionAPI.getAllSubmissions(),
          ]);

          // Handle paginated responses
          const allTasksData = allTasks.data.content || allTasks.data || [];
          const pendingTasksData = pendingTasks.data.content || pendingTasks.data || [];
          const submissionsData = submissions.data.content || submissions.data || [];

          const doneTasks = allTasksData.filter(task => task.status === 'DONE');
          const pendingSubmissions = submissionsData.filter(sub => sub.status === 'PENDING');

          setStats({
            totalTasks: allTasksData.length,
            pendingTasks: pendingTasksData.length,
            doneTasks: doneTasks.length,
            pendingSubmissions: pendingSubmissions.length,
          });

          setRecentTasks(allTasksData.slice(0, 6));
        } else {
          // User dashboard data - get visible tasks for the user
          const visibleTasks = await taskAPI.getVisibleTasks();
          const visibleTasksData = visibleTasks.data.content || visibleTasks.data || [];
          
          const pendingTasks = visibleTasksData.filter(task => task.status === 'PENDING');
          const assignedTasks = visibleTasksData.filter(task => task.status === 'ASSIGNED');
          const doneTasks = visibleTasksData.filter(task => task.status === 'DONE');

          setStats({
            totalTasks: visibleTasksData.length,
            pendingTasks: pendingTasks.length,
            assignedTasks: assignedTasks.length,
            doneTasks: doneTasks.length,
          });

          setRecentTasks(visibleTasksData.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, isAdmin]);

  const refreshDashboard = () => {
    setLoading(true);
    const fetchDashboardData = async () => {
      try {
        if (isAdmin()) {
          const [allTasks, pendingTasks, submissions] = await Promise.all([
            taskAPI.getAllTasks(),
            taskAPI.getAllTasks('PENDING'),
            submissionAPI.getAllSubmissions(),
          ]);

          const allTasksData = allTasks.data.content || allTasks.data || [];
          const pendingTasksData = pendingTasks.data.content || pendingTasks.data || [];
          const submissionsData = submissions.data.content || submissions.data || [];

          const doneTasks = allTasksData.filter(task => task.status === 'DONE');
          const pendingSubmissions = submissionsData.filter(sub => sub.status === 'PENDING');

          setStats({
            totalTasks: allTasksData.length,
            pendingTasks: pendingTasksData.length,
            doneTasks: doneTasks.length,
            pendingSubmissions: pendingSubmissions.length,
          });

          setRecentTasks(allTasksData.slice(0, 6));
        } else {
          const visibleTasks = await taskAPI.getVisibleTasks();
          const visibleTasksData = visibleTasks.data.content || visibleTasks.data || [];
          
          const pendingTasks = visibleTasksData.filter(task => task.status === 'PENDING');
          const assignedTasks = visibleTasksData.filter(task => task.status === 'ASSIGNED');
          const doneTasks = visibleTasksData.filter(task => task.status === 'DONE');

          setStats({
            totalTasks: visibleTasksData.length,
            pendingTasks: pendingTasks.length,
            assignedTasks: assignedTasks.length,
            doneTasks: doneTasks.length,
          });

          setRecentTasks(visibleTasksData.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
      className="space-y-8"
    >
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent"
        >
          Welcome back, {user?.fullName}
        </motion.h1>
        <p className="text-slate-400 text-lg">
          {isAdmin() ? 'Mission Command Center' : 'Your Mission Dashboard'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardStat
          title="Total Tasks"
          value={stats.totalTasks}
          icon={CheckSquare}
          color="cyan"
          delay={0}
        />
        <CardStat
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon={Clock}
          color="orange"
          delay={0.1}
        />
        {isAdmin() ? (
          <>
            <CardStat
              title="Completed Tasks"
              value={stats.doneTasks}
              icon={CheckCircle}
              color="green"
              delay={0.2}
            />
            <CardStat
              title="Pending Submissions"
              value={stats.pendingSubmissions}
              icon={Upload}
              color="purple"
              delay={0.3}
            />
          </>
        ) : (
          <>
            <CardStat
              title="Assigned Tasks"
              value={stats.assignedTasks}
              icon={TrendingUp}
              color="purple"
              delay={0.2}
            />
            <CardStat
              title="Completed Tasks"
              value={stats.doneTasks}
              icon={CheckCircle}
              color="green"
              delay={0.3}
            />
          </>
        )}
      </div>

      {/* Dashboard Content */}
      {isAdmin() ? (
        <AdminDashboard recentTasks={recentTasks} onRefresh={refreshDashboard} />
      ) : (
        <UserDashboard recentTasks={recentTasks} onRefresh={refreshDashboard} />
      )}
    </motion.div>
  );
};

const AdminDashboard = ({ recentTasks, onRefresh }) => {
  return (
    <Tab.Group>
      <Tab.List className="flex space-x-1 rounded-xl bg-slate-900/50 p-1">
        {['Recent Tasks', 'User Management', 'Analytics'].map((tab) => (
          <Tab
            key={tab}
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-white transition-all ${
                selected
                  ? 'bg-neon-cyan/20 text-neon-cyan shadow'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`
            }
          >
            {tab}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-6">
        <Tab.Panel>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Recent Tasks</h3>
            <TaskTable
              tasks={recentTasks}
              onRefresh={onRefresh}
            />
          </motion.div>
        </Tab.Panel>
        <Tab.Panel>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
          >
            <UserManagement />
          </motion.div>
        </Tab.Panel>
        <Tab.Panel>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Analytics</h3>
            <p className="text-slate-400">Advanced analytics coming soon...</p>
          </motion.div>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

const UserDashboard = ({ recentTasks, onRefresh }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
    >
      <h3 className="text-xl font-semibold text-white mb-4">Available Tasks</h3>
      <TaskTable
        tasks={recentTasks}
        onRefresh={onRefresh}
      />
    </motion.div>
  );
};

export default Dashboard;