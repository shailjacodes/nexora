import React, { useState } from 'react';
import {
  X,
  Ticket,
  Calendar,
  MapPin,
  QrCode,
  CalendarPlus,
  Trash2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Receipt,
  Download,
} from 'lucide-react';
import { Registration } from '../types/event';
import { formatFriendlyDate, generateIcsCalendarFile } from '../utils/date';
import { formatINR } from '../utils/payment';

interface MyRegistrationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: Registration[];
  onCancelRegistration: (id: string) => void;
  onDeleteRegistration: (id: string) => void;
  onViewPass: (reg: Registration) => void;
  onExploreEvents: () => void;
}

export const MyRegistrationsDrawer: React.FC<MyRegistrationsDrawerProps> = ({
  isOpen,
  onClose,
  registrations,
  onCancelRegistration,
  onDeleteRegistration,
  onViewPass,
  onExploreEvents,
}) => {
  const [filter, setFilter] = useState<'all' | 'paid' | 'free' | 'cancelled'>('all');
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredList = registrations.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'cancelled') return item.status === 'cancelled';
    if (filter === 'paid') return item.totalAmount > 0 && item.status !== 'cancelled';
    if (filter === 'free') return item.totalAmount === 0 && item.status !== 'cancelled';
    return true;
  });

  const totalSpent = registrations
    .filter((r) => r.status === 'confirmed')
    .reduce((sum, r) => sum + r.totalAmount, 0);

  const handleDownloadIcs = (reg: Registration) => {
    const icsContent = generateIcsCalendarFile(
      reg.eventTitle,
      `Pass ${reg.id} for ${reg.participantName}. Txn: ${reg.transactionId}.`,
      `${reg.eventVenue}, ${reg.eventCity}`,
      reg.eventDate,
      reg.eventTime
    );

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${reg.id}-calendar.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const paymentMethodLabels: Record<string, string> = {
    upi: 'UPI',
    kiit_wallet: 'KIIT Smart Card',
    card: 'Card',
    netbanking: 'NetBanking',
    free: 'Complimentary',
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="my-passes-heading"
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 id="my-passes-heading" className="text-base font-bold text-slate-900 dark:text-white">
                Passes & Payment Tracking
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                KIIT University Event Registrations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close my passes drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Payment Ticker */}
        <div className="px-5 py-3 bg-indigo-50/70 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">
              Total Spent on Passes
            </span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
              {formatINR(totalSpent)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">
              Active Passes
            </span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
              {registrations.filter((r) => r.status === 'confirmed').length} Booked
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1.5 overflow-x-auto">
          {(['all', 'paid', 'free', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition-colors ${
                filter === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Passes List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {filteredList.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 dark:text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <Ticket className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                No passes found
              </h4>
              <p className="text-xs leading-relaxed max-w-xs mb-6">
                You haven't registered for any KIIT events in this view yet.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onExploreEvents();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-500/25 active:scale-95"
              >
                <span>Discover KIIT Events</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            filteredList.map((item) => (
              <div
                key={item.id}
                className="relative p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col gap-3 transition-all hover:border-indigo-400 dark:hover:border-indigo-500"
              >
                {/* Event header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                      {item.id}
                    </span>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {item.eventTitle}
                    </h5>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                      item.status === 'confirmed'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 line-through'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{formatFriendlyDate(item.eventDate)} • {item.eventTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    <span className="truncate">{item.eventVenue}, Bhubaneswar</span>
                  </div>
                </div>

                {/* Payment tracking breakdown box */}
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Transaction ID:</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {item.transactionId || 'TXN-KIIT-INIT'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Payment Method:</span>
                    <span className="font-semibold">
                      {paymentMethodLabels[item.paymentMethod] || 'Online Payment'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-900 dark:text-white font-bold pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span>Amount Paid:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                      {formatINR(item.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Attendee info */}
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Student Attendee</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.participantName}
                    </span>
                    {item.rollNumber && (
                      <span className="text-[10px] text-slate-500 block">Roll: {item.rollNumber}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">Tier</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.ticketTierName} ({item.quantity}x)
                    </span>
                  </div>
                </div>

                {/* Actions row */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onViewPass(item)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors flex items-center gap-1"
                      title="View Digital Ticket Pass"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View Pass</span>
                    </button>
                    <button
                      onClick={() => handleDownloadIcs(item)}
                      className="p-1.5 rounded-lg text-xs font-medium bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                      title="Add to Calendar (.ics)"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {item.status === 'confirmed' ? (
                    confirmCancelId === item.id ? (
                      <div className="flex items-center gap-1.5 animate-in fade-in">
                        <span className="text-[11px] text-rose-500 font-semibold">Cancel?</span>
                        <button
                          onClick={() => {
                            onCancelRegistration(item.id);
                            setConfirmCancelId(null);
                          }}
                          className="px-2 py-1 text-[11px] font-bold bg-rose-600 text-white rounded hover:bg-rose-500"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmCancelId(null)}
                          className="px-2 py-1 text-[11px] font-medium bg-slate-200 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmCancelId(item.id)}
                        className="text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors"
                      >
                        Cancel Ticket
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => onDeleteRegistration(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Delete record from device"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
