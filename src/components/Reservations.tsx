import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Clock, Users, Shield, Ticket, X, Check, Eye, Trash2 } from 'lucide-react';
import { Reservation } from '../types';
import { sendGmailMessage } from '../lib/gmail';

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showReceipt, setShowReceipt] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMyReservations, setShowMyReservations] = useState(false);
  const [reportSending, setReportSending] = useState(false);
  const [reportResult, setReportResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const triggerGmailConfirmation = async (booking: Reservation) => {
    const token = localStorage.getItem('aurelia_gmail_token');
    const autoSendSetting = localStorage.getItem('aurelia_gmail_auto_send') !== 'false';
    
    if (token) {
      // 1. Send guest confirmation if active and email exists
      if (autoSendSetting && booking.email) {
        try {
          const rawSubject = localStorage.getItem('aurelia_gmail_template_subject') || 'Your Culinary Reservation Confirmed: [Code]';
          const rawBody = localStorage.getItem('aurelia_gmail_template_body') || `
            Dear [Name],<br/><br/>
            We are delighted to confirm your upcoming reservation at <strong>Aurelia (L'Elégance)</strong>.<br/><br/>
            <strong>Details of Your Culinary Journey:</strong><br/>
            <ul>
              <li><strong>Reference Confirmation Code:</strong> <span style="color:#D4AF37; font-weight:bold;">[Code]</span></li>
              <li><strong>Date:</strong> [Date]</li>
              <li><strong>Preferred Seating Hour:</strong> [Time]</li>
              <li><strong>Guest Count:</strong> [Guests] Guests</li>
            </ul><br/>
            Warm regards,<br/>The Concierge at Aurelia
          `;

          const personalize = (text: string) => {
            return text
              .replace(/\[Name\]/g, booking.name)
              .replace(/\[Code\]/g, booking.confirmationCode)
              .replace(/\[Date\]/g, booking.date)
              .replace(/\[Time\]/g, booking.time)
              .replace(/\[Guests\]/g, String(booking.guests));
          };

          const subject = personalize(rawSubject);
          const htmlBody = personalize(rawBody);

          await sendGmailMessage(token, booking.email, subject, htmlBody);
          console.log(`Automated confirmation email successfully dispatched to ${booking.email}`);
        } catch (err) {
          console.error('Failed to dispatch automated confirmation email via connected Gmail account:', err);
        }
      }

      // 2. ALWAYS dispatch details to the restaurant owner at 7411jawed@gmail.com
      try {
        const ownerEmail = '7411jawed@gmail.com';
        const ownerSubject = `[Aurelia Booking] ${booking.name} Seating Order Verified ([Code])`;
        const ownerBody = `
          <div style="font-family: sans-serif; background-color: #0c0c0c; color: #f5f5f5; padding: 30px; border: 1px solid #D4AF37; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
            <div style="text-align: center; border-bottom: 1px solid rgba(212, 175, 55, 0.2); padding-bottom: 20px; margin-bottom: 20px;">
              <span style="color: #D4AF37; font-family: monospace; font-size: 10px; letter-spacing: 3px; text-transform: uppercase;">Aurelia Restaurant Concierge Inbox</span>
              <h2 style="font-family: serif; color: #ffffff; font-weight: 300; margin-top: 5px; margin-bottom: 0; font-size: 20px;">New Reservation Booked</h2>
            </div>
            
            <p style="font-size: 13px; color: #cccccc; margin-bottom: 20px;">
              A brand new premium dining coordinate assignment has been created under your Gmail workspace connection:
            </p>

            <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #dddddd; text-align: left;">
              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                <td style="padding: 10px 0; color: #D4AF37; font-family: monospace; width: 40%">PATRON NAME:</td>
                <td style="padding: 10px 0; font-weight: bold; color: #ffffff">${booking.name}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                <td style="padding: 10px 0; color: #D4AF37; font-family: monospace;">CONFIRM KEY:</td>
                <td style="padding: 10px 0; font-weight: bold; color: #D4AF37;">${booking.confirmationCode}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                <td style="padding: 10px 0; color: #D4AF37; font-family: monospace;">EMAIL PATH:</td>
                <td style="padding: 10px 0;"><a href="mailto:${booking.email}" style="color: #D4AF37; text-decoration: none;">${booking.email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                <td style="padding: 10px 0; color: #D4AF37; font-family: monospace;">PHONE:</td>
                <td style="padding: 10px 0; color: #ffffff;">${booking.phone}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                <td style="padding: 10px 0; color: #D4AF37; font-family: monospace;">CALENDAR DATE:</td>
                <td style="padding: 10px 0; color: #ffffff;">${booking.date}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                <td style="padding: 10px 0; color: #D4AF37; font-family: monospace;">SEATING TIME:</td>
                <td style="padding: 10px 0; color: #ffffff;">${booking.time}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                <td style="padding: 10px 0; color: #D4AF37; font-family: monospace;">GUEST VOLUME:</td>
                <td style="padding: 10px 0; color: #ffffff;">${booking.guests} Guests</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                <td style="padding: 10px 0; color: #D4AF37; font-family: monospace;">SALON AREA:</td>
                <td style="padding: 10px 0; color: #ffffff; text-transform: capitalize;">${booking.tableType}</td>
              </tr>
              ${booking.specialRequests ? `
              <tr>
                <td colspan="2" style="padding: 15px 0 0 0;">
                  <span style="color: #D4AF37; font-family: monospace; display: block; margin-bottom: 5px;">SPECIAL MEMORANDUMS:</span>
                  <p style="font-style: italic; color: #aaaaaa; margin: 0; background-color: rgba(255,255,255,0.02); padding: 10px; border-left: 2px solid #D4AF37;">&ldquo;${booking.specialRequests}&rdquo;</p>
                </td>
              </tr>` : ''}
            </table>
            
            <div style="margin-top: 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 15px;">
              <p style="font-size: 10px; color: #666666; margin: 0; font-family: monospace;">Automated routing alert delivered via your OAuth credential link.</p>
            </div>
          </div>
        `;

        await sendGmailMessage(token, ownerEmail, ownerSubject, ownerBody);
        console.log(`Alert copy of reservation details dispatched to owner at ${ownerEmail}`);
      } catch (adminErr) {
        console.error('Failed to dispatch booking notification alert copy to owner:', adminErr);
      }
    }
  };

  const emailReservationsReport = async () => {
    const token = localStorage.getItem('aurelia_gmail_token');
    if (!token) {
      setReportResult({
        type: 'error',
        text: 'Google account is not linked. Please connect your Gmail under the "Gmail" tab first.'
      });
      return;
    }

    setReportSending(true);
    setReportResult(null);

    try {
      const recipient = '7411jawed@gmail.com';
      const subject = `Aurelia Active Reservation Logs (${reservations.length} Bookings) - Manifest Report`;
      
      let rowsHtml = '';
      reservations.forEach((res) => {
        rowsHtml += `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 12px 10px; color: #ffffff; font-weight: bold;">${res.name}</td>
            <td style="padding: 12px 10px; color: #D4AF37; font-family: monospace;">${res.confirmationCode}</td>
            <td style="padding: 12px 10px;">${res.date} at ${res.time}</td>
            <td style="padding: 12px 10px;">${res.guests} Pax</td>
            <td style="padding: 12px 10px; text-transform: capitalize; color: #D4AF37;">${res.tableType}</td>
            <td style="padding: 12px 10px; font-size: 11px;">
              <div>${res.email}</div>
              <div style="color: #888;">${res.phone}</div>
            </td>
            <td style="padding: 12px 10px; font-style: italic; color: #aaa; font-size: 11px;">${res.specialRequests || '-'}</td>
          </tr>
        `;
      });

      const bodyHtml = `
        <div style="font-family: sans-serif; background-color: #0c0c0c; color: #f5f5f5; padding: 30px; border: 1px solid #D4AF37; max-width: 900px; margin: 0 auto; box-shadow: 0 4px 15px rgba(0,0,0,0.6);">
          <div style="text-align: center; border-bottom: 1px solid rgba(212, 175, 55, 0.25); padding-bottom: 25px; margin-bottom: 25px;">
            <span style="color: #D4AF37; font-family: monospace; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; display: block; margin-bottom: 5px;">Aurelia Restaurant - Grand Salon Lounge</span>
            <h2 style="font-family: serif; color: #ffffff; font-weight: 300; margin: 0; font-size: 24px;">Active Seating Manifest</h2>
          </div>

          <p style="font-size: 13px; color: #cccccc; margin-bottom: 20px; line-height: 1.6;">
            The connected Concierge workspace database has registered a total of <strong>${reservations.length} active booking(s)</strong>. Here is the compiled seating master log:
          </p>

          <table style="width: 100%; border-collapse: collapse; font-size: 12px; color: #dddddd; text-align: left; border: 1px solid rgba(212,175,55,0.1);">
            <thead>
              <tr style="background-color: rgba(212, 175, 55, 0.1); border-bottom: 2px solid #D4AF37; color: #D4AF37; font-family: monospace; text-transform: uppercase;">
                <th style="padding: 10px;">Patron</th>
                <th style="padding: 10px;">Confirm Code</th>
                <th style="padding: 10px;">Schedule</th>
                <th style="padding: 10px;">Pax</th>
                <th style="padding: 10px;">Salon Coordinate</th>
                <th style="padding: 10px;">Communication</th>
                <th style="padding: 10px;">Memorandum</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml || '<tr><td colspan="7" style="padding: 20px; text-align: center; color: #666; font-style: italic;">No active table reservations registered.</td></tr>'}
            </tbody>
          </table>

          <div style="margin-top: 40px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 20px; color: #666666; font-size: 10px; font-family: monospace;">
            <p style="margin: 0 0 5px 0;">This report was dispatched from user session client at local timestamp: ${new Date().toLocaleString()}</p>
            <p style="margin: 0;">Aurelia Digital Maitre'D Communications Dashboard</p>
          </div>
        </div>
      `;

      await sendGmailMessage(token, recipient, subject, bodyHtml);
      setReportResult({
        type: 'success',
        text: `The active manifest list has been compiled and emailed successfully to your Gmail: ${recipient}`
      });
      setTimeout(() => setReportResult(null), 8000);
    } catch (e: any) {
      setReportResult({
        type: 'error',
        text: `Failed to dispatch report copy: ${e?.message || 'Unexpected API dispatch error.'}`
      });
    } finally {
      setReportSending(false);
    }
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
      
      // Auto-trigger Gmail confirmation mail if connected
      triggerGmailConfirmation(newBooking);

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

              {/* Owner Gmail Manifest Report Dispatch Bar */}
              <div id="manifest-report-dispatch" className="mb-6 bg-gold-900/10 border border-gold-accent/20 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-left">
                <div>
                  <h4 className="font-serif text-[12px] text-white tracking-wide">Deliver Seating Manifest to Gmail</h4>
                  <p className="text-[10px] text-gold-100/50 mt-0.5 font-sans font-light">
                    Dispatch the complete list of all active seating voucher arrangements directly to your restaurant inbox: <strong className="text-gold-accent">7411jawed@gmail.com</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={emailReservationsReport}
                  disabled={reportSending || reservations.length === 0}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-[#b8952d] text-luxury-black font-semibold text-[10px] uppercase tracking-widest transition-all cursor-pointer disabled:opacity-40 whitespace-nowrap rounded-none font-mono"
                >
                  {reportSending ? 'Compiling & Sending...' : 'Dispatch List Report'}
                </button>
              </div>

              {/* Status Report Result Alerts */}
              <AnimatePresence>
                {reportResult && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-3.5 mb-6 text-[11px] border font-sans text-left ${reportResult.type === 'success' ? 'bg-gold-accent/10 border-gold-accent/40 text-gold-accent' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}
                  >
                    {reportResult.text}
                  </motion.div>
                )}
              </AnimatePresence>

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
