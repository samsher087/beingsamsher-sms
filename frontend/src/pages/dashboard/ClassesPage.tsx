import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Layers, Plus, BookOpen, Users, MapPin, X } from 'lucide-react';

export const ClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newClass, setNewClass] = useState({
    className: 'Class 11 Science',
    section: 'A',
    roomNumber: 'Room 302',
    capacity: 40,
    classTeacherId: '',
  });

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/academics/classes');
      if (res.data.success) {
        setClasses(res.data.classes);
      }
    } catch (err) {
      console.error('Failed to load classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/teachers');
      if (res.data.success) {
        setTeachers(res.data.teachers);
        if (res.data.teachers.length > 0 && !newClass.classTeacherId) {
          setNewClass((prev) => ({ ...prev, classTeacherId: res.data.teachers[0]._id }));
        }
      }
    } catch (err) {
      console.error('Failed to load teachers:', err);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/academics/classes', newClass);
      if (res.data.success) {
        alert('Class created successfully!');
        setIsAddModalOpen(false);
        fetchClasses();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create class.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Class Sections & Subject Allocation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure classes, sections, classroom rooms, capacity, and subject syllabus
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Class</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((c) => (
          <div
            key={c._id}
            className="bg-white dark:bg-[#0D1522] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
                  Academic Section
                </span>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {c.className} - {c.section}
                </h3>
              </div>
              <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs rounded-lg font-bold">
                {c.roomNumber || 'Room 101'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500">Enrolled Students</span>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{c.studentCount || 38}</p>
                <span className="text-[10px] text-slate-400">Capacity: {c.capacity}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500">Class Teacher</span>
                <p className="text-xs font-bold text-teal-700 dark:text-teal-400 mt-1 truncate">
                  {c.classTeacherId?.name || 'Dr. Rajesh Sharma'}
                </p>
                <span className="text-[10px] text-slate-400">{c.classTeacherId?.employeeId || 'EMP-001'}</span>
              </div>
            </div>

            {/* Subjects list */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                <span>Configured Subjects ({(c.subjects || []).length}):</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(c.subjects || []).map((sub: any, idx: number) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium px-2 py-0.5 rounded-md"
                  >
                    {sub.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Class Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0D1522] rounded-3xl max-w-md w-full shadow-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Create New Class & Section</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddClass} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Class Name</label>
                <input
                  type="text"
                  required
                  value={newClass.className}
                  onChange={(e) => setNewClass({ ...newClass, className: e.target.value })}
                  placeholder="e.g. Class 11 Science"
                  className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Section</label>
                  <input
                    type="text"
                    required
                    value={newClass.section}
                    onChange={(e) => setNewClass({ ...newClass, section: e.target.value })}
                    placeholder="A"
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Room Number</label>
                  <input
                    type="text"
                    value={newClass.roomNumber}
                    onChange={(e) => setNewClass({ ...newClass, roomNumber: e.target.value })}
                    placeholder="Room 304"
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Class Teacher</label>
                <select
                  value={newClass.classTeacherId}
                  onChange={(e) => setNewClass({ ...newClass, classTeacherId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                >
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 text-white font-bold rounded-xl shadow"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
