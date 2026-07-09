/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bus, ShieldCheck, Heart, Users, Star, ArrowRight, Phone, MessageSquare, 
  MapPin, Clock, Award, Sparkles, AlertCircle, RefreshCw, Zap, Coffee,
  Wifi, Armchair, ThermometerSun, ChevronDown, ChevronUp, Calendar,
  ArrowLeftRight, User, Bell, Ticket, Plus, Minus, Search, Compass, HelpCircle, CheckSquare, Settings, ChevronRight, Home
} from 'lucide-react';

import Header from './components/Header';
import Footer from './components/Footer';
import YavaLogo from './components/YavaLogo';
import BottomNavbar from './components/BottomNavbar';
import { useLanguage } from './context/LanguageContext';

const Hero = lazy(() => import('./components/Hero'));
const RoutesSchedule = lazy(() => import('./components/RoutesSchedule'));
const BookingForm = lazy(() => import('./components/BookingForm'));
const AboutSection = lazy(() => import('./components/AboutSection'));
const ContactSection = lazy(() => import('./components/ContactSection'));
const MyBookings = lazy(() => import('./components/MyBookings'));
const ManagementPanel = lazy(() => import('./components/ManagementPanel'));

import { RouteInfo, BookingRequest, MAIN_ROUTES, CUSTOMER_TESTIMONIALS, FLEET_FEATURES, OFFICE_CONTACTS } from './data';

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] py-16 text-[#0b1d3a]">
    <div className="relative flex items-center justify-center">
      {/* Outer spinning ring */}
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold/20 border-t-gold"></div>
      {/* Inner pulsing icon */}
      <div className="absolute animate-pulse">
        <Bus className="h-5 w-5 text-gold" />
      </div>
    </div>
    <span className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1d3a]/60 animate-pulse">
      Loading Executive Service...
    </span>
  </div>
);

const FeatureIcon = ({ iconName, className }: { iconName: string; className?: string }) => {
  switch (iconName) {
    case 'Wifi':
      return <Wifi className={className} />;
    case 'Armchair':
      return <Armchair className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Coffee':
      return <Coffee className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'ThermometerSun':
    default:
      return <ThermometerSun className={className} />;
  }
};

