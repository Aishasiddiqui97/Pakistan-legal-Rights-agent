import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  Scale,
  ArrowLeft,
  Moon,
  Sun,
  ShieldCheck,
  Sparkles,
  Mail,
} from 'lucide-react';
import { VerifyResetCodeForm } from '@/features/auth/components/VerifyResetCodeForm';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function VerifyResetCodePage() {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Extract email from navigation state or URL param, fallback to demo email from screenshot
  const email =
    (location.state as any)?.email ||
    searchParams.get('email') ||
    'hellonabeelafzal@gmail.com';

  return (
    <div
      className={cn(
        'min-h-screen lg:h-screen lg:max-h-screen w-full transition-colors duration-300 relative flex flex-col justify-between px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-3 sm:pb-4 lg:pt-5 lg:pb-5 overflow-hidden font-sans no-scrollbar',
        isDark ? 'bg-transparent text-slate-100 selection:bg-purple-500/30' : 'bg-transparent text-slate-900'
      )}
    >
      {/* Background ambient blurs strictly contained in viewport */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isDark ? (
          <>
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-purple-500/[0.08]" />
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[750px] h-[750px] rounded-full border border-purple-500/[0.05]" />
            <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-gradient-to-b from-purple-600/20 via-indigo-600/10 to-transparent blur-3xl" />
          </>
        ) : (
          <>
            <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-purple-200/35 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-3xl" />
          </>
        )}
      </div>

      {/* Top Bar: Back to Forgot Password + Theme Toggle */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between z-10 shrink-0">
        <Link
          to="/forgot-password"
          className={cn(
            'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-2xs group',
            isDark
              ? 'bg-white/10 border border-white/10 text-slate-300 hover:text-white hover:bg-white/15'
              : 'bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          )}
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </Link>

        <button
          type="button"
          onClick={toggleTheme}
          className={cn(
            'p-2 rounded-full transition-colors cursor-pointer border',
            isDark
              ? 'bg-white/10 text-amber-400 border-white/10 hover:bg-white/15'
              : 'bg-white text-slate-500 border-slate-200 hover:text-slate-900 hover:bg-slate-50 shadow-2xs'
          )}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Split Screen Body */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-0 z-10">
        {/* Left Column: Branding, Hero Headline, Subtitle, Highlights */}
        <motion.div
          initial={{ opacity: 0, x: -22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="lg:col-span-7 space-y-6 text-left"
        >
          {/* Logo Badge */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span
              className={cn(
                'font-extrabold text-2xl tracking-tight font-["Outfit"]',
                isDark ? 'text-white' : 'text-slate-900'
              )}
            >
              LegalAI
            </span>
          </div>

          {/* Headline - "Security is our / top priority." */}
          <div className="space-y-3">
            <h1
              className={cn(
                'text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.12] font-["Outfit"]',
                isDark ? 'text-white' : 'text-slate-900'
              )}
            >
              Security is our{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 animate-gradient-text">
                top priority.
              </span>
            </h1>
            <p
              className={cn(
                'text-base sm:text-lg leading-relaxed max-w-xl font-normal',
                isDark ? 'text-slate-400' : 'text-slate-600'
              )}
            >
              Verifying your email ensures that your legal consultations, case files, and statutory records remain safe and only accessible to you.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="space-y-3.5 pt-2">
            <div
              className={cn(
                'flex items-center gap-3 text-sm font-bold',
                isDark ? 'text-slate-300' : 'text-slate-800'
              )}
            >
              <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0" />
              <span>Two-Step Verification</span>
            </div>
            <div
              className={cn(
                'flex items-center gap-3 text-sm font-bold',
                isDark ? 'text-slate-300' : 'text-slate-800'
              )}
            >
              <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
              <span>Instant Activation</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Floating Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
          className="lg:col-span-5 flex justify-center lg:justify-end"
        >
          <div
            className={cn(
              'w-full max-w-md rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 space-y-5 text-center transition-all duration-200',
              isDark
                ? 'bg-[#120B2E]/90 border border-white/10 backdrop-blur-2xl shadow-2xl text-white'
                : 'bg-white rounded-[32px] sm:rounded-[36px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-slate-100 text-slate-900'
            )}
          >
            {/* Top Mail Badge Icon */}
            <div
              className={cn(
                'w-12 h-12 rounded-2xl mx-auto flex items-center justify-center transition-colors',
                isDark
                  ? 'bg-purple-950/40 border border-purple-500/30 text-purple-400'
                  : 'bg-purple-50 border border-purple-100 text-purple-600 shadow-2xs'
              )}
            >
              <Mail className="w-5 h-5 stroke-[2.2]" />
            </div>

            {/* Card Heading */}
            <h2
              className={cn(
                'text-2xl sm:text-3xl font-extrabold tracking-tight font-["Outfit"] text-center',
                isDark ? 'text-white' : 'text-slate-900'
              )}
            >
              Verify Reset Code
            </h2>

            {/* Verification Form with 6-digit OTP inputs */}
            <VerifyResetCodeForm email={email} isDark={isDark} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
