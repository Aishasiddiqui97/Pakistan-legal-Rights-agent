import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Home, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="max-w-md space-y-6"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-3xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-md border border-purple-200 dark:border-purple-500/30"
        >
          <Scale className="w-10 h-10 text-purple-600 dark:text-purple-400" />
        </motion.div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-500/20">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
            Legal Page{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 animate-gradient-text">
              Not Found
            </span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            The legal section or consultation record you requested does not exist or has been moved to another provincial docket.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="outline" size="md" leftIcon={<Home className="w-4 h-4" />} className="w-full">
              Return Home
            </Button>
          </Link>
          <Link to="/assistant" className="w-full sm:w-auto">
            <Button variant="purple" size="md" leftIcon={<MessageSquare className="w-4 h-4" />} className="w-full shadow-md shadow-purple-600/25">
              Ask Assistant
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
