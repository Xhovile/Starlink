import { 
  collection, doc, setDoc, getDocs, query, where, onSnapshot, writeBatch, getDoc 
} from 'firebase/firestore';
import { db } from '../firebase';
import { BookingRequest } from '../data';

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
    const querySnapshot = await getDocs(q);
    
    const remoteBookings: BookingRequest[] = [];
    querySnapshot.forEach(docSnap => {
      const data = docSnap.data();
      remoteBookings.push({
        id: docSnap.id,
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
      await batch.commit();
      console.log('Successfully synced local bookings to Firestore.');
    }
  } catch (error) {
    console.error('Error syncing bookings with Firestore:', error);
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
  });
}
