import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bell, Calendar, Pin, FileText } from 'lucide-react';

export const NoticesPage: React.FC = () => {
  const { schoolData } = useOutletContext<{ schoolData: any }>();
  const notices = schoolData?.publicNotices || [];

  return (
    <div className="py-16 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <span className="text-xs font-bold text-teal-700 tracking-wider uppercase bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
          Official Notice Board
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900">
          News, Circulars & Announcements
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Stay updated with the latest official announcements, examination schedules, and events.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
        {notices.map((n: any, idx: number) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-3"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center space-x-1.5 text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>
                  {new Date(n.publishDate || Date.now()).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </span>
              {n.isPinned && (
                <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] flex items-center space-x-1">
                  <Pin className="w-3 h-3" />
                  <span>PINNED</span>
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">{n.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
