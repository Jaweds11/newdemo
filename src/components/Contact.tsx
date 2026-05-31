import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Mail, Clock, MapPin, Compass, Send, Check } from 'lucide-react';

export default function Contact() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }, 1200);
  };

  return (
    <section
      id="contact"
      className="relative py-24 sm:py-32 w-full bg-transparent overflow-hidden border-t border-gold-500/5 text-xs text-gold-100"
    >
      <div id="contact-ambient-glow" className="absolute top-1/3 left-0 w-96 h-96 bg-gold-900/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <div id="contact-container" className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Section title */}
        <div id="contact-header" className="text-center mb-16 sm:mb-24">
          <span id="contact-subtitle" className="text-[10px] font-mono tracking-[0.4em] text-gold-accent uppercase block mb-4">
            Direct Concierge Access
          </span>
          <h2 id="contact-title" className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
            Connect & Enquire
          </h2>
          <div id="contact-title-decor" className="flex items-center justify-center mt-6 space-x-3">
            <div id="contact-decor-line-1" className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold-500/40" />
            <span id="contact-decor-star" className="text-gold-accent text-xs">★</span>
            <div id="contact-decor-line-2" className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold-500/40" />
          </div>
        </div>

        {/* Form and Map Grid (12 Columns) */}
        <div id="contact-grid-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start max-w-5xl mx-auto">
          
          {/* Info Side (Column span: lg:col-span-4) */}
          <div id="contact-details-side" className="lg:col-span-4 space-y-8 flex flex-col justify-between h-full">
            
            {/* Quick Contact Info Blobs */}
            <div className="space-y-6">
              <h3 className="font-serif text-lg text-white mb-6 uppercase tracking-widest pl-3 border-l-2 border-gold-accent">
                Executive Offices
              </h3>

              {/* Location */}
              <div className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 text-gold-accent/70 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-mono text-[9px] uppercase tracking-wider text-gold-500 mb-1">Our Location</h4>
                  <p className="text-xs text-white/90 leading-relaxed font-light">
                    Aurelia Grand Salon <br />
                    17 Rue de la Paix, <br />
                    75002 Paris, France
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <Phone className="w-5 h-5 text-gold-accent/70 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-mono text-[9px] uppercase tracking-wider text-gold-500 mb-1">Phone Identifier</h4>
                  <p className="text-xs text-white/90 font-light tracking-wide hover:text-gold-accent transition-colors">
                    <a href="tel:+33142273456">+33 (1) 42 27 34 56</a>
                  </p>
                  <p className="text-[10px] text-gold-500/50 mt-1">Direct wire to Maitre D'</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <Mail className="w-5 h-5 text-gold-accent/70 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-mono text-[9px] uppercase tracking-wider text-gold-500 mb-1">Electronic Mail</h4>
                  <p className="text-xs text-white/90 font-light hover:text-gold-accent transition-colors">
                    <a href="mailto:concierge@aurelia-dining.com">concierge@aurelia-dining.com</a>
                  </p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start space-x-4">
                <Clock className="w-5 h-5 text-gold-accent/70 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-mono text-[9px] uppercase tracking-wider text-gold-500 mb-1">Dining Schedules</h4>
                  <p className="text-xs text-white/90 leading-relaxed font-light">
                    <span className="text-white">Daily Salon:</span> 18:00 – 23:30 <br />
                    <span className="text-white">Kitchen Closes:</span> 22:30 <br />
                    <span className="text-white animate-pulse">Sunday Gala:</span> 12:00 – 16:00
                  </p>
                </div>
              </div>
            </div>

            {/* Simulated Luxury Black Map Segment */}
            <div id="simulated-map" className="relative h-44 border border-white/10 bg-[#131313] overflow-hidden group box-gold-glow rounded-sm">
              <div className="absolute inset-1 border border-gold-500/5 pointer-events-none" />
              {/* Custom Dark Grid Pattern matching maps */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#c5a880 1px, transparent 1px), linear-gradient(90deg, #c5a880 1px, transparent 1px)', bgSize: '20px 20px' }}></div>
              
              {/* Gold vectors drawing river or block */}
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gold-500/10 transform rotate-12 scale-x-110" />
              <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-gold-500/10 transform rotate-45 scale-y-110" />
              
              {/* Map pin with radar pulse */}
              <div className="absolute top-1/2 left-[45%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="absolute h-8 w-8 rounded-full bg-gold-accent/20 animate-ping" />
                <div className="h-3 w-3 rounded-full bg-gold-accent border border-white z-10" />
                <div className="bg-luxury-black/90 border border-gold-accent/40 text-[8px] font-mono tracking-widest text-[#d4af37] px-1.5 py-0.5 uppercase mt-1.5 rounded-none block">
                  Aurelia HQ
                </div>
              </div>
              <div className="absolute bottom-2 left-2 text-[8px] font-mono text-gold-500/30 uppercase tracking-widest">Simulated Coordinates</div>
            </div>

          </div>

          {/* Form Side (Column span: lg:col-span-8) */}
          <div id="contact-form-side" className="lg:col-span-8 bg-white/5 backdrop-blur-md border border-white/10 p-8 relative box-gold-glow rounded-sm">
            <div className="absolute inset-1.5 border border-gold-500/5 pointer-events-none" />
            
            <h3 className="font-serif text-xl sm:text-2xl text-white mb-6 text-center">Inquiry Register</h3>

            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 border border-gold-accent/40 bg-gold-500/[0.04] text-gold-accent text-center font-mono text-[10px] uppercase tracking-wider flex items-center justify-center space-x-2"
                >
                  <Check className="w-3.5 h-3.5 text-gold-accent" />
                  <span>Message Sent Successfully. Our Sommelier concierge will contact you shortly.</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-gold-500 block">Patron Moniker *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Lord Byron"
                    className="w-full bg-[#0A0A0A] border border-white/10 px-3 py-2.5 text-white focus:outline-none focus:border-gold-accent focus:bg-[#0A0A0A] transition-colors rounded-none font-sans font-light"
                  />
                </div>
                {/* Email address */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-gold-500 block">Electronic Inbox *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="e.g. byron@estate.org"
                    className="w-full bg-[#0A0A0A] border border-white/10 px-3 py-2.5 text-white focus:outline-none focus:border-gold-accent focus:bg-[#0A0A0A] transition-colors rounded-none font-sans font-light"
                  />
                </div>
              </div>

              {/* Inquiry Message */}
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-widest text-gold-500 block">Inquiry Specification *</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  placeholder="Detail your request for buyout events, wine acquisitions, or private seating..."
                  rows={5}
                  className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-white focus:outline-none focus:border-gold-accent focus:bg-[#0A0A0A] transition-colors rounded-none font-sans font-light"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-400 text-luxury-black font-semibold uppercase tracking-[0.2em] hover:brightness-110 active:scale-98 transition-all rounded-none flex items-center justify-center space-x-2 text-[10px] sm:text-xs cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-luxury-black border-t-transparent animate-spin rounded-full" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-luxury-black" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
