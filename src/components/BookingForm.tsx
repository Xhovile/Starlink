import React, { useState, useEffect } from 'react';
import { Bus, User, Phone, Mail, Calendar, Users, Star, MessageSquare, ArrowRight, CheckCircle2, Ticket, ShieldAlert, ArrowLeftRight, ChevronRight, Printer } from 'lucide-react';
import { motion } from 'motion/react';
import { RouteInfo, BookingRequest, OFFICE_CONTACTS } from '../data';
import { downloadTicket } from '../utils/ticketDownloader';
import { useLanguage } from '../context/LanguageContext';
import YavaLogo from './YavaLogo';

interface BookingFormProps {
  prefilledRoute?: RouteInfo | null;
  prefilledQuery?: { departure: string; destination: string; date: string; passengers?: number } | null;
  prefilledRoundTrip?: boolean;
  onBookingAdded: () => void;
}

export default function BookingForm({ prefilledRoute, prefilledQuery, prefilledRoundTrip, onBookingAdded }: BookingFormProps) {
  const { language, t } = useLanguage();
  // Form states
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [departureCity, setDepartureCity] = useState<'Blantyre' | 'Lilongwe'>('Blantyre');
  const [destinationCity, setDestinationCity] = useState<'Blantyre' | 'Lilongwe'>('Lilongwe');
  const [travelDate, setTravelDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [serviceClass, setServiceClass] = useState<'Standard' | 'VIP'>('Standard');
  const [departureTimeChoice, setDepartureTimeChoice] = useState('07:30 AM (Morning Express)');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isRoundTrip, setIsRoundTrip] = useState(false);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRequest | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [generateActive, setGenerateActive] = useState(false);

  // Set today as minimum selectable date
  const today = new Date().toISOString().split('T')[0];

  // Prefill hook
  useEffect(() => {
    if (prefilledRoundTrip) {
      setIsRoundTrip(true);
    }
    if (prefilledRoute) {
      setDepartureCity(prefilledRoute.departureCity);
      setDestinationCity(prefilledRoute.destinationCity);
      setServiceClass(prefilledRoute.busType === 'VIP Club Class' ? 'VIP' : 'Standard');
      setDepartureTimeChoice(`${prefilledRoute.departureTime} (${prefilledRoute.serviceType})`);
    } else if (prefilledQuery) {
      if (prefilledQuery.departure === 'Blantyre' || prefilledQuery.departure === 'Lilongwe') {
        setDepartureCity(prefilledQuery.departure as 'Blantyre' | 'Lilongwe');
      }
      if (prefilledQuery.destination === 'Blantyre' || prefilledQuery.destination === 'Lilongwe') {
        setDestinationCity(prefilledQuery.destination as 'Blantyre' | 'Lilongwe');
      }
      if (prefilledQuery.date) {
        setTravelDate(prefilledQuery.date);
      }
      if (prefilledQuery.passengers) {
        setPassengers(prefilledQuery.passengers);
      }
    }
  }, [prefilledRoute, prefilledQuery]);

  // Handle route flip
  const handleFlipRoute = () => {
    const temp = departureCity;
    setDepartureCity(destinationCity);
    setDestinationCity(temp);
  };

  // Adjust destination if it matches departure
  useEffect(() => {
    if (departureCity === destinationCity) {
      setDestinationCity(departureCity === 'Blantyre' ? 'Lilongwe' : 'Blantyre');
    }
  }, [departureCity]);

  // Load dynamic routes to calculate fare correctly
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  useEffect(() => {
    try {
      const stored = localStorage.getItem('starlink_routes');
      if (stored) {
        setRoutes(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Filter active routes for chosen stations
  const matchingRoutes = routes.filter(
    (r) => r.departureCity === departureCity && r.destinationCity === destinationCity
  );

  useEffect(() => {
    if (matchingRoutes.length > 0) {
      const exists = matchingRoutes.some(r => `${r.departureTime} (${r.serviceType})` === departureTimeChoice);
      if (!exists) {
        setDepartureTimeChoice(`${matchingRoutes[0].departureTime} (${matchingRoutes[0].serviceType})`);
      }
    }
  }, [departureCity, destinationCity, routes]);

  // Match active route
  const activeRoute = routes.find(
    (r) => r.departureCity === departureCity && r.destinationCity === destinationCity
  );

  const standardPrice = activeRoute ? activeRoute.fareStandard : 35000;
  const vipPrice = activeRoute ? activeRoute.fareVIP : 45000;
  const basePrice = serviceClass === 'VIP' ? vipPrice : standardPrice;

  // Calculate Fare with special 20% round trip discount
  const pricePerSeat = isRoundTrip ? Math.round(basePrice * 2 * 0.8 / 100) * 100 : basePrice;
  const totalFare = pricePerSeat * passengers;

  // Potential round trip price for the current class selection to show in the label
  const potentialRoundTripPrice = Math.round(basePrice * 2 * 0.8 / 100) * 100;

  // Form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber || !travelDate) {
      if (language === 'en') {
        alert('Please fill in all required fields (Name, Phone Number, and Travel Date).');
      } else {
        alert('Chonde lembani magawo onse ofunikira (Dzina, Nambala ya Foni, ndi Tsiku la Ulendo).');
      }
      return;
    }

    setSubmitting(true);

      // Simulate luxury loader
      setTimeout(() => {
        const refNum = Math.floor(1000 + Math.random() * 9000);
        const code = departureCity === 'Blantyre' ? 'BT' : 'LL';
        const reference = `YV-${refNum}-${code}`;

        const newBooking: BookingRequest = {
          id: `book-${Date.now()}`,
          fullName,
          phoneNumber,
          email: email || undefined,
          departureCity,
          destinationCity,
          travelDate,
          passengers,
          serviceClass,
          isRoundTrip,
          specialRequests: specialRequests || undefined,
          bookingRef: reference,
          status: 'Pending Review',
          createdAt: new Date().toLocaleDateString('en-MW', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          departureTime: departureTimeChoice,
        };

        // Save to localStorage
        try {
          const currentBookings = JSON.parse(localStorage.getItem('yava_bookings') || '[]');
          currentBookings.unshift(newBooking);
          localStorage.setItem('yava_bookings', JSON.stringify(currentBookings));
        } catch (err) {
          console.error('Failed to save booking', err);
        }

      setConfirmedBooking(newBooking);
      setSubmitting(false);
      onBookingAdded();
    }, 1200);
  };

  // Generate WhatsApp link
  const getWhatsAppLink = (booking: BookingRequest) => {
    const text = `*YAVA - LUXURY BOOKING REQUEST*
--------------------------------------------
*Ticket Ref:* ${booking.bookingRef}
*Passenger:* ${booking.fullName}
*Phone:* ${booking.phoneNumber}
*Route:* ${booking.departureCity} ➔ ${booking.destinationCity}
*Departure:* ${booking.departureTime}
*Date:* ${booking.travelDate}
*Class:* ${booking.serviceClass} Executive (${booking.serviceClass === 'VIP' ? 'VIP Lounge Class' : 'Standard Luxury'})
*Seats:* ${booking.passengers} Passenger(s)
*Total Fare:* MWK ${ (booking.passengers * (booking.serviceClass === 'VIP' ? 45000 : 35000)).toLocaleString() }
${booking.specialRequests ? `*Special Request:* ${booking.specialRequests}` : ''}
--------------------------------------------
Please review and confirm my seat reservation! Thank you.`;

    const cleanPhone = OFFICE_CONTACTS.whatsapp.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const handleResetForm = () => {
    setConfirmedBooking(null);
    setFullName('');
    setPhoneNumber('');
    setEmail('');
    setPassengers(1);
    setSpecialRequests('');
  };

  return (
    <div className="py-16 bg-[#1e90ff] min-h-screen text-ink border-b border-ink-fade">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* If Ticket is Confirmed, render Premium Boarding Pass Ticket */}
        {confirmedBooking ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Header success */}
            <div className="text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center bg-emerald-100 text-emerald-600 rounded-none mb-2">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="serif text-3xl font-bold text-ink tracking-tight">
                {t('bookingSuccess')}
              </h2>
              <p className="text-ink/75 max-w-md mx-auto text-xs sm:text-sm">
                {language === 'en' 
                  ? 'Your luxury booking request has been securely created. Choose an option below to complete your confirmation.'
                  : 'Pempho lanu losungitsa malo lakonzedwa bwino. Sankhani chimodzi mwa izi pansipa kuti mutsimikizire.'}
              </p>
            </div>

            {/* Boarding Pass Design */}
            <div className="bg-[#eedfc8] border border-ink rounded-none overflow-hidden shadow-md">
              {/* Ticket Top: Starlink Header */}
              <div className="bg-[#0b1d3a] text-paper px-6 py-5 flex items-center justify-between border-b border-ink-fade">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center bg-white text-ink">
                    <Bus className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <YavaLogo monoColor="#ffffff" height={16} className="block" />
                    <span className="text-[9px] uppercase tracking-widest text-gold font-bold block mt-1">
                      {language === 'en' ? 'Boarding Request Pass' : 'Pasi Lonyamukira Basi'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-paper/40 uppercase font-bold block">
                    {language === 'en' ? 'Status' : 'Chilolezo'}
                  </span>
                  <span className="text-[10px] text-gold font-bold uppercase tracking-widest border border-gold/30 px-2 py-0.5 mt-1 inline-block">
                    {confirmedBooking.status === 'Pending Review' ? t('pendingReview') : confirmedBooking.status === 'Confirmed' ? t('confirmed') : t('completed')}
                  </span>
                </div>
              </div>

              {/* Ticket Main Details */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 relative">
                {/* Visual dotted coupon line for tearing */}
                <div className="hidden md:block absolute right-[28%] top-0 bottom-0 border-r border-dashed border-ink-fade"></div>

                <div className="md:col-span-8 space-y-6">
                  {/* Origin ➔ Destination Display */}
                  <div className="flex items-center justify-between bg-white p-4 border border-ink-fade rounded-none">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-ink/40 block">
                        {language === 'en' ? 'Departure From' : 'Kuchokera Mzinda'}
                      </span>
                      <span className="serif text-lg font-bold text-ink">{confirmedBooking.departureCity}</span>
                      <span className="text-[10px] text-ink/60 block">Wenela Terminal</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Bus className="h-4 w-4 text-gold" />
                      <div className="h-[1px] w-12 sm:w-20 bg-ink-fade my-1"></div>
                      <span className="text-[9px] text-ink/50 uppercase font-bold">4.5h Express</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-ink/40 block">
                        {language === 'en' ? 'Destination' : 'Kopita Mzinda'}
                      </span>
                      <span className="serif text-lg font-bold text-ink">{confirmedBooking.destinationCity}</span>
                      <span className="text-[10px] text-ink/60 block">Area 3 Terminal</span>
                    </div>
                  </div>

                  {/* Core details grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 text-xs">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-ink/40 block">{t('fullName')}</span>
                      <span className="font-semibold text-ink">{confirmedBooking.fullName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-ink/40 block">{t('phoneNumber')}</span>
                      <span className="font-semibold text-ink">{confirmedBooking.phoneNumber}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-ink/40 block">{t('travelDate')}</span>
                      <span className="font-semibold text-ink">{confirmedBooking.travelDate}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-ink/40 block">
                        {language === 'en' ? 'Departure Choice' : 'Nthawi ya Ulendo'}
                      </span>
                      <span className="font-semibold text-ink">{confirmedBooking.departureTime}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-ink/40 block">{t('serviceClass')}</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-ink">
                        <Star className="h-3.5 w-3.5 text-gold shrink-0" />
                        {confirmedBooking.serviceClass} Executive
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-ink/40 block">{t('passengersLabel')}</span>
                      <span className="font-semibold text-ink">
                        {confirmedBooking.passengers} {language === 'en' ? 'Adult(s)' : 'Mtsikana/Mwamuna'}
                      </span>
                    </div>
                  </div>

                  {confirmedBooking.specialRequests && (
                    <div className="p-3 bg-white border border-ink-fade text-xs rounded-none">
                      <strong className="text-ink/40 uppercase tracking-wide text-[9px] block mb-1">{t('specialRequests')}</strong>
                      <span className="text-ink/80 font-medium italic">“{confirmedBooking.specialRequests}”</span>
                    </div>
                  )}
                </div>

                {/* Ticket Stub right-hand side */}
                <div className="md:col-span-4 bg-white border border-ink-fade p-4 flex flex-col justify-between text-center min-h-[180px]">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-ink/40 block">
                      {language === 'en' ? 'Total Est. Fare' : 'Mtengo Wonse'}
                    </span>
                    <span className="serif text-2xl font-bold text-ink block mt-1">
                      MWK {totalFare.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-ink/50 block mt-0.5">
                      {language === 'en' ? 'Payable upon validation' : 'Mumalipira pambuyo potsimikizira'}
                    </span>
                  </div>

                  {/* Mock Barcode */}
                  <div className="space-y-1 py-4">
                    <div className="flex justify-center items-center h-10 w-full bg-ink px-2 overflow-hidden">
                      {/* Barcode lines */}
                      <div className="flex items-center h-8 w-full opacity-90">
                        <svg width="100%" height="100%" preserveAspectRatio="none">
                          {(() => {
                            let currentX = 0;
                            return [4,2,6,1,8,3,5,1,7,2,9,4,3,1,5,8,2,6,3,1,9,4,2,7,3].map((val, idx) => {
                              const rect = (
                                <rect 
                                  key={idx}
                                  x={currentX} 
                                  y="0" 
                                  width={val * 0.75} 
                                  height="100%" 
                                  fill="#ffffff" 
                                />
                              );
                              currentX += (val * 0.75) + 2;
                              return rect;
                            });
                          })()}
                        </svg>
                      </div>
                    </div>
                    <span className="font-mono text-[9px] tracking-widest text-ink/50 block uppercase font-bold">
                      {confirmedBooking.bookingRef}
                    </span>
                  </div>

                  <span className="text-[9px] text-ink/40 italic block">
                    {language === 'en' ? 'Created:' : 'Lalembedwa:'} {confirmedBooking.createdAt}
                  </span>
                </div>
              </div>

              {/* Action Buttons to Confirm */}
              <div className="bg-white border-t border-ink-fade p-6 sm:px-8 flex flex-col sm:flex-row gap-4">
                {/* WhatsApp Action */}
                <a
                  href={getWhatsAppLink(confirmedBooking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-4 px-6 rounded-none bg-[#0b1d3a] hover:bg-[#12284c] text-white font-bold text-center flex items-center justify-center gap-2.5 shadow-sm transition-transform hover:scale-[1.01] uppercase tracking-widest text-xs cursor-pointer"
                >
                  <MessageSquare className="h-5 w-5 fill-current" />
                  <span>{language === 'en' ? 'Confirm WhatsApp' : 'Tsimikizirani pa WhatsApp'}</span>
                </a>

                {/* Download / Print Ticket Action */}
                <button
                  onClick={() => downloadTicket(confirmedBooking)}
                  className="flex-1 py-4 px-6 rounded-none bg-gold hover:bg-gold/90 text-white font-bold text-center flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-[1.01] uppercase tracking-widest text-xs cursor-pointer"
                >
                  <Printer className="h-4.5 w-4.5" />
                  <span>{language === 'en' ? 'Download Ticket' : 'Tengerani Tikiti'}</span>
                </button>

                {/* Local Manual Submit Action */}
                <button
                  onClick={handleResetForm}
                  className="flex-1 py-4 px-6 rounded-none bg-ink hover:bg-gold text-white font-bold text-center flex items-center justify-center gap-2 transition-colors uppercase tracking-widest text-xs cursor-pointer"
                >
                  <Ticket className="h-4 w-4 text-gold" />
                  <span>{language === 'en' ? 'Book Another' : 'Sungitsaninso Ena'}</span>
                </button>
              </div>
            </div>

            {/* Warning advisory */}
            <div className="bg-white rounded-none border border-ink-fade p-6 flex items-start gap-4">
              <ShieldAlert className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <div className="text-xs text-ink/80 leading-relaxed">
                <strong>{language === 'en' ? 'Phase 1 Ticket Instructions:' : 'Malangizo a Tikiti (Phase 1):'}</strong> {language === 'en' ? 'To guarantee your reservation on the selected bus, please click the "Confirm WhatsApp" button. This forwards your ticket layout directly to our dispatch operators. Once validated, you can instantly pay via Airtel Money or TNM Mpamba to lock in your promo fare!' : 'Kuti mutsimikizire malo anu pa basi yomwe mwasankha, chonde dinani batani la "Tsimikizirani pa WhatsApp". Izi zikutumiza zambiri zanu kwa oyang\'anira maulendo athu. Mukalipira pa Airtel Money kapena TNM Mpamba, malo anu adzatsekedwa tsiku limenelo!'}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-[#faf7f2] border border-ink-fade rounded-none shadow-sm">
            {/* Form Title banner */}
            <div className="bg-[#0b1d3a] text-paper px-6 py-6 border-b border-ink-fade">
              <h2 className="serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                <Ticket className="h-5 w-5 text-gold" />
                <span>{t('bookYourLuxurySeat')}</span>
              </h2>
              <p className="text-[10px] uppercase tracking-widest font-bold text-paper/60 mt-1.5">
                {language === 'en' 
                  ? 'Phase 1 manual ticket generation. No credit card required.' 
                  : 'Kutulutsa tikiti kwakanthawi. Palibe khadi loyenerera.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
              {/* Step 1: Route Setup */}
              <div className="space-y-4">
                <h3 className="serif text-xs font-bold uppercase tracking-widest text-black border-b border-ink-fade pb-2">
                  {language === 'en' ? '01. Route Schedule & Destination' : '01. Njira ndi Kopita'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Origin */}
                  <div className="md:col-span-5 space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-ink/50">
                      {language === 'en' ? 'Departure Station *' : 'Mzinda Onyamukira *'}
                    </label>
                    <select
                      value={departureCity}
                      onChange={(e) => setDepartureCity(e.target.value as 'Blantyre' | 'Lilongwe')}
                      className="w-full border-b border-ink-fade py-2 text-sm focus:outline-none focus:border-gold bg-transparent text-ink font-semibold rounded-none"
                    >
                      <option value="Blantyre">{language === 'en' ? 'Blantyre (Wenela Terminal)' : 'Blantyre (Wenela Terminal)'}</option>
                      <option value="Lilongwe">{language === 'en' ? 'Lilongwe (Area 3 Terminal)' : 'Lilongwe (Area 3 Terminal)'}</option>
                    </select>
                  </div>

                  {/* Flip button */}
                  <div className="md:col-span-2 flex justify-center pt-4 md:pt-0">
                    <button
                      type="button"
                      onClick={handleFlipRoute}
                      className="h-8 w-8 flex items-center justify-center bg-white border border-ink-fade text-gold hover:bg-ink hover:text-white transition-all rounded-none cursor-pointer"
                      title={language === 'en' ? 'Flip stations' : 'Sinthani midzi'}
                    >
                      <ArrowLeftRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Destination */}
                  <div className="md:col-span-5 space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-ink/50">
                      {language === 'en' ? 'Destination Station *' : 'Mzinda Wofikirako *'}
                    </label>
                    <select
                      value={destinationCity}
                      onChange={(e) => setDestinationCity(e.target.value as 'Blantyre' | 'Lilongwe')}
                      className="w-full border-b border-ink-fade py-2 text-sm focus:outline-none focus:border-gold bg-transparent text-ink font-semibold rounded-none"
                    >
                      <option value="Lilongwe">{language === 'en' ? 'Lilongwe (Area 3 Terminal)' : 'Lilongwe (Area 3 Terminal)'}</option>
                      <option value="Blantyre">{language === 'en' ? 'Blantyre (Wenela Terminal)' : 'Blantyre (Wenela Terminal)'}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  {/* Travel Date */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-ink/50">
                      {t('travelDate')} *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        min={today}
                        required
                        className="w-full border-b border-ink-fade py-2 pl-8 text-sm focus:outline-none focus:border-gold bg-transparent text-ink font-semibold rounded-none"
                      />
                      <Calendar className="absolute left-0 top-3 h-4 w-4 text-gold" />
                    </div>
                  </div>

                  {/* Departure time slot preference */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-ink/50">
                      {language === 'en' ? 'Departure Time Preference *' : 'Nthawi Yomwe Mukufuna *'}
                    </label>
                    <select
                      value={departureTimeChoice}
                      onChange={(e) => setDepartureTimeChoice(e.target.value)}
                      className="w-full border-b border-ink-fade py-2 text-sm focus:outline-none focus:border-gold bg-transparent text-ink font-semibold rounded-none"
                    >
                      {matchingRoutes.length > 0 ? (
                        matchingRoutes.map((r) => (
                          <option key={r.id} value={`${r.departureTime} (${r.serviceType})`}>
                            {r.departureTime} ({r.serviceType})
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="07:30 AM (Morning Express)">07:30 AM (Morning Express)</option>
                          <option value="01:30 PM (Afternoon Executive)">01:30 PM (Afternoon Executive)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Passenger Details */}
              <div className="space-y-4">
                <h3 className="serif text-xs font-bold uppercase tracking-widest text-black border-b border-ink-fade pb-2">
                  {language === 'en' ? '02. Passenger Information' : '02. Zambiri za Passenger'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-ink/50">
                      {t('fullName')} *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={language === 'en' ? 'e.g. Chikondi Phiri' : 'chitsanzo: Chikondi Phiri'}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full border-b border-ink-fade py-2 pl-8 text-sm focus:outline-none focus:border-gold bg-transparent text-ink font-semibold rounded-none"
                      />
                      <User className="absolute left-0 top-3 h-4 w-4 text-gold" />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-ink/50">
                      {t('phoneNumber')} *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder={language === 'en' ? 'e.g. +265 888 123 456' : 'chitsanzo: +265 888 123 456'}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="w-full border-b border-ink-fade py-2 pl-8 text-sm focus:outline-none focus:border-gold bg-transparent text-ink font-semibold rounded-none"
                      />
                      <Phone className="absolute left-0 top-3 h-4 w-4 text-gold" />
                    </div>
                  </div>
                </div>

                {/* Email (Optional) */}
                <div className="space-y-1 pt-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-ink/50">
                    {t('emailAddress')}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder={language === 'en' ? 'e.g. chikondi@example.com' : 'chitsanzo: chikondi@example.com'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border-b border-ink-fade py-2 pl-8 text-sm focus:outline-none focus:border-gold bg-transparent text-ink font-semibold rounded-none"
                    />
                    <Mail className="absolute left-0 top-3 h-4 w-4 text-gold" />
                  </div>
                </div>
              </div>

              {/* Step 3: Class & Seats */}
              <div className="space-y-4">
                <h3 className="serif text-xs font-bold uppercase tracking-widest text-black border-b border-ink-fade pb-2">
                  {language === 'en' ? '03. Travel Class & Seat Capacity' : '03. Gulu la Ulendo ndi Mipando'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Number of passengers */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-ink/50">
                      {language === 'en' ? 'Number of Seats / Passengers *' : 'Chiwerengero cha Mipando / Anthu *'}
                    </label>
                    <div className="relative">
                      <select
                        value={passengers}
                        onChange={(e) => setPassengers(Number(e.target.value))}
                        className="w-full border-b border-ink-fade py-2 pl-8 text-sm focus:outline-none focus:border-gold bg-transparent text-ink font-semibold rounded-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <option key={num} value={num}>
                            {num} {language === 'en' ? `seat${num > 1 ? 's' : ''}` : `mando ${num > 1 ? 'yambiri' : ''}`}
                          </option>
                        ))}
                      </select>
                      <Users className="absolute left-0 top-3 h-4 w-4 text-gold" />
                    </div>
                  </div>

                  {/* Seat Class Selection */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-ink/50">
                      {t('serviceClass')} *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={isRoundTrip}
                        onClick={() => setServiceClass('Standard')}
                        className={`py-2 px-4 rounded-none border text-[10px] font-bold uppercase tracking-wider transition-all ${
                          isRoundTrip 
                            ? 'bg-paper text-ink/30 border-ink-fade cursor-not-allowed'
                            : serviceClass === 'Standard'
                              ? 'bg-ink text-white border-ink cursor-pointer'
                              : 'bg-white text-ink/60 border-ink-fade hover:bg-paper cursor-pointer'
                        }`}
                      >
                        {language === 'en' ? `Standard Luxury (${Math.round(standardPrice / 1000)}K)` : `Luxury Tsiku Lomwe (${Math.round(standardPrice / 1000)}K)`}
                      </button>
                      <button
                        type="button"
                        disabled={isRoundTrip}
                        onClick={() => setServiceClass('VIP')}
                        className={`py-2 px-4 rounded-none border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                          isRoundTrip
                            ? 'bg-paper text-ink/30 border-ink-fade cursor-not-allowed'
                            : serviceClass === 'VIP'
                              ? 'bg-gold text-white border-gold shadow-sm cursor-pointer'
                              : 'bg-white text-ink/60 border-ink-fade hover:bg-paper cursor-pointer'
                        }`}
                      >
                        <Star className="h-3 w-3" />
                        {language === 'en' ? `VIP Club (${Math.round(vipPrice / 1000)}K)` : `Gulu la VIP (${Math.round(vipPrice / 1000)}K)`}
                      </button>
                    </div>
                    
                    <div className="mt-3 flex items-center">
                      <label className="flex items-center gap-2 cursor-pointer p-2 bg-paper border border-ink-fade w-full justify-center">
                        <input 
                          type="checkbox" 
                          checked={isRoundTrip} 
                          onChange={(e) => setIsRoundTrip(e.target.checked)}
                          className="accent-gold w-4 h-4 cursor-pointer"
                        />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-gold">
                          {t('roundTrip')} ({Math.round(potentialRoundTripPrice / 1000)}K)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="space-y-1 pt-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-ink/50">
                    {t('specialRequests')}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={language === 'en' ? 'e.g. Elderly passenger, wheelchair assistance, extra luggage, window seats' : 'chitsanzo: Okalamba, kuthandizidwa pa njinga yamavuto, katundu wambiri, window seat'}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full border-b border-ink-fade py-2 text-sm focus:outline-none focus:border-gold bg-transparent text-ink font-semibold rounded-none resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Estimated Pricing Summary Card */}
              <div className="bg-ink text-paper p-6 rounded-none flex items-center justify-between border border-ink-fade">
                <div>
                  <span className="block text-[8px] text-paper/50 uppercase font-bold tracking-widest">
                    {language === 'en' ? 'Estimated Total' : 'Mtengo Wonse'}
                  </span>
                  <span className="serif text-2xl font-bold text-gold">
                    MWK {totalFare.toLocaleString()}
                  </span>
                </div>
                <div className="text-right text-[10px] text-paper/70 max-w-[200px] leading-relaxed">
                  <span>
                    {passengers} x {serviceClass} {language === 'en' ? 'Class Seat(s) on M1 Express Highway' : 'Malo mu Basi pa Msewu wa M1'}
                  </span>
                </div>
              </div>

              {/* Form submit buttons */}
              <div className="pt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full py-4 rounded-none bg-ink text-white hover:bg-gold font-bold uppercase tracking-[0.2em] text-xs transition-colors duration-300 flex items-center justify-center cursor-pointer shadow-md"
                >
                  {language === 'en' ? 'Pay Booking Fee' : 'Lipirani Mtengo wa Ulendo'}
                </button>
                <button
                  type="submit"
                  disabled={submitting || !generateActive}
                  className={`w-full py-4 rounded-none font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300 flex items-center justify-center gap-2 ${
                    submitting || !generateActive 
                      ? 'bg-ink-fade text-ink/50 cursor-not-allowed' 
                      : 'bg-gold hover:bg-ink text-white shadow-md cursor-pointer hover:scale-[1.01]'
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('processing')}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === 'en' ? 'Generate Boarding Ticket' : 'Pangani Tikiti ya Ulendo'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white p-8 max-w-sm w-full rounded-none shadow-2xl border border-gold/30">
              <h4 className="serif text-xl font-bold text-ink mb-4">
                {language === 'en' ? 'Payment Notice' : 'Chidziwitso cha Malipiro'}
              </h4>
              <p className="text-sm text-ink/80 mb-8 leading-relaxed">
                {language === 'en' 
                  ? 'Booking Fee Payment coming soon. Click proceed to generate boarding ticket.' 
                  : 'Njira yolipirira kudzera mufoni ikubwera posachedwa. Dinani kupitiriza kuti mutenge tikiti yanu.'}
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                  }}
                  className="flex-1 py-3 border border-ink-fade text-ink font-bold uppercase tracking-widest text-xs hover:bg-paper transition-colors"
                >
                  {language === 'en' ? 'Cancel' : 'Tsalani'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGenerateActive(true);
                    setShowPaymentModal(false);
                  }}
                  className="flex-1 py-3 bg-gold text-white font-bold uppercase tracking-widest text-xs hover:bg-ink transition-colors"
                >
                  {language === 'en' ? 'Proceed' : 'Pitirizani'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
