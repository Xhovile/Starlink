import React from 'react';
import { Home, Bus, Ticket, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavbarProps {
  currentView: string;
  navigateTo: (view: string) => void;
  setPrefilledRoute: (route: any) => void;
  setPrefilledQuery: (query: any) => void;
}

export default function BottomNavbar({
  currentView,
  navigateTo,
  setPrefilledRoute,
  setPrefilledQuery
}: BottomNavbarProps) {
  const { language } = useLanguage();

  const handleNav = (view: string) => {
    setPrefilledRoute(null);
    setPrefilledQuery(null);
    navigateTo(view);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800/40 py-3.5 px-6 shadow-2xl backdrop-blur-xl bg-zinc-950/20">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <button 
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 cursor-pointer focus:outline-none ${
            currentView === 'home' 
              ? 'text-[#FF5A1F] scale-110 font-bold' 
              : 'text-white hover:text-[#FF5A1F] hover:scale-105'
          }`}
        >
          <Home className="h-5.5 w-5.5 stroke-[2.2]" />
          <span className="text-[10px] font-black tracking-wider uppercase">
            {language === 'en' ? 'Home' : 'Kwanu'}
          </span>
        </button>
        
        <button 
          onClick={() => handleNav('operators')}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 cursor-pointer focus:outline-none ${
            currentView === 'operators' 
              ? 'text-[#FF5A1F] scale-110 font-bold' 
              : 'text-white hover:text-[#FF5A1F] hover:scale-105'
          }`}
        >
          <Bus className="h-5.5 w-5.5 stroke-[2.2]" />
          <span className="text-[10px] font-black tracking-wider uppercase">
            {language === 'en' ? 'Operators' : 'Mabasi'}
          </span>
        </button>

        <button 
          onClick={() => handleNav('bookings')}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 cursor-pointer focus:outline-none ${
            currentView === 'bookings' 
              ? 'text-[#FF5A1F] scale-110 font-bold' 
              : 'text-white hover:text-[#FF5A1F] hover:scale-105'
          }`}
        >
          <Ticket className="h-5.5 w-5.5 stroke-[2.2]" />
          <span className="text-[10px] font-black tracking-wider uppercase">
            {language === 'en' ? 'Tickets' : 'Matikiti'}
          </span>
        </button>

        <button 
          onClick={() => handleNav('profile')}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 cursor-pointer focus:outline-none ${
            currentView === 'profile' 
              ? 'text-[#FF5A1F] scale-110 font-bold' 
              : 'text-white hover:text-[#FF5A1F] hover:scale-105'
          }`}
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
