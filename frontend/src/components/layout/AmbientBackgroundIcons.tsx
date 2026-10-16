import React from 'react';
import { Scale, ShieldCheck, BookOpen, Gavel, FileText, Sparkles } from 'lucide-react';

export function AmbientBackgroundIcons() {
  return (
    <div
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Floating Scales of Justice - Top Right */}
      <div className="absolute top-32 right-[6%] lg:right-[9%] animate-float-slow">
        <Scale className="w-14 h-14 sm:w-16 sm:h-16 text-purple-700/[0.08] dark:text-purple-400/[0.14] stroke-[1.25]" />
      </div>

      {/* Floating Sindh Acts & Legal Gazette - Top Left */}
      <div
        className="absolute top-36 left-[5%] lg:left-[8%] animate-float-reverse"
        style={{ animationDelay: '1.5s' }}
      >
        <BookOpen className="w-13 h-13 sm:w-15 sm:h-15 text-indigo-700/[0.08] dark:text-indigo-400/[0.14] stroke-[1.25]" />
      </div>

      {/* Floating Constitutional Protection Shield - Bottom Left */}
      <div
        className="absolute bottom-24 left-[6%] lg:left-[9%] animate-float-slow"
        style={{ animationDelay: '2.5s' }}
      >
        <ShieldCheck className="w-14 h-14 sm:w-16 sm:h-16 text-purple-700/[0.08] dark:text-purple-400/[0.14] stroke-[1.25]" />
      </div>

      {/* Floating Judicial Gavel - Bottom Right */}
      <div
        className="absolute bottom-28 right-[6%] lg:right-[9%] animate-float-reverse"
        style={{ animationDelay: '3.5s' }}
      >
        <Gavel className="w-13 h-13 sm:w-15 sm:h-15 text-indigo-700/[0.08] dark:text-indigo-400/[0.14] stroke-[1.25]" />
      </div>

      {/* Floating Evidentiary Notice - Mid Left (Wide screens only) */}
      <div
        className="hidden xl:block absolute top-[52%] left-[3%] -translate-y-1/2 animate-float-slow"
        style={{ animationDelay: '4s' }}
      >
        <FileText className="w-12 h-12 text-purple-700/[0.07] dark:text-purple-400/[0.12] stroke-[1.25]" />
      </div>

      {/* Floating AI Legal Sparkles - Mid Right (Wide screens only) */}
      <div
        className="hidden xl:block absolute top-[50%] right-[3%] -translate-y-1/2 animate-float-reverse"
        style={{ animationDelay: '5s' }}
      >
        <Sparkles className="w-12 h-12 text-indigo-700/[0.07] dark:text-purple-300/[0.12] stroke-[1.25]" />
      </div>
    </div>
  );
}

export default AmbientBackgroundIcons;
