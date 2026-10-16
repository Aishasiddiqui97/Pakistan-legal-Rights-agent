import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-200/80 dark:bg-purple-900/30', className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export function ChatMessageSkeleton() {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#120B2E] border border-slate-100 dark:border-purple-500/20 max-w-3xl">
      <Skeleton className="w-9 h-9 rounded-full shrink-0" />
      <div className="flex-1 space-y-2.5">
        <div className="flex gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function HistoryItemSkeleton() {
  return (
    <div className="p-3 rounded-lg border border-slate-100 dark:border-purple-500/20 dark:bg-[#120B2E] space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-3 w-1/6" />
      </div>
    </div>
  );
}
