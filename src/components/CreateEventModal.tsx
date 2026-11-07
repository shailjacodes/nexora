import React, { useState } from 'react';
import { X, Sparkles, Calendar, MapPin, Tag, DollarSign, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { EventCategory, EventItem } from '../types/event';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: EventItem) => void;
}

const SAMPLE_IMAGES = [
  { label: 'Conference Hall', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Festival Stage', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Esports Arena', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Creative Studio', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80' },
];

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated,
}) => {
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<EventCategory>('Tech & AI');
  const [date, setDate] = useState('2026-12-15');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [price, setPrice] = useState('0');
  const [capacity, setCapacity] = useState('200');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(SAMPLE_IMAGES[0].url);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Event title is required.');
      return;
    }
    if (!venue.trim() || !city.trim()) {
      setError('Venue name and city are required.');
      return;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }

    const numPrice = parseFloat(price) || 0;
    const numCapacity = parseInt(capacity, 10) || 150;

    const newEvent: EventItem = {
      id: `kiit-custom-${Date.now()}`,
      title: title.trim(),
      tagline: tagline.trim() || 'A campus initiative hosted by KIIT students in Bhubaneswar.',
      description: description.trim(),
      longDescription: description.trim(),
      category,
      date,
      startTime,
      endTime: '05:00 PM',
      venue: venue.trim(),
      campusNumber: 'Campus 3',
      address: `${venue.trim()} Complex, KIIT University, Patia`,
      city: 'Bhubaneswar, Odisha',
      isVirtual: false,
      image: image || SAMPLE_IMAGES[0].url,
      featured: false,
      trending: true,
      basePrice: numPrice,
      capacity: numCapacity,
      registeredCount: 0,
      ticketTiers: [
        {
          id: `tier-custom-std-${Date.now()}`,
          name: numPrice === 0 ? 'Complimentary Student Pass' : 'General Admission Pass',
          price: numPrice,
          description: 'Full campus admission to all main sessions and exhibitions.',
          perks: ['Main stage access', 'Official digital badge', 'Networking app access'],
          remaining: numCapacity,
          maxPerOrder: 4,
        },
      ],
      speakers: [
        {
          id: `spk-host-${Date.now()}`,
          name: 'Event Organizing Committee',
          role: 'Host & Lead Curator',
          company: 'Nexora Community',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          topic: 'Welcome & Introduction Keynote',
        },
      ],
      agenda: [
        {
          id: `ag-cust-1`,
          time: `${startTime} - 11:30 AM`,
          title: 'Opening Ceremony & Welcome Address',
          description: 'Kickoff remarks, orientation, and community introductions.',
        },
        {
          id: `ag-cust-2`,
          time: '12:00 PM - 03:00 PM',
          title: 'Main Exhibition & Collaborative Sessions',
          description: 'Interactive group discussions and demonstrations.',
        },
      ],
      faqs: [
        {
          question: 'How do I check in upon arrival?',
          answer: 'Simply present your digital Nexora QR pass on your smartphone screen at the registration desk.',
        },
      ],
      tags: [category, 'Community Event', 'Live Session'],
    };

    onEventCreated(newEvent);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="host-modal-title"
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 id="host-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                Host an Event on Nexora
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Publish your event directly to the platform
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Next-Gen Web3 & AI Hackathon"
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Cultural & Music">Cultural & Music</option>
                <option value="Tech & AI">Tech & AI</option>
                <option value="Business & E-Summit">Business & E-Summit</option>
                <option value="Conferences">Conferences</option>
                <option value="Sports & KPL">Sports & KPL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Base Price (₹ INR) (0 = Free)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Event Date (YYYY-MM-DD) *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Start Time *
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="10:00 AM"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Venue Name *
              </label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Center for Innovation"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                City / State *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Boston, MA"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Short Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline what attendees will learn, experience, and achieve..."
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Preset image select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Cover Image Preset
            </label>
            <div className="grid grid-cols-4 gap-2">
              {SAMPLE_IMAGES.map((img) => (
                <div
                  key={img.label}
                  onClick={() => setImage(img.url)}
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 aspect-video transition-all ${
                    image === img.url
                      ? 'border-indigo-600 ring-2 ring-indigo-500/30'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25 active:scale-95 transition-all"
            >
              Publish Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
