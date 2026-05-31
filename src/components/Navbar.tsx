import { useState, useEffect } from 'react';
import { Menu, X, Compass, Calendar, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export default function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Menu', id: 'menu' },
    { name: 'Why Us', id: 'why-us' },
    { name: 'Gallery', id: 'gallery' },
    { name: 'Reviews', id: 'reviews' },
    { name: 'Reservations', id: 'reservations' },
    { name: 'Contact', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClickLink = (id: string) => {
    setIsOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <header
        id="navbar-header"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-4 bg-luxury-black/80 backdrop-blur-md border-b border-gold-500/15'
            : 'py-6 bg-transparent'
        }`}
      >
        <div id="navbar-container" className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Brand Logo holding a Michelin-star feel */}
          <button
            id="navbar-logo-btn"
            onClick={() => handleClickLink('home')}
            className="flex items-center space-x-2 group cursor-pointer text-left focus:outline-none"
          >
            <div id="navbar-logo-icon-container" className="flex flex-col items-center justify-center leading-none">
              <span id="navbar-logo-symbol-1" className="text-gold-accent font-serif text-lg tracking-widest font-bold group-hover:scale-110 transition-transform duration-300">
                A U R E L I A
              </span>
              <span id="navbar-logo-symbol-2" className="text-[9px] font-mono tracking-[0.35em] text-gold-500/70 uppercase">
                Fine Dining • Excellence
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav id="navbar-desktop-nav" className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                id={`navbar-link-${link.id}`}
                key={link.id}
                onClick={() => handleClickLink(link.id)}
                className={`relative text-xs uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer focus:outline-none ${
                  activeSection === link.id
                    ? 'text-gold-accent text-gold-glow'
                    : 'text-gold-100/70 hover:text-gold-accent'
                }`}
              >
                {link.name}
                {activeSection === link.id && (
                  <motion.div
                    id={`navbar-active-indicator-${link.id}`}
                    layoutId="activeUnderline"
                    className="absolute -bottom-1.5 left-0 right-0 h-[1px] bg-gold-accent"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* CTA Box */}
          <div id="navbar-cta-container" className="hidden lg:flex items-center space-x-4">
            <button
              id="navbar-reserve-cta"
              onClick={() => handleClickLink('reservations')}
              className="px-5 py-2.5 bg-transparent border border-gold-500/30 text-gold-accent text-[11px] uppercase tracking-[0.15em] hover:bg-gold-accent/5 hover:border-gold-accent transition-all duration-300 cursor-pointer rounded-none flex items-center space-x-2 shadow-[0_0_15px_rgba(212,175,55,0.02)] hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]"
            >
              <Calendar className="w-3.5 h-3.5 text-gold-accent/80" />
              <span>Reserve</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div id="navbar-mobile-toggle-container" className="flex items-center lg:hidden">
            <button
              id="navbar-mobile-toggle-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gold-100 hover:text-gold-accent focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="navbar-mobile-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-[72px] bg-luxury-black/95 backdrop-blur-lg z-40 lg:hidden border-t border-gold-500/10 flex flex-col justify-between py-12 px-8"
          >
            <nav id="navbar-mobile-nav" className="flex flex-col space-y-6">
              {navLinks.map((link, idx) => (
                <motion.button
                  id={`navbar-mobile-link-${link.id}`}
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleClickLink(link.id)}
                  className={`text-left text-base font-serif uppercase tracking-[0.25em] py-2 border-b border-gold-500/5 focus:outline-none ${
                    activeSection === link.id
                      ? 'text-gold-accent pl-2 text-gold-glow'
                      : 'text-gold-100/60'
                  }`}
                >
                  {link.name}
                </motion.button>
              ))}
            </nav>

            <motion.div
              id="navbar-mobile-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col space-y-4 border-t border-gold-500/10 pt-8"
            >
              <div id="navbar-mobile-footer-hours" className="text-center font-mono text-[10px] uppercase text-gold-500/50 tracking-widest leading-relaxed">
                Open Daily: 18:00 — 23:00 <br />
                Michelin Guide Starred Excellence
              </div>
              <button
                id="navbar-mobile-reserve-btn"
                onClick={() => handleClickLink('reservations')}
                className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-400 text-luxury-black text-xs font-semibold uppercase tracking-[0.2em] hover:brightness-110 active:scale-[0.98] transition-all rounded-none"
              >
                Book Table
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
