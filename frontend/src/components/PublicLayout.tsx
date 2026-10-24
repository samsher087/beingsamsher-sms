import React, { useEffect, useState } from 'react';
import { Outlet, Link, useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  School,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  BookOpen,
  Calendar,
  Award,
} from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const { tenantCode } = useParams<{ tenantCode?: string }>();
  const navigate = useNavigate();
  const [schoolData, setSchoolData] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const code = tenantCode || 'dps-rkp';

  useEffect(() => {
    const fetchWebsiteData = async () => {
      try {
        const res = await api.get(`/website/public/${code}`);
        if (res.data.success) {
          setSchoolData(res.data);
        }
      } catch (err) {
        console.error('Failed to load public website data:', err);
      }
    };
    fetchWebsiteData();
  }, [code]);

  const school = schoolData?.school;
  const content = schoolData?.content;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans selection:bg-teal-600 selection:text-white">
      {/* Top Notification / Contact Bar */}
      <div className="bg-[#0B192C] text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span>{school?.contact?.phone || '+91 11 4911 5500'}</span>
            </span>
            <span className="hidden sm:flex items-center space-x-1">
              <Mail className="w-3.5 h-3.5 text-teal-400" />
              <span>{school?.contact?.email || 'admissions@dps.edu.in'}</span>
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            {/* School Switcher for Demo */}
            <span className="text-slate-400">Switch Demo School:</span>
            <button
              onClick={() => navigate('/public/dps-rkp')}
              className={`px-2 py-0.5 rounded transition ${
                code === 'dps-rkp' ? 'bg-teal-600 text-white font-semibold' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              D.A.V Public School
            </button>
            <button
              onClick={() => navigate('/public/st-xavier')}
              className={`px-2 py-0.5 rounded transition ${
                code === 'st-xavier' ? 'bg-teal-600 text-white font-semibold' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              St. Xavier's
            </button>

            <Link
              to="/login"
              className="ml-2 font-semibold text-teal-400 hover:text-teal-300 flex items-center space-x-1 bg-slate-800 px-2.5 py-0.5 rounded border border-teal-500/30"
            >
              <span>Portal Login</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Public Navigation Bar */}
      <header className="sticky top-[37px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo & School Name */}
          <Link to={`/public/${code}`} className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0B192C] to-[#008170] flex items-center justify-center text-white shadow-lg">
              <School className="w-7 h-7 text-teal-300" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
                {school?.name || 'D.A.V Public School, Pindersot'}
              </h1>
              <p className="text-xs text-teal-700 font-medium mt-1">
                {school?.tagline || 'Excellence in Holistic Education & Leadership'}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-semibold text-slate-600">
            <Link to={`/public/${code}`} className="hover:text-teal-700 transition">
              Home
            </Link>
            <Link to={`/public/${code}/about`} className="hover:text-teal-700 transition">
              About Us
            </Link>
            <Link to={`/public/${code}/academics`} className="hover:text-teal-700 transition">
              Academics
            </Link>
            <Link to={`/public/${code}/facilities`} className="hover:text-teal-700 transition">
              Facilities
            </Link>
            <Link to={`/public/${code}/notices`} className="hover:text-teal-700 transition">
              Notices
            </Link>
            <Link to={`/public/${code}/contact`} className="hover:text-teal-700 transition">
              Contact
            </Link>
            <Link
              to={`/public/${code}/admissions`}
              className="bg-gradient-to-r from-[#0B192C] to-[#1E3E62] hover:to-[#008170] text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-xs flex items-center space-x-1.5"
            >
              <span>Apply Online 2026</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 text-sm font-medium">
            <Link
              to={`/public/${code}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-teal-600"
            >
              Home
            </Link>
            <Link
              to={`/public/${code}/about`}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-teal-600"
            >
              About Us
            </Link>
            <Link
              to={`/public/${code}/academics`}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-teal-600"
            >
              Academics
            </Link>
            <Link
              to={`/public/${code}/facilities`}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-teal-600"
            >
              Facilities
            </Link>
            <Link
              to={`/public/${code}/notices`}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-teal-600"
            >
              Notices
            </Link>
            <Link
              to={`/public/${code}/contact`}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-teal-600"
            >
              Contact
            </Link>
            <Link
              to={`/public/${code}/admissions`}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center py-2.5 bg-[#0B192C] text-white rounded-lg font-bold"
            >
              Apply Online
            </Link>
          </div>
        )}
      </header>

      {/* Main Public Website Content */}
      <main className="flex-1">
        <Outlet context={{ schoolData, code }} />
      </main>

      {/* Public Footer */}
      <footer className="bg-[#0B192C] text-slate-300 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                <School className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-base">
                {school?.name || 'D.A.V Public School, Pindersot'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {content?.about?.description ||
                'Nurturing young minds to be intellectually capable, culturally grounded, and ethically responsible global citizens.'}
            </p>
            <div className="pt-2 text-xs text-teal-400 font-medium">
              Affiliated to CBSE, New Delhi
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to={`/public/${code}/about`} className="hover:text-white transition">
                  About Our Institution
                </Link>
              </li>
              <li>
                <Link to={`/public/${code}/academics`} className="hover:text-white transition">
                  Curriculum & NEP 2020
                </Link>
              </li>
              <li>
                <Link to={`/public/${code}/facilities`} className="hover:text-white transition">
                  Infrastructure & Labs
                </Link>
              </li>
              <li>
                <Link to={`/public/${code}/admissions`} className="hover:text-white transition">
                  Online Admission Enquiry
                </Link>
              </li>
              <li>
                <Link to={`/public/${code}/notices`} className="hover:text-white transition">
                  Latest School Circulars
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              School Campus
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <p className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>{school?.contact?.address || 'Sector 12, R.K. Puram, New Delhi - 110022'}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{school?.contact?.phone || '+91 11 4911 5500'}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{school?.contact?.email || 'admissions@dps.edu.in'}</span>
              </p>
            </div>
          </div>

          {/* Col 4 - SoftDeals SaaS Brand */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-[10px] font-bold text-teal-400 tracking-wider uppercase">
              Powered by SoftDeals
            </span>
            <h5 className="text-white font-bold text-sm">
              SoftDeals — Digital Solutions
            </h5>
            <p className="text-xs text-slate-400">
              Enterprise School Management System designed for top educational institutions across India.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-block text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded-lg shadow transition"
              >
                Access SMS Portal →
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 mt-10 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 {school?.name || 'SoftDeals School'}. All rights reserved.</p>
          <p>
            School Management Software by{' '}
            <span className="text-slate-300 font-semibold">SoftDeals — Digital Solutions</span>
          </p>
        </div>
      </footer>
    </div>
  );
};
