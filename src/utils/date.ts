export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  totalMilliseconds: number;
}

/**
 * Calculates remaining time until target event date/time.
 */
export function calculateTimeRemaining(
  targetDateStr: string,
  targetTimeStr: string = '09:00 AM',
  currentDate: Date = new Date()
): CountdownResult {
  // Parse date and time into target timestamp
  const dateParts = targetDateStr.split('-');
  if (dateParts.length !== 3) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, totalMilliseconds: 0 };
  }

  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const day = parseInt(dateParts[2], 10);

  // Parse time: "09:00 AM" or "18:00"
  let hours = 9;
  let minutes = 0;
  const timeMatch = targetTimeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (timeMatch) {
    let parsedHours = parseInt(timeMatch[1], 10);
    const parsedMinutes = parseInt(timeMatch[2], 10);
    const meridiem = timeMatch[3]?.toUpperCase();

    if (meridiem === 'PM' && parsedHours < 12) {
      parsedHours += 12;
    } else if (meridiem === 'AM' && parsedHours === 12) {
      parsedHours = 0;
    }
    hours = parsedHours;
    minutes = parsedMinutes;
  }

  const target = new Date(year, month, day, hours, minutes, 0, 0);
  const diff = target.getTime() - currentDate.getTime();

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
      totalMilliseconds: 0,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutesRemaining = Math.floor((diff / 1000 / 60) % 60);
  const secondsRemaining = Math.floor((diff / 1000) % 60);

  return {
    days,
    hours: hoursRemaining,
    minutes: minutesRemaining,
    seconds: secondsRemaining,
    isPast: false,
    totalMilliseconds: diff,
  };
}

/**
 * Formats ISO date "YYYY-MM-DD" into a friendly readable string, e.g. "Friday, Nov 20, 2026"
 */
export function formatFriendlyDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Returns a short badge label like "In 5 days", "Tomorrow", "Today", or "Past Event"
 */
export function getRelativeDateBadge(dateStr: string, currentDate: Date = new Date()): { label: string; urgent: boolean } {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return { label: 'Upcoming', urgent: false };

  const target = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: 'Past Event', urgent: false };
  } else if (diffDays === 0) {
    return { label: 'Today', urgent: true };
  } else if (diffDays === 1) {
    return { label: 'Tomorrow', urgent: true };
  } else if (diffDays <= 7) {
    return { label: `In ${diffDays} days`, urgent: true };
  } else {
    return { label: `In ${diffDays} days`, urgent: false };
  }
}

/**
 * Creates an .ics calendar invite file string for calendar export
 */
export function generateIcsCalendarFile(
  eventTitle: string,
  eventDescription: string,
  eventVenue: string,
  dateStr: string,
  startTime: string = '09:00 AM',
  endTime: string = '17:00 PM'
): string {
  const parts = dateStr.split('-');
  const year = parts[0] || '2026';
  const month = (parts[1] || '11').padStart(2, '0');
  const day = (parts[2] || '20').padStart(2, '0');

  const dtStart = `${year}${month}${day}T140000Z`;
  const dtEnd = `${year}${month}${day}T220000Z`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nexora Events//Event Ticket//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${eventTitle}`,
    `DESCRIPTION:${eventDescription.replace(/\n/g, '\\n')}`,
    `LOCATION:${eventVenue}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
