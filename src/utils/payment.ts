import { PaymentMethod } from '../types/event';

/**
 * Generates an authentic transaction reference ID for KIIT events.
 * Example: TXN-KIIT-2026-78942
 */
export function generateTransactionId(): string {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `TXN-KIIT-2026-${randomSuffix}`;
}

/**
 * Validates standard Indian Unified Payments Interface (UPI) VPA ID.
 * Examples: 24155278@kiit, student@okhdfcbank, name@upi
 */
export function validateUpiId(upiId: string): { isValid: boolean; error?: string } {
  const trimmed = (upiId || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'UPI ID is required (e.g. 24155278@kiit or name@okhdfcbank).' };
  }
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  if (!upiRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid UPI ID (e.g. 24155278@kiit or name@upi).' };
  }
  return { isValid: true };
}

/**
 * Validates a 16-digit debit/credit card number (RuPay, Visa, MasterCard).
 */
export function validateCardNumber(cardNumber: string): { isValid: boolean; error?: string } {
  const digits = (cardNumber || '').replace(/\D/g, '');
  if (!digits) {
    return { isValid: false, error: 'Card number is required.' };
  }
  if (digits.length < 15 || digits.length > 16) {
    return { isValid: false, error: 'Card number must be 15 or 16 digits.' };
  }
  return { isValid: true };
}

/**
 * Validates card expiry MM/YY.
 */
export function validateCardExpiry(expiry: string): { isValid: boolean; error?: string } {
  const trimmed = (expiry || '').trim();
  if (!/^(0[1-9]|1[0-2])\/?([2-9][0-9])$/.test(trimmed)) {
    return { isValid: false, error: 'Invalid expiry (MM/YY).' };
  }
  return { isValid: true };
}

/**
 * Validates 3-digit card CVV.
 */
export function validateCvv(cvv: string): { isValid: boolean; error?: string } {
  const trimmed = (cvv || '').trim();
  if (!/^\d{3,4}$/.test(trimmed)) {
    return { isValid: false, error: 'CVV must be 3 digits.' };
  }
  return { isValid: true };
}

/**
 * Calculates line items and total pricing in INR (₹).
 */
export function calculateOrderPricing(
  unitPrice: number,
  quantity: number
): { subtotal: number; taxAmount: number; totalAmount: number } {
  const subtotal = unitPrice * quantity;
  // KIIT student events have zero extra fees or subsidized tax
  const taxAmount = 0; 
  const totalAmount = subtotal + taxAmount;
  return { subtotal, taxAmount, totalAmount };
}

/**
 * Formats a number to Indian Rupee (₹) representation.
 */
export function formatINR(amount: number): string {
  if (amount === 0) return 'FREE';
  return `₹${amount.toLocaleString('en-IN')}`;
}
