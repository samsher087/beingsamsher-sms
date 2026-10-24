import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  Lock,
  Mail,
  School,
  ArrowRight,
  ShieldCheck,
  Award,
  UserCheck,
  Calculator,
  GraduationCap,
  Users,
  Globe,
  Sparkles,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

interface RolePortalConfig {
  role: UserRole;
  title: string;
  portalName: string;
  email: string;
  icon: any;
  color: string;
  textColor: string;
  bgLight: string;
  borderColor: string;
  desc: string;
  allowedFeatures: string[];
  restrictedFeatures: string[];
}

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [email, setEmail] = useState('student@dps.edu.in');
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [tenantCode, setTenantCode] = useState('dps-rkp');
  const [loading, setLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState<{
    message: string;
    code?: string;
    correctTenantCode?: string;
    correctTenantName?: string;
  } | null>(null);

  const portals: RolePortalConfig[] = [
    {
      role: 'STUDENT',
      title: 'Student',
      portalName: 'Student Portal',
      email: 'student@dps.edu.in',
      icon: GraduationCap,
      color: 'bg-amber-600',
      textColor: 'text-amber-600 dark:text-amber-400',
      bgLight: 'bg-amber-50 dark:bg-amber-950/30',
      borderColor: 'border-amber-500/40',
      desc: 'Secured student access for CBSE term report cards, attendance %, homework, and fees slips.',
      allowedFeatures: [
        'Personal CBSE Report Cards & Grades',
        'Daily Attendance Calendar & Attendance %',
        'Assigned Homework & Class Tasks',
        'Class Section Timetable Schedule',
        'Own Fee Invoices & Payment Receipts',
        'School Circulars & Library Book Search',
      ],
      restrictedFeatures: [
        'Admin Settings & System Configurations',
        'Faculty Payroll & Staff Directory',
        'Admissions Pipeline & Conversion',
        'Fee Structure & Accounting Ledger',
        'Public Website CMS Editor',
      ],
    },
    {
      role: 'PARENT',
      title: 'Parent',
      portalName: 'Parent / Guardian Portal',
      email: 'parent@dps.edu.in',
      icon: Users,
      color: 'bg-rose-600',
      textColor: 'text-rose-600 dark:text-rose-400',
      bgLight: 'bg-rose-50 dark:bg-rose-950/30',
      borderColor: 'border-rose-500/40',
      desc: 'Parent portal for monitoring child academic performance, attendance, and quarterly fee dues.',
      allowedFeatures: [
        'Ward Academic Progress & CBSE Marks',
        'Daily Attendance Alerts & %',
        'Online Fee Payments & GST Invoices',
        'School Transport Bus Routes',
        'Homework Notifications & School Circulars',
      ],
      restrictedFeatures: [
        'Staff Salary & Employment Details',
        'Student Enrolment Management',
        'Examination Marks Entry / Editing',
        'School System Configurations',
      ],
    },
    {
      role: 'TEACHER',
      title: 'Teacher',
      portalName: 'Teacher & Faculty Portal',
      email: 'teacher@dps.edu.in',
      icon: UserCheck,
      color: 'bg-teal-600',
      textColor: 'text-teal-600 dark:text-teal-400',
      bgLight: 'bg-teal-50 dark:bg-teal-950/30',
      borderColor: 'border-teal-500/40',
      desc: 'Faculty portal for daily classroom attendance marking, CBSE marks entry, and assigning homework.',
      allowedFeatures: [
        'Daily Student Attendance Marking',
        'CBSE Subject Marks Entry & Grading',
        'Create & Grade Homework Assignments',
        'Weekly Teaching Timetable',
        'Class Student Directory View',
        'Library Catalog Access',
      ],
      restrictedFeatures: [
        'School Fee Collection & Accounts',
        'School Website CMS Settings',
        'Tenant Platform Configurations',
        'Staff Salary & Administrative Audit Logs',
      ],
    },
    {
      role: 'ACCOUNTANT',
      title: 'Accountant',
      portalName: 'Accounts & Finance Portal',
      email: 'accounts@dps.edu.in',
      icon: Calculator,
      color: 'bg-emerald-600',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
      borderColor: 'border-emerald-500/40',
      desc: 'Finance portal for paise-safe INR fee collections, automated receipt numbers, and payment reconciliation.',
      allowedFeatures: [
        'Paise-Safe INR Fee Payments & Invoices',
        'Automated Sequential Receipt Generation',
        'Student Fee Due Status & Concessions',
        'Audited Payment Reversals & Refunds',
        'Quarterly Collection Reports',
      ],
      restrictedFeatures: [
        'Examination Marks Entry',
        'Class Homework Assignment',
        'School Website CMS Editor',
        'SaaS Multi-Tenant Cloud Operations',
      ],
    },
    {
      role: 'PRINCIPAL',
      title: 'Principal',
      portalName: 'Principal Academic Oversight',
      email: 'principal@dps.edu.in',
      icon: Award,
      color: 'bg-indigo-600',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      bgLight: 'bg-indigo-50 dark:bg-indigo-950/30',
      borderColor: 'border-indigo-500/40',
      desc: 'Executive academic oversight for faculty supervision, admissions approvals, and overall school KPIs.',
      allowedFeatures: [
        'School-Wide Academic Performance Analytics',
        'Faculty & Staff Directory Supervision',
        'Admissions Pipeline & Inquiries Approval',
        'Class Schedule & Timetable Oversight',
        'Fee Collection Summaries & Attendance Logs',
      ],
      restrictedFeatures: [
        'Platform Super Admin SaaS Configuration',
        'Direct Database / Tenant Code Mutations',
      ],
    },
    {
      role: 'SCHOOL_ADMIN',
      title: 'School Admin',
      portalName: 'School Administration Portal',
      email: 'admin@dps.edu.in',
      icon: ShieldCheck,
      color: 'bg-blue-600',
      textColor: 'text-blue-600 dark:text-blue-400',
      bgLight: 'bg-blue-50 dark:bg-blue-950/30',
      borderColor: 'border-blue-500/40',
      desc: 'Complete administrative control for single-school operations, CBSE settings, CMS, and staff management.',
      allowedFeatures: [
        'Student Admissions & Directory Management',
        'Faculty Registration & Staff Management',
        'Academic Classes & Section Setup',
        'School Settings & CBSE Affiliation Config',
        'Public School Website CMS Editor',
        'Security & Audit Trail Logs',
      ],
      restrictedFeatures: [
        'Cross-Tenant SaaS Multi-School Provisioning (Super Admin only)',
      ],
    },
    {
      role: 'SUPER_ADMIN',
      title: 'Super Admin',
      portalName: 'Cloud SaaS Platform HQ',
      email: 'superadmin@softdeals.in',
      icon: Globe,
      color: 'bg-purple-600',
      textColor: 'text-purple-600 dark:text-purple-400',
      bgLight: 'bg-purple-50 dark:bg-purple-950/30',
      borderColor: 'border-purple-500/40',
      desc: 'SoftDeals SaaS platform admin for managing multi-school tenant instances, plans, and subscriptions.',
      allowedFeatures: [
        'Multi-School Tenant Provisioning & Setup',
        'Subscription Tier Management & Limits',
        'Cross-Tenant Global System Analytics',
        'Global Database Auditing & Security',
        'All Operational Modules System-Wide',
      ],
      restrictedFeatures: [],
    },
  ];

  const currentPortal = portals.find((p) => p.role === selectedRole) || portals[0];

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setErrorInfo(null);
    const target = portals.find((p) => p.role === role);
    if (target) {
      setEmail(target.email);
      setPassword('Password@123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorInfo(null);
    try {
      // Pass selectedRole so backend verifies account role matches the portal!
      await login(email, password, tenantCode, selectedRole);
      navigate('/dashboard');
    } catch (err: any) {
      const data = err.response?.data;
      if (data && typeof data === 'object' && data.message) {
        setErrorInfo({
          message: data.message,
          code: data.errorCode,
          correctTenantCode: data.correctTenantCode,
          correctTenantName: data.correctTenantName,
        });
      } else if (err.response?.status === 500) {
        setErrorInfo({
          message: 'Backend server connection error (500). Please ensure the backend server on port 5000 is running.',
          code: 'SERVER_OFFLINE',
        });
      } else {
        setErrorInfo({
          message: err.message || 'Unable to connect to school server. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const Icon = currentPortal.icon;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-start py-6 sm:py-10 px-4 sm:px-6 lg:px-8 selection:bg-teal-500 selection:text-white font-sans">
      {/* Office Workstation Background Image with subtle depth-of-field */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105 filter blur-[2px] transform-gpu pointer-events-none"
        style={{ backgroundImage: `url('/login-bg.jpg')` }}
      />

      {/* Dark Ambient Gradient & Vignette Overlay for rich contrast */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-slate-950/75 via-slate-950/55 to-slate-950/80 pointer-events-none" />

      {/* Foreground Content with Translucent Glass Styling */}
      <div className="relative z-10 max-w-6xl mx-auto w-full space-y-5 sm:space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 bg-slate-900/50 backdrop-blur-md border border-teal-500/40 text-teal-300 font-semibold px-3.5 py-1 rounded-full text-xs shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>SoftDeals — Digital Solutions</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
            School Management System
          </h1>
          <p className="text-xs sm:text-sm text-slate-200/90 max-w-xl mx-auto drop-shadow-sm font-medium">
            Select your assigned school portal below to sign in with role-based access control.
          </p>
        </div>

        {/* Role Portal Selector Bar with Glassmorphic Translucency */}
        <div className="bg-slate-900/55 dark:bg-[#0B1320]/60 backdrop-blur-xl p-2.5 rounded-2xl border border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 mb-2">
            <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
              Step 1: Choose Your Role Portal
            </span>
            <span className="text-[10px] text-teal-400 font-semibold tracking-wide">
              Role Access Strictly Enforced
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
            {portals.map((p) => {
              const PIcon = p.icon;
              const isSelected = selectedRole === p.role;
              return (
                <button
                  key={p.role}
                  type="button"
                  onClick={() => handleSelectRole(p.role)}
                  className={`flex flex-col items-center text-center p-2.5 rounded-xl transition-all backdrop-blur-md ${
                    isSelected
                      ? `${p.color} text-white shadow-xl shadow-teal-500/25 font-bold scale-[1.03] border border-white/30`
                      : 'bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 shadow-sm'
                  }`}
                >
                  <PIcon className="w-4 h-4 mb-1" />
                  <span className="text-xs font-semibold leading-tight">{p.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Sign-In Card: Form + Permissions Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Sign-In Form */}
          <div className="lg:col-span-7 bg-slate-900/60 dark:bg-[#0B1320]/65 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/20 flex flex-col justify-between space-y-6 text-white">
            <div className="space-y-4">
              {/* Active Portal Header */}
              <div className="flex items-start space-x-3.5 pb-4 border-b border-white/10">
                <div className={`w-12 h-12 rounded-2xl ${currentPortal.color} text-white flex items-center justify-center shrink-0 shadow-lg border border-white/20`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg sm:text-xl font-bold text-white drop-shadow-sm">
                      {currentPortal.portalName}
                    </h2>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${currentPortal.bgLight} ${currentPortal.textColor} border ${currentPortal.borderColor} backdrop-blur-sm`}>
                      {currentPortal.role.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 font-medium leading-relaxed">
                    {currentPortal.desc}
                  </p>
                </div>
              </div>

              {errorInfo && (
                <div
                  className={`p-4 rounded-2xl text-xs space-y-2.5 border backdrop-blur-md transition-all ${
                    errorInfo.code === 'WRONG_SCHOOL'
                      ? 'bg-amber-950/60 border-amber-500/50 text-amber-200 shadow-sm'
                      : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                  }`}
                >
                  <div className="flex items-start space-x-2.5">
                    {errorInfo.code === 'WRONG_SCHOOL' ? (
                      <School className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    )}
                    <div className="space-y-1 flex-1">
                      {errorInfo.code === 'WRONG_SCHOOL' && (
                        <p className="font-bold text-xs uppercase tracking-wide text-amber-300 flex items-center space-x-1.5">
                          <span>Incorrect School Branch Selected</span>
                        </p>
                      )}
                      <p className="leading-relaxed font-medium">{errorInfo.message}</p>
                    </div>
                  </div>

                  {errorInfo.code === 'WRONG_SCHOOL' && errorInfo.correctTenantCode && (
                    <div className="pt-1 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setTenantCode(errorInfo.correctTenantCode!);
                          setErrorInfo(null);
                        }}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow transition flex items-center space-x-1.5 border border-white/20"
                      >
                        <span>Switch to {errorInfo.correctTenantName || 'Correct School'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                {selectedRole !== 'SUPER_ADMIN' && (
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">
                      School Branch / Tenant
                    </label>
                    <select
                      value={tenantCode}
                      onChange={(e) => {
                        setTenantCode(e.target.value);
                        setErrorInfo(null);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white/15 backdrop-blur-md transition-all shadow-inner font-medium cursor-pointer"
                    >
                      <option value="dps-rkp" className="bg-slate-900 text-white">D.A.V Public School, Pindersot</option>
                      <option value="st-xavier" className="bg-slate-900 text-white">St. Xavier's Senior Secondary School</option>
                    </select>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-200">
                      Authorized {currentPortal.title} Email
                    </label>
                    <span className="text-[10px] text-slate-400">Must match {currentPortal.role}</span>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-300 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorInfo(null);
                      }}
                      placeholder={`e.g. ${currentPortal.email}`}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white/15 backdrop-blur-md transition-all shadow-inner font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-200">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail(currentPortal.email);
                        setPassword('Password@123');
                        setErrorInfo(null);
                      }}
                      className="text-[11px] text-teal-300 hover:text-teal-200 px-2 py-0.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-400/20 transition backdrop-blur-sm flex items-center space-x-1 font-medium"
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>Auto-fill Demo Password</span>
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-300 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorInfo(null);
                      }}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white/15 backdrop-blur-md transition-all shadow-inner font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 p-1 text-slate-300 hover:text-white transition rounded-lg hover:bg-white/10 focus:outline-none"
                      title={showPassword ? 'Hide password' : 'Show password'}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-slate-300 hover:text-white" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-300 hover:text-white" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-3 ${currentPortal.color} hover:brightness-110 text-white font-bold py-3.5 rounded-xl shadow-xl transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50 border border-white/20 hover:shadow-[0_0_25px_rgba(20,184,166,0.45)]`}
                >
                  <span>{loading ? 'Authenticating Role...' : `Sign In to ${currentPortal.title} Portal`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <Link
                to={`/public/${tenantCode}`}
                className="text-teal-300 hover:text-teal-200 hover:underline font-semibold"
              >
                ← Public School Website
              </Link>
              <span className="text-[11px] text-slate-400">SoftDeals SMS v1.0 • CBSE Compliant</span>
            </div>
          </div>

          {/* Right Column: Portal Role Permissions Matrix */}
          <div className="lg:col-span-5 bg-slate-900/60 dark:bg-[#0B1320]/65 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/20 flex flex-col justify-between space-y-4 text-white">
            <div className="space-y-4">
              <div>
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>Role Access Privileges</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  Once authenticated as <span className="font-bold text-white">{currentPortal.title}</span>, your session is scoped to these permissions:
                </p>
              </div>

              {/* Granted Permissions */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authorized Features</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {currentPortal.allowedFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Restricted Permissions */}
              {currentPortal.restrictedFeatures.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Strictly Inaccessible / Hidden</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    {currentPortal.restrictedFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-2 line-through opacity-75">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-3.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-[11px] text-slate-300 leading-relaxed">
              <span className="font-semibold text-white">RBAC Security Guarantee:</span> Endpoints enforce strict JWT role verification on every API request. Unauthorized access returns HTTP 403 Forbidden.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
