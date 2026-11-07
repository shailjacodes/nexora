import React from 'react';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  QrCode,
  Download,
  CalendarPlus,
  Ticket,
  X,
  Share2,
  Printer,
  Sparkles,
  ShieldCheck,
  Receipt,
  CreditCard,
} from 'lucide-react';
import { Registration } from '../types/event';
import { formatFriendlyDate, generateIcsCalendarFile } from '../utils/date';
import { formatINR } from '../utils/payment';

interface RegistrationSuccessModalProps {
  registration: Registration | null;
  isOpen: boolean;
  onClose: () => void;
  onViewMyPasses: () => void;
}

export const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({
  registration,
  isOpen,
  onClose,
  onViewMyPasses,
}) => {
  if (!isOpen || !registration) return null;

  const formattedDate = formatFriendlyDate(registration.eventDate);

  const handleDownloadIcs = () => {
    const icsContent = generateIcsCalendarFile(
      registration.eventTitle,
      `Official KIIT Event Pass ${registration.id} for ${registration.participantName} (Roll: ${registration.rollNumber || '24155278'}). Txn: ${registration.transactionId}.`,
      `${registration.eventVenue}, ${registration.eventCity}`,
      registration.eventDate,
      registration.eventTime
    );

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${registration.id}-${registration.eventTitle.slice(0, 15)}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const paymentMethodLabels: Record<string, string> = {
    upi: 'UPI Transfer',
    kiit_wallet: 'KIIT Smart Card',
    card: 'Debit/Credit Card',
    netbanking: 'Net Banking',
    free: 'Complimentary Student Pass',
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-success-title"
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Success Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 id="ticket-success-title" className="text-base sm:text-lg font-bold">
                Payment Received & Pass Generated!
              </h3>
              <p className="text-xs text-emerald-100">
                Txn ID: {registration.transactionId} • Verified
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Digital Ticket Pass Card Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Payment Tracking Pill */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-100 block">
                  Payment Status: {registration.paymentStatus === 'completed' ? 'Paid & Confirmed' : 'Approved'}
                </span>
                <span className="text-slate-500 text-[11px]">
                  Method: {paymentMethodLabels[registration.paymentMethod] || 'Online Payment'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                {formatINR(registration.totalAmount)}
              </span>
              <span className="block text-[10px] text-slate-400">Bhubaneswar Campus</span>
            </div>
          </div>

          {/* Ticket Card */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white p-5 sm:p-6 border border-slate-800 shadow-xl overflow-hidden print:bg-white print:text-black">
            {/* Top Pass Branding */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-extrabold tracking-wider uppercase bg-gradient-to-r from-indigo-300 to-pink-300 bg-clip-text text-transparent">
                  nexora kiit pass
                </span>
              </div>
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {registration.id}
              </span>
            </div>

            {/* Event Name & Venue */}
            <div className="mb-4">
              <h4 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                {registration.eventTitle}
              </h4>
              <div className="mt-2 flex flex-col gap-1 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{formattedDate} • {registration.eventTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span className="truncate">{registration.eventVenue}, {registration.eventCity}</span>
                </div>
              </div>
            </div>

            {/* Perforation Divider */}
            <div className="relative my-4 flex items-center justify-between">
              <div className="w-4 h-4 rounded-full bg-white dark:bg-slate-900 -ml-7 border border-slate-800" />
              <div className="flex-1 border-b-2 border-dashed border-white/20 mx-2" />
              <div className="w-4 h-4 rounded-full bg-white dark:bg-slate-900 -mr-7 border border-slate-800" />
            </div>

            {/* Attendee & QR Code Section */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-7 space-y-2 text-xs">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    Student Attendee
                  </span>
                  <span className="font-bold text-white text-sm">
                    {registration.participantName}
                  </span>
                  {registration.rollNumber && (
                    <span className="block text-[11px] text-indigo-300">
                      Roll No: {registration.rollNumber}
                    </span>
                  )}
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    Payment Reference
                  </span>
                  <span className="text-slate-300 font-mono text-[11px] truncate block">
                    {registration.transactionId}
                  </span>
                </div>
                <div className="flex items-center gap-4 pt-1">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Tier
                    </span>
                    <span className="font-semibold text-indigo-300">
                      {registration.ticketTierName}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Qty
                    </span>
                    <span className="font-semibold text-white">
                      {registration.quantity} Pass{registration.quantity > 1 ? 'es' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Code Simulation */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 rounded-xl bg-white text-slate-900">
                <QrCode className="w-24 h-24 text-slate-900" />
                <span className="text-[10px] font-mono font-bold text-slate-600 mt-1 tracking-wider text-center">
                  KIIT ADMISSION SCAN
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownloadIcs}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <CalendarPlus className="w-4 h-4 text-indigo-500" />
              <span>Add to Calendar</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-4 h-4 text-violet-500" />
              <span>Print / Save Pass</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onViewMyPasses();
            }}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <Receipt className="w-4 h-4" />
            <span>View Payments & Passes</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all shadow-md shadow-indigo-500/25"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
