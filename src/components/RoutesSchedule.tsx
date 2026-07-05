import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Ticket, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';
import { RouteInfo, MAIN_ROUTES } from '../data';
import { useLanguage } from '../context/LanguageContext';

interface RoutesScheduleProps {
  onSelectRoute: (route: RouteInfo) => void;
}

export default function RoutesSchedule({ onSelectRoute }: RoutesScheduleProps) {
  const { language, t } = useLanguage();
  const [routes, setRoutes] = useState<RouteInfo[]>(MAIN_ROUTES);

  useEffect(() => {
    const loadRoutes = () => {
      try {
        const stored = localStorage.getItem('starlink_routes');
        if (stored) {
          setRoutes(JSON.parse(stored));
        } else {
          setRoutes(MAIN_ROUTES);
        }
      } catch (e) {
        console.error('Failed to load dynamic routes', e);
      }
    };
    loadRoutes();
    window.addEventListener('storage', loadRoutes);
    return () => window.removeEventListener('storage', loadRoutes);
  }, []);

  return (
    <div className="py-16 bg-[#1e90ff] text-ink border-b border-ink-fade">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-black mb-3 block">
            {language === 'en' ? 'Daily Live Schedule' : 'Siku la Maulendo Latsiku ndi Tsiku'}
          </span>
          <h2 className="serif text-3xl sm:text-4xl font-bold text-white mt-3 tracking-tight">
            {language === 'en' ? 'Intercity Schedules & Promotional Fares' : 'Nthawi ya Maulendo ndi Mitengo Yotsika'}
          </h2>
          <p className="text-white/90 mt-4 text-xs sm:text-sm max-w-xl mx-auto">
            {language === 'en' 
              ? 'We operate highly reliable, prompt premium departures daily between the commercial hub of Blantyre and the capital city of Lilongwe.'
              : 'Timayendetsa mabasi odalirika komanso osachedwa tsiku lililonse pakati pa Blantyre ndi Lilongwe.'}
          </p>
        </div>

        {/* Info Grid of departures */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Blantyre to Lilongwe Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-ink-fade">
              <span className="flex h-2 w-2 bg-black"></span>
              <h3 className="serif text-xl font-bold text-white">
                {language === 'en' ? 'Departures From Blantyre (Wenela Terminal)' : 'Mabasi Onyamuka ku Blantyre (Wenela Terminal)'}
              </h3>
            </div>

            <div className="space-y-4">
              {routes.filter(r => r.departureCity === 'Blantyre').map((route) => (
                <div 
                  key={route.id}
                  className="bg-[#B5C7EB] border border-ink-fade rounded-md p-6 transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 bg-ink text-paper font-bold text-[9px] tracking-widest uppercase px-3.5 py-1.5">
                    {route.serviceType}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                    <div className="space-y-3">
                      {/* Origin & Dest */}
                      <div className="flex items-center gap-3">
                        <div className="serif text-lg font-bold text-ink">
                          {route.departureCity}
                        </div>
                        <ChevronRight className="h-4 w-4 text-gold" />
                        <div className="serif text-lg font-bold text-ink">
                          {route.destinationCity}
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-ink/70">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-gold" />
                          <span className="font-bold text-ink">{route.departureTime}</span> ({language === 'en' ? 'Boarding 7:00 AM' : 'Kokwera 7:00 AM'})
                        </span>
                        <span>&bull;</span>
                        <span className="font-medium">{language === 'en' ? 'Duration' : 'Nthawi'}: {route.duration}</span>
                      </div>

                      {/* Pickup terminal address */}
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-start gap-1.5 text-ink/70">
                          <MapPin className="h-3.5 w-3.5 text-gold mt-0.5 shrink-0" />
                          <span><strong>{language === 'en' ? 'Boarding:' : 'Kokwelera:'}</strong> {route.pickupLocation}</span>
                        </div>
                        <div className="flex items-start gap-1.5 text-ink/70">
                          <MapPin className="h-3.5 w-3.5 text-gold mt-0.5 shrink-0" />
                          <span><strong>{language === 'en' ? 'Arrival:' : 'Kofikira:'}</strong> {route.dropoffLocation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Fare card + Book CTA */}
                    <div className="sm:text-right border-t sm:border-t-0 border-ink-fade pt-4 sm:pt-0 shrink-0 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-3">
                      <div>
                        <div className="text-ink/40 text-[9px] uppercase tracking-widest font-bold">
                          {language === 'en' ? 'Promotional Fare' : 'Mtengo Wotsika'}
                        </div>
                        <div className="serif text-xl font-bold text-ink">
                          MWK {route.fareStandard.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-gold font-bold bg-ink/5 border border-gold/15 px-2 py-0.5 mt-1 inline-block">
                          VIP: MWK {route.fareVIP.toLocaleString()}
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectRoute(route)}
                        className="px-5 py-2.5 bg-ink hover:bg-gold text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer"
                      >
                        {language === 'en' ? 'Book Seat' : 'Sungitsani'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lilongwe to Blantyre Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-ink-fade">
              <span className="flex h-2 w-2 bg-black"></span>
              <h3 className="serif text-xl font-bold text-white">
                {language === 'en' ? 'Departures From Lilongwe (Area 3 Terminal)' : 'Mabasi Onyamuka ku Lilongwe (Area 3 Terminal)'}
              </h3>
            </div>

            <div className="space-y-4">
              {routes.filter(r => r.departureCity === 'Lilongwe').map((route) => (
                <div 
                  key={route.id}
                  className="bg-[#B5C7EB] border border-ink-fade rounded-md p-6 transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 bg-ink text-paper font-bold text-[9px] tracking-widest uppercase px-3.5 py-1.5">
                    {route.serviceType}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                    <div className="space-y-3">
                      {/* Origin & Dest */}
                      <div className="flex items-center gap-3">
                        <div className="serif text-lg font-bold text-ink">
                          {route.departureCity}
                        </div>
                        <ChevronRight className="h-4 w-4 text-gold" />
                        <div className="serif text-lg font-bold text-ink">
                          {route.destinationCity}
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-ink/70">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-gold" />
                          <span className="font-bold text-ink">{route.departureTime}</span> ({language === 'en' ? 'Boarding 1:00 PM' : 'Kokwera 1:00 PM'})
                        </span>
                        <span>&bull;</span>
                        <span className="font-medium">{language === 'en' ? 'Duration' : 'Nthawi'}: {route.duration}</span>
                      </div>

                      {/* Pickup terminal address */}
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-start gap-1.5 text-ink/70">
                          <MapPin className="h-3.5 w-3.5 text-gold mt-0.5 shrink-0" />
                          <span><strong>{language === 'en' ? 'Boarding:' : 'Kokwelera:'}</strong> {route.pickupLocation}</span>
                        </div>
                        <div className="flex items-start gap-1.5 text-ink/70">
                          <MapPin className="h-3.5 w-3.5 text-gold mt-0.5 shrink-0" />
                          <span><strong>{language === 'en' ? 'Arrival:' : 'Kofikira:'}</strong> {route.dropoffLocation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Fare card + Book CTA */}
                    <div className="sm:text-right border-t sm:border-t-0 border-ink-fade pt-4 sm:pt-0 shrink-0 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-3">
                      <div>
                        <div className="text-ink/40 text-[9px] uppercase tracking-widest font-bold">
                          {language === 'en' ? 'Promotional Fare' : 'Mtengo Wotsika'}
                        </div>
                        <div className="serif text-xl font-bold text-ink">
                          MWK {route.fareStandard.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-gold font-bold bg-ink/5 border border-gold/15 px-2 py-0.5 mt-1 inline-block">
                          VIP: MWK {route.fareVIP.toLocaleString()}
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectRoute(route)}
                        className="px-5 py-2.5 bg-ink hover:bg-gold text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer"
                      >
                        {language === 'en' ? 'Book Seat' : 'Sungitsani'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Travel Notice Section */}
        <div className="mt-12 bg-ink text-paper rounded-md p-8 border border-ink-fade grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <h4 className="serif font-bold text-lg text-gold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" /> {language === 'en' ? 'Important Booking & Boarding Policy' : 'Ndondomeko Yofunika Yokwerera Basi'}
            </h4>
            <p className="text-xs text-paper/80 leading-relaxed">
              {language === 'en'
                ? 'Boarding gates close exactly 15 minutes before scheduled departures. Passengers are advised to arrive at Wenela or Area 3 Terminals at least 30 minutes in advance for smooth baggage verification and ticket printing.'
                : 'Zitseko zokwerera zimatsekedwa mphindi 15 basi isanyamuke. Anthu onse akupemphedwa kufika ku Wenela kapena ku Area 3 Terminal patatsala mphindi 30 kuti zinthu ziyende bwino.'}
            </p>
          </div>
          <div className="flex justify-start md:justify-end shrink-0">
            <div className="px-5 py-4 bg-white/5 border border-white/10 text-xs text-paper/70 flex items-center gap-3 rounded-md">
              <CreditCard className="h-5 w-5 text-gold" />
              <div>
                <span className="block font-bold text-white uppercase tracking-wider text-[9px]">
                  {language === 'en' ? 'Luggage Included' : 'Katundu Ali M`kati'}
                </span>
                <span>{language === 'en' ? 'Up to 23kg total free' : 'Ofika 23kg kwaulere'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
