import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTimeRemaining,
  formatFriendlyDate,
  getRelativeDateBadge,
  generateIcsCalendarFile,
} from './date.ts';

test('calculateTimeRemaining returns correct breakdown for future date', () => {
  const fakeNow = new Date('2026-11-07T12:00:00Z');
  const result = calculateTimeRemaining('2026-11-20', '09:00 AM', fakeNow);

  assert.equal(result.isPast, false);
  assert.ok(result.days >= 12 && result.days <= 13);
});

test('calculateTimeRemaining flags past events', () => {
  const fakeNow = new Date('2026-11-07T12:00:00Z');
  const result = calculateTimeRemaining('2025-01-01', '09:00 AM', fakeNow);

  assert.equal(result.isPast, true);
  assert.equal(result.days, 0);
  assert.equal(result.seconds, 0);
});

test('formatFriendlyDate produces clean format', () => {
  const formatted = formatFriendlyDate('2026-11-20');
  assert.ok(formatted.includes('Nov'));
  assert.ok(formatted.includes('20'));
  assert.ok(formatted.includes('2026'));
});

test('getRelativeDateBadge labels today and future days', () => {
  const fakeNow = new Date(2026, 10, 7); // Nov 7, 2026
  assert.equal(getRelativeDateBadge('2026-11-07', fakeNow).label, 'Today');
  assert.equal(getRelativeDateBadge('2026-11-08', fakeNow).label, 'Tomorrow');
  assert.equal(getRelativeDateBadge('2026-11-12', fakeNow).label, 'In 5 days');
  assert.equal(getRelativeDateBadge('2026-11-01', fakeNow).label, 'Past Event');
});

test('generateIcsCalendarFile outputs RFC-compliant VCALENDAR', () => {
  const ics = generateIcsCalendarFile(
    'Nexora Summit',
    'Premier tech summit',
    'San Francisco Dome',
    '2026-11-20'
  );
  assert.ok(ics.includes('BEGIN:VCALENDAR'));
  assert.ok(ics.includes('SUMMARY:Nexora Summit'));
  assert.ok(ics.includes('LOCATION:San Francisco Dome'));
  assert.ok(ics.includes('END:VCALENDAR'));
});
