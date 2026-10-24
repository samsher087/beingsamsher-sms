import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Plus, Calendar, CheckCircle2, Clock, X } from 'lucide-react';

export const HomeworkPage: React.FC = () => {
  const { user } = useAuth();
  const canPostHomework = !!user?.role && ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'].includes(user.role);

  const [assignments, setAssignments] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    classId: '',
    subject: 'Mathematics Core',
    title: '',
    instructions: '',
    dueDate: '',
    maxMarks: 20,
  });

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notices/assignments/list');
      if (res.data.success) {
        setAssignments(res.data.assignments);
      }
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await api.get('/academics/classes');
      if (res.data.success && res.data.classes.length > 0) {
        setClasses(res.data.classes);
        setForm((prev) => ({ ...prev, classId: res.data.classes[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load classes:', err);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchClasses();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/notices/assignments/create', form);
      if (res.data.success) {
        alert('Assignment posted successfully.');
        setIsModalOpen(false);
        fetchAssignments();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to post assignment.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Homework & Academic Tasks
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {canPostHomework
              ? 'Publish daily homework, assignment problem sets, and review submission deadlines'
              : 'Assigned classroom homework, project submissions, and subject deadlines'}
          </p>
        </div>
        {canPostHomework && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Homework</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((a) => (
          <div
            key={a._id}
            className="bg-white dark:bg-[#0D1522] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-0.5 rounded-full">
                {a.subject}
              </span>
              <span className="font-semibold text-slate-500">
                {a.classId?.className} - {a.classId?.section}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
              {a.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {a.instructions}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Due: {new Date(a.dueDate).toLocaleDateString('en-IN')}</span>
              </span>
              <span className="font-bold text-slate-700 dark:text-slate-300">Max: {a.maxMarks} Marks</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0D1522] rounded-3xl max-w-md w-full shadow-2xl p-6 border space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Post Homework Task</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Target Class</label>
                <select
                  value={form.classId}
                  onChange={(e) => setForm({ ...form, classId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                >
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.className} - {c.section}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Chapter 6 Ex 6.2 Solutions"
                  className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Instructions</label>
                <textarea
                  rows={3}
                  required
                  value={form.instructions}
                  onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                  placeholder="Detail instructions for students..."
                  className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Submission Due Date</label>
                <input
                  type="date"
                  required
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-teal-600 text-white font-bold rounded-xl shadow">
                  Publish Homework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
