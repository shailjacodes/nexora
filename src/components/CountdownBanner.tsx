import React, { useEffect, useState } from 'react';
import { Clock, Flame, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { EventItem } from '../types/event';
import { calculateTimeRemaining, CountdownResult } from '../utils/date';

interface CountdownBannerProps {
  event: EventItem;
  onRegisterClick: (event: EventItem) => void;
  onViewDetails: (event: EventItem) => void;
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({
  event,
  onRegisterClick,
  onViewDetails,
}) => {
  const [timeLeft, setTimeLeft] = useState<CountdownResult>(() =>
    calculateTimeRemaining(event.date, event.startTime)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(event.date, event.startTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [event.date, event.startTime]);

  return (
    <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white shadow-2xl p-6 sm:p-8 lg:p-10">
        {/* Decorative background image overlay */}
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url(${event.image})` }}
        />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Event Context */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <Flame className="w-3.5 h-3.5 fill-rose-400 text-rose-400 animate-pulse" />
                Trending Spotlight
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {event.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                • {event.registeredCount}/{event.capacity} registered
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {event.title}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 line-clamp-2 leading-relaxed">
              {event.tagline || event.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>{event.date} • {event.startTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-pink-400" />
                <span>{event.venue}, Bhubaneswar</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Countdown & Quick CTA */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end gap-5">
            <div className="w-full max-w-md bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-indigo-300">
                  <Clock className="w-3.5 h-3.5" />
                  Live Event Countdown
                </span>
                <span className="text-rose-400 animate-pulse">Closing Soon</span>
              </div>

              {/* Countdown Digits */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <span className="block text-2xl sm:text-3xl font-black text-white font-mono">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Days
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <span className="block text-2xl sm:text-3xl font-black text-white font-mono">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Hours
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <span className="block text-2xl sm:text-3xl font-black text-white font-mono">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Mins
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <span className="block text-2xl sm:text-3xl font-black text-indigo-300 font-mono">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Secs
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 w-full max-w-md">
              <button
                onClick={() => onViewDetails(event)}
                className="flex-1 py-3 px-4 text-xs sm:text-sm font-semibold rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all text-center"
              >
                View Full Lineup
              </button>
              <button
                onClick={() => onRegisterClick(event)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 hover:opacity-95 text-white shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
              >
                <span>Book Pass</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
