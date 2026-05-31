import { ShieldCheck, Flame, Compass, HelpCircle, UtensilsCrossed, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function WhyChooseUs() {
  const pillars = [
    {
      id: 'pillar-1',
      icon: <Sparkles className="w-6 h-6 text-gold-accent" />,
      title: 'Pristine Sourcing',
      subtitle: 'BIODYNAMIC ESTATED INGREDIENTS',
      description: 'We secure wild chanterelles, A5 Wagyu, and fresh micro-greens directly from organic estates and sustainable fishermen daily.'
    },
    {
      id: 'pillar-2',
      icon: <Flame className="w-6 h-6 text-gold-accent" />,
      title: 'Expert Masters',
      subtitle: 'ANTOINE LAURENT & TEAM',
      description: 'Our kitchen is directed by three Michelin-star veterans who analyze flavor, temperature, and visual architecture to achieve perfection.'
    },
    {
      id: 'pillar-3',
      icon: <Compass className="w-6 h-6 text-gold-accent" />,
      title: 'Atmospheric Theater',
      subtitle: 'DIM GOLDEN INTENSITY',
      description: 'Enjoy a custom luxury design showcasing natural slate, charcoal velvets, and direct spotlight beams illuminating your dish.'
    },
    {
      id: 'pillar-4',
      icon: <UtensilsCrossed className="w-6 h-6 text-gold-accent" />,
      title: 'Majestic Care',
      subtitle: 'IMPECCABLE SERVICE SYSTEM',
      description: 'Experience attentive tableside preparation, personalized decanter cellars, and pacing exactly matching your appetite.'
    }
  ];

  return (
    <section
      id="why-us"
      className="relative py-24 sm:py-32 w-full bg-transparent overflow-hidden border-t border-gold-500/5"
    >
      {/* Background decorations */}
      <div id="why-ambient-glow" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-gold-900/[0.03] rounded-full blur-[140px] pointer-events-none" />

      <div id="why-container" className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Header Block */}
        <div id="why-header" className="text-center mb-16 sm:mb-24">
          <span id="why-subtitle" className="text-[10px] font-mono tracking-[0.4em] text-gold-accent uppercase block mb-4">
            Distinguishing Qualities
          </span>
          <h2 id="why-title" className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
            Why Dine at Aurelia
          </h2>
          <div id="why-title-decor" className="flex items-center justify-center mt-6 space-x-3">
            <div id="why-decor-line-1" className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold-500/40" />
            <span id="why-decor-char" className="text-gold-accent text-xs">✦</span>
            <div id="why-decor-line-2" className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold-500/40" />
          </div>
        </div>

        {/* Bento-Inspired Grid */}
        <div id="why-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <motion.div
              id={`why-card-${pillar.id}`}
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#D4AF37]/45 rounded-sm transition-all duration-500 p-8 flex flex-col justify-between aspect-square md:aspect-[3/4] lg:aspect-auto min-h-[300px] box-gold-glow hover:bg-white/10"
            >
              {/* Internal Accent frame */}
              <div id={`why-card-decor-${pillar.id}`} className="absolute inset-2 border border-gold-500/5 pointer-events-none" />

              {/* Icon Container */}
              <div id={`why-card-icon-wrapper-${pillar.id}`} className="w-12 h-12 border border-gold-500/15 flex items-center justify-center rounded-none bg-luxury-black shadow-[0_0_15px_rgba(212,175,55,0.03)] group-hover:border-gold-accent transition-colors duration-500">
                {pillar.icon}
              </div>

              {/* Content Text Block */}
              <div id={`why-card-content-${pillar.id}`} className="space-y-3 mt-12 relative z-10">
                <span id={`why-card-subtitle-${pillar.id}`} className="block font-mono text-[9px] uppercase tracking-[0.25em] text-gold-500/60 font-medium">
                  {pillar.subtitle}
                </span>
                <h3 id={`why-card-title-${pillar.id}`} className="text-lg font-serif text-white group-hover:text-gold-accent transition-colors duration-300">
                  {pillar.title}
                </h3>
                <p id={`why-card-desc-${pillar.id}`} className="text-xs text-gold-50/50 leading-relaxed font-light font-sans group-hover:text-gold-50/70 transition-colors duration-300">
                  {pillar.description}
                </p>
              </div>

              {/* Card numbering */}
              <div id={`why-card-num-${pillar.id}`} className="absolute top-6 right-8 font-serif italic text-gold-500/10 text-4xl group-hover:text-gold-accent/15 transition-colors duration-500 pointer-events-none">
                0{idx + 1}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
