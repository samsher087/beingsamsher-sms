import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface RoleProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles: UserRole[];
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Super Admin can access all school operations
  if (user.role === 'SUPER_ADMIN') {
    return children;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 bg-white dark:bg-[#0D1522] rounded-3xl border border-red-200 dark:border-red-900/50 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-950/60 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Role Access Restricted</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Your account is registered as <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">[{user.role.replace('_', ' ')}]</span> and does not have permission to access this section of the system.
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to My Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  return children;
};
