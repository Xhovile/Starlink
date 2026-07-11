import { 
  collection, doc, setDoc, getDocs, query, where, onSnapshot, writeBatch, getDoc, deleteDoc 
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { BookingRequest, RouteInfo } from '../data';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Default system routes to pre-populate Firestore if empty (Multi-operator)
export const DEFAULT_SYSTEM_ROUTES: RouteInfo[] = [
  {
    id: 'route-star-bt-ll-morning',
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
    id: 'route-star-ll-bt-afternoon',
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
  },
  {
    id: 'route-kwezy-bt-ll-morning',
    departureCity: 'Blantyre',
    destinationCity: 'Lilongwe',
    departureTime: '08:00 AM',
    arrivalTime: '12:30 PM',
    pickupLocation: 'Wenela Terminal Gate, Blantyre',
    dropoffLocation: 'Kalyeka House, Area 3, Lilongwe',
    fareStandard: 32000,
    fareVIP: 42000,
    duration: '4.5 Hours',
    serviceType: 'Morning Express',
    busType: 'Standard Luxury',
    operatorId: 'op-kwezy',
    operatorName: 'Kwezy Bus Service'
  },
  {
    id: 'route-kwezy-ll-mz-morning',
    departureCity: 'Lilongwe',
    destinationCity: 'Mzuzu',
    departureTime: '06:30 AM',
    arrivalTime: '11:30 AM',
    pickupLocation: 'Kalyeka House, Area 3, Lilongwe',
    dropoffLocation: 'Mzuzu Central Depot, Mzuzu',
    fareStandard: 38000,
    fareVIP: 48000,
    duration: '5.0 Hours',
    serviceType: 'Morning Express',
    busType: 'Standard Luxury',
    operatorId: 'op-kwezy',
    operatorName: 'Kwezy Bus Service'
  },
  {
    id: 'route-axa-bt-ll-night',
    departureCity: 'Blantyre',
    destinationCity: 'Lilongwe',
    departureTime: '09:30 PM',
    arrivalTime: '02:00 AM',
    pickupLocation: 'Limbe Transit Depot, Limbe',
    dropoffLocation: 'Sogecoa Golden Peacock Complex, Lilongwe',
    fareStandard: 30000,
    fareVIP: 40000,
    duration: '4.5 Hours',
    serviceType: 'Night Cruiser',
    busType: 'Standard Luxury',
    operatorId: 'op-axa',
    operatorName: 'AXA Coaches'
  },
  {
    id: 'route-axa-bt-zo-morning',
    departureCity: 'Blantyre',
    destinationCity: 'Zomba',
    departureTime: '09:00 AM',
    arrivalTime: '10:30 AM',
    pickupLocation: 'Limbe Transit Depot, Limbe',
    dropoffLocation: 'Zomba Bus Terminal, Zomba',
    fareStandard: 8000,
    fareVIP: 12000,
    duration: '1.5 Hours',
    serviceType: 'Morning Express',
    busType: 'Standard Luxury',
    operatorId: 'op-axa',
    operatorName: 'AXA Coaches'
  },
  {
    id: 'route-soso-ll-bt-afternoon',
    departureCity: 'Lilongwe',
    destinationCity: 'Blantyre',
    departureTime: '01:30 PM',
    arrivalTime: '06:00 PM',
    pickupLocation: 'Gateway Mall Parking, Lilongwe',
    dropoffLocation: 'Wenela Bus Terminal Area, Blantyre',
    fareStandard: 33000,
    fareVIP: 43000,
    duration: '4.5 Hours',
    serviceType: 'Afternoon Executive',
    busType: 'Standard Luxury',
    operatorId: 'op-sososo',
    operatorName: 'Sososo Coaches'
  }
];

// Helper to merge arrays of bookings by ID
function mergeBookings(local: BookingRequest[], remote: BookingRequest[]): BookingRequest[] {
  const map = new Map<string, BookingRequest>();
  
  // Load remote bookings first
  remote.forEach(b => map.set(b.id, b));
  
  // Overlay local bookings (local might be newer if created offline, but remote is the source of truth for statuses)
  local.forEach(b => {
    if (map.has(b.id)) {
      const remoteBooking = map.get(b.id)!;
      // Keep remote status (Completed, Confirmed, etc.) but merge other details
      map.set(b.id, {
        ...b,
        status: remoteBooking.status // admin status updates take precedence
      });
    } else {
      map.set(b.id, b);
    }
  });

  return Array.from(map.values()).sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/**
 * Synchronizes local bookings with Firestore for a logged in user.
 * Merges local and remote bookings, then updates both locations.
 */
export async function syncBookingsWithFirestore(userId: string): Promise<void> {
  try {
    // 1. Get local bookings
    let localBookings: BookingRequest[] = [];
    try {
      localBookings = JSON.parse(localStorage.getItem('yava_bookings') || '[]');
    } catch (e) {
      console.error('Failed to parse local bookings during sync', e);
    }

    // 2. Get remote bookings from Firestore
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('userId', '==', userId));
    
    let querySnapshot;
    try {
      querySnapshot = await getDocs(q);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'bookings');
    }
    
    const remoteBookings: BookingRequest[] = [];
    querySnapshot.forEach(docSnap => {
      const data = docSnap.data();
      remoteBookings.push({
        id: docSnap.id,
        operatorId: data.operatorId || 'op-starlink',
        tripId: data.tripId || 'trip-starlink-bt-ll-morning',
        userId: data.userId || userId,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        departureCity: data.departureCity,
        destinationCity: data.destinationCity,
        travelDate: data.travelDate,
        passengers: data.passengers,
        serviceClass: data.serviceClass,
        isRoundTrip: data.isRoundTrip,
        specialRequests: data.specialRequests,
        bookingRef: data.bookingRef,
        status: data.status,
        createdAt: data.createdAt,
        departureTime: data.departureTime,
        routeGroup: data.routeGroup,
        destinationDistrict: data.destinationDistrict,
      });
    });

    // 3. Merge them
    const merged = mergeBookings(localBookings, remoteBookings);

    // 4. Update localStorage
    localStorage.setItem('yava_bookings', JSON.stringify(merged));
    window.dispatchEvent(new Event('storage'));

    // 5. Upload any bookings that aren't in remote back to Firestore
    const batch = writeBatch(db);
    let hasUploads = false;

    for (const booking of merged) {
      const remoteExists = remoteBookings.some(rb => rb.id === booking.id);
      if (!remoteExists) {
        const docRef = doc(db, 'bookings', booking.id);
        batch.set(docRef, {
          ...booking,
          userId,
          updatedAt: new Date().toISOString()
        });
        hasUploads = true;
      }
    }

    if (hasUploads) {
      try {
        await batch.commit();
        console.log('Successfully synced local bookings to Firestore.');
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'bookings');
      }
    }
  } catch (error) {
    console.error('Error syncing bookings with Firestore:', error);
    // Rethrow if it's already a JSON string from handleFirestoreError, else wrap
    if (error instanceof Error && error.message.startsWith('{')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.WRITE, 'bookings');
  }
}

