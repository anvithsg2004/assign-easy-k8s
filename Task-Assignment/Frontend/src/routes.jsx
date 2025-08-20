import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import SideNav from './components/SideNav';
import LoaderPlanet from './components/LoaderPlanet';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tasks = lazy(() => import('./pages/Tasks'));
const TaskDetail = lazy(() => import('./pages/TaskDetail'));
const Submissions = lazy(() => import('./pages/Submissions'));
const MySubmissions = lazy(() => import('./pages/MySubmissions'));
const Profile = lazy(() => import('./pages/Profile'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-indigo-950 flex items-center justify-center">
        <LoaderPlanet size={60} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-indigo-950">
      <Navbar />
      <div className="flex">
        <SideNav />
        <main className="flex-1 p-6">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <LoaderPlanet size={60} />
            </div>
          }>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-indigo-950 flex items-center justify-center">
        <LoaderPlanet size={60} />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-indigo-950 flex items-center justify-center">
        <LoaderPlanet size={60} />
      </div>
    }>
      {children}
    </Suspense>
  );
};

const AdminRoute = ({ children }) => {
  const { isAdmin } = useAuth();

  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signin" element={
        <PublicRoute>
          <SignIn />
        </PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute>
          <SignUp />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/tasks" element={
        <ProtectedRoute>
          <Tasks />
        </ProtectedRoute>
      } />

      <Route path="/tasks/:id" element={
        <ProtectedRoute>
          <TaskDetail />
        </ProtectedRoute>
      } />

      <Route path="/submissions" element={
        <ProtectedRoute>
          <AdminRoute>
            <Submissions />
          </AdminRoute>
        </ProtectedRoute>
      } />

      <Route path="/my-submissions" element={
        <ProtectedRoute>
          <MySubmissions />
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;