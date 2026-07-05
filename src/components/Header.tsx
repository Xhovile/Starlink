import React, { useState } from 'react';
import { Menu, X, Phone, Bus, Calendar, Info, MapPin, Lock, Home, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  openBookingHistory: () => void;
  bookingCount: number;
}

export default function Header({ currentView, onViewChange, openBookingHistory, bookingCount }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'routes', label: t('routes'), icon: Calendar },
    { id: 'book', label: t('bookNow'), icon: CheckSquare },
    { id: 'bookings', label: t('myBookings'), icon: Calendar },
    { id: 'about', label: t('about'), icon: Info },
    { id: 'contact', label: t('contact'), icon: MapPin },
    { id: 'management', label: t('management'), icon: Lock },
  ];

  const handleNavClick = (id: string) => {
    onViewChange(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b-2 border-gold bg-[#0b1d3a] backdrop-blur-md text-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group"
            id="header-logo-btn"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-neutral-800 border border-gold/30 text-gold shadow-sm group-hover:bg-gold group-hover:text-neutral-900 transition-colors duration-300">
              <Bus className="h-5 w-5 stroke-[1.5]" />
            </div>
            <div>
              <span className="serif text-xl font-bold tracking-tighter uppercase text-white sm:text-2xl">
                STARLINK
              </span>
              <span className="block text-[9px] uppercase tracking-[0.25em] text-gold font-bold">
                Malawi &bull; Executive Coach
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              const Icon = item.icon;
              const isBookings = item.id === 'bookings';
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  id={`nav-${item.id}`}
                  className={`px-3.5 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 border-b-2 flex items-center gap-1.5 ${
                    isActive
                      ? 'border-gold text-gold font-bold'
                      : 'border-transparent text-white/70 hover:text-white hover:border-gold/50'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isBookings ? 'text-gold' : isActive ? 'text-gold' : 'text-current'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Quick Contacts & Booking Count & Language Toggle */}
          <div className="hidden md:flex items-center gap-4">
            {/* Desktop Language Toggle */}
            <div className="flex items-center gap-1 border border-white/20 p-1 rounded-sm bg-white/5">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 text-[9px] font-bold transition-all duration-300 rounded-sm cursor-pointer ${
                  language === 'en'
                    ? 'bg-gold text-neutral-900 shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ny')}
                className={`px-2 py-0.5 text-[9px] font-bold transition-all duration-300 rounded-sm cursor-pointer ${
                  language === 'ny'
                    ? 'bg-gold text-neutral-900 shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                NY
              </button>
            </div>

            <a
              href="tel:+265995446426"
              className="hidden lg:flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-gold transition-colors border border-white/20"
            >
              <Phone className="h-3.5 w-3.5 text-gold" />
              <span>+265 995 44 64 26</span>
            </a>
          </div>

          {/* Mobile Buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-sm bg-neutral-850 border border-gold/30 text-white hover:bg-gold hover:text-white focus:outline-none transition-all duration-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[100] md:hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-[85%] max-w-sm h-full bg-white text-ink shadow-2xl flex flex-col z-10"
            >
              {/* Drawer Header (stops at the border below Luxury travel) */}
              <div className="p-6 border-b border-ink-fade flex items-center justify-between bg-white shrink-0">
                <div className="text-left">
                  <span className="serif text-lg font-bold tracking-tighter uppercase text-ink">
                    STARLINK
                  </span>
                  <span className="block text-[8px] uppercase tracking-[0.25em] text-gold font-bold">
                    Luxury Travel
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center bg-paper hover:bg-gold hover:text-white border border-gold/20 text-ink transition-all cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-grow flex flex-col overflow-hidden">
                {/* Nav Items & Language Toggle (Scrollable) */}
                <div className="overflow-y-auto flex-1 mt-2">
                  {navItems.map((item, index) => {
                    const isActive = currentView === item.id;
                    const Icon = item.icon;
                    const isBookings = item.id === 'bookings';
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full px-6 py-4 rounded-none text-left text-xs font-bold uppercase tracking-widest transition-all duration-200 border-b border-ink-fade flex items-center gap-4 ${
                          isActive
                            ? 'bg-gold/10 text-gold font-bold'
                            : 'text-ink/80 hover:bg-gold/5 hover:text-ink'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isBookings ? 'text-gold' : isActive ? 'text-gold' : 'text-current'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}

                  {/* Language Selector in Drawer Menu List (Non-Sticky) */}
                  <div className="p-6 border-b border-ink-fade bg-neutral-50/50 space-y-3">
                    <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-ink/60 block">
                      {language === 'en' ? 'Select Language' : 'Sankhani Chilankhulo'}
                    </span>
                    <div className="grid grid-cols-2 gap-2 border border-ink-fade p-1 rounded-sm bg-white">
                      <button
                        onClick={() => setLanguage('en')}
                        className={`py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 rounded-sm cursor-pointer ${
                          language === 'en'
                            ? 'bg-gold text-white shadow-sm'
                            : 'text-ink/60 hover:text-ink hover:bg-neutral-100'
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => setLanguage('ny')}
                        className={`py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 rounded-sm cursor-pointer ${
                          language === 'ny'
                            ? 'bg-gold text-white shadow-sm'
                            : 'text-ink/60 hover:text-ink hover:bg-neutral-100'
                        }`}
                      >
                        Chichewa
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions (Sticky Hotline Call Button) */}
                <div className="p-6 border-t border-ink-fade bg-white shrink-0">
                  <a
                    href="tel:+265995446426"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-gold text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity rounded-sm"
                  >
                    <Phone className="h-5 w-5" />
                    <span>{t('supportHotline')}</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </>
  );
}
