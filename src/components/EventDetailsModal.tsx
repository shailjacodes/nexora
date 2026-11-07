import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Share2,
  Heart,
  Sparkles,
  ChevronDown,
  Layers,
  HelpCircle,
  Ticket,
  ExternalLink,
} from 'lucide-react';
import { EventItem, TicketTier } from '../types/event';
import { formatFriendlyDate } from '../utils/date';

interface EventDetailsModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (event: EventItem, selectedTierId?: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onShare: (event: EventItem) => void;
}

type TabType = 'overview' | 'agenda' | 'speakers' | 'tickets' | 'venue' | 'faqs';

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  isOpen,
  onClose,
  onRegister,
  isBookmarked,
  onToggleBookmark,
  onShare,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!isOpen || !event) return null;

  const formattedDate = formatFriendlyDate(event.date);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-event-title"
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Hero Banner */}
        <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full bg-slate-950 overflow-hidden shrink-0">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close & Action Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => onShare(event)}
              className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 transition-all active:scale-95"
              aria-label="Share event"
              title="Share event link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleBookmark(event.id)}
              className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 transition-all active:scale-95"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark event'}
            >
              <Heart
                className={`w-4 h-4 ${
                  isBookmarked ? 'fill-rose-500 text-rose-500' : 'text-white'
                }`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 transition-all active:scale-95"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Banner Meta Badges */}
          <div className="absolute bottom-4 left-4 sm:left-6 right-4 sm:right-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-sm">
                {event.category}
              </span>
              {event.featured && (
                <span className="px-3 py-1 text-xs font-bold rounded-lg bg-amber-400 text-slate-950 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured Event
                </span>
              )}
              {event.isVirtual && (
                <span className="px-3 py-1 text-xs font-bold rounded-lg bg-cyan-500 text-white">
                  Virtual / Online Pass
                </span>
              )}
            </div>

            <h2
              id="modal-event-title"
              className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight"
            >
              {event.title}
            </h2>
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span className="font-medium">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-violet-500" />
            <span>{event.startTime} - {event.endTime}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin className="w-4 h-4 text-pink-500 shrink-0" />
            <span className="truncate">{event.venue}, {event.city}</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto font-medium">
            <Users className="w-4 h-4 text-emerald-500" />
            <span>{event.registeredCount} / {event.capacity} booked</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none" aria-label="Event Details Tabs">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'agenda', label: `Agenda (${event.agenda.length})` },
              { id: 'speakers', label: `Speakers (${event.speakers.length})` },
              { id: 'tickets', label: `Tickets (${event.ticketTiers.length})` },
              { id: 'venue', label: 'Venue & Map' },
              { id: 'faqs', label: `FAQs (${event.faqs.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-slate-700 dark:text-slate-300">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                  About This Event
                </h4>
                <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-white leading-relaxed mb-4">
                  {event.tagline}
                </p>
                <div className="text-sm leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300">
                  {event.longDescription || event.description}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Topic Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Agenda Tab */}
          {activeTab === 'agenda' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                Event Schedule & Timetable
              </h4>
              <div className="relative border-l-2 border-indigo-200 dark:border-indigo-900/60 ml-3 space-y-6 pl-6 pt-2">
                {event.agenda.map((item, idx) => (
                  <div key={item.id || idx} className="relative group">
                    {/* Circle Node */}
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-indigo-600" />
                    <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                          {item.time}
                        </span>
                        {item.stageOrRoom && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {item.stageOrRoom}
                          </span>
                        )}
                      </div>
                      <h5 className="text-base font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h5>
                      <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                      {item.speakerName && (
                        <span className="inline-block mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                          Presented by <strong>{item.speakerName}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Speakers Tab */}
          {activeTab === 'speakers' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                Featured Keynote Speakers & Hosts
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.speakers.map((speaker) => (
                  <div
                    key={speaker.id}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80"
                  >
                    <img
                      src={speaker.avatar}
                      alt={speaker.name}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                    <div className="min-w-0">
                      <h5 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                        {speaker.name}
                      </h5>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                        {speaker.role} • {speaker.company}
                      </p>
                      {speaker.topic && (
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-snug">
                          Session: <em>"{speaker.topic}"</em>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                Available Pass Options & Inclusions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {event.ticketTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="flex flex-col justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-bold text-slate-900 dark:text-white text-base">
                          {tier.name}
                        </h5>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {tier.remaining} left
                        </span>
                      </div>

                      <div className="mb-3">
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                          {tier.price === 0 ? 'FREE' : `₹${tier.price}`}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                          / person
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                        {tier.description}
                      </p>

                      <ul className="space-y-2 mb-4 text-xs text-slate-600 dark:text-slate-300">
                        {tier.perks.map((perk, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => onRegister(event, tier.id)}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-center"
                    >
                      Select {tier.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Venue & Map Tab */}
          {activeTab === 'venue' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h5 className="text-base font-bold text-slate-900 dark:text-white">
                    {event.venue}
                  </h5>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {event.address}, {event.city}
                  </p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
                    {event.isVirtual ? 'Hybrid: In-person hall + Global Virtual Studio' : 'In-Person Venue'}
                  </p>
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${event.venue} ${event.address} ${event.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Simulated Map Visual */}
              <div className="relative aspect-[16/8] w-full rounded-2xl bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center text-center p-6">
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center mb-2 animate-bounce">
                    <MapPin className="w-6 h-6 text-rose-500" />
                  </div>
                  <h6 className="text-sm font-bold text-white">{event.venue}</h6>
                  <p className="text-xs text-slate-300 mt-0.5">{event.address}, {event.city}</p>
                  <span className="mt-3 px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 text-slate-200 border border-white/20">
                    Interactive Location Marker
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* FAQs Tab */}
          {activeTab === 'faqs' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                Frequently Asked Questions
              </h4>
              {event.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-slate-900 dark:text-white"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Tickets Starting At
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {event.basePrice === 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400">FREE</span>
              ) : (
                `₹${event.basePrice}`
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onRegister(event)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:opacity-95 shadow-md shadow-indigo-500/25 active:scale-95 transition-all"
            >
              <Ticket className="w-4 h-4" />
              <span>Register Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
