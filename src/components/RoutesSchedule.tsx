import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Ticket, ShieldCheck, CreditCard, ChevronRight, Star, Filter } from 'lucide-react';
import { RouteInfo, Trip, OPERATORS, getMockTripsForDate, CORRIDOR_ROUTES } from '../data';
import { useLanguage } from '../context/LanguageContext';

interface RoutesScheduleProps {
  onSelectRoute: (route: RouteInfo) => void;
}

export default function RoutesSchedule({ onSelectRoute }: RoutesScheduleProps) {
  const { language, t } = useLanguage();
  const [selectedOperator, setSelectedOperator] = useState<string>('all');
  const [trips, setTrips] = useState<Trip[]>([]);

  // Get tomorrow's date for daily schedule representation
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const travelDateStr = tomorrow.toLocaleDateString('en-MW', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
  const travelDateISO = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    // Populate trips with tomorrow's active schedules
    setTrips(getMockTripsForDate(travelDateISO));
  }, []);

  // Map trip to RouteInfo for seamless booking form prefill compatibility
  const handleBookTrip = (trip: Trip) => {
    const operator = OPERATORS.find(op => op.id === trip.operatorId);
    const corridor = CORRIDOR_ROUTES.find(c => c.id === trip.routeId);
    
    if (!corridor) return;

    const routePayload: RouteInfo = {
      id: trip.id,
      operatorId: trip.operatorId,
      departureCity: corridor.departureCity as any,
      destinationCity: corridor.destinationCity as any,
      departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime,
      duration: '4h 30m',
      fareStandard: trip.fareStandard,
      fareVIP: trip.fareVIP,
      serviceType: (trip.departureTime.startsWith('07') || trip.departureTime.startsWith('08') 
        ? 'Morning Express' 
        : trip.departureTime.startsWith('13') || trip.departureTime.startsWith('14')
        ? 'Afternoon Executive'
        : 'Night Cruiser') as any,
      busType: (trip.serviceClass === 'VIP' ? 'VIP Club Class' : 'Standard Luxury') as any,
      pickupLocation: trip.pickupPoint,
      dropoffLocation: 'Central Station Office',
    };

    onSelectRoute(routePayload);
  };

  // Filter trips based on selected operator dropdown
  const filteredTrips = trips.filter(trip => {
    if (selectedOperator !== 'all' && trip.operatorId !== selectedOperator) {
      return false;
    }
    return true;
  });

  // Split departures by direction
  const BT_to_LL_Trips = filteredTrips.filter(trip => {
    const corridor = CORRIDOR_ROUTES.find(c => c.id === trip.routeId);
    return corridor?.departureCity === 'Blantyre' && corridor?.destinationCity === 'Lilongwe';
  });

  const LL_to_BT_Trips = filteredTrips.filter(trip => {
    const corridor = CORRIDOR_ROUTES.find(c => c.id === trip.routeId);
    return corridor?.departureCity === 'Lilongwe' && corridor?.destinationCity === 'Blantyre';
  });

  return (
    <div className="py-16 bg-[#1e90ff] text-ink border-b border-ink-fade">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-black mb-3 block">
            {language === 'en' ? 'Live Marketplace Timetable' : 'Nthawi ya Maulendo pa YAVA'}
          </span>
          <h2 className="serif text-3xl sm:text-4xl font-bold text-white mt-3 tracking-tight">
            {language === 'en' ? 'Compare Operator Schedules & Fares' : 'Yerekezerani Nthawi ndi Mitengo ya Mabasi'}
          </h2>
          <p className="text-white/95 mt-4 text-xs sm:text-sm max-w-xl mx-auto">
            {language === 'en' 
              ? `Showing scheduled departures for tomorrow, ${travelDateStr}. Book your executive seats instantly on Malawi's premium multi-operator platform.`
              : `Zosonyeza maulendo amawa, pa ${travelDateStr}. Sungani malo anu mumabasi apamwamba m'Malawi tsopano lino.`}
          </p>
        </div>

        {/* Operator Filter Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 bg-white/10 p-4 max-w-xl mx-auto border border-white/20">
          <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5 shrink-0">
            <Filter className="h-4 w-4" />
            Filter Operator:
          </span>
          <select
            value={selectedOperator}
            onChange={(e) => setSelectedOperator(e.target.value)}
            className="bg-white text-[#0b1d3a] font-bold text-xs px-3 py-2 border-b-2 border-gold focus:outline-none w-full sm:w-auto cursor-pointer"
          >
            <option value="all">All Registered Operators (Show All)</option>
            {OPERATORS.map(op => (
              <option key={op.id} value={op.id}>{op.logo} {op.name}</option>
            ))}
          </select>
        </div>

        {/* Info Grid of departures */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Blantyre to Lilongwe Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-white/20">
              <span className="flex h-2.5 w-2.5 bg-black"></span>
              <h3 className="serif text-lg sm:text-xl font-bold text-white">
                {language === 'en' ? 'Departures From Blantyre (Wenela Terminal)' : 'Mabasi Onyamuka ku Blantyre (Wenela Terminal)'}
              </h3>
            </div>

            <div className="space-y-4">
              {BT_to_LL_Trips.length === 0 ? (
                <div className="p-8 bg-white/5 border border-white/10 text-center text-xs text-white/70 italic">
                  No departures matching filter criteria.
                </div>
              ) : (
                BT_to_LL_Trips.map((trip) => {
                  const op = OPERATORS.find(o => o.id === trip.operatorId);
                  return (
                    <div 
                      key={trip.id}
                      className="bg-[#B5C7EB] border border-ink-fade p-6 transition-all duration-300 relative overflow-hidden group"
                    >
                      {/* Operator Badge */}
                      <div className="absolute top-0 right-0 bg-ink text-paper font-bold text-[9px] tracking-widest uppercase px-3.5 py-1.5 flex items-center gap-1">
                        <span>{op?.logo}</span>
                        <span>{op?.name}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                        <div className="space-y-3">
                          {/* Origin & Dest */}
                          <div className="flex items-center gap-3">
                            <div className="serif text-lg font-bold text-ink">
                              Blantyre
                            </div>
                            <ChevronRight className="h-4 w-4 text-gold" />
                            <div className="serif text-lg font-bold text-ink">
                              Lilongwe
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-ink/75">
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-gold" />
                              <span className="font-bold text-ink">{trip.departureTime}</span>
                            </span>
                            <span>&bull;</span>
                            <span className="font-semibold text-ink/70">Arrives: {trip.arrivalTime}</span>
                          </div>

                          {/* Bus specifications and Operator slogan */}
                          <div className="space-y-1 text-xs">
                            <div className="font-bold text-ink/80 flex items-center gap-1">
                              <span>Bus Spec:</span>
                              <span className="text-gold">{trip.busType} ({trip.serviceClass})</span>
                            </div>
                            <div className="text-[10px] text-ink/60 font-medium flex items-center gap-1">
                              <span>Pickup point:</span>
                              <span className="font-bold text-ink">{trip.pickupPoint}</span>
                            </div>
                            {op && (
                              <div className="text-[10px] text-indigo-900 italic flex items-center gap-1">
                                <span>Rating:</span>
                                <span className="font-black text-amber-600">★ {op.rating}</span>
                                <span>•</span>
                                <span>"{op.slogan}"</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Fare card + Book CTA */}
                        <div className="sm:text-right border-t sm:border-t-0 border-ink-fade pt-4 sm:pt-0 shrink-0 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-3">
                          <div>
                            <div className="text-ink/40 text-[9px] uppercase tracking-widest font-bold">
                              {language === 'en' ? 'Standard Seat' : 'Mtengo wa Standard'}
                            </div>
                            <div className="serif text-xl font-bold text-ink">
                              MWK {trip.fareStandard.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-gold font-bold bg-ink/5 border border-gold/15 px-2 py-0.5 mt-1 inline-block">
                              VIP: MWK {trip.fareVIP.toLocaleString()}
                            </div>
                          </div>

                          <button
                            onClick={() => handleBookTrip(trip)}
                            className="px-5 py-2.5 bg-ink hover:bg-gold text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer"
                          >
                            {language === 'en' ? 'Book Seat' : 'Sungitsani'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Lilongwe to Blantyre Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-white/20">
              <span className="flex h-2.5 w-2.5 bg-black"></span>
              <h3 className="serif text-lg sm:text-xl font-bold text-white">
                {language === 'en' ? 'Departures From Lilongwe (Area 3 Terminal)' : 'Mabasi Onyamuka ku Lilongwe (Area 3 Terminal)'}
              </h3>
            </div>

            <div className="space-y-4">
              {LL_to_BT_Trips.length === 0 ? (
                <div className="p-8 bg-white/5 border border-white/10 text-center text-xs text-white/70 italic">
                  No departures matching filter criteria.
                </div>
              ) : (
                LL_to_BT_Trips.map((trip) => {
                  const op = OPERATORS.find(o => o.id === trip.operatorId);
                  return (
                    <div 
                      key={trip.id}
                      className="bg-[#B5C7EB] border border-ink-fade p-6 transition-all duration-300 relative overflow-hidden group"
                    >
                      {/* Operator Badge */}
                      <div className="absolute top-0 right-0 bg-ink text-paper font-bold text-[9px] tracking-widest uppercase px-3.5 py-1.5 flex items-center gap-1">
                        <span>{op?.logo}</span>
                        <span>{op?.name}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                        <div className="space-y-3">
                          {/* Origin & Dest */}
                          <div className="flex items-center gap-3">
                            <div className="serif text-lg font-bold text-ink">
                              Lilongwe
                            </div>
                            <ChevronRight className="h-4 w-4 text-gold" />
                            <div className="serif text-lg font-bold text-ink">
                              Blantyre
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-ink/75">
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-gold" />
                              <span className="font-bold text-ink">{trip.departureTime}</span>
                            </span>
                            <span>&bull;</span>
                            <span className="font-semibold text-ink/70">Arrives: {trip.arrivalTime}</span>
                          </div>

                          {/* Bus specifications and Operator slogan */}
                          <div className="space-y-1 text-xs">
                            <div className="font-bold text-ink/80 flex items-center gap-1">
                              <span>Bus Spec:</span>
                              <span className="text-gold">{trip.busType} ({trip.serviceClass})</span>
                            </div>
                            <div className="text-[10px] text-ink/60 font-medium flex items-center gap-1">
                              <span>Pickup point:</span>
                              <span className="font-bold text-ink">{trip.pickupPoint}</span>
                            </div>
                            {op && (
                              <div className="text-[10px] text-indigo-900 italic flex items-center gap-1">
                                <span>Rating:</span>
                                <span className="font-black text-amber-600">★ {op.rating}</span>
                                <span>•</span>
                                <span>"{op.slogan}"</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Fare card + Book CTA */}
                        <div className="sm:text-right border-t sm:border-t-0 border-ink-fade pt-4 sm:pt-0 shrink-0 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-3">
                          <div>
                            <div className="text-ink/40 text-[9px] uppercase tracking-widest font-bold">
                              {language === 'en' ? 'Standard Seat' : 'Mtengo wa Standard'}
                            </div>
                            <div className="serif text-xl font-bold text-ink">
                              MWK {trip.fareStandard.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-gold font-bold bg-ink/5 border border-gold/15 px-2 py-0.5 mt-1 inline-block">
                              VIP: MWK {trip.fareVIP.toLocaleString()}
                            </div>
                          </div>

                          <button
                            onClick={() => handleBookTrip(trip)}
                            className="px-5 py-2.5 bg-ink hover:bg-gold text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer"
                          >
                            {language === 'en' ? 'Book Seat' : 'Sungitsani'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
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
                ? 'Boarding gates close exactly 15 minutes before scheduled departures. Passengers are advised to arrive at the respective operator pickup points at least 30 minutes in advance for smooth baggage verification and check-in.'
                : 'Zitseko zokwerera zimatsekedwa mphindi 15 basi isanyamuke. Anthu onse akupemphedwa kufika ku malo onyamukira a operator patatsala mphindi 30 kuti zinthu ziyende bwino.'}
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
