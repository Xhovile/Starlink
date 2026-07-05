/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bus, ShieldCheck, Heart, Users, Star, ArrowRight, Phone, MessageSquare, 
  MapPin, Clock, Award, Sparkles, AlertCircle, RefreshCw, Zap, Coffee,
  Wifi, Armchair, ThermometerSun, ChevronDown, ChevronUp, Calendar
} from 'lucide-react';

import Header from './components/Header';
import Footer from './components/Footer';
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
    const savedLang = localStorage.getItem('starlink_language');
    if (!savedLang) {
      setShowLanguagePrompt(true);
    }
  }, []);

  const [currentView, setCurrentView] = useState<string>('home');
  const [prefilledRoute, setPrefilledRoute] = useState<RouteInfo | null>(null);
  const [prefilledQuery, setPrefilledQuery] = useState<{ departure: string; destination: string; date: string } | null>(null);
  const [prefilledRoundTrip, setPrefilledRoundTrip] = useState<boolean>(false);
  const [bookingCount, setBookingCount] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [openFeatureIndex, setOpenFeatureIndex] = useState<number | null>(0);
  const [starlinkStandardsOpen, setStarlinkStandardsOpen] = useState<boolean>(false);
  const [travelerVoicesOpen, setTravelerVoicesOpen] = useState<boolean>(false);
  
  const [reviews, setReviews] = useState(CUSTOMER_TESTIMONIALS);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewText, setNewReviewText] = useState('');

  const [activeRoutes, setActiveRoutes] = useState<RouteInfo[]>(MAIN_ROUTES);

  useEffect(() => {
    const loadRoutes = () => {
      try {
        const stored = localStorage.getItem('starlink_routes');
        if (stored) {
          setActiveRoutes(JSON.parse(stored));
        } else {
          setActiveRoutes(MAIN_ROUTES);
          localStorage.setItem('starlink_routes', JSON.stringify(MAIN_ROUTES));
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
      const saved = localStorage.getItem('starlink_reviews');
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
      localStorage.setItem('starlink_reviews', JSON.stringify(updatedReviews));
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
      const current = JSON.parse(localStorage.getItem('starlink_bookings') || '[]');
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

  const handleNavigateToBooking = (queryPrefill?: { departure: string; destination: string; date: string }, isRoundTrip: boolean = false) => {
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

  return (
    <div className="flex flex-col min-h-screen bg-paper text-ink selection:bg-gold selection:text-white">
      
      {/* Top Banner Notice */}
      <div className="bg-ink text-paper border-b border-ink-fade py-2.5 px-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] relative z-50">
        <span className="flex items-center justify-center gap-1.5 flex-wrap">
          <span className="text-gold">&bull;</span>
          <span>{language === 'en' ? 'Daily Departures Blantyre ⇄ Lilongwe' : 'Ulendowu Tsiku Lililonse Blantyre ⇄ Lilongwe'}</span>
          <span className="text-gold">&bull;</span>
          <span className="text-gold">{language === 'en' ? 'Executive VIP Fare Promotion Active' : 'Zotsatsa za VIP Exec Ndizololeka Tsopano'}</span>
        </span>
      </div>

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
            >
              {/* Hero Banner Section */}
              <Suspense fallback={<LoadingFallback />}>
                <Hero 
                  onNavigateToBooking={handleNavigateToBooking}
                  onNavigateToSchedule={() => navigateTo('routes')}
                />
              </Suspense>

              {/* Home Main Sections on Dodger Blue Background */}
              <div className="bg-[#1e90ff] text-ink border-t border-ink-fade">
                
                {/* Featured Routes Cards */}
                <section className="py-16 bg-transparent border-b border-ink-fade">
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
                      <div className="max-w-2xl text-left">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-black">Featured Route Rates</span>
                        <h2 className="serif text-3xl sm:text-4xl font-bold text-white mt-2 tracking-tight">
                          Daily Direct Scheduled Departures
                        </h2>
                      </div>
                      <button
                        onClick={() => navigateTo('routes')}
                        className="text-black hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                        id="explore-routes-nav-btn"
                      >
                        <span>Explore all route timetables</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Routes Quick Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {activeRoutes.slice(0, 2).map((route) => (
                        <div 
                          key={route.id}
                          className="bg-[#B5C7EB] border border-gold/30 hover:border-gold rounded-md p-8 transition-all relative overflow-hidden flex flex-col justify-between shadow-lg text-ink"
                        >
                          <div className="absolute top-0 right-0 bg-gold text-neutral-900 font-bold text-[9px] tracking-widest uppercase px-4 py-2">
                            {route.serviceType}
                          </div>

                          <div className="space-y-6">
                            <div className="flex items-center justify-between gap-2 pt-4">
                              <div>
                                <span className="text-[9px] uppercase font-bold tracking-widest text-ink/50 block">Departing</span>
                                <span className="serif text-xl font-bold text-ink">{route.departureCity}</span>
                                <span className="text-[11px] text-ink/70 block">Wenela Terminal</span>
                              </div>
                              <div className="flex flex-col items-center shrink-0">
                                <Bus className="h-4 w-4 text-gold" />
                                <div className="h-[1px] w-12 sm:w-20 bg-ink-fade my-1.5"></div>
                                <span className="text-[9px] text-ink/50 uppercase tracking-widest font-bold">{route.duration}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] uppercase font-bold tracking-widest text-ink/50 block">Arriving</span>
                                <span className="serif text-xl font-bold text-ink">{route.destinationCity}</span>
                                <span className="text-[11px] text-ink/70 block">Area 3 Gateway</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs bg-paper p-4 border border-ink-fade">
                              <div>
                                <strong className="text-ink/50 block uppercase tracking-wider text-[9px] font-bold">Standard Class</strong>
                                <span className="serif text-lg font-bold text-ink">MWK {route.fareStandard.toLocaleString()}</span>
                              </div>
                              <div>
                                <strong className="text-ink/50 block uppercase tracking-wider text-[9px] font-bold">VIP Exec Class</strong>
                                <span className="serif text-lg font-bold text-gold">MWK {route.fareVIP.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3 mt-8 border-t border-ink-fade pt-4">
                            <button
                              onClick={() => handleSelectRouteFromSchedule(route)}
                              className="w-full py-3 bg-[#0b1d3a] hover:bg-gold text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 text-center cursor-pointer"
                            >
                              Reserve Seats
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>                {/* Latest Promotions */}
                <section className="py-16 bg-transparent border-b border-ink-fade">
                   <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                     <div className="bg-[#B5C7EB] text-ink border border-gold/30 rounded-md p-8 sm:p-12 relative overflow-hidden shadow-lg">
                       <div className="absolute top-0 right-0 p-8 opacity-5">
                         <Bus className="h-64 w-64 text-ink" />
                       </div>

                       <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                         <div className="lg:col-span-8 space-y-4 text-left">
                           <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold border border-gold/30 px-3 py-1 inline-block">
                             Exclusive Phase 1 Offer
                           </span>
                           <h3 className="serif text-3xl sm:text-4xl font-bold tracking-tight text-ink">
                             Round-Trip Saver Discount
                           </h3>
                           <p className="text-xs sm:text-sm text-ink/80 leading-relaxed max-w-xl">
                             Need to travel both ways? Secure both departure and return booking requests today and receive a <strong className="text-gold">10% total fare rebate</strong> upon boarding verification at our office. Let our dispatch desk know during your confirmation!
                           </p>
                         </div>
                         <div className="lg:col-span-4 flex justify-start lg:justify-end shrink-0">
                           <button
                             onClick={() => handleNavigateToBooking(undefined, true)}
                             className="px-6 py-3.5 bg-[#0b1d3a] hover:bg-gold text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer"
                           >
                             Claim Saver Promo
                           </button>
                         </div>
                       </div>
                     </div>
                   </div>
                 </section>

                {/* Starlink Standards Section (Accordioned & Placed Below Promotions) */}
                <section className="py-8 bg-transparent border-b border-ink-fade">
                  <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    <div 
                      onClick={() => setStarlinkStandardsOpen(!starlinkStandardsOpen)}
                      className={`cursor-pointer border p-6 sm:p-10 transition-all duration-300 relative overflow-hidden select-none group ${
                        starlinkStandardsOpen ? 'bg-[#faf7f2] border-gold shadow-lg text-ink' : 'bg-[#faf7f2] border-gold/30 hover:border-gold text-ink'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="space-y-2.5 text-left">
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold block">
                            Starlink Standards
                          </span>
                          <h2 className="serif text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                            WHY TRAVELERS CHOOSE STARLINK
                          </h2>
                          <p className="text-ink/70 text-xs leading-relaxed max-w-xl mt-1">
                            We deliver pristine comfort, absolute timing integrity, and safety compliance. Click to expand and view our standard executive amenities.
                          </p>
                        </div>
                        <motion.div
                          animate={{ rotate: starlinkStandardsOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className={`p-2 shrink-0 transition-colors ${starlinkStandardsOpen ? 'text-gold' : 'text-ink/30 group-hover:text-gold'}`}
                        >
                          <ChevronDown className="h-6 w-6" />
                        </motion.div>
                      </div>

                      <AnimatePresence initial={false}>
                        {starlinkStandardsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when interacting with inner items
                          >
                            <div className="mt-8 border-t border-dashed border-ink-fade pt-8 space-y-4">
                              {FLEET_FEATURES.map((feature, i) => {
                                const isOpen = openFeatureIndex === i;
                                return (
                                  <div 
                                    key={i}
                                    className={`border rounded-none transition-all duration-300 overflow-hidden ${
                                      isOpen 
                                        ? 'bg-[#faf7f2] border-gold shadow-sm text-ink' 
                                        : 'bg-[#faf7f2] border-ink-fade hover:border-gold/40 text-ink'
                                    }`}
                                  >
                                    {/* Accordion Header */}
                                    <div 
                                      onClick={() => setOpenFeatureIndex(isOpen ? null : i)}
                                      className="flex items-center justify-between gap-4 cursor-pointer py-4.5 px-6 select-none group/item transition-colors hover:bg-neutral-50"
                                    >
                                      <div className="flex items-center gap-4">
                                        <span className="serif text-lg font-bold text-gold tracking-tight w-6 shrink-0">
                                          0{i + 1}
                                        </span>
                                        <div className={`p-1 transition-colors ${isOpen ? 'text-gold' : 'text-ink/70 group-hover/item:text-gold'}`}>
                                          <FeatureIcon iconName={feature.icon} className="h-4.5 w-4.5" />
                                        </div>
                                        <h3 className="serif font-bold text-xs sm:text-sm text-ink tracking-tight">
                                          {feature.title}
                                        </h3>
                                      </div>
                                      <motion.div
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={`shrink-0 transition-colors ${isOpen ? 'text-gold' : 'text-ink/30 group-hover/item:text-ink/70'}`}
                                      >
                                        <ChevronDown className="h-4 w-4" />
                                      </motion.div>
                                    </div>

                                    {/* Accordion Content with Frame Motion */}
                                    <AnimatePresence initial={false}>
                                      {isOpen && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                                        >
                                          <div className="px-6 pb-5 pl-14 sm:pl-16 border-t border-dashed border-ink-fade pt-3 bg-paper">
                                            <p className="text-xs sm:text-sm text-ink/75 leading-relaxed">
                                              {feature.description}
                                            </p>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </section>

                {/* Traveler Voices Accordion Section */}
                <section className="py-8 bg-transparent border-b border-ink-fade">
                  <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    <div 
                      onClick={() => setTravelerVoicesOpen(!travelerVoicesOpen)}
                      className={`cursor-pointer border p-6 sm:p-10 transition-all duration-300 relative overflow-hidden select-none group ${
                        travelerVoicesOpen ? 'bg-[#faf7f2] border-gold shadow-lg text-ink' : 'bg-[#faf7f2] border-gold/30 hover:border-gold text-ink'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="space-y-2.5 text-left">
                          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold block">
                            Traveler Voices ({reviews.length})
                          </span>
                          <h2 className="serif text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                            VIEW OR ADD REVIEWS...
                          </h2>
                          <p className="text-ink/70 text-xs leading-relaxed max-w-xl mt-1">
                            Our commitment to quality has earned the trust of executive travelers and families alike. Click to read traveler testimonials.
                          </p>
                        </div>
                        <motion.div
                          animate={{ rotate: travelerVoicesOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className={`p-2 shrink-0 transition-colors ${travelerVoicesOpen ? 'text-gold' : 'text-ink/30 group-hover:text-gold'}`}
                        >
                          <ChevronDown className="h-6 w-6" />
                        </motion.div>
                      </div>

                      <AnimatePresence initial={false}>
                        {travelerVoicesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when interacting with inner items
                          >
                            <div className="mt-8 border-t border-dashed border-ink-fade pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                              {reviews.map((t, i) => (
                                <div 
                                  key={i}
                                  className="bg-white border border-ink-fade rounded-none p-6 flex flex-col justify-between text-left"
                                >
                                  <div className="space-y-4">
                                    <div className="flex gap-1 text-gold text-xs">
                                      ★★★★★
                                    </div>
                                    <p className="serif text-xs text-ink italic leading-relaxed">
                                      &ldquo;{t.comment}&rdquo;
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-3 pt-4 mt-6 border-t border-ink-fade">
                                    <div className="h-8 w-8 flex items-center justify-center rounded-none bg-gold text-neutral-900 text-[10px] font-bold font-serif uppercase shrink-0">
                                      {t.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                                    </div>
                                    <div className="overflow-hidden">
                                      <span className="block font-bold text-[11px] text-ink truncate">{t.name}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-8 pt-8 border-t border-dashed border-ink-fade flex flex-col sm:flex-row gap-4">
                              <input 
                                type="text" 
                                placeholder="Name (optional)" 
                                value={newReviewName}
                                onChange={(e) => setNewReviewName(e.target.value)}
                                className="sm:w-1/4 bg-white border border-ink-fade px-4 py-3 text-xs focus:outline-none focus:border-gold" 
                              />
                              <input 
                                type="text" 
                                placeholder="Write a review..." 
                                value={newReviewText}
                                onChange={(e) => setNewReviewText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddReview()}
                                className="flex-1 bg-white border border-ink-fade px-4 py-3 text-xs focus:outline-none focus:border-gold" 
                              />
                              <button 
                                onClick={handleAddReview}
                                className="bg-[#0b1d3a] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gold transition-colors"
                              >
                                Add Review
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </section>

                {/* Physical Contact Information - Immediate Desk */}
                <section className="py-8 bg-transparent">
                  <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    <div className="border p-6 sm:p-10 rounded-md bg-[#faf7f2] text-ink flex flex-col md:flex-row md:items-center md:justify-between gap-6 transition-all duration-300 border-gold/30 hover:border-gold shadow-lg">
                      <div className="space-y-2.5 text-left">
                        <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold block">
                          Immediate Desk
                        </span>
                        <h2 className="serif text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                          PREFER WHATSAPP BOOKING?
                        </h2>
                        <p className="text-ink/70 text-xs leading-relaxed max-w-xl mt-1">
                          Click to chat with our dispatch agents directly on WhatsApp to inquire or make a fast manual booking!
                        </p>
                      </div>
                      <a
                        href={`https://wa.me/${OFFICE_CONTACTS.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0b1d3a] hover:bg-gold text-white font-bold text-xs uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer shadow-sm shrink-0"
                      >
                        <MessageSquare className="h-4 w-4 fill-current" />
                        <span>Chat WhatsApp Hotline</span>
                      </a>
                    </div>
                  </div>
                </section>

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

      {/* Floating Action Buttons (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 items-end">
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

        {/* My Bookings Floating Action (Dark Blue with Gold badge) */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            width: isBookingsExpanded ? 160 : 44
          }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          onMouseEnter={() => setIsBookingsExpanded(true)}
          onMouseLeave={() => setIsBookingsExpanded(false)}
          onClick={() => navigateTo('bookings')}
          className="flex items-center justify-center bg-[#0b1d3a] hover:bg-[#152e55] text-white border border-gold/40 shadow-xl transition-all duration-300 cursor-pointer rounded-md relative h-11 overflow-visible"
          title="View My Bookings"
        >
          <div className="flex items-center justify-center overflow-hidden w-full px-2">
            <Calendar className="h-4.5 w-4.5 text-gold shrink-0" />
            <motion.div
              initial={false}
              animate={{ 
                width: isBookingsExpanded ? '85px' : '0px',
                opacity: isBookingsExpanded ? 1 : 0,
                marginLeft: isBookingsExpanded ? '8px' : '0px'
              }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden whitespace-nowrap text-left text-xs font-bold uppercase tracking-[0.15em] text-white"
            >
              My Bookings
            </motion.div>
          </div>
          {bookingCount > 0 && (
            <motion.span 
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="absolute -top-2 -right-2 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white shadow-lg border border-[#0b1d3a] z-10"
            >
              {bookingCount}
            </motion.span>
          )}
        </motion.button>
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
              {/* Starlink Logo & Icon */}
              <div className="flex flex-col items-center space-y-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-neutral-900 border-2 border-gold text-gold shadow-lg">
                  <Bus className="h-8 w-8 stroke-[1.5] animate-pulse" />
                </div>
                <div>
                  <h2 className="serif text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
                    STARLINK TOURS
                  </h2>
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
