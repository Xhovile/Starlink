import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ny';

export interface Translations {
  // Navigation & General
  home: string;
  routes: string;
  bookNow: string;
  myBookings: string;
  about: string;
  contact: string;
  management: string;
  supportHotline: string;
  dailyDepartures: string;
  vipPromotion: string;
  loadingService: string;
  accessRestricted: string;
  adminConsole: string;
  adminMsg: string;
  returnDashboard: string;
  copyright: string;
  allRightsReserved: string;

  // Hero Section
  heroPretitle: string;
  heroTitle: string;
  heroDescription: string;
  reserveSeatNow: string;
  viewTimetable: string;
  featureLuxuryTitle: string;
  featureLuxuryDesc: string;
  featureWifiTitle: string;
  featureWifiDesc: string;
  featurePowerTitle: string;
  featurePowerDesc: string;
  featureCrewTitle: string;
  featureCrewDesc: string;

  // Featured Routes
  featuredRates: string;
  directDepartures: string;
  exploreAllTimetables: string;
  departing: string;
  arriving: string;
  standardClass: string;
  vipExecClass: string;
  duration: string;
  clockTowerTerminal: string;
  grandBusinessPark: string;
  from: string;

  // Timetable
  routesScheduleTitle: string;
  routesScheduleSubtitle: string;
  allScheduledDepartures: string;
  oneWayFare: string;
  vipFare: string;
  bookSeat: string;

  // Booking Form
  bookYourLuxurySeat: string;
  submitDetailsBelow: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  travelDate: string;
  serviceClass: string;
  passengersLabel: string;
  roundTrip: string;
  specialRequests: string;
  submitRequest: string;
  processing: string;
  bookingSuccess: string;
  bookingSuccessMsg: string;
  bookingRefLabel: string;
  stepPersonal: string;
  stepTrip: string;
  stepReview: string;

  // About Section
  aboutTitle: string;
  aboutSubtitle: string;
  ourFleetTitle: string;
  ourFleetSubtitle: string;

  // Contact Section
  contactTitle: string;
  contactSubtitle: string;
  executiveTerminals: string;
  phoneLabel: string;
  emailLabel: string;
  addressLabel: string;
  hoursLabel: string;

  // My Bookings
  myBookingsTitle: string;
  myBookingsSubtitle: string;
  searchBookingRef: string;
  searchPlaceholder: string;
  searchButton: string;
  noBookingsFound: string;
  bookingStatus: string;
  pendingReview: string;
  confirmed: string;
  completed: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    home: 'Home',
    routes: 'Routes',
    bookNow: 'Book Now',
    myBookings: 'My Bookings',
    about: 'About',
    contact: 'Contact',
    management: 'Management',
    supportHotline: 'Support Hotline',
    dailyDepartures: 'Daily Departures Blantyre ⇄ Lilongwe',
    vipPromotion: 'Executive VIP Fare Promotion Active',
    loadingService: 'Loading Executive Service...',
    accessRestricted: 'Access Restricted',
    adminConsole: 'Starlink Administration Console',
    adminMsg: 'Management moderation page is coming soon upon approval. The administrative dashboard, fleet metrics, and dispatch tools will be unlocked once executive authorization completes.',
    returnDashboard: 'Return to Dashboard',
    copyright: 'Starlink Tours & Travel. All rights reserved.',
    allRightsReserved: 'All rights reserved.',

    heroPretitle: 'Executive Coach Class',
    heroTitle: 'Redefining Intercity Travel In Malawi',
    heroDescription: "Travel between Blantyre and Lilongwe in unmatched luxury, safety, and comfort on Starlink's VIP leather reclining seats with full Wi-Fi, refreshments, and veteran professional drivers.",
    reserveSeatNow: 'Reserve Seat Now',
    viewTimetable: 'View Timetable',
    featureLuxuryTitle: 'Malawian Luxury',
    featureLuxuryDesc: 'Top-tier luxury bus comfort in Malawi',
    featureWifiTitle: 'Onboard Wi-Fi',
    featureWifiDesc: 'High-speed satellite connection',
    featurePowerTitle: 'Power Outlets',
    featurePowerDesc: 'Charge laptops and devices',
    featureCrewTitle: 'Professional Crew',
    featureCrewDesc: 'Certified first-class hospitality',

    featuredRates: 'Featured Route Rates',
    directDepartures: 'Daily Direct Scheduled Departures',
    exploreAllTimetables: 'Explore all route timetables',
    departing: 'Departing',
    arriving: 'Arriving',
    standardClass: 'Standard Class',
    vipExecClass: 'VIP Exec Class',
    duration: '4.5 Hours',
    clockTowerTerminal: 'Clock Tower Mall, opposite Wenela, Blantyre',
    grandBusinessPark: 'Grand Business Park, Lilongwe',
    from: 'MWK',

