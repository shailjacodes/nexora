import { FormErrors, RegistrationFormData } from '../types/event';

/**
 * Validates a participant's full name.
 * Must be at least 2 characters long and contain alphabetic characters.
 */
export function validateName(name: string): { isValid: boolean; error?: string } {
  const trimmed = (name || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Full name is required.' };
  }
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters.' };
  }
  if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
    return { isValid: false, error: 'Name contains invalid characters.' };
  }
  return { isValid: true };
}

/**
 * Validates an email address against standard RFC-compliant pattern.
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const trimmed = (email || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Email address is required.' };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address (e.g. alex@example.com).' };
  }
  return { isValid: true };
}

/**
 * Validates a telephone number.
 * Must contain at least 10 digits and optional formatting (+, -, (), spaces).
 */
export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  const trimmed = (phone || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Phone number is required.' };
  }
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.length < 10) {
    return { isValid: false, error: 'Phone number must contain at least 10 digits.' };
  }
  if (digitsOnly.length > 15) {
    return { isValid: false, error: 'Phone number is too long (max 15 digits).' };
  }
  return { isValid: true };
}

/**
 * Validates a student roll number (e.g. 24155278) or external attendee identifier.
 */
export function validateRollNumber(roll: string, isRequired: boolean = true): { isValid: boolean; error?: string } {
  const trimmed = (roll || '').trim();
  if (!trimmed) {
    if (!isRequired) return { isValid: true };
    return { isValid: false, error: 'Roll number or "External" is required.' };
  }
  // Allow "External", "External Attendee", "N/A", "Guest", or valid alphanumeric roll numbers
  if (/^(N\/A|Guest|External|External Attendee|Visitor|None)$/i.test(trimmed)) {
    return { isValid: true };
  }
  if (!/^[a-zA-Z0-9\s/-]{2,20}$/.test(trimmed)) {
    return { isValid: false, error: 'Enter a valid Roll number or type "External".' };
  }
  return { isValid: true };
}

/**
 * Validates the complete registration form.
 */
export function validateRegistrationForm(
  data: RegistrationFormData,
  maxAvailable: number = 10
): { isValid: boolean; errors: FormErrors } {
  const errors: FormErrors = {};

  const nameResult = validateName(data.name);
  if (!nameResult.isValid) errors.name = nameResult.error;

  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) errors.email = emailResult.error;

  const phoneResult = validatePhone(data.phone);
  if (!phoneResult.isValid) errors.phone = phoneResult.error;

  // Roll number or External Attendee indicator is required
  const rollResult = validateRollNumber(data.rollNumber || '', true);
  if (!rollResult.isValid) errors.rollNumber = rollResult.error;

  if (!data.ticketTierId) {
    errors.ticketTierId = 'Please select a ticket tier.';
  }

  if (!data.quantity || data.quantity < 1) {
    errors.quantity = 'Quantity must be at least 1.';
  } else if (data.quantity > maxAvailable) {
    errors.quantity = `Maximum available for this tier is ${maxAvailable}.`;
  }

  if (!data.agreedToTerms) {
    errors.agreedToTerms = 'You must agree to the KIIT University Event Terms & Code of Conduct.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generates a unique, professional registration identifier.
 * Example: NXR-2026-94812
 */
export function generateTicketId(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `NXR-2026-${randomNum}`;
}
