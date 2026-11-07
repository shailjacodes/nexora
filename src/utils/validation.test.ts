import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateRegistrationForm,
  generateTicketId,
} from './validation.ts';

test('validateName accepts valid person names', () => {
  assert.equal(validateName('Alex Rivera').isValid, true);
  assert.equal(validateName('Sarah O\'Connor').isValid, true);
  assert.equal(validateName('Dr. Jean-Luc').isValid, true);
});

test('validateName rejects empty or too short names', () => {
  assert.equal(validateName('').isValid, false);
  assert.equal(validateName('   ').isValid, false);
  assert.equal(validateName('A').isValid, false);
});

test('validateEmail handles correct and incorrect addresses', () => {
  assert.equal(validateEmail('alex@domain.com').isValid, true);
  assert.equal(validateEmail('test.user+tag@company.org').isValid, true);
  assert.equal(validateEmail('invalid-email').isValid, false);
  assert.equal(validateEmail('missing@tld').isValid, false);
  assert.equal(validateEmail('').isValid, false);
});

test('validatePhone requires valid digit counts', () => {
  assert.equal(validatePhone('+1 (555) 234-5678').isValid, true);
  assert.equal(validatePhone('9876543210').isValid, true);
  assert.equal(validatePhone('12345').isValid, false);
  assert.equal(validatePhone('').isValid, false);
});

test('validateRegistrationForm checks all required fields', () => {
  const invalidResult = validateRegistrationForm({
    name: '',
    email: 'bad',
    phone: '123',
    rollNumber: '',
    ticketTierId: '',
    quantity: 0,
    specialNotes: '',
    agreedToTerms: false,
  });

  assert.equal(invalidResult.isValid, false);
  assert.ok(invalidResult.errors.name);
  assert.ok(invalidResult.errors.email);
  assert.ok(invalidResult.errors.phone);
  assert.ok(invalidResult.errors.rollNumber);
  assert.ok(invalidResult.errors.ticketTierId);
  assert.ok(invalidResult.errors.quantity);
  assert.ok(invalidResult.errors.agreedToTerms);

  const validResult = validateRegistrationForm({
    name: 'Eleanor Vance',
    email: 'eleanor@example.com',
    phone: '+1 415 555 8920',
    rollNumber: '24155278',
    ticketTierId: 'vip-pass',
    quantity: 2,
    specialNotes: 'Vegetarian meals preferred',
    agreedToTerms: true,
  });

  assert.equal(validResult.isValid, true);
  assert.equal(Object.keys(validResult.errors).length, 0);

  const guestResult = validateRegistrationForm({
    name: 'Rohan Verma',
    email: 'rohan.verma@gmail.com',
    phone: '+91 98765 43210',
    rollNumber: 'External Attendee',
    ticketTierId: 'general-access',
    quantity: 1,
    specialNotes: '',
    agreedToTerms: true,
  });

  assert.equal(guestResult.isValid, true);
  assert.equal(Object.keys(guestResult.errors).length, 0);
});

test('generateTicketId creates expected NXR prefix format', () => {
  const id1 = generateTicketId();
  const id2 = generateTicketId();
  assert.match(id1, /^NXR-2026-\d{5}$/);
  assert.match(id2, /^NXR-2026-\d{5}$/);
});
