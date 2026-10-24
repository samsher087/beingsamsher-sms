import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Bell, Plus, Pin, Trash2, Calendar, AlertTriangle, X } from 'lucide-react';

export const NoticesPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const canPublish = !!user?.role && ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER'].includes(user.role);
  const canDelete = !!user?.role && ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'].includes(user.role);

  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    targetRole: 'ALL',
    priority: 'NORMAL',
    isPinned: false,
  });

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notices');
      if (res.data.success) {
        setNotices(res.data.notices);
      }
    } catch (err) {
      console.error('Failed to load notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/notices', newNotice);
      if (res.data.success) {
        toast.success('Notice published successfully across selected roles.', 'Circular Released');
        setIsModalOpen(false);
        setNewNotice({ title: '', content: '', targetRole: 'ALL', priority: 'NORMAL', isPinned: false });
        fetchNotices();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to publish notice.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this notice?')) return;
    try {
      await api.delete(`/notices/${id}`);
      toast.success('Notice removed from the board.', 'Notice Deleted');
      fetchNotices();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete notice.');
    }
  };

  const priorityColors: Record<string, string> = {
    URGENT: 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300',
    HIGH: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
    NORMAL: 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300',
    LOW: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            School Notices & Circulars
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {canPublish
              ? 'Publish school-wide announcements, role targeted circulars, and manage pinned notices'
              : 'Official school announcements, academic circulars, and administrative updates'}
          </p>
        </div>
        {canPublish && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Notice</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notices.map((n) => (
          <div
            key={n._id}
            className="bg-white dark:bg-[#0D1522] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] uppercase ${priorityColors[n.priority]}`}>
                  {n.priority} PRIORITY
                </span>
                <span className="text-slate-400">•</span>
                <span className="font-semibold text-slate-600 dark:text-slate-400">
                  Target: {n.targetRole}
                </span>
                {n.isPinned && (
                  <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] flex items-center space-x-1">
                    <Pin className="w-3 h-3" />
                    <span>PINNED</span>
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3 text-slate-400">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(n.publishDate).toLocaleDateString('en-IN')}</span>
                </span>
                {canDelete && (
                  <button
                    onClick={() => handleDelete(n._id)}
                    className="text-slate-400 hover:text-red-500 transition"
                    title="Delete Notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">{n.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.content}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0D1522] rounded-3xl max-w-lg w-full shadow-2xl p-6 border space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Publish School Announcement</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateNotice} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Notice Headline *</label>
                <input
                  type="text"
                  required
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="e.g. Schedule for Annual Sports Day 2026"
                  className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Target Audience</label>
                  <select
                    value={newNotice.targetRole}
                    onChange={(e) => setNewNotice({ ...newNotice, targetRole: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                  >
                    <option value="ALL">Everyone (School-Wide)</option>
                    <option value="STUDENTS">Students Only</option>
                    <option value="PARENTS">Parents Only</option>
                    <option value="TEACHERS">Teachers Only</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Priority</label>
                  <select
                    value={newNotice.priority}
                    onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Notice Body / Content *</label>
                <textarea
                  rows={4}
                  required
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  placeholder="Write announcement details..."
                  className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                />
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="pin"
                  checked={newNotice.isPinned}
                  onChange={(e) => setNewNotice({ ...newNotice, isPinned: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="pin" className="font-semibold text-slate-700 dark:text-slate-300">
                  Pin notice to the top of notice boards
                </label>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-teal-600 text-white font-bold rounded-xl shadow">
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
