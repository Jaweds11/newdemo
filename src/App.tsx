import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import WhyChooseUs from './components/WhyChooseUs';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import Reservations from './components/Reservations';
import GmailHub from './components/GmailHub';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');

  // Smooth scroll handler which manually targets section offsets
  const navigateToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      // Offset navbar height
      const navbarOffset = 76;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Intersection Observer to update active section automatically on scroll
  useEffect(() => {
    const sections = ['home', 'about', 'menu', 'why-us', 'gallery', 'reviews', 'reservations', 'gmail-hub', 'contact'];
    
    const observers = sections.map((id) => {
      const element = document.getElementById(id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        {
          // Trigger when 15% of the section is visible
          threshold: 0.15,
          rootMargin: '-76px 0px 0px 0px'
        }
      );

      observer.observe(element);
      return { observer, element };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) {
          obs.observer.unobserve(obs.element);
        }
      });
    };
  }, []);

  return (
    <div id="app-root-container" className="bg-[#0A0A0A] text-gold-50 min-h-screen relative font-sans selection:bg-gold-accent selection:text-luxury-black overflow-x-hidden">
      
      {/* Immersive UI Radial Accent Background */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #D4AF37 0%, transparent 50%), radial-gradient(circle at 15% 80%, #1a1a1a 0%, transparent 60%)' }}></div>

      {/* Decorative vertical thin ambient guidelines on background */}
      <div id="root-ambient-guidelines" className="fixed inset-0 pointer-events-none z-0 flex justify-between px-6 sm:px-16 max-w-7xl mx-auto opacity-[0.03]">
        <div id="guide-line-1" className="w-[1px] h-full bg-gold-accent" />
        <div id="guide-line-2" className="w-[1px] h-full bg-gold-accent" />
        <div id="guide-line-3" className="w-[1px] h-full bg-gold-accent" />
      </div>

      {/* Global Navbar */}
      <Navbar activeSection={activeSection} onNavigate={navigateToSection} />

      {/* Main Structural Compartments */}
      <main id="main-content-flow" className="relative z-10">
        
        {/* Full-Screen Hero Visual Banner */}
        <Hero onNavigate={navigateToSection} />

        {/* Story & Chef Intro Block */}
        <About />

        {/* Categories Tab-Filtered Culinary Card Grid */}
        <Menu onReserve={() => navigateToSection('reservations')} />

        {/* Custom Bento Design Pillars */}
        <WhyChooseUs />

        {/* Categorized Lightbox Carousel Gallery */}
        <Gallery />

        {/* Critique and Customer Testimonials Slider/Submit Grid */}
        <Reviews />

        {/* Table Seating Booking Engine Receipt Drawer */}
        <Reservations />

        {/* Gmail Workspace Integration Dashboard */}
        <GmailHub />

        {/* Location facts & Inquiry form with custom vector Map view */}
        <Contact />

      </main>

      {/* Structured Footer */}
      <Footer onNavigate={navigateToSection} />

    </div>
  );
}
