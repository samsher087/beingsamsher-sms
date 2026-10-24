import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  CalendarCheck,
  Check,
  X,
  Clock,
  ShieldAlert,
  Save,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const canMarkAttendance = !!user?.role && ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER'].includes(user.role);

  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [register, setRegister] = useState<any[]>([]);
  const [isMarked, setIsMarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchClasses = async () => {
    try {
      const res = await api.get('/academics/classes');
      if (res.data.success && res.data.classes.length > 0) {
        setClasses(res.data.classes);
        setSelectedClass(res.data.classes[0]._id);
      }
    } catch (err) {
      console.error('Failed to load classes:', err);
    }
  };

  const fetchRegister = async () => {
    if (!selectedClass || !date) return;
    try {
      setLoading(true);
      const res = await api.get('/attendance/class', {
        params: { classId: selectedClass, date },
      });
      if (res.data.success) {
        setRegister(res.data.register);
        setIsMarked(res.data.isMarked);
      }
    } catch (err) {
      console.error('Failed to load register:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchRegister();
    }
  }, [selectedClass, date]);

  const updateStudentStatus = (studentId: string, status: string) => {
    setRegister((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
    );
  };

  const markAllPresent = () => {
    setRegister((prev) => prev.map((r) => ({ ...r, status: 'PRESENT' })));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const records = register.map((r) => ({
        studentId: r.studentId,
        status: r.status,
        remarks: r.remarks || '',
      }));

      const res = await api.post('/attendance/class', {
        classId: selectedClass,
        date,
        records,
      });

      if (res.data.success) {
        toast.success('Class attendance register successfully saved and locked.', 'Attendance Verified');
        setIsMarked(true);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit attendance.');
    } finally {
      setSaving(false);
    }
  };

  const presentCount = register.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
  const attendanceRate = register.length > 0 ? Math.round((presentCount / register.length) * 100) : 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Daily Student Attendance Register
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {canMarkAttendance
              ? 'Record class-wise student attendance with roll numbers, late entries, and leave tracking'
              : 'Daily classroom attendance records, punctuality logs, and monthly presence overview'}
          </p>
        </div>
        {canMarkAttendance && (
          <div className="flex items-center space-x-2">
            <button
              onClick={markAllPresent}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition"
            >
              Mark All Present
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || register.length === 0}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save & Publish Attendance'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Selector Controls & Summary Card */}
      <div className="bg-white dark:bg-[#0D1522] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 flex flex-wrap items-center gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Class & Section</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
            >
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.className} - Section {c.section} ({c.roomNumber || 'Room'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Attendance Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
            />
          </div>

          <div className="pt-4">
            {isMarked ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Marked for Today</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Pending Today</span>
              </span>
            )}
          </div>
        </div>

        <div className="md:col-span-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center">
          <span className="text-xs font-semibold text-slate-500">Attendance Rate</span>
          <div className="text-2xl font-black text-teal-700 dark:text-teal-400 mt-1">
            {attendanceRate}%
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {presentCount} Present • {register.length - presentCount} Absent / Excused
          </p>
        </div>
      </div>

      {/* Student Attendance Register Table */}
      <div className="bg-white dark:bg-[#0D1522] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading student roster...</div>
        ) : register.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No students found enrolled in this class.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Roll</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Admission Number</th>
                  <th className="py-3 px-4 text-center">Attendance Status</th>
                  <th className="py-3 px-4">Teacher's Note / Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {register.map((std) => (
                  <tr key={std.studentId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {std.rollNumber || '—'}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {std.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {std.admissionNumber}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {canMarkAttendance ? (
                        <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 gap-1">
                          <button
                            type="button"
                            onClick={() => updateStudentStatus(std.studentId, 'PRESENT')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                              std.status === 'PRESENT'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStudentStatus(std.studentId, 'ABSENT')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                              std.status === 'ABSENT'
                                ? 'bg-rose-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStudentStatus(std.studentId, 'LATE')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                              std.status === 'LATE'
                                ? 'bg-amber-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
                            }`}
                          >
                            Late
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStudentStatus(std.studentId, 'EXCUSED')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                              std.status === 'EXCUSED'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
                            }`}
                          >
                            Leave
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
                            std.status === 'PRESENT'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : std.status === 'ABSENT'
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                              : std.status === 'LATE'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                              : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                          }`}
                        >
                          {std.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {canMarkAttendance ? (
                        <input
                          type="text"
                          value={std.remarks || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRegister((prev) =>
                              prev.map((r) => (r.studentId === std.studentId ? { ...r, remarks: val } : r))
                            );
                          }}
                          placeholder="Optional remarks..."
                          className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                        />
                      ) : (
                        <span className="text-slate-500 italic text-xs">{std.remarks || '—'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
