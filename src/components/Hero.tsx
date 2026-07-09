import React, { useState, useEffect } from 'react';
import { Bus, ArrowRight, ShieldCheck, Clock, Award, Star, ArrowLeftRight, Calendar, Users, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onNavigateToBooking: (prefill?: { departure: string; destination: string; date: string, passengers: number }) => void;
  onNavigateToSchedule: () => void;
}

export default function Hero({ onNavigateToBooking, onNavigateToSchedule }: HeroProps) {
  const { language, t } = useLanguage();
  
  // Interactive Floating Booking Card States
  const [departure, setDeparture] = useState<'Lilongwe' | 'Blantyre'>('Lilongwe');
  const [destination, setDestination] = useState<'Lilongwe' | 'Blantyre'>('Blantyre');
  const [travelDate, setTravelDate] = useState<string>(() => {
    // Tomorrow as default date
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    return tom.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState<number>(1);
  const [showPassengersDropdown, setShowPassengersDropdown] = useState<boolean>(false);

  // Auto flip destination when departure matches
  useEffect(() => {
    if (departure === destination) {
      setDestination(departure === 'Lilongwe' ? 'Blantyre' : 'Lilongwe');
    }
  }, [departure]);

  const handleSwap = () => {
    const temp = departure;
    setDeparture(destination);
    setDestination(temp);
  };

  const handleBookClick = () => {
    onNavigateToBooking({
      departure,
      destination,
      date: travelDate,
      passengers
    });
  };

  // Human readable date formatter (e.g., "24 May 2026")
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return 'Select Date';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(language === 'en' ? 'en-US' : 'en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="relative w-full bg-white px-4 pt-4 pb-12 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* 2. Hero Banner Container */}
      <div className="w-full bg-[#062A73] rounded-3xl p-6 sm:p-10 lg:p-12 text-center text-white relative overflow-hidden min-h-[220px] sm:min-h-[260px] flex flex-col justify-center items-center shadow-xl">
        {/* Subtle geometric background overlay for elite depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,90,31,0.15),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,42,115,0.85),rgba(6,42,115,0.98))]" />
        
        {/* Banner Copy */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <h1 className="serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {language === 'en' ? 'Book Bus Tickets With YAVA' : 'Sungani Matikiti a Bus a YAVA'}
          </h1>
          <p className="text-[10px] sm:text-xs font-black tracking-[0.25em] text-[#FF5A1F] uppercase">
            CONNECTING PEOPLE... EVERYWHERE
          </p>
        </div>
      </div>

      {/* 3. Floating Booking Card (Overlapping) */}
      <div className="relative z-20 max-w-xl mx-auto -mt-8 sm:-mt-12 px-2">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-6">
          
          {/* Vertical Route Indicator Display */}
          <div className="space-y-4">
            <div className="flex items-start">
              
              {/* Left Route Indicator Column */}
              <div className="flex flex-col items-center mr-4 pt-1 select-none">
                <div className="h-4 w-4 rounded-full border-4 border-[#062A73] bg-white flex items-center justify-center shrink-0" />
                <div className="w-[2px] h-12 border-l-2 border-dashed border-gray-300 my-1" />
                <div className="h-4 w-4 rounded-full border-4 border-[#FF5A1F] bg-white flex items-center justify-center shrink-0" />
              </div>

              {/* Right Input Display Fields */}
              <div className="flex-grow space-y-4">
                
                {/* From Field */}
                <div className="relative">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 block mb-1">
                    {language === 'en' ? 'From' : 'Kuchokera'}
                  </span>
                  <div className="flex items-center justify-between">
                    <select
                      value={departure}
                      onChange={(e) => setDeparture(e.target.value as 'Lilongwe' | 'Blantyre')}
                      className="text-base font-bold text-[#062A73] bg-transparent outline-none cursor-pointer pr-8 py-1 appearance-none w-full"
                    >
                      <option value="Lilongwe">Lilongwe</option>
                      <option value="Blantyre">Blantyre</option>
                    </select>
                    
                    {/* Swap Button on Right side of From */}
                    <button
                      onClick={handleSwap}
                      type="button"
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#062A73] h-8 w-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm"
                      title="Swap cities"
                    >
                      <ArrowLeftRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="h-[1px] bg-gray-100 w-full mt-2" />
                </div>

                {/* To Field */}
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 block mb-1">
                    {language === 'en' ? 'To' : 'Kupita'}
                  </span>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value as 'Lilongwe' | 'Blantyre')}
                    className="text-base font-bold text-[#062A73] bg-transparent outline-none cursor-pointer pr-8 py-1 appearance-none w-full"
                  >
                    <option value="Blantyre">Blantyre</option>
                    <option value="Lilongwe">Lilongwe</option>
                  </select>
                  <div className="h-[1px] bg-gray-100 w-full mt-2" />
                </div>

              </div>
            </div>
          </div>

          {/* Date Selector Row */}
          <div className="relative">
            <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 block mb-1">
              {language === 'en' ? 'Date of travel' : 'Tsiku la Ulendo'}
            </span>
            <div className="flex items-center justify-between cursor-pointer group">
              <span className="text-base font-bold text-[#062A73]">
                {formatDisplayDate(travelDate)}
              </span>
              <div className="relative">
                <Calendar className="h-5 w-5 text-[#062A73] group-hover:text-[#FF5A1F] transition-colors" />
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full"
                />
              </div>
            </div>
            <div className="h-[1px] bg-gray-100 w-full mt-2" />
          </div>

          {/* Passengers Row */}
          <div className="relative">
            <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 block mb-1">
              {language === 'en' ? 'Passengers' : 'Akweli'}
            </span>
            <div 
              onClick={() => setShowPassengersDropdown(!showPassengersDropdown)}
              className="flex items-center justify-between cursor-pointer group"
            >
              <span className="text-base font-bold text-[#062A73]">
                {passengers} {passengers === 1 ? (language === 'en' ? 'Passenger' : 'Mkweli mmodzi') : (language === 'en' ? 'Passengers' : 'Akweli')}
              </span>
              <ChevronDown className={`h-5 w-5 text-[#062A73] transition-transform duration-200 ${showPassengersDropdown ? 'rotate-180' : ''}`} />
            </div>

            {/* Quick Interactive Passengers Dropdown / Incrementer */}
            <AnimatePresence>
              {showPassengersDropdown && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowPassengersDropdown(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 right-0 top-12 bg-white border border-gray-150 rounded-xl shadow-xl p-4 z-30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#062A73]">Select number of seats:</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (passengers > 1) setPassengers(passengers - 1);
                          }}
                          className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center font-bold text-lg text-gray-600 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-base font-black text-[#062A73] w-6 text-center">{passengers}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (passengers < 10) setPassengers(passengers + 1);
                          }}
                          className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center font-bold text-lg text-gray-600 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
            <div className="h-[1px] bg-gray-100 w-full mt-2" />
          </div>

          {/* Book Now Button CTA */}
          <button
            onClick={handleBookClick}
            className="w-full bg-[#FF5A1F] hover:bg-[#e04f1a] text-white py-4 px-6 text-xs font-extrabold uppercase tracking-widest rounded-xl shadow-lg shadow-[#FF5A1F]/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            {language === 'en' ? 'Book Ticket' : 'Sungani Tikiti'}
          </button>

        </div>
      </div>

    </div>
  );
}
