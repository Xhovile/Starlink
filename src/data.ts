export interface RouteInfo {
  id: string;
  departureCity: 'Blantyre' | 'Lilongwe';
  destinationCity: 'Blantyre' | 'Lilongwe';
  departureTime: string;
  arrivalTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  fareStandard: number;
  fareVIP: number;
  duration: string;
  serviceType: 'Morning Express' | 'Afternoon Executive' | 'Night Cruiser';
  busType: 'Standard Luxury' | 'VIP Club Class';
}

export interface BookingRequest {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  departureCity: string;
  destinationCity: string;
  travelDate: string;
  passengers: number;
  serviceClass: 'Standard' | 'VIP';
  isRoundTrip?: boolean;
  specialRequests?: string;
  bookingRef: string;
  status: 'Pending Review' | 'Confirmed' | 'Completed';
  createdAt: string;
  departureTime: string;
  routeGroup?: string;
  destinationDistrict?: string;
}

export const MAIN_ROUTES: RouteInfo[] = [
  {
    id: 'route-bt-ll-morning',
    departureCity: 'Blantyre',
    destinationCity: 'Lilongwe',
    departureTime: '07:00 AM',
    arrivalTime: '11:30 AM',
    pickupLocation: 'Clock Tower Mall, opposite Wenela, Blantyre',
    dropoffLocation: 'Grand Business Park, Lilongwe',
    fareStandard: 35000,
    fareVIP: 45000,
    duration: '4.5 Hours',
    serviceType: 'Morning Express',
    busType: 'Standard Luxury',
  },
  {
    id: 'route-ll-bt-afternoon',
    departureCity: 'Lilongwe',
    destinationCity: 'Blantyre',
    departureTime: '02:00 PM',
    arrivalTime: '06:30 PM',
    pickupLocation: 'Grand Business Park, Lilongwe',
    dropoffLocation: 'Clock Tower Mall, opposite Wenela, Blantyre',
    fareStandard: 35000,
    fareVIP: 45000,
    duration: '4.5 Hours',
    serviceType: 'Afternoon Executive',
    busType: 'VIP Club Class',
  },
];

export const FLEET_FEATURES = [
  {
    icon: 'Wifi',
    title: 'Complimentary High-Speed Wi-Fi',
    description: 'Stay connected throughout your entire journey with our reliable, high-speed onboard satellite internet.',
  },
  {
    icon: 'Armchair',
    title: 'VIP Reclining Leather Seats',
    description: 'Enjoy premium leather seating with generous legroom, adjustable footrests, and personal space.',
  },
  {
    icon: 'Zap',
    title: 'Individual USB & Power Outlets',
    description: 'Keep your phones, tablets, and laptops fully charged with dedicated power ports at every seat.',
  },
  {
    icon: 'Coffee',
    title: 'Refreshments & Snacks Onboard',
    description: 'Receive complimentary chilled bottled water, soft drinks, and gourmet light snacks during your trip.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Uncompromised Safety Standards',
    description: 'Our buses are equipped with advanced speed limiters, real-time GPS fleet tracking, and certified veteran drivers.',
  },
  {
    icon: 'ThermometerSun',
    title: 'Full Climate Control AC',
    description: 'Travel in perfect comfort with our advanced multi-zone air conditioning system tailored to the season.',
  },
];

export const CUSTOMER_TESTIMONIALS = [
  {
    name: 'Chikondi Phiri',
    role: 'Frequent Business Traveler',
    comment: 'YAVA has completely elevated intercity travel in Malawi. The seats are extremely comfortable, the Wi-Fi is fast enough to do actual work on my laptop, and they are always on time. Wenela to Area 3 is now a breeze.',
    rating: 5,
    date: '2 weeks ago',
  },
  {
    name: 'Limbani Banda',
    role: 'Software Engineer',
    comment: 'The booking request through the website was incredibly seamless. I chose the WhatsApp option, received my ticket confirmation in under 5 minutes, and paid via Airtel Money. The luxury standard is real.',
    rating: 5,
    date: '1 month ago',
  },
  {
    name: 'Esme Mwale',
    role: 'Tourism Consultant',
    comment: 'As someone who values safe driving, I am thoroughly impressed by YAVA. The bus drove at a steady, safe pace, the crew was professional, and the complimentary snacks were a delightful touch. Highly recommended!',
    rating: 5,
    date: '3 days ago',
  },
];

export const FREQUENT_QUESTIONS = [
  {
    question: 'Where are the pickup and dropoff points?',
    answer: 'In Blantyre, our main terminal is at Clock Tower Mall, opposite Wenela. In Lilongwe, we operate from Grand Business Park. Boarding starts 30 minutes before the scheduled departure time.',
  },
  {
    question: 'How do I pay for my ticket after making a booking request?',
    answer: 'Once you submit a booking request on our website, you can confirm instantly via WhatsApp. Payments can be easily made via mobile money (Airtel Money, TNM Mpamba) or bank transfer. Cash is also accepted at our physical booking offices.',
  },
  {
    question: 'What is the baggage allowance?',
    answer: 'Each passenger is allowed up to 2 large bags (maximum 23kg total) in the secure under-coach cargo hold, plus one small piece of hand luggage inside the cabin. Additional or oversized luggage can be accommodated with prior notice.',
  },
  {
    question: 'Can I change my travel date or request a refund?',
    answer: 'Yes. Date changes can be made free of charge up to 24 hours before your scheduled departure, subject to seat availability. Cancellations made more than 24 hours in advance qualify for a 90% refund or full travel credit.',
  },
  {
    question: 'Do you offer private coach charters?',
    answer: 'Absolutely! YAVA offers custom corporate hires and private group charter services across Malawi. Please get in touch with our booking office via phone or our contact form to request a custom quote.',
  },
];

export const OFFICE_CONTACTS = {
  phone: '+265 995 44 64 26',
  whatsapp: '+265 992 94 82 83',
  email: 'bookings@yava.mw',
  blantyre: {
    address: 'Clock Tower Mall, opposite Wenela, Blantyre, Malawi',
    hours: 'Mon - Sun: 6:00 AM - 6:00 PM',
  },
  lilongwe: {
    address: 'Grand Business Park, Lilongwe, Malawi',
    hours: 'Mon - Sun: 6:00 AM - 6:00 PM',
  },
};
