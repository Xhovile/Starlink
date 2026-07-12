import React from 'react';
import { Home, Bus, Ticket, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavbarProps {
  currentView: string;
  navigateTo: (view: string) => void;
  setPrefilledRoute: (route: any) => void;
  setPrefilledQuery: (query: any) => void;
  user: any;
}

export default function BottomNavbar({
  currentView,
  navigateTo,
  setPrefilledRoute,
  setPrefilledQuery,
  user
}: BottomNavbarProps) {
  const { language } = useLanguage();

  const handleNav = (view: string) => {
    if ((view === 'bookings' || view === 'profile') && !user) {
      window.dispatchEvent(new CustomEvent('yava-trigger-auth', { detail: { mode: 'login' } }));
      return;
    }
    setPrefilledRoute(null);
    setPrefilledQuery(null);
    navigateTo(view);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800/40 py-3.5 px-6 pb-[calc(0.875rem+env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-xl bg-zinc-950/20">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <button 
          onClick={() => handleNav('home')}
          className={`flex min-w-0 flex-col items-center gap-1.5 transition-all duration-300 cursor-pointer focus:outline-none active:scale-95 ${
            currentView === 'home' 
              ? 'text-[#FF5A1F] scale-110 font-bold' 
              : 'text-white hover:text-[#FF5A1F] hover:scale-105'
          }`}
          aria-label="Home"
        >
          <Home className="h-5.5 w-5.5 stroke-[2.2]" />
          <span className="text-[10px] font-black tracking-wider uppercase">
            {language === 'en' ? 'Home' : 'Kwanu'}
          </span>
        </button>
        
        <button 
          onClick={() => handleNav('operators')}
          className={`flex min-w-0 flex-col items-center gap-1.5 transition-all duration-300 cursor-pointer focus:outline-none active:scale-95 ${
            currentView === 'operators' 
              ? 'text-[#FF5A1F] scale-110 font-bold' 
              : 'text-white hover:text-[#FF5A1F] hover:scale-105'
          }`}
          aria-label="Operators"
        >
          <Bus className="h-5.5 w-5.5 stroke-[2.2]" />
          <span className="text-[10px] font-black tracking-wider uppercase">
            {language === 'en' ? 'Operators' : 'Mabasi'}
          </span>
        </button>

        <button 
          onClick={() => handleNav('bookings')}
          className={`flex min-w-0 flex-col items-center gap-1.5 transition-all duration-300 cursor-pointer focus:outline-none active:scale-95 ${
            currentView === 'bookings' 
              ? 'text-[#FF5A1F] scale-110 font-bold' 
              : 'text-white hover:text-[#FF5A1F] hover:scale-105'
          }`}
          aria-label="Bookings"
        >
          <Ticket className="h-5.5 w-5.5 stroke-[2.2]" />
          <span className="text-[10px] font-black tracking-wider uppercase">
            {language === 'en' ? 'Tickets' : 'Matikiti'}
          </span>
        </button>

        <button 
          onClick={() => handleNav('profile')}
          className={`flex min-w-0 flex-col items-center gap-1.5 transition-all duration-300 cursor-pointer focus:outline-none active:scale-95 ${
            currentView === 'profile' 
              ? 'text-[#FF5A1F] scale-110 font-bold' 
              : 'text-white hover:text-[#FF5A1F] hover:scale-105'
          }`}
          aria-label="Profile"
        >
          <User className="h-5.5 w-5.5 stroke-[2.2]" />
          <span className="text-[10px] font-black tracking-wider uppercase">
            {language === 'en' ? 'Profile' : 'Mbiri'}
          </span>
        </button>
      </div>
    </div>
  );
}
