import React from 'react';
import { X, Printer, CheckCircle } from 'lucide-react';

interface FeeReceiptModalProps {
  receipt: any;
  onClose: () => void;
}

export const FeeReceiptModal: React.FC<FeeReceiptModalProps> = ({ receipt, onClose }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const paidAmount = receipt.amounts ? receipt.amounts.paidINR : (receipt.paidPaise / 100).toFixed(2);
  const discountAmount = receipt.amounts ? receipt.amounts.discountINR : (receipt.discountPaise / 100).toFixed(2);
  const grossAmount = receipt.amounts?.grossTotalINR || (Number(paidAmount) + Number(discountAmount)).toFixed(2);

  // Use dynamic heads from receipt or calculate proportional heads based on grossAmount
  const heads = receipt.heads && receipt.heads.length > 0 ? receipt.heads : [
    { name: 'Standard Tuition & Academic Fee', amountINR: (Number(grossAmount) * 0.7111).toFixed(2) },
    { name: 'Smart Class & AI Maker Lab Facility', amountINR: (Number(grossAmount) * 0.1111).toFixed(2) },
    { name: 'Development & Campus Infrastructure', amountINR: (Number(grossAmount) * 0.0889).toFixed(2) },
    {
      name: 'Sports, Library & Cultural Activities',
      amountINR: (
        Number(grossAmount) -
        Number((Number(grossAmount) * 0.7111).toFixed(2)) -
        Number((Number(grossAmount) * 0.1111).toFixed(2)) -
        Number((Number(grossAmount) * 0.0889).toFixed(2))
      ).toFixed(2),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-[#0D1522] rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Modal Controls (Hidden in print) */}
        <div className="no-print p-4 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
              Official School Fee Receipt
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#0B192C] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-8 text-slate-900 bg-white printable-card font-sans">
          {/* Header */}
          <div className="border-b-2 border-slate-800 pb-4 text-center">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
              {receipt.school?.name || 'D.A.V Public School, Pindersot'}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {receipt.school?.address || 'Sector 12, R.K. Puram, New Delhi - 110022'} • Phone: {receipt.school?.phone || '+91 11 4911 5500'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Affiliated to CBSE, New Delhi • Registered Educational Society
            </p>
            <div className="mt-3 inline-block bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded border border-slate-300">
              FEE PAYMENT RECEIPT (STUDENT COPY)
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-200">
            <div>
              <p><span className="font-semibold text-slate-600">Receipt No:</span> <span className="font-bold text-slate-900">{receipt.receiptNumber}</span></p>
              <p className="mt-1"><span className="font-semibold text-slate-600">Date & Time:</span> {new Date(receipt.paymentDate || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              <p className="mt-1"><span className="font-semibold text-slate-600">Payment Period:</span> <span className="font-medium text-slate-900">{receipt.feeMonth}</span></p>
              <p className="mt-1"><span className="font-semibold text-slate-600">Mode of Payment:</span> <span className="font-semibold text-emerald-700 uppercase">{receipt.paymentMethod}</span></p>
            </div>
            <div>
              <p><span className="font-semibold text-slate-600">Student Name:</span> <span className="font-bold text-slate-900">{receipt.studentId?.name || 'Aarav Sharma'}</span></p>
              <p className="mt-1"><span className="font-semibold text-slate-600">Admission No:</span> {receipt.studentId?.admissionNumber || 'DPS-2026-0001'}</p>
              <p className="mt-1"><span className="font-semibold text-slate-600">Class & Section:</span> {receipt.classId?.className || 'Class 10'} - {receipt.classId?.section || 'A'}</p>
              <p className="mt-1"><span className="font-semibold text-slate-600">Ref / Txn ID:</span> {receipt.transactionRef || 'N/A'}</p>
            </div>
          </div>

          {/* Line items table */}
          <div className="py-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-300 text-left font-semibold text-slate-700">
                  <th className="py-2">Description / Fee Head</th>
                  <th className="py-2 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {heads.map((h: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-2 font-medium">{h.name}</td>
                    <td className="py-2 text-right font-mono">
                      ₹ {Number(h.amountINR || (h.amountPaise ? h.amountPaise / 100 : 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
                {Number(discountAmount) > 0 && (
                  <tr className="border-t border-slate-200 text-slate-600 font-semibold bg-slate-50/50">
                    <td className="py-2">Gross Subtotal Fee</td>
                    <td className="py-2 text-right font-mono">
                      ₹ {Number(grossAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                )}
                {Number(discountAmount) > 0 && (
                  <tr className="text-emerald-700 font-semibold bg-emerald-50/50">
                    <td className="py-2">Less: Merit Scholarship / Approved Concession</td>
                    <td className="py-2 text-right font-mono">
                      - ₹ {Number(discountAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-800 text-slate-900 font-bold text-sm">
                  <td className="py-3">TOTAL AMOUNT PAID</td>
                  <td className="py-3 text-right font-mono text-emerald-800">
                    ₹ {Number(paidAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Verification stamp & signature */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex items-end justify-between text-xs text-slate-500">
            <div>
              <p className="text-[10px] text-slate-400">
                This is a computer-generated fee receipt secured by SoftDeals SMS platform.
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                All disputes are subject to the jurisdiction of local courts only.
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1"></div>
              <p className="font-semibold text-slate-800">Accounts Department</p>
              <p className="text-[10px]">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