    routesScheduleTitle: 'Starlink Intercity Route Timetables',
    routesScheduleSubtitle: 'All daily scheduled departures between Blantyre and Lilongwe. Choose your preferred departure and secure your reservation.',
    allScheduledDepartures: 'All Daily Scheduled Departures',
    oneWayFare: 'One-way Fare',
    vipFare: 'VIP Fare',
    bookSeat: 'Book Seat',

    bookYourLuxurySeat: 'Book Your Luxury Seat Request',
    submitDetailsBelow: 'Submit your reservation details below. Our booking representatives will verify and confirm your seat on WhatsApp instantly.',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    emailAddress: 'Email Address (Optional)',
    travelDate: 'Travel Date',
    serviceClass: 'Service Class',
    passengersLabel: 'Passengers',
    roundTrip: 'Round Trip (Return Journey)',
    specialRequests: 'Special Requests / Dietary Requirements (Optional)',
    submitRequest: 'Submit Booking Request',
    processing: 'Processing Request...',
    bookingSuccess: 'Booking Request Submitted Successfully!',
    bookingSuccessMsg: 'Your booking has been received. Please click the button below to confirm your seats instantly on WhatsApp via mobile money.',
    bookingRefLabel: 'Booking Reference',
    stepPersonal: '1. Personal Details',
    stepTrip: '2. Travel Details',
    stepReview: '3. Special Requests',

    aboutTitle: 'About Starlink Tours',
    aboutSubtitle: 'Malawi\'s premiere executive intercity coach travel brand, delivering unmatched quality, punctuality, and passenger care.',
    ourFleetTitle: 'Our Premium Fleet & Standards',
    ourFleetSubtitle: 'Designed to deliver an exceptional travel experience, our executive coaches are regularly maintained to the absolute highest international safety standards.',

    contactTitle: 'Get in Touch',
    contactSubtitle: 'Have questions or require corporate bookings? Our support representatives are available daily to assist you.',
    executiveTerminals: 'Our Executive Terminals',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    addressLabel: 'Address',
    hoursLabel: 'Hours',

