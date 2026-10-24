import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import {
  GraduationCap,
  Search,
  Plus,
  Upload,
  Filter,
  CheckCircle,
  Eye,
  FileText,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState<any>(null);

  // Add Student Form State
  const [newStudent, setNewStudent] = useState({
    name: '',
    gender: 'Male',
    dob: '',
    classId: '',
    rollNumber: '',
    admissionNumber: '',
    email: '',
    phone: '',
    fatherName: '',
    fatherPhone: '',
    motherName: '',
    emergencyContact: '',
    concessionPercent: 0,
    createUserAccount: true,
  });

  const fetchStudents = async (query?: string, pageNum: number = pagination.page) => {
    try {
      setLoading(true);
      const q = query !== undefined ? query : search;
      const params: any = {
        page: pageNum,
        limit: pagination.limit,
      };
      if (q && q.trim()) params.search = q.trim();
      if (selectedClass) params.classId = selectedClass;

      const res = await api.get('/students', { params });
      if (res.data.success) {
        setStudents(res.data.students);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await api.get('/academics/classes');
      if (res.data.success) {
        setClasses(res.data.classes);
        if (res.data.classes.length > 0 && !newStudent.classId) {
          setNewStudent((prev) => ({ ...prev, classId: res.data.classes[0]._id }));
        }
      }
    } catch (err) {
      console.error('Failed to load classes:', err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Live debounced search & class filter (250ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents(search, 1);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedClass]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents(search, 1);
  };

  const handleClearSearch = () => {
    setSearch('');
    fetchStudents('', 1);
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchStudents(search, newPage);
  };

  // Instant zero-latency in-memory filter as user types
  const displayedStudents = search.trim()
    ? students.filter((std) => {
        const q = search.toLowerCase().trim();
        const name = (std.name || '').toLowerCase();
        const adm = (std.admissionNumber || '').toLowerCase();
        const roll = (std.rollNumber || '').toLowerCase();
        const father = (std.parents?.fatherName || '').toLowerCase();
        const mother = (std.parents?.motherName || '').toLowerCase();
        const emergency = (std.parents?.emergencyContact || '').toLowerCase();
        const phone = (std.phone || std.parents?.fatherPhone || '').toLowerCase();
        const email = (std.email || '').toLowerCase();
        const cls = (std.classId?.className || '').toLowerCase();
        const sec = (std.classId?.section || '').toLowerCase();
        return (
          name.includes(q) ||
          adm.includes(q) ||
          roll.includes(q) ||
          father.includes(q) ||
          mother.includes(q) ||
          emergency.includes(q) ||
          phone.includes(q) ||
          email.includes(q) ||
          `${cls} ${sec}`.includes(q)
        );
      })
    : students;

  const handleAddStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: newStudent.name,
        gender: newStudent.gender,
        dob: newStudent.dob,
        classId: newStudent.classId,
        rollNumber: newStudent.rollNumber,
        admissionNumber: newStudent.admissionNumber || undefined,
        email: newStudent.email,
        phone: newStudent.phone,
        parents: {
          fatherName: newStudent.fatherName,
          fatherPhone: newStudent.fatherPhone,
          motherName: newStudent.motherName,
          emergencyContact: newStudent.emergencyContact || newStudent.fatherPhone,
        },
        concessionPercent: Number(newStudent.concessionPercent || 0),
        createUserAccount: newStudent.createUserAccount,
      };

      const res = await api.post('/students', payload);
      if (res.data.success) {
        alert(`Student ${res.data.student.name} admitted successfully with Admission No. ${res.data.student.admissionNumber}!`);
        setIsAddModalOpen(false);
        fetchStudents();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to admit student.');
    }
  };

  const openStudentDetails = async (studentId: string) => {
    try {
      const res = await api.get(`/students/${studentId}`);
      if (res.data.success) {
        setViewStudent(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch student details:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Student Enrolment Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Search, filter, view printable student profile records, and manage admissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Upload className="w-4 h-4" />
            <span>CSV Bulk Import</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Admit New Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#0D1522] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, admission no, roll no, phone..."
              className="w-full pl-9 pr-20 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-inner"
            />
            <div className="absolute right-2 flex items-center space-x-1">
              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-[11px] font-semibold transition"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Classes</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.className} - {c.section}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Search Status Pill */}
        {search.trim() && (
          <div className="flex items-center justify-between text-xs bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 px-3 py-1.5 rounded-xl">
            <div className="flex items-center space-x-2 text-teal-800 dark:text-teal-300">
              <span className="font-semibold">Text Search:</span>
              <span>Showing results matching <span className="font-bold underline">"{search}"</span> ({displayedStudents.length} found)</span>
            </div>
            <button
              onClick={handleClearSearch}
              className="text-teal-700 dark:text-teal-300 font-bold hover:underline flex items-center space-x-1"
            >
              <span>Reset</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Students Data Table */}
      <div className="bg-white dark:bg-[#0D1522] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Admission No.</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class & Sec</th>
                <th className="py-3 px-4">Roll No.</th>
                <th className="py-3 px-4">Parent / Guardian</th>
                <th className="py-3 px-4">Emergency Contact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                      <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                        {search.trim() ? `No students found matching "${search}"` : 'No student records enrolled yet.'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {search.trim() ? 'Try typing a different name, roll number, or admission ID.' : 'Click "+ Admit New Student" above to enrol students.'}
                      </p>
                      {search.trim() && (
                        <button
                          onClick={handleClearSearch}
                          className="mt-2 px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow transition"
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                displayedStudents.map((std) => (
                  <tr key={std._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-teal-700 dark:text-teal-400">
                      {std.admissionNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{std.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {std.gender} • DOB: {new Date(std.dob).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {std.classId?.className} - {std.classId?.section}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">{std.rollNumber || '—'}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {std.parents?.fatherName || 'Guardian'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {std.parents?.emergencyContact || std.phone || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded text-[11px]">
                        {std.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openStudentDetails(std._id)}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-slate-700 dark:text-slate-200 hover:text-teal-700 rounded-lg text-xs font-semibold transition inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-800 dark:text-slate-200">{displayedStudents.length}</span> of <span className="font-bold text-slate-800 dark:text-slate-200">{pagination.total || students.length}</span> students
          </div>
          {pagination.totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300"
              >
                Previous
              </button>
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Student Details / Printable Card Modal */}
      {viewStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-[#0D1522] rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
            <div className="no-print p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Official Student Identity & Academic Profile
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-[#0B192C] text-white rounded-lg text-xs font-semibold"
                >
                  Print Profile
                </button>
                <button onClick={() => setViewStudent(null)} className="p-1 text-slate-500 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 text-xs space-y-6 printable-card">
              <div className="flex items-center space-x-4 border-b border-slate-200 pb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0B192C] to-teal-600 text-white flex items-center justify-center text-2xl font-black">
                  {viewStudent.student.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{viewStudent.student.name}</h2>
                  <p className="text-slate-500">
                    Admission No: <span className="font-bold text-teal-700 font-mono">{viewStudent.student.admissionNumber}</span> • Roll: {viewStudent.student.rollNumber}
                  </p>
                  <p className="text-slate-600 font-semibold">
                    {viewStudent.student.classId?.className} - Section {viewStudent.student.classId?.section}
                  </p>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border">
                  <p className="text-slate-500">Attendance Rate</p>
                  <p className="text-lg font-black text-teal-700">{viewStudent.stats?.attendanceRate}%</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border">
                  <p className="text-slate-500">Total Fees Paid</p>
                  <p className="text-lg font-black text-emerald-700">₹{viewStudent.stats?.totalPaidINR}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border">
                  <p className="text-slate-500">Fee Concession</p>
                  <p className="text-lg font-black text-slate-800">{viewStudent.student.concessionPercent || 0}%</p>
                </div>
              </div>

              {/* Parents Details */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wide">Family & Emergency Contacts</h4>
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border">
                  <div>
                    <span className="text-slate-500">Father's Name:</span> <span className="font-semibold text-slate-800">{viewStudent.student.parents?.fatherName || 'N/A'}</span>
                    <p className="text-[11px] text-slate-500">Phone: {viewStudent.student.parents?.fatherPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Mother's Name:</span> <span className="font-semibold text-slate-800">{viewStudent.student.parents?.motherName || 'N/A'}</span>
                    <p className="text-[11px] text-slate-500">Emergency: {viewStudent.student.parents?.emergencyContact || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-[#0D1522] rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Admit New Student to School
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    placeholder="e.g. Diya Patel"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Class & Section *</label>
                  <select
                    value={newStudent.classId}
                    onChange={(e) => setNewStudent({ ...newStudent, classId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                  >
                    {classes.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.className} - {c.section}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={newStudent.dob}
                    onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={newStudent.rollNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                    placeholder="e.g. 106"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={newStudent.fatherName}
                    onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })}
                    placeholder="e.g. Jayesh Patel"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Father's Contact Number *</label>
                  <input
                    type="tel"
                    required
                    value={newStudent.fatherPhone}
                    onChange={(e) => setNewStudent({ ...newStudent, fatherPhone: e.target.value })}
                    placeholder="+91 98100 00000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Approved Fee Concession (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newStudent.concessionPercent}
                    onChange={(e) => setNewStudent({ ...newStudent, concessionPercent: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow"
                >
                  Confirm Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Bulk Import Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0D1522] rounded-3xl max-w-md w-full shadow-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Bulk CSV Student Import</h3>
            <p className="text-slate-500">
              Upload a standard UTF-8 encoded CSV file containing columns: <code className="font-mono bg-slate-100 p-0.5 rounded">Name, Gender, DOB, Class, FatherName, Phone</code>.
            </p>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center space-y-2">
              <Upload className="w-8 h-8 text-teal-600 mx-auto" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">Click to browse or drop CSV file here</p>
              <p className="text-[10px] text-slate-400">Sample template available in documentation</p>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsBulkModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl">
                Close
              </button>
              <button
                onClick={() => {
                  alert('Bulk file imported successfully. 15 student records processed.');
                  setIsBulkModalOpen(false);
                }}
                className="px-5 py-2 bg-teal-600 text-white font-bold rounded-xl"
              >
                Simulate Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
