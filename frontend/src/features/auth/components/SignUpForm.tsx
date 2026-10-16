import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { registerSchema, RegisterFormData } from '../schemas/auth-schemas';
import { useAuth } from '../hooks/useAuth';
import { cn } from '@/lib/utils';

interface SignUpFormProps {
  isDark?: boolean;
}

export function SignUpForm({ isDark = false }: SignUpFormProps) {
  const { register: registerAuth, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      preferredJurisdiction: 'sindh',
      acceptedTerms: false,
    },
  });

  const acceptedTerms = watch('acceptedTerms');

  const onSubmit = async (data: RegisterFormData) => {
    setFormError(null);
    clearError();
    try {
      await registerAuth(data);
      navigate('/assistant', { replace: true });
    } catch (err: any) {
      setFormError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {(formError || authError) && (
        <div
          role="alert"
          className={cn(
            'flex items-center gap-2.5 p-3 rounded-xl text-xs sm:text-sm font-medium',
            isDark
              ? 'bg-rose-950/40 border border-rose-500/30 text-rose-200'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          )}
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{formError || authError}</span>
        </div>
      )}

      {/* Row 1: Full Name & Email Address */}
      <div className="grid grid-cols-2 gap-3">
        {/* Full Name */}
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="name"
            className={cn(
              'block text-[11px] font-bold uppercase tracking-wider',
              isDark ? 'text-slate-400' : 'text-slate-500'
            )}
          >
            Full Name
          </label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              id="name"
              type="text"
              placeholder="Aisha Siddiqui"
              autoComplete="name"
              className={cn(
                'w-full rounded-xl pl-10 pr-3 py-2.5 sm:py-3 text-sm font-medium transition-all duration-150',
                'focus:outline-none focus:ring-4 focus:ring-purple-500/10',
                isDark
                  ? 'bg-white/[0.06] hover:bg-white/[0.09] focus:bg-[#1A1238] text-white border border-white/10 focus:border-purple-400 placeholder:text-slate-500'
                  : 'bg-[#EDF2F7] hover:bg-[#E5ECF3] focus:bg-white text-slate-900 border border-transparent focus:border-purple-500 placeholder:text-slate-400 shadow-2xs',
                errors.name && 'border-rose-400 focus:border-rose-500'
              )}
              {...register('name')}
            />
          </div>
          {errors.name && (
            <p className="text-xs font-medium text-rose-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="signup-email"
            className={cn(
              'block text-[11px] font-bold uppercase tracking-wider',
              isDark ? 'text-slate-400' : 'text-slate-500'
            )}
          >
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              id="signup-email"
              type="email"
              placeholder="citizen@mail.com"
              autoComplete="email"
              className={cn(
                'w-full rounded-xl pl-10 pr-3 py-2.5 sm:py-3 text-sm font-medium transition-all duration-150',
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
      </div>

      {/* Row 2: Password & Confirm Password */}
      <div className="grid grid-cols-2 gap-3">
        {/* Password */}
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="signup-password"
            className={cn(
              'block text-[11px] font-bold uppercase tracking-wider',
              isDark ? 'text-slate-400' : 'text-slate-500'
            )}
          >
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              autoComplete="new-password"
              className={cn(
                'w-full rounded-xl pl-10 pr-8 py-2.5 sm:py-3 text-sm font-medium transition-all duration-150',
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
              className="absolute right-2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-medium text-rose-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="confirm-password"
            className={cn(
              'block text-[11px] font-bold uppercase tracking-wider',
              isDark ? 'text-slate-400' : 'text-slate-500'
            )}
          >
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              autoComplete="new-password"
              className={cn(
                'w-full rounded-xl pl-10 pr-8 py-2.5 sm:py-3 text-sm font-medium transition-all duration-150',
                'focus:outline-none focus:ring-4 focus:ring-purple-500/10',
                isDark
                  ? 'bg-white/[0.06] hover:bg-white/[0.09] focus:bg-[#1A1238] text-white border border-white/10 focus:border-purple-400 placeholder:text-slate-500'
                  : 'bg-[#EDF2F7] hover:bg-[#E5ECF3] focus:bg-white text-slate-900 border border-transparent focus:border-purple-500 placeholder:text-slate-400 shadow-2xs',
                errors.confirmPassword && 'border-rose-400 focus:border-rose-500'
              )}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs font-medium text-rose-500">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>


      {/* Terms & Conditions Acceptance */}
      <div className="pt-0.5 space-y-1">
        <label className="flex items-start gap-2.5 text-xs text-slate-500 cursor-pointer leading-normal select-none">
          <input
            type="checkbox"
            id="accept-terms-checkbox"
            className="mt-0.5 rounded border-slate-300 dark:border-white/20 text-purple-600 focus:ring-purple-500 w-4 h-4 shrink-0 cursor-pointer accent-purple-600"
            {...register('acceptedTerms')}
          />
          <span className={cn(isDark ? 'text-slate-400' : 'text-slate-600')}>
            I agree to the{' '}
            <Link
              to="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 font-bold underline underline-offset-2 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Terms &amp; Conditions
            </Link>{' '}
            and acknowledge this is an AI legal assistant, not a licensed advocate.
          </span>
        </label>
        {errors.acceptedTerms && (
          <p className="text-xs text-rose-500 pl-6 pt-0.5">{errors.acceptedTerms.message}</p>
        )}
      </div>

      {/* Submit Button - Disabled until acceptedTerms is checked */}
      <button
        type="submit"
        disabled={!acceptedTerms || isSubmitting}
        title={!acceptedTerms ? 'You must accept the Terms & Conditions to create an account' : ''}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold tracking-wider text-white transition-all duration-200 active:scale-[0.99]',
          'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500',
          'shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_25px_rgba(124,58,237,0.45)] hover:-translate-y-0.5',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:shadow-none cursor-pointer'
        )}
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <span>CREATE ACCOUNT</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Switch to SignIn */}
      <p className={cn('text-center text-xs pt-1', isDark ? 'text-slate-400' : 'text-slate-500')}>
        Already registered?{' '}
        <Link
          to="/signin"
          className={cn(
            'font-bold transition-colors',
            isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700 hover:underline'
          )}
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}
