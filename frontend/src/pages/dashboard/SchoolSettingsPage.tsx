import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Sliders, Save, School, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const SchoolSettingsPage: React.FC = () => {
  const { tenant, activeTenantCode } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState<any>({
    name: '',
    tagline: '',
    contact: { email: '', phone: '', address: '', city: 'Delhi', state: 'Delhi', pincode: '110022' },
    settings: { currencySymbol: '₹', receiptPrefix: 'DPS-REC', admissionPrefix: 'DPS-ADM' },
    themeConfig: { primaryColor: '#0B192C', schoolMotto: 'Service Before Self' },
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        tagline: tenant.tagline,
        contact: tenant.contact || {},
        settings: tenant.settings || { currencySymbol: '₹', receiptPrefix: 'DPS-REC', admissionPrefix: 'DPS-ADM' },
        themeConfig: tenant.themeConfig || {},
      });
    }
  }, [tenant]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant?._id) return;
    try {
      setSaving(true);
      const res = await api.put(`/tenants/${tenant._id}`, formData);
      if (res.data.success) {
        toast.success('School profile and configurations updated successfully!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            School Profile & System Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure school branding, numbering prefixes, currency symbols, and academic contacts
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* School Identity */}
        <div className="bg-white dark:bg-[#0D1522] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b pb-2">
            School Identity & Branding
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Official School Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">School Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">School Motto</label>
              <input
                type="text"
                value={formData.themeConfig?.schoolMotto || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    themeConfig: { ...formData.themeConfig, schoolMotto: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Currency Symbol</label>
              <input
                type="text"
                value={formData.settings?.currencySymbol || '₹'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    settings: { ...formData.settings, currencySymbol: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border dark:bg-slate-900 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Numbering Prefixes */}
        <div className="bg-white dark:bg-[#0D1522] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b pb-2">
            Auto-Numbering Prefixes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Fee Receipt Prefix</label>
              <input
                type="text"
                value={formData.settings?.receiptPrefix || 'DPS-REC'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    settings: { ...formData.settings, receiptPrefix: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border dark:bg-slate-900 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">Example: DPS-REC-2026-00001</p>
            </div>
            <div>
              <label className="block font-semibold mb-1">Admission Number Prefix</label>
              <input
                type="text"
                value={formData.settings?.admissionPrefix || 'DPS-ADM'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    settings: { ...formData.settings, admissionPrefix: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border dark:bg-slate-900 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">Example: DPS-ADM-2026-0001</p>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-white dark:bg-[#0D1522] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b pb-2">
            Contact & Location Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Official Email</label>
              <input
                type="email"
                value={formData.contact?.email || ''}
                onChange={(e) =>
                  setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })
                }
                className="w-full px-3.5 py-2 rounded-xl border dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.contact?.phone || ''}
                onChange={(e) =>
                  setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })
                }
                className="w-full px-3.5 py-2 rounded-xl border dark:bg-slate-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1">Address</label>
              <input
                type="text"
                value={formData.contact?.address || ''}
                onChange={(e) =>
                  setFormData({ ...formData, contact: { ...formData.contact, address: e.target.value } })
                }
                className="w-full px-3.5 py-2 rounded-xl border dark:bg-slate-900"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
