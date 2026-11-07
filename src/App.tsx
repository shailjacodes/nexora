import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { MainPageLoginArea } from './components/MainPageLoginArea';
import { HeroSection } from './components/HeroSection';
import { CountdownBanner } from './components/CountdownBanner';
import { EventFilters, PriceFilter, FormatFilter, SortOption } from './components/EventFilters';
import { EventCard } from './components/EventCard';
import { EventDetailsModal } from './components/EventDetailsModal';
import { RegistrationModal } from './components/RegistrationModal';
import { PaymentSectionModal } from './components/PaymentSectionModal';
import { RegistrationSuccessModal } from './components/RegistrationSuccessModal';
import { MyRegistrationsDrawer } from './components/MyRegistrationsDrawer';
import { CreateEventModal } from './components/CreateEventModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { ConfettiCanvas } from './components/Confetti';
import { Footer } from './components/Footer';
import { INITIAL_EVENTS } from './data/mockEvents';
import {
  EventCategory,
  EventItem,
  PaymentMethod,
  Registration,
  RegistrationFormData,
  TicketTier,
  User,
} from './types/event';
import {
  getStoredRegistrations,
  saveRegistration,
  cancelRegistration,
  deleteRegistration,
  getStoredBookmarks,
  toggleStoredBookmark,
  getStoredTheme,
  setStoredTheme,
  getStoredCustomEvents,
  saveCustomEvent,
} from './utils/storage';
import { getStoredUser, setStoredUser, logoutUser, loginKiitUser } from './utils/auth';
import { generateTicketId } from './utils/validation';
import { calculateOrderPricing } from './utils/payment';
import { Calendar, Search } from 'lucide-react';

const CATEGORIES: EventCategory[] = [
  'All',
  'Cultural & Music',
  'Tech & AI',
  'Business & E-Summit',
  'Conferences',
  'Sports & KPL',
];

