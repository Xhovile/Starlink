import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Bell, User, Settings, LogIn, UserPlus, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import YavaLogo from './YavaLogo';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import AuthModal from './AuthModal';
import SettingsModal from './SettingsModal';

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

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
    });

    const handleTriggerAuth = (e: Event) => {
      const customEvent = e as CustomEvent;
      const mode = customEvent.detail?.mode || 'login';
      setAuthModalMode(mode);
      setAuthModalOpen(true);
    };
    window.addEventListener('yava-trigger-auth', handleTriggerAuth);

    return () => {
      unsubscribe();
      window.removeEventListener('yava-trigger-auth', handleTriggerAuth);
    };
  }, []);

  const handleNavClick = (id: string) => {
    onViewChange(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setMobileMenuOpen(false);
    } catch (err) {
      console.error('Failed to sign out', err);
    }
  };

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const openSettings = () => {
    setSettingsModalOpen(true);
    setMobileMenuOpen(false);
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

                      {user && (
                        <div className="px-3 py-2 mb-2 bg-slate-50 rounded-lg border border-gray-100">
                          <div className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                            Logged In Account
                          </div>
                          <div className="text-xs font-bold text-[#0B2E6D] truncate mt-0.5">
                            {user.displayName || 'Traveler Account'}
                          </div>
                          <div className="text-[10px] text-gray-500 truncate">
                            {user.email}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={openSettings}
                        className="w-full px-3 py-2.5 rounded-lg text-left text-xs font-semibold uppercase tracking-wider text-[#0B2E6D] hover:bg-slate-100 transition-all duration-200 flex items-center gap-3 cursor-pointer"
                        aria-label="Settings"
                      >
                        <Settings className="h-4.5 w-4.5 text-[#0B2E6D]" />
                        <span>Settings</span>
                      </button>

                      {!user ? (
                        <>
                          <button
                            onClick={() => openAuth('login')}
                            className="w-full px-3 py-2.5 rounded-lg text-left text-xs font-semibold uppercase tracking-wider text-[#0B2E6D] hover:bg-slate-100 transition-all duration-200 flex items-center gap-3 cursor-pointer"
                            aria-label="Sign In"
                          >
                            <LogIn className="h-4.5 w-4.5 text-[#0B2E6D]" />
                            <span>Sign In</span>
                          </button>

                          <button
                            onClick={() => openAuth('signup')}
                            className="w-full px-3 py-2.5 rounded-lg text-left text-xs font-semibold uppercase tracking-wider text-[#0B2E6D] hover:bg-slate-100 transition-all duration-200 flex items-center gap-3 cursor-pointer"
                            aria-label="Sign Up"
                          >
                            <UserPlus className="h-4.5 w-4.5 text-[#0B2E6D]" />
                            <span>Sign Up</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleSignOut}
                          className="w-full px-3 py-2.5 rounded-lg text-left text-xs font-semibold uppercase tracking-wider text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-3 cursor-pointer"
                          aria-label="Sign Out"
                        >
                          <LogOut className="h-4.5 w-4.5 text-red-600" />
                          <span>Sign Out</span>
                        </button>
                      )}

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

      {/* Firebase Auth & Settings Modals */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialMode={authModalMode}
      />
      <SettingsModal 
        isOpen={settingsModalOpen} 
        onClose={() => setSettingsModalOpen(false)} 
        onAuthTrigger={() => {
          setAuthModalMode('login');
          setAuthModalOpen(true);
        }}
      />
    </>
  );
}
