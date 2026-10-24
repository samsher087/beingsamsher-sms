import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../services/api';
import { CheckCircle2, Send, FileText, Calendar, Phone, Mail, Sparkles, AlertCircle } from 'lucide-react';

export const AdmissionsPage: React.FC = () => {
  const { schoolData, code } = useOutletContext<{ schoolData: any; code: string }>();

  const [formData, setFormData] = useState({
    applicantName: '',
    gender: 'Male',
    dob: '',
    classAppliedFor: 'Class 6',
    parentName: '',
    relationship: 'Father',
    email: '',
    phone: '',
    address: '',
    previousSchool: '',
  });

  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/admissions/public-enquiry', formData);
      if (res.data.success) {
        setSuccessResponse(res.data);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit admission enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold text-teal-700 tracking-wider uppercase bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
            Session 2026-2027 Admissions
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Online Student Admission Registration
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Please fill the admission enquiry form below. Our admissions council will review the application and schedule an interaction.
          </p>
        </div>

        {/* Success Alert */}
        {successResponse ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-teal-200 text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Admission Registration Successfully Received!
            </h2>
            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 max-w-md mx-auto">
              <p className="text-xs text-teal-800 font-medium">Official Application Number:</p>
              <p className="text-2xl font-black text-teal-900 tracking-wider mt-1">
                {successResponse.applicationNumber}
              </p>
            </div>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              A confirmation email has been dispatched to{' '}
              <span className="font-semibold text-slate-900">{formData.email}</span>. You can track this status
              or visit our school admissions desk with this application reference.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setSuccessResponse(null);
                  setFormData({
                    applicantName: '',
                    gender: 'Male',
                    dob: '',
                    classAppliedFor: 'Class 6',
                    parentName: '',
                    relationship: 'Father',
                    email: '',
                    phone: '',
                    address: '',
                    previousSchool: '',
                  });
                }}
                className="bg-[#0B192C] text-white px-6 py-2.5 rounded-xl font-semibold text-xs hover:bg-slate-800 transition"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200/80">
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 text-xs rounded-xl flex items-center space-x-2 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Candidate Details */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200 mb-4 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  <span>1. Student (Applicant) Information</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Applicant Full Name *</label>
                    <input
                      type="text"
                      name="applicantName"
                      required
                      value={formData.applicantName}
                      onChange={handleChange}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Class Applied For *</label>
                    <select
                      name="classAppliedFor"
                      value={formData.classAppliedFor}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 bg-white"
                    >
                      <option value="Pre-School / Nursery">Pre-School / Nursery</option>
                      <option value="Kindergarten / KG">Kindergarten / KG</option>
                      <option value="Class 1">Class 1</option>
                      <option value="Class 2">Class 2</option>
                      <option value="Class 3">Class 3</option>
                      <option value="Class 4">Class 4</option>
                      <option value="Class 5">Class 5</option>
                      <option value="Class 6">Class 6</option>
                      <option value="Class 7">Class 7</option>
                      <option value="Class 8">Class 8</option>
                      <option value="Class 9">Class 9</option>
                      <option value="Class 10">Class 10</option>
                      <option value="Class 11 Science (PCM/PCB)">Class 11 Science (PCM/PCB)</option>
                      <option value="Class 11 Commerce">Class 11 Commerce</option>
                      <option value="Class 11 Humanities">Class 11 Humanities</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      name="dob"
                      required
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Parent / Guardian Info */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200 mb-4 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  <span>2. Parent / Guardian Contact Details</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Parent / Guardian Name *</label>
                    <input
                      type="text"
                      name="parentName"
                      required
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="e.g. Vikas Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Relationship with Child *</label>
                    <select
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 bg-white"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Guardian</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. parent@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone / Mobile Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98100 00000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Academic Background & Address */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200 mb-4 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  <span>3. Address & Academic Background</span>
                </h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Residential Address *</label>
                    <textarea
                      name="address"
                      rows={2}
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House No, Street, Colony, City & Pincode"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Previous School Attended (If applicable)</label>
                    <input
                      type="text"
                      name="previousSchool"
                      value={formData.previousSchool}
                      onChange={handleChange}
                      placeholder="Name of school and city"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-500 hover:to-emerald-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition flex items-center space-x-2 text-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting Application...' : 'Submit Admission Enquiry'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
