import React, { useState } from 'react';
import { Mail, Instagram, Facebook, ArrowUp, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Save in storage or display success
    localStorage.setItem('aurelia_newsletter_subscriber', email);
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const socialLinks = [
    { icon: <Instagram className="w-4 h-4" />, href: 'https://instagram.com/aureliadining' },
    { icon: <Facebook className="w-4 h-4" />, href: 'https://facebook.com/aureliadining' }
  ];

  return (
    <footer
      id="footer"
      className="relative bg-transparent border-t border-gold-500/10 pt-16 pb-8 text-xs text-gold-100/60 overflow-hidden"
    >
      <div id="footer-container" className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Main Footer layout (Grid of 4 Columns) */}
        <div id="footer-grid" className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-16">
          
          {/* Column 1: Brand Pitch (col-span-4) */}
          <div id="footer-col-brand" className="md:col-span-4 space-y-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 group cursor-pointer text-left focus:outline-none"
            >
              <div className="flex flex-col items-start leading-none">
                <span className="text-gold-accent font-serif text-lg tracking-widest font-bold">
                  A U R E L I A
                </span>
                <span className="text-[8px] font-mono tracking-[0.35em] text-gold-500/50 uppercase">
                  Fine Dining • Excellence
                </span>
              </div>
            </button>
            <p className="text-xs font-light leading-relaxed max-w-sm">
              An award-winning Michelin-star sanctuary blending advanced flavor chemistry with breathtaking visual ambiance. Experience dining as spatial theater.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-none border border-gold-500/15 flex items-center justify-center hover:border-gold-accent hover:text-gold-accent transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation (col-span-3) */}
          <div id="footer-col-nav" className="md:col-span-3 space-y-4">
            <h4 className="font-serif text-white uppercase tracking-widest text-[11px]">Explorations</h4>
            <ul className="space-y-2.5 font-sans font-light text-[11px]">
              {['about', 'menu', 'why-us', 'gallery', 'reviews', 'reservations', 'contact'].map((sec) => (
                <li key={sec}>
                  <button
                    onClick={() => onNavigate(sec)}
                    className="hover:text-gold-accent uppercase tracking-wider capitalize transition-colors duration-300 cursor-pointer focus:outline-none text-left"
                  >
                    {sec.replace('-', ' ')}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact quick facts (col-span-2) */}
          <div id="footer-col-details" className="md:col-span-2 space-y-4">
            <h4 className="font-serif text-white uppercase tracking-widest text-[11px]">Headquarters</h4>
            <p className="font-sans font-light leading-relaxed text-[11px]">
              17 Rue de la Paix <br />
              75002 Paris, France <br />
              <span className="text-[10px] text-gold-500/50">+33 (1) 42 27 34 56</span>
            </p>
          </div>

          {/* Column 4: Newsletter registry (col-span-3) */}
          <div id="footer-col-newsletter" className="md:col-span-3 space-y-4">
            <h4 className="font-serif text-white uppercase tracking-widest text-[11px]">The Gazette</h4>
            <p className="text-[11px] font-sans font-light leading-relaxed text-gold-100/55">
              Subscribe to unlock seasonal priority booking updates and exclusive master chef tasting dinners.
            </p>

            <AnimatePresence>
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-3 border border-gold-accent/30 bg-gold-500/[0.04] text-gold-accent font-mono text-[9px] uppercase tracking-wider text-center"
                >
                  Subscription Active
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center space-x-1">
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enquire electronic mail"
                    className="bg-[#0A0A0A] border border-white/10 px-3 py-2 text-white placeholder-zinc-700 focus:outline-none focus:border-gold-accent text-[11px] flex-grow rounded-none"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-gradient-to-r from-gold-600 to-gold-400 text-luxury-black font-semibold text-xs hover:brightness-110 active:scale-95 transition-all rounded-none"
                  >
                    Ok
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Lower copyright bar */}
        <div id="footer-bottom" className="pt-8 border-t border-gold-500/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-gold-500/40 uppercase font-mono tracking-widest">
          <div>
            &copy; {new Date().getFullYear()} Aurelia Fine Dining. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-2">
            <span>Michelin Rated Excellence</span>
            <Star className="w-3.5 h-3.5 fill-gold-accent/15 text-gold-accent/15" />
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-1 bg-luxury-light-gray px-3 py-1.5 border border-gold-500/15 hover:border-gold-accent text-gold-accent transition-colors cursor-pointer"
          >
            <span>Top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>

      </div>
    </footer>
  );
}