export default function App() {
  const { language, setLanguage } = useLanguage();
  const [showLanguagePrompt, setShowLanguagePrompt] = useState<boolean>(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('yava_language');
    if (!savedLang) {
      setShowLanguagePrompt(true);
    }
  }, []);

  const [currentView, setCurrentView] = useState<string>('home');
  const [prefilledRoute, setPrefilledRoute] = useState<RouteInfo | null>(null);
  const [prefilledQuery, setPrefilledQuery] = useState<{ departure: string; destination: string; date: string; passengers?: number } | null>(null);
  const [prefilledRoundTrip, setPrefilledRoundTrip] = useState<boolean>(false);
  const [bookingCount, setBookingCount] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [openFeatureIndex, setOpenFeatureIndex] = useState<number | null>(0);
  const [openWhyIndex, setOpenWhyIndex] = useState<number | null>(0);
  const [yavaStandardsOpen, setYavaStandardsOpen] = useState<boolean>(false);
  const [travelerVoicesOpen, setTravelerVoicesOpen] = useState<boolean>(false);
  const homeDate = new Date().toISOString().split('T')[0];
  const popularRoutesRef = useRef<HTMLDivElement>(null);
  
  const [reviews, setReviews] = useState(CUSTOMER_TESTIMONIALS);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewText, setNewReviewText] = useState('');

  const [activeRoutes, setActiveRoutes] = useState<RouteInfo[]>(MAIN_ROUTES);
  const [operatorSearchQuery, setOperatorSearchQuery] = useState('');

  useEffect(() => {
    const loadRoutes = () => {
      try {
        const stored = localStorage.getItem('yava_routes');
        if (stored) {
          setActiveRoutes(JSON.parse(stored));
        } else {
          setActiveRoutes(MAIN_ROUTES);
          localStorage.setItem('yava_routes', JSON.stringify(MAIN_ROUTES));
        }
      } catch (err) {
        console.error('Failed to load routes in home', err);
      }
    };
    loadRoutes();
    window.addEventListener('storage', loadRoutes);
    return () => window.removeEventListener('storage', loadRoutes);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('yava_reviews');
      if (saved) {
        setReviews(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load reviews', e);
    }
  }, []);

  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [isBookingsExpanded, setIsBookingsExpanded] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Popular Routes automatic horizontal scrolling with user-scroll bypass and pause-on-interaction
  useEffect(() => {
    if (currentView !== 'home') return;
    const container = popularRoutesRef.current;
    if (!container) return;

    let intervalId: NodeJS.Timeout;
    let isUserInteracting = false;
    let userInteractionTimeout: NodeJS.Timeout;

    const handleUserInteraction = () => {
      isUserInteracting = true;
      clearTimeout(userInteractionTimeout);
      // Resume auto-scrolling after 8 seconds of no user interaction
      userInteractionTimeout = setTimeout(() => {
        isUserInteracting = false;
      }, 8000);
    };

    container.addEventListener('touchstart', handleUserInteraction, { passive: true });
    container.addEventListener('mousedown', handleUserInteraction);
    container.addEventListener('wheel', handleUserInteraction, { passive: true });

    const autoScroll = () => {
      if (isUserInteracting) return;

      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const maxScrollLeft = scrollWidth - clientWidth;
      
      if (maxScrollLeft <= 0) return;

      // Find card width (first child width + gap, defaulting to 336px if first child isn't rendered yet)
      const firstChild = container.children[0] as HTMLElement;
      const scrollStep = firstChild ? firstChild.clientWidth + 16 : 336;

      let targetScrollLeft = container.scrollLeft + scrollStep;

      // If we are close to the end, wrap smoothly back to the beginning
      if (targetScrollLeft >= maxScrollLeft + 5) {
        targetScrollLeft = 0;
      }

      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
    };

    // Auto scroll every 3.5 seconds
    intervalId = setInterval(autoScroll, 3500);

    return () => {
      clearInterval(intervalId);
      clearTimeout(userInteractionTimeout);
      container.removeEventListener('touchstart', handleUserInteraction);
      container.removeEventListener('mousedown', handleUserInteraction);
      container.removeEventListener('wheel', handleUserInteraction);
    };
  }, [currentView]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBookingsExpanded(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddReview = () => {
    if (!newReviewText.trim()) return;
    
    const newReview = {
      name: newReviewName.trim() || 'Anonymous Traveler',
      role: 'Valued Passenger',
      comment: newReviewText.trim(),
      rating: 5,
      date: 'Just now'
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    setNewReviewText('');
    setNewReviewName('');
    
    try {
      localStorage.setItem('yava_reviews', JSON.stringify(updatedReviews));
    } catch (e) {
      console.error('Failed to save review', e);
    }
  };

  const navigateTo = (view: string) => {
    if (view !== currentView) {
      setCurrentView(view);
      window.history.pushState({ view }, '', `?view=${view}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view') || 'home';
    setCurrentView(view);
    window.history.replaceState({ view }, '', `?view=${view}`);

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        setCurrentView(urlParams.get('view') || 'home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync Booking Count on Load and after updates
  const syncBookingCount = () => {
    try {
      const current = JSON.parse(localStorage.getItem('yava_bookings') || '[]');
      setBookingCount(current.length);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Failed to sync bookings count', err);
    }
  };

  useEffect(() => {
    syncBookingCount();
    window.addEventListener('storage', syncBookingCount);
    return () => window.removeEventListener('storage', syncBookingCount);
  }, []);

  const handleNavigateToBooking = (queryPrefill?: { departure: string; destination: string; date: string; passengers?: number }, isRoundTrip: boolean = false) => {
    setPrefilledRoute(null);
    if (queryPrefill) {
      setPrefilledQuery(queryPrefill);
    } else {
      setPrefilledQuery(null);
    }
    setPrefilledRoundTrip(isRoundTrip);
    navigateTo('book');
  };

  const handleSelectRouteFromSchedule = (route: RouteInfo) => {
    setPrefilledQuery(null);
    setPrefilledRoundTrip(false);
    setPrefilledRoute(route);
    navigateTo('book');
  };

  const filteredRoutes = activeRoutes.filter((route) => {
    if (!operatorSearchQuery) return true;
    const query = operatorSearchQuery.toLowerCase();
    return (
      route.departureCity.toLowerCase().includes(query) ||
      route.destinationCity.toLowerCase().includes(query) ||
      route.serviceType.toLowerCase().includes(query) ||
      route.pickupLocation.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-paper text-ink selection:bg-gold selection:text-white">
      
      {/* Persistent Navigation Header */}
      <Header 
        currentView={currentView} 
        onViewChange={(view) => {
          setPrefilledRoute(null);
          setPrefilledQuery(null);
          navigateTo(view);
        }}
        openBookingHistory={() => {
          navigateTo('bookings');
        }}
        bookingCount={bookingCount}
      />

      {/* Main View Router */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="pb-24"
            >
              {/* Hero Banner Section */}
              <Suspense fallback={<LoadingFallback />}>
                <Hero 
                  onNavigateToBooking={(query) => {
                    handleNavigateToBooking(query);
                  }}
                  onNavigateToSchedule={() => navigateTo('operators')}
                />
              </Suspense>

              {/* 4. Popular Routes */}
              <section className="py-10 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-black uppercase tracking-wider text-navy">
                      {language === 'en' ? 'Popular Routes' : 'Maulendo Ambiri'}
                    </h2>
                    <button
                      onClick={() => navigateTo('operators')}
                      className="text-xs font-bold text-[#FF5A1F] hover:underline flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>{language === 'en' ? 'Browse Operators' : 'Onani mabasi'}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Horizontal Scroll Grid of Route Cards */}
                  <div 
                    ref={popularRoutesRef}
                    className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-gray-200"
                  >
                    <div 
                      onClick={() => handleNavigateToBooking({ departure: 'Lilongwe', destination: 'Blantyre', date: homeDate, passengers: 1 })}
                      className="min-w-[280px] sm:min-w-[320px] bg-gray-50 hover:bg-[#062A73]/5 border border-gray-100 rounded-2xl p-5 shrink-0 snap-start cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full bg-[#062A73]/10 text-[#062A73]">Daily</span>
                        <span className="text-xs font-bold text-[#FF5A1F]">{language === 'en' ? 'From' : 'Kuyambira'} MK35,000</span>
                      </div>
                      <h3 className="text-base font-bold text-[#062A73] flex items-center gap-2">
                        <span>Lilongwe</span>
                        <ArrowRight className="h-4 w-4 text-[#FF5A1F]" />
                        <span>Blantyre</span>
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>4.5 Hours &bull; Executive Cabin</span>
                      </p>
                    </div>

                    <div 
                      onClick={() => handleNavigateToBooking({ departure: 'Blantyre', destination: 'Lilongwe', date: homeDate, passengers: 1 })}
                      className="min-w-[280px] sm:min-w-[320px] bg-gray-50 hover:bg-[#062A73]/5 border border-gray-100 rounded-2xl p-5 shrink-0 snap-start cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full bg-[#062A73]/10 text-[#062A73]">Daily</span>
                        <span className="text-xs font-bold text-[#FF5A1F]">{language === 'en' ? 'From' : 'Kuyambira'} MK35,000</span>
                      </div>
                      <h3 className="text-base font-bold text-[#062A73] flex items-center gap-2">
                        <span>Blantyre</span>
                        <ArrowRight className="h-4 w-4 text-[#FF5A1F]" />
                        <span>Lilongwe</span>
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>4.5 Hours &bull; Executive Cabin</span>
                      </p>
                    </div>

                    <div 
                      onClick={() => handleNavigateToBooking({ departure: 'Lilongwe', destination: 'Blantyre', date: homeDate, passengers: 1 })}
                      className="min-w-[280px] sm:min-w-[320px] bg-gray-50 hover:bg-[#062A73]/5 border border-gray-100 rounded-2xl p-5 shrink-0 snap-start cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full bg-orange-100 text-[#FF5A1F]">VIP Promo</span>
                        <span className="text-xs font-bold text-[#FF5A1F]">From MK45,000</span>
                      </div>
                      <h3 className="text-base font-bold text-[#062A73] flex items-center gap-2">
                        <span>Lilongwe</span>
                        <ArrowRight className="h-4 w-4 text-[#FF5A1F]" />
                        <span>Blantyre</span>
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>4.5 Hours &bull; VIP Club Class</span>
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. Travel Today */}
              <section className="py-8 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="mb-5 text-left">
                    <h2 className="text-lg font-black uppercase tracking-wider text-navy">
                      {language === 'en' ? 'Travel Today' : 'Yendani Lero'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'en' ? 'Quick departures with immediate seats confirmation' : 'Zokwerera mwachangu ndi chitsimikizo cha mipando yomweyo'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Departure Card 1 */}
                    <div className="bg-white rounded-2xl border border-gray-100/70 p-5 flex items-center justify-between shadow-sm">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-orange-100 text-[#FF5A1F]">Starlink</span>
                          <span className="text-xs font-bold text-[#062A73]">07:30 AM</span>
                        </div>
                        <h3 className="text-sm font-bold text-navy flex items-center gap-1.5">
                           <span>Lilongwe</span>
                           <ArrowRight className="h-3 w-3 text-gray-400" />
                           <span>Blantyre</span>
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                          <span className="text-[#FF5A1F] font-bold">3 Seats left</span>
                          <span>&bull; Standard Luxury</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleNavigateToBooking({ departure: 'Lilongwe', destination: 'Blantyre', date: new Date().toISOString().split('T')[0], passengers: 1 })}
                        className="bg-[#062A73] hover:bg-[#FF5A1F] text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
                      >
                        {language === 'en' ? 'Book' : 'Kwera'}
                      </button>
                    </div>

                    {/* Departure Card 2 */}
                    <div className="bg-white rounded-2xl border border-gray-100/70 p-5 flex items-center justify-between shadow-sm">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-orange-100 text-[#FF5A1F]">Starlink</span>
                          <span className="text-xs font-bold text-[#062A73]">02:00 PM</span>
                        </div>
                        <h3 className="text-sm font-bold text-navy flex items-center gap-1.5">
                           <span>Blantyre</span>
                           <ArrowRight className="h-3 w-3 text-gray-400" />
                           <span>Lilongwe</span>
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                          <span className="text-emerald-600 font-bold">12 Seats left</span>
                          <span>&bull; VIP Club Class</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleNavigateToBooking({ departure: 'Blantyre', destination: 'Lilongwe', date: new Date().toISOString().split('T')[0], passengers: 1 })}
                        className="bg-[#062A73] hover:bg-[#FF5A1F] text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
                      >
                        {language === 'en' ? 'Book' : 'Kwera'}
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* 6. Featured Operators Section */}
              <section className="py-10 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="mb-6 text-left">
                    <h2 className="text-lg font-black uppercase tracking-wider text-navy">
                      {language === 'en' ? 'Featured Operators' : 'Makampani a Mabasi'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'en' ? 'We partner with the safest, certified intercity fleets' : 'Timagwira ntchito ndi mabasi otetezeka komanso ovomerezeka'}
                    </p>
                  </div>

                  {/* Two Cards per Row Layout */}
                  <div className="grid grid-cols-2 gap-4">
                    
                    {/* Starlink Card */}
                    <div 
                      onClick={() => navigateTo('operators')}
                      className="bg-white border border-gray-300 rounded-2xl p-4 text-left shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.16)] hover:border-[#FF5A1F]/30 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-10 w-10 bg-[#062A73] text-white rounded-xl flex items-center justify-center font-bold text-sm mb-3 shadow-sm">
                          SL
                        </div>
                        <h3 className="text-xs sm:text-sm font-black text-navy leading-tight">Starlink Tours</h3>
                        <span className="text-[10px] text-gray-400 block mt-1">18 Routes Available</span>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-50">
                        <div className="flex items-center text-amber-500 text-[10px]">
                          ★ 5.0
                        </div>
                        <span className="text-[10px] font-bold text-[#FF5A1F] flex items-center gap-0.5">
                          <span>View</span>
                          <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>

                    {/* AXA Card */}
                    <div 
                      onClick={() => alert('AXA Coaches integration is coming soon in Phase 2!')}
                      className="bg-white border border-gray-300 rounded-2xl p-4 text-left shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.16)] hover:border-[#FF5A1F]/30 transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <div className="h-10 w-10 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center font-bold text-sm mb-3">
                          AX
                        </div>
                        <h3 className="text-xs sm:text-sm font-black text-gray-400 leading-tight">AXA Coaches</h3>
                        <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-gray-50 text-gray-400 inline-block mt-1">Coming Soon</span>
                      </div>
                      <div className="mt-4 pt-2 border-t border-gray-50">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            alert('You will be notified once AXA Coaches starts booking!');
                          }}
                          className="w-full py-1.5 bg-gray-50 hover:bg-[#FF5A1F] hover:text-white text-gray-500 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                        >
                          Notify Me
                        </button>
                      </div>
                    </div>

                    {/* Kwezy Card */}
                    <div 
                      onClick={() => alert('Kwezy Bus Services integration is coming soon in Phase 2!')}
                      className="bg-white border border-gray-300 rounded-2xl p-4 text-left shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.16)] hover:border-[#FF5A1F]/30 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-10 w-10 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center font-bold text-sm mb-3">
                          KZ
                        </div>
                        <h3 className="text-xs sm:text-sm font-black text-gray-400 leading-tight">Kwezy Bus</h3>
                        <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-gray-50 text-gray-400 inline-block mt-1">Coming Soon</span>
                      </div>
                      <div className="mt-4 pt-2 border-t border-gray-50">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            alert('You will be notified once Kwezy Bus Services starts booking!');
                          }}
                          className="w-full py-1.5 bg-gray-50 hover:bg-[#FF5A1F] hover:text-white text-gray-500 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                        >
                          Notify Me
                        </button>
                      </div>
                    </div>

                    {/* Sososo Card */}
                    <div 
                      className="bg-white border border-gray-300 rounded-2xl p-4 text-left shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.16)] flex flex-col justify-between opacity-80"
                    >
                      <div>
                        <div className="h-10 w-10 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center font-bold text-sm mb-3">
                          SS
                        </div>
                        <h3 className="text-xs sm:text-sm font-black text-gray-400 leading-tight">Sososo Coaches</h3>
                        <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-gray-50 text-gray-400 inline-block mt-1">Coming Soon</span>
                      </div>
                      <div className="mt-4 pt-2 border-t border-gray-50">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            alert('You will be notified once Sososo Coaches starts booking!');
                          }}
                          className="w-full py-1.5 bg-gray-50 hover:bg-[#FF5A1F] hover:text-white text-gray-500 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                        >
                          Notify Me
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* View All Button */}
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => navigateTo('operators')}
                      className="px-6 py-2.5 border-2 border-[#FF5A1F] text-[#FF5A1F] hover:bg-[#FF5A1F] hover:text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                    >
                      {language === 'en' ? 'View All' : 'Onetsani Onse'}
                    </button>
                  </div>
                </div>
              </section>

              {/* 7. Why YAVA? Section */}
              <section className="py-12 bg-gray-50">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
                  <h2 className="text-lg font-black uppercase tracking-wider text-navy mb-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                    {language === 'en' ? (
                      <>
                        <span>Why Travel With</span>
                        <YavaLogo className="h-5 sm:h-6 w-auto align-middle" navyColor="#0B2E6D" orangeColor="#F15A24" height="100%" />
                        <span>?</span>
                      </>
                    ) : (
                      <>
                        <span>Chifukwa Chiyani Musankhe</span>
                        <YavaLogo className="h-5 sm:h-6 w-auto align-middle" navyColor="#0B2E6D" orangeColor="#F15A24" height="100%" />
                        <span>?</span>
                      </>
                    )}
                  </h2>

                  <div className="space-y-4 text-left">
                    {[
                      {
                        id: 0,
                        icon: ShieldCheck,
                        titleEn: "Secure Booking",
                        titleNy: "Kusungitsa Motetezeka",
                        descEn: "We use state-of-the-art secure reservation protocols to guarantee your seat and protect your personal information.",
                        descNy: "Timagwiritsa ntchito njira zodalirika zotetezedwa kuti titsimikizire mpando wanu komanso kuteteza zambiri zanu."
                      },
                      {
                        id: 1,
                        icon: Bus,
                        titleEn: "Multiple Operators",
                        titleNy: "Makampani Osiyanasiyana",
                        descEn: "Browse and compare schedules across multiple premium intercity coach operators in Malawi from a single platform.",
                        descNy: "Sakatulani ndi kufananiza nthawi zoyendera zamakampani osiyanasiyana amabasi m'Malawi pamalo amodzi."
                      },
                      {
                        id: 2,
                        icon: Ticket,
                        titleEn: "Instant Tickets",
                        titleNy: "Matikiti Nthawi Yomweyo",
                        descEn: "Get instant confirmation and download your boarding request pass immediately. No long physical queues required.",
                        descNy: "Pezani chitsimikiziro nthawi yomweyo ndipo tsitsani pasipoti yanu. Palibe chifukwa chodikirira pamzere wautali."
                      },
                      {
                        id: 3,
                        icon: Phone,
                        titleEn: "24/7 Support",
                        titleNy: "Thandizo la Maola 24/7",
                        descEn: "Our customer service dispatch desk and active crew are always available online via WhatsApp to assist your journey.",
                        descNy: "Othandizira athu komanso ogwira ntchito ali ndi inu nthawi zonse pa WhatsApp kuti akuthandizeni pa ulendo wanu."
                      }
                    ].map((item) => {
                      const IconComponent = item.icon;
                      const isOpen = openWhyIndex === item.id;
                      return (
                        <div 
                          key={item.id}
                          className="bg-white border border-gray-200/80 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)] transition-all duration-200"
                        >
                          <button
                            onClick={() => setOpenWhyIndex(isOpen ? null : item.id)}
                            className="w-full px-5 py-4 flex items-center justify-between gap-4 font-bold text-navy hover:text-[#FF5A1F] transition-colors cursor-pointer text-left focus:outline-none"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-[#FF5A1F]/10 text-[#FF5A1F]' : 'bg-gray-100 text-[#062A73]'}`}>
                                <IconComponent className="h-5 w-5 stroke-[1.8]" />
                              </div>
                              <span className="text-xs sm:text-sm uppercase tracking-wider">
                                {language === 'en' ? item.titleEn : item.titleNy}
                              </span>
                            </div>
                            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#FF5A1F]' : ''}`} />
                          </button>
                          
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100/50">
                                  {language === 'en' ? item.descEn : item.descNy}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Instant WhatsApp Support Widget */}
              <section className="py-6 px-4 max-w-7xl mx-auto">
                <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left space-y-1">
                    <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-2">
                      <MessageSquare className="h-4 w-4 fill-emerald-800 text-emerald-800" />
                      <span>WhatsApp Reservation</span>
                    </h3>
                    <p className="text-xs text-emerald-800">
                      {language === 'en' ? 'Need helper boarding? Chat directly with our dispatch Desk.' : 'Mukufuna thandizo? Lankhulani nafe pa WhatsApp nthawi yomweyo.'}
                    </p>
                  </div>
                  <a
                    href="https://wa.me/265995446426"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md shadow-emerald-600/10"
                  >
                    Chat Desk
                  </a>
                </div>
              </section>

            </motion.div>
          )}

          {currentView === 'operators' && (
            <motion.div
              key="operators"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="pb-24 px-4 pt-6 max-w-4xl mx-auto text-left"
            >
              <div className="mb-6">
                <h1 className="serif text-3xl font-black text-[#062A73]">Bus Operators</h1>
                <p className="text-xs text-gray-500 mt-1">Browse active executive carrier fleets and select routes schedule to book</p>
                
                {/* Modern Elegant Search Bar */}
                <div className="relative mt-4">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    value={operatorSearchQuery}
                    onChange={(e) => setOperatorSearchQuery(e.target.value)}
                    placeholder={language === 'en' ? "Search departures, cities or service type (e.g., Blantyre, VIP)..." : "Fufuzani kumene mukupita kapena mtundu wa basi..."}
                    className="w-full bg-white border border-gray-150 rounded-2xl py-3.5 pl-10 pr-10 text-xs text-[#062A73] placeholder-gray-400 focus:outline-none focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] shadow-sm transition-all"
                  />
                  {operatorSearchQuery && (
                    <button
                      onClick={() => setOperatorSearchQuery('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-navy cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Starlink Tours Active Profile */}
              <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm mb-6">
                <div className="h-32 bg-[#062A73] p-6 flex flex-col justify-end text-white relative">
                  <div className="absolute top-4 right-4 bg-[#FF5A1F] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Fully Integrated
                  </div>
                  <h2 className="serif text-2xl font-bold">Starlink Tours</h2>
                  <p className="text-xs text-white/80">Malawi&apos;s Premium Luxury Highway Cruiser</p>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Starlink Tours provides reliable executive intercity highway transports. Certified speed governors capped strictly at 80km/h, expert long-distance drivers, VIP leather recliners, onboard restrooms, USB chargers, and complimentary satellite internet.
                  </p>

                  <h3 className="text-xs font-black uppercase tracking-wider text-[#062A73] border-b border-gray-100 pb-2">
                    Available Departure Timetables:
                  </h3>

                  <div className="space-y-3">
                    {filteredRoutes.length > 0 ? (
                      filteredRoutes.map((route) => (
                        <div key={route.id} className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-gray-200 transition-all">
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#062A73]/15 text-[#062A73]">
                              {route.serviceType}
                            </span>
                            <h4 className="text-sm font-bold text-navy flex items-center gap-1.5">
                              <span>{route.departureCity}</span>
                              <ArrowRight className="h-3.5 w-3.5 text-[#FF5A1F]" />
                              <span>{route.destinationCity}</span>
                            </h4>
                            <div className="flex items-center gap-3 text-[10px] text-gray-500">
                              <span>Departure: {route.departureTime}</span>
                              <span>&bull;</span>
                              <span>Pickup: {route.pickupLocation.split(',')[0]}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-50">
                            <div>
                              <span className="text-[10px] text-gray-400 block text-left sm:text-right">Standard Cabin</span>
                              <span className="text-sm font-black text-[#062A73]">MK{route.fareStandard.toLocaleString()}</span>
                            </div>
                            <button
                              onClick={() => handleSelectRouteFromSchedule(route)}
                              className="bg-[#FF5A1F] hover:bg-[#e04f1a] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Book Seat
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 border border-dashed border-gray-150 rounded-xl">
                        <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 font-bold">
                          {language === 'en' ? 'No timetables match your search query' : 'Palibe ndondomeko yogwirizana ndi fufuzidwe yanu'}
                        </p>
                        <button
                          onClick={() => setOperatorSearchQuery('')}
                          className="text-xs text-[#FF5A1F] font-bold mt-1.5 underline cursor-pointer"
                        >
                          {language === 'en' ? 'Reset search filter' : 'Bwererani pambuyo'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Inactive Coming Soon Operators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 opacity-75">
                  <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gray-200 text-gray-500 inline-block mb-3">Coming Soon</span>
                  <h3 className="text-base font-black text-gray-500">AXA Coaches</h3>
                  <p className="text-xs text-gray-400 mt-2">Integrating premium intercity schedules between Blantyre and Mzuzu in Phase 2 launch.</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 opacity-75">
                  <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gray-200 text-gray-500 inline-block mb-3">Coming Soon</span>
                  <h3 className="text-base font-black text-gray-500">Kwezy Bus Services</h3>
                  <p className="text-xs text-gray-400 mt-2">Integrating modern business class runs between Lilongwe and Mzuzu in upcoming updates.</p>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="pb-24 px-4 pt-6 max-w-md mx-auto text-left"
            >
              <div className="mb-6">
                <h1 className="serif text-3xl font-black text-[#062A73]">Your Profile</h1>
                <p className="text-xs text-gray-500 mt-1">Manage your traveler profiles, ticket records, and platform settings</p>
              </div>

              {/* Profile Main Card */}
              <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4 mb-6">
                <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
                  <div className="h-16 w-16 bg-[#062A73]/10 rounded-full flex items-center justify-center text-[#062A73] font-bold text-xl">
                    <User className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-navy">Valued YAVA Traveler</h2>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block mt-0.5">Malawi Highway Loyalty Club</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Quick Booking Auto-Fill:</span>
                    <p className="text-xs text-gray-500 mb-3">Your default traveler details are securely stored inside your local cache for swift boarding passes generation.</p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] uppercase font-black text-gray-400 block mb-1">Default Full Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Chikondi Phiri"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#FF5A1F]"
                          defaultValue="Chikondi Phiri"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-black text-gray-400 block mb-1">Default Phone Number</label>
                        <input
                          type="text"
                          placeholder="e.g. +265 995 44 64 26"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#FF5A1F]"
                          defaultValue="+265 995 44 64 26"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help & Settings */}
              <div className="space-y-3">
                <button
                  onClick={() => navigateTo('bookings')}
                  className="w-full bg-white border border-gray-150 hover:border-[#FF5A1F]/40 p-4 rounded-xl flex items-center justify-between text-left shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-orange-50 text-[#FF5A1F] rounded-xl flex items-center justify-center">
                      <Ticket className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-navy uppercase tracking-wider">My Boarding passes</h3>
                      <span className="text-[10px] text-gray-400 block mt-0.5">View your scheduled or previous bookings ({bookingCount})</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>

                <div className="bg-white border border-gray-150 p-4 rounded-xl shadow-sm space-y-4">
                  <h3 className="text-xs font-black text-navy uppercase tracking-wider border-b border-gray-50 pb-2">Platform Settings</h3>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Notification Alerts</span>
                    <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">● Enabled</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Default Currency</span>
                    <span className="text-gray-900 font-bold">MWK (Malawian Kwacha)</span>
                  </div>
                </div>

                {/* Administrator Panel Direct Gateway */}
                <button
                  onClick={() => navigateTo('management')}
                  className="w-full bg-[#062A73] hover:bg-[#FF5A1F] text-white p-4 rounded-xl flex items-center justify-between text-left shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white/10 text-white rounded-xl flex items-center justify-center">
                      <Settings className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-white">Admin Dispatch Gate</h3>
                      <span className="text-[10px] text-white/70 block mt-0.5">Access office manifest and fleet dispatch control desk</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/80" />
                </button>
              </div>
            </motion.div>
          )}

          {currentView === 'routes' && (
            <motion.div
              key="routes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Suspense fallback={<LoadingFallback />}>
                <RoutesSchedule onSelectRoute={handleSelectRouteFromSchedule} />
              </Suspense>
            </motion.div>
          )}

          {currentView === 'book' && (
            <motion.div
              key="book"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Suspense fallback={<LoadingFallback />}>
                <BookingForm 
                  prefilledRoute={prefilledRoute} 
                  prefilledQuery={prefilledQuery}
                  prefilledRoundTrip={prefilledRoundTrip}
                  onBookingAdded={syncBookingCount}
                />
              </Suspense>
            </motion.div>
          )}

          {currentView === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Suspense fallback={<LoadingFallback />}>
                <AboutSection />
              </Suspense>
            </motion.div>
          )}

          {currentView === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Suspense fallback={<LoadingFallback />}>
                <ContactSection />
              </Suspense>
            </motion.div>
          )}

          {currentView === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Suspense fallback={<LoadingFallback />}>
                <MyBookings 
                  onNavigateToBooking={() => handleNavigateToBooking()}
                  onRefreshTrigger={refreshTrigger}
                />
              </Suspense>
            </motion.div>
          )}

          {currentView === 'management' && (
            <motion.div
              key="management"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Suspense fallback={<LoadingFallback />}>
                <ManagementPanel />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistent Footer */}
      <Footer onViewChange={(view) => {
        setPrefilledRoute(null);
        setPrefilledQuery(null);
        navigateTo(view);
      }} />

      {/* Redesigned Premium Sticky Bottom Navigation Bar */}
      <BottomNavbar
        currentView={currentView}
        navigateTo={navigateTo}
        setPrefilledRoute={setPrefilledRoute}
        setPrefilledQuery={setPrefilledQuery}
      />

      {/* Floating Action Buttons (Bottom Right) */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-45 flex flex-col gap-3.5 items-end">
        {/* Back to Top (Gold) */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              key="back-to-top"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex h-11 w-11 items-center justify-center bg-gold hover:bg-neutral-900 border border-gold/30 text-white shadow-xl transition-all duration-300 cursor-pointer rounded-md"
              title="Back to Top"
            >
              <ChevronUp className="h-5.5 w-5.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* First-Time User Language Selection Prompt */}
      <AnimatePresence>
        {showLanguagePrompt && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-lg bg-[#0b1d3a] border border-gold/40 p-8 sm:p-10 text-center space-y-8 shadow-2xl z-10 rounded-md"
            >
              {/* YAVA Logo & Icon */}
              <div className="flex flex-col items-center space-y-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-neutral-900 border-2 border-gold text-gold shadow-lg">
                  <Bus className="h-8 w-8 stroke-[1.5] animate-pulse" />
                </div>
                <div>
                  <YavaLogo monoColor="#ffffff" height={30} className="block mx-auto mb-1.5" />
                  <span className="block text-[10px] uppercase tracking-[0.3em] text-gold font-bold">
                    Malawi &bull; Executive Coach
                  </span>
                </div>
              </div>

              {/* Bilingual Message */}
              <div className="space-y-4 py-2 border-t border-b border-white/10">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white tracking-wide">
                    Choose your primary language to begin
                  </p>
                  <p className="text-xs text-white/70">
                    Welcome to Malawi's premier intercity luxury travel platform.
                  </p>
                </div>
                <div className="h-[1px] w-12 bg-gold/30 mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gold tracking-wide">
                    Sankhani chilankhulo chanu choyamba
                  </p>
                  <p className="text-xs text-white/60">
                    Takulandirani ku mtundu woyamba wa mabasi amakono ku Malawi.
                  </p>
                </div>
              </div>

              {/* Language Selection Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setLanguage('en');
                    setShowLanguagePrompt(false);
                  }}
                  className="flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-gold hover:text-neutral-900 text-white border border-white/15 hover:border-gold rounded-md transition-all duration-300 group cursor-pointer"
                >
                  <span className="text-base font-bold tracking-wider">English</span>
                  <span className="text-[9px] uppercase tracking-widest opacity-60 group-hover:opacity-100 mt-1">
                    Continue in English
                  </span>
                </button>

                <button
                  onClick={() => {
                    setLanguage('ny');
                    setShowLanguagePrompt(false);
                  }}
                  className="flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-gold hover:text-neutral-900 text-gold border border-gold/30 hover:border-gold rounded-md transition-all duration-300 group cursor-pointer"
                >
                  <span className="text-base font-bold tracking-wider text-white group-hover:text-neutral-900">Chichewa</span>
                  <span className="text-[9px] uppercase tracking-widest text-gold group-hover:text-neutral-900 opacity-80 group-hover:opacity-100 mt-1">
                    Pitilizani mu Chichewa
                  </span>
                </button>
              </div>

              {/* Decorative note */}
              <p className="text-[9px] text-white/40 tracking-wider uppercase">
                You can change your language preference at any time from the menu bar
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
