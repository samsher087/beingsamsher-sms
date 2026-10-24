import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  X,
  CheckCircle,
} from 'lucide-react';

export const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newTeacher, setNewTeacher] = useState({
    name: '',
    gender: 'Female',
    email: '',
    phone: '',
    designation: 'Senior TGT Science',
    department: 'Sciences',
    qualification: 'M.Sc. B.Ed',
    salaryPaise: 5500000,
    employeeId: '',
  });

  const fetchTeachers = async (query?: string) => {
    try {
      setLoading(true);
      const q = query !== undefined ? query : search;
      const params: any = {};
      if (q && q.trim()) params.search = q.trim();
      if (department) params.department = department;

      const res = await api.get('/teachers', { params });
      if (res.data.success) {
        setTeachers(res.data.teachers);
      }
    } catch (err) {
      console.error('Failed to load teachers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Live debounced search & department filter
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTeachers(search);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, department]);

  const handleClearSearch = () => {
    setSearch('');
    fetchTeachers('');
  };

  const displayedTeachers = search.trim()
    ? teachers.filter((t) => {
        const q = search.toLowerCase().trim();
        const name = (t.name || '').toLowerCase();
        const emp = (t.employeeId || '').toLowerCase();
        const des = (t.designation || '').toLowerCase();
        const dep = (t.department || '').toLowerCase();
        const email = (t.email || '').toLowerCase();
        const phone = (t.phone || '').toLowerCase();
        return (
          name.includes(q) ||
          emp.includes(q) ||
          des.includes(q) ||
          dep.includes(q) ||
          email.includes(q) ||
          phone.includes(q)
        );
      })
    : teachers;

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/teachers', newTeacher);
      if (res.data.success) {
        alert(`Teacher ${res.data.teacher.name} registered successfully with ID ${res.data.teacher.employeeId}`);
        setIsAddModalOpen(false);
        fetchTeachers();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add teacher.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Faculty & Staff Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage teaching faculty, qualifications, assigned subjects, and employment status
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Register Faculty</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#0D1522] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 max-w-md relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by faculty name, designation, employee ID..."
              className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-inner"
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Departments</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Sciences">Sciences</option>
            <option value="Humanities">Humanities</option>
            <option value="General">General</option>
          </select>
        </div>

        {search.trim() && (
          <div className="flex items-center justify-between text-xs bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 px-3 py-1.5 rounded-xl">
            <span className="text-teal-800 dark:text-teal-300">
              Showing <span className="font-bold">{displayedTeachers.length}</span> faculty matching <span className="font-bold underline">"{search}"</span>
            </span>
            <button
              onClick={handleClearSearch}
              className="text-teal-700 dark:text-teal-300 font-bold hover:underline"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Teacher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedTeachers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white dark:bg-[#0D1522] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
              No faculty members found matching "{search}"
            </p>
            <button
              onClick={handleClearSearch}
              className="mt-3 px-3 py-1 bg-teal-600 text-white rounded-lg text-xs font-semibold"
            >
              Clear Search
            </button>
          </div>
        ) : (
          displayedTeachers.map((t) => (
          <div
            key={t._id}
            className="bg-white dark:bg-[#0D1522] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0B192C] to-teal-700 text-white font-bold flex items-center justify-center text-lg shadow">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</h3>
                  <span className="text-[11px] font-mono font-bold text-teal-600">{t.employeeId}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">
                {t.status}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3">
              <p className="flex items-center space-x-2">
                <Briefcase className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">{t.designation}</span>
              </p>
              <p className="flex items-center space-x-2">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{t.qualification} ({t.department})</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{t.email}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{t.phone || '+91 98111 00000'}</span>
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
              <span className="font-semibold">Assigned Subjects:</span>{' '}
              {t.assignedClasses && t.assignedClasses.length > 0
                ? t.assignedClasses.map((ac: any) => ac.subject).join(', ')
                : 'Mathematics Core, Applied Algebra'}
            </div>
          </div>
        )))}
      </div>

      {/* Add Teacher Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-[#0D1522] rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Register Faculty Member</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                    placeholder="e.g. Mrs. Priya Nair"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Official Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                    placeholder="priya.nair@dps.edu.in"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                    <input
                      type="text"
                      value={newTeacher.designation}
                      onChange={(e) => setNewTeacher({ ...newTeacher, designation: e.target.value })}
                      placeholder="e.g. Senior PGT Physics"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                    <select
                      value={newTeacher.department}
                      onChange={(e) => setNewTeacher({ ...newTeacher, department: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Sciences">Sciences</option>
                      <option value="Humanities">Humanities</option>
                      <option value="Languages">Languages</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Qualifications</label>
                  <input
                    type="text"
                    value={newTeacher.qualification}
                    onChange={(e) => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                    placeholder="e.g. M.Sc. Physics, B.Ed"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow"
                >
                  Register Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
