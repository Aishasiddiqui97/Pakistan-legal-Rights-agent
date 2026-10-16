import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Full name is required')
      .min(3, 'Name must be at least 3 characters')
      .max(60, 'Name must not exceed 60 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[a-zA-Z]/, 'Password must contain at least one letter'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    preferredJurisdiction: z.enum(['sindh', 'federal', 'punjab', 'kpk', 'balochistan']).default('sindh').optional(),
    acceptedTerms: z
      .boolean()
      .refine((val) => val === true, {
        message: 'You must acknowledge the legal information disclaimer to proceed',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const verifyResetCodeSchema = z.object({
  code: z
    .string()
    .length(6, 'Please enter the 6-digit verification code')
    .regex(/^\d+$/, 'Code must contain only numbers'),
});

export type VerifyResetCodeFormData = z.infer<typeof verifyResetCodeSchema>;
