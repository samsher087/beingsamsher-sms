import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ReportCardModal } from '../../components/ReportCardModal';
import {
  Award,
  Plus,
  Calendar,
  Eye,
  CheckCircle,
  Clock,
  Printer,
  X,
  FileCheck,
} from 'lucide-react';

export const ExamsPage: React.FC = () => {
  const { user } = useAuth();
  const canEnterMarks = !!user?.role && ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER'].includes(user.role);

  const [exams, setExams] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReportCard, setSelectedReportCard] = useState<any>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isMarksModalOpen, setIsMarksModalOpen] = useState(false);
  const [activeExam, setActiveExam] = useState<any>(null);

  // Marks form state
  const [marksStudentId, setMarksStudentId] = useState('');
  const [subjectScores, setSubjectScores] = useState<any[]>([
    { subjectName: 'Mathematics Core', subjectCode: 'MATH-101', marksObtained: 95, maxMarks: 100 },
    { subjectName: 'Science & Lab', subjectCode: 'SCI-101', marksObtained: 90, maxMarks: 100 },
    { subjectName: 'English Communicative', subjectCode: 'ENG-101', marksObtained: 88, maxMarks: 100 },
  ]);
  const [teacherRemarks, setTeacherRemarks] = useState('Consistent and dedicated academic effort.');

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await api.get('/exams/schedules');
      if (res.data.success) {
        setExams(res.data.exams);
        if (res.data.exams.length > 0 && !activeExam) {
          setActiveExam(res.data.exams[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students?limit=50');
      if (res.data.success) {
        setStudents(res.data.students);
        if (res.data.students.length > 0 && !marksStudentId) {
          setMarksStudentId(res.data.students[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    }
  };

  useEffect(() => {
    fetchExams();
    fetchStudents();
  }, []);

  const openReportCard = async (examId: string, studentId: string) => {
    try {
      const res = await api.get(`/exams/report-card/${examId}/${studentId}`);
      if (res.data.success) {
        setSelectedReportCard(res.data.reportCard);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Report card marks not found for this student.');
    }
  };

  const handleSaveMarks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeExam || !marksStudentId) return;

    try {
      const std = students.find((s) => s._id === marksStudentId);
      const res = await api.post('/exams/marks', {
        examId: activeExam._id,
        studentId: marksStudentId,
        classId: std?.classId?._id || std?.classId,
        subjectMarks: subjectScores,
        teacherRemarks,
      });

      if (res.data.success) {
        alert('Student marks saved successfully! Report card generated.');
        setIsMarksModalOpen(false);
        openReportCard(activeExam._id, marksStudentId);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save marks.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Examinations & Academic Grading
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            CBSE grading matrix, subject-wise marks entry, and printable student report cards
          </p>
        </div>
        {canEnterMarks && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMarksModalOpen(true)}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow"
            >
              <FileCheck className="w-4 h-4" />
              <span>Enter Marks</span>
            </button>
          </div>
        )}
      </div>

      {/* Exam Schedules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((ex) => (
          <div
            key={ex._id}
            className="bg-white dark:bg-[#0D1522] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 font-bold px-2 py-0.5 rounded">
                {ex.examType}
              </span>
              <span className="text-xs text-emerald-600 font-bold">{ex.status}</span>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{ex.name}</h3>
              <p className="text-xs text-slate-500 flex items-center space-x-1 mt-1">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>
                  {new Date(ex.startDate).toLocaleDateString('en-IN')} - {new Date(ex.endDate).toLocaleDateString('en-IN')}
                </span>
              </p>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Examination Papers:
              </span>
              <div className="space-y-1">
                {(ex.subjects || []).map((sub: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                    <span>{sub.subjectName}</span>
                    <span className="font-mono text-slate-400">Max: {sub.maxMarks}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex space-x-2">
              <button
                onClick={() => {
                  setActiveExam(ex);
                  if (students.length > 0) {
                    openReportCard(ex._id, students[0]._id);
                  }
                }}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 text-teal-800 dark:text-teal-300 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Sample Report Card</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Student List with Quick Report Card View */}
      <div className="bg-white dark:bg-[#0D1522] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Class 10-A Student Report Cards
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b">
              <tr>
                <th className="py-2.5 px-3">Roll</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Admission No</th>
                <th className="py-2.5 px-3">Active Examination</th>
                <th className="py-2.5 px-3 text-right">Official CBSE Card</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.slice(0, 6).map((std) => (
                <tr key={std._id}>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">{std.rollNumber || '—'}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{std.name}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{std.admissionNumber}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{activeExam?.name || 'Half Yearly Exam 2026'}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => {
                        if (activeExam) openReportCard(activeExam._id, std._id);
                      }}
                      className="px-3 py-1 bg-[#1E3E62] hover:bg-[#0B192C] text-white rounded-lg font-semibold inline-flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Card</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enter Marks Modal */}
      {canEnterMarks && isMarksModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-[#0D1522] rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 border-b flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Enter Examination Marks
              </h3>
              <button onClick={() => setIsMarksModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveMarks} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Student</label>
                <select
                  value={marksStudentId}
                  onChange={(e) => setMarksStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                >
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.admissionNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="block font-semibold">Subject Marks (Max 100)</label>
                {subjectScores.map((sub, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border">
                    <span className="font-semibold">{sub.subjectName}</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={sub.marksObtained}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSubjectScores((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, marksObtained: val } : item))
                        );
                      }}
                      className="w-20 px-2.5 py-1 text-center font-bold rounded-lg border dark:bg-slate-900"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-semibold mb-1">Class Teacher's Remark</label>
                <input
                  type="text"
                  value={teacherRemarks}
                  onChange={(e) => setTeacherRemarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                />
              </div>

              <div className="pt-4 border-t flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsMarksModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 text-white font-bold rounded-xl shadow"
                >
                  Save Marks & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Report Card Modal */}
      {selectedReportCard && (
        <ReportCardModal
          reportCard={selectedReportCard}
          onClose={() => setSelectedReportCard(null)}
        />
      )}
    </div>
  );
};
