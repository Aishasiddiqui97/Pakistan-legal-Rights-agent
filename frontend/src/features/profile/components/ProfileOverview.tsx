import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Shield, MapPin, Calendar, Check, LogOut, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { LegalJurisdiction } from '@/types/evidence';
import { formatDate } from '@/lib/utils';

export function ProfileOverview() {
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [jurisdiction, setJurisdiction] = useState<LegalJurisdiction>(
    user?.preferredJurisdiction || 'sindh'
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      await updateProfile({ name, preferredJurisdiction: jurisdiction });
      setSuccessMessage('Profile and legal jurisdiction preference updated successfully.');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile settings.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl mx-auto space-y-6 text-left"
    >
      {/* Account Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 3 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-purple-600/30 cursor-pointer"
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </motion.div>
            <div>
              <CardTitle>{user?.name}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center gap-3">
              <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
              <div>
                <span className="block text-[11px] font-semibold uppercase text-slate-400">
                  Default Jurisdiction
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-white capitalize">
                  {user?.preferredJurisdiction || 'Pakistan'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center gap-3">
              <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <span className="block text-[11px] font-semibold uppercase text-slate-400">
                  Member Since
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-white">
                  {user?.createdAt ? formatDate(user.createdAt) : 'Active'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-slate-200/60 dark:border-white/10">
              <Shield className="w-4 h-4 text-purple-600 shrink-0" />
              <span>
                Your privacy is protected. Only anonymous legal inquiries and statutory citations
                are logged for research purposes.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Preferences Form */}
      <Card>
        <CardHeader>
          <CardTitle>Account & Jurisdiction Preferences</CardTitle>
          <CardDescription>
            Customize your primary provincial jurisdiction for statute retrieval.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {successMessage && (
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30 text-purple-900 dark:text-purple-200 text-sm flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-200 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Primary Legal Jurisdiction
              </label>
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value as LegalJurisdiction)}
                className="w-full min-h-[44px] rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#120B2E] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              >
                <option value="sindh">Sindh (Karachi, Hyderabad, Sukkur)</option>
                <option value="federal">Federal / Islamabad Jurisdiction</option>
                <option value="punjab">Punjab (Regional Reference)</option>
                <option value="kpk">Khyber Pakhtunkhwa (Regional Reference)</option>
                <option value="balochistan">Balochistan (Regional Reference)</option>
              </select>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={logout}
              leftIcon={<LogOut className="w-4 h-4 text-rose-500" />}
              className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-500/30"
            >
              Sign Out
            </Button>

            <Button
              type="submit"
              variant="purple"
              size="sm"
              isLoading={isUpdating}
            >
              Save Preferences
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
