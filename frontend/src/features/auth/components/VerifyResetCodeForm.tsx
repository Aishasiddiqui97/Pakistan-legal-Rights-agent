import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerifyResetCodeFormProps {
  email?: string;
  isDark?: boolean;
}

export function VerifyResetCodeForm({
  email = 'hellonabeelafzal@gmail.com',
  isDark = false,
}: VerifyResetCodeFormProps) {
  const navigate = useNavigate();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(58);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first input on initial mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDigitChange = (index: number, value: string) => {
    setError(null);
    const cleanValue = value.replace(/\D/g, '');

    if (!cleanValue) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    // Handle single digit input
    const char = cleanValue.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto advance to next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pastedData[i] || '';
    }
    setDigits(newDigits);

    // Focus on the next empty or last filled
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(58);
    setError(null);
    setDigits(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Artificial verification delay for realistic UX
    await new Promise((r) => setTimeout(r, 650));
    setIsSubmitting(false);
    setIsVerified(true);
  };

  if (isVerified) {
    return (
      <div className="space-y-5 text-center animate-in fade-in zoom-in-95 duration-200">
        <div
          className={cn(
            'p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 text-center',
            isDark
              ? 'bg-purple-950/40 border-purple-500/30 text-purple-200'
              : 'bg-purple-50/80 border-purple-100 text-purple-900'
          )}
        >
          <CheckCircle2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          <p className="font-bold text-sm">Code verified successfully!</p>
          <p className={cn('text-xs', isDark ? 'text-purple-300/80' : 'text-purple-700')}>
            Your identity has been confirmed. You can now reset your password.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/signin')}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold tracking-wider text-white transition-all duration-200 cursor-pointer active:scale-[0.99]',
            'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500',
            'shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_25px_rgba(124,58,237,0.45)] hover:-translate-y-0.5'
          )}
        >
          <span>CONTINUE TO LOGIN</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Recipient & Expiry Info */}
      <div className="space-y-1 text-center">
        <p className={cn('text-xs sm:text-sm font-medium', isDark ? 'text-slate-400' : 'text-slate-500')}>
          A 6-digit code has been sent to
        </p>
        <p className={cn('text-xs sm:text-sm font-bold tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
          {email}
        </p>
        <p className={cn('text-xs font-semibold pt-0.5', isDark ? 'text-slate-400' : 'text-slate-500')}>
          Code expires in:{' '}
          <span className="text-purple-600 dark:text-purple-400 font-bold">
            {formatTimer(countdown)}
          </span>
        </p>
      </div>

      {/* 6 OTP Boxes */}
      <div className="flex items-center justify-center gap-2 sm:gap-2.5 my-2">
        {digits.map((digit, idx) => {
          const isCurrentActive =
            digits.findIndex((d) => d === '') === idx ||
            (idx === 5 && digits.every((d) => d !== ''));

          return (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              className={cn(
                'w-11 h-12 sm:w-12 sm:h-14 rounded-2xl text-center text-lg sm:text-xl font-bold font-mono transition-all duration-150',
                'focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500',
                isDark
                  ? 'bg-white/[0.06] hover:bg-white/[0.09] text-white border border-white/10'
                  : 'bg-[#EDF2F7] hover:bg-[#E5ECF3] text-slate-900 border border-slate-200/80',
                digit && 'border-purple-500/80 bg-purple-50/20 dark:bg-purple-950/20',
                isCurrentActive && !digit && 'border-purple-500 ring-2 ring-purple-500/20'
              )}
              aria-label={`Digit ${idx + 1}`}
            />
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-rose-500">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Verify Code Button */}
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
            <span>VERIFY CODE</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Resend Code Footer Link */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
        Didn't receive the code?{' '}
        {countdown > 0 ? (
          <span>
            Resend in{' '}
            <span className="text-purple-600 dark:text-purple-400 font-bold">
              {formatTimer(countdown)}
            </span>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="font-bold text-purple-600 dark:text-purple-400 hover:underline transition-colors cursor-pointer"
          >
            Resend Code
          </button>
        )}
      </div>
    </form>
  );
}
