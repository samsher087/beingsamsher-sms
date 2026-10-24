import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Quote,
  Star,
  Building,
  GraduationCap,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { schoolData, code } = useOutletContext<{ schoolData: any; code: string }>();

  const school = schoolData?.school;
  const content = schoolData?.content;
  const notices = schoolData?.publicNotices || [];

  return (
    <div className="space-y-24">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B192C] via-[#10223D] to-[#1E3E62] text-white py-20 lg:py-32">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#008170_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-teal-500/20 border border-teal-400/30 text-teal-300 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>{content?.hero?.badge || 'Admissions Open for Session 2026-27'}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              {content?.hero?.title || 'Nurturing Young Minds for Global Excellence'}
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              {content?.hero?.subtitle ||
                'A premier Indian institution empowering students with CBSE academic distinction, AI coding labs, ethical character, and Olympic-grade sports infrastructure.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                to={`/public/${code}/admissions`}
                className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-teal-900/40 hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-sm flex items-center space-x-2"
              >
                <span>{content?.hero?.ctaPrimaryText || 'Apply for Admission'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to={`/public/${code}/facilities`}
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold px-6 py-3.5 rounded-xl backdrop-blur-sm transition text-sm"
              >
                {content?.hero?.ctaSecondaryText || 'Explore Campus'}
              </Link>
            </div>

            {/* Quick stats badges */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-700/60">
              {(content?.about?.stats || [
                { label: 'Students', value: '4,500+' },
                { label: 'Faculty', value: '220+' },
                { label: 'Board Results', value: '100%' },
                { label: 'National Awards', value: '50+' },
              ]).map((st: any, i: number) => (
                <div key={i} className="text-left">
                  <p className="text-xl sm:text-2xl font-black text-teal-400">{st.value}</p>
                  <p className="text-xs text-slate-300 font-medium">{st.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-[4/3] group">
              <img
                src={
                  content?.hero?.heroImage ||
                  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80'
                }
                alt="School Campus"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-300 bg-teal-900/60 px-2 py-0.5 rounded">
                    Ranked #1 Day-Cum-Boarding School
                  </span>
                  <p className="text-white font-bold text-sm mt-1">
                    CBSE Curriculum • NEP 2020 Experiential Learning
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Latest Notices Banner */}
      {notices.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-14 relative z-20">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-3 flex items-center space-x-2 text-rose-600 font-bold text-sm border-b lg:border-b-0 lg:border-r border-slate-200 pb-2 lg:pb-0">
              <Calendar className="w-5 h-5 text-rose-500 shrink-0" />
              <span>Official Circulars & Announcements</span>
            </div>
            <div className="lg:col-span-7 overflow-hidden">
              <div className="flex items-center space-x-3 text-xs">
                <span className="bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded shrink-0">
                  LATEST
                </span>
                <p className="font-semibold text-slate-800 truncate">
                  {notices[0]?.title}
                </p>
              </div>
            </div>
            <div className="lg:col-span-2 text-right">
              <Link
                to={`/public/${code}/notices`}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center justify-end space-x-1"
              >
                <span>View All Notices</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 3. About School & NEP 2020 Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-teal-700 tracking-wider uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              About Our Legacy
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {content?.about?.heading || 'Over 5 Decades of Educational Distinction'}
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {content?.about?.description ||
                'Providing inclusive, values-driven and rigorous education for future leaders, innovators, and thinkers. Our institution stands at the forefront of modern Indian education.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <ShieldCheck className="w-6 h-6 text-teal-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Our Vision</h4>
                <p className="text-xs text-slate-600 mt-1">
                  {content?.about?.vision || 'Empowering learners with ethical reasoning and global mindset.'}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <BookOpen className="w-6 h-6 text-teal-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Our Mission</h4>
                <p className="text-xs text-slate-600 mt-1">
                  {content?.about?.mission || 'Blending Indian cultural heritage with 21st-century technological fluency.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80"
              alt="Classroom"
              className="rounded-2xl object-cover h-64 w-full shadow-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80"
              alt="Science Lab"
              className="rounded-2xl object-cover h-64 w-full shadow-lg mt-8"
            />
          </div>
        </div>
      </section>

      {/* 4. Principal's Message */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 text-center">
              <div className="w-36 h-36 rounded-2xl mx-auto overflow-hidden shadow-lg border-2 border-teal-500/40">
                <img
                  src={
                    content?.principalMessage?.principalImage ||
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
                  }
                  alt="Principal"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mt-4">
                {content?.principalMessage?.principalName || 'Dr. Sunita Sharma, Ph.D.'}
              </h3>
              <p className="text-xs text-teal-700 font-semibold">
                {content?.principalMessage?.principalTitle || 'Principal & Director'}
              </p>
            </div>

            <div className="md:col-span-8 space-y-4">
              <Quote className="w-10 h-10 text-teal-600/30" />
              <blockquote className="text-base sm:text-lg font-semibold text-slate-800 italic leading-snug">
                "{content?.principalMessage?.quote ||
                  'Education is not the learning of facts, but the training of the mind to think, empathize, and innovate.'}"
              </blockquote>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {content?.principalMessage?.fullMessage ||
                  'At our school, we believe every child possesses immense creative and intellectual capabilities. Our faculty is devoted to providing an inspiring atmosphere where values and scholarship walk hand in hand.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. World-Class Campus Facilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-teal-700 tracking-wider uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Campus Facilities & Infrastructure
          </h2>
          <p className="text-sm text-slate-600">
            Designed to foster intellectual curiosity, physical fitness, and technological mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(content?.facilities || []).map((fac: any, idx: number) => (
            <div
              key={idx}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={fac.image || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80'}
                  alt={fac.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-bold text-slate-900 text-base">{fac.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{fac.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="bg-[#0B192C] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-teal-400 tracking-wider uppercase bg-teal-950 px-3 py-1 rounded-full border border-teal-800">
              Community Voices
            </span>
            <h2 className="text-3xl font-extrabold text-white">What Parents & Students Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(content?.testimonials || []).map((t: any, idx: number) => (
              <div
                key={idx}
                className="bg-slate-900/90 rounded-2xl p-7 border border-slate-800 space-y-4"
              >
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  "{t.content}"
                </p>
                <div className="flex items-center space-x-3 pt-2">
                  <img
                    src={t.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-teal-500/40"
                  />
                  <div>
                    <h5 className="font-bold text-sm text-white">{t.name}</h5>
                    <p className="text-xs text-teal-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Admission CTA Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-[#008170] rounded-3xl p-8 sm:p-12 text-white shadow-2xl text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-300 bg-white/10 px-3.5 py-1 rounded-full">
            Session 2026-27 Enrollment
          </span>
          <h2 className="text-3xl sm:text-4xl font-black max-w-xl mx-auto leading-tight">
            Begin Your Child's Journey of Excellence Today
          </h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Online admission applications are now open for Pre-School through Grade 11. Complete the enquiry form in 2 minutes.
          </p>
          <div className="pt-2">
            <Link
              to={`/public/${code}/admissions`}
              className="inline-flex items-center space-x-2 bg-white text-slate-900 font-extrabold px-8 py-3.5 rounded-xl shadow-lg hover:bg-teal-50 transition text-sm"
            >
              <span>Submit Admission Enquiry</span>
              <ArrowRight className="w-4 h-4 text-teal-700" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
