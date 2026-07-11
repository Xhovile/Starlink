export interface Operator {
  id: string;
  name: string;
  slogan: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  policies: string;
  rating: number;
  status: 'pending' | 'approved' | 'suspended';
  createdAt: string;
}

export interface Route {
  id: string;
  departureCity: string;
  destinationCity: string;
  duration: string;
  distance: string;
  operatorId: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  routeId: string;
  operatorId: string;
  date: string; // YYYY-MM-DD
  departureTime: string;
  arrivalTime: string;
  vehicleId: string;
  fareStandard: number;
  fareVIP: number;
  availableSeats: number;
  totalSeats: number;
  busType: string;
  serviceClass: string;
  rating: number;
  pickupPoint: string;
  dropoffPoint: string;
  policies: string;
  status: 'scheduled' | 'boarding' | 'departed' | 'completed' | 'cancelled';
}

export interface Vehicle {
  id: string;
  operatorId: string;
  plateNumber: string;
  model: string;
  seatLayoutId: string;
  capacity: number;
  status: 'active' | 'maintenance' | 'inactive';
}

export interface SeatLayout {
  id: string;
  name: string;
  operatorId: string;
  rows: number;
  cols: number;
  configuration: string; // e.g., JSON string
}

export interface BookingRequest {
  id: string;
  operatorId: string;
  tripId: string;
  userId: string; // passenger's Firebase uid or 'walk-in'
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

export interface Ticket {
  id: string;
  operatorId: string;
  tripId: string;
  bookingId: string;
  ticketId: string;
  seatNumber: string;
  qrCode: string;
  passengerName: string;
  validated: boolean;
  createdAt: string;
}

export interface Payment {
  id: string;
  operatorId: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method: string;
  transactionId: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  operatorId: string;
  action: string;
  details: string;
  category: 'Booking' | 'Route' | 'Review' | 'System';
  userId: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'platform_admin' | 'operator_admin' | 'customer';
  operatorId?: string;
  createdAt: string;
}

// BACKWARD-COMPATIBLE ADAPTER INTERFACE
export interface RouteInfo {
  id: string;
  departureCity: 'Blantyre' | 'Lilongwe' | 'Mzuzu' | 'Zomba';
  destinationCity: 'Blantyre' | 'Lilongwe' | 'Mzuzu' | 'Zomba';
  departureTime: string;
  arrivalTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  fareStandard: number;
  fareVIP: number;
  duration: string;
  serviceType: 'Morning Express' | 'Afternoon Executive' | 'Night Cruiser';
  busType: 'Standard Luxury' | 'VIP Club Class';
  operatorId?: string;
  operatorName?: string;
}

// ---------------------------------------------------------
// PRE-POPULATED MULTI-TENANT MARKETPLACE REGISTRY
// ---------------------------------------------------------

export const OPERATORS: Operator[] = [
  {
    id: 'op-starlink',
    name: 'Starlink Tours',
    slogan: 'First Class Comfort Across Malawi',
    logo: '✨',
    primaryColor: '#0b1d3a', // Navy
    secondaryColor: '#b8860b', // Gold
    phone: '+265 995 44 64 26',
    whatsapp: '+265 992 94 82 83',
    email: 'bookings@starlink.mw',
    address: 'Clock Tower Mall, opposite Wenela, Blantyre, Malawi',
    policies: 'Cancellations allowed up to 24 hours prior. 10% refund penalty applies. No smoking onboard.',
    rating: 4.9,
    status: 'approved',
    createdAt: '2026-01-10T12:00:00Z'
  },
  {
    id: 'op-kwezy',
    name: 'Kwezy Bus Service',
    slogan: 'Connecting Cities with Modern Luxury',
    logo: '🦅',
    primaryColor: '#800000', // Maroon/Red
    secondaryColor: '#f59e0b', // Amber/Yellow
    phone: '+265 888 12 34 56',
    whatsapp: '+265 888 12 34 57',
    email: 'info@kwezybus.mw',
    address: 'Kalyeka House, Area 3, Lilongwe, Malawi',
    policies: 'Tickets are non-refundable but transferable. Boarding closes 15 minutes before departure.',
    rating: 4.8,
    status: 'approved',
    createdAt: '2026-02-15T09:30:00Z'
  },
  {
    id: 'op-axa',
    name: 'AXA Coaches',
    slogan: 'The Elite Express Network',
    logo: '⚡',
    primaryColor: '#0369a1', // Sky Blue
    secondaryColor: '#f97316', // Orange
    phone: '+265 999 43 21 09',
    whatsapp: '+265 999 43 21 10',
    email: 'support@axacoaches.mw',
    address: 'Sogecoa Golden Peacock Complex, Lilongwe, Malawi',
    policies: '2 bags permitted free of charge. Full refund as credit voucher for cancellations made within 12 hours.',
    rating: 4.7,
    status: 'approved',
    createdAt: '2026-03-01T14:45:00Z'
  },
  {
    id: 'op-sososo',
    name: 'Sososo Coaches',
    slogan: 'Your Premium Safe Travel Partner',
    logo: '🌟',
    primaryColor: '#15803d', // Green
    secondaryColor: '#eab308', // Gold Yellow
    phone: '+265 888 90 90 90',
    whatsapp: '+265 888 90 90 91',
    email: 'bookings@sososo.mw',
    address: 'Wenela Bus Terminal Area, Blantyre, Malawi',
    policies: 'Strict departure timing. Unclaimed seats are subject to standby resale.',
    rating: 4.6,
    status: 'approved',
    createdAt: '2026-04-12T08:15:00Z'
  }
];

export const CORRIDOR_ROUTES: Route[] = [
  // Starlink Routes
  { id: 'route-star-bt-ll', departureCity: 'Blantyre', destinationCity: 'Lilongwe', duration: '4.5 Hours', distance: '315 km', operatorId: 'op-starlink', createdAt: '2026-01-11T10:00:00Z' },
  { id: 'route-star-ll-bt', departureCity: 'Lilongwe', destinationCity: 'Blantyre', duration: '4.5 Hours', distance: '315 km', operatorId: 'op-starlink', createdAt: '2026-01-11T10:00:00Z' },
  
  // Kwezy Routes
  { id: 'route-kwezy-bt-ll', departureCity: 'Blantyre', destinationCity: 'Lilongwe', duration: '4.5 Hours', distance: '315 km', operatorId: 'op-kwezy', createdAt: '2026-02-16T10:00:00Z' },
  { id: 'route-kwezy-ll-bt', departureCity: 'Lilongwe', destinationCity: 'Blantyre', duration: '4.5 Hours', distance: '315 km', operatorId: 'op-kwezy', createdAt: '2026-02-16T10:00:00Z' },
  { id: 'route-kwezy-ll-mz', departureCity: 'Lilongwe', destinationCity: 'Mzuzu', duration: '5.0 Hours', distance: '360 km', operatorId: 'op-kwezy', createdAt: '2026-02-17T11:00:00Z' },
  { id: 'route-kwezy-mz-ll', departureCity: 'Mzuzu', destinationCity: 'Lilongwe', duration: '5.0 Hours', distance: '360 km', operatorId: 'op-kwezy', createdAt: '2026-02-17T11:00:00Z' },

  // AXA Routes
  { id: 'route-axa-bt-ll', departureCity: 'Blantyre', destinationCity: 'Lilongwe', duration: '4.5 Hours', distance: '315 km', operatorId: 'op-axa', createdAt: '2026-03-02T10:00:00Z' },
  { id: 'route-axa-ll-bt', departureCity: 'Lilongwe', destinationCity: 'Blantyre', duration: '4.5 Hours', distance: '315 km', operatorId: 'op-axa', createdAt: '2026-03-02T10:00:00Z' },
  { id: 'route-axa-bt-zo', departureCity: 'Blantyre', destinationCity: 'Zomba', duration: '1.5 Hours', distance: '70 km', operatorId: 'op-axa', createdAt: '2026-03-03T09:00:00Z' },

  // Sososo Routes
  { id: 'route-soso-bt-ll', departureCity: 'Blantyre', destinationCity: 'Lilongwe', duration: '4.5 Hours', distance: '315 km', operatorId: 'op-sososo', createdAt: '2026-04-13T10:00:00Z' },
  { id: 'route-soso-ll-bt', departureCity: 'Lilongwe', destinationCity: 'Blantyre', duration: '4.5 Hours', distance: '315 km', operatorId: 'op-sososo', createdAt: '2026-04-13T10:00:00Z' }
];

export const VEHICLES: Vehicle[] = [
  { id: 'veh-star-1', operatorId: 'op-starlink', plateNumber: 'MN 8721', model: 'Scania Marcopolo G8', seatLayoutId: 'lay-standard', capacity: 52, status: 'active' },
  { id: 'veh-star-2', operatorId: 'op-starlink', plateNumber: 'MN 4509', model: 'Mercedes-Benz Paradiso VIP', seatLayoutId: 'lay-vip', capacity: 36, status: 'active' },
  { id: 'veh-kwezy-1', operatorId: 'op-kwezy', plateNumber: 'BT 3000', model: 'Volvo Irizar i6', seatLayoutId: 'lay-standard', capacity: 52, status: 'active' },
  { id: 'veh-axa-1', operatorId: 'op-axa', plateNumber: 'ZA 5192', model: 'Scania Touring HD', seatLayoutId: 'lay-standard', capacity: 50, status: 'active' },
  { id: 'veh-soso-1', operatorId: 'op-sososo', plateNumber: 'LL 7483', model: 'Yutong F12 Plus', seatLayoutId: 'lay-standard', capacity: 52, status: 'active' }
];

// Generates scheduled trips for any searched date
export function getMockTripsForDate(dateString: string): Trip[] {
  // Return consistent mock trips for any given date
  return [
    // STARLINK TOURS
    {
      id: `trip-starlink-bt-ll-morning-${dateString}`,
      routeId: 'route-star-bt-ll',
      operatorId: 'op-starlink',
      date: dateString,
      departureTime: '07:00 AM',
      arrivalTime: '11:30 AM',
      vehicleId: 'veh-star-1',
      fareStandard: 35000,
      fareVIP: 45000,
      availableSeats: 42,
      totalSeats: 52,
      busType: 'Scania Marcopolo G8 Luxury',
      serviceClass: 'Morning Express',
      rating: 4.9,
      pickupPoint: 'Clock Tower Mall, opposite Wenela, Blantyre',
      dropoffPoint: 'Grand Business Park, Lilongwe',
      policies: 'Complimentary drinks, sanitizers, individual USB charging and on-board high speed Wi-Fi.',
      status: 'scheduled'
    },
    {
      id: `trip-starlink-ll-bt-afternoon-${dateString}`,
      routeId: 'route-star-ll-bt',
      operatorId: 'op-starlink',
      date: dateString,
      departureTime: '02:00 PM',
      arrivalTime: '06:30 PM',
      vehicleId: 'veh-star-2',
      fareStandard: 35000,
      fareVIP: 45000,
      availableSeats: 30,
      totalSeats: 36,
      busType: 'Mercedes-Benz Paradiso VIP Cruiser',
      serviceClass: 'Afternoon Executive',
      rating: 4.9,
      pickupPoint: 'Grand Business Park, Lilongwe',
      dropoffPoint: 'Clock Tower Mall, opposite Wenela, Blantyre',
      policies: 'Complimentary full lunchbox, warm towel, priority boarding, Wi-Fi and premium leather seats.',
      status: 'scheduled'
    },
    
    // KWEZY BUS SERVICE
    {
      id: `trip-kwezy-bt-ll-morning-${dateString}`,
      routeId: 'route-kwezy-bt-ll',
      operatorId: 'op-kwezy',
      date: dateString,
      departureTime: '08:00 AM',
      arrivalTime: '12:30 PM',
      vehicleId: 'veh-kwezy-1',
      fareStandard: 32000,
      fareVIP: 42000,
      availableSeats: 48,
      totalSeats: 52,
      busType: 'Volvo Irizar i6 Elite',
      serviceClass: 'Morning Express',
      rating: 4.8,
      pickupPoint: 'Wenela Terminal Gate, Blantyre',
      dropoffPoint: 'Kalyeka House, Area 3, Lilongwe',
      policies: 'Complimentary mineral water, coffee/tea service, and free tablet access.',
      status: 'scheduled'
    },
    {
      id: `trip-kwezy-ll-mz-morning-${dateString}`,
      routeId: 'route-kwezy-ll-mz',
      operatorId: 'op-kwezy',
      date: dateString,
      departureTime: '06:30 AM',
      arrivalTime: '11:30 AM',
      vehicleId: 'veh-kwezy-1',
      fareStandard: 38000,
      fareVIP: 48000,
      availableSeats: 35,
      totalSeats: 52,
      busType: 'Volvo Irizar i6 Northliner',
      serviceClass: 'Morning Express',
      rating: 4.8,
      pickupPoint: 'Kalyeka House, Area 3, Lilongwe',
      dropoffPoint: 'Mzuzu Central Depot, Mzuzu',
      policies: 'Long haul comfort stops, light snacks, fully air-conditioned.',
      status: 'scheduled'
    },

    // AXA COACHES
    {
      id: `trip-axa-bt-ll-night-${dateString}`,
      routeId: 'route-axa-bt-ll',
      operatorId: 'op-axa',
      date: dateString,
      departureTime: '09:30 PM',
      arrivalTime: '02:00 AM',
      vehicleId: 'veh-axa-1',
      fareStandard: 30000,
      fareVIP: 40000,
      availableSeats: 50,
      totalSeats: 50,
      busType: 'Scania Touring HD Nightcruiser',
      serviceClass: 'Night Cruiser',
      rating: 4.7,
      pickupPoint: 'Limbe Transit Depot, Limbe',
      dropoffPoint: 'Sogecoa Golden Peacock Complex, Lilongwe',
      policies: 'Premium night sleeper blanket, security escort tracking, individual seat reading lights.',
      status: 'scheduled'
    },
    {
      id: `trip-axa-ll-bt-morning-${dateString}`,
      routeId: 'route-axa-ll-bt',
      operatorId: 'op-axa',
      date: dateString,
      departureTime: '09:00 AM',
      arrivalTime: '01:30 PM',
      vehicleId: 'veh-axa-1',
      fareStandard: 30000,
      fareVIP: 40000,
      availableSeats: 42,
      totalSeats: 50,
      busType: 'Scania Touring HD Cruiser',
      serviceClass: 'Morning Express',
      rating: 4.7,
      pickupPoint: 'Sogecoa Golden Peacock Complex, Lilongwe',
      dropoffPoint: 'Limbe Transit Depot, Limbe',
      policies: 'Complimentary mineral water, expert drivers, air-conditioned cabin.',
      status: 'scheduled'
    },

    // SOSOSO COACHES
    {
      id: `trip-sososo-ll-bt-afternoon-${dateString}`,
      routeId: 'route-soso-ll-bt',
      operatorId: 'op-sososo',
      date: dateString,
      departureTime: '01:30 PM',
      arrivalTime: '06:00 PM',
      vehicleId: 'veh-soso-1',
      fareStandard: 33000,
      fareVIP: 43000,
      availableSeats: 29,
      totalSeats: 52,
      busType: 'Yutong F12 Comfort',
      serviceClass: 'Afternoon Executive',
      rating: 4.6,
      pickupPoint: 'Gateway Mall Parking, Lilongwe',
      dropoffPoint: 'Wenela Bus Terminal Area, Blantyre',
      policies: 'USB ports, audio entertainment, expert drivers certified for speed limits.',
      status: 'scheduled'
    },
    {
      id: `trip-sososo-bt-ll-morning-${dateString}`,
      routeId: 'route-soso-bt-ll',
      operatorId: 'op-sososo',
      date: dateString,
      departureTime: '07:30 AM',
      arrivalTime: '12:00 PM',
      vehicleId: 'veh-soso-1',
      fareStandard: 33000,
      fareVIP: 43000,
      availableSeats: 38,
      totalSeats: 52,
      busType: 'Yutong F12 Comfort',
      serviceClass: 'Morning Express',
      rating: 4.6,
      pickupPoint: 'Wenela Bus Terminal Area, Blantyre',
      dropoffPoint: 'Gateway Mall Parking, Lilongwe',
      policies: 'USB ports, audio entertainment, expert drivers certified for speed limits.',
      status: 'scheduled'
    },
    {
      id: `trip-kwezy-ll-bt-afternoon-${dateString}`,
      routeId: 'route-kwezy-ll-bt',
      operatorId: 'op-kwezy',
      date: dateString,
      departureTime: '01:00 PM',
      arrivalTime: '05:30 PM',
      vehicleId: 'veh-kwezy-1',
      fareStandard: 32000,
      fareVIP: 42000,
      availableSeats: 45,
      totalSeats: 52,
      busType: 'Volvo Irizar i6 Elite',
      serviceClass: 'Afternoon Express',
      rating: 4.8,
      pickupPoint: 'Kalyeka House, Area 3, Lilongwe',
      dropoffPoint: 'Wenela Terminal Gate, Blantyre',
      policies: 'Complimentary mineral water, coffee/tea service, and free tablet access.',
      status: 'scheduled'
    }
  ];
}

// ---------------------------------------------------------
// LEGACY STATIC EXPORTS (FOR REFACTORED COMPATIBILITY)
// ---------------------------------------------------------

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
    operatorId: 'op-starlink',
    operatorName: 'Starlink Tours'
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
    operatorId: 'op-starlink',
    operatorName: 'Starlink Tours'
  }
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
    answer: 'Each operator maintains distinct pickup points. For instance, Starlink Tours departs from Clock Tower Mall (opposite Wenela) in Blantyre, while Kwezy Bus Service departs from Area 3 in Lilongwe. Detailed boarding locations are printed clearly on every ticket.',
  },
  {
    question: 'How do I pay for my ticket after making a booking request?',
    answer: 'After selecting your preferred operator and submitting a booking request, you can confirm instantly via Mobile Money (Airtel Money, TNM Mpamba) or Bank Transfer directly to the operator. Walk-ins can also pay in cash at the respective operator counters.',
  },
  {
    question: 'What is the baggage allowance?',
    answer: 'Most premium operators allow up to 2 large bags (maximum 23kg total) in the secure under-coach cargo hold, plus one small piece of hand luggage inside the cabin. Additional charges may apply for oversized cargo.',
  },
  {
    question: 'Can I change my travel date or request a refund?',
    answer: 'Policy depends on the bus operator. Most partners allow date changes up to 24 hours prior to departure. You can check the specific operator policies before checking out or view them in your booking profile.',
  },
  {
    question: 'Do any operators offer private charter coaches?',
    answer: 'Yes! Several partners on the YAVA marketplace, such as Starlink Tours and AXA Coaches, support private hire for schools, corporate teams, and touring groups. Contact the operator directly through their registered profile details.',
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
