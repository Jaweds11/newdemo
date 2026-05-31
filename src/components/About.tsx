import { Trophy, Star, Sparkles, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 w-full overflow-hidden bg-[#0A0A0A]/40 flex flex-col justify-center"
    >
      {/* Decorative Golden Orbs / Ambient glows */}
      <div id="about-ambient-glow-1" className="absolute top-1/4 left-0 w-96 h-96 bg-gold-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div id="about-ambient-glow-2" className="absolute bottom-1/4 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div id="about-container" className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Section title header */}
        <div id="about-header" className="text-center mb-16 sm:mb-24">
          <span id="about-section-subtitle" className="text-[10px] font-mono tracking-[0.4em] text-gold-accent uppercase block mb-4">
            Established MCMXCVIII
          </span>
          <h2 id="about-section-title" className="text-3xl sm:text-5xl font-serif text-gold-50 tracking-tight">
            Our Story & Philosophy
          </h2>
          <div id="about-title-decor" className="flex items-center justify-center mt-6 space-x-3">
            <div id="about-decor-line-1" className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold-500/40" />
            <span id="about-decor-star" className="text-gold-accent text-xs">★</span>
            <div id="about-decor-line-2" className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold-500/40" />
          </div>
        </div>

        {/* Content Grid */}
        <div id="about-content-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center">
          
          {/* Images Columns (lg:col-span-6) */}
          <div id="about-visuals" className="lg:col-span-6 grid grid-cols-12 gap-4 relative">
            {/* Absolute element: gold frame border behind images */}
            <div id="about-decor-frame" className="absolute -inset-4 border border-gold-500/10 pointer-events-none z-0 rounded-none transform translate-x-2 translate-y-2 hidden sm:block" />

            {/* Chef Main Image */}
            <motion.div
              id="about-chef-img-wrapper"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="col-span-12 sm:col-span-8 overflow-hidden bg-luxury-gray aspect-[3/4] z-10 box-gold-glow border border-gold-500/10"
            >
              <img
                id="about-chef-img"
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop"
                alt="Chef Antoine Laurent"
                className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* In-action Secondary Image */}
            <motion.div
              id="about-action-img-wrapper"
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ duration: 0.5 }}
              className="hidden sm:block sm:col-span-4 self-end overflow-hidden bg-luxury-gray aspect-[4/5] z-20 box-gold-glow border border-gold-500/15 transform -translate-x-6 translate-y-6"
            >
              <img
                id="about-action-img"
                src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=600&auto=format&fit=crop"
                alt="Meticulous Plating Kitchen"
                className="w-full h-full object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Elegant Floating Badge */}
            <div id="about-experience-badge" className="absolute top-4 right-4 sm:-right-4 sm:top-12 bg-luxury-black/90 text-gold-accent border border-gold-accent/40 px-5 py-4 z-20 text-center backdrop-blur-md">
              <span id="about-badge-number" className="block text-2xl font-serif font-bold tracking-tight text-white leading-none">M★3</span>
              <span id="about-badge-label" className="text-[9px] font-mono tracking-widest text-gold-500/70 uppercase">Michelin Rated</span>
            </div>
          </div>

          {/* Text and Philosophy column (lg:col-span-6) */}
          <div id="about-narrative" className="lg:col-span-6 flex flex-col justify-center space-y-8">
            <div id="about-philosophy-card" className="space-y-6">
              <h3 id="about-story-title" className="text-xs uppercase font-mono tracking-[0.25em] text-gold-accent flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-gold-accent/80" />
                <span>Our Philosophy</span>
              </h3>
              <h4 id="about-philosophy-heading" className="text-2xl sm:text-3.5xl font-serif text-white font-light leading-snug">
                Placing the Symphony of Taste Within Symmetrical Architecture
              </h4>
              <p id="about-philosophy-paragraph-1" className="text-gold-50/70 font-light text-sm sm:text-base leading-relaxed">
                Founded initially in Paris and relocated to an exclusive sanctuary lounge, Aurelia elevates dining from simple nutrition to a curated sensory art. Our atmosphere is dim, peaceful, and intimate, ensuring each plate acts as the central lit protagonist on your personal theater stage.
              </p>
              <p id="about-philosophy-paragraph-2" className="text-gold-50/70 font-light text-sm sm:text-base leading-relaxed">
                Under the creative leadership of celebrated executive culinary director Antoine Laurent, we follow deep-rooted French methods combined with innovative regional ingredients. This translates into dishes of profound mathematical flavor harmony, decorated with artisanal flourishes and served with majestic hospitality.
              </p>
            </div>

            {/* Chef Quote Card */}
            <div id="about-chef-quote" className="p-6 border-l-2 border-gold-accent/30 bg-gold-500/[0.02] relative">
              <p id="about-quote-text" className="font-serif italic text-gold-200/80 text-sm sm:text-base leading-relaxed">
                &ldquo;Taste is an architectural experience. A dish must have an elegant foundation, robust structural balance, and a breathtaking visual finish.&rdquo;
              </p>
              <div id="about-quote-signature" className="mt-4 flex items-center space-x-3">
                <div id="about-sig-divider" className="w-6 h-[1px] bg-gold-accent/40" />
                <span id="about-sig-name" className="text-xs font-mono uppercase tracking-widest text-gold-accent">Antoine Laurent, Chef de Cuisine</span>
              </div>
            </div>

            {/* Core Values / Features */}
            <div id="about-pillars" className="grid grid-cols-3 gap-4 pt-4 border-t border-gold-500/10">
              <div id="about-pillar-ingredients" className="text-center group">
                <Heart className="w-5 h-5 mx-auto text-gold-accent/50 group-hover:text-gold-accent transition-colors duration-300 mb-2" />
                <h5 id="about-pillar-title-1" className="text-[10px] uppercase font-mono tracking-widest text-white mb-1">Purity</h5>
                <p id="about-pillar-desc-1" className="text-[10px] text-gold-50/50">100% Organic Estates</p>
              </div>
              <div id="about-pillar-chefs" className="text-center group">
                <Trophy className="w-5 h-5 mx-auto text-gold-accent/50 group-hover:text-gold-accent transition-colors duration-300 mb-2" />
                <h5 id="about-pillar-title-2" className="text-[10px] uppercase font-mono tracking-widest text-white mb-1">Precision</h5>
                <p id="about-pillar-desc-2" className="text-[10px] text-gold-50/50">Culinary Masters</p>
              </div>
              <div id="about-pillar-ambiance" className="text-center group">
                <Star className="w-5 h-5 mx-auto text-gold-accent/50 group-hover:text-gold-accent transition-colors duration-300 mb-2" />
                <h5 id="about-pillar-title-3" className="text-[10px] uppercase font-mono tracking-widest text-white mb-1">Ambiance</h5>
                <p id="about-pillar-desc-3" className="text-[10px] text-gold-50/50">Custom Atmosphere</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
