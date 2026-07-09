import React, { useState, useEffect } from 'react';
import { BookingRequest, OFFICE_CONTACTS } from '../data';
import { Ticket, Trash2, MessageSquare, Bus, Printer, Clock, X, AlertTriangle } from 'lucide-react';
import { downloadTicket } from '../utils/ticketDownloader';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

interface MyBookingsProps {
  onNavigateToBooking: () => void;
  onRefreshTrigger: number;
}

export default function MyBookings({ onNavigateToBooking, onRefreshTrigger }: MyBookingsProps) {
  const { language, t } = useLanguage();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [bookingToDelete, setBookingToDelete] = useState<BookingRequest | null>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('yava_bookings') || '[]');
      setBookings(stored);
    } catch (err) {
      console.error('Failed to load bookings from history', err);
    }
  }, [onRefreshTrigger]);

  const triggerDeleteConfirm = (booking: BookingRequest) => {
    setBookingToDelete(booking);
  };

  const executeDelete = () => {
    if (!bookingToDelete) return;
    const filtered = bookings.filter(b => b.id !== bookingToDelete.id);
    setBookings(filtered);
    localStorage.setItem('yava_bookings', JSON.stringify(filtered));
    window.dispatchEvent(new Event('storage'));
    setBookingToDelete(null);
  };

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

  return (
    <div className="py-16 bg-paper text-ink border-b border-ink-fade min-h-[60vh]" id="my-bookings-page">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold mb-3 block">
            {language === 'en' ? 'Your Reservations' : 'Malo Omwe Mwasungitsa'}
          </span>
          <h2 className="serif text-3xl sm:text-4xl font-bold text-ink mt-3 tracking-tight">
            {language === 'en' ? 'My Booking History' : 'Zambiri la Maulendo Anga'}
          </h2>
          <p className="text-ink/70 mt-4 text-xs sm:text-sm max-w-xl mx-auto">
            {language === 'en' 
              ? 'Review and track your generated ticketing requests. Download offline printable copies or instantly re-confirm your seat via our automated WhatsApp desk.'
              : 'Onani maulendo omwe mwasungitsa kale. Tsitsani kapena kusindikiza matikiti anu kapena kutsimikizira malo anu pa WhatsApp.'}
          </p>
        </div>

        {/* Content list */}
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="text-center py-16 space-y-6 bg-white border border-ink-fade p-8 max-w-2xl mx-auto shadow-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center bg-gold/10 text-gold rounded-none">
                <Ticket className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h4 className="serif font-bold text-lg text-ink">
                  {language === 'en' ? 'No Booking Records Active' : 'Palibe Maulendo Sungidwa'}
                </h4>
                <p className="text-xs text-ink/65 max-w-md mx-auto leading-relaxed">
                  {language === 'en' 
                    ? "We couldn't find any booking submissions stored on this browser session. Ready to schedule a premium journey between Blantyre and Lilongwe?"
                    : "Sitinathe kupeza ulendo uliwonse wosungidwa pa foni kapena kompyuta iyi. Kodi muli okonzeka kusungitsa ulendo pakati pa Blantyre ndi Lilongwe?"}
                </p>
              </div>
              <button
                onClick={onNavigateToBooking}
                className="inline-block px-8 py-3.5 bg-gold hover:bg-ink text-white font-bold text-xs uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer"
              >
                {language === 'en' ? 'Book Your First Seat Now' : 'Sungitsani Malo Anu Oyamba Tsopano'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => {
                const totalFare = booking.passengers * (booking.serviceClass === 'VIP' ? 45000 : 35000);
                return (
                  <div 
                    key={booking.id}
                    className="bg-[#eedfc8] border border-ink-fade rounded-none overflow-hidden shadow-sm flex flex-col"
                  >
                    {/* Ticket Top: Starlink Header (Dark Blue) */}
                    <div className="bg-[#0b1d3a] text-paper px-6 py-4 flex items-center justify-between border-b border-ink-fade">
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center bg-white text-[#0b1d3a]">
                          <Bus className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="serif font-bold tracking-tight text-white block text-xs sm:text-sm">YAVA</span>
                          <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-gold font-bold block">
                            {language === 'en' ? 'Boarding Request Pass' : 'Pasi Lonyamukira Basi'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-gold/5 border border-gold/20 px-3 py-1">
                          {booking.status === 'Pending Review' ? t('pendingReview') : booking.status === 'Confirmed' ? t('confirmed') : t('completed')}
                        </span>
                        <button
                          onClick={() => triggerDeleteConfirm(booking)}
                          className="p-1.5 text-white/60 hover:text-red-400 hover:bg-white/10 transition-all rounded-sm cursor-pointer"
                          title={language === 'en' ? 'Delete record from this browser' : 'Chotsani zambiri pa chipangizochi'}
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 space-y-6">
                      {/* Row 1: Ref and Date */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-fade pb-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-ink/40 block tracking-wider">
                            {language === 'en' ? 'Ticket Reference Code' : 'Nambala ya Tikiti (Reference)'}
                          </span>
                          <span className="font-mono text-base font-bold text-ink">{booking.bookingRef}</span>
                        </div>
                      </div>

                      {/* Row 2: Route visual */}
                      <div className="flex items-center justify-between py-4 bg-white px-6 border border-ink-fade rounded-none">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-ink/40 block tracking-wider">
                            {language === 'en' ? 'Departure City' : 'Mzinda Onyamuka'}
                          </span>
                          <span className="serif text-base sm:text-lg font-bold text-ink">{booking.departureCity}</span>
                          <span className="text-[10px] text-ink/50 block font-semibold">
                            {language === 'en' ? 'Terminal Departure Desk' : 'Patsamba Lonyamukira'}
                          </span>
                        </div>
                        <div className="flex flex-col items-center px-4">
                          <Bus className="h-5 w-5 text-[#0b1d3a]" />
                          <div className="h-[1px] w-16 sm:w-24 bg-ink-fade mt-1.5"></div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-ink/40 block tracking-wider">
                            {language === 'en' ? 'Arrival Destination' : 'Mzinda Wofikirako'}
                          </span>
                          <span className="serif text-base sm:text-lg font-bold text-ink">{booking.destinationCity}</span>
                          <span className="text-[10px] text-ink/50 block font-semibold">
                            {language === 'en' ? 'Station Lounge Arrival' : 'Patsamba Lofikirako'}
                          </span>
                        </div>
                      </div>

                      {/* Row 3: Key variables */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs bg-white p-4 border border-ink-fade">
                        <div>
                          <strong className="text-ink/45 font-bold uppercase tracking-wider text-[9px] block mb-1">{t('fullName')}</strong>
                          <span className="font-bold text-sm text-ink">{booking.fullName}</span>
                          <span className="text-[10px] text-ink/60 block mt-0.5">{booking.phoneNumber}</span>
                        </div>
                        <div>
                          <strong className="text-ink/45 font-bold uppercase tracking-wider text-[9px] block mb-1">
                            {language === 'en' ? 'Travel Date & Time' : 'Tsiku ndi Nthawi ya Ulendo'}
                          </strong>
                          <span className="font-bold text-sm text-ink">{booking.travelDate}</span>
                          <span className="text-[10px] text-[#0b1d3a] block font-semibold mt-0.5">
                            {booking.departureTime} {language === 'en' ? 'Departure' : 'Onyamuka'}
                          </span>
                        </div>
                        <div>
                          <strong className="text-ink/45 font-bold uppercase tracking-wider text-[9px] block mb-1">
                            {language === 'en' ? 'Seat & Class Configuration' : 'Mipando ndi Gulu la Ulendo'}
                          </strong>
                          <span className="font-bold text-sm text-ink">
                            {booking.passengers} {language === 'en' ? `Seat${booking.passengers > 1 ? 's' : ''} Reserved` : 'Mipando Yosungidwa'}
                          </span>
                          <span className="text-[10px] text-ink/65 block font-semibold mt-0.5">
                            {booking.serviceClass} Executive Suite
                          </span>
                        </div>
                      </div>

                      {/* Special requests if any */}
                      {booking.specialRequests && (
                        <div className="p-4 bg-white border border-ink-fade text-xs text-ink rounded-none">
                          <strong className="font-bold block uppercase tracking-wider text-[9px] text-ink/50 mb-1">
                            {language === 'en' ? 'Special Requirements:' : 'Zofuna Zapadera:'}
                          </strong>
                          <p className="italic">&ldquo;{booking.specialRequests}&rdquo;</p>
                        </div>
                      )}

                      {/* Row 4: Pricing and Actions */}
                      <div className="pt-6 border-t border-ink-fade flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-ink/40 block tracking-wider">
                            {language === 'en' ? 'Estimated Fare Cost' : 'Mtengo wa Ulendo'}
                          </span>
                          <span className="serif font-bold text-xl text-ink">
                            MWK {totalFare.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-ink/50 block mt-0.5">
                            {language === 'en' ? 'Payable at boarding lounge desk' : 'Mumalipira mukafika patsamba la basi'}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => downloadTicket(booking)}
                            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gold hover:bg-gold/90 text-white text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer shadow-sm"
                            title={language === 'en' ? 'Download boarding ticket copy' : 'Tsitsani chikhomo cha tikiti'}
                          >
                            <Printer className="h-4 w-4" />
                            <span>{language === 'en' ? 'Download PDF Ticket' : 'Tsitsani Tikiti ya PDF'}</span>
                          </button>

                          <a
                            href={getWhatsAppLink(booking)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0b1d3a] hover:bg-[#12284c] text-white text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer shadow-sm"
                          >
                            <MessageSquare className="h-4 w-4 fill-current" />
                            <span>{language === 'en' ? 'Confirm Ticket WhatsApp' : 'Tsimikizirani pa WhatsApp'}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Bottom Info Alert Card */}
              <div className="bg-ink text-paper p-6 border border-ink-fade flex items-start gap-3.5 text-xs leading-relaxed">
                <Clock className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-gold font-bold uppercase tracking-wider text-[10px] block">
                    {language === 'en' ? 'Important Reservation Advice:' : 'Malangizo Ofunika a Ulendo:'}
                  </strong>
                  <p className="text-paper/80">
                    {language === 'en' 
                      ? 'The ticket records listed above are stored locally on your device. High-capacity executive travel requests are held for 24 hours. To ensure immediate departure boarding, kindly tap the Confirm Ticket WhatsApp button to submit verification directly to our 24/7 dispatch supervisor desk.'
                      : 'Zambiri za matikiti a m\'mwambamu zasungidwa pa chipangizo chanu. Pempho la matikiti limasungidwa kwa maola 24. Kuti ulendo wanu ukhale wosungidwa bwino, chonde dinani batani la Confirm Ticket WhatsApp kuti titsegule tikiti lenileni pa maola 24/7.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Custom Confirmation Popup Dialog */}
      <AnimatePresence>
        {bookingToDelete && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookingToDelete(null)}
              className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#eedfc8] border border-gold/40 p-6 sm:p-8 shadow-2xl z-10 text-ink text-center flex flex-col items-center"
            >
              <button 
                onClick={() => setBookingToDelete(null)}
                className="absolute top-4 right-4 text-ink/50 hover:text-ink cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex h-14 w-14 items-center justify-center bg-red-500/10 text-red-600 border border-red-200 mb-5">
                <AlertTriangle className="h-6 w-6" />
              </div>

              <h3 className="serif text-xl font-bold tracking-tight mb-2">
                {language === 'en' ? 'Cancel Seat Reservation?' : 'Fufuta Ulendo Wosungidwa?'}
              </h3>

              <p className="text-xs text-ink/80 leading-relaxed mb-6">
                {language === 'en' 
                  ? `Are you sure you want to permanently delete and cancel ticket reservation "${bookingToDelete.bookingRef}" for ${bookingToDelete.fullName}? This operation is irreversible.`
                  : `Kodi muli ndi mofuna kufufuta ndikuletsa malo osungidwa a tikiti "${bookingToDelete.bookingRef}" a ${bookingToDelete.fullName}? Izi sizingasinthidwe mukamaliza.`}
              </p>

              <div className="w-full flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setBookingToDelete(null)}
                  className="flex-1 py-3 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 cursor-pointer border border-transparent"
                >
                  {language === 'en' ? 'No, Keep Reservation' : 'Ayi, Siyani'}
                </button>
                <button
                  onClick={executeDelete}
                  className="flex-1 py-3 bg-red-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-700 cursor-pointer border border-transparent"
                >
                  {language === 'en' ? 'Yes, Cancel & Delete' : 'Eya, Fufutani'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
