import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { loginSchema, LoginFormData } from '../schemas/auth-schemas';
import { useAuth } from '../hooks/useAuth';
import { cn } from '@/lib/utils';

interface SignInFormProps {
  isDark?: boolean;
}

export function SignInForm({ isDark = false }: SignInFormProps) {
  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/assistant';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setFormError(null);
    clearError();
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err: any) {
      setFormError(err.message || 'Invalid email or password');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {(formError || authError) && (
        <div
          role="alert"
          className={cn(
            'flex items-center gap-2.5 p-3.5 rounded-xl text-xs sm:text-sm font-medium',
            isDark
              ? 'bg-rose-950/40 border border-rose-500/30 text-rose-200'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          )}
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{formError || authError}</span>
        </div>
      )}

      {/* Email Address */}
      <div className="space-y-1.5 text-left">
        <label
          htmlFor="email"
          className={cn(
            'block text-[11px] font-bold uppercase tracking-wider',
            isDark ? 'text-slate-400' : 'text-slate-500'
          )}
        >
          Email Address
        </label>
        <div className="relative flex items-center">
          <Mail className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            id="email"
            type="email"
            placeholder="hellonabeelafzal@gmail.com"
            autoComplete="email"
            className={cn(
              'w-full rounded-xl pl-11 pr-4 py-3 text-sm font-medium transition-all duration-150',
              'focus:outline-none focus:ring-4 focus:ring-purple-500/10',
              isDark
                ? 'bg-white/[0.06] hover:bg-white/[0.09] focus:bg-[#1A1238] text-white border border-white/10 focus:border-purple-400 placeholder:text-slate-500'
                : 'bg-[#EDF2F7] hover:bg-[#E5ECF3] focus:bg-white text-slate-900 border border-transparent focus:border-purple-500 placeholder:text-slate-400 shadow-2xs',
              errors.email && 'border-rose-400 focus:border-rose-500'
            )}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-xs font-medium text-rose-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password with FORGOT link */}
      <div className="space-y-1.5 text-left">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className={cn(
              'text-[11px] font-bold uppercase tracking-wider',
              isDark ? 'text-slate-400' : 'text-slate-500'
            )}
          >
            Password
          </label>
          <Link
            to="/forgot-password"
            className={cn(
              'text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer',
              isDark ? 'text-slate-400 hover:text-purple-300' : 'text-slate-400 hover:text-purple-600'
            )}
          >
            Forgot?
          </Link>
        </div>
        <div className="relative flex items-center">
          <Lock className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••••••••••"
            autoComplete="current-password"
            className={cn(
              'w-full rounded-xl pl-11 pr-11 py-3 text-sm font-medium transition-all duration-150',
              'focus:outline-none focus:ring-4 focus:ring-purple-500/10',
              isDark
                ? 'bg-white/[0.06] hover:bg-white/[0.09] focus:bg-[#1A1238] text-white border border-white/10 focus:border-purple-400 placeholder:text-slate-500'
                : 'bg-[#EDF2F7] hover:bg-[#E5ECF3] focus:bg-white text-slate-900 border border-transparent focus:border-purple-500 placeholder:text-slate-400 shadow-2xs',
              errors.password && 'border-rose-400 focus:border-rose-500'
            )}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs font-medium text-rose-500">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button - SIGN IN -> */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold tracking-wider text-white transition-all duration-200 cursor-pointer active:scale-[0.99]',
          'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500',
          'shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_25px_rgba(124,58,237,0.45)] hover:-translate-y-0.5',
          'disabled:opacity-50 disabled:pointer-events-none'
        )}
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <span>SIGN IN</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Switch to SignUp */}
      <p className={cn('text-center text-xs pt-1', isDark ? 'text-slate-400' : 'text-slate-500')}>
        New to Legal AI?{' '}
        <Link
          to="/signup"
          className={cn(
            'font-bold transition-colors',
            isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700 hover:underline'
          )}
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
