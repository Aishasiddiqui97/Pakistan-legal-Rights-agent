import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { Skeleton } from '@/components/ui/Skeleton';

// Code-split route pages
const LandingPage = lazy(() =>
  import('@/pages/LandingPage').then((m) => ({ default: m.LandingPage }))
);
const AssistantPage = lazy(() =>
  import('@/pages/AssistantPage').then((m) => ({ default: m.AssistantPage }))
);
const HistoryPage = lazy(() =>
  import('@/pages/HistoryPage').then((m) => ({ default: m.HistoryPage }))
);
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const SignInPage = lazy(() =>
  import('@/pages/SignInPage').then((m) => ({ default: m.SignInPage }))
);
const SignUpPage = lazy(() =>
  import('@/pages/SignUpPage').then((m) => ({ default: m.SignUpPage }))
);
const ForgotPasswordPage = lazy(() =>
  import('@/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage }))
);
const VerifyResetCodePage = lazy(() =>
  import('@/pages/VerifyResetCodePage').then((m) => ({ default: m.VerifyResetCodePage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);
const TermsPage = lazy(() =>
  import('@/pages/TermsPage').then((m) => ({ default: m.TermsPage }))
);
const HowItWorksPage = lazy(() =>
  import('@/pages/HowItWorksPage').then((m) => ({ default: m.HowItWorksPage }))
);
const WhoBuiltThisPage = lazy(() =>
  import('@/pages/WhoBuiltThisPage').then((m) => ({ default: m.WhoBuiltThisPage }))
);

function PageLoading() {
  return (
    <div className="min-h-screen flex-1 flex flex-col items-center justify-center p-8 space-y-4 bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <div className="w-10 h-10 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin" />
      <Skeleton className="h-4 w-40" />
    </div>
  );
}

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <ErrorBoundary>
        <Suspense fallback={<PageLoading />}>
          <div className="flex-1 flex flex-col">
            <Outlet />
          </div>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

import { AppLayout } from '@/components/layout/AppLayout';

// Dedicated post-login workspace shell matching Horizon AI template
function WorkspaceLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <ErrorBoundary>
        <Suspense fallback={<PageLoading />}>
          <AppLayout />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// Dedicated distraction-free split-screen auth layout matching reference design
function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <ErrorBoundary>
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/how-it-works',
        element: <HowItWorksPage />,
      },
      {
        path: '/who-built-this',
        element: <WhoBuiltThisPage />,
      },
      {
        path: '/about',
        element: <WhoBuiltThisPage />,
      },
      {
        path: '/terms',
        element: <TermsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/signin',
        element: <SignInPage />,
      },
      {
        path: '/signup',
        element: <SignUpPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/verify-reset-code',
        element: <VerifyResetCodePage />,
      },
    ],
  },
  {
    element: <WorkspaceLayout />,
    children: [
      {
        path: '/assistant',
        element: <AssistantPage />,
      },
      {
        path: '/assistant/:id',
        element: <AssistantPage />,
      },
      {
        path: '/history',
        element: (
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
