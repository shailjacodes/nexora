import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Users,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  UserCheck,
  Globe,
  MapPin,
  Ticket,
} from 'lucide-react';
import { User } from '../types/event';
import {
  DEFAULT_KIIT_USER,
  DEFAULT_GUEST_USER,
  loginKiitUser,
  validateKiitLogin,
} from '../utils/auth';

interface MainPageLoginAreaProps {
  currentUser: User | null;
  onLoginSuccess: (user: User) => void;
  onLogout: () => void;
  onOpenMyPasses: () => void;
  registeredCount: number;
}

export const MainPageLoginArea: React.FC<MainPageLoginAreaProps> = ({
  currentUser,
  onLoginSuccess,
  onLogout,
  onOpenMyPasses,
  registeredCount,
}) => {
  const [identifier, setIdentifier] = useState('24155278@kiit.ac.in');
  const [studentName, setStudentName] = useState('Shailja Khemani');
  const [password, setPassword] = useState('kiit@2026');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchingAccount, setIsSwitchingAccount] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateKiitLogin(identifier, password);
    if (!validation.isValid) {
      setError(validation.error || 'Please enter a valid email or roll number.');
      return;
    }

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const res = loginKiitUser(identifier, studentName);
      setIsLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        setIsSwitchingAccount(false);
      } else {
        setError(res.error || 'Sign-in failed. Please check credentials.');
      }
    }, 300);
  };

  const handleQuickLogin = (email: string, name: string) => {
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      const res = loginKiitUser(email, name);
      setIsLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        setIsSwitchingAccount(false);
      }
    }, 250);
  };

  return (
    <section id="signin" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 scroll-mt-24">
      {/* Container Card */}
      <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-colors duration-200">
        {/* Subtle accent backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* State A: User is currently logged in and not switching */}
        {currentUser && !isSwitchingAccount ? (
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-indigo-500/25 shrink-0">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Signed In</span>
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {currentUser.role === 'student'
                      ? `KIIT Student • Roll: ${currentUser.rollNumber}`
                      : 'Guest / External Attendee'}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {currentUser.name}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>{currentUser.email}</span>
                  <span>•</span>
                  <span>{currentUser.department}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-pink-500" />
                    {currentUser.campus}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onOpenMyPasses}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-md shadow-indigo-600/20 transition-all"
              >
                <Ticket className="w-4 h-4" />
                <span>My Booked Passes</span>
                {registeredCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[11px] font-bold bg-white text-indigo-700 rounded-full">
                    {registeredCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsSwitchingAccount(true)}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Switch Account
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Sign out of current profile"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* State B: Sign-In Area (Not logged in or switching account) */
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Heading & Quick 1-Click Access Profiles */}
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Attendee & Campus Portal</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  Sign in with any Email ID
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Open to everyone. KIIT students, faculty, alumni, and general public guests can register and track Bhubaneswar event passes instantly.
                </p>

                {/* 1-Click Demo Profiles */}
                <div className="pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Instant 1-Click Sign-In
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                    {/* Student 1-Click */}
                    <button
                      type="button"
                      onClick={() => handleQuickLogin(DEFAULT_KIIT_USER.email, DEFAULT_KIIT_USER.name)}
                      disabled={isLoading}
                      className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 text-left transition-all active:scale-98 group flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>KIIT Student</span>
                        </div>
                        <strong className="block text-xs font-bold text-slate-900 dark:text-white">
                          Shailja Khemani
                        </strong>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          24155278@kiit.ac.in
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform shrink-0" />
                    </button>

                    {/* Guest 1-Click */}
                    <button
                      type="button"
                      onClick={() => handleQuickLogin(DEFAULT_GUEST_USER.email, DEFAULT_GUEST_USER.name)}
                      disabled={isLoading}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-slate-400 text-left transition-all active:scale-98 group flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                          <Users className="w-3.5 h-3.5" />
                          <span>Personal Email Guest</span>
                        </div>
                        <strong className="block text-xs font-bold text-slate-900 dark:text-white">
                          Rohan Verma
                        </strong>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          rohan.verma@gmail.com
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform shrink-0" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Instant pass delivery & QR validation</span>
                </div>
              </div>

              {/* Right Column: Universal Form */}
              <div className="lg:col-span-7 bg-slate-50/70 dark:bg-slate-950/70 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Enter Your Email or Student Roll Number
                  </h4>
                  {isSwitchingAccount && (
                    <button
                      type="button"
                      onClick={() => setIsSwitchingAccount(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {error && (
                  <div
                    role="alert"
                    className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold"
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="main-login-identifier"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Email Address (Personal or KIIT) or Roll No *
                      </label>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                        <span>Quick:</span>
                        <button
                          type="button"
                          onClick={() => setIdentifier('shailja.khemani@gmail.com')}
                          className="hover:text-indigo-600 dark:hover:text-indigo-400 font-mono underline"
                        >
                          @gmail
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => setIdentifier('rohan.verma@outlook.com')}
                          className="hover:text-indigo-600 dark:hover:text-indigo-400 font-mono underline"
                        >
                          @outlook
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => setIdentifier('24155278@kiit.ac.in')}
                          className="hover:text-indigo-600 dark:hover:text-indigo-400 font-mono underline"
                        >
                          @kiit.ac.in
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="main-login-identifier"
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => {
                          setIdentifier(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="e.g. shailja@gmail.com, 24155278@kiit.ac.in, or 24155278"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor="main-login-name"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <input
                          id="main-login-name"
                          type="text"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="e.g. Shailja Khemani"
                          className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="main-login-password"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Portal Password *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="main-login-password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) setError('');
                          }}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Nexora</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
