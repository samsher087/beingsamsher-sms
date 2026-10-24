import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  Receipt,
  Award,
  Clock,
  BookOpen,
  Bus,
  Bell,
  Sliders,
  Shield,
  FileText,
  School,
  Moon,
  Sun,
  Menu,
  X,
  LogOut,
  Building2,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, tenant, logout, activeTenantCode } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = user?.role || 'SCHOOL_ADMIN';

  // Role-based navigation items
  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'ACCOUNTANT', 'STUDENT', 'PARENT'] },
    
    // Super Admin platform tools
    { label: 'SaaS School Tenants', path: '/dashboard/tenants', icon: Building2, roles: ['SUPER_ADMIN'] },
    
    // Core School Ops
    { label: 'Students', path: '/dashboard/students', icon: GraduationCap, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'TEACHER'] },
    { label: 'Teachers & Staff', path: '/dashboard/teachers', icon: Users, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'] },
    { label: 'Classes & Subjects', path: '/dashboard/classes', icon: Layers, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'] },
    { label: 'Daily Attendance', path: '/dashboard/attendance', icon: CalendarCheck, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT'] },
    { label: 'Fees & Receipts', path: '/dashboard/fees', icon: Receipt, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'STUDENT', 'PARENT'] },
    { label: 'Exams & Marks', path: '/dashboard/exams', icon: Award, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT'] },
    { label: 'Timetable', path: '/dashboard/timetable', icon: Clock, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT'] },
    { label: 'Admissions Pipeline', path: '/dashboard/admissions', icon: FileText, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'] },
    { label: 'Homework & Tasks', path: '/dashboard/homework', icon: BookOpen, roles: ['TEACHER', 'STUDENT', 'PARENT'] },
    { label: 'Notices & Circulars', path: '/dashboard/notices', icon: Bell, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT'] },
    { label: 'Library Catalog', path: '/dashboard/library', icon: BookOpen, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT'] },
    { label: 'Transport & Routes', path: '/dashboard/transport', icon: Bus, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'PARENT'] },
    
    // CMS & Configuration
    { label: 'School Website CMS', path: '/dashboard/website-cms', icon: School, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
    { label: 'School Settings', path: '/dashboard/settings', icon: Sliders, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
    { label: 'Audit Logs & Security', path: '/dashboard/audit-logs', icon: Shield, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
  ];

  const visibleNav = navItems.filter((item) => item.roles.includes(role));

  const roleBadgeColors: Record<string, string> = {
    SUPER_ADMIN: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    SCHOOL_ADMIN: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    PRINCIPAL: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
    TEACHER: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
    ACCOUNTANT: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    STUDENT: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    PARENT: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080E18] text-slate-800 dark:text-slate-100">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar */}
        <aside
          className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#0D1522] border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* School Brand Box */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0B192C] to-[#008170] flex items-center justify-center text-white font-bold shadow-md">
                <Sparkles className="w-5 h-5 text-teal-300" />
              </div>
              <div className="overflow-hidden">
                <h1 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white truncate">
                  {tenant?.name || 'SoftDeals SMS'}
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {role === 'SUPER_ADMIN' ? 'Cloud Platform HQ' : 'School Management'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-500 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {visibleNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#1E3E62] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-300' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile Card at Sidebar Footer */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs uppercase">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {user?.name || 'Authorized User'}
                  </p>
                  <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-medium ${roleBadgeColors[role] || 'bg-slate-200'}`}>
                    {role.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="text-slate-400 hover:text-red-500 p-1"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar */}
          <header className="h-16 bg-white dark:bg-[#0D1522] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {tenant?.name || 'D.A.V Public School, Pindersot'}
                </span>
                <span>•</span>
                <span>Session: 2026-2027</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Public Website Preview Button */}
              <button
                onClick={() => navigate(`/public/${activeTenantCode}`)}
                className="hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-teal-700 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition"
              >
                <School className="w-3.5 h-3.5" />
                <span>View School Website</span>
              </button>

              {/* Dark/Light mode toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Toggle Theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Role badge */}
              <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center space-x-1.5 ${roleBadgeColors[role] || 'bg-slate-200'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                <span>{role.replace('_', ' ')}</span>
              </div>
            </div>
          </header>

          {/* Subpage Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
