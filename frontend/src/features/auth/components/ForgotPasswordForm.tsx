import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../schemas/auth-schemas';
import { cn } from '@/lib/utils';

interface ForgotPasswordFormProps {
  isDark?: boolean;
}

export function ForgotPasswordForm({ isDark = false }: ForgotPasswordFormProps) {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setSubmittedEmail(data.email);
    // Artificial small delay for high-fidelity realistic feedback
    await new Promise((r) => setTimeout(r, 500));
    navigate('/verify-reset-code', { state: { email: data.email } });
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    setResendCountdown(60);
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    reset({ email: submittedEmail });
  };

  if (isSuccess) {
    return (
      <div className="space-y-5 text-left animate-in fade-in zoom-in-95 duration-200">
        <div
          className={cn(
            'p-4 rounded-2xl border flex items-start gap-3.5',
            isDark
              ? 'bg-purple-950/40 border-purple-500/30 text-purple-200'
              : 'bg-purple-50/80 border-purple-100 text-purple-900'
          )}
        >
          <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <p className="font-bold">Verification code dispatched</p>
            <p className={isDark ? 'text-purple-300/90' : 'text-purple-800'}>
              We sent a 6-digit password reset code to{' '}
              <span className="font-semibold underline">{submittedEmail}</span>.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCountdown > 0}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer',
              isDark
                ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-50'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-50'
            )}
          >
            <RefreshCw className={cn('w-3.5 h-3.5', resendCountdown > 0 && 'animate-spin')} />
            <span>
              {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 'Resend reset code'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleResetForm}
            className={cn(
              'w-full text-center text-xs font-semibold py-2 transition-colors cursor-pointer',
              isDark ? 'text-slate-400 hover:text-purple-300' : 'text-slate-500 hover:text-purple-600'
            )}
          >
            Use a different email address
          </button>
        </div>

        {/* Back to sign in */}
        <p className={cn('text-center text-xs pt-1', isDark ? 'text-slate-400' : 'text-slate-500')}>
          Remember your password?{' '}
          <Link
            to="/signin"
            className={cn(
              'font-bold transition-colors',
              isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700 hover:underline'
            )}
          >
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
          <div className="flex items-center gap-1.5 text-xs font-medium text-rose-500 pt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.email.message}</span>
          </div>
        )}
      </div>

      {/* Action button - Send Reset Code -> */}
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
            <span>SEND RESET CODE</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Return link */}
      <p className={cn('text-center text-xs pt-1', isDark ? 'text-slate-400' : 'text-slate-500')}>
        Remember your password?{' '}
        <Link
          to="/signin"
          className={cn(
            'font-bold transition-colors',
            isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700 hover:underline'
          )}
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
