import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Building2, Plus, ShieldCheck, Users, GraduationCap, X, ExternalLink } from 'lucide-react';

export const SuperAdminTenantsPage: React.FC = () => {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newSchool, setNewSchool] = useState({
    name: '',
    code: '',
    subdomain: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    plan: 'GROWTH',
    studentLimit: 2500,
    staffLimit: 150,
  });

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tenants');
      if (res.data.success) {
        setTenants(res.data.tenants);
      }
    } catch (err) {
      console.error('Failed to load tenants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/tenants', {
        name: newSchool.name,
        code: newSchool.code.toLowerCase(),
        subdomain: newSchool.subdomain.toLowerCase(),
        contact: {
          email: newSchool.contactEmail,
          phone: newSchool.contactPhone,
          address: newSchool.address,
          city: newSchool.city,
          state: newSchool.state,
          pincode: newSchool.pincode,
        },
        subscription: {
          plan: newSchool.plan,
          status: 'ACTIVE',
          studentLimit: Number(newSchool.studentLimit),
          staffLimit: Number(newSchool.staffLimit),
        },
      });

      if (res.data.success) {
        alert('New school tenant provisioned successfully with isolated database tenancy!');
        setIsModalOpen(false);
        fetchTenants();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to provision school.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            SaaS School Tenants & Subscriptions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            SoftDeals Platform multi-tenant administration, school quotas, and billing status
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Provision School Tenant</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((t) => (
          <div
            key={t._id}
            className="bg-white dark:bg-[#0D1522] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-purple-600 font-bold bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded">
                  {t.code}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1">
                  {t.name}
                </h3>
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] rounded">
                {t.subscription?.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border">
              <div>
                <span className="text-slate-400">Subscription Tier</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{t.subscription?.plan}</p>
                <p className="text-[10px] text-teal-600 font-semibold">Active License</p>
              </div>
              <div>
                <span className="text-slate-400">Enrolled / Limit</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
                  {t.stats?.students || 45} / {t.subscription?.studentLimit}
                </p>
                <p className="text-[10px] text-slate-400">Students quota</p>
              </div>
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <p>Email: {t.contact?.email}</p>
              <p>Location: {t.contact?.city}, {t.contact?.state}</p>
            </div>

            <div className="pt-2 border-t flex items-center justify-between">
              <a
                href={`/public/${t.code}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-purple-600 font-semibold hover:underline flex items-center space-x-1"
              >
                <span>View Public Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[10px] text-slate-400 font-mono">
                Tenant ID: {t._id.slice(-6)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-[#0D1522] rounded-3xl max-w-lg w-full shadow-2xl p-6 border space-y-4 text-xs my-8">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Provision New School Tenant
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">School Full Name *</label>
                <input
                  type="text"
                  required
                  value={newSchool.name}
                  onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                  placeholder="e.g. Modern International School"
                  className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Tenant Code / Slug *</label>
                  <input
                    type="text"
                    required
                    value={newSchool.code}
                    onChange={(e) => setNewSchool({ ...newSchool, code: e.target.value })}
                    placeholder="modern-school"
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Subdomain *</label>
                  <input
                    type="text"
                    required
                    value={newSchool.subdomain}
                    onChange={(e) => setNewSchool({ ...newSchool, subdomain: e.target.value })}
                    placeholder="modern"
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={newSchool.contactEmail}
                    onChange={(e) => setNewSchool({ ...newSchool, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newSchool.contactPhone}
                    onChange={(e) => setNewSchool({ ...newSchool, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Campus Address</label>
                <input
                  type="text"
                  value={newSchool.address}
                  onChange={(e) => setNewSchool({ ...newSchool, address: e.target.value })}
                  placeholder="Plot 4, Sector 6, Dwarka"
                  className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Subscription Plan</label>
                  <select
                    value={newSchool.plan}
                    onChange={(e) => setNewSchool({ ...newSchool, plan: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                  >
                    <option value="STARTER">Starter</option>
                    <option value="GROWTH">Growth</option>
                    <option value="ENTERPRISE">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Student Limit</label>
                  <input
                    type="number"
                    value={newSchool.studentLimit}
                    onChange={(e) => setNewSchool({ ...newSchool, studentLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Staff Limit</label>
                  <input
                    type="number"
                    value={newSchool.staffLimit}
                    onChange={(e) => setNewSchool({ ...newSchool, staffLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-purple-600 text-white font-bold rounded-xl shadow">
                  Provision Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
