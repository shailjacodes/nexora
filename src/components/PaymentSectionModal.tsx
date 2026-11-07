import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Smartphone,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Building2,
  Receipt,
} from 'lucide-react';
import { EventItem, PaymentMethod, RegistrationFormData, TicketTier } from '../types/event';
import {
  generateTransactionId,
  calculateOrderPricing,
  formatINR,
  validateUpiId,
  validateCardNumber,
  validateCardExpiry,
  validateCvv,
} from '../utils/payment';

interface PaymentSectionModalProps {
  event: EventItem | null;
  formData: RegistrationFormData | null;
  selectedTier: TicketTier | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paymentInfo: {
    transactionId: string;
    paymentMethod: PaymentMethod;
    totalPaid: number;
    paymentTimestamp: string;
  }) => void;
}

export const PaymentSectionModal: React.FC<PaymentSectionModalProps> = ({
  event,
  formData,
  selectedTier,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('24155278@kiit');
  const [cardNumber, setCardNumber] = useState('4532 8920 1829 3849');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('892');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processingState, setProcessingState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [processingStep, setProcessingStep] = useState<string>('');

  if (!isOpen || !event || !formData || !selectedTier) return null;

  const { subtotal, taxAmount, totalAmount } = calculateOrderPricing(
    selectedTier.price,
    formData.quantity
  );

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (totalAmount > 0) {
      if (selectedMethod === 'upi') {
        const upiVal = validateUpiId(upiId);
        if (!upiVal.isValid) newErrors.upiId = upiVal.error || 'Invalid UPI ID';
      } else if (selectedMethod === 'card') {
        const cardVal = validateCardNumber(cardNumber);
        if (!cardVal.isValid) newErrors.cardNumber = cardVal.error || 'Invalid Card Number';
        const expVal = validateCardExpiry(cardExpiry);
        if (!expVal.isValid) newErrors.cardExpiry = expVal.error || 'Invalid Expiry';
        const cvvVal = validateCvv(cardCvv);
        if (!cvvVal.isValid) newErrors.cardCvv = cvvVal.error || 'Invalid CVV';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setProcessingState('processing');

    const generatedTxnId = generateTransactionId();
    const timestamp = new Date().toISOString();

    // Step 1: Connecting
    setProcessingStep('Connecting to KIIT University Gateway...');

    setTimeout(() => {
      // Step 2: Verifying
      setProcessingStep(
        selectedMethod === 'upi'
          ? `Requesting approval on UPI VPA (${upiId})...`
          : selectedMethod === 'kiit_wallet'
          ? 'Authorizing deduction from Student Smart Card...'
          : 'Verifying card authorization with 3D Secure...'
      );
    }, 200);

    setTimeout(() => {
      // Step 3: Success
      setProcessingStep('Payment Approved! Generating KIIT pass...');
      setProcessingState('success');
    }, 500);

    setTimeout(() => {
      onPaymentSuccess({
        transactionId: generatedTxnId,
        paymentMethod: totalAmount === 0 ? 'free' : selectedMethod,
        totalPaid: totalAmount,
        paymentTimestamp: timestamp,
      });
      setProcessingState('idle');
    }, 750);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 id="payment-modal-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Payment & Pass Checkout
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                KIIT University Event Gateway • Bhubaneswar
              </p>
            </div>
          </div>
          {processingState === 'idle' && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Cancel payment"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Processing State View */}
        {processingState !== 'idle' ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-5">
            {processingState === 'processing' ? (
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-indigo-600/20 border-t-indigo-600 animate-spin flex items-center justify-center" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-indigo-500" />
                </div>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center animate-in zoom-in-50">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
            )}

            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {processingState === 'processing' ? 'Processing Payment' : 'Payment Verified!'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                {processingStep}
              </p>
            </div>

            <div className="w-full max-w-xs bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  processingState === 'processing'
                    ? 'w-2/3 bg-indigo-600 animate-pulse'
                    : 'w-full bg-emerald-500'
                }`}
              />
            </div>
          </div>
        ) : (
          <form onSubmit={handlePayNow} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Order & Student Summary */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                    {event.venue} • {event.city}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {event.title}
                  </h4>
                </div>
                <span className="shrink-0 font-extrabold text-base text-slate-900 dark:text-white">
                  {formatINR(totalAmount)}
                </span>
              </div>

              <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-900/60 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[10px]">Student / Attendee</span>
                  <strong className="text-slate-900 dark:text-white">{formData.name}</strong>
                  {formData.rollNumber && (
                    <span className="block text-[11px] text-indigo-600 dark:text-indigo-400">
                      Roll: {formData.rollNumber}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Tier & Quantity</span>
                  <span>
                    {selectedTier.name} (x{formData.quantity})
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            {totalAmount > 0 ? (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2.5">
                  Select Payment Option (INR ₹)
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('upi')}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      selectedMethod === 'upi'
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 ring-1 ring-indigo-600'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">UPI</div>
                      <div className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('kiit_wallet')}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      selectedMethod === 'kiit_wallet'
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 ring-1 ring-indigo-600'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950'
                    }`}
                  >
                    <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        KIIT Card
                      </div>
                      <div className="text-[10px] text-slate-500">Student Wallet</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between col-span-2 sm:col-span-1 ${
                      selectedMethod === 'card'
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 ring-1 ring-indigo-600'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-pink-600 dark:text-pink-400 mb-2" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Card</div>
                      <div className="text-[10px] text-slate-500">RuPay, Visa, Master</div>
                    </div>
                  </button>
                </div>

                {/* UPI details */}
                {selectedMethod === 'upi' && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Scan with any UPI App or enter VPA ID
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Zero Surcharge
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="24155278@kiit or yourname@upi"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    {errors.upiId && (
                      <p className="text-xs text-rose-500 font-medium">{errors.upiId}</p>
                    )}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Approval notification will be pushed to your UPI app.
                    </p>
                  </div>
                )}

                {/* KIIT Smart Card Wallet details */}
                {selectedMethod === 'kiit_wallet' && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Linked KIIT Student Card (Roll: {formData.rollNumber || '24155278'})
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Balance: ₹2,450.00
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Amount of {formatINR(totalAmount)} will be debited from your KIIT campus account
                      balance. No external banking details required.
                    </p>
                  </div>
                )}

                {/* Card details */}
                {selectedMethod === 'card' && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Card Number (RuPay / Visa / Master)
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {errors.cardNumber && (
                        <p className="text-xs text-rose-500 mt-1">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Expiry MM/YY
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {errors.cardExpiry && (
                          <p className="text-xs text-rose-500 mt-1">{errors.cardExpiry}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {errors.cardCvv && (
                          <p className="text-xs text-rose-500 mt-1">{errors.cardCvv}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  This event is complimentary for KIIT University students. No payment is required.
                </span>
              </div>
            )}

            {/* Total & Checkout Button */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">
                  Total Payable
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {formatINR(totalAmount)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-indigo-600 to-violet-600 hover:opacity-95 shadow-md shadow-indigo-500/25 active:scale-95 transition-all"
                >
                  <span>{totalAmount === 0 ? 'Confirm Free Pass' : `Pay ${formatINR(totalAmount)}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
