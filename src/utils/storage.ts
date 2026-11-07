import { EventItem, Registration } from '../types/event';

const REGISTRATIONS_KEY = 'nexora_user_registrations_v1';
const BOOKMARKS_KEY = 'nexora_bookmarked_events_v1';
const THEME_KEY = 'nexora_theme_preference_v1';
const CUSTOM_EVENTS_KEY = 'nexora_custom_events_v1';

export function getStoredRegistrations(): Registration[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = localStorage.getItem(REGISTRATIONS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as Registration[];
    let migrated = false;
    const updated = list.map((r) => {
      if (r.participantName === 'Ananya Patnaik' || (r.rollNumber === '24155278' && r.participantName !== 'Shailja Khemani')) {
        migrated = true;
        return { ...r, participantName: 'Shailja Khemani' };
      }
      return r;
    });
    if (migrated) {
      localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(updated));
    }
    return updated;
  } catch (e) {
    console.error('Failed to read registrations from localStorage', e);
    return [];
  }
}

export function saveRegistration(reg: Registration): Registration[] {
  try {
    const list = getStoredRegistrations();
    const updated = [reg, ...list];
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save registration', e);
    return [];
  }
}

export function cancelRegistration(registrationId: string): Registration[] {
  try {
    const list = getStoredRegistrations();
    const updated = list.map((item) =>
      item.id === registrationId ? { ...item, status: 'cancelled' as const } : item
    );
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to cancel registration', e);
    return [];
  }
}

export function deleteRegistration(registrationId: string): Registration[] {
  try {
    const list = getStoredRegistrations();
    const updated = list.filter((item) => item.id !== registrationId);
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete registration', e);
    return [];
  }
}

export function getStoredBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch (e) {
    return [];
  }
}

export function toggleStoredBookmark(eventId: string): string[] {
  try {
    const list = getStoredBookmarks();
    const exists = list.includes(eventId);
    const updated = exists ? list.filter((id) => id !== eventId) : [...list, eventId];
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

export function getStoredTheme(): 'dark' | 'light' {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
  } catch (e) {
    // fallback
  }
  return 'dark'; // Dark mode is default sleek aesthetic for Nexora
}

export function setStoredTheme(theme: 'dark' | 'light'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-theme', 'dark');
        root.style.colorScheme = 'dark';
        if (document.body) {
          document.body.classList.add('dark');
          document.body.classList.remove('light');
        }
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        root.setAttribute('data-theme', 'light');
        root.style.colorScheme = 'light';
        if (document.body) {
          document.body.classList.remove('dark');
          document.body.classList.add('light');
        }
      }
    }
  } catch (e) {
    console.error('Failed to save theme preference', e);
  }
}

export function getStoredCustomEvents(): EventItem[] {
  try {
    const raw = localStorage.getItem(CUSTOM_EVENTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as EventItem[];
  } catch (e) {
    return [];
  }
}

export function saveCustomEvent(event: EventItem): EventItem[] {
  try {
    const list = getStoredCustomEvents();
    const updated = [event, ...list];
    localStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save custom event', e);
    return [];
  }
}
