import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Bus, MapPin, Phone, Users, Clock, Plus, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const TransportPage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const canManageRoutes = !!user?.role && ['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(user.role);

  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newRoute, setNewRoute] = useState({
    routeName: 'Route 15 — Pindersot to School',
    vehicleNumber: 'JH-11-4921',
    vehicleModel: 'Tata Starbus 36 Seater',
    driverName: 'Harpreet Singh',
    driverPhone: '+91 98110 44332',
    capacity: 36,
  });

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/transport/routes');
      if (res.data.success) {
        setRoutes(res.data.routes);
      }
    } catch (err) {
      console.error('Failed to load routes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/transport/routes', newRoute);
      if (res.data.success) {
        toast.success('Transport route created successfully.');
        setIsModalOpen(false);
        fetchRoutes();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create route.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            School Transport & Bus Fleet
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Vehicle registration, driver contact details, route stops, and student bus allocation
          </p>
        </div>
        {canManageRoutes && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Bus Route</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routes.map((r) => (
          <div
            key={r._id}
            className="bg-white dark:bg-[#0D1522] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
                  Active Bus Route
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{r.routeName}</h3>
              </div>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 font-mono text-xs font-bold rounded-lg">
                {r.vehicleNumber}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border">
              <div>
                <p className="text-slate-500">Driver in Charge</p>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{r.driverName}</p>
                <p className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                  <Phone className="w-3 h-3 text-teal-600" />
                  <span>{r.driverPhone}</span>
                </p>
              </div>
              <div>
                <p className="text-slate-500">Vehicle Specification</p>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{r.vehicleModel}</p>
                <p className="text-[11px] text-slate-400">Capacity: {r.capacity} seats</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Scheduled Stops & Pickup Timings:
              </span>
              <div className="space-y-1.5 text-xs">
                {(r.stops || []).map((stop: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 dark:bg-slate-800/20"
                  >
                    <span className="flex items-center space-x-2 font-medium text-slate-800 dark:text-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{stop.stopName}</span>
                    </span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      {stop.pickupTime} • Drop: {stop.dropTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {canManageRoutes && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0D1522] rounded-3xl max-w-md w-full shadow-2xl p-6 border space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Add Bus Transport Route</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateRoute} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Route Name *</label>
                <input
                  type="text"
                  required
                  value={newRoute.routeName}
                  onChange={(e) => setNewRoute({ ...newRoute, routeName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Vehicle Plate No. *</label>
                  <input
                    type="text"
                    required
                    value={newRoute.vehicleNumber}
                    onChange={(e) => setNewRoute({ ...newRoute, vehicleNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Bus Model</label>
                  <input
                    type="text"
                    value={newRoute.vehicleModel}
                    onChange={(e) => setNewRoute({ ...newRoute, vehicleModel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Driver Name *</label>
                  <input
                    type="text"
                    required
                    value={newRoute.driverName}
                    onChange={(e) => setNewRoute({ ...newRoute, driverName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Driver Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newRoute.driverPhone}
                    onChange={(e) => setNewRoute({ ...newRoute, driverPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-teal-600 text-white font-bold rounded-xl shadow">
                  Save Bus Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
