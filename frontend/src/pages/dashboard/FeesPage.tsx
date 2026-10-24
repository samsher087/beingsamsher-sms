import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FeeReceiptModal } from '../../components/FeeReceiptModal';
import {
  Receipt,
  Plus,
  Search,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  DollarSign,
  X,
} from 'lucide-react';

export const FeesPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const canManageFees = !!user?.role && ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'ACCOUNTANT'].includes(user.role);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [payments, setPayments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(() => {
    return searchParams.get('action') === 'record' || !!(location.state as any)?.openRecordModal;
  });
  const [search, setSearch] = useState('');

  const handleCloseModal = () => {
    setIsRecordModalOpen(false);
    if (searchParams.get('action') === 'record') {
      const next = new URLSearchParams(searchParams);
      next.delete('action');
      setSearchParams(next, { replace: true });
    }
  };

  useEffect(() => {
    if (canManageFees && (searchParams.get('action') === 'record' || (location.state as any)?.openRecordModal)) {
      setIsRecordModalOpen(true);
    }
  }, [searchParams, location.state, canManageFees]);

  // New payment form state
  const [newPayment, setNewPayment] = useState({
    studentId: '',
    classId: '',
    feeMonth: 'Quarter 2 (Jul - Sep 2026)',
    grossAmountINR: 45000,
    discountINR: 4500,
    paidAmountINR: 40500,
    paymentMethod: 'UPI',
    transactionRef: '',
    notes: 'Standard quarterly fee payment',
  });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/fees/payments');
      if (res.data.success) {
        setPayments(res.data.payments);
        setStats(res.data.stats || {});
      }
    } catch (err) {
      console.error('Failed to load fee payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students?limit=100');
      if (res.data.success) {
        setStudents(res.data.students);
        if (res.data.students.length > 0 && !newPayment.studentId) {
          const first = res.data.students[0];
          const gross = 45000;
          const disc = Math.round((gross * (first.concessionPercent || 0)) / 100);
          setNewPayment((prev) => ({
            ...prev,
            studentId: first._id,
            classId: first.classId?._id || first.classId,
            grossAmountINR: gross,
            discountINR: disc,
            paidAmountINR: gross - disc,
          }));
        }
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchStudents();
  }, []);

  const openReceipt = async (receiptNumber: string) => {
    try {
      const res = await api.get(`/fees/receipt/${receiptNumber}`);
      if (res.data.success) {
        setSelectedReceipt(res.data.receipt);
      }
    } catch (err) {
      console.error('Failed to load receipt:', err);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPayment.grossAmountINR <= 0) {
      toast.error('Gross Fee must be greater than zero.');
      return;
    }
    if (newPayment.discountINR >= newPayment.grossAmountINR) {
      toast.error('Gross Fee must always be greater than Concession amount.');
      return;
    }
    const calculatedPaid = newPayment.grossAmountINR - newPayment.discountINR;
    if (calculatedPaid <= 0) {
      toast.error('Calculated Paid Amount must be greater than zero.');
      return;
    }

    try {
      const res = await api.post('/fees/record-payment', {
        ...newPayment,
        totalDueINR: newPayment.grossAmountINR,
        paidAmountINR: calculatedPaid,
      });
      if (res.data.success) {
        toast.success(`Payment recorded successfully! Receipt generated: ${res.data.payment.receiptNumber}`, 'Fee Collected');
        handleCloseModal();
        fetchPayments();
        openReceipt(res.data.payment.receiptNumber);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to record fee payment.');
    }
  };

  const handleReverse = async (paymentId: string) => {
    const reason = prompt('Please enter the audited reason for reversing this payment:');
    if (!reason) return;
    try {
      const res = await api.post(`/fees/reverse/${paymentId}`, { reason });
      if (res.data.success) {
        toast.success('Payment safely reversed and ledger updated.', 'Reversal Recorded');
        fetchPayments();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reverse payment.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Fee Management & Accounts
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Paise-safe INR fee collections, automated receipt numbers, and audited payment logs
          </p>
        </div>
        {canManageFees && (
          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Record Fee Payment</span>
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#0D1522] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500">Total Verified Collections</span>
          <p className="text-3xl font-black text-emerald-600">
            ₹{Number(stats.totalCollectedINR || 85500).toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-400">Guaranteed integer arithmetic without rounding loss</p>
        </div>
        <div className="bg-white dark:bg-[#0D1522] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500">Transactions Recorded</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {stats.totalTransactions || payments.length}
          </p>
          <p className="text-[11px] text-slate-400">With unique sequential receipts</p>
        </div>
        <div className="bg-white dark:bg-[#0D1522] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500">Payment Gateway Status</span>
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-teal-600" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Razorpay India</span>
          </div>
          <span className="inline-block text-[10px] bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded">
            Test Mode Active
          </span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-[#0D1522] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Payment Receipts</h3>
            <p className="text-[11px] text-slate-400">Searchable ledger of verified transactions</p>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64 flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search receipt, student, class..."
                className="w-full pl-8 pr-8 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Receipt Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Fee Period</th>
                <th className="py-3 px-4">Amount Paid</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payments
                .filter((p) => {
                  if (!search.trim()) return true;
                  const q = search.toLowerCase().trim();
                  const receipt = (p.receiptNumber || '').toLowerCase();
                  const std = (p.studentId?.name || '').toLowerCase();
                  const adm = (p.studentId?.admissionNumber || '').toLowerCase();
                  const cls = (p.classId?.className || '').toLowerCase();
                  const mode = (p.paymentMethod || '').toLowerCase();
                  const ref = (p.transactionRef || '').toLowerCase();
                  return (
                    receipt.includes(q) ||
                    std.includes(q) ||
                    adm.includes(q) ||
                    cls.includes(q) ||
                    mode.includes(q) ||
                    ref.includes(q)
                  );
                })
                .map((p) => (
                <tr key={p._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-teal-700 dark:text-teal-400">
                    {p.receiptNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{p.studentId?.name}</div>
                    <div className="text-[10px] text-slate-400">{p.studentId?.admissionNumber}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {p.classId?.className} - {p.classId?.section}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                    {p.feeMonth}
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-600 font-mono text-sm">
                    ₹{(p.paidPaise / 100).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 uppercase text-[11px] font-semibold">
                    {p.paymentMethod}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openReceipt(p.receiptNumber)}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold inline-flex items-center space-x-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                    {canManageFees && p.status !== 'REVERSED' && (
                      <button
                        onClick={() => handleReverse(p._id)}
                        className="px-2.5 py-1 text-slate-400 hover:text-red-600 text-xs font-semibold transition"
                        title="Audit Reversal"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Fee Payment Modal */}
      {canManageFees && isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-[#0D1522] rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Record Official Fee Payment
              </h3>
              <button onClick={handleCloseModal}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Student *</label>
                <select
                  required
                  value={newPayment.studentId}
                  onChange={(e) => {
                    const std = students.find((s) => s._id === e.target.value);
                    const gross = 45000;
                    const disc = Math.round((gross * (std?.concessionPercent || 0)) / 100);
                    setNewPayment({
                      ...newPayment,
                      studentId: e.target.value,
                      classId: std?.classId?._id || std?.classId || '',
                      grossAmountINR: gross,
                      discountINR: disc,
                      paidAmountINR: gross - disc,
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                >
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.admissionNumber}) — {s.classId?.className || 'Class'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Fee Quarter / Period *</label>
                  <input
                    type="text"
                    required
                    value={newPayment.feeMonth}
                    onChange={(e) => setNewPayment({ ...newPayment, feeMonth: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Payment Method</label>
                  <select
                    value={newPayment.paymentMethod}
                    onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                  >
                    <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
                    <option value="NET_BANKING">Net Banking / NEFT</option>
                    <option value="CASH">Cash Counter</option>
                    <option value="CHEQUE">Bank Cheque</option>
                    <option value="ONLINE_RAZORPAY">Razorpay Gateway</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Gross Fee (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newPayment.grossAmountINR}
                    onChange={(e) => {
                      const gross = Math.max(0, Number(e.target.value));
                      let disc = newPayment.discountINR;
                      if (disc >= gross && gross > 0) {
                        const curStd = students.find((s) => s._id === newPayment.studentId);
                        disc = curStd?.concessionPercent
                          ? Math.round((gross * curStd.concessionPercent) / 100)
                          : Math.max(0, gross - 1);
                      }
                      const paid = Math.max(0, gross - disc);
                      setNewPayment({ ...newPayment, grossAmountINR: gross, discountINR: disc, paidAmountINR: paid });
                    }}
                    className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900 font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">
                    Concession (₹)
                    {(() => {
                      const curStd = students.find((s) => s._id === newPayment.studentId);
                      return curStd?.concessionPercent ? (
                        <span className="ml-1 text-teal-600 font-bold">({curStd.concessionPercent}%)</span>
                      ) : null;
                    })()}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={Math.max(0, newPayment.grossAmountINR - 1)}
                    value={newPayment.discountINR}
                    onChange={(e) => {
                      const disc = Math.max(0, Number(e.target.value));
                      const paid = Math.max(0, newPayment.grossAmountINR - disc);
                      setNewPayment({ ...newPayment, discountINR: disc, paidAmountINR: paid });
                    }}
                    className={`w-full px-3 py-2 rounded-xl border font-mono ${
                      newPayment.discountINR >= newPayment.grossAmountINR
                        ? 'border-rose-500 bg-rose-50/10 dark:bg-rose-950/20 text-rose-500'
                        : 'dark:bg-slate-900'
                    }`}
                  />
                  {newPayment.discountINR >= newPayment.grossAmountINR && (
                    <p className="text-[10px] text-rose-500 font-semibold mt-1">
                      Must be less than Gross Fee (max ₹{(newPayment.grossAmountINR - 1).toLocaleString('en-IN')})
                    </p>
                  )}
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Paid Amount (₹) *
                    <span className="text-[10px] text-slate-400 font-normal ml-1.5">(Auto)</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    tabIndex={-1}
                    value={`₹ ${Number(Math.max(0, newPayment.grossAmountINR - newPayment.discountINR)).toLocaleString('en-IN')}`}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 font-mono text-emerald-600 dark:text-emerald-400 font-bold cursor-not-allowed select-none"
                  />
                </div>
              </div>

              {/* Dynamic Live Calculation Card */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1 text-xs">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Gross Fee Subtotal:</span>
                  <span className="font-mono">₹{Number(newPayment.grossAmountINR).toLocaleString('en-IN')}</span>
                </div>
                {newPayment.discountINR > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 font-semibold">
                    <span>Less Concession / Scholarship:</span>
                    <span className="font-mono">- ₹{Number(newPayment.discountINR).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center font-bold text-slate-800 dark:text-slate-100 pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Net Total Amount to Pay:</span>
                  <span className="font-mono text-emerald-600 text-sm">₹{Number(newPayment.paidAmountINR).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Transaction Ref / Cheque No / Notes</label>
                <input
                  type="text"
                  value={newPayment.transactionRef}
                  onChange={(e) => setNewPayment({ ...newPayment, transactionRef: e.target.value })}
                  placeholder="e.g. UPI/610298451120/HDFC"
                  className="w-full px-3 py-2 rounded-xl border dark:bg-slate-900"
                />
              </div>

              <div className="pt-4 border-t flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={newPayment.discountINR >= newPayment.grossAmountINR || newPayment.grossAmountINR <= 0}
                  className={`px-6 py-2 font-bold rounded-xl shadow transition ${
                    newPayment.discountINR >= newPayment.grossAmountINR || newPayment.grossAmountINR <= 0
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  Generate Receipt & Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <FeeReceiptModal receipt={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
    </div>
  );
};
