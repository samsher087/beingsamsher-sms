import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { MonitorPlay, FlaskConical, Trophy, BookOpen, Music, Shield, Bus, HeartPulse } from 'lucide-react';

export const FacilitiesPage: React.FC = () => {
  const { schoolData } = useOutletContext<{ schoolData: any }>();
  const content = schoolData?.content;

  const facilitiesList = content?.facilities || [
    {
      title: 'Smart Digital Classrooms',
      icon: 'MonitorPlay',
      description: 'Ultra-HD interactive touch screens, audio-visual smart learning modules, and high-speed Wi-Fi throughout campus.',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Modern Science & AI Labs',
      icon: 'FlaskConical',
      description: 'Physics, Chemistry, Biology, and AI Robotics maker spaces equipped with state-of-the-art apparatus and safety protocols.',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Olympic-Standard Sports Arena',
      icon: 'Trophy',
      description: 'Swimming pool, synthetic basketball and tennis courts, cricket nets, and professional football turf.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="py-16 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <span className="text-xs font-bold text-teal-700 tracking-wider uppercase bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
          Campus Infrastructure
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900">
          World-Class Learning & Sports Facilities
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Spread over a lush green campus, our institution offers cutting-edge learning environments that inspire excellence in every domain.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {facilitiesList.map((fac: any, idx: number) => (
          <div
            key={idx}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="h-56 overflow-hidden">
              <img
                src={fac.image || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80'}
                alt={fac.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 space-y-3">
              <h3 className="font-bold text-slate-900 text-lg">{fac.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{fac.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
