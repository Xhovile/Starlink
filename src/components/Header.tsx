import React, { useState } from 'react';
import { Menu, X, Home, Bell, User, Settings, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import YavaLogo from './YavaLogo';

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
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-gray-50 text-ink">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Left: Floating Hamburger Menu Icon */}
          <div className="relative flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-200/50 text-navy transition-all duration-200 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 stroke-[2]" />
              ) : (
                <Menu className="h-6 w-6 stroke-[2]" />
              )}
            </button>

            {/* Rectangular Floating Dropdown Menu */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <>
                  {/* Invisible backdrop to dismiss menu on clicking outside */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setMobileMenuOpen(false)} 
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-12 z-50 w-64 bg-white border border-gray-200 shadow-2xl rounded-xl p-3 text-left"
                  >
                    <div className="space-y-1">
                      {/* Active Nav Links */}
                      <button
                        onClick={() => handleNavClick('home')}
                        className={`w-full px-3 py-2.5 rounded-lg text-left text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                          currentView === 'home'
                            ? 'bg-[#FF5A1F] text-white'
                            : 'text-[#0B2E6D] hover:bg-slate-100'
                        }`}
                      >
                        <Home className="h-4.5 w-4.5" />
                        <span>{t('home')}</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('management')}
                        className={`w-full px-3 py-2.5 rounded-lg text-left text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                          currentView === 'management'
                            ? 'bg-[#FF5A1F] text-white'
                            : 'text-[#0B2E6D] hover:bg-slate-100'
                        }`}
                      >
                        <User className="h-4.5 w-4.5" />
                        <span>Management</span>
                      </button>

                      <div className="border-t border-gray-100 my-2" />

                      {/* Stale/Placeholder Links section */}
                      <div className="text-[9px] uppercase font-bold tracking-[0.2em] text-gray-400 px-3 mb-1.5">
                        Account &amp; Tools
                      </div>

                      <button
                        className="w-full px-3 py-2.5 rounded-lg text-left text-xs font-semibold uppercase tracking-wider text-gray-400 hover:bg-slate-50 transition-all duration-200 flex items-center justify-between cursor-not-allowed"
                        disabled
                        aria-label="Settings soon"
                      >
                        <div className="flex items-center gap-3">
                          <Settings className="h-4.5 w-4.5 text-gray-300" />
                          <span>Settings</span>
                        </div>
                        <span className="text-[8px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase">Soon</span>
                      </button>

                      <button
                        className="w-full px-3 py-2.5 rounded-lg text-left text-xs font-semibold uppercase tracking-wider text-gray-400 hover:bg-slate-50 transition-all duration-200 flex items-center justify-between cursor-not-allowed"
                        disabled
                        aria-label="Sign In soon"
                      >
                        <div className="flex items-center gap-3">
                          <LogIn className="h-4.5 w-4.5 text-gray-300" />
                          <span>Sign In</span>
                        </div>
                        <span className="text-[8px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase">Soon</span>
                      </button>

                      <button
                        className="w-full px-3 py-2.5 rounded-lg text-left text-xs font-semibold uppercase tracking-wider text-gray-400 hover:bg-slate-50 transition-all duration-200 flex items-center justify-between cursor-not-allowed"
                        disabled
                        aria-label="Sign Up soon"
                      >
                        <div className="flex items-center gap-3">
                          <UserPlus className="h-4.5 w-4.5 text-gray-300" />
                          <span>Sign Up</span>
                        </div>
                        <span className="text-[8px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase">Soon</span>
                      </button>

                      {/* Mobile Language Selection Quick Grid inside Dropdown */}
                      <div className="border-t border-gray-100 my-2 pt-1.5 px-1.5 block sm:hidden">
                        <span className="text-[8px] uppercase font-bold tracking-wider text-gray-400 block mb-1">
                          {language === 'en' ? 'Language' : 'Chilankhulo'}
                        </span>
                        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-0.5 rounded-md text-[9px] font-bold">
                          <button
                            onClick={() => setLanguage('en')}
                            className={`py-1 text-center rounded transition-all cursor-pointer ${
                              language === 'en'
                                ? 'bg-white text-navy shadow-sm'
                                : 'text-gray-500 hover:text-navy'
                            }`}
                          >
                            EN
                          </button>
                          <button
                            onClick={() => setLanguage('ny')}
                            className={`py-1 text-center rounded transition-all cursor-pointer ${
                              language === 'ny'
                                ? 'bg-white text-navy shadow-sm'
                                : 'text-gray-500 hover:text-navy'
                            }`}
                          >
                            NY
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Center: Centered YAVA Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 focus:outline-none text-left"
              id="header-logo-btn"
            >
              <YavaLogo height={32} />
            </button>
          </div>

          {/* Right: Notification Bell Icon */}
          <div className="flex items-center gap-3 relative">
            
            {/* Language Quick Toggle on Desktop */}
            <div className="hidden sm:flex items-center gap-1 border border-gray-150 p-0.5 rounded-md bg-white mr-2 text-[10px]">
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
              className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-200/50 text-gray-400 hover:text-navy transition-all duration-200 cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-5.5 w-5.5 stroke-[2]" />
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
    </>
  );
}
