import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateTransactionId,
  validateUpiId,
  validateCardNumber,
  calculateOrderPricing,
  formatINR,
} from './payment.ts';
import { validateKiitLogin, loginKiitUser } from './auth.ts';

test('generateTransactionId creates TXN-KIIT prefix', () => {
  const txn = generateTransactionId();
  assert.match(txn, /^TXN-KIIT-2026-\d{5}$/);
});

test('validateUpiId accepts correct formats and rejects invalid', () => {
  assert.equal(validateUpiId('24155278@kiit').isValid, true);
  assert.equal(validateUpiId('ananya@okhdfcbank').isValid, true);
  assert.equal(validateUpiId('invalid-upi').isValid, false);
  assert.equal(validateUpiId('').isValid, false);
});

test('validateCardNumber verifies 16-digit card', () => {
  assert.equal(validateCardNumber('4532 8920 1829 3849').isValid, true);
  assert.equal(validateCardNumber('12345').isValid, false);
});

test('calculateOrderPricing computes totals correctly', () => {
  const { subtotal, totalAmount } = calculateOrderPricing(250, 2);
  assert.equal(subtotal, 500);
  assert.equal(totalAmount, 500);
});

test('formatINR formats currency symbols', () => {
  assert.equal(formatINR(0), 'FREE');
  assert.equal(formatINR(499), '₹499');
});

test('validateKiitLogin accepts personal emails, roll numbers, and KIIT email addresses', () => {
  assert.equal(validateKiitLogin('24155278').isValid, true);
  assert.equal(validateKiitLogin('24155278@kiit.ac.in').isValid, true);
  assert.equal(validateKiitLogin('rohan.verma@gmail.com').isValid, true);
  assert.equal(validateKiitLogin('visitor@outlook.com').isValid, true);
  assert.equal(validateKiitLogin('').isValid, false);
});

test('loginKiitUser initializes student user profile', () => {
  const res = loginKiitUser('24155278@kiit.ac.in', 'Shailja Khemani');
  assert.equal(res.success, true);
  assert.equal(res.user?.name, 'Shailja Khemani');
  assert.equal(res.user?.rollNumber, '24155278');
  assert.equal(res.user?.campus, 'Campus 3, Bhubaneswar');
  assert.equal(res.user?.role, 'student');
});

test('loginKiitUser initializes guest user profile with personal email', () => {
  const res = loginKiitUser('rohan.verma@gmail.com', 'Rohan Verma');
  assert.equal(res.success, true);
  assert.equal(res.user?.name, 'Rohan Verma');
  assert.equal(res.user?.email, 'rohan.verma@gmail.com');
  assert.equal(res.user?.role, 'guest');
});
