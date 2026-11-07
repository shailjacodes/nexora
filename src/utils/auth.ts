import { User } from '../types/event';

const AUTH_STORAGE_KEY = 'nexora_kiit_auth_user_v1';

export const DEFAULT_KIIT_USER: User = {
  id: 'usr-kiit-24155278',
  name: 'Shailja Khemani',
  email: '24155278@kiit.ac.in',
  rollNumber: '24155278',
  department: 'School of Computer Engineering (CSE)',
  campus: 'Campus 3, Bhubaneswar',
  role: 'student',
};

export const DEFAULT_GUEST_USER: User = {
  id: 'usr-guest-rohan',
  name: 'Rohan Verma',
  email: 'rohan.verma@gmail.com',
  rollNumber: 'External Visitor',
  department: 'General Attendee & Guest',
  campus: 'Bhubaneswar Campus Visitor',
  role: 'guest',
};

export function getStoredUser(): User | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as User;
    if (user && (user.name === 'Ananya Patnaik' || user.rollNumber === '24155278')) {
      user.name = 'Shailja Khemani';
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
    return user;
  } catch (e) {
    return null;
  }
}

export function setStoredUser(user: User | null): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {
    // ignore in tests
  }
}

export function validateKiitLogin(
  identifier: string,
  password?: string
): { isValid: boolean; error?: string } {
  const trimmed = (identifier || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Please enter your Email (personal or KIIT) or Roll Number.' };
  }

  // Accepts personal emails (e.g. gmail.com), institutional emails (@kiit.ac.in), or numeric roll numbers
  const isEmail = trimmed.includes('@');
  if (isEmail) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      return { isValid: false, error: 'Please enter a valid email address (e.g. shailja@gmail.com or 24155278@kiit.ac.in).' };
    }
  } else {
    // Check if numeric roll number
    if (!/^\d{6,12}$/.test(trimmed)) {
      return { isValid: false, error: 'Roll number must be between 6 and 12 digits (or enter any email address).' };
    }
  }

  if (password !== undefined && password.length > 0 && password.length < 4) {
    return { isValid: false, error: 'Password must be at least 4 characters.' };
  }

  return { isValid: true };
}

export function loginKiitUser(
  identifier: string,
  name?: string
): { success: boolean; user?: User; error?: string } {
  const validation = validateKiitLogin(identifier);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  const trimmed = identifier.trim();
  const isEmail = trimmed.includes('@');
  const isKiitEmail = isEmail && trimmed.toLowerCase().endsWith('@kiit.ac.in');

  let rollNumber = 'External Visitor';
  let email = '';
  let role: 'student' | 'faculty' | 'guest' = 'guest';
  let department = 'General Public / External Delegate';
  let campus = 'Bhubaneswar Event Visitor';

  if (isEmail) {
    email = trimmed;
    if (isKiitEmail) {
      role = 'student';
      department = 'School of Computer Engineering (CSE)';
      campus = 'Campus 3, Bhubaneswar';
      const matchRoll = trimmed.match(/^(\d+)/);
      rollNumber = matchRoll ? matchRoll[1] : '24155278';
    } else {
      // Personal email login (Gmail, Yahoo, Outlook, etc.)
      role = 'guest';
      rollNumber = 'External Attendee';
      department = 'General Attendee';
      campus = 'Bhubaneswar Campus Visitor';
    }
  } else {
    // Numeric Roll number login
    rollNumber = trimmed;
    email = `${trimmed}@kiit.ac.in`;
    role = 'student';
    department = 'School of Computer Engineering (CSE)';
    campus = 'Campus 3, Bhubaneswar';
  }

  let displayName = name?.trim();
  if (!displayName) {
    if (rollNumber === '24155278' || email === '24155278@kiit.ac.in') {
      displayName = 'Shailja Khemani';
    } else if (isEmail) {
      const prefix = email.split('@')[0].replace(/[._-]/g, ' ');
      displayName = prefix.replace(/\b\w/g, (c) => c.toUpperCase());
    } else {
      displayName = `KIITian (${rollNumber})`;
    }
  }

  const user: User = {
    id: `usr-${role}-${Date.now().toString(36)}`,
    name: displayName,
    email,
    rollNumber,
    department,
    campus,
    role,
  };

  setStoredUser(user);
  return { success: true, user };
}

export function logoutUser(): void {
  setStoredUser(null);
}
