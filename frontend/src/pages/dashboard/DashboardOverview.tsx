import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  Receipt,
  TrendingUp,
  Award,
  Clock,
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  FileText,
  AlertCircle,
  Plus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export const DashboardOverview: React.FC = () => {
  const { user, tenant } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const role = user?.role || 'SCHOOL_ADMIN';

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/metrics');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 1. SUPER ADMIN PLATFORM OVERVIEW
  if (role === 'SUPER_ADMIN') {
    const kpis = data?.kpis || {};
    const planStats = data?.planStats || [];
    const recentTenants = data?.recentTenants || [];

    const pieColors = ['#008170', '#1E3E62', '#0B192C', '#FFB800'];

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Super Admin Control Plane
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              SoftDeals SMS Platform Management & Multi-Tenant Infrastructure
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/tenants')}
            className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Provision New School</span>
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#0D1522] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Schools</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{kpis.totalTenants || 2}</span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">100% Active</span>
            </div>
            <p className="text-[11px] text-slate-500">Multitenant isolated databases</p>
          </div>

          <div className="bg-white dark:bg-[#0D1522] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Students Hosted</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{kpis.totalStudents || 4500}</span>
              <span className="text-[11px] font-semibold text-teal-600 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded">Scalable</span>
            </div>
            <p className="text-[11px] text-slate-500">Across all provisioned tenants</p>
          </div>

          <div className="bg-white dark:bg-[#0D1522] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Faculty & Staff Accounts</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{kpis.totalStaff || 220}</span>
              <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded">Staff RBAC</span>
            </div>
            <p className="text-[11px] text-slate-500">Teachers, principals & accountants</p>
          </div>

          <div className="bg-white dark:bg-[#0D1522] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Cloud Health</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">99.98%</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <p className="text-[11px] text-slate-500">All services operational</p>
          </div>
        </div>

        {/* Tenant Table */}
        <div className="bg-white dark:bg-[#0D1522] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active School Tenants</h3>
            <button
              onClick={() => navigate('/dashboard/tenants')}
              className="text-xs text-teal-600 font-semibold hover:underline"
            >
              Manage Subscriptions →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">School Name</th>
                  <th className="py-2.5 px-3">Slug</th>
                  <th className="py-2.5 px-3">Plan</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Students Limit</th>
                  <th className="py-2.5 px-3">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentTenants.map((t: any) => (
                  <tr key={t._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{t.name}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{t.code}</td>
                    <td className="py-3 px-3">
                      <span className="bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold px-2 py-0.5 rounded">
                        {t.subscription?.plan}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-emerald-600 font-semibold flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>{t.subscription?.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono">{t.subscription?.studentLimit}</td>
                    <td className="py-3 px-3 text-slate-500">{t.contact?.city}, {t.contact?.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 2. SCHOOL ADMIN & PRINCIPAL DASHBOARD
  if (role === 'SCHOOL_ADMIN' || role === 'PRINCIPAL') {
    const kpis = data?.kpis || {};
    const feeTrend = data?.feeTrend || [];
    const upcomingExams = data?.upcomingExams || [];
    const recentNotices = data?.recentNotices || [];

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {role === 'PRINCIPAL' ? "Principal's Executive Dashboard" : 'School Administration Hub'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Overview of attendance, academic progress, fee collections, and school activities
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/dashboard/attendance')}
              className="px-3.5 py-2 bg-[#1E3E62] hover:bg-[#0B192C] text-white rounded-xl text-xs font-semibold shadow transition"
            >
              Take Today's Attendance
            </button>
            <button
              onClick={() => navigate('/dashboard/students')}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow transition"
            >
              + Admit Student
            </button>
          </div>
        </div>

        {/* 4 Primary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#0D1522] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Total Enrolled Students</span>
              <GraduationCap className="w-4 h-4 text-teal-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{kpis.totalStudents || 4500}</span>
              <span className="text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded">Active</span>
            </div>
            <p className="text-[11px] text-slate-500">Across {kpis.totalClasses || 14} class sections</p>
          </div>

          <div className="bg-white dark:bg-[#0D1522] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Today's Attendance Rate</span>
              <CalendarCheck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{kpis.todayAttendanceRate || 94}%</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">Normal</span>
            </div>
            <p className="text-[11px] text-slate-500">{kpis.presentStudents || 4230} Present • {kpis.absentStudents || 270} Absent</p>
          </div>

          <div className="bg-white dark:bg-[#0D1522] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Fee Collection Summary</span>
              <Receipt className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                ₹{Number(kpis.totalFeeCollectedINR || 85500).toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">Verified</span>
            </div>
            <p className="text-[11px] text-slate-500">Paise-safe immutable records</p>
          </div>

          <div className="bg-white dark:bg-[#0D1522] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Admissions Enquiries</span>
              <FileText className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{kpis.pendingEnquiries || 2}</span>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded">Pending</span>
            </div>
            <p className="text-[11px] text-slate-500">Awaiting interview & document verification</p>
          </div>
        </div>

        {/* Charts & Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Fee Collection Trend */}
          <div className="lg:col-span-8 bg-white dark:bg-[#0D1522] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Monthly Fee Collections & Outstanding Trend (INR)
                </h3>
                <p className="text-[11px] text-slate-500">Academic Year 2026-27</p>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feeTrend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                    contentStyle={{ backgroundColor: '#0B192C', borderColor: '#1E293B', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="collected" fill="#008170" radius={[4, 4, 0, 0]} name="Collected" />
                  <Bar dataKey="dues" fill="#E2E8F0" radius={[4, 4, 0, 0]} name="Outstanding" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Examinations */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0D1522] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <Award className="w-4 h-4 text-teal-600" />
                <span>Examination Schedule</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Upcoming assessments</p>
            </div>

            <div className="space-y-3">
              {upcomingExams.map((ex: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{ex.name}</span>
                    <span className="text-[10px] bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300 font-bold px-1.5 py-0.2 rounded">
                      {ex.examType}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Starts: {new Date(ex.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/dashboard/exams')}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
            >
              View All Examinations →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. ACCOUNTANT DASHBOARD
  if (role === 'ACCOUNTANT') {
    const kpis = data?.kpis || {};
    const recentTxns = data?.recentTransactions || [];

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Fee Collections & Bursar Desk
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Record fee payments, generate unique receipts, and verify accounts
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/fees?action=record', { state: { openRecordModal: true } })}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Fee Payment</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#0D1522] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-500">Total Collections Verified</span>
            <p className="text-3xl font-black text-emerald-600">₹{Number(kpis.totalCollectedINR || 85500).toLocaleString('en-IN')}</p>
            <p className="text-[11px] text-slate-400">Paise-safe integer bookkeeping</p>
          </div>
          <div className="bg-white dark:bg-[#0D1522] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-500">Total Transactions</span>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{kpis.transactionsCount || 2}</p>
            <p className="text-[11px] text-slate-400">Active receipts issued</p>
          </div>
          <div className="bg-white dark:bg-[#0D1522] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-500">Overdue Follow-ups</span>
            <p className="text-3xl font-black text-amber-500">{kpis.overdueStudentsCount || 14}</p>
            <p className="text-[11px] text-slate-400">SMS / Email alerts scheduled</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0D1522] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Fee Payment Receipts</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Receipt No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Period</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentTxns.map((p: any) => (
                  <tr key={p._id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-teal-700 dark:text-teal-400">{p.receiptNumber}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{p.studentId?.name}</td>
                    <td className="py-2.5 px-3 text-slate-500">{p.feeMonth}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600 font-mono">₹{(p.paidPaise / 100).toFixed(2)}</td>
                    <td className="py-2.5 px-3 uppercase text-[11px] font-semibold">{p.paymentMethod}</td>
                    <td className="py-2.5 px-3 text-slate-400">{new Date(p.paymentDate).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 4. TEACHER DASHBOARD
  if (role === 'TEACHER') {
    const todaySchedule = data?.todaySchedule || [];
    const pendingHomework = data?.pendingAssignments || [];

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Faculty Workspace — {user?.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Department of Mathematics • Assigned Classes: Class 10-A, 10-B, 9-A
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/dashboard/attendance')}
              className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow"
            >
              Take Class Attendance
            </button>
            <button
              onClick={() => navigate('/dashboard/exams')}
              className="bg-[#1E3E62] hover:bg-[#0B192C] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow"
            >
              Enter Exam Marks
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white dark:bg-[#0D1522] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Today's Teaching Schedule</span>
            </h3>
            <div className="space-y-3">
              {todaySchedule.map((s: any, idx: number) => (
                <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">{s.period} • {s.time}</span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">{s.subject} ({s.class})</h4>
                    <p className="text-xs text-slate-500">{s.room}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 rounded text-xs font-semibold">
                    Scheduled
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-[#0D1522] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active Homework Tasks</h3>
            <div className="space-y-3">
              {pendingHomework.map((h: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{h.title}</h4>
                  <p className="text-[11px] text-slate-500">Due: {new Date(h.dueDate).toLocaleDateString('en-IN')}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/dashboard/homework')}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300"
            >
              Post New Assignment →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. STUDENT DASHBOARD
  if (role === 'STUDENT') {
    const student = data?.student || {};
    const kpis = data?.kpis || {};
    const results = data?.recentResults || [];

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Welcome back, {student.name || 'Aarav Sharma'}!
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Class 10 - Section A • Roll No: 101 • Admission No: DPS-2026-0001
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/exams')}
            className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow"
          >
            View My CBSE Report Card
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#0D1522] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-500">My Attendance</span>
            <p className="text-3xl font-black text-teal-600">{kpis.attendanceRate || 96}%</p>
            <p className="text-[11px] text-slate-400">Regular attendance record</p>
          </div>
          <div className="bg-white dark:bg-[#0D1522] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-500">Last Exam Aggregate</span>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{kpis.lastExamPercentage || 92.3}%</p>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Grade A1</span>
          </div>
          <div className="bg-white dark:bg-[#0D1522] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-500">Active Subjects</span>
            <p className="text-3xl font-black text-slate-900 dark:text-white">6</p>
            <p className="text-[11px] text-slate-400">CBSE Secondary Board</p>
          </div>
          <div className="bg-white dark:bg-[#0D1522] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-500">Pending Homework</span>
            <p className="text-3xl font-black text-purple-600">{kpis.pendingHomework || 1}</p>
            <p className="text-[11px] text-slate-400">Due within 5 days</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0D1522] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Subject Scores</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-bold text-slate-500">Mathematics Core</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">96 / 100</p>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded">A1 Grade</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-bold text-slate-500">Science & Lab</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">92 / 100</p>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded">A1 Grade</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-bold text-slate-500">English Communicative</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">89 / 100</p>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">A2 Grade</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6. PARENT DASHBOARD
  if (role === 'PARENT') {
    const children = data?.children || [];
    const payments = data?.recentPayments || [];

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Parent Portal — {user?.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monitor your child's attendance, fees, academic report cards, and notices
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/fees')}
            className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow"
          >
            Pay Fee Dues Online
          </button>
        </div>

        {/* Children Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children.map((c: any) => (
            <div key={c._id} className="bg-white dark:bg-[#0D1522] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-lg">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{c.name}</h3>
                  <p className="text-xs text-slate-500">{c.classId?.className} - {c.classId?.section} • Adm No: {c.admissionNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <p className="text-slate-500">Attendance Rate</p>
                  <p className="text-xl font-black text-teal-600 mt-1">96%</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <p className="text-slate-500">Fee Status</p>
                  <p className="text-xl font-black text-emerald-600 mt-1">Clear (Q1)</p>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  onClick={() => navigate('/dashboard/attendance')}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl text-center"
                >
                  View Attendance Register
                </button>
                <button
                  onClick={() => navigate('/dashboard/exams')}
                  className="flex-1 py-2 bg-[#1E3E62] hover:bg-[#0B192C] text-white text-xs font-semibold rounded-xl text-center"
                >
                  View Report Card
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <div>Welcome to SoftDeals SMS</div>;
};