/**
 * Saves a single booking request to Firestore if user is authenticated.
 */
export async function saveBookingToFirestore(booking: BookingRequest, userId: string): Promise<void> {
  try {
    const docRef = doc(db, 'bookings', booking.id);
    await setDoc(docRef, {
      ...booking,
      userId,
      updatedAt: new Date().toISOString()
    });
    console.log(`Booking ${booking.bookingRef} successfully saved to Firestore.`);
  } catch (error) {
    console.error('Error saving booking to Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, `bookings/${booking.id}`);
  }
}

/**
 * Listens to realtime changes of bookings for a specific user.
 * This is useful if the admin panel updates booking statuses.
 */
export function setupBookingsListener(userId: string, onUpdate?: () => void) {
  const bookingsRef = collection(db, 'bookings');
  const q = query(bookingsRef, where('userId', '==', userId));

  return onSnapshot(q, (snapshot) => {
    let localBookings: BookingRequest[] = [];
    try {
      localBookings = JSON.parse(localStorage.getItem('yava_bookings') || '[]');
    } catch (e) {
      console.error(e);
    }

    const remoteBookings: BookingRequest[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      remoteBookings.push({
        id: docSnap.id,
        operatorId: data.operatorId || 'op-starlink',
        tripId: data.tripId || 'trip-starlink-bt-ll-morning',
        userId: data.userId || userId,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        departureCity: data.departureCity,
        destinationCity: data.destinationCity,
        travelDate: data.travelDate,
        passengers: data.passengers,
        serviceClass: data.serviceClass,
        isRoundTrip: data.isRoundTrip,
        specialRequests: data.specialRequests,
        bookingRef: data.bookingRef,
        status: data.status,
        createdAt: data.createdAt,
        departureTime: data.departureTime,
        routeGroup: data.routeGroup,
        destinationDistrict: data.destinationDistrict,
      });
    });

    const merged = mergeBookings(localBookings, remoteBookings);
    localStorage.setItem('yava_bookings', JSON.stringify(merged));
    window.dispatchEvent(new Event('storage'));
    
    if (onUpdate) {
      onUpdate();
    }
  }, (error) => {
    console.error('Error listening to bookings updates:', error);
    handleFirestoreError(error, OperationType.GET, 'bookings');
  });
}

