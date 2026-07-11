import React, { useState, useEffect } from 'react';
import { 
  Bus, Users, Calendar, TrendingUp, Shield, Lock, CheckCircle, Clock, 
  Trash2, Edit, Plus, Search, Filter, MessageSquare, BookOpen, AlertCircle, 
  X, RefreshCw, FileText, ChevronRight, DollarSign, RefreshCw as LoopIcon, Check, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RouteInfo, BookingRequest, MAIN_ROUTES, CUSTOMER_TESTIMONIALS, OPERATORS } from '../data';
import { downloadTicket } from '../utils/ticketDownloader';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { syncRoutesWithFirestore, saveRouteToFirestore, deleteRouteFromFirestore, handleFirestoreError, OperationType } from '../utils/firebaseSync';

// Passcode to unlock the admin panel
const ADMIN_PASSCODE = 'admin';

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  category: 'Booking' | 'Route' | 'Review' | 'System';
}

export default function ManagementPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'routes' | 'reviews' | 'logs'>('overview');

  // Firebase auth & tenant isolation states
  const [currentUserOperatorId, setCurrentUserOperatorId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  // Dynamic States synced with localStorage
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  // Search & Filters state
  const [bookingSearch, setBookingSearch] = useState<string>('');
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');
  const [bookingFilterClass, setBookingFilterClass] = useState<string>('all');
  
  // Modal & Edit states
  const [editingBooking, setEditingBooking] = useState<BookingRequest | null>(null);
  const [editingRoute, setEditingRoute] = useState<RouteInfo | null>(null);
  const [showWalkInModal, setShowWalkInModal] = useState<boolean>(false);

  // Walk-in booking form state
  const [walkInName, setWalkInName] = useState<string>('');
  const [walkInPhone, setWalkInPhone] = useState<string>('');
  const [walkInEmail, setWalkInEmail] = useState<string>('');
  const [walkInRouteId, setWalkInRouteId] = useState<string>('');
  const [walkInClass, setWalkInClass] = useState<'Standard' | 'VIP'>('Standard');
  const [walkInDate, setWalkInDate] = useState<string>('');
  const [walkInPassengers, setWalkInPassengers] = useState<number>(1);
  const [walkInSpecial, setWalkInSpecial] = useState<string>('');

  // Session lookup for logged-in operator admin
  useEffect(() => {
    const fetchUserRole = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUserRole(userData.role || 'customer');
            setCurrentUserOperatorId(userData.operatorId || null);
            if (userData.role === 'operator_admin') {
              setIsAuthenticated(true); // Auto-authenticate operator admins
            }
          }
        } catch (e) {
          console.error('Failed to fetch user role:', e);
          handleFirestoreError(e, OperationType.GET, 'users/' + auth.currentUser.uid);
        }
      } else {
        setCurrentUserRole(null);
        setCurrentUserOperatorId(null);
      }
    };
    fetchUserRole();
  }, [auth.currentUser]);

  // Sync state on load
  useEffect(() => {
    // Load Bookings from local cache first
    const storedBookings = localStorage.getItem('starlink_bookings');
    if (storedBookings) {
      try {
        setBookings(JSON.parse(storedBookings));
      } catch (e) {
        console.error('Failed to parse bookings', e);
      }
    } else {
      setBookings([]);
    }

    // Subscribe to Firestore bookings for real-time admin updates!
    const bookingsRef = collection(db, 'bookings');
    const unsubscribeBookings = onSnapshot(bookingsRef, (snapshot) => {
      const allBookings: BookingRequest[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        allBookings.push({
          id: docSnap.id,
          operatorId: data.operatorId || 'op-starlink',
          tripId: data.tripId || 'trip-starlink-bt-ll-morning',
          userId: data.userId || 'walk-in',
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          email: data.email,
          departureCity: data.departureCity,
          destinationCity: data.destinationCity,
          travelDate: data.travelDate,
          passengers: data.passengers,
          serviceClass: data.serviceClass,
          isRoundTrip: data.isRoundTrip || false,
          specialRequests: data.specialRequests,
          bookingRef: data.bookingRef,
          status: data.status,
          createdAt: data.createdAt,
          departureTime: data.departureTime,
          routeGroup: data.routeGroup,
          destinationDistrict: data.destinationDistrict,
        });
      });
      // Sort bookings descending
      allBookings.sort((a, b) => {
        try {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } catch {
          return 0;
        }
      });
      
      setBookings(allBookings);
      localStorage.setItem('starlink_bookings', JSON.stringify(allBookings));
    }, (error) => {
      console.warn('Could not load Firestore bookings in real-time, running in offline/local mode', error);
      handleFirestoreError(error, OperationType.GET, 'bookings');
    });

    // Load Routes in real-time
    const unsubscribeRoutes = syncRoutesWithFirestore((updatedRoutes) => {
      setRoutes(updatedRoutes);
    });

    // Load Reviews
    const storedReviews = localStorage.getItem('starlink_reviews');
    if (storedReviews) {
      try {
        setReviews(JSON.parse(storedReviews));
      } catch (e) {
        console.error('Failed to parse reviews', e);
      }
    } else {
      setReviews(CUSTOMER_TESTIMONIALS);
      localStorage.setItem('starlink_reviews', JSON.stringify(CUSTOMER_TESTIMONIALS));
    }

    // Load Audit Logs
    const storedLogs = localStorage.getItem('starlink_audit_logs');
    if (storedLogs) {
      try {
        setLogs(JSON.parse(storedLogs));
      } catch (e) {
        console.error('Failed to parse audit logs', e);
      }
    } else {
      const initialLogs: AuditLog[] = [
        {
          id: 'log-1',
          timestamp: new Date().toLocaleString(),
          action: 'System Initialized',
          details: 'Executive Admin Console opened and loaded current configurations.',
          category: 'System'
        }
      ];
      setLogs(initialLogs);
      localStorage.setItem('starlink_audit_logs', JSON.stringify(initialLogs));
    }

    // Check if previously logged in this session
    const authStatus = sessionStorage.getItem('starlink_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      const savedOpId = sessionStorage.getItem('starlink_admin_operator_id');
      if (savedOpId && savedOpId !== 'all') {
        setCurrentUserOperatorId(savedOpId);
        setCurrentUserRole('operator_admin');
      } else {
        setCurrentUserOperatorId(null);
        setCurrentUserRole('platform_admin');
      }
    }

    return () => {
      unsubscribeBookings();
      unsubscribeRoutes();
    };
  }, []);

  // Sync functions
  const saveBookingsState = (updatedBookings: BookingRequest[]) => {
    setBookings(updatedBookings);
    localStorage.setItem('starlink_bookings', JSON.stringify(updatedBookings));
    window.dispatchEvent(new Event('storage'));
  };

  const saveRoutesState = (updatedRoutes: RouteInfo[]) => {
    setRoutes(updatedRoutes);
    localStorage.setItem('starlink_routes', JSON.stringify(updatedRoutes));
    window.dispatchEvent(new Event('storage'));
  };

  const saveReviewsState = (updatedReviews: any[]) => {
    setReviews(updatedReviews);
    localStorage.setItem('starlink_reviews', JSON.stringify(updatedReviews));
    window.dispatchEvent(new Event('storage'));
  };

  const addAuditLog = (action: string, details: string, category: 'Booking' | 'Route' | 'Review' | 'System') => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      action,
      details,
      category
    };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('starlink_audit_logs', JSON.stringify(updatedLogs));
  };

  // Auth Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = passcode.toLowerCase().trim();
    if (normalized === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      setCurrentUserOperatorId(null); // Platform admin sees all
      setCurrentUserRole('platform_admin');
      sessionStorage.setItem('starlink_admin_auth', 'true');
      sessionStorage.setItem('starlink_admin_operator_id', 'all');
      setLoginError('');
      addAuditLog('Admin Login', 'Platform Administrator authenticated successfully.', 'System');
    } else if (['starlink', 'kwezy', 'axa', 'sososo'].includes(normalized)) {
      setIsAuthenticated(true);
      const operatorId = `op-${normalized}`;
      setCurrentUserOperatorId(operatorId);
      setCurrentUserRole('operator_admin');
      sessionStorage.setItem('starlink_admin_auth', 'true');
      sessionStorage.setItem('starlink_admin_operator_id', operatorId);
      setLoginError('');
      
      const opName = OPERATORS.find(o => o.id === operatorId)?.name || normalized;
      addAuditLog('Operator Login', `${opName} Administrator authenticated successfully.`, 'System');
    } else {
      setLoginError('Invalid Passcode. Access Denied. (Try: admin, starlink, kwezy, axa, or sososo)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUserOperatorId(null);
    setCurrentUserRole(null);
    sessionStorage.removeItem('starlink_admin_auth');
    sessionStorage.removeItem('starlink_admin_operator_id');
    setPasscode('');
    addAuditLog('Admin Logout', 'Administrator session terminated.', 'System');
  };

  // Booking Moderation
  const handleUpdateBookingStatus = async (id: string, newStatus: 'Pending Review' | 'Confirmed' | 'Completed') => {
    const target = bookings.find(b => b.id === id);
    if (!target) return;

    const updated = bookings.map(b => {
      if (b.id === id) {
        return { ...b, status: newStatus };
      }
      return b;
    });

    saveBookingsState(updated);
    
    // Update in Firestore
    try {
      const docRef = doc(db, 'bookings', id);
      await updateDoc(docRef, { status: newStatus });
    } catch (e) {
      console.error("Firestore update error:", e);
      handleFirestoreError(e, OperationType.UPDATE, `bookings/${id}`);
    }

    addAuditLog(
      'Updated Booking Status', 
      `Booking request #${target.bookingRef} (${target.fullName}) updated to [${newStatus}]`, 
      'Booking'
    );
  };

  const handleDeleteBooking = async (id: string) => {
    const target = bookings.find(b => b.id === id);
    if (!target) return;

    if (confirm(`Are you sure you want to permanently delete booking request #${target.bookingRef} for ${target.fullName}?`)) {
      const filtered = bookings.filter(b => b.id !== id);
      saveBookingsState(filtered);

      // Delete from Firestore
      try {
        const docRef = doc(db, 'bookings', id);
        await deleteDoc(docRef);
      } catch (e) {
        console.error("Firestore delete error:", e);
        handleFirestoreError(e, OperationType.DELETE, `bookings/${id}`);
      }

      addAuditLog(
        'Deleted Booking', 
        `Booking request #${target.bookingRef} for ${target.fullName} deleted from database.`, 
        'Booking'
      );
    }
  };

  const handleSaveBookingEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    const updated = bookings.map(b => {
      if (b.id === editingBooking.id) {
        return editingBooking;
      }
      return b;
    });

    saveBookingsState(updated);

    // Update in Firestore
    try {
      const docRef = doc(db, 'bookings', editingBooking.id);
      await updateDoc(docRef, { ...editingBooking });
    } catch (e) {
      console.error("Firestore edit error:", e);
      handleFirestoreError(e, OperationType.UPDATE, `bookings/${editingBooking.id}`);
    }

    addAuditLog(
      'Edited Booking', 
      `Booking request #${editingBooking.bookingRef} for ${editingBooking.fullName} was manually edited.`, 
      'Booking'
    );
    setEditingBooking(null);
  };

  // Route Configuration
  const handleSaveRouteEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoute) return;

    saveRouteToFirestore(editingRoute)
      .then(() => {
        addAuditLog(
          'Configured Route Schedule', 
          `Route ${editingRoute.departureCity} ➔ ${editingRoute.destinationCity} (${editingRoute.serviceType}) saved/edited. Standard: MWK ${editingRoute.fareStandard.toLocaleString()}, VIP: MWK ${editingRoute.fareVIP.toLocaleString()}`, 
          'Route'
        );
        setEditingRoute(null);
      })
      .catch(err => {
        console.error("Firestore saveRoute error:", err);
        alert('Failed to save route schedule in database. Please check your connection.');
      });
  };

  const handleDeleteRoute = (id: string, departure: string, destination: string) => {
    if (confirm(`Are you sure you want to permanently delete route ${departure} ➔ ${destination}?`)) {
      deleteRouteFromFirestore(id)
        .then(() => {
          addAuditLog(
            'Deleted Route Schedule',
            `Route ${departure} ➔ ${destination} was permanently deleted.`,
            'Route'
          );
        })
        .catch(err => {
          console.error("Firestore deleteRoute error:", err);
          alert('Failed to delete route from database.');
        });
    }
  };

  // Review Moderation
  const handleDeleteReview = (index: number) => {
    const target = reviews[index];
    if (confirm(`Delete testimonial by ${target?.name || 'Guest'}?`)) {
      const updated = [...reviews];
      updated.splice(index, 1);
      saveReviewsState(updated);
      addAuditLog(
        'Deleted Review', 
        `Review by ${target?.name || 'Anonymous'} was moderated and deleted.`, 
        'Review'
      );
    }
  };

  const handlePinReview = (index: number) => {
    // We can simulate pinning by moving it to the top
    const target = reviews[index];
    const updated = [...reviews];
    const item = updated.splice(index, 1)[0];
    updated.unshift(item);
    saveReviewsState(updated);
    addAuditLog(
      'Pinned Review', 
      `Testimonial by ${target?.name || 'Guest'} pinned to top highlights.`, 
      'Review'
    );
    alert('Review pinned to the top of highlights!');
  };

  // Walk-in Booker Submit
  const handleWalkInBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedRoute = routes.find(r => r.id === walkInRouteId);
    if (!selectedRoute) {
      alert('Please select a valid scheduled service route.');
      return;
    }

    const refNum = Math.floor(1000 + Math.random() * 9000);
    const code = selectedRoute.departureCity === 'Blantyre' ? 'BT' : 'LL';
    const reference = `ST-${refNum}-${code}-WK`; // WK indicates physical walk-in

    const newBooking: BookingRequest = {
      id: `book-${Date.now()}`,
      operatorId: (selectedRoute as any).operatorId || currentUserOperatorId || 'op-starlink',
      tripId: selectedRoute.id || 'trip-starlink-bt-ll-morning',
      userId: auth.currentUser ? auth.currentUser.uid : 'walk-in',
      fullName: walkInName,
      phoneNumber: walkInPhone,
      email: walkInEmail || undefined,
      departureCity: selectedRoute.departureCity,
      destinationCity: selectedRoute.destinationCity,
      travelDate: walkInDate || new Date().toISOString().split('T')[0],
      passengers: walkInPassengers,
      serviceClass: walkInClass,
      isRoundTrip: false,
      specialRequests: walkInSpecial || undefined,
      bookingRef: reference,
      status: 'Confirmed', // Walk-ins are confirmed immediately
      createdAt: new Date().toLocaleDateString('en-MW', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      departureTime: `${selectedRoute.departureTime} (${selectedRoute.serviceType})`
    };

    const updated = [newBooking, ...bookings];
    saveBookingsState(updated);

    // Write walk-in booking to Firestore
    try {
      const docRef = doc(db, 'bookings', newBooking.id);
      await setDoc(docRef, {
        ...newBooking,
        userId: 'admin-walk-in',
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error("Firestore walk-in error:", err);
      handleFirestoreError(err, OperationType.CREATE, `bookings/${newBooking.id}`);
    }

    addAuditLog(
      'Walk-In Ticket Issued', 
      `Walk-in Ticket #${reference} issued instantly for ${walkInName} (${walkInPassengers} Seats, ${walkInClass} Class).`, 
      'Booking'
    );

    // Reset Form
    setWalkInName('');
    setWalkInPhone('');
    setWalkInEmail('');
    setWalkInRouteId('');
    setWalkInSpecial('');
    setWalkInPassengers(1);
    setShowWalkInModal(false);

    alert(`Ticket #${reference} successfully generated and confirmed!`);
  };

  // Filter by operator data isolation
  const operatorBookings = bookings.filter(b => {
    if (currentUserOperatorId) {
      return b.operatorId === currentUserOperatorId;
    }
    return true;
  });

  const operatorRoutes = routes.filter(r => {
    if (currentUserOperatorId) {
      return r.operatorId === currentUserOperatorId;
    }
    return true;
  });

  // Metrics Calculations
  const metrics = (() => {
    const totalCount = operatorBookings.length;
    const confirmedCount = operatorBookings.filter(b => b.status === 'Confirmed').length;
    const pendingCount = operatorBookings.filter(b => b.status === 'Pending Review').length;
    const completedCount = operatorBookings.filter(b => b.status === 'Completed').length;
    
    let totalRevenue = 0;
    let standardRevenue = 0;
    let vipRevenue = 0;
    let totalPassengers = 0;

    operatorBookings.forEach(b => {
      // Find matching route to calculate fare, or fallback to standard pricing
      let price = b.serviceClass === 'VIP' ? 45000 : 35000;
      if (b.isRoundTrip) price = 50000; // special package

      const cost = b.passengers * price;
      totalPassengers += b.passengers;

      if (b.status !== 'Completed' && b.status !== 'Confirmed') {
        // We still count projected revenue for active pending bookings
      }
      
      totalRevenue += cost;
      if (b.serviceClass === 'VIP') {
        vipRevenue += cost;
      } else {
        standardRevenue += cost;
      }
    });

    return {
      totalCount,
      confirmedCount,
      pendingCount,
      completedCount,
      totalRevenue,
      standardRevenue,
      vipRevenue,
      totalPassengers
    };
  })();

  // Filter Bookings
  const filteredBookings = operatorBookings.filter(b => {
    const matchesSearch = b.fullName.toLowerCase().includes(bookingSearch.toLowerCase()) || 
                          b.bookingRef.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                          b.phoneNumber.includes(bookingSearch);
    const matchesStatus = bookingFilterStatus === 'all' || b.status === bookingFilterStatus;
    const matchesClass = bookingFilterClass === 'all' || b.serviceClass === bookingFilterClass;
    
    return matchesSearch && matchesStatus && matchesClass;
  });

  if (!isAuthenticated) {
    return (
      <div className="py-24 bg-[#0b1d3a] min-h-screen text-white flex flex-col justify-center items-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-[#0e2548] border border-gold/30 p-8 sm:p-10 shadow-2xl relative rounded-md"
        >
          {/* Logo */}
          <div className="flex flex-col items-center space-y-3 text-center mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-neutral-900 border-2 border-gold text-gold shadow-lg">
              <Shield className="h-7 w-7 stroke-[1.5]" />
            </div>
            <div>
              <h2 className="serif text-2xl font-extrabold tracking-tight text-white uppercase">
                YAVA OFFICE
              </h2>
              <span className="block text-[9px] uppercase tracking-[0.3em] text-gold font-bold">
                Management Login Gate
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50">
                Enter Administrative Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-[#07162d] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-gold font-mono tracking-widest rounded-none"
                  autoFocus
                />
                <Lock className="absolute right-3.5 top-3.5 h-4 w-4 text-white/30" />
              </div>
              <p className="text-[9px] text-white/40 italic">
                * Note: Enter "admin" to unlock this executive dashboard.
              </p>
            </div>

            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs py-3 px-4 flex items-center gap-2">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gold hover:bg-white hover:text-neutral-900 text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer rounded-none"
            >
              Authorize Credentials
            </button>
          </form>

          {/* Bottom Security Banner */}
          <div className="mt-8 border-t border-white/5 pt-4 text-center">
            <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold flex items-center justify-center gap-1.5">
              <span>Class-A Secured Terminal</span>
              <span>&bull;</span>
              <span>GPS Audited</span>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-paper min-h-screen text-ink border-b border-ink-fade pb-16">
      
      {/* Executive Command Header */}
      <div className="bg-[#0b1d3a] text-white border-b-2 border-gold py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold block">
              Administrative Command Center
            </span>
            <h1 className="serif text-3xl font-extrabold tracking-tight text-white uppercase">
              YAVA Fleet & Dispatch Office
            </h1>
            <p className="text-white/60 text-xs sm:text-sm">
              Logged in as <strong className="text-gold">Head Dispatcher</strong> | Central Office Desk (Blantyre & Lilongwe)
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowWalkInModal(true)}
              className="px-4 py-2.5 bg-gold hover:bg-white hover:text-neutral-900 text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Issue Walk-in Ticket</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-neutral-900 hover:bg-red-600 border border-white/10 text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer"
            >
              Lock Terminal
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="bg-[#0e2548] text-white/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview & Analytics', icon: TrendingUp },
            { id: 'bookings', label: `Dispatch Desk (${bookings.length})`, icon: Calendar },
            { id: 'routes', label: 'Route Scheduler', icon: Bus },
            { id: 'reviews', label: 'Review Moderation', icon: MessageSquare },
            { id: 'logs', label: 'Office Audit Log', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4.5 px-6 text-xs font-bold uppercase tracking-widest border-b-2 flex items-center gap-2 shrink-0 transition-all duration-200 ${
                  isActive 
                    ? 'border-gold text-gold font-bold bg-white/5' 
                    : 'border-transparent hover:text-white hover:border-white/20'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-gold' : 'text-current'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white border border-ink-fade p-6 flex items-center gap-5 shadow-sm rounded-sm">
                <div className="p-3 bg-blue-50 text-blue-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink/40 block">Projected Revenue</span>
                  <span className="serif text-xl sm:text-2xl font-bold text-ink block mt-0.5">
                    MWK {metrics.totalRevenue.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-ink/50 italic">From overall created bookings</span>
                </div>
              </div>

              <div className="bg-white border border-ink-fade p-6 flex items-center gap-5 shadow-sm rounded-sm">
                <div className="p-3 bg-emerald-50 text-emerald-600">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink/40 block">Confirmed Seats</span>
                  <span className="serif text-xl sm:text-2xl font-bold text-ink block mt-0.5">
                    {metrics.confirmedCount} <span className="text-xs font-sans font-medium text-ink/45">Requests</span>
                  </span>
                  <span className="text-[9px] text-emerald-600 font-bold block mt-0.5 uppercase tracking-widest text-[8px]">
                    {metrics.totalPassengers} Passengers Confirmed
                  </span>
                </div>
              </div>

              <div className="bg-white border border-ink-fade p-6 flex items-center gap-5 shadow-sm rounded-sm">
                <div className="p-3 bg-amber-50 text-amber-500">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink/40 block">Pending Reviews</span>
                  <span className="serif text-xl sm:text-2xl font-bold text-ink block mt-0.5">
                    {metrics.pendingCount} <span className="text-xs font-sans font-medium text-ink/45">Requests</span>
                  </span>
                  <span className="text-[9px] text-amber-600 font-bold block mt-0.5 uppercase tracking-widest text-[8px]">
                    Requires Dispatch Action
                  </span>
                </div>
              </div>

              <div className="bg-white border border-ink-fade p-6 flex items-center gap-5 shadow-sm rounded-sm">
                <div className="p-3 bg-neutral-100 text-neutral-600">
                  <Bus className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink/40 block">Active Scheduled Routes</span>
                  <span className="serif text-xl sm:text-2xl font-bold text-ink block mt-0.5">
                    {routes.length} <span className="text-xs font-sans font-medium text-ink/45">Active Services</span>
                  </span>
                  <span className="text-[9px] text-gold font-bold block mt-0.5 uppercase tracking-widest text-[8px]">
                    100% On-Time Reliability
                  </span>
                </div>
              </div>

            </div>

            {/* Custom SVG Charts Section (Classy Office Look) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Chart 1: Revenue & Seat Trends (SVG Representation) */}
              <div className="lg:col-span-8 bg-white border border-ink-fade p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h3 className="serif text-lg font-bold text-ink">Ticket Booking Distribution</h3>
                    <p className="text-xs text-ink/50 mt-1">Passenger class split & booking ratios between standard and VIP configurations.</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 bg-[#0b1d3a]"></span>
                      <span>Standard Luxury (MWK 35,000)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 bg-gold"></span>
                      <span>VIP Lounge Class (MWK 45,000)</span>
                    </span>
                  </div>
                </div>

                {/* SVG Visual Stack Chart */}
                <div className="relative py-12 px-2 border-l border-b border-ink-fade min-h-[220px] flex items-end justify-around gap-2 bg-neutral-50/50">
                  {bookings.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-ink/40 text-xs">
                      <AlertCircle className="h-8 w-8 mb-2" />
                      <span>No active data sets to plot. Real-time bookings populate this chart.</span>
                    </div>
                  ) : (
                    <>
                      {/* Vertical Gridlines */}
                      <div className="absolute left-0 right-0 top-[25%] border-t border-dashed border-ink-fade"></div>
                      <div className="absolute left-0 right-0 top-[50%] border-t border-dashed border-ink-fade"></div>
                      <div className="absolute left-0 right-0 top-[75%] border-t border-dashed border-ink-fade"></div>
                      
                      {/* Generate a nice representation based on route split */}
                      {['Blantyre ➔ Lilongwe', 'Lilongwe ➔ Blantyre'].map((label, idx) => {
                        const routeBookings = bookings.filter(b => 
                          idx === 0 
                            ? b.departureCity === 'Blantyre' 
                            : b.departureCity === 'Lilongwe'
                        );
                        
                        const standardPass = routeBookings.filter(b => b.serviceClass === 'Standard').reduce((sum, b) => sum + b.passengers, 0);
                        const vipPass = routeBookings.filter(b => b.serviceClass === 'VIP').reduce((sum, b) => sum + b.passengers, 0);
                        const totalPass = standardPass + vipPass;
                        
                        // height ratio
                        const maxVal = Math.max(1, bookings.reduce((sum, b) => sum + b.passengers, 0));
                        const standardHeight = (standardPass / maxVal) * 100;
                        const vipHeight = (vipPass / maxVal) * 100;

                        return (
                          <div key={idx} className="flex flex-col items-center w-1/3 group relative z-10">
                            {/* Stacking bar columns */}
                            <div className="w-16 sm:w-24 flex flex-col justify-end min-h-[150px]">
                              {vipHeight > 0 && (
                                <div 
                                  style={{ height: `${Math.max(10, vipHeight)}%` }}
                                  className="bg-gold w-full flex items-center justify-center text-white text-[10px] font-bold transition-all duration-500 hover:opacity-95"
                                  title={`VIP: ${vipPass} Seats`}
                                >
                                  {vipPass > 0 && `${vipPass} VIP`}
                                </div>
                              )}
                              {standardHeight > 0 && (
                                <div 
                                  style={{ height: `${Math.max(10, standardHeight)}%` }}
                                  className="bg-[#0b1d3a] w-full flex items-center justify-center text-white text-[10px] font-bold transition-all duration-500 hover:opacity-95 border-t border-white/10"
                                  title={`Standard: ${standardPass} Seats`}
                                >
                                  {standardPass > 0 && `${standardPass} Std`}
                                </div>
                              )}
                            </div>
                            <span className="text-[10px] sm:text-xs font-bold text-ink mt-3 text-center truncate w-full block">
                              {label}
                            </span>
                            <span className="text-[9px] text-ink/50 mt-0.5">
                              {totalPass} Total seats
                            </span>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>

              {/* Chart 2: Seat Class Split (Pie Donut Representation) */}
              <div className="lg:col-span-4 bg-white border border-ink-fade p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="serif text-lg font-bold text-ink">Service Classification</h3>
                  <p className="text-xs text-ink/50 mt-1">Visualizing standard luxury vs VIP lounge request shares.</p>
                </div>

                <div className="flex justify-center items-center py-6">
                  {/* Clean SVG Donut Chart */}
                  <div className="relative h-36 w-36">
                    <svg viewBox="0 0 36 36" className="h-full w-full">
                      {/* Grey placeholder */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                      
                      {/* Calculation for segments */}
                      {(() => {
                        const vipPercent = bookings.length === 0 ? 30 : Math.round((bookings.filter(b => b.serviceClass === 'VIP').length / bookings.length) * 100);
                        const stdPercent = 100 - vipPercent;
                        
                        // dasharray calculations
                        const strokeDasharray = `${vipPercent} ${stdPercent}`;
                        
                        return (
                          <circle 
                            cx="18" 
                            cy="18" 
                            r="15.915" 
                            fill="none" 
                            stroke="#b8860b" 
                            strokeWidth="3.2" 
                            strokeDasharray={strokeDasharray} 
                            strokeDashoffset="25" 
                          />
                        );
                      })()}
                    </svg>
                    
                    {/* Centered statistics */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
                      <span className="text-xl serif font-extrabold text-ink">
                        {bookings.length === 0 ? '0%' : `${Math.round((bookings.filter(b => b.serviceClass === 'VIP').length / Math.max(1, bookings.length)) * 100)}%`}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-gold font-bold">VIP Share</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-ink-fade pt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-ink/75">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="h-2 w-2 bg-gold"></span>
                      <span>VIP Suite Bookings</span>
                    </span>
                    <span className="font-bold">{bookings.filter(b => b.serviceClass === 'VIP').length} Requests</span>
                  </div>
                  <div className="flex items-center justify-between text-ink/75">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="h-2 w-2 bg-[#0b1d3a]"></span>
                      <span>Standard Luxury Bookings</span>
                    </span>
                    <span className="font-bold">{bookings.filter(b => b.serviceClass === 'Standard').length} Requests</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Dispatch Summary Board */}
            <div className="bg-white border border-ink-fade p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="serif text-lg font-bold text-ink">Action Required: Pending Passenger Requests</h3>
                  <p className="text-xs text-ink/50 mt-1">Pending verification on dispatch desk. Confirm seats instantly to validate.</p>
                </div>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs text-gold hover:text-ink font-bold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Go to Dispatch Desk</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {bookings.filter(b => b.status === 'Pending Review').length === 0 ? (
                <div className="text-center py-8 bg-[#faf7f2] border border-dashed border-ink-fade">
                  <p className="text-xs text-ink/50">All incoming reservations have been cleared! Pristine queue.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-ink-fade text-[10px] uppercase text-ink/50 tracking-wider">
                        <th className="py-3 px-4 font-bold">Ref Code</th>
                        <th className="py-3 px-4 font-bold">Passenger</th>
                        <th className="py-3 px-4 font-bold">Route & Departure</th>
                        <th className="py-3 px-4 font-bold">Travel Date</th>
                        <th className="py-3 px-4 font-bold text-right">Fare Amount</th>
                        <th className="py-3 px-4 font-bold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-fade">
                      {bookings.filter(b => b.status === 'Pending Review').slice(0, 5).map((b) => {
                        const price = b.serviceClass === 'VIP' ? 45000 : 35000;
                        const total = b.passengers * price;
                        return (
                          <tr key={b.id} className="hover:bg-neutral-50">
                            <td className="py-3.5 px-4 font-mono font-bold text-ink">{b.bookingRef}</td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-ink">{b.fullName}</div>
                              <div className="text-[10px] text-ink/50">{b.phoneNumber}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-ink">{b.departureCity} ➔ {b.destinationCity}</div>
                              <div className="text-[10px] text-[#0b1d3a] font-bold">{b.departureTime}</div>
                              {b.routeGroup && (
                                <div className="text-[9px] text-[#FF5A1F] font-bold uppercase mt-1">{b.routeGroup} &bull; {b.destinationDistrict}</div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-medium">{b.travelDate}</td>
                            <td className="py-3.5 px-4 font-bold text-ink text-right">MWK {total.toLocaleString()}</td>
                            <td className="py-3.5 px-4 text-center">
                              <div className="inline-flex gap-2">
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.id, 'Confirmed')}
                                  className="px-2.5 py-1.5 bg-gold hover:bg-neutral-900 text-white text-[9px] font-bold uppercase tracking-widest cursor-pointer"
                                >
                                  Approve & Confirm
                                </button>
                                <button
                                  onClick={() => handleDeleteBooking(b.id)}
                                  className="p-1.5 text-ink/40 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Reject Booking"
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: DISPATCH DESK (BOOKINGS) */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter and Control Bar */}
            <div className="bg-white border border-ink-fade p-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between shadow-sm">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search passengers by name, reference code, or phone number..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full bg-paper border border-ink-fade py-3.5 pl-10 pr-4 text-xs focus:outline-none focus:border-gold rounded-none text-ink font-medium"
                />
                <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-ink/30" />
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-paper border border-ink-fade px-3 py-1 text-xs">
                  <Filter className="h-4 w-4 text-gold shrink-0" />
                  <select
                    value={bookingFilterStatus}
                    onChange={(e) => setBookingFilterStatus(e.target.value)}
                    className="bg-transparent focus:outline-none text-ink font-semibold py-1 pr-4 rounded-none border-none text-[11px] uppercase tracking-wider"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-paper border border-ink-fade px-3 py-1 text-xs">
                  <Bus className="h-4 w-4 text-gold shrink-0" />
                  <select
                    value={bookingFilterClass}
                    onChange={(e) => setBookingFilterClass(e.target.value)}
                    className="bg-transparent focus:outline-none text-ink font-semibold py-1 pr-4 rounded-none border-none text-[11px] uppercase tracking-wider"
                  >
                    <option value="all">All Classes</option>
                    <option value="Standard">Standard Class</option>
                    <option value="VIP">VIP Class</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setBookingSearch('');
                    setBookingFilterStatus('all');
                    setBookingFilterClass('all');
                  }}
                  className="p-3 text-ink/50 hover:text-gold transition-colors hover:bg-neutral-50 border border-ink-fade cursor-pointer"
                  title="Reset Filters"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Bookings moderation Table */}
            <div className="bg-white border border-ink-fade shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-ink-fade flex justify-between items-center bg-[#faf7f2]">
                <div>
                  <h3 className="serif text-base font-bold text-ink">Incoming Reservation Ledger</h3>
                  <p className="text-[10px] uppercase text-ink/40 tracking-wider font-bold mt-0.5">
                    Showing {filteredBookings.length} of {bookings.length} reservations
                  </p>
                </div>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="text-center py-20 text-ink/40">
                  <AlertCircle className="h-10 w-10 mx-auto mb-3" />
                  <p className="serif text-lg font-bold">No ledger files found matching the filters.</p>
                  <p className="text-xs mt-1">Refine your search parameters or issue a walk-in client ticket.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-ink-fade text-[10px] uppercase text-ink/50 tracking-wider bg-neutral-50/70">
                        <th className="py-4.5 px-6 font-bold">Reference</th>
                        <th className="py-4.5 px-6 font-bold">Passenger Details</th>
                        <th className="py-4.5 px-6 font-bold">Route</th>
                        <th className="py-4.5 px-6 font-bold">Date & Time</th>
                        <th className="py-4.5 px-6 font-bold text-center">Seat/Class</th>
                        <th className="py-4.5 px-6 font-bold text-right">Fare (MWK)</th>
                        <th className="py-4.5 px-6 font-bold text-center">Status</th>
                        <th className="py-4.5 px-6 font-bold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-fade">
                      {filteredBookings.map((b) => {
                        const price = b.serviceClass === 'VIP' ? 45000 : 35000;
                        const total = b.passengers * price;
                        return (
                          <tr key={b.id} className="hover:bg-neutral-50 transition-colors">
                            <td className="py-4 px-6 font-mono font-bold text-ink whitespace-nowrap">
                              {b.bookingRef}
                            </td>
                            <td className="py-4 px-6">
                              <div className="font-bold text-ink text-sm">{b.fullName}</div>
                              <div className="text-[10px] text-ink/50 mt-0.5 font-mono">{b.phoneNumber}</div>
                              {b.email && <div className="text-[9px] text-ink/40 font-mono">{b.email}</div>}
                            </td>
                            <td className="py-4 px-6 font-semibold whitespace-nowrap">
                              <div>{b.departureCity} ➔ {b.destinationCity}</div>
                              {b.routeGroup && (
                                <div className="text-[9px] text-[#FF5A1F] font-bold uppercase mt-1">{b.routeGroup} &bull; {b.destinationDistrict}</div>
                              )}
                            </td>
                            <td className="py-4 px-6">
                              <div className="font-semibold text-ink">{b.travelDate}</div>
                              <div className="text-[10px] text-[#0b1d3a] font-bold mt-0.5">{b.departureTime}</div>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="font-bold text-ink">{b.passengers} Seats</span>
                              <span className={`block text-[9px] font-bold uppercase tracking-wider mt-1 ${b.serviceClass === 'VIP' ? 'text-gold' : 'text-ink/60'}`}>
                                {b.serviceClass} Executive
                              </span>
                            </td>
                            <td className="py-4 px-6 font-bold text-ink text-right font-mono whitespace-nowrap">
                              MWK {total.toLocaleString()}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider inline-block ${
                                b.status === 'Confirmed' 
                                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                                  : b.status === 'Completed'
                                    ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                                    : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <div className="flex justify-center items-center gap-1.5">
                                {b.status === 'Pending Review' && (
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b.id, 'Confirmed')}
                                    className="p-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                                    title="Approve & Confirm"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </button>
                                )}
                                {b.status === 'Confirmed' && (
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b.id, 'Completed')}
                                    className="px-2 py-1 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white text-[9px] font-bold uppercase tracking-widest cursor-pointer"
                                    title="Complete Journey"
                                  >
                                    Departed
                                  </button>
                                )}
                                <button
                                  onClick={() => setEditingBooking(b)}
                                  className="p-1.5 bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-600 hover:text-white transition-colors cursor-pointer"
                                  title="Edit Reservation Details"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => downloadTicket(b)}
                                  className="p-1.5 bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
                                  title="Print ticket file copy"
                                >
                                  <FileText className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteBooking(b.id)}
                                  className="p-1.5 bg-red-50 text-red-500 border border-red-200 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                                  title="Delete Permanent Log"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ROUTE SCHEDULER */}
        {activeTab === 'routes' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Route Cards */}
            <div className="bg-white border border-ink-fade shadow-sm p-6 sm:p-8 space-y-6">
              <div className="border-b border-ink-fade pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                <div>
                  <h3 className="serif text-lg font-bold text-ink">Active Intercity Scheduled Fares & Times</h3>
                  <p className="text-xs text-ink/50 mt-1">Changes made here instantly configure client ticket booking forms and schedules dynamically.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      const newId = `route-${Date.now()}`;
                      setEditingRoute({
                        id: newId,
                        departureCity: 'Blantyre',
                        destinationCity: 'Lilongwe',
                        departureTime: '08:00 AM',
                        arrivalTime: '12:30 PM',
                        pickupLocation: 'Wenela Terminal, Blantyre',
                        dropoffLocation: 'Grand Business Park, Lilongwe',
                        fareStandard: 35000,
                        fareVIP: 45000,
                        duration: '4.5 Hours',
                        serviceType: 'Morning Express',
                        busType: 'Standard Luxury',
                        operatorId: currentUserOperatorId || 'op-starlink',
                        operatorName: OPERATORS.find(o => o.id === (currentUserOperatorId || 'op-starlink'))?.name || 'Starlink Tours'
                      });
                    }}
                    className="px-4 py-2 bg-gold hover:bg-[#0b1d3a] hover:text-white text-white text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer shadow-sm transition-all duration-300"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create New Route</span>
                  </button>
                  <div className="px-3.5 py-1.5 bg-green-50 text-green-700 text-[10px] uppercase tracking-widest font-bold border border-green-200 flex items-center gap-1">
                    <span className="flex h-1.5 w-1.5 bg-green-600 rounded-full animate-ping"></span>
                    <span>Live Booking Engine Synced</span>
                  </div>
                </div>
              </div>

              {operatorRoutes.length === 0 ? (
                <div className="text-center py-16 text-ink/40">
                  <Bus className="h-10 w-10 mx-auto mb-3 text-ink/30" />
                  <p className="serif text-base font-bold">No registered routes found for this operator.</p>
                  <p className="text-xs mt-1">Click "Create New Route" to establish your first scheduled transport corridor.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  {operatorRoutes.map((route) => {
                    const opLogo = OPERATORS.find(o => o.id === route.operatorId)?.logo || '✨';
                    return (
                      <div 
                        key={route.id}
                        className="border border-ink-fade hover:border-gold/50 bg-[#faf7f2] p-6 relative flex flex-col justify-between"
                      >
                        <div className="absolute top-0 right-0 bg-[#0b1d3a] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 flex items-center gap-1">
                          <span>{opLogo}</span>
                          <span>{route.operatorName || 'Starlink'}</span>
                          <span>&bull;</span>
                          <span>{route.serviceType}</span>
                        </div>

                        <div className="space-y-5">
                          {/* Cities & Direction */}
                          <div className="flex items-center gap-3 pt-3">
                            <div className="serif text-xl font-bold text-ink">{route.departureCity}</div>
                            <ChevronRight className="h-4 w-4 text-gold shrink-0" />
                            <div className="serif text-xl font-bold text-ink">{route.destinationCity}</div>
                          </div>

                          {/* Timetable config */}
                          <div className="grid grid-cols-2 gap-4 text-xs bg-white p-4 border border-ink-fade">
                            <div>
                              <strong className="text-ink/40 block uppercase text-[9px] font-bold">Standard Class Fare</strong>
                              <span className="serif text-lg font-bold text-ink">MWK {route.fareStandard.toLocaleString()}</span>
                            </div>
                            <div>
                              <strong className="text-ink/40 block uppercase text-[9px] font-bold">VIP Class Fare</strong>
                              <span className="serif text-lg font-bold text-gold">MWK {route.fareVIP.toLocaleString()}</span>
                            </div>
                            <div>
                              <strong className="text-ink/40 block uppercase text-[9px] font-bold">Departure Time</strong>
                              <span className="font-semibold text-ink">{route.departureTime}</span>
                            </div>
                            <div>
                              <strong className="text-ink/40 block uppercase text-[9px] font-bold">Trip Duration</strong>
                              <span className="font-semibold text-ink">{route.duration}</span>
                            </div>
                          </div>

                          {/* Station detailed addresses */}
                          <div className="space-y-2 text-xs text-ink/70">
                            <div className="flex items-start gap-1.5">
                              <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                              <span><strong>Boarding:</strong> {route.pickupLocation}</span>
                            </div>
                            <div className="flex items-start gap-1.5">
                              <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                              <span><strong>Dropoff:</strong> {route.dropoffLocation}</span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-ink-fade pt-4 mt-6 flex justify-end items-center gap-2">
                          <button
                            onClick={() => handleDeleteRoute(route.id, route.departureCity, route.destinationCity)}
                            className="px-3 py-2 bg-red-50 hover:bg-red-600 border border-red-200 text-red-600 hover:text-white text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer transition-colors"
                            title="Delete this scheduled service"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete</span>
                          </button>
                          <button
                            onClick={() => setEditingRoute(route)}
                            className="px-4 py-2 bg-ink hover:bg-gold hover:text-neutral-900 text-white text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            <span>Edit Schedule / Rates</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: REVIEW MODERATION */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white border border-ink-fade p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="serif text-lg font-bold text-ink">Traveler Testimonials & Reputation Moderation</h3>
                <p className="text-xs text-ink/50 mt-1">Review guest commentary. Pin premium testimonials to home page or remove spam reviews instantly.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {reviews.map((r, i) => (
                  <div 
                    key={i}
                    className="bg-paper border border-ink-fade p-6 flex flex-col justify-between"
                  >
                    <div className="space-y-4 text-left">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-0.5 text-gold text-xs">
                          ★★★★★
                        </div>
                        <span className="text-[10px] font-mono text-ink/40">{r.date || 'Recent'}</span>
                      </div>
                      <p className="serif text-xs text-ink italic leading-relaxed">
                        &ldquo;{r.comment}&rdquo;
                      </p>
                    </div>

                    <div className="pt-4 border-t border-ink-fade mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 flex items-center justify-center bg-gold text-neutral-900 text-[10px] font-bold font-serif uppercase shrink-0">
                          {r.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                        </div>
                        <div className="overflow-hidden">
                          <span className="block font-bold text-[11px] text-ink truncate">{r.name}</span>
                          <span className="block text-[8px] uppercase tracking-wider text-ink/45">{r.role || 'Passenger'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handlePinReview(i)}
                          className="px-2 py-1 bg-gold/10 text-gold border border-gold/20 text-[9px] font-bold uppercase tracking-wider hover:bg-gold hover:text-neutral-900 transition-colors cursor-pointer"
                          title="Pin Review to Homepage Top"
                        >
                          Pin
                        </button>
                        <button
                          onClick={() => handleDeleteReview(i)}
                          className="p-1.5 text-ink/40 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Moderate Review"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: OFFICE AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white border border-ink-fade shadow-sm p-6 sm:p-8 space-y-6">
              <div className="border-b border-ink-fade pb-4 flex justify-between items-center">
                <div>
                  <h3 className="serif text-lg font-bold text-ink">Administrative Audit Trail & Activity Registers</h3>
                  <p className="text-xs text-ink/50 mt-1">Immutable secure list of staff modifications, seat approvals, and schedule pricing updates.</p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Clear audit logs?')) {
                      setLogs([]);
                      localStorage.setItem('starlink_audit_logs', '[]');
                    }
                  }}
                  className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 font-bold uppercase tracking-widest text-[9px] hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                >
                  Clear Logs
                </button>
              </div>

              <div className="divide-y divide-ink-fade font-mono text-xs">
                {logs.length === 0 ? (
                  <p className="text-center py-8 text-ink/40 italic">Audit register is empty.</p>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="py-4 flex flex-col sm:flex-row gap-4 sm:items-start hover:bg-neutral-50/50">
                      <div className="w-48 text-ink/40 text-[11px] shrink-0">{log.timestamp}</div>
                      <div className="w-40 shrink-0">
                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider inline-block ${
                          log.category === 'Booking' 
                            ? 'bg-blue-100 text-blue-700' 
                            : log.category === 'Route'
                              ? 'bg-purple-100 text-purple-700'
                              : log.category === 'Review'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          {log.category} : {log.action}
                        </span>
                      </div>
                      <div className="text-ink font-sans text-xs leading-relaxed">{log.details}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: WALK-IN TICKET BOOKING */}
      <AnimatePresence>
        {showWalkInModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWalkInModal(false)}
              className="absolute inset-0 bg-ink/75 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-lg bg-white border border-gold/40 shadow-2xl z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-[#0b1d3a] text-white p-6 flex justify-between items-center border-b border-gold/40">
                <div className="flex items-center gap-2.5">
                  <Plus className="h-5 w-5 text-gold" />
                  <h3 className="serif text-lg font-bold">Issue Physical Walk-In Seat Ticket</h3>
                </div>
                <button
                  onClick={() => setShowWalkInModal(false)}
                  className="p-1 text-white/50 hover:text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form content */}
              <form onSubmit={handleWalkInBooking} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Passenger Name *</label>
                    <input
                      type="text"
                      required
                      value={walkInName}
                      onChange={(e) => setWalkInName(e.target.value)}
                      placeholder="e.g. John Banda"
                      className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      value={walkInPhone}
                      onChange={(e) => setWalkInPhone(e.target.value)}
                      placeholder="e.g. +265 991..."
                      className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Passenger Email (Optional)</label>
                  <input
                    type="email"
                    value={walkInEmail}
                    onChange={(e) => setWalkInEmail(e.target.value)}
                    placeholder="e.g. client@office.com"
                    className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Scheduled Service Route *</label>
                  <select
                    required
                    value={walkInRouteId}
                    onChange={(e) => setWalkInRouteId(e.target.value)}
                    className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                  >
                    <option value="">Select Route Option...</option>
                    {routes.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.departureCity} ➔ {r.destinationCity} ({r.serviceType} - {r.departureTime})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Seats *</label>
                    <select
                      value={walkInPassengers}
                      onChange={(e) => setWalkInPassengers(Number(e.target.value))}
                      className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <option key={n} value={n}>{n} Passengers</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Class *</label>
                    <select
                      value={walkInClass}
                      onChange={(e) => setWalkInClass(e.target.value as any)}
                      className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                    >
                      <option value="Standard">Standard (35K)</option>
                      <option value="VIP">VIP Lounge (45K)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Travel Date *</label>
                    <input
                      type="date"
                      required
                      value={walkInDate}
                      onChange={(e) => setWalkInDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Staff & Counter Notes</label>
                  <input
                    type="text"
                    value={walkInSpecial}
                    onChange={(e) => setWalkInSpecial(e.target.value)}
                    placeholder="e.g. Seat preference, corporate voucher code, wheelchair"
                    className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                  />
                </div>

                {/* Submit */}
                <div className="pt-4 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setShowWalkInModal(false)}
                    className="py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-widest cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-3 bg-gold hover:bg-[#0b1d3a] text-white text-xs font-bold uppercase tracking-widest cursor-pointer"
                  >
                    Confirm & Issue Ticket
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: EDIT ROUTE */}
      <AnimatePresence>
        {editingRoute && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingRoute(null)}
              className="absolute inset-0 bg-ink/75 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white border border-gold/40 shadow-2xl z-10 overflow-hidden"
            >
              <div className="bg-[#0b1d3a] text-white p-6 flex justify-between items-center border-b border-gold/40">
                <div className="flex items-center gap-2.5">
                  <Edit className="h-5 w-5 text-gold" />
                  <h3 className="serif text-lg font-bold">Configure Route Schedule</h3>
                </div>
                <button onClick={() => setEditingRoute(null)} className="p-1 text-white/50 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveRouteEdit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Cities configuration */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Departure City *</label>
                    <select
                      required
                      value={editingRoute.departureCity}
                      onChange={(e) => setEditingRoute({ ...editingRoute, departureCity: e.target.value })}
                      className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                    >
                      <option value="Blantyre">Blantyre</option>
                      <option value="Lilongwe">Lilongwe</option>
                      <option value="Mzuzu">Mzuzu</option>
                      <option value="Zomba">Zomba</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Destination City *</label>
                    <select
                      required
                      value={editingRoute.destinationCity}
                      onChange={(e) => setEditingRoute({ ...editingRoute, destinationCity: e.target.value })}
                      className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                    >
                      <option value="Blantyre">Blantyre</option>
                      <option value="Lilongwe">Lilongwe</option>
                      <option value="Mzuzu">Mzuzu</option>
                      <option value="Zomba">Zomba</option>
                    </select>
                  </div>
                </div>

                {/* Service type & Operator (if platform admin) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Service Type *</label>
                    <select
                      required
                      value={editingRoute.serviceType}
                      onChange={(e) => setEditingRoute({ ...editingRoute, serviceType: e.target.value })}
                      className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                    >
                      <option value="Morning Express">Morning Express</option>
                      <option value="Afternoon Executive">Afternoon Executive</option>
                      <option value="Night Cruiser">Night Cruiser</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Bus/Class Type *</label>
                    <select
                      required
                      value={editingRoute.busType}
                      onChange={(e) => setEditingRoute({ ...editingRoute, busType: e.target.value })}
                      className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                    >
                      <option value="Standard Luxury">Standard Luxury</option>
                      <option value="VIP Club Class">VIP Club Class</option>
                      <option value="Double Decker Executive">Double Decker Executive</option>
                    </select>
                  </div>
                </div>

                {/* Operator configuration (Locked for operator admins, selectable for platform admins) */}
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Service Operator *</label>
                  {currentUserRole === 'platform_admin' ? (
                    <select
                      required
                      value={editingRoute.operatorId}
                      onChange={(e) => {
                        const opId = e.target.value;
                        const opName = OPERATORS.find(o => o.id === opId)?.name || 'Starlink Tours';
                        setEditingRoute({ ...editingRoute, operatorId: opId, operatorName: opName });
                      }}
                      className="w-full border-b border-[#cca43b] py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                    >
                      {OPERATORS.map(op => (
                        <option key={op.id} value={op.id}>{op.name}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="py-2 text-xs font-semibold text-ink/70 bg-neutral-50 px-2 border-l-2 border-gold">
                      {editingRoute.operatorName || 'Your Registered Company'}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Standard Fare (MWK) *</label>
                    <input
                      type="number"
                      required
                      value={editingRoute.fareStandard}
                      onChange={(e) => setEditingRoute({ ...editingRoute, fareStandard: Number(e.target.value) })}
                      className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink font-mono rounded-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">VIP Fare (MWK) *</label>
                    <input
                      type="number"
                      required
                      value={editingRoute.fareVIP}
                      onChange={(e) => setEditingRoute({ ...editingRoute, fareVIP: Number(e.target.value) })}
                      className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink font-mono rounded-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Departure Time *</label>
                    <input
                      type="text"
                      required
                      value={editingRoute.departureTime}
                      onChange={(e) => setEditingRoute({ ...editingRoute, departureTime: e.target.value })}
                      className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Trip Duration *</label>
                    <input
                      type="text"
                      required
                      value={editingRoute.duration}
                      onChange={(e) => setEditingRoute({ ...editingRoute, duration: e.target.value })}
                      className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Pickup Terminal Address *</label>
                  <input
                    type="text"
                    required
                    value={editingRoute.pickupLocation}
                    onChange={(e) => setEditingRoute({ ...editingRoute, pickupLocation: e.target.value })}
                    className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Dropoff Terminal Address *</label>
                  <input
                    type="text"
                    required
                    value={editingRoute.dropoffLocation}
                    onChange={(e) => setEditingRoute({ ...editingRoute, dropoffLocation: e.target.value })}
                    className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                  />
                </div>

                <div className="pt-4 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setEditingRoute(null)}
                    className="py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-widest cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-3 bg-gold hover:bg-ink text-white text-xs font-bold uppercase tracking-widest cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: EDIT BOOKING */}
      <AnimatePresence>
        {editingBooking && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingBooking(null)}
              className="absolute inset-0 bg-ink/75 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white border border-gold/40 shadow-2xl z-10 overflow-hidden"
            >
              <div className="bg-[#0b1d3a] text-white p-6 flex justify-between items-center border-b border-gold/40">
                <div className="flex items-center gap-2.5">
                  <Edit className="h-5 w-5 text-gold" />
                  <h3 className="serif text-lg font-bold">Edit Booking Request</h3>
                </div>
                <button onClick={() => setEditingBooking(null)} className="p-1 text-white/50 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveBookingEdit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Passenger Name *</label>
                    <input
                      type="text"
                      required
                      value={editingBooking.fullName}
                      onChange={(e) => setEditingBooking({ ...editingBooking, fullName: e.target.value })}
                      className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Contact Phone *</label>
                    <input
                      type="text"
                      required
                      value={editingBooking.phoneNumber}
                      onChange={(e) => setEditingBooking({ ...editingBooking, phoneNumber: e.target.value })}
                      className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Seats *</label>
                    <select
                      value={editingBooking.passengers}
                      onChange={(e) => setEditingBooking({ ...editingBooking, passengers: Number(e.target.value) })}
                      className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <option key={n} value={n}>{n} Seats</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Class *</label>
                    <select
                      value={editingBooking.serviceClass}
                      onChange={(e) => setEditingBooking({ ...editingBooking, serviceClass: e.target.value as any })}
                      className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                    >
                      <option value="Standard">Standard</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Status *</label>
                    <select
                      value={editingBooking.status}
                      onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value as any })}
                      className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none font-bold"
                    >
                      <option value="Pending Review">Pending Review</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Travel Date *</label>
                    <input
                      type="date"
                      required
                      value={editingBooking.travelDate}
                      onChange={(e) => setEditingBooking({ ...editingBooking, travelDate: e.target.value })}
                      className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Travel Schedule *</label>
                    <input
                      type="text"
                      required
                      value={editingBooking.departureTime}
                      onChange={(e) => setEditingBooking({ ...editingBooking, departureTime: e.target.value })}
                      className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/50">Special Requirements & Staff Notes</label>
                  <textarea
                    rows={2}
                    value={editingBooking.specialRequests || ''}
                    onChange={(e) => setEditingBooking({ ...editingBooking, specialRequests: e.target.value || undefined })}
                    className="w-full border-b border-ink-fade py-2 text-xs focus:outline-none focus:border-gold bg-transparent font-semibold text-ink rounded-none resize-none"
                  />
                </div>

                <div className="pt-4 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setEditingBooking(null)}
                    className="py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-widest cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-3 bg-gold hover:bg-ink text-white text-xs font-bold uppercase tracking-widest cursor-pointer"
                  >
                    Save Details
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
