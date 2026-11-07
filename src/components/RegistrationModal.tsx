import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Ticket,
  ShieldCheck,
  User as UserIcon,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle2,
  Lock,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { EventItem, FormErrors, RegistrationFormData, TicketTier, User } from '../types/event';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateRollNumber,
  validateRegistrationForm,
} from '../utils/validation';
import { formatFriendlyDate } from '../utils/date';
import { formatINR } from '../utils/payment';

interface RegistrationModalProps {
  event: EventItem | null;
  initialTierId?: string;
  currentUser: User | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedToPayment: (data: RegistrationFormData, tier: TicketTier) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  initialTierId,
  currentUser,
  isOpen,
  onClose,
  onProceedToPayment,
}) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '+91 98765 43210',
    rollNumber: currentUser?.rollNumber || '24155278',
    ticketTierId: '',
    quantity: 1,
    specialNotes: '',
    agreedToTerms: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (event) {
      const defaultTier = initialTierId
        ? event.ticketTiers.find((t) => t.id === initialTierId) || event.ticketTiers[0]
        : event.ticketTiers[0];

      setFormData((prev) => ({
        ...prev,
        name: currentUser?.name || prev.name || 'Shailja Khemani',
        email: currentUser?.email || prev.email || '24155278@kiit.ac.in',
        rollNumber: currentUser
          ? (currentUser.role === 'student' ? currentUser.rollNumber || '24155278' : 'External Attendee')
          : (prev.rollNumber || '24155278'),
        ticketTierId: defaultTier?.id || '',
        quantity: 1,
        agreedToTerms: true,
      }));
      setErrors({});
      setTouched({});
    }
  }, [event, initialTierId, currentUser]);

  if (!isOpen || !event) return null;

  const selectedTier =
    event.ticketTiers.find((t) => t.id === formData.ticketTierId) || event.ticketTiers[0];
  const totalAmount = (selectedTier?.price || 0) * formData.quantity;
  const maxAvailable = selectedTier ? Math.min(selectedTier.remaining, selectedTier.maxPerOrder) : 5;

  const handleBlur = (field: keyof RegistrationFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: keyof RegistrationFormData) => {
    const nextErrors = { ...errors };

    if (field === 'name') {
      const res = validateName(formData.name);
      if (!res.isValid) nextErrors.name = res.error;
      else delete nextErrors.name;
    } else if (field === 'email') {
      const res = validateEmail(formData.email);
      if (!res.isValid) nextErrors.email = res.error;
      else delete nextErrors.email;
    } else if (field === 'phone') {
      const res = validatePhone(formData.phone);
      if (!res.isValid) nextErrors.phone = res.error;
      else delete nextErrors.phone;
    } else if (field === 'rollNumber') {
      const res = validateRollNumber(formData.rollNumber);
      if (!res.isValid) nextErrors.rollNumber = res.error;
      else delete nextErrors.rollNumber;
    }

    setErrors(nextErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      name: true,
      email: true,
      phone: true,
      rollNumber: true,
      ticketTierId: true,
      quantity: true,
      agreedToTerms: true,
    });

    const validation = validateRegistrationForm(formData, maxAvailable);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onProceedToPayment(formData, selectedTier);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="registration-modal-title"
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 id="registration-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                Register for Event
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                KIIT University Event Pass Registration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close registration"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Event Card Summary */}
        <div className="px-6 py-3.5 bg-indigo-50/60 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/40 flex items-center gap-3">
          <img
            src={event.image}
            alt={event.title}
            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-indigo-200 dark:border-indigo-800"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              {event.title}
            </h4>
            <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
              <span>{formatFriendlyDate(event.date)}</span>
              <span>•</span>
              <span className="truncate">{event.venue}, Bhubaneswar</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5" noValidate>
          {/* Ticket Tier Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Select Ticket Tier *
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {event.ticketTiers.map((tier) => {
                const isSelected = formData.ticketTierId === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => {
                      setFormData((p) => ({ ...p, ticketTierId: tier.id }));
                      if (errors.ticketTierId) {
                        setErrors((prev) => ({ ...prev, ticketTierId: undefined }));
                      }
                    }}
                    className={`cursor-pointer p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 ring-1 ring-indigo-600 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {tier.name}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {tier.remaining} left
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {tier.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right pl-3 shrink-0">
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        {formatINR(tier.price)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.ticketTierId && (
              <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.ticketTierId}
              </p>
            )}
          </div>

          {/* Quantity Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="ticket-quantity-input" className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Number of Passes
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                (Max {maxAvailable} per student)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, quantity: Math.max(1, p.quantity - 1) }))
                  }
                  disabled={formData.quantity <= 1}
                  className="px-3.5 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors text-base font-bold"
                  aria-label="Decrease passes"
                >
                  -
                </button>
                <input
                  id="ticket-quantity-input"
                  type="number"
                  min="1"
                  max={maxAvailable}
                  value={formData.quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 1;
                    setFormData((p) => ({
                      ...p,
                      quantity: Math.max(1, Math.min(maxAvailable, val)),
                    }));
                  }}
                  className="w-14 text-center py-2 bg-transparent text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
                  aria-label="Pass quantity"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      quantity: Math.min(maxAvailable, p.quantity + 1),
                    }))
                  }
                  disabled={formData.quantity >= maxAvailable}
                  className="px-3.5 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors text-base font-bold"
                  aria-label="Increase passes"
                >
                  +
                </button>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                {selectedTier?.price === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Free student pass
                  </span>
                ) : (
                  <span>
                    Subtotal: <strong>{formatINR(totalAmount)}</strong> ({formatINR(selectedTier?.price)} × {formData.quantity})
                  </span>
                )}
              </div>
            </div>
            {errors.quantity && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.quantity}</p>
            )}
          </div>

          {/* Participant Details */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Attendee & Student Credentials
            </h4>

            {/* Roll Number Input */}
            <div className="mb-4">
              <label
                htmlFor="reg-roll"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                {formData.email.toLowerCase().includes('@kiit.ac.in') ? 'KIIT Student Roll Number *' : 'Roll Number / Attendee Type *'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                </div>
                <input
                  id="reg-roll"
                  type="text"
                  required
                  value={formData.rollNumber}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, rollNumber: e.target.value }));
                    if (touched.rollNumber) validateField('rollNumber');
                  }}
                  onBlur={() => handleBlur('rollNumber')}
                  placeholder="e.g. 24155278 or External Attendee"
                  className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                    touched.rollNumber && errors.rollNumber
                      ? 'border-rose-500 focus:ring-rose-500/30'
                      : 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500'
                  }`}
                  aria-invalid={!!(touched.rollNumber && errors.rollNumber)}
                />
              </div>
              {touched.rollNumber && errors.rollNumber && (
                <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.rollNumber}
                </p>
              )}
            </div>

            {/* Name Input */}
            <div className="mb-4">
              <label
                htmlFor="reg-full-name"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="reg-full-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, name: e.target.value }));
                    if (touched.name) validateField('name');
                  }}
                  onBlur={() => handleBlur('name')}
                  placeholder="e.g. Shailja Khemani"
                  className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                    touched.name && errors.name
                      ? 'border-rose-500 focus:ring-rose-500/30'
                      : 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500'
                  }`}
                  aria-invalid={!!(touched.name && errors.name)}
                />
              </div>
              {touched.name && errors.name && (
                <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label
                htmlFor="reg-email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Email Address (Personal or University) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, email: e.target.value }));
                    if (touched.email) validateField('email');
                  }}
                  onBlur={() => handleBlur('email')}
                  placeholder="e.g. shailja@gmail.com or 24155278@kiit.ac.in"
                  className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                    touched.email && errors.email
                      ? 'border-rose-500 focus:ring-rose-500/30'
                      : 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500'
                  }`}
                  aria-invalid={!!(touched.email && errors.email)}
                />
              </div>
              {touched.email && errors.email && (
                <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Number Input */}
            <div className="mb-4">
              <label
                htmlFor="reg-phone"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Mobile Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="reg-phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, phone: e.target.value }));
                    if (touched.phone) validateField('phone');
                  }}
                  onBlur={() => handleBlur('phone')}
                  placeholder="+91 98765 43210"
                  className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                    touched.phone && errors.phone
                      ? 'border-rose-500 focus:ring-rose-500/30'
                      : 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500'
                  }`}
                  aria-invalid={!!(touched.phone && errors.phone)}
                />
              </div>
              {touched.phone && errors.phone && (
                <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreedToTerms}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, agreedToTerms: e.target.checked }));
                  if (errors.agreedToTerms) {
                    setErrors((prev) => ({ ...prev, agreedToTerms: undefined }));
                  }
                }}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5 shrink-0"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                I confirm I will bring a valid Photo ID / Student ID card to the venue and adhere to event guidelines and code of conduct.
              </span>
            </label>
            {touched.agreedToTerms && errors.agreedToTerms && (
              <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.agreedToTerms}
              </p>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="block text-[11px] uppercase font-bold text-slate-400">
                Amount Payable
              </span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {formatINR(totalAmount)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:opacity-95 shadow-md shadow-indigo-500/25 active:scale-95 transition-all"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
