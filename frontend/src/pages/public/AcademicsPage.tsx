import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { BookOpen, GraduationCap, CheckCircle, ArrowRight, Brain, Cpu, Atom } from 'lucide-react';

export const AcademicsPage: React.FC = () => {
  const { schoolData, code } = useOutletContext<{ schoolData: any; code: string }>();
  const content = schoolData?.content;

  return (
    <div className="py-16 space-y-16">
      {/* Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <span className="text-xs font-bold text-teal-700 tracking-wider uppercase bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
          Academic Framework
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900">
          Curriculum & Pedagogical Excellence
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {content?.academics?.intro ||
            'Affiliated to CBSE, New Delhi, our academic framework strictly aligns with NEP 2020 principles, nurturing scientific inquiry, linguistic richness, and analytical reasoning.'}
        </p>
      </div>

      {/* Levels Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {(content?.academics?.levels || [
          {
            title: 'Foundational & Primary Wing',
            ageGroup: 'Nursery to Grade 5 (Ages 3 - 10)',
            description: 'Play-way methodology, phonetics, multilingual storytelling, and concrete-to-abstract cognitive discovery.',
            highlights: ['Activity-based learning modules', 'Smart AV classrooms', 'Weekly sensory motor skill labs'],
          },
          {
            title: 'Middle School Wing',
            ageGroup: 'Grade 6 to Grade 8 (Ages 11 - 13)',
            description: 'Experiential science, computational coding, foreign languages, and environmental stewardship projects.',
            highlights: ['Robotics maker space', 'Model United Nations (MUN)', 'Olympiad mentoring'],
          },
          {
            title: 'Senior Secondary Wing',
            ageGroup: 'Grade 9 to Grade 12 (Ages 14 - 18)',
            description: 'Intensive specialization across Science (PCM/PCB), Commerce, and Humanities with career guidance.',
            highlights: ['Integrated JEE / NEET / CUET coaching', 'State-of-the-art biotech lab', 'Research paper writing'],
          },
        ]).map((lvl: any, idx: number) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all space-y-5"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-teal-600 uppercase tracking-wide">
                {lvl.ageGroup}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{lvl.title}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{lvl.description}</p>
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <p className="text-xs font-semibold text-slate-800">Key Highlights:</p>
              {(lvl.highlights || []).map((h: string, i: number) => (
                <div key={i} className="flex items-center space-x-2 text-xs text-slate-600">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="p-8 bg-slate-900 text-white rounded-3xl space-y-4">
          <h3 className="text-2xl font-bold">Interested in Enrolling Your Child?</h3>
          <p className="text-xs text-slate-300 max-w-lg mx-auto">
            Take the first step towards academic brilliance. Complete our online admission enquiry today.
          </p>
          <div>
            <Link
              to={`/public/${code}/admissions`}
              className="inline-flex items-center space-x-2 bg-teal-500 hover:bg-teal-400 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow"
            >
              <span>Apply Online</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
