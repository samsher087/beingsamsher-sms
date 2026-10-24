import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { School, Save, Eye, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const WebsiteCMSPage: React.FC = () => {
  const { activeTenantCode } = useAuth();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/website/public/${activeTenantCode}`);
        if (res.data.success) {
          setContent(res.data.content);
        }
      } catch (err) {
        console.error('Failed to load CMS content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCMS();
  }, [activeTenantCode]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put('/website/cms', content);
      if (res.data.success) {
        alert('Public school website updated successfully!');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update website content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading website CMS customizer...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Public Website CMS Customizer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Customize hero banners, principal's message, about section, and contact details without code
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <a
            href={`/public/${activeTenantCode}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Live Website</span>
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : 'Publish Changes'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hero Section Card */}
        <div className="bg-white dark:bg-[#0D1522] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b pb-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Homepage Hero Banner Configuration</span>
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block font-semibold mb-1">Badge Text</label>
              <input
                type="text"
                value={content?.hero?.badge || ''}
                onChange={(e) =>
                  setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })
                }
                className="w-full px-3.5 py-2 rounded-xl border dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Hero Main Title Headline</label>
              <input
                type="text"
                value={content?.hero?.title || ''}
                onChange={(e) =>
                  setContent({ ...content, hero: { ...content.hero, title: e.target.value } })
                }
                className="w-full px-3.5 py-2 rounded-xl border dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Hero Subtitle & Description</label>
              <textarea
                rows={2}
                value={content?.hero?.subtitle || ''}
                onChange={(e) =>
                  setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })
                }
                className="w-full px-3.5 py-2 rounded-xl border dark:bg-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Principal's Message Card */}
        <div className="bg-white dark:bg-[#0D1522] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b pb-2">
            Principal's Desk & Message
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Principal Name & Qualifications</label>
              <input
                type="text"
                value={content?.principalMessage?.principalName || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    principalMessage: { ...content.principalMessage, principalName: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Official Designation Title</label>
              <input
                type="text"
                value={content?.principalMessage?.principalTitle || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    principalMessage: { ...content.principalMessage, principalTitle: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border dark:bg-slate-900"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Inspirational Quote</label>
            <input
              type="text"
              value={content?.principalMessage?.quote || ''}
              onChange={(e) =>
                setContent({
                  ...content,
                  principalMessage: { ...content.principalMessage, quote: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded-xl border dark:bg-slate-900"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Full Principal Message</label>
            <textarea
              rows={4}
              value={content?.principalMessage?.fullMessage || ''}
              onChange={(e) =>
                setContent({
                  ...content,
                  principalMessage: { ...content.principalMessage, fullMessage: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded-xl border dark:bg-slate-900"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
