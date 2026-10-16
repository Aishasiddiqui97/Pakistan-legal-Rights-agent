import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  User,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { LegalLogo } from '@/components/ui/LegalLogo';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Who Built This', path: '/who-built-this' },
    { label: 'Legal Assistant', path: '/assistant' },
    { label: 'Saved Inquiries', path: '/history', authRequired: true },
  ];

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent border-none text-slate-800 dark:text-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-2xl group"
            aria-label="LegalAI Pakistan Homepage"
          >
            <LegalLogo size="md" badgeText="Pakistan" />
          </Link>

          {/* Center Floating Pill Navigation */}
          <nav
            className="hidden md:flex items-center gap-1 bg-white/80 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.1] backdrop-blur-2xl px-4 py-1.5 rounded-full shadow-xs dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-purple-400/50 transition-all"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              if (link.authRequired && !isAuthenticated) return null;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200',
                    isActive
                      ? 'bg-purple-100/80 dark:bg-white/[0.15] text-purple-800 dark:text-white border border-purple-200 dark:border-white/[0.2] shadow-xs backdrop-blur-md'
                      : 'text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-white/[0.08]'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full border border-slate-200 dark:border-white/[0.15] bg-slate-50 dark:bg-white/[0.06] hover:bg-slate-100 dark:hover:bg-white/[0.12] text-slate-600 dark:text-amber-400 transition-colors cursor-pointer shadow-xs"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle dark/light mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-white/[0.15] bg-slate-50 dark:bg-white/[0.06] hover:bg-purple-50 dark:hover:bg-white/[0.1] backdrop-blur-xl text-xs font-semibold text-slate-700 dark:text-purple-200 transition-all shadow-xs',
                    location.pathname === '/profile' && 'border-purple-400 bg-purple-50 dark:bg-white/[0.15]'
                  )}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-white/[0.08] rounded-full p-2 h-auto"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/signin"
                  className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/[0.06]"
                >
                  Sign In
                </Link>
                <Link to="/signup">
                  <button className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/40 shadow-md shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
                    <span>Sign up</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-amber-400 bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.1] focus:outline-none"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-full text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.1] backdrop-blur-md focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-slate-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#0A051B]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-4 shadow-xl dark:shadow-2xl"
          >
            <div className="space-y-1.5">
              {navLinks.map((link) => {
                if (link.authRequired && !isAuthenticated) return null;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors',
                      isActive
                        ? 'bg-purple-100 dark:bg-white/[0.12] text-purple-800 dark:text-white border border-purple-200 dark:border-white/[0.15]'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/[0.08]">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] font-semibold text-sm"
                  >
                    <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Profile & Settings ({user?.name})</span>
                  </Link>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleLogout}
                    leftIcon={<LogOut className="w-4 h-4 text-rose-500" />}
                    className="w-full justify-start text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-2xl"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="md" className="w-full text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/[0.15] bg-white dark:bg-white/[0.05] rounded-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="purple" size="md" className="w-full rounded-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
