import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, ArrowRight } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center -mt-20 pt-20 bg-transparent text-slate-800 dark:text-slate-100 overflow-hidden font-sans selection:bg-purple-500/30 selection:text-purple-200 no-scrollbar transition-colors duration-200">
      {/* Concentric Animated Orbit Rings in Background - Centered to avoid corner icon conflict */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-purple-500/[0.12] dark:border-purple-500/[0.10] pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 65, repeat: Infinity, ease: 'linear' }}
      >
        {/* Subtle orbit accent node */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-purple-500/40 dark:bg-purple-400/50 blur-[1px]" />
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[820px] h-[820px] rounded-full border border-purple-500/[0.08] dark:border-purple-500/[0.06] pointer-events-none"
        animate={{ rotate: -360 }}
        transition={{ duration: 95, repeat: Infinity, ease: 'linear' }}
      >
        {/* Subtle orbit accent node */}
        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-500/30 dark:bg-indigo-400/40 blur-[1px]" />
      </motion.div>

      {/* Radial Purple Glow Center with subtle breathing animation */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-b from-purple-500/15 dark:from-purple-600/25 via-indigo-500/10 dark:via-indigo-600/12 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.75, 1, 0.75],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Main Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-7 z-10 py-12">
        {/* Pill Badge with Scale Emblem */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 px-4.5 py-1.5 rounded-full bg-purple-50/90 dark:bg-white/[0.04] border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold tracking-wide backdrop-blur-md shadow-xs dark:shadow-[0_0_20px_rgba(139,92,246,0.18)]"
        >
          <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Scale className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="font-extrabold font-['Outfit'] text-slate-900 dark:text-white">LegalAI Pakistan</span>
          <span className="text-slate-300 dark:text-purple-500/50">•</span>
          <span className="text-slate-600 dark:text-slate-300">AI-Powered Citizen Legal Assistant</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] font-['Outfit']"
        >
          Pakistan Legal Rights Agent{' '}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 dark:from-purple-300 dark:via-indigo-200 dark:to-purple-400">
            & Evidence Assistant
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Designed for citizens, tenants, and workers across Pakistan. Grounded directly in verified statutory acts,
          gazette notices, and constitutional due process precedents to quickly clarify your legal rights.
        </motion.p>

        {/* Single Glowing Purple Hero Button with Interactive Motion */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="pt-2 flex justify-center"
        >
          <Link to="/assistant">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-600/40 hover:shadow-purple-600/60 border border-purple-400/40 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Shimmer sweep animation overlay on button */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              <span>Try Legal Assistant</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

export default LandingPage;
