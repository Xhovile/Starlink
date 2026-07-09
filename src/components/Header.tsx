import React, { useState } from 'react';
import { Menu, X, Phone, Bus, Calendar, Info, MapPin, Lock, Home, CheckSquare, Bell, User } from 'lucide-react';
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
  const [showNotifications, setShowNotifications] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'operators', label: 'Operators', icon: Bus },
    { id: 'bookings', label: 'Tickets', icon: Calendar },
    { id: 'management', label: 'Profile / Admin', icon: User },
  ];

  const handleNavClick = (id: string) => {
    onViewChange(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mockNotifications = [
    { id: 1, text: 'VIP Fare promotion active! Save up to 10% on round trips.', time: 'Just now' },
    { id: 2, text: 'Certified 80km/h speed limits active on all M1 highway routes.', time: '2 hours ago' },
    { id: 3, text: 'Welcome to YAVA! Your premier executive intercity coach carrier.', time: '1 day ago' }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white text-ink">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Left: Hamburger Menu Icon */}
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-50 text-navy transition-all duration-200 cursor-pointer"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6 stroke-[2]" />
            </button>
          </div>

          {/* Center: Centered YAVA Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 focus:outline-none text-left"
              id="header-logo-btn"
            >
              <div className="flex flex-col">
                <span className="serif text-2xl font-black tracking-widest uppercase text-navy leading-none">
                  YAVA
                </span>
              </div>
            </button>
          </div>

          {/* Right: Notification Bell Icon */}
          <div className="flex items-center gap-3 relative">
            
            {/* Language Quick Toggle on Desktop */}
            <div className="hidden sm:flex items-center gap-1 border border-gray-150 p-0.5 rounded-md bg-gray-50 mr-2 text-[10px]">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 font-bold transition-all duration-300 rounded-sm cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#FF5A1F] text-white shadow-sm'
                    : 'text-gray-500 hover:text-navy'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ny')}
                className={`px-2 py-0.5 font-bold transition-all duration-300 rounded-sm cursor-pointer ${
                  language === 'ny'
                    ? 'bg-[#FF5A1F] text-white shadow-sm'
                    : 'text-gray-500 hover:text-navy'
                }`}
              >
                NY
              </button>
            </div>

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-50 text-navy transition-all duration-200 cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-5.5 w-5.5 stroke-[2]" />
              <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-[#FF5A1F]" />
            </button>

            {/* Notification Dropdown Box */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 z-20 w-80 bg-white border border-gray-100 shadow-xl rounded-xl p-4 text-left"
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
                      <span className="text-xs font-bold text-navy uppercase tracking-wider">Notifications</span>
                      <span className="text-[10px] text-gray-400">Mark all as read</span>
                    </div>
                    <div className="space-y-3">
                      {mockNotifications.map(item => (
                        <div key={item.id} className="text-xs border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                          <p className="text-navy font-medium leading-normal">{item.text}</p>
                          <span className="text-[9px] text-gray-400 block mt-1">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[100] flex justify-start">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-[85%] max-w-sm h-full bg-white text-navy shadow-2xl flex flex-col z-10"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-white shadow-sm">
                    <Bus className="h-4.5 w-4.5 stroke-[2]" />
                  </div>
                  <div>
                    <span className="serif text-lg font-black tracking-widest uppercase text-navy">
                      YAVA
                    </span>
                    <span className="block text-[8px] uppercase tracking-[0.2em] text-[#FF5A1F] font-bold">
                      Luxury Travel
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-50 text-navy transition-all cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-grow flex flex-col overflow-hidden">
                <div className="overflow-y-auto flex-1 p-4 space-y-2">
                  {navItems.map((item) => {
                    const isActive = currentView === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full px-4 py-3.5 rounded-xl text-left text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center gap-4 ${
                          isActive
                            ? 'bg-navy text-white font-bold shadow-md shadow-navy/10'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}

                  {/* Language Selector */}
                  <div className="p-4 border-t border-gray-100 mt-6 space-y-3">
                    <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-gray-500 block">
                      {language === 'en' ? 'Select Language' : 'Sankhani Chilankhulo'}
                    </span>
                    <div className="grid grid-cols-2 gap-2 border border-gray-150 p-1 rounded-xl bg-gray-50">
                      <button
                        onClick={() => setLanguage('en')}
                        className={`py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 rounded-lg cursor-pointer ${
                          language === 'en'
                            ? 'bg-[#FF5A1F] text-white shadow-sm'
                            : 'text-gray-500 hover:text-navy hover:bg-white'
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => setLanguage('ny')}
                        className={`py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 rounded-lg cursor-pointer ${
                          language === 'ny'
                            ? 'bg-[#FF5A1F] text-white shadow-sm'
                            : 'text-gray-500 hover:text-navy hover:bg-white'
                        }`}
                      >
                        Chichewa
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-6 border-t border-gray-100 bg-white shrink-0">
                  <a
                    href="tel:+265995446426"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-navy text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity rounded-xl shadow-md"
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
