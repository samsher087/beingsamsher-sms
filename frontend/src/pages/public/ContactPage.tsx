import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { schoolData } = useOutletContext<{ schoolData: any }>();
  const school = schoolData?.school;
  const content = schoolData?.content;

  return (
    <div className="py-16 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <span className="text-xs font-bold text-teal-700 tracking-wider uppercase bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
          Get In Touch
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900">Contact School Administration</h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          We welcome inquiries from prospective parents, visitors, and alumni. Reach out to our administrative team.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Info Column */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-6">
            <h3 className="text-base font-bold text-slate-900">Campus Information</h3>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Physical Address</p>
                  <p className="text-slate-600 mt-0.5">{school?.contact?.address || 'Sector 12, R.K. Puram, New Delhi - 110022'}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Telephone Lines</p>
                  <p className="text-slate-600 mt-0.5">{school?.contact?.phone || '+91 11 4911 5500'}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Official Admissions Email</p>
                  <p className="text-slate-600 mt-0.5">{school?.contact?.email || 'admissions@dps.edu.in'}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Visiting Hours</p>
                  <p className="text-slate-600 mt-0.5">Monday to Saturday: 8:30 AM - 3:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900">Send an Administrative Inquiry</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for contacting us. Your message has been routed to the administration desk.');
            }}
            className="space-y-4 text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikas Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="parent@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="+91 98100 00000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Inquiry Details</label>
              <textarea
                rows={4}
                required
                placeholder="How can we assist you?"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              className="bg-[#0B192C] hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl transition flex items-center space-x-1.5 shadow"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
