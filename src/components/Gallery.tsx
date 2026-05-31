import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { GALLERY_ITEMS } from '../data';
import { GalleryItem } from '../types';

export default function Gallery() {
  const [filter, setFilter] = useState<'all' | 'interior' | 'dish' | 'wine' | 'experience'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filterOptions = [
    { id: 'all', label: 'All Artifacts' },
    { id: 'interior', label: 'The Salon' },
    { id: 'dish', label: 'Culinary Plates' },
    { id: 'wine', label: 'Wine Cellar' },
    { id: 'experience', label: 'The Kitchen' },
  ] as const;

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const handleOpenLightbox = (item: GalleryItem) => {
    // Find absolute index of item in global GALLERY_ITEMS
    const idx = GALLERY_ITEMS.findIndex((gal) => gal.id === item.id);
    setLightboxIndex(idx);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : GALLERY_ITEMS.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev < GALLERY_ITEMS.length - 1 ? prev + 1 : 0));
  };

  return (
    <section
      id="gallery"
      className="relative py-24 sm:py-32 w-full bg-transparent overflow-hidden border-t border-gold-500/5"
    >
      <div id="gallery-container" className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Section title */}
        <div id="gallery-header" className="text-center mb-16">
          <span id="gallery-subtitle" className="text-[10px] font-mono tracking-[0.4em] text-gold-accent uppercase block mb-4">
            Visual Curations
          </span>
          <h2 id="gallery-title" className="text-3xl sm:text-5xl font-serif text-gold-50 tracking-tight">
            The Dining Gallery
          </h2>
          <div id="gallery-title-decor" className="flex items-center justify-center mt-6 space-x-3">
            <div id="gallery-decor-line-1" className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold-500/40" />
            <span id="gallery-decor-star" className="text-gold-accent text-xs">★</span>
            <div id="gallery-decor-line-2" className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold-500/40" />
          </div>
        </div>

        {/* Categories Controls */}
        <div id="gallery-categories" className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-16">
          {filterOptions.map((opt) => (
            <button
              id={`gallery-filter-btn-${opt.id}`}
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={`px-4 py-2 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] transition-all duration-300 rounded-none border focus:outline-none cursor-pointer ${
                filter === opt.id
                  ? 'border-gold-accent/40 text-gold-accent bg-gold-500/[0.04]'
                  : 'border-transparent text-gold-100/50 hover:text-gold-accent'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid of Stunning cards */}
        <motion.div
          id="gallery-grid"
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                id={`gallery-card-${item.id}`}
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => handleOpenLightbox(item)}
                className="group relative aspect-4/3 overflow-hidden bg-luxury-gray cursor-pointer border border-gold-500/10 hover:border-gold-accent/30 transition-colors duration-500"
              >
                {/* Thin internal frame overlay */}
                <div id={`gallery-decor-frame-${item.id}`} className="absolute inset-2 border border-gold-500/5 group-hover:border-gold-accent/15 transition-all duration-500 pointer-events-none z-10" />

                {/* Main image */}
                <img
                  id={`gallery-img-${item.id}`}
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />

                {/* Exquisite hover slide-up info drawer */}
                <div id={`gallery-cover-${item.id}`} className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 z-20">
                  <span id={`gallery-item-category-${item.id}`} className="font-mono text-[8px] uppercase tracking-[0.25em] text-gold-accent mb-1.5">
                    {item.category}
                  </span>
                  <h3 id={`gallery-item-title-${item.id}`} className="text-white font-serif text-lg leading-snug">
                    {item.title}
                  </h3>
                  <p id={`gallery-item-desc-${item.id}`} className="text-[11px] text-gold-50/50 leading-relaxed font-light mt-1 max-w-xs scale-y-95 group-hover:scale-y-100 origin-bottom transition-transform duration-500 delay-75">
                    {item.description}
                  </p>
                  <div id={`gallery-maximize-icon-${item.id}`} className="absolute top-6 right-6 border border-gold-500/30 p-2.5 rounded-none bg-luxury-black/80 text-gold-accent scale-75 group-hover:scale-100 transition-all duration-300">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Slider Drawer */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            id="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-luxury-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Upper control header */}
            <div id="lightbox-controls" className="absolute top-6 left-0 right-0 px-6 sm:px-12 flex justify-between items-center z-50">
              <div id="lightbox-index-text" className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold-500/50">
                Aurelia Vault • {lightboxIndex + 1} of {GALLERY_ITEMS.length}
              </div>
              <button
                id="lightbox-close-btn"
                onClick={() => setLightboxIndex(null)}
                className="hover:text-gold-accent text-white p-2 border border-white/10 hover:border-gold-accent/40 bg-luxury-black rounded-none cursor-pointer focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Carousel display box */}
            <div id="lightbox-display" className="relative w-full max-w-4xl max-h-[80vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              
              {/* Prev Trigger */}
              <button
                id="lightbox-prev-btn"
                onClick={handlePrev}
                className="absolute left-4 sm:-left-16 text-white hover:text-gold-accent p-3 border border-white/10 hover:border-gold-accent/30 bg-luxury-black/80 rounded-none z-50 cursor-pointer focus:outline-none"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Main content slider */}
              <div id="lightbox-content-card" className="w-full flex flex-col items-center">
                <motion.div
                  id="lightbox-image-wrapper"
                  className="relative aspect-video max-h-[60vh] max-w-full overflow-hidden border border-gold-500/20 shadow-2xl bg-luxury-black"
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    id="lightbox-main-img"
                    src={GALLERY_ITEMS[lightboxIndex].image}
                    alt={GALLERY_ITEMS[lightboxIndex].title}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>

                {/* Captions Block */}
                <motion.div
                  id="lightbox-caption-box"
                  className="text-center mt-6 max-w-xl px-4"
                  key={`cap-${lightboxIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <span id="lightbox-caption-cat" className="text-[9px] font-mono tracking-[0.4em] text-gold-accent uppercase block mb-1">
                    {GALLERY_ITEMS[lightboxIndex].category}
                  </span>
                  <h3 id="lightbox-caption-title" className="text-xl font-serif text-white mb-2 leading-snug">
                    {GALLERY_ITEMS[lightboxIndex].title}
                  </h3>
                  <p id="lightbox-caption-desc" className="text-xs text-gold-100/60 leading-relaxed font-light">
                    {GALLERY_ITEMS[lightboxIndex].description}
                  </p>
                </motion.div>
              </div>

              {/* Next Trigger */}
              <button
                id="lightbox-next-btn"
                onClick={handleNext}
                className="absolute right-4 sm:-right-16 text-white hover:text-gold-accent p-3 border border-white/10 hover:border-gold-accent/30 bg-luxury-black/80 rounded-none z-50 cursor-pointer focus:outline-none"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
