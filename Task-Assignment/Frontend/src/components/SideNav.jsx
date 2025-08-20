import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Upload, 
  Users, 
  User,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SideNav = () => {
  const { isAdmin } = useAuth();

  const adminLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/submissions', icon: Upload, label: 'Submissions' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const userLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/tasks', icon: CheckSquare, label: 'My Tasks' },
    { to: '/my-submissions', icon: FileText, label: 'My Submissions' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const links = isAdmin() ? adminLinks : userLinks;

  return (
    <motion.aside
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="w-64 bg-slate-900/50 backdrop-blur-sm border-r border-slate-700/50 min-h-[calc(100vh-4rem)]"
    >
      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className={`h-5 w-5 ${isActive ? 'text-neon-cyan' : ''}`} />
                <span className="font-medium">{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
};

export default SideNav;