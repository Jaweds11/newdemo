import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Leaf, ShieldAlert, Award } from 'lucide-react';
import { MENU_ITEMS } from '../data';
import { MenuItem } from '../types';

interface MenuProps {
  onReserve: () => void;
}

export default function Menu({ onReserve }: MenuProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'appetizer' | 'main' | 'dessert' | 'beverage'>('all');

  const tabs = [
    { id: 'all', name: 'Le Grand Menu' },
    { id: 'appetizer', name: 'Appetizers' },
    { id: 'main', name: 'Main Courses' },
    { id: 'dessert', name: 'Desserts' },
    { id: 'beverage', name: 'Signature Elixirs' },
  ] as const;

  const filteredItems = MENU_ITEMS.filter((item) => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  return (
    <section
      id="menu"
      className="relative py-24 sm:py-32 w-full bg-transparent overflow-hidden"
    >
      {/* Visual Accents */}
      <div id="menu-ambient-glow-1" className="absolute top-1/3 right-0 w-96 h-96 bg-gold-900/5 rounded-full blur-[140px] pointer-events-none" />
      <div id="menu-ambient-glow-2" className="absolute bottom-1/3 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-[145px] pointer-events-none" />

      <div id="menu-container" className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Section title */}
        <div id="menu-section-header" className="text-center mb-16 sm:mb-20">
          <span id="menu-subtitle" className="text-[10px] font-mono tracking-[0.4em] text-gold-accent uppercase block mb-4">
            Curated Gastronomic Selections
          </span>
          <h2 id="menu-title" className="text-3xl sm:text-5xl font-serif text-gold-50 tracking-tight">
            Our Signature Menu
          </h2>
          <div id="menu-title-decor" className="flex items-center justify-center mt-6 space-x-3">
            <div id="menu-decor-line-1" className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold-500/40" />
            <span id="menu-decor-diamond" className="text-gold-accent text-xs">◆</span>
            <div id="menu-decor-line-2" className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold-500/40" />
          </div>
          <p id="menu-header-subtext" className="text-xs text-gold-50/40 font-light max-w-lg mx-auto mt-6 tracking-wide leading-relaxed">
            Every creation is engineered tableside or arranged carefully using seasonal, pristine elements. Selected items feature our dynamic gold signature decoration.
          </p>
        </div>

        {/* Tab Controls */}
        <div id="menu-categories-tabs" className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-16">
          {tabs.map((tab) => (
            <button
              id={`menu-tab-btn-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-[11px] uppercase tracking-[0.2em] font-sans transition-all duration-300 relative focus:outline-none cursor-pointer rounded-none border ${
                activeTab === tab.id
                  ? 'border-gold-accent/40 text-gold-accent bg-gold-500/[0.04] text-gold-glow'
                  : 'border-transparent text-gold-100/50 hover:text-gold-accent hover:border-gold-500/10'
              }`}
            >
              <span className="relative z-10">{tab.name}</span>
              {activeTab === tab.id && (
                <motion.div
                  id={`menu-tab-border-outline-${tab.id}`}
                  layoutId="activeMenuTab"
                  className="absolute inset-0 border border-gold-accent pointer-events-none"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Menu Grid Container */}
        <motion.div
          id="menu-items-grid"
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                id={`menu-item-card-${item.id}`}
                key={item.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative flex flex-col sm:flex-row items-stretch bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#D4AF37]/45 rounded-sm transition-all duration-500 ease-out p-4 gap-6 box-gold-glow hover:bg-white/10"
              >
                {/* Embedded Fine Border Accent */}
                <div id={`menu-decor-inner-${item.id}`} className="absolute inset-1.5 border border-gold-500/5 pointer-events-none group-hover:border-gold-accent/15 transition-colors duration-500" />

                {/* Dish Image */}
                <div id={`menu-img-container-${item.id}`} className="w-full sm:w-36 h-36 flex-shrink-0 relative overflow-hidden bg-luxury-black border border-gold-500/10">
                  <img
                    id={`menu-item-image-${item.id}`}
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  {item.signature && (
                    <div id={`menu-sig-pin-${item.id}`} className="absolute top-2 left-2 bg-luxury-black/90 border border-gold-accent/40 text-gold-accent px-1.5 py-0.5 text-[8px] font-mono tracking-widest uppercase flex items-center space-x-1">
                      <Award className="w-2.5 h-2.5 text-gold-accent" />
                      <span>Signature</span>
                    </div>
                  )}
                </div>

                {/* Dish Text and Badging */}
                <div id={`menu-text-block-${item.id}`} className="flex-grow flex flex-col justify-between py-1 relative z-10">
                  <div id={`menu-text-header-${item.id}`} className="space-y-2">
                    <div id={`menu-title-row-${item.id}`} className="flex justify-between items-baseline gap-2">
                      <h3 id={`menu-item-title-text-${item.id}`} className="text-base sm:text-lg font-serif tracking-wide text-white group-hover:text-gold-accent transition-colors duration-300">
                        {item.name}
                      </h3>
                      <div id={`menu-item-price-glow-${item.id}`} className="font-serif text-sm sm:text-base font-medium text-gold-accent text-gold-glow flex-shrink-0">
                        ${item.price}
                      </div>
                    </div>

                    <p id={`menu-item-description-text-${item.id}`} className="text-[12px] sm:text-xs text-gold-50/50 leading-relaxed font-light font-sans max-w-sm">
                      {item.description}
                    </p>
                  </div>

                  {/* Dietary tags */}
                  <div id={`menu-item-footer-${item.id}`} className="flex items-center justify-between mt-4 pt-3 border-t border-gold-500/5">
                    <div id={`menu-item-badges-${item.id}`} className="flex flex-wrap gap-1.5">
                      {item.dietary.map((diet, i) => (
                        <span
                          id={`menu-diet-badge-${item.id}-${i}`}
                          key={i}
                          className="px-2 py-0.5 text-[8px] font-mono tracking-wider rounded-none uppercase bg-luxury-light-gray text-gold-250 border border-gold-500/10 text-gold-500/70"
                        >
                          {diet}
                        </span>
                      ))}
                    </div>

                    {/* Book CTA interaction */}
                    <button
                      id={`menu-book-cta-${item.id}`}
                      onClick={onReserve}
                      className="text-[9px] font-mono tracking-widest uppercase text-gold-500/40 group-hover:text-gold-accent transition-colors duration-300 flex items-center space-x-1 focus:outline-none cursor-pointer"
                    >
                      <span>Reserve</span>
                      <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Global Menu Note */}
        <div id="menu-disclaimer" className="text-center mt-12 text-[10px] sm:text-[11px] font-mono tracking-widest text-gold-500/40 uppercase">
          ★ Taxes and gratuity are not included. Gluten-free pairings available upon request.
        </div>
      </div>
    </section>
  );
}
