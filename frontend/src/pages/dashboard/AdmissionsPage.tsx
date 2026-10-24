import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import {
  FileText,
  Search,
  CheckCircle,
  Calendar,
  Phone,
  Mail,
  UserPlus,
  X,
  Filter,
} from 'lucide-react';

export const AdmissionsPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [convertModalEnquiry, setConvertModalEnquiry] = useState<any>(null);
  const [selectedClassId, setSelectedClassId] = useState('');

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/admissions/enquiries', { params });
      if (res.data.success) {
        setEnquiries(res.data.enquiries);
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await api.get('/academics/classes');
      if (res.data.success && res.data.classes.length > 0) {
        setClasses(res.data.classes);
        setSelectedClassId(res.data.classes[0]._id);
      }
    } catch (err) {
      console.error('Failed to load classes:', err);
    }
  };

  useEffect(() => {
    fetchEnquiries();
    fetchClasses();
  }, [statusFilter]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await api.put(`/admissions/enquiries/${id}/status`, { status: newStatus });
      if (res.data.success) {
        fetchEnquiries();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertModalEnquiry || !selectedClassId) return;

    try {
      const res = await api.post(`/admissions/enquiries/${convertModalEnquiry._id}/convert`, {
        classId: selectedClassId,
      });
      if (res.data.success) {
        alert(res.data.message);
        setConvertModalEnquiry(null);
        fetchEnquiries();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to convert applicant.');
    }
  };

  const statusColors: Record<string, string> = {
    ENQUIRY: 'bg-blue-50 text-blue-700',
    UNDER_REVIEW: 'bg-amber-50 text-amber-700',
    INTERVIEW_SCHEDULED: 'bg-purple-50 text-purple-700',
    APPROVED: 'bg-teal-50 text-teal-700',
    ENROLLED: 'bg-emerald-50 text-emerald-700',
    REJECTED: 'bg-rose-50 text-rose-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Online Admissions Pipeline & CRM
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review applicant enquiries, schedule interviews, and convert approved applicants to enrolled students
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['', 'ENQUIRY', 'INTERVIEW_SCHEDULED', 'APPROVED', 'ENROLLED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === st
                ? 'bg-[#1E3E62] text-white shadow'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {st ? st.replace('_', ' ') : 'All Enquiries'}
          </button>
        ))}
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-[#0D1522] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b">
              <tr>
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Applicant Name</th>
                <th className="py-3 px-4">Class Applied</th>
                <th className="py-3 px-4">Parent Details</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date Submitted</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No admission applications found.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-teal-700 dark:text-teal-400">
                      {enq.applicationNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {enq.applicantName}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {enq.classAppliedFor}
                    </td>
                    <td className="py-3 px-4">
                      <div>{enq.parentName} ({enq.relationship})</div>
                      <div className="text-[10px] text-slate-400 font-mono">{enq.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={enq.status}
                        onChange={(e) => updateStatus(enq._id, e.target.value)}
                        className={`text-[11px] font-bold px-2 py-1 rounded border-0 focus:ring-0 ${statusColors[enq.status] || 'bg-slate-100'}`}
                      >
                        <option value="ENQUIRY">Enquiry</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="ENROLLED">Enrolled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {enq.status === 'ENROLLED' ? (
                        <span className="text-[11px] font-bold text-emerald-600">✓ Enrolled</span>
                      ) : (
                        <button
                          onClick={() => setConvertModalEnquiry(enq)}
                          className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold inline-flex items-center space-x-1"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>1-Click Enroll</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Convert to Student Modal */}
      {convertModalEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0D1522] rounded-3xl max-w-md w-full shadow-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Convert Applicant to Enrolled Student
              </h3>
              <button onClick={() => setConvertModalEnquiry(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <p className="text-slate-600 dark:text-slate-400">
              Confirm enrollment for <span className="font-bold text-slate-900 dark:text-white">{convertModalEnquiry.applicantName}</span>. A permanent Admission Number will be assigned automatically.
            </p>

            <form onSubmit={handleConvert} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Assign Class & Section *</label>
                <select
                  required
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                >
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.className} - {c.section} (Room: {c.roomNumber || 'Room'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setConvertModalEnquiry(null)}
                  className="px-4 py-2 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 text-white font-bold rounded-xl shadow"
                >
                  Confirm & Enrol Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