/**
 * Initializes and synchronizes routes from Firestore.
 * If the Firestore database has no routes, it populates it with default systems routes.
 * Subscribes to changes and updates both localStorage ('starlink_routes' and 'yava_routes') for compatibility.
 */
export function syncRoutesWithFirestore(onUpdate?: (routes: RouteInfo[]) => void): () => void {
  const routesRef = collection(db, 'routes');
  
  // Seed first if empty
  getDocs(routesRef).then(async (snap) => {
    if (snap.empty) {
      console.log('Seeding default routes into Firestore...');
      const batch = writeBatch(db);
      DEFAULT_SYSTEM_ROUTES.forEach(route => {
        const docRef = doc(db, 'routes', route.id);
        batch.set(docRef, route);
      });
      try {
        await batch.commit();
        console.log('Default routes successfully seeded into Firestore.');
      } catch (err) {
        console.warn('Unable to seed default routes into Firestore (this is expected for non-admin/unauthenticated users):', err);
      }
    }
  }).catch(err => {
    console.error('Error checking/seeding routes in Firestore:', err);
    // Only wrap and throw if it's actually a permission or structural issue, not normal startup
    if (err.code === 'permission-denied') {
      handleFirestoreError(err, OperationType.GET, 'routes');
    }
  });

  // Real-time listener for routes
  return onSnapshot(routesRef, (snapshot) => {
    const activeRoutes: RouteInfo[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data() as RouteInfo;
      activeRoutes.push({
        id: docSnap.id,
        departureCity: data.departureCity,
        destinationCity: data.destinationCity,
        departureTime: data.departureTime,
        arrivalTime: data.arrivalTime,
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        fareStandard: Number(data.fareStandard),
        fareVIP: Number(data.fareVIP),
        duration: data.duration,
        serviceType: data.serviceType,
        busType: data.busType,
        operatorId: data.operatorId || 'op-starlink',
        operatorName: data.operatorName || 'Starlink Tours'
      });
    });

    // Save to local caches for both legacy/new components to listen
    localStorage.setItem('starlink_routes', JSON.stringify(activeRoutes));
    localStorage.setItem('yava_routes', JSON.stringify(activeRoutes));
    
    // Broadcast storage event for other tabs or local listeners
    window.dispatchEvent(new Event('storage'));

    if (onUpdate) {
      onUpdate(activeRoutes);
    }
  }, (error) => {
    console.error('Error listening to routes updates:', error);
    handleFirestoreError(error, OperationType.GET, 'routes');
  });
}

/**
 * Saves/updates a route in Firestore
 */
export async function saveRouteToFirestore(route: RouteInfo): Promise<void> {
  try {
    const docRef = doc(db, 'routes', route.id);
    await setDoc(docRef, route);
    console.log(`Route ${route.id} (${route.departureCity} ➔ ${route.destinationCity}) saved to Firestore.`);
  } catch (error) {
    console.error('Error saving route to Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, `routes/${route.id}`);
  }
}

/**
 * Deletes a route from Firestore
 */
export async function deleteRouteFromFirestore(routeId: string): Promise<void> {
  try {
    const docRef = doc(db, 'routes', routeId);
    await deleteDoc(docRef);
    console.log(`Route ${routeId} deleted from Firestore.`);
  } catch (error) {
    console.error('Error deleting route from Firestore:', error);
    handleFirestoreError(error, OperationType.DELETE, `routes/${routeId}`);
  }
}
