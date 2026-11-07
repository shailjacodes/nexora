export type EventCategory =
  | 'All'
  | 'Tech & AI'
  | 'Cultural & Music'
  | 'Business & E-Summit'
  | 'Gaming & Esports'
  | 'Conferences'
  | 'Sports & KPL';

export interface User {
  id: string;
  name: string;
  email: string;
  rollNumber?: string;
  department: string;
  campus: string;
  role: 'student' | 'faculty' | 'guest';
}

export interface TicketTier {
  id: string;
  name: string;
  price: number; // in INR ₹
  description: string;
  perks: string[];
  remaining: number;
  maxPerOrder: number;
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  topic?: string;
}

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  description: string;
  speakerName?: string;
  stageOrRoom?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface EventItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  category: EventCategory;
  date: string; // ISO date format YYYY-MM-DD
  startTime: string;
  endTime: string;
  venue: string;
  campusNumber: string;
  address: string;
  city: string; // "Bhubaneswar, Odisha"
  isVirtual: boolean;
  image: string;
  gallery?: string[];
  featured: boolean;
  trending?: boolean;
  basePrice: number; // in INR (0 for free)
  ticketTiers: TicketTier[];
  capacity: number;
  registeredCount: number;
  speakers: Speaker[];
  agenda: AgendaItem[];
  faqs: FaqItem[];
  tags: string[];
}

export type PaymentMethod = 'upi' | 'kiit_wallet' | 'card' | 'netbanking' | 'free';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  eventCampus: string;
  eventCity: string;
  eventImage: string;
  participantName: string;
  email: string;
  phone: string;
  rollNumber?: string;
  ticketTierId: string;
  ticketTierName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number; // in INR ₹
  registeredAt: string;
  status: 'confirmed' | 'cancelled';
  specialNotes?: string;
  qrCodeData: string;

  // Payment Tracking
  transactionId: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTimestamp: string;
}

export interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  ticketTierId: string;
  quantity: number;
  specialNotes: string;
  agreedToTerms: boolean;
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  rollNumber?: string;
  ticketTierId?: string;
  quantity?: string;
  agreedToTerms?: string;
  general?: string;
}