    myBookingsTitle: 'Track & Manage Bookings',
    myBookingsSubtitle: 'Search your existing ticket reservation request status and details using your Booking Reference number.',
    searchBookingRef: 'Enter Booking Reference (e.g., SL-123456)',
    searchPlaceholder: 'Search by Booking Reference...',
    searchButton: 'Search Booking',
    noBookingsFound: 'No booking requests found matching this reference. Please check and try again, or create a new booking.',
    bookingStatus: 'Booking Status',
    pendingReview: 'Pending Review',
    confirmed: 'Confirmed',
    completed: 'Completed'
  },
  ny: {
    home: 'Poyambira',
    routes: 'Njira & Nthawi',
    bookNow: 'Sungitsani Mpando',
    myBookings: 'Zosungitsa Zanga',
    about: 'Zambiri Zathu',
    contact: 'Lumikizanani Nafe',
    management: 'Oyang\'anira',
    supportHotline: 'Foni ya Thandizo',
    dailyDepartures: 'Ulendowu Tsiku Lililonse Blantyre ⇄ Lilongwe',
    vipPromotion: 'Zotsatsa za VIP Exec Ndizololeka Tsopano',
    loadingService: 'Kukonzekeretsa Basi ya Executive...',
    accessRestricted: 'Osalowa Pololedwa',
    adminConsole: 'Malo Oyang\'anira a Starlink',
    adminMsg: 'Tsamba la oyang\'anira liri pafupi kutsegulidwa posachedwa. Dashboard ndi zida zonse zidzatsegulidwa pambuyo polandira chilolezo chapamwamba.',
    returnDashboard: 'Bwererani ku Dashboard',
    copyright: 'Starlink Tours & Travel. Maumwini onse ndi otetezedwa.',
    allRightsReserved: 'Maumwini onse ndi otetezedwa.',

    heroPretitle: 'Gulu la Executive Coach',
    heroTitle: 'Kukonza Mayendedwe a Pakati pa Mizinda ku Malawi',
    heroDescription: "Yendani pakati pa Blantyre ndi Lilongwe pamtendere waukulu, chitetezo, ndi chitonthozo pamipando yachikopa ya Starlink yomwe imatsamira ndi Wi-Fi yodzaza, zotsitsimula, ndi madalaivala odziwa bwino ntchito.",
    reserveSeatNow: 'Sungani Mpando Tsopano',
    viewTimetable: 'Onani Ndandanda',
    featureLuxuryTitle: 'Zamtengo Wapatali ku Malawi',
    featureLuxuryDesc: 'Chitonthozo chapamwamba kwambiri ku Malawi',
    featureWifiTitle: 'Wi-Fi ya m\'basi',
    featureWifiDesc: 'Intaneti yamphamvu ya satellite',
    featurePowerTitle: 'Zolowera Zamagetsi',
    featurePowerDesc: 'Litsani malaptop ndi zida zanu',
    featureCrewTitle: 'Ogwira Ntchito Okatswiri',
    featureCrewDesc: 'Ulemu ndi chisamaliro chapamwamba kwambiri',

    featuredRates: 'Mitengo ya Njira Zathu',
    directDepartures: 'Ulendowu wa Tsiku Lililonse',
    exploreAllTimetables: 'Onani ndandanda yonse ya mayendedwe',
    departing: 'Konyamuka',
    arriving: 'Kofikira',
    standardClass: 'Gulu la Standard',
    vipExecClass: 'Gulu la VIP Exec',
    duration: 'Maola 4.5',
    clockTowerTerminal: 'Clock Tower Mall, moyang\'anana ndi Wenela, Blantyre',
    grandBusinessPark: 'Grand Business Park, Lilongwe',
    from: 'MWK',

    routesScheduleTitle: 'Ndandanda ya Mayendedwe a Starlink',
    routesScheduleSubtitle: 'Maulendo onse a tsiku ndi tsiku pakati pa Blantyre ndi Lilongwe. Sankhani nthawi yomwe mukufuna ndipo sungani malo anu.',
    allScheduledDepartures: 'Maulendo Onse a Tsiku ndi Tsiku',
    oneWayFare: 'Mtengo wa Ulendo Umodzi',
    vipFare: 'Mtengo wa VIP',
    bookSeat: 'Sungani Mpando',

    bookYourLuxurySeat: 'Sunganitsani Mpando Wanu Tsopano',
    submitDetailsBelow: 'Tumizani zambiri za ulendo wanu pansipa. Ogwira ntchito athu adzatsimikizira ndi kukusungirani mpando wanu pa WhatsApp nthawi yomweyo.',
    fullName: 'Dzina Lanu Lonse',
    phoneNumber: 'Nambala ya Foni',
    emailAddress: 'Imelo Address (Ngati muli nayo)',
    travelDate: 'Tsiku la Ulendo',
    serviceClass: 'Gulu la Utumiki',
    passengersLabel: 'Chiwerengero cha Anthu',
    roundTrip: 'Ulendo Wobwerera',
    specialRequests: 'Zofunika Zapadera / Zakudya (Ngati zilipo)',
    submitRequest: 'Tumizani Pempho la Ulendo',
    processing: 'Tikutumiza Pempho Lanu...',
    bookingSuccess: 'Pempho Lanu Latumizidwa Bwino!',
    bookingSuccessMsg: 'Pempho lanu landiridwa. Chonde dinani batani ili m\'munsimu kuti mutsimikizire mipando yanu nthawi yomweyo pa WhatsApp kudzera pa mobile money.',
    bookingRefLabel: 'Nambala ya Ulendo Wanu',
    stepPersonal: '1. Zambiri Zanu',
    stepTrip: '2. Zambiri za Ulendo',
    stepReview: '3. Zapadera',

    aboutTitle: 'Zambiri za Starlink Tours',
    aboutSubtitle: 'Starlink Tours ndi mtundu woyamba wa mabasi amakono ku Malawi, opereka khalidwe labwino kwambiri, kusasunga nthawi, komanzo kusamalira okwera.',
    ourFleetTitle: 'Mabasi Athu a Mtengo Wapatali',
    ourFleetSubtitle: 'Kuti mukhale ndi ulendo wabwino, mabasi athu amasamaliridwa pafupipafupi malinga ndi malamulo apadziko lonse a chitetezo.',

    contactTitle: 'Lumikizanani Nafe',
    contactSubtitle: 'Kodi muli ndi mafunso kapena mukufuna kusungitsa mabasi abizinesi? Thandizo lathu liripo tsiku lililonse kuti likuthandizeni.',
    executiveTerminals: 'Malo Athu Amakono',
    phoneLabel: 'Foni',
    emailLabel: 'Imelo',
    addressLabel: 'Keyala',
    hoursLabel: 'Maola Osegulira',

    myBookingsTitle: 'Tsatirani Ulendo Wanu',
    myBookingsSubtitle: 'Fufuzani momwe pempho lanu losungitsira matikiti lilili pogwiritsa ntchito Nambala Yanu ya Ulendo.',
    searchBookingRef: 'Lembani Nambala ya Ulendo (mwachitsanzo, SL-123456)',
    searchPlaceholder: 'Fufuzani ndi Nambala ya Ulendo...',
    searchButton: 'Fufuzani Ulendo',
    noBookingsFound: 'Sitinapeze pempho la ulendo lomwe likugwirizana ndi nambala imeneyi. Chonde tsimikizirani ndikuyesanso, kapena pangani ulendo watsopano.',
    bookingStatus: 'Momwe Ulendo Ulili',
    pendingReview: 'Ikuunikiridwa',
    confirmed: 'Yatsimikiziridwa',
    completed: 'Watha'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('starlink_language');
    return (saved === 'ny' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('starlink_language', lang);
  };

  const t = (key: keyof Translations): string => {
    return translations[language][key] || translations['en'][key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
