import React from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Heart,
  Users,
  ArrowRight,
  Sparkles,
  Ticket,
} from 'lucide-react';
import { EventItem } from '../types/event';
import { formatFriendlyDate, getRelativeDateBadge } from '../utils/date';

interface EventCardProps {
  event: EventItem;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onViewDetails: (event: EventItem) => void;
  onRegister: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isBookmarked,
  onToggleBookmark,
  onViewDetails,
  onRegister,
}) => {
  const relativeBadge = getRelativeDateBadge(event.date);
  const formattedDate = formatFriendlyDate(event.date);
  const bookedPercent = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));
  const spotsLeft = Math.max(0, event.capacity - event.registeredCount);

  return (
    <article className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Event Image & Badges Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg backdrop-blur-md bg-black/60 text-white border border-white/20">
              {event.category}
            </span>
            {event.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg backdrop-blur-md bg-amber-500/90 text-slate-950 shadow-sm">
                <Sparkles className="w-3 h-3 fill-slate-950" />
                Featured
              </span>
            )}
            {event.isVirtual && (
              <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg backdrop-blur-md bg-cyan-600/90 text-white">
                Online
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(event.id);
            }}
            className="pointer-events-auto p-2 rounded-xl backdrop-blur-md bg-black/40 hover:bg-black/60 border border-white/20 text-white transition-transform active:scale-90"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark event'}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark event'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isBookmarked ? 'fill-rose-500 text-rose-500' : 'text-white'
              }`}
            />
          </button>
        </div>

        {/* Bottom Image Overlay: Date & Urgency badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg backdrop-blur-md bg-white/20 border border-white/20">
              <Calendar className="w-3.5 h-3.5 inline mr-1 text-indigo-300" />
              {formattedDate}
            </span>
          </div>

          <span
            className={`px-2 py-0.5 text-[11px] font-bold rounded-md uppercase tracking-wider backdrop-blur-md ${
              relativeBadge.urgent
                ? 'bg-rose-500/90 text-white animate-pulse'
                : 'bg-black/60 text-slate-200 border border-white/10'
            }`}
          >
            {relativeBadge.label}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 flex flex-col p-5">
        {/* Venue & Time Row */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
          <div className="flex items-center gap-1 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{event.venue}, {event.city}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{event.startTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {event.title}
        </h3>

        {/* Excerpt */}
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        {/* Capacity Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" />
              <span>{bookedPercent}% capacity filled</span>
            </span>
            <span className={spotsLeft < 50 ? 'text-amber-500 font-bold' : ''}>
              {spotsLeft} seats left
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                bookedPercent > 85 ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${bookedPercent}%` }}
            />
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Registration Fee
            </span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
              {event.basePrice === 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-black">FREE</span>
              ) : (
                `₹${event.basePrice}`
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewDetails(event)}
              className="px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => onRegister(event)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-sm active:scale-95 transition-all"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
