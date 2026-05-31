import { ChevronDown, Calendar, Menu as MenuIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { heroImg } from '../data';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section
      id="home"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0A0A0A]"
    >
      {/* Background Image with elegant overlay */}
      <div id="hero-bg-container" className="absolute inset-0 z-0">
        <img
          id="hero-bg-image"
          src={heroImg}
          alt="Aurelia Grand Salon Interior"
          className="w-full h-full object-cover opacity-60 scale-105"
          style={{ animation: 'panSlow 30s infinite alternate ease-in-out' }}
          referrerPolicy="no-referrer"
        />
        {/* Dynamic radial gradient for deep visual focus */}
        <div 
          id="hero-overlay-radial" 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.1)_0%,rgba(10,10,10,0.85)_80%,#0A0A0A_100%)]" 
        />
        {/* Bottom vertical fade */}
        <div id="hero-overlay-linear" className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
      </div>

      {/* Decorative vertical thin lines and luxury compass headers */}
      <div id="hero-decorations" className="absolute inset-0 pointer-events-none z-10 flex justify-between px-12 md:px-24">
        <div id="hero-decor-line-left" className="w-[1px] h-full bg-gold-500/10" />
        <div id="hero-decor-line-right" className="w-[1px] h-full bg-gold-500/10" />
      </div>

      {/* Content wrapper with precise vertical pacing */}
      <div id="hero-content" className="relative z-20 text-center max-w-4xl px-6 flex flex-col items-center">
        {/* Subtle top crest with soft golden glow */}
        <motion.div
          id="hero-crest-container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="flex flex-col items-center mb-6"
        >
          <div id="hero-crown-art" className="w-10 h-10 border border-gold-500/30 flex items-center justify-center rounded-full bg-luxury-black/60 backdrop-blur-sm shadow-[0_0_15px_rgba(212,175,55,0.05)]">
            <span className="text-gold-accent font-serif text-[10px] tracking-widest">★</span>
          </div>
          <div id="hero-rating-stars" className="flex items-center space-x-1.5 mt-2">
            {[...Array(3)].map((_, i) => (
              <span id={`hero-star-${i}`} key={i} className="text-gold-accent text-xs">★</span>
            ))}
          </div>
          <span id="hero-crest-txt" className="text-[10px] font-mono tracking-[0.5em] text-gold-500/65 uppercase mt-3">
            An Unparalleled Culinary Sanctuary
          </span>
        </motion.div>

        {/* Catchy headline: "An Unforgettable Fine Dining Experience" */}
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-gold-50; font-light tracking-tight leading-[1.1] mb-8"
        >
          An Unforgettable <br />
          <span className="text-gold-200 font-extralight italic font-serif">Fine Dining</span> <br />
          Experience
        </motion.h1>

        {/* Decorative thin bronze gold horizontal divider with central diamond */}
        <motion.div
          id="hero-divider"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="flex items-center space-x-4 w-40 sm:w-64 mb-8"
        >
          <div id="hero-div-line-1" className="h-[1px] bg-gradient-to-r from-transparent to-gold-500/40 flex-grow" />
          <div id="hero-div-diamond" className="w-1.5 h-1.5 bg-gold-accent rotate-45" />
          <div id="hero-div-line-2" className="h-[1px] bg-gradient-to-l from-transparent to-gold-500/40 flex-grow" />
        </motion.div>

        <motion.p
          id="hero-tagline-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.1 }}
          className="text-sm sm:text-base md:text-lg text-gold-100/60 font-sans tracking-wide max-w-xl mx-auto mb-12 font-light leading-relaxed"
        >
          Where gastronomy intersects with high design. Experience culinary alchemy engineered by Master Chef Antoine Laurent, served within an intimate twilight theater.
        </motion.p>

        {/* CTA Buttons - Reserve Table & View Menu */}
        <motion.div
          id="hero-cta-group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <button
            id="hero-reserve-btn"
            onClick={() => onNavigate('reservations')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-400 text-luxury-black font-semibold uppercase text-xs tracking-[0.25em] transition-all hover:brightness-110 active:scale-98 shadow-[0_4px_30px_rgba(212,175,55,0.2)] hover:shadow-[0_10px_40px_rgba(212,175,55,0.35)] cursor-pointer rounded-none flex items-center justify-center space-x-2"
          >
            <Calendar className="w-4 h-4 text-luxury-black" />
            <span>Reserve Table</span>
          </button>

          <button
            id="hero-menu-btn"
            onClick={() => onNavigate('menu')}
            className="w-full sm:w-auto px-8 py-4 bg-luxury-black/40 border border-gold-500/40 text-gold-accent font-semibold uppercase text-xs tracking-[0.25em] hover:bg-gold-accent/5 hover:border-gold-accent transition-all duration-300 active:scale-98 cursor-pointer rounded-none flex items-center justify-center space-x-2"
          >
            <MenuIcon className="w-4 h-4 text-gold-accent" />
            <span>View Menu</span>
          </button>
        </motion.div>
      </div>

      {/* Downward indicator */}
      <motion.div
        id="hero-scroll-reminder"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, delay: 2.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-20 flex flex-col items-center"
        onClick={() => onNavigate('about')}
      >
        <span id="hero-scroll-txt" className="text-[9px] font-mono tracking-[0.3em] text-gold-500/40 uppercase mb-2">Scroll To Explore</span>
        <ChevronDown className="w-4 h-4 text-gold-accent/40 animate-bounce" />
      </motion.div>

      <style>{`
        @keyframes panSlow {
          0% { transform: scale(1.02) translate(0, 0); }
          100% { transform: scale(1.08) translate(-1%, -1%); }
        }
      `}</style>
    </section>
  );
}
