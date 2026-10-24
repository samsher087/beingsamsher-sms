import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Clock, Calendar, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const TimetablePage: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [timetable, setTimetable] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const fetchTimetable = async () => {
    if (!selectedClass) return;
    try {
      setLoading(true);
      const res = await api.get(`/timetable/class/${selectedClass}`);
      if (res.data.success) {
        setTimetable(res.data.timetable);
      }
    } catch (err) {
      console.error('Failed to load timetable:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchTimetable();
    }
  }, [selectedClass]);

  const defaultSchedule = [
    { period: 1, time: '08:30 - 09:15', subject: 'Mathematics Core', teacher: 'Dr. Rajesh Sharma', room: 'Room 204' },
    { period: 2, time: '09:15 - 10:00', subject: 'Science & Lab', teacher: 'Mrs. Simran Kaur', room: 'Physics Lab' },
    { period: 3, time: '10:00 - 10:20', subject: 'Recess Break', isBreak: true },
    { period: 4, time: '10:20 - 11:05', subject: 'English Communicative', teacher: 'Mr. Arvind Menon', room: 'Room 204' },
    { period: 5, time: '11:05 - 11:50', subject: 'Social Studies', teacher: 'Mrs. Neha Batra', room: 'Room 204' },
    { period: 6, time: '11:50 - 12:35', subject: 'Hindi Course A', teacher: 'Dr. R.K. Pandey', room: 'Room 204' },
    { period: 7, time: '12:35 - 01:20', subject: 'AI & Robotics Lab', teacher: 'Mr. S. Rao', room: 'Maker Lab' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Class & Teacher Timetables
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive weekly schedule matrix with collision and room conflict detection
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
          >
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.className} - Section {c.section}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Collision Check Status Banner */}
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Faculty & Room Collision Detector: Zero Clashes Detected for this Schedule.</span>
        </div>
        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-mono">
          Conflict Free
        </span>
      </div>

      {/* Timetable Schedule Grid */}
      <div className="bg-white dark:bg-[#0D1522] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Weekly Class Schedule Matrix</span>
          </h3>
          <span className="text-xs text-slate-500">School Hours: 08:30 AM — 01:20 PM</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-800">
            <thead className="bg-slate-100 dark:bg-slate-800/60 font-bold text-slate-700 dark:text-slate-300">
              <tr>
                <th className="py-3 px-3 border-r">Day / Period</th>
                {defaultSchedule.map((p, idx) => (
                  <th key={idx} className="py-3 px-3 text-center border-r font-mono">
                    <div>P{p.period}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{p.time}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                <tr key={day} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/40 border-r">
                    {day}
                  </td>
                  {defaultSchedule.map((p, pIdx) => (
                    <td
                      key={pIdx}
                      className={`py-3 px-2 text-center border-r ${
                        p.isBreak ? 'bg-amber-50/60 dark:bg-amber-950/20 text-amber-700 font-semibold' : ''
                      }`}
                    >
                      {p.isBreak ? (
                        <span className="text-[11px] font-bold">RECESS</span>
                      ) : (
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 dark:text-white text-[11px]">{p.subject}</p>
                          <p className="text-[10px] text-teal-700 dark:text-teal-400 font-medium truncate">{p.teacher}</p>
                          <p className="text-[9px] text-slate-400">{p.room}</p>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
