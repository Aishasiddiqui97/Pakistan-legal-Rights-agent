import React from 'react';
import { User } from 'lucide-react';
import { ProfileOverview } from '@/features/profile/components/ProfileOverview';
import { motion } from 'framer-motion';

export function ProfilePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 relative z-10"
    >
      <div className="text-left space-y-1 pb-4 border-b border-slate-200/90 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-500/20 shadow-2xs">
            <User className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-['Outfit']">
            Citizen Profile & Legal Settings
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 pl-11">
          Manage your account information, default provincial jurisdiction, and statutory preferences.
        </p>
      </div>

      <ProfileOverview />
    </motion.div>
  );
}
