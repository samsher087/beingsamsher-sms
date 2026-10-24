import React from 'react';
import { X, Printer, Award, CheckCircle } from 'lucide-react';

interface ReportCardModalProps {
  reportCard: any;
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({ reportCard, onClose }) => {
  if (!reportCard) return null;

  const handlePrint = () => {
    window.print();
  };

  const student = reportCard.studentId || {};
  const exam = reportCard.examId || {};
  const cls = reportCard.classId || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-[#0D1522] rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Controls */}
        <div className="no-print p-4 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
              Official CBSE Student Academic Report Card
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#0B192C] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report Card</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Card Document */}
        <div className="p-8 text-slate-900 bg-white printable-card font-sans">
          {/* School Emblem & Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
              {reportCard.school?.name || 'D.A.V Public School, Pindersot'}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Sector 12, R.K. Puram, New Delhi - 110022 • CBSE Affiliation No. 2730123
            </p>
            <div className="mt-2.5 inline-block bg-slate-900 text-white text-xs font-bold px-4 py-1 rounded tracking-wide uppercase">
              Academic Performance Profile — Session 2026-2027
            </div>
            <p className="text-xs font-semibold text-slate-700 mt-1">
              {exam.name || 'Half Yearly Assessment 2026'}
            </p>
          </div>

          {/* Student Credentials */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-xs border-b border-slate-200 bg-slate-50/50 p-3 my-3 rounded-lg border">
            <div>
              <p className="text-slate-500 font-medium">Student Name</p>
              <p className="font-bold text-slate-900 text-sm">{student.name || 'Aarav Sharma'}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Admission No.</p>
              <p className="font-bold text-slate-800">{student.admissionNumber || 'DPS-2026-0001'}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Class & Section</p>
              <p className="font-bold text-slate-800">{cls.className || 'Class 10'} - {cls.section || 'A'}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Roll Number</p>
              <p className="font-bold text-slate-800">{student.rollNumber || '101'}</p>
            </div>
          </div>

          {/* Scholastic Marks Table */}
          <div className="py-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Part 1: Scholastic Assessment
            </h3>
            <table className="w-full text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="py-2.5 px-3 text-left">Subject Name</th>
                  <th className="py-2.5 px-3 text-center">Subject Code</th>
                  <th className="py-2.5 px-3 text-center">Max Marks</th>
                  <th className="py-2.5 px-3 text-center">Marks Obtained</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-3 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(reportCard.subjectMarks || []).map((sm: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{sm.subjectName}</td>
                    <td className="py-2.5 px-3 text-center text-slate-500 font-mono">{sm.subjectCode}</td>
                    <td className="py-2.5 px-3 text-center">{sm.maxMarks}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-900">{sm.marksObtained}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-teal-800">{sm.grade}</td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px]">{sm.remarks || 'Consistent'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-400">
                <tr>
                  <td colSpan={2} className="py-3 px-3">GRAND TOTAL & PERCENTAGE</td>
                  <td className="py-3 px-3 text-center">{reportCard.totalMax || 300}</td>
                  <td className="py-3 px-3 text-center text-emerald-800 text-sm">
                    {reportCard.totalObtained || 277}
                  </td>
                  <td className="py-3 px-3 text-center text-sm font-black text-teal-700">
                    {reportCard.overallGrade || 'A1'}
                  </td>
                  <td className="py-3 px-3 text-slate-900">
                    {reportCard.percentage}% ({reportCard.resultStatus || 'PASS'})
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Grading Scale Reference */}
          <div className="mt-3 p-2 bg-slate-50 rounded text-[10px] text-slate-500 flex flex-wrap justify-between border">
            <span className="font-semibold text-slate-700">CBSE Grading Scale:</span>
            <span>A1 (91-100)</span>
            <span>A2 (81-90)</span>
            <span>B1 (71-80)</span>
            <span>B2 (61-70)</span>
            <span>C1 (51-60)</span>
            <span>C2 (41-50)</span>
            <span>D (33-40: Pass)</span>
            <span>E (Below 33: Needs Improvement)</span>
          </div>

          {/* Teacher remarks */}
          <div className="mt-4 p-3 border border-slate-200 rounded-lg bg-teal-50/40">
            <p className="text-xs font-bold text-slate-800">Class Teacher's Observation & Remarks:</p>
            <p className="text-xs text-slate-700 mt-1 italic">
              "{reportCard.teacherRemarks || 'Outstanding academic commitment and intellectual curiosity. Keep striving for global excellence!'}"
            </p>
          </div>

          {/* Signatures */}
          <div className="mt-8 pt-4 border-t border-slate-300 grid grid-cols-3 gap-4 text-center text-xs text-slate-600">
            <div>
              <div className="w-28 border-b border-slate-400 mx-auto mb-1"></div>
              <p className="font-semibold text-slate-800">Class Teacher</p>
            </div>
            <div>
              <div className="w-28 border-b border-slate-400 mx-auto mb-1"></div>
              <p className="font-semibold text-slate-800">Parent / Guardian</p>
            </div>
            <div>
              <div className="w-28 border-b border-slate-400 mx-auto mb-1"></div>
              <p className="font-semibold text-slate-800">Principal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
