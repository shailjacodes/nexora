import React, { useState } from 'react';
import { Sparkles, ArrowRight, Heart, Shield, CheckCircle2, Mail } from 'lucide-react';
import { EventCategory } from '../types/event';
import { validateEmail } from '../utils/validation';

interface FooterProps {
  onSelectCategory: (cat: EventCategory) => void;
  onOpenHostEvent: () => void;
  onShowToast: (title: string, message?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenHostEvent,
  onShowToast,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validateEmail(email);
    if (!res.isValid) {
      setError(res.error || 'Please enter a valid email.');
      return;
    }
    setError('');
    setSubscribed(true);
    onShowToast('Subscribed!', 'You will receive monthly event drop notifications.');
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                nexora
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Nexora is the dedicated event discovery, ticketing, and UPI payment platform for
              students, faculty, and delegates at Kalinga Institute of Industrial Technology (KIIT),
              Bhubaneswar, Odisha.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Shield className="w-3.5 h-3.5" />
                KIIT Verified Digital Pass & UPI Security
              </span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Explore Campus Categories
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {[
                'Cultural & Music',
                'Tech & AI',
                'Business & E-Summit',
                'Conferences',
                'Sports & KPL',
              ].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat as EventCategory);
                      const el = document.getElementById('events');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={onOpenHostEvent}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Host an Event
                </button>
              </li>
              <li>
                <a
                  href="#featured"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Featured Lineup
                </a>
              </li>
              <li>
                <button
                  onClick={scrollToTop}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Back to Top
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Stay in the Loop
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              Get notified when premier speakers, early bird discounts, and secret sets are announced.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="your.email@example.com"
                  className="w-full pl-3 pr-9 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Newsletter email address"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center justify-center"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
              {subscribed && (
                <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Subscribed to event digest!
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom copyright & evaluation notice */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <span>© 2026 Nexora Events Platform. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Responsive Event Management Showcase</span>
            <span>•</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">nexora</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