export default function App() {
  // Authentication state (Login page before main page)
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredUser());

  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => getStoredTheme());

  // Events dataset (initial mock + user-created custom events)
  const [events, setEvents] = useState<EventItem[]>(() => {
    const custom = getStoredCustomEvents();
    return [...custom, ...INITIAL_EVENTS];
  });

  // User storage state
  const [registrations, setRegistrations] = useState<Registration[]>(() => getStoredRegistrations());
  const [bookmarks, setBookmarks] = useState<string[]>(() => getStoredBookmarks());

  // Filter & Search state
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [formatFilter, setFormatFilter] = useState<FormatFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-asc');

  // Modals & Drawers
  const [selectedDetailsEvent, setSelectedDetailsEvent] = useState<EventItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Registration Form Modal
  const [registerEvent, setRegisterEvent] = useState<EventItem | null>(null);
  const [initialTierId, setInitialTierId] = useState<string | undefined>();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Payment Section Modal (Directs here after registration form submission)
  const [pendingRegistrationData, setPendingRegistrationData] = useState<RegistrationFormData | null>(null);
  const [pendingSelectedTier, setPendingSelectedTier] = useState<TicketTier | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Success Digital Pass Modal
  const [successRegistration, setSuccessRegistration] = useState<Registration | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Drawers
  const [isMyPassesOpen, setIsMyPassesOpen] = useState(false);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);

  // FX & Alerts
  const [confettiActive, setConfettiActive] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply theme class on mount
  useEffect(() => {
    setStoredTheme(theme);
  }, [theme]);

  // Keyboard shortcut listener ('/' to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const input = document.getElementById('hero-search-input');
        if (input) {
          input.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setStoredTheme(nextTheme);
    addToast('info', `Switched to ${nextTheme} mode`);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setStoredUser(user);
    addToast(
      'success',
      `Welcome, ${user.name}!`,
      user.role === 'student'
        ? `Authenticated as KIIT Student (Roll: ${user.rollNumber})`
        : `Signed in with ${user.email} (Guest Attendee)`
    );
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    addToast('info', 'Logged Out', 'You have been signed out of the KIIT portal.');
  };

  const handleToggleBookmark = (eventId: string) => {
    const updated = toggleStoredBookmark(eventId);
    setBookmarks(updated);
    const isNowBookmarked = updated.includes(eventId);
    addToast(
      'info',
      isNowBookmarked ? 'Event Bookmarked' : 'Bookmark Removed',
      isNowBookmarked ? 'Added to your favorites' : 'Removed from saved events'
    );
  };

  const handleOpenDetails = (event: EventItem) => {
    setSelectedDetailsEvent(event);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedDetailsEvent(null);
  };

  const handleOpenRegister = (event: EventItem, tierId?: string) => {
    setRegisterEvent(event);
    setInitialTierId(tierId);
    setIsRegisterOpen(true);
  };

  const handleCloseRegister = () => {
    setIsRegisterOpen(false);
    setRegisterEvent(null);
    setInitialTierId(undefined);
  };

  // Step 1: User submits registration form -> Directs to Payment Section
  const handleProceedToPayment = (formData: RegistrationFormData, tier: TicketTier) => {
    // If not signed in yet, seamlessly sign in with attendee's credentials
    if (!currentUser) {
      const loginRes = loginKiitUser(formData.email, formData.name);
      if (loginRes.success && loginRes.user) {
        setCurrentUser(loginRes.user);
        setStoredUser(loginRes.user);
      }
    }
    setIsRegisterOpen(false);
    setPendingRegistrationData(formData);
    setPendingSelectedTier(tier);
    setIsPaymentOpen(true);
  };

  // Step 2: Payment is completed and tracked -> Directs to Pass confirmation
  const handlePaymentSuccess = (paymentInfo: {
    transactionId: string;
    paymentMethod: PaymentMethod;
    totalPaid: number;
    paymentTimestamp: string;
  }) => {
    if (!registerEvent || !pendingRegistrationData || !pendingSelectedTier) return;

    const ticketId = generateTicketId();
    const { subtotal, taxAmount, totalAmount } = calculateOrderPricing(
      pendingSelectedTier.price,
      pendingRegistrationData.quantity
    );

    const newReg: Registration = {
      id: ticketId,
      eventId: registerEvent.id,
      eventTitle: registerEvent.title,
      eventDate: registerEvent.date,
      eventTime: registerEvent.startTime,
      eventVenue: registerEvent.venue,
      eventCampus: registerEvent.campusNumber,
      eventCity: registerEvent.city,
      eventImage: registerEvent.image,
      participantName: pendingRegistrationData.name.trim(),
      email: pendingRegistrationData.email.trim(),
      phone: pendingRegistrationData.phone.trim(),
      rollNumber: pendingRegistrationData.rollNumber.trim(),
      ticketTierId: pendingSelectedTier.id,
      ticketTierName: pendingSelectedTier.name,
      unitPrice: pendingSelectedTier.price,
      quantity: pendingRegistrationData.quantity,
      subtotal,
      taxAmount,
      totalAmount,
      registeredAt: new Date().toISOString(),
      status: 'confirmed',
      specialNotes: pendingRegistrationData.specialNotes.trim(),
      qrCodeData: `https://kiit.ac.in/verify/${ticketId}`,
      transactionId: paymentInfo.transactionId,
      paymentMethod: paymentInfo.paymentMethod,
      paymentStatus: 'completed',
      paymentTimestamp: paymentInfo.paymentTimestamp,
    };

    // Save registration & payment tracking in LocalStorage
    const updatedRegistrations = saveRegistration(newReg);
    setRegistrations(updatedRegistrations);

    // Update event registered count
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === registerEvent.id
          ? { ...evt, registeredCount: evt.registeredCount + pendingRegistrationData.quantity }
          : evt
      )
    );

    // Close payment modal, trigger confetti, open success pass modal
    setIsPaymentOpen(false);
    setSuccessRegistration(newReg);
    setIsSuccessOpen(true);
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 3500);

    addToast(
      'success',
      'Payment Received & Pass Generated!',
      `Txn: ${paymentInfo.transactionId} • Pass ID: ${ticketId}`
    );
  };

  const handleCancelRegistration = (regId: string) => {
    const updated = cancelRegistration(regId);
    setRegistrations(updated);
    addToast('info', 'Registration Cancelled', `Pass ${regId} has been cancelled.`);
  };

  const handleDeleteRegistration = (regId: string) => {
    const updated = deleteRegistration(regId);
    setRegistrations(updated);
    addToast('info', 'Record Deleted', 'Pass has been removed from your local history.');
  };

  const handleEventCreated = (newEvent: EventItem) => {
    saveCustomEvent(newEvent);
    setEvents([newEvent, ...events]);
    addToast('success', 'Event Published!', `"${newEvent.title}" is now live on KIIT Nexora.`);
  };

  const handleShareEvent = (event: EventItem) => {
    if (navigator.share) {
      navigator
        .share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('success', 'Link Copied', 'Event link copied to clipboard.');
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceFilter('all');
    setFormatFilter('all');
    setSortBy('date-asc');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    searchQuery.trim().length > 0 ||
    priceFilter !== 'all' ||
    formatFilter !== 'all' ||
    sortBy !== 'date-asc';

  // Filtered and sorted events
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((e) => e.category === selectedCategory);
    }

    // Search query filter (title, tagline, venue, city, description, tags, speakers)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.tagline.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)) ||
          e.speakers.some((s) => s.name.toLowerCase().includes(q))
      );
    }

    // Price filter (in INR)
    if (priceFilter === 'free') {
      result = result.filter((e) => e.basePrice === 0);
    } else if (priceFilter === 'under100') {
      result = result.filter((e) => e.basePrice > 0 && e.basePrice < 200);
    } else if (priceFilter === 'premium') {
      result = result.filter((e) => e.basePrice >= 200);
    }

    // Format filter
    if (formatFilter === 'in-person') {
      result = result.filter((e) => !e.isVirtual);
    } else if (formatFilter === 'virtual') {
      result = result.filter((e) => e.isVirtual);
    }

    // Sorting
    if (sortBy === 'date-asc') {
      result.sort((a, b) => a.date.localeCompare(b.date));
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.registeredCount - a.registeredCount);
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.basePrice - a.basePrice);
    }

    return result;
  }, [events, selectedCategory, searchQuery, priceFilter, formatFilter, sortBy]);

  // Featured spotlight event for the countdown banner (e.g. KIIT Fest 2026)
  const spotlightEvent = useMemo(() => {
    return events.find((e) => e.featured && e.trending) || events[0];
  }, [events]);



  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Confetti canvas burst */}
      <ConfettiCanvas active={confettiActive} />

      {/* Floating toast notification stack */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Top sticky Navigation Bar with student profile */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        registeredCount={registrations.filter((r) => r.status === 'confirmed').length}
        onOpenMyPasses={() => setIsMyPassesOpen(true)}
        onOpenHostEvent={() => setIsHostModalOpen(true)}
        onSearchFocus={() => {
          const input = document.getElementById('hero-search-input');
          if (input) {
            input.focus();
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onExploreClick={() => {
            const el = document.getElementById('events');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Login Area directly on the Main Page (Accessible to all personal & KIIT emails) */}
        <MainPageLoginArea
          currentUser={currentUser}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
          onOpenMyPasses={() => setIsMyPassesOpen(true)}
          registeredCount={registrations.filter((r) => r.status === 'confirmed').length}
        />

        {/* Featured Live Countdown Banner */}
        {spotlightEvent && (
          <CountdownBanner
            event={spotlightEvent}
            onRegisterClick={(evt) => handleOpenRegister(evt)}
            onViewDetails={(evt) => handleOpenDetails(evt)}
          />
        )}

        {/* Events Browsing Section */}
        <section id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span>KIIT University Campus 1 - 24 Lineup</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Explore Events in Bhubaneswar
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Discover fests, tech summits, cricket tournaments, and conferences across KIIT campuses.
              </p>
            </div>

            {/* Quick stats pill */}
            <div className="flex items-center gap-2 self-start md:self-auto px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{filteredEvents.length} Campus Events</span>
            </div>
          </div>

          {/* Interactive Filter Toolbar */}
          <div className="mb-8">
            <EventFilters
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              priceFilter={priceFilter}
              onPriceFilterChange={setPriceFilter}
              formatFilter={formatFilter}
              onFormatFilterChange={setFormatFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              totalResults={filteredEvents.length}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center flex flex-col items-center justify-center bg-white/50 dark:bg-slate-900/50">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No matching campus events found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mt-1 mb-6 leading-relaxed">
                We couldn't find any KIIT events matching your search or filters. Try clearing your
                criteria to view the full campus schedule.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isBookmarked={bookmarks.includes(event.id)}
                  onToggleBookmark={handleToggleBookmark}
                  onViewDetails={handleOpenDetails}
                  onRegister={(evt) => handleOpenRegister(evt)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('events');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenHostEvent={() => setIsHostModalOpen(true)}
        onShowToast={(title, msg) => addToast('success', title, msg)}
      />

      {/* Modals & Flow */}
      <EventDetailsModal
        event={selectedDetailsEvent}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        onRegister={(evt, tierId) => {
          handleCloseDetails();
          handleOpenRegister(evt, tierId);
        }}
        isBookmarked={selectedDetailsEvent ? bookmarks.includes(selectedDetailsEvent.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onShare={handleShareEvent}
      />

      {/* Step 1: Registration Form with Roll Number & Student info */}
      <RegistrationModal
        event={registerEvent}
        initialTierId={initialTierId}
        currentUser={currentUser}
        isOpen={isRegisterOpen}
        onClose={handleCloseRegister}
        onProceedToPayment={handleProceedToPayment}
      />

      {/* Step 2: Payment Section where payment is tracked and shown */}
      <PaymentSectionModal
        event={registerEvent}
        formData={pendingRegistrationData}
        selectedTier={pendingSelectedTier}
        isOpen={isPaymentOpen}
        onClose={() => {
          setIsPaymentOpen(false);
          setIsRegisterOpen(true); // back to form if needed
        }}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Step 3: Registration Success Pass with QR code, Txn ID, and Calendar export */}
      <RegistrationSuccessModal
        registration={successRegistration}
        isOpen={isSuccessOpen}
        onClose={() => {
          setIsSuccessOpen(false);
          setSuccessRegistration(null);
        }}
        onViewMyPasses={() => setIsMyPassesOpen(true)}
      />

      {/* My Passes & Payment Tracking Drawer */}
      <MyRegistrationsDrawer
        isOpen={isMyPassesOpen}
        onClose={() => setIsMyPassesOpen(false)}
        registrations={registrations}
        onCancelRegistration={handleCancelRegistration}
        onDeleteRegistration={handleDeleteRegistration}
        onViewPass={(reg) => {
          setIsMyPassesOpen(false);
          setSuccessRegistration(reg);
          setIsSuccessOpen(true);
        }}
        onExploreEvents={() => {
          const el = document.getElementById('events');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Host Event Modal */}
      <CreateEventModal
        isOpen={isHostModalOpen}
        onClose={() => setIsHostModalOpen(false)}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
}
