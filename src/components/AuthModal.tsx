import React, { useState } from 'react';
import { 
  X, Mail, Lock, User, AlertCircle, CheckCircle2, Loader2, ArrowRight, Eye, EyeOff, Building2 
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { OPERATORS } from '../data';
import { motion } from 'motion/react';
import YavaLogo from './YavaLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Multi-operator states
  const [signupRole, setSignupRole] = useState<'customer' | 'operator_admin'>('customer');
  const [selectedOperatorId, setSelectedOperatorId] = useState('op-starlink');

  if (!isOpen) return null;

  const resetState = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setError('');
    setSuccess('');
    setSignupRole('customer');
    setSelectedOperatorId('op-starlink');
  };

  const handleModeChange = (newMode: 'login' | 'signup' | 'forgot') => {
    setMode(newMode);
    setError('');
    setSuccess('');
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Save profile to Firestore if it does not exist
      const userId = userCredential.user.uid;
      const userDocRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          id: userId,
          email: userCredential.user.email,
          fullName: userCredential.user.displayName || 'Google User',
          role: 'customer',
          createdAt: new Date().toISOString()
        });
      }

      setSuccess('Successfully signed in with Google!');
      setTimeout(() => {
        onClose();
        resetState();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      let errMsg = 'An unexpected error occurred during Google Sign In.';
      if (err.code === 'auth/popup-closed-by-user') {
        errMsg = 'The sign in popup was closed before completion.';
      } else if (err.code === 'auth/blocked-by-popup-triggerer') {
        errMsg = 'Popup was blocked by the browser. Please allow popups or use another sign in method.';
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations
    if (!email) {
      setError('Email address is required.');
      return;
    }

    if (mode !== 'forgot' && !password) {
      setError('Password is required.');
      return;
    }

    if (mode === 'signup') {
      if (!name) {
        setError('Full Name is required.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        // Sign In
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess('Successfully signed in!');
        setTimeout(() => {
          onClose();
          resetState();
        }, 1000);
      } else if (mode === 'signup') {
        // Create User
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Set display name
        await updateProfile(userCredential.user, {
          displayName: name
        });

        // Save custom profile to Firestore
        const userId = userCredential.user.uid;
        const userDocRef = doc(db, 'users', userId);
        await setDoc(userDocRef, {
          id: userId,
          email,
          fullName: name,
          role: signupRole,
          operatorId: signupRole === 'operator_admin' ? selectedOperatorId : null,
          createdAt: new Date().toISOString()
        });

        setSuccess('Account created successfully!');
        setTimeout(() => {
          onClose();
          resetState();
        }, 1000);
      } else if (mode === 'forgot') {
        // Password Reset
        await sendPasswordResetEmail(auth, email);
        setSuccess('Password reset link sent to your email!');
        setEmail('');
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = 'An unexpected error occurred.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errMsg = 'Invalid email or password.';
      } else if (err.code === 'auth/user-not-found') {
        errMsg = 'No account found with this email.';
      } else if (err.code === 'auth/email-already-in-use') {
        errMsg = 'This email is already registered.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Invalid email address format.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#0B2E6D]/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 z-10"
      >
        {/* Top Header */}
        <div className="bg-[#0B2E6D] p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="mb-2">
            <YavaLogo height={28} navyColor="white" orangeColor="#FF5A1F" />
          </div>
          <h3 className="text-xl font-bold font-serif tracking-tight">
            {mode === 'login' && 'Sign In to Your Account'}
            {mode === 'signup' && 'Create Your Carrier Account'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h3>
          <p className="text-xs text-white/70 mt-1">
            {mode === 'login' && 'Access premium travel booking, history, and ticket management.'}
            {mode === 'forgot' && 'Enter your email address to receive a secure recovery link.'}
          </p>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3.5 rounded-xl border border-red-150 flex items-start gap-2 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 text-emerald-700 p-3.5 rounded-xl border border-emerald-150 flex items-start gap-2 text-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
              <span>{success}</span>
            </div>
          )}

          {/* Full Name (Sign Up only) */}
          {mode === 'signup' && (
            <>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Phiri"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 focus:border-[#FF5A1F] focus:bg-white px-4 py-3 pl-10 text-xs text-gray-800 rounded-xl outline-none transition-all"
                  />
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignupRole('customer')}
                    className={`py-2 px-3 border rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      signupRole === 'customer'
                        ? 'bg-[#0B2E6D] text-white border-[#0B2E6D]'
                        : 'bg-slate-50 text-gray-500 border-gray-200 hover:bg-slate-100'
                    }`}
                  >
                    Passenger
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupRole('operator_admin')}
                    className={`py-2 px-3 border rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      signupRole === 'operator_admin'
                        ? 'bg-[#FF5A1F] text-white border-[#FF5A1F]'
                        : 'bg-slate-50 text-gray-500 border-gray-200 hover:bg-slate-100'
                    }`}
                  >
                    Operator Staff
                  </button>
                </div>
              </div>

              {signupRole === 'operator_admin' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                    Select Bus Operator / Company
                  </label>
                  <div className="relative">
                    <select
                      value={selectedOperatorId}
                      onChange={(e) => setSelectedOperatorId(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 focus:border-[#FF5A1F] focus:bg-white px-4 py-3 pl-10 text-xs text-gray-800 rounded-xl outline-none transition-all appearance-none cursor-pointer font-semibold"
                    >
                      {OPERATORS.map((op) => (
                        <option key={op.id} value={op.id}>
                          {op.name}
                        </option>
                      ))}
                    </select>
                    <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="phiri@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:border-[#FF5A1F] focus:bg-white px-4 py-3 pl-10 text-xs text-gray-800 rounded-xl outline-none transition-all"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Password (Login & Sign Up only) */}
          {mode !== 'forgot' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => handleModeChange('forgot')}
                    className="text-[10px] font-semibold text-[#FF5A1F] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 focus:border-[#FF5A1F] focus:bg-white px-4 py-3 pl-10 pr-10 text-xs text-gray-800 rounded-xl outline-none transition-all"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password (Sign Up only) */}
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 focus:border-[#FF5A1F] focus:bg-white px-4 py-3 pl-10 pr-10 text-xs text-gray-800 rounded-xl outline-none transition-all"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#FF5A1F] hover:bg-[#e04e1b] disabled:bg-gray-300 text-white text-xs font-bold uppercase tracking-widest transition-all rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'signup' && 'Register Now'}
                  {mode === 'forgot' && 'Send Recovery Email'}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>

          {mode !== 'forgot' && (
            <>
              {/* Divider */}
              <div className="flex items-center my-2.5">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="px-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider bg-white">Or</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 border border-gray-200 hover:bg-slate-50 hover:border-gray-300 disabled:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                </svg>
                <span>Google</span>
              </button>
            </>
          )}

          {/* Toggle Modes */}
          <div className="text-center pt-2 text-xs text-gray-500 border-t border-gray-100">
            {mode === 'login' && (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('signup')}
                  className="font-bold text-[#0B2E6D] hover:underline"
                >
                  Create Account
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('login')}
                  className="font-bold text-[#0B2E6D] hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className="font-bold text-[#0B2E6D] hover:underline"
              >
                Back to Sign In
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
