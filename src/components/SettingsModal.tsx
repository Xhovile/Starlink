import React, { useState } from 'react';
import { 
  X, User, Lock, AlertCircle, CheckCircle2, Loader2, Save, Trash2 
} from 'lucide-react';
import { 
  updateProfile, 
  updatePassword, 
  deleteUser 
} from 'firebase/auth';
import { auth } from '../firebase';
import { motion } from 'motion/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthTrigger: () => void;
}

export default function SettingsModal({ isOpen, onClose, onAuthTrigger }: SettingsModalProps) {
  const currentUser = auth.currentUser;
  
  const [name, setName] = useState(currentUser?.displayName || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // 1. Update Name
      if (name !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: name });
      }

      // 2. Update Password if specified
      if (newPassword) {
        if (newPassword.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        await updatePassword(currentUser, newPassword);
      }

      setSuccess('Account settings updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        setError('Security restriction: Please sign out and sign in again before making critical security changes.');
      } else {
        setError(err.message || 'Failed to update settings.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await deleteUser(currentUser);
      setSuccess('Account permanently deleted. Hope to see you again soon!');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        setError('Security restriction: Please sign out and sign in again before deleting your account.');
      } else {
        setError(err.message || 'Failed to delete account.');
      }
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
          
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#FF5A1F] font-bold block mb-1">
            YAVA Carrier System
          </span>
          <h3 className="text-xl font-bold font-serif tracking-tight font-serif">
            Account &amp; Travel Settings
          </h3>
          <p className="text-xs text-white/70 mt-1">
            Manage your personal profile, credentials, and custom preference parameters.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {!currentUser ? (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-700">Authentication Required</h4>
                <p className="text-xs text-gray-400 mt-1">
                  You must be registered or logged in to access secure travel profile settings.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onAuthTrigger();
                }}
                className="px-5 py-2.5 bg-[#FF5A1F] hover:bg-[#e04e1b] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-sm cursor-pointer"
              >
                Sign In or Sign Up
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-150 flex items-start gap-2 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-150 flex items-start gap-2 text-xs">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
                  <span>{success}</span>
                </div>
              )}

              {/* User Email (Disabled) */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Registered Email (Fixed)
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser.email || ''}
                  className="w-full bg-gray-100 border border-gray-200 px-4 py-3 text-xs text-gray-500 rounded-xl outline-none cursor-not-allowed"
                />
              </div>

              {/* Display Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                  Profile Display Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 focus:border-[#FF5A1F] focus:bg-white px-4 py-3 pl-10 text-xs text-gray-800 rounded-xl outline-none transition-all"
                  />
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="border-t border-gray-100 my-4 pt-3">
                <span className="text-[9px] uppercase font-bold tracking-[0.15em] text-gray-400 block mb-2">
                  Change Access Password
                </span>
                
                {/* New Password */}
                <div className="space-y-1 mb-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Leave blank to keep current"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 focus:border-[#FF5A1F] focus:bg-white px-4 py-3 pl-10 text-xs text-gray-800 rounded-xl outline-none transition-all"
                    />
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 focus:border-[#FF5A1F] focus:bg-white px-4 py-3 pl-10 text-xs text-gray-800 rounded-xl outline-none transition-all"
                    />
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-[#0B2E6D] hover:bg-navy text-white text-xs font-bold uppercase tracking-widest transition-all rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>

                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                    title="Delete Account"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    Confirm Delete
                  </button>
                )}
              </div>

              {showDeleteConfirm && (
                <p className="text-[9px] text-red-500 text-center font-semibold mt-1">
                  Warning: Deleting your account is completely irreversible! 
                  <button 
                    type="button" 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="underline ml-1 text-gray-500 hover:text-gray-700 font-bold"
                  >
                    Cancel
                  </button>
                </p>
              )}
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
