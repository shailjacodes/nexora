import React, { useState } from 'react';
import {
  Sparkles,
  Ticket,
  Sun,
  Moon,
  PlusCircle,
  Menu,
  X,
  Compass,
  Star,
  Search,
  LogOut,
  User as UserIcon,
  GraduationCap,
} from 'lucide-react';
import { User } from '../types/event';

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  registeredCount: number;
  onOpenMyPasses: () => void;
  onOpenHostEvent: () => void;
  onSearchFocus?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  theme,
  onToggleTheme,
  registeredCount,
  onOpenMyPasses,
  onOpenHostEvent,
  onSearchFocus,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & KIIT University Tag */}
        <a
          href="#"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
          aria-label="Nexora Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-slate-300 bg-clip-text text-transparent">
                nexora
              </span>
              <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                KIIT
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block -mt-1">
              Bhubaneswar, Odisha
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
          <button
            onClick={() => scrollToSection('events')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            <Compass className="w-4 h-4" />
            Explore
          </button>
          <button
            onClick={() => scrollToSection('featured')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            <Star className="w-4 h-4" />
            Featured
          </button>
          <button
            onClick={onOpenHostEvent}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-indigo-500" />
            Host Event
          </button>
        </nav>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Jump */}
          {onSearchFocus && (
            <button
              onClick={onSearchFocus}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors"
              aria-label="Focus event search"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search campus events...</span>
              <kbd className="inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-sm">
                /
              </kbd>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* My Passes / Tickets Button */}
          <button
            onClick={onOpenMyPasses}
            className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
            aria-label={`View My Passes (${registeredCount} booked)`}
          >
            <Ticket className="w-4 h-4" />
            <span className="hidden sm:inline">My Passes</span>
            {registeredCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold bg-pink-500 text-white rounded-full">
                {registeredCount}
              </span>
            )}
          </button>

          {/* Student/Guest Profile & Logout or Sign In button */}
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right leading-tight">
                <span className="block text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="block text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">
                  {currentUser.role === 'student' ? (currentUser.rollNumber || 'Student') : 'Guest Attendee'}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Log Out of KIIT Portal"
                aria-label="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => scrollToSection('signin')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5 text-indigo-500" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            {currentUser ? (
              <div className="p-3 mb-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">
                    {currentUser.name}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {currentUser.role === 'student' ? `Roll: ${currentUser.rollNumber}` : 'Guest Attendee'} • {currentUser.email}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/80 rounded-lg"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => scrollToSection('signin')}
                className="flex items-center gap-3 w-full p-3 mb-2 rounded-xl text-left font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 transition-colors"
              >
                <UserIcon className="w-5 h-5 text-indigo-500" />
                <span>Sign In (Any Email ID)</span>
              </button>
            )}

            <button
              onClick={() => scrollToSection('events')}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Compass className="w-5 h-5 text-indigo-500" />
              <span>Explore KIIT Events</span>
            </button>
            <button
              onClick={() => scrollToSection('featured')}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Star className="w-5 h-5 text-amber-500" />
              <span>Featured Highlights</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenHostEvent();
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <PlusCircle className="w-5 h-5 text-pink-500" />
              <span>Host a Campus Event</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMyPasses();
              }}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-left font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Ticket className="w-5 h-5" />
                <span>My Registered Passes & Payments</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                {registeredCount}
              </span>
            </button>

            {/* Mobile Theme Switcher */}
            <button
              onClick={() => {
                onToggleTheme();
              }}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-left font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-600" />
                )}
                <span>Theme: {theme === 'dark' ? 'Dark Mode (Active)' : 'Light Mode (Active)'}</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700">
                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
