import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Clock, Users, Shield, Ticket, X, Check, Eye, Trash2 } from 'lucide-react';
import { Reservation } from '../types';

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showReceipt, setShowReceipt] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMyReservations, setShowMyReservations] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [tableType, setTableType] = useState<'standard' | 'chef-table' | 'window' | 'cellar'>('standard');
  const [specialRequests, setSpecialRequests] = useState('');

  // Time Slots
  const timeSlots = [
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  // Room Options
  const roomOptions = [
    { id: 'standard', name: 'Grand Dining Salon', desc: 'Charcoal velvets & grand chandelier ambient spacing.' },
    { id: 'chef-table', name: 'Chef’s Counter Exclusive', desc: 'Front-row view of culinary plating chemistry.' },
    { id: 'window', name: 'Skyline Window Alcove', desc: 'Overlooking pristine twinkling city lights.' },
    { id: 'cellar', name: 'The Majestic Wine Cellar', desc: 'Surrounded by 1,200 prestige vintage labels.' },
  ] as const;

  // Sync existing reservations
  useEffect(() => {
    const saved = localStorage.getItem('aurelia_reservations');
    if (saved) {
      try {
        setReservations(JSON.parse(saved));
      } catch (e) {
        // Safe fallback
      }
    }
  }, []);

  const saveReservations = (updated: Reservation[]) => {
    setReservations(updated);
    localStorage.setItem('aurelia_reservations', JSON.stringify(updated));
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !date || !time) return;

    setLoading(true);

    // Simulate luxury confirmation delay
    setTimeout(() => {
      const confirmCode = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;
      const newBooking: Reservation = {
        id: `res-${Date.now()}`,
        name,
        email,
        phone,
        date,
        time,
        guests,
        tableType,
        specialRequests,
        confirmationCode: confirmCode,
        status: 'confirmed'
      };

      const updated = [newBooking, ...reservations];
      saveReservations(updated);
      setShowReceipt(newBooking);
      setLoading(false);

      // Clean inputs
      setName('');
      setEmail('');
      setPhone('');
      setDate('');
      setTime('');
      setGuests(2);
      setTableType('standard');
      setSpecialRequests('');
    }, 1800);
  };

  const handleDeleteBooking = (id: string) => {
    const updated = reservations.filter((res) => res.id !== id);
    saveReservations(updated);
  };

  return (
    <section
      id="reservations"
      className="relative py-24 sm:py-32 w-full bg-transparent overflow-hidden border-t border-gold-500/5 text-xs text-gold-100"
    >
      <div id="res-ambient-glow" className="absolute top-1/4 right-0 w-96 h-96 bg-gold-900/[0.05] rounded-full blur-[130px] pointer-events-none" />

      <div id="reservations-container" className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Section title */}
        <div id="reservations-header" className="text-center mb-16">
          <span id="reservations-subtitle" className="text-[10px] font-mono tracking-[0.4em] text-gold-accent uppercase block mb-4">
            Securing Your Seating Accent
          </span>
          <h2 id="reservations-title" className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
            Online Table Reservations
          </h2>
          <div id="reservations-title-decor" className="flex items-center justify-center mt-6 space-x-3">
            <div id="reservations-decor-line-1" className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold-500/40" />
            <span id="reservations-decor-star" className="text-gold-accent text-xs">★</span>
            <div id="reservations-decor-line-2" className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold-500/40" />
          </div>
        </div>

        {/* Top summary panel to toggle list vs form */}
        <div id="reservations-quick-control" className="max-w-4xl mx-auto mb-8 flex justify-between items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-sm p-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold-500/60 leading-none">
            Dress Guidelines: Black Tie / Cocktail Attire Strictly Required
          </span>
          <button
            id="reservations-my-bookings-btn"
            onClick={() => setShowMyReservations(!showMyReservations)}
            className="flex items-center space-x-2 text-gold-accent underline hover:text-gold-200 cursor-pointer focus:outline-none"
          >
            <span>My Bookings ({reservations.length})</span>
          </button>
        </div>

        {/* Dynamic List modal/drawer for existing bookings */}
        <AnimatePresence>
          {showMyReservations && (
            <motion.div
              id="my-bookings-list-drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-4xl mx-auto mb-12 p-6 border border-gold-accent/45 bg-[#1a1a1a]/95 backdrop-blur-md rounded-sm"
            >
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-gold-500/20">
                <h3 className="font-serif text-base text-white uppercase tracking-widest flex items-center space-x-2">
                  <Ticket className="w-4 h-4 text-gold-accent" />
                  <span>My Active Seating Vouchers</span>
                </h3>
                <button
                  onClick={() => setShowMyReservations(false)}
                  className="font-mono text-[9px] uppercase tracking-wider text-gold-500 hover:text-gold-accent text-xs"
                >
                  Close
                </button>
              </div>

              {reservations.length === 0 ? (
                <p className="text-center text-gold-50/40 py-8 italic">No registered seating arrangements discovered.</p>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {reservations.map((res) => (
                    <div
                      key={res.id}
                      className="border border-white/10 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0A0A0A] gap-4 rounded-sm"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-white tracking-wider">{res.name}</span>
                          <span className="px-2 py-0.5 font-mono text-[8px] bg-gold-accent/10 border border-gold-accent/30 text-gold-accent">{res.confirmationCode}</span>
                        </div>
                        <div className="text-[10px] text-gold-50/50 mt-1 flex flex-wrap gap-x-4">
                          <span>Date: {res.date}</span>
                          <span>Time: {res.time}</span>
                          <span>Guests: {res.guests}</span>
                          <span className="capitalize">Room: {res.tableType}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 self-end sm:self-center">
                        <button
                          onClick={() => setShowReceipt(res)}
                          className="px-3 py-1.5 border border-gold-500/25 text-gold-accent text-[9px] uppercase tracking-wider hover:bg-gold-accent hover:text-luxury-black transition-all cursor-pointer"
                        >
                          View Ticket
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(res.id)}
                          className="p-1.5 text-red-400 border border-red-500/20 hover:bg-red-500/10 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Spinner */}
        <AnimatePresence>
          {loading && (
            <motion.div
              id="reservation-loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-luxury-black/90 backdrop-blur-sm flex flex-col items-center justify-center"
            >
              <div className="relative flex flex-col items-center">
                {/* Gold geometric loader */}
                <div className="w-16 h-16 border-2 border-gold-500/20 border-t-2 border-t-gold-accent animate-spin rounded-full mb-6" />
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold-accent text-gold-glow">
                  Allocating VIP Salon Coordinates...
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Receipt Dialogue */}
        <AnimatePresence>
          {showReceipt && (
            <motion.div
              id="reservation-ticket-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-luxury-black/95 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setShowReceipt(null)}
            >
              <motion.div
                id="receipt-panel"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="w-full max-w-md bg-[#131313] border border-gold-accent p-8 relative rounded-sm text-center box-gold-glow"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Top Corner Cross decorations */}
                <div className="absolute top-2 left-2 text-gold-accent/40 font-mono text-[10px]">+</div>
                <div className="absolute top-2 right-2 text-gold-accent/40 font-mono text-[10px]">+</div>
                <div className="absolute bottom-2 left-2 text-gold-accent/40 font-mono text-[10px]">+</div>
                <div className="absolute bottom-2 right-2 text-gold-accent/40 font-mono text-[10px]">+</div>

                {/* Star Crest */}
                <div className="mx-auto w-10 h-10 border border-gold-accent/40 flex items-center justify-center rounded-full mb-4">
                  <Check className="w-5 h-5 text-gold-accent" />
                </div>

                <span className="text-[9px] font-mono tracking-[0.3em] text-gold-500 uppercase block mb-1">
                  Table Arrangement Verified
                </span>
                <h3 className="font-serif text-2xl text-white mb-6">AURELIA VOUCHER</h3>

                {/* Receipt Line Details */}
                <div className="border-y border-dashed border-gold-500/30 py-6 my-6 text-left space-y-3 font-mono text-[11px] text-white/95">
                  <div className="flex justify-between">
                    <span className="text-gold-500/60 uppercase">PATRON:</span>
                    <span>{showReceipt.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gold-500/60 uppercase">CONFIRM KEY:</span>
                    <span className="text-gold-accent">{showReceipt.confirmationCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gold-500/60 uppercase">CALENDAR DATE:</span>
                    <span>{showReceipt.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gold-500/60 uppercase">SEATING TIME:</span>
                    <span>{showReceipt.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gold-500/60 uppercase">GUEST VOLUME:</span>
                    <span>{showReceipt.guests} Patrons</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gold-500/60 uppercase">SALON COORDINATES:</span>
                    <span className="capitalize text-gold-accent">{showReceipt.tableType}</span>
                  </div>
                  {showReceipt.specialRequests && (
                    <div className="mt-4 pt-4 border-t border-gold-500/10">
                      <span className="text-gold-500/60 uppercase block mb-1">MEMORANDUM:</span>
                      <p className="text-xs text-gold-100/70 font-sans italic font-light">&ldquo;{showReceipt.specialRequests}&rdquo;</p>
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-gold-500/65 font-mono uppercase tracking-widest leading-relaxed mb-6">
                  Please hold a valid copy of this voucher on mobile. Seating slots are strictly limited to exactly 15 minutes past priority hours.
                </p>

                <button
                  onClick={() => setShowReceipt(null)}
                  className="px-6 py-2.5 bg-gradient-to-r from-gold-600 to-gold-400 text-luxury-black text-xs font-semibold uppercase tracking-[0.2em] hover:brightness-110 shadow-lg"
                >
                  Dismiss Ticket
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Master Booking Form Column and Room Guide */}
        <div id="reservations-grid-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-5xl mx-auto">
          
          {/* Form Side (col-span-12 or lg:col-span-7) */}
          <div id="booking-form-wrapper" className="lg:col-span-7 bg-white/5 backdrop-blur-md border border-white/10 rounded-sm p-8 relative">
            <div className="absolute inset-1.5 border border-gold-500/5 pointer-events-none" />
            <h3 className="font-serif text-2xl text-white mb-6 tracking-wide text-center">Schedule a Table</h3>
            
            <form onSubmit={handleBook} className="space-y-5 relative z-10">
              
              {/* Name field */}
              <div id="form-item-name" className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-widest text-gold-500 block">Full Name *</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nicholas Sterling"
                  className="w-full bg-[#050505]/70 border border-gold-500/20 px-3 py-2.5 text-white focus:outline-none focus:border-gold-accent focus:bg-luxury-black transition-all text-xs rounded-none font-sans font-light"
                />
              </div>

              {/* Email & Phone */}
              <div id="form-item-contacts" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-gold-500 block">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sterling@vip.com"
                    className="w-full bg-[#050505]/70 border border-gold-500/20 px-3 py-2.5 text-white focus:outline-none focus:border-gold-accent focus:bg-luxury-black transition-all text-xs rounded-none font-sans font-light"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-gold-500 block">Phone Identifier *</label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 555-908-11"
                    className="w-full bg-[#050505]/70 border border-gold-500/20 px-3 py-2.5 text-white focus:outline-none focus:border-gold-accent focus:bg-luxury-black transition-all text-xs rounded-none font-sans font-light"
                  />
                </div>
              </div>

              {/* Date & Guest selections */}
              <div id="form-item-date-guests" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-gold-500 block">Reserve Date *</label>
                  <div className="relative">
                    <input
                      required
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[#050505]/70 border border-gold-500/20 px-3 py-2.5 text-white focus:outline-none focus:border-gold-accent focus:bg-luxury-black transition-all text-xs rounded-none font-sans font-light appearance-none"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-gold-500 block">Patron Volume *</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full bg-[#050505]/70 border border-gold-500/20 px-3 py-2.5 text-gold-accent font-serif focus:outline-none focus:border-gold-accent focus:bg-luxury-black transition-all text-xs rounded-none appearance-none"
                  >
                    {[...Array(8)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1} {i === 0 ? 'Patron Only' : 'Patrons'}
                      </option>
                    ))}
                    <option value={12}>Large Circle (10-12 VIPs)</option>
                  </select>
                </div>
              </div>

              {/* Table Seating/Room dropdown selection */}
              <div id="form-item-table-choice" className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-widest text-gold-500 block font-bold">Salon Coordinates Selection *</label>
                <select
                  value={tableType}
                  onChange={(e) => setTableType(e.target.value as any)}
                  className="w-full bg-[#050505]/70 border border-gold-500/20 px-3 py-2.5 text-gold-accent font-serif focus:outline-none focus:border-gold-accent focus:bg-luxury-black transition-all text-xs rounded-none appearance-none capitalize"
                >
                  <option value="standard">Grand Dining Salon</option>
                  <option value="chef-table">Chef’s Counter Exclusive (Front Row)</option>
                  <option value="window">Skyline Window Alcove</option>
                  <option value="cellar">The Majestic Wine Cellar Lounge</option>
                </select>
              </div>

              {/* Time Slots Radio Group */}
              <div id="form-item-time-slots" className="space-y-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-gold-500 block">Available Dining Slots *</label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setTime(slot)}
                      className={`py-2 text-[10px] font-mono tracking-widest transition-all rounded-none border focus:outline-none cursor-pointer ${
                        time === slot
                          ? 'border-gold-accent text-gold-accent bg-gold-500/[0.05] text-gold-glow'
                          : 'border-gold-500/10 bg-[#050505] text-gold-100/50 hover:text-gold-accent'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div id="form-item-memo" className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-widest text-gold-500 block">Gastronomic Memorandums & Allergies</label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Lobster sensitivities, celebrating priority anniversary..."
                  rows={2}
                  className="w-full bg-[#050505]/70 border border-gold-500/20 p-3 text-white focus:outline-none focus:border-gold-accent focus:bg-luxury-black transition-all text-xs rounded-none font-sans font-light"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 mt-2 bg-gradient-to-r from-gold-600 to-gold-400 text-luxury-black font-semibold uppercase tracking-[0.25em] hover:brightness-110 active:scale-98 transition-all rounded-none text-xs"
              >
                Validate Seating Appointment
              </button>
            </form>
          </div>

          {/* Guide and Terms Column (col-span-12 or lg:col-span-5) */}
          <div id="booking-guide-wrapper" className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Guide Card containing details about specific seating atmospheres */}
            <div id="room-atmosphere-guide" className="p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-sm flex-grow relative">
              <div className="absolute inset-1.5 border border-gold-500/5 pointer-events-none" />
              <h3 className="font-serif text-base text-gold-accent uppercase tracking-widest mb-6 flex items-center space-x-2">
                <Clock className="w-4.5 h-4.5 text-gold-accent/70" />
                <span>Atmospheric Coordinates Guide</span>
              </h3>

              <div className="space-y-5">
                {roomOptions.map((opt) => (
                  <div key={opt.id} className="relative pl-6 border-l border-gold-500/15">
                    <div className="absolute left-0 top-1 h-1.5 w-1.5 bg-gold-accent rotate-45 transform -translate-x-1/2" />
                    <h4 className="text-white font-serif text-[13px] tracking-wide mb-1 flex justify-between">
                      <span>{opt.name}</span>
                      {tableType === opt.id && <span className="text-gold-accent font-mono text-[8px] uppercase tracking-wider bg-gold-accent/15 px-1.5 py-0.5 rounded-none">Choice</span>}
                    </h4>
                    <p className="text-[11px] text-gold-50/50 leading-relaxed font-light">{opt.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms Accordion Card */}
            <div id="booking-security-badge" className="p-6 border border-gold-accent/20 bg-gold-500/[0.01] space-y-4">
              <div className="flex items-start space-x-3 text-gold-accent">
                <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase font-mono text-white mb-1">Authenticated Verification Hold</h4>
                  <p className="text-[10px] text-gold-50/50 leading-relaxed font-sans font-light">
                    Every priority reservation booked here is instantly allocated in our storage and tracked locally in your client cache. No pre-payments required for priority allocations. Cancellations can be carried out instantly using the portal controller above.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
