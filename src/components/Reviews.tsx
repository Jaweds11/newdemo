import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, Star, UserCheck, Sparkles, Feather } from 'lucide-react';
import { REVIEWS } from '../data';
import { Review } from '../types';

export default function Reviews() {
  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    rating: 5,
    text: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Hydrate local reviews
  useEffect(() => {
    const saved = localStorage.getItem('aurelia_reviews');
    if (saved) {
      try {
        setReviewsList(JSON.parse(saved));
      } catch (e) {
        // Safe fallback
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.text) return;

    const newReview: Review = {
      id: `custom-rev-${Date.now()}`,
      name: formData.name,
      role: formData.role || 'Gourmet Patron',
      rating: formData.rating,
      text: formData.text,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };

    const updated = [newReview, ...reviewsList];
    setReviewsList(updated);
    localStorage.setItem('aurelia_reviews', JSON.stringify(updated));

    setSuccessMessage('Thank you for sharing your experience. Your endorsement has been published.');
    setFormData({ name: '', role: '', rating: 5, text: '' });
    setShowForm(false);

    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  return (
    <section
      id="reviews"
      className="relative py-24 sm:py-32 w-full bg-transparent overflow-hidden"
    >
      <div id="reviews-container" className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Section title */}
        <div id="reviews-header" className="text-center mb-16">
          <span id="reviews-subtitle" className="text-[10px] font-mono tracking-[0.4em] text-gold-accent uppercase block mb-4">
            Critical Accolades & Endorsements
          </span>
          <h2 id="reviews-title" className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
            Patron Testimonials
          </h2>
          <div id="reviews-title-decor" className="flex items-center justify-center mt-6 space-x-3">
            <div id="reviews-decor-line-1" className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold-500/40" />
            <span id="reviews-decor-star" className="text-gold-accent text-xs">★</span>
            <div id="reviews-decor-line-2" className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold-500/40" />
          </div>
        </div>

        {/* Global Endorsement Count Ribbon */}
        <div id="reviews-critics-summary" className="mb-12 py-4 border-y border-gold-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold-500/60">
              Verified Michelin 3-Star Circle Approved
            </span>
          </div>
          <button
            id="reviews-submit-toggle-btn"
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 bg-transparent border border-gold-accent/30 text-gold-accent text-[10px] uppercase tracking-[0.25em] hover:bg-gold-accent hover:text-luxury-black transition-all duration-300 rounded-none font-medium cursor-pointer"
          >
            {showForm ? 'Cancel Endorsement' : 'Leave a Testimonial'}
          </button>
        </div>

        {/* Feedback Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              id="reviews-success-toast"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 border border-gold-accent/40 bg-gold-500/[0.04] text-gold-accent text-center text-xs tracking-wide uppercase font-mono max-w-2xl mx-auto"
            >
              {successMessage}
            </motion.div>
          )}

          {/* Dynamic Review Submission Form */}
          {showForm && (
            <motion.div
              id="reviews-submit-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12 p-8 border border-white/10 bg-[#1a1a1a]/80 max-w-2xl mx-auto rounded-none relative"
            >
              <div className="absolute inset-1 border border-gold-500/5 pointer-events-none" />
              <h3 className="font-serif text-xl text-white mb-6 text-center flex items-center justify-center space-x-3">
                <Feather className="w-4 h-4 text-gold-accent" />
                <span>Patron Endorsement Registry</span>
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10 text-xs text-gold-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-gold-400">Your Full Name *</label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Lady Vivienne Westwood"
                      className="w-full bg-[#0A0A0A] border border-white/10 px-3 py-2.5 text-white focus:outline-none focus:border-gold-accent transition-colors text-xs rounded-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-gold-400">Affiliation / Designation</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="e.g. Fine Wine Enthusiast"
                      className="w-full bg-[#0A0A0A] border border-white/10 px-3 py-2.5 text-white focus:outline-none focus:border-gold-accent transition-colors text-xs rounded-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-gold-400">Rating Scale</label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full bg-[#0A0A0A] border border-white/10 px-3 py-2.5 text-gold-accent font-serif focus:outline-none focus:border-gold-accent transition-colors text-xs rounded-none"
                  >
                    <option value={5} className="bg-[#0A0A0A]">★★★★★ Extraordinary (5 / 5)</option>
                    <option value={4} className="bg-[#0A0A0A]">★★★★ Exquisite (4 / 5)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-gold-400">Your Gastronomy Anecdote *</label>
                  <textarea
                    required
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your sensational tasting experience..."
                    className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-white focus:outline-none focus:border-gold-accent transition-colors text-xs rounded-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-400 text-luxury-black font-semibold uppercase tracking-[0.2em] hover:brightness-110 active:scale-98 transition-all rounded-none text-[11px]"
                >
                  Publish Endorsement
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Review list cards (Responsive Grid) */}
        <div id="reviews-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewsList.map((rev) => (
            <motion.div
              id={`review-card-${rev.id}`}
              key={rev.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#D4AF37]/45 rounded-sm p-8 flex flex-col justify-between relative z-10 box-gold-glow group hover:bg-white/10 transition-all duration-500"
            >
              <div id={`review-card-decor-${rev.id}`} className="absolute inset-2 border border-gold-500/5 pointer-events-none" />

              <div id={`review-card-upper-${rev.id}`} className="space-y-6">
                <Quote className="w-8 h-8 text-gold-accent/20 group-hover:text-gold-accent/40 transition-colors duration-500" />
                
                {/* 5-star Rating icons */}
                <div id={`review-stars-${rev.id}`} className="flex items-center space-x-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star id={`review-star-item-${rev.id}-${i}`} key={i} className="w-3.5 h-3.5 fill-gold-accent text-gold-accent" />
                  ))}
                </div>

                <p id={`review-text-${rev.id}`} className="text-xs sm:text-sm text-gold-50/75 leading-relaxed font-serif italic font-light">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              <div id={`review-card-lower-${rev.id}`} className="mt-8 pt-4 border-t border-gold-500/10 flex flex-col space-y-1">
                <span id={`review-author-name-${rev.id}`} className="text-xs uppercase tracking-widest font-mono text-white">
                  {rev.name}
                </span>
                <span id={`review-author-role-${rev.id}`} className="text-[10px] text-gold-500/50 font-sans tracking-wide">
                  {rev.role}
                </span>
                <span id={`review-date-${rev.id}`} className="text-[9px] text-zinc-600 font-mono self-end -mt-3 uppercase tracking-wider">
                  {rev.date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
