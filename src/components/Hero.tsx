import React from 'react';
import { Bus, ArrowRight, ShieldCheck, Clock, Award, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

const heroImg = 'https://lh3.googleusercontent.com/d/100qe8fyREw7ffObbZi7UabPODbFmZmZt';

interface HeroProps {
  onNavigateToBooking: (prefill?: { departure: string; destination: string; date: string }) => void;
  onNavigateToSchedule: () => void;
}

export default function Hero({ onNavigateToBooking, onNavigateToSchedule }: HeroProps) {
  const { language, t } = useLanguage();

  return (
    <div className="relative border-b border-ink-fade bg-[#B5C7EB] text-ink overflow-hidden" id="hero-section">
      
      {/* Dark Ambient Background Image with Rich Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_highway_bg_1783087995992.jpg"
          alt="Scenic Malawian Highway"
          className="h-full w-full object-cover opacity-25"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#B5C7EB] via-[#B5C7EB]/95 to-[#B5C7EB]/75" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        
        {/* Editorial Title Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content: Editorial Copy */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-4">
              <span className="text-base sm:text-lg lg:text-xl font-bold uppercase tracking-[0.2em] text-gold block">
                {language === 'en' ? "Malawi's Elite Executive Roadways" : "Misewu Yapamwamba Kwambiri ku Malawi"}
              </span>
              
              <h1 className="serif text-3xl sm:text-4xl lg:text-4xl leading-[1.05] tracking-tight text-ink font-bold">
                Blantyre <br />
                <span className="italic font-normal text-gold text-xl sm:text-2xl lg:text-2xl">
                  {language === 'en' ? 'to and from' : 'kupita ndi kuchokera'}
                </span> <br />
                Lilongwe
              </h1>
            </div>

            {/* Price Cards & Timetable Snapshot (Editorial Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 max-w-2xl">
              <div className="bg-[#36454f] p-4 shadow-md text-white rounded-md">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 block mb-1">
                  {language === 'en' ? 'Promotional Fare' : 'Mtengo Wapadera'}
                </span>
                <span className="serif text-3xl font-bold text-gold">MWK 50,000</span>
                <p className="text-[10px] font-medium text-white/80 uppercase tracking-wider mt-1">
                  {language === 'en' ? 'Round Trip All Inclusive' : 'Ulendowu Wobwerera All Inclusive'}
                </p>
              </div>

              <div className="bg-[#36454f] p-4 shadow-md text-white rounded-md">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 block mb-1">
                  {language === 'en' ? 'Standard Cabin Fare' : 'Mtengo Wapakati'}
                </span>
                <span className="serif text-3xl font-bold text-white">MWK 35,000</span>
                <p className="text-[10px] font-medium text-white/80 uppercase tracking-wider mt-1">
                  {language === 'en' ? 'One-Way All Inclusive' : 'Ulendo Umodzi All Inclusive'}
                </p>
              </div>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-[#0b1d3a] border border-gold/30 max-w-md text-white shadow-md rounded-md">
              <div>
                <span className="serif text-xl sm:text-2xl font-bold text-gold">100%</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/80 block">
                  {language === 'en' ? 'On-Time Rates' : 'Nthawi Yeniyeni'}
                </span>
              </div>
              <div>
                <span className="serif text-xl sm:text-2xl font-bold text-gold">Daily</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/80 block">
                  {language === 'en' ? 'Express Runs' : 'Maulendo a Tsiku'}
                </span>
              </div>
              <div>
                <span className="serif text-xl sm:text-2xl font-bold text-gold">Certified</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/80 block">
                  {language === 'en' ? 'Safety Fleet' : 'Chitetezo Chokwanira'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onNavigateToBooking()}
                id="hero-book-now-btn"
                className="w-44 h-11 flex items-center justify-center bg-gold hover:bg-[#0b1d3a] hover:text-white text-white text-[10px] font-bold uppercase tracking-widest transition-all duration-300 rounded-md shadow-[0_12px_24px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 transform cursor-pointer"
              >
                {t('reserveSeatNow')}
              </button>
              
              <button
                onClick={onNavigateToSchedule}
                id="hero-schedule-btn"
                className="w-44 h-11 flex items-center justify-center bg-[#0b1d3a] hover:bg-gold text-white border border-[#0b1d3a]/20 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 rounded-md shadow-[0_12px_24px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 transform cursor-pointer"
              >
                {t('viewTimetable')}
              </button>
            </div>
          </div>

          {/* Hero Right Content: Minimalist Booking Form and image vignette */}
          <div className="lg:col-span-5 space-y-6 flex items-center">
            
            {/* Vintage layout photo vignette */}
            <div className="relative h-96 w-full overflow-hidden border border-ink-fade group rounded-md">
              <img
                src={heroImg}
                alt="Executive Coach"
                className="h-full w-full object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-ink/10 mix-blend-multiply"></div>
              <div className="absolute bottom-3 left-3 bg-paper border border-ink-fade px-3 py-1 text-[9px] uppercase font-bold tracking-wider text-ink shadow-sm">
                {language === 'en' ? 'Starlink Flagship Coach No. 7' : 'Basi ya Starlink No. 7'}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
