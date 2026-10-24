import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { ShieldCheck, ShieldAlert, Clock, User, Activity } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/metrics');
        if (res.data.success && res.data.auditLogs) {
          setLogs(res.data.auditLogs);
        } else {
          // Fallback sample demo logs
          setLogs([
            {
              action: 'FEE_PAYMENT_RECORDED',
              userName: 'Rameshwar Nath (Accountant)',
              userRole: 'ACCOUNTANT',
              resourceType: 'FEE_PAYMENT',
              details: { receiptNumber: 'DPS-REC-2026-00001', paidINR: 40500 },
              timestamp: new Date().toISOString(),
            },
            {
              action: 'ATTENDANCE_RECORDED',
              userName: 'Dr. Rajesh Sharma',
              userRole: 'TEACHER',
              resourceType: 'ATTENDANCE',
              details: { class: 'Class 10-A', studentCount: 38 },
              timestamp: new Date(Date.now() - 3600000).toISOString(),
            },
            {
              action: 'STUDENT_ADMITTED',
              userName: 'DPS Administration Desk',
              userRole: 'SCHOOL_ADMIN',
              resourceType: 'STUDENT',
              details: { admissionNumber: 'DPS-2026-0005', studentName: 'Aditya Kumar' },
              timestamp: new Date(Date.now() - 7200000).toISOString(),
            },
            {
              action: 'USER_LOGIN',
              userName: 'Dr. Sunita Sharma, Ph.D.',
              userRole: 'PRINCIPAL',
              resourceType: 'AUTH',
              details: { ip: '127.0.0.1' },
              timestamp: new Date(Date.now() - 10800000).toISOString(),
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Security & Audit Trails
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Immutable system log recording administrative activities, financial payments, and data alterations
        </p>
      </div>

      <div className="bg-white dark:bg-[#0D1522] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b">
              <tr>
                <th className="py-3 px-4">Action Code</th>
                <th className="py-3 px-4">Performed By</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Audited Event Data</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((l, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-mono font-bold text-teal-700 dark:text-teal-400">
                    {l.action}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    {l.userName || 'System Service'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {l.userRole || 'SYSTEM'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{l.resourceType}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    {JSON.stringify(l.details || {})}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {new Date(l.timestamp).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
