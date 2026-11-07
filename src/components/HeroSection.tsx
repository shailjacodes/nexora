import React from 'react';
import { Search, Calendar, Users, Award, Zap, ArrowRight, ShieldCheck, MapPin, GraduationCap } from 'lucide-react';
import { EventCategory } from '../types/event';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: EventCategory;
  onSelectCategory: (cat: EventCategory) => void;
  onExploreClick: () => void;
}

const CATEGORY_CHIPS: { label: EventCategory; icon: string }[] = [
  { label: 'All', icon: '✨' },
  { label: 'Cultural & Music', icon: '🎭' },
  { label: 'Tech & AI', icon: '🤖' },
  { label: 'Business & E-Summit', icon: '🚀' },
  { label: 'Conferences', icon: '🏛️' },
  { label: 'Sports & KPL', icon: '🏏' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onExploreClick,
}) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-14 lg:pt-16 lg:pb-20 border-b border-slate-200/60 dark:border-slate-800/60">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-500/15 via-emerald-500/10 to-pink-500/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
          <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Kalinga Institute of Industrial Technology</span>
          <span className="hidden sm:inline text-emerald-400">•</span>
          <span className="hidden sm:inline text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 inline" />
            Bhubaneswar, Odisha
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
          Experience Campus Life.{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
            KIIT University Events
          </span>{' '}
          Live on Nexora.
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          From KIIT Fest and KPL floodlight cricket to international IEEE conferences and KIIT-TBI
          Startup E-Summits. Reserve verified student passes with instant UPI & Smart Card payment.
        </p>

        {/* Search Bar Container */}
        <div className="mt-8 max-w-2xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onExploreClick();
            }}
            className="relative flex items-center shadow-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-all"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              id="hero-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search KIIT Fest, ICDCIT, Campus 6, KPL cricket, workshops..."
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              aria-label="Search campus events"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="px-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onExploreClick}
              className="shrink-0 flex items-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-md shadow-indigo-600/25 transition-all"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4 hidden sm:inline" />
            </button>
          </form>
        </div>

        {/* Category Shortcut Pills */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-2 max-w-3xl mx-auto">
          {CATEGORY_CHIPS.map((chip) => {
            const isSelected = selectedCategory === chip.label;
            return (
              <button
                key={chip.label}
                onClick={() => {
                  onSelectCategory(chip.label);
                  onExploreClick();
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm scale-105'
                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Metrics Grid */}
        <div className="mt-10 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-1 text-2xl font-extrabold text-slate-900 dark:text-white">
              <Calendar className="w-5 h-5 text-indigo-500 mr-1" />
              <span>Campus 1-24</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Bhubaneswar Network
            </span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-1 text-2xl font-extrabold text-slate-900 dark:text-white">
              <Users className="w-5 h-5 text-emerald-500 mr-1" />
              <span>30,000+</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Enrolled KIITians
            </span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-1 text-2xl font-extrabold text-slate-900 dark:text-white">
              <Award className="w-5 h-5 text-amber-500 mr-1" />
              <span>A++ Grade</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              NAAC Accredited
            </span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-1 text-2xl font-extrabold text-slate-900 dark:text-white">
              <ShieldCheck className="w-5 h-5 text-indigo-500 mr-1" />
              <span>Instant UPI</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              & KIIT Card Tracking
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
