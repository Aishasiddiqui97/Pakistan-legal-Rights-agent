import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Sparkles,
  Heart,
  Mail,
  Scale,
  Cpu,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function GithubIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function WhoBuiltThisPage() {
  const teamMembers = [
    {
      name: 'Saeed Ali',
      role: 'Lead Frontend Developer & System Architect',
      email: 'saeedaliofficial77@gmail.com',
      avatar: 'SA',
      bio: 'Developed the entire frontend platform, responsive citizen interfaces, real-time conversational workflows, design systems, and state architectures for Pakistan Legal Rights Agent.',
      skills: ['Frontend Architecture', 'React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      badge: 'Frontend Lead',
    },
    {
      name: 'Aisha Siddiqui',
      role: 'Project Lead & Legal Tech Researcher',
      github: 'https://github.com/Aishasiddiqui97',
      avatar: 'AS',
      bio: 'Civic technologist and researcher passionate about digital rights and legal accessibility in Pakistan. Curated Pakistani statutory knowledge bases, verified provincial gazettes, and initiated the open-source repository.',
      skills: ['Legal Knowledge RAG', 'Pakistani Jurisprudence', 'Civic Tech', 'Statutory Research'],
      badge: 'Project Initiator',
    },
    {
      name: 'Yoha Ali Azam',
      role: 'Backend & FastAPI Engineer',
      avatar: 'YA',
      bio: 'Engineered high-concurrency API microservices, asynchronous query pipelines, and database retrieval integrations to power real-time Pakistani statutory legal responses.',
      skills: ['Python', 'FastAPI', 'Backend Architecture', 'REST APIs', 'AsyncIO'],
      badge: 'Backend Engineer',
    },
    {
      name: 'Anum',
      role: 'Frontend & Backend Integration Engineer',
      avatar: 'AN',
      bio: 'Spearheaded end-to-end integration connecting React user interfaces with FastAPI microservices, securing data flows, state synchronization, and reliable API contracts.',
      skills: ['Full-Stack Integration', 'React & TypeScript', 'API Synchronization', 'State Workflows', 'Testing'],
      badge: 'Integration Engineer',
    },
    {
      name: 'Muhammad Maaz',
      role: 'AI Agent Engineer & QA Testing Lead',
      avatar: 'MM',
      bio: 'Developed and fine-tuned the core legal intelligence agent workflows, prompt grounding against Pakistani statutory codes, and comprehensive quality assurance testing.',
      skills: ['AI Agent Development', 'Legal RAG', 'Prompt Engineering', 'QA & Testing', 'Model Evaluation'],
      badge: 'AI Agent & QA',
    },
  ];

  const milestones = [
    {
      icon: Scale,
      title: 'The Challenge',
      desc: 'Over 240 million citizens in Pakistan often face steep barriers navigating complex legal jargon, inaccessible court registries, and predatory rent or employment practices.',
    },
    {
      icon: Cpu,
      title: 'The AI Solution',
      desc: 'We created an AI-powered retrieval agent grounded directly in Pakistani statutory enactments (Rent Ordinances, Labour Codes, Consumer Protection Acts, and the Constitution of 1973).',
    },
    {
      icon: Heart,
      title: 'Our Civic Mission',
      desc: 'Free, transparent legal empowerment for every worker, tenant, and citizen across Pakistan — clarifying rights before disputes escalate to costly litigation.',
    },
  ];

  const techStack = [
    { name: 'React 19 & TypeScript', category: 'Core Frontend' },
    { name: 'Tailwind CSS & Framer Motion', category: 'Aesthetics & Animation' },
    { name: 'Gemini AI & Legal RAG', category: 'Intelligence Engine' },
    { name: 'Pakistani Gazette Index', category: 'Statutory Grounding' },
    { name: 'End-to-End Encryption', category: 'Privacy & Security' },
    { name: 'FastAPI Backend Ready', category: 'Integration Architecture' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide animation timer (advances every 4.5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, teamMembers.length]);

  const handleSelectMember = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const currentMember = teamMembers[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut' as const,
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: 'easeIn' as const,
      },
    }),
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0A051B] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Hero Header */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-10 pb-6 text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Creators &amp; Civic Technology Vision</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-['Outfit']"
        >
          Who Built This Platform
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          Meet the 5 builders behind <strong>Pakistan Legal Rights Agent</strong> — an independent civic technology initiative
          dedicated to making Pakistani law transparent, verifiable, and accessible to every citizen.
        </motion.p>
      </section>

      {/* Single Member Spotlight Section with Same Card Size & Auto-Slide */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-5">
        {/* 5-Member Clickable Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {teamMembers.map((member, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={member.name}
                type="button"
                onClick={() => handleSelectMember(idx)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer',
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30 scale-102 ring-2 ring-purple-400/40'
                    : 'bg-white/90 dark:bg-[#120B2E]/70 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                <span
                  className={cn(
                    'w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-extrabold',
                    isActive ? 'bg-white/25 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                  )}
                >
                  0{idx + 1}
                </span>
                <span>{member.name}</span>
              </button>
            );
          })}
        </div>

        {/* Member Counter & Badge Bar with Live Status */}
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span
            className={cn(
              'w-2 h-2 rounded-full inline-block transition-colors',
              isPaused ? 'bg-amber-400' : 'bg-emerald-500 animate-pulse'
            )}
          />
          <span>Member 0{currentIndex + 1} of 0{teamMembers.length}</span>
          <span>•</span>
          <span className="text-purple-600 dark:text-purple-400 font-semibold">{currentMember.role}</span>
          <span>•</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            {isPaused ? 'Paused (hover)' : 'Auto-sliding'}
          </span>
        </div>

        {/* Spotlight Single Member Viewport with Uniform Fixed Size and Auto-Slide */}
        <div
          className="relative w-full max-w-3xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle Auto-Slide Progress Bar */}
          <div className="mb-3 h-1 bg-slate-200/60 dark:bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ width: '0%' }}
              animate={{ width: isPaused ? '0%' : '100%' }}
              transition={{ duration: isPaused ? 0 : 4.5, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500"
            />
          </div>

          <div className="relative min-h-[460px] sm:min-h-[400px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentMember.name}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full min-h-[460px] sm:min-h-[400px] flex flex-col justify-between relative p-7 sm:p-9 rounded-3xl bg-white dark:bg-[#120B2E]/90 border border-purple-500/30 dark:border-purple-500/40 backdrop-blur-2xl shadow-xl dark:shadow-[0_0_40px_rgba(139,92,246,0.18)] text-left"
              >
                {/* Header: Avatar, Name, Role, Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Glowing Avatar */}
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold font-['Outfit'] text-2xl shadow-lg shadow-purple-600/35 shrink-0">
                      {currentMember.avatar}
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
                        {currentMember.name}
                      </h2>
                      <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
                        {currentMember.role}
                      </p>
                    </div>
                  </div>

                  <span className="w-fit text-xs font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-500/30 px-3.5 py-1 rounded-full">
                    {currentMember.badge}
                  </span>
                </div>

                {/* Biography */}
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed my-auto py-3">
                  {currentMember.bio}
                </p>

                {/* Bottom Section: Skills & Links */}
                <div className="space-y-4">
                  {/* Skills & Technologies */}
                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-white/5">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Core Specializations
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {currentMember.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/[0.06] border border-slate-200/70 dark:border-white/[0.08] px-3 py-1 rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Direct Contact Links */}
                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center gap-3">
                    {currentMember.email && (
                      <a
                        href={`mailto:${currentMember.email}`}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-bold transition-colors bg-purple-50 dark:bg-purple-950/40 px-3.5 py-1.5 rounded-xl border border-purple-200 dark:border-purple-500/20"
                      >
                        <Mail className="w-4 h-4" />
                        <span>{currentMember.email}</span>
                      </a>
                    )}
                    {currentMember.github && (
                      <a
                        href={currentMember.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs sm:text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-bold transition-colors bg-purple-50 dark:bg-purple-950/40 px-3.5 py-1.5 rounded-xl border border-purple-200 dark:border-purple-500/20"
                      >
                        <GithubIcon className="w-4 h-4" />
                        <span>GitHub Profile</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Why We Built This */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400">
            Our Purpose &amp; Mission
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-['Outfit']">
            Why We Created Pakistan Legal Rights Agent
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {milestones.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#120B2E]/60 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-2.5 text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-['Outfit']">
                  {m.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {m.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Engineering Craftsmanship */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="p-7 rounded-3xl bg-white dark:bg-[#120B2E]/70 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-xs space-y-5 text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit']">
                Technology &amp; Engineering Stack
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Crafted with modern open-source software and responsive design standards
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.06] space-y-1"
              >
                <span className="block text-[10px] font-semibold uppercase text-purple-600 dark:text-purple-400">
                  {tech.category}
                </span>
                <span className="block text-xs font-bold text-slate-900 dark:text-white">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>Repository: Aishasiddiqui97/Pakistan-legal-Rights-agent</span>
            <a
              href="https://github.com/Aishasiddiqui97/Pakistan-legal-Rights-agent"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>View on GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="p-7 rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white text-center space-y-4 shadow-xl shadow-purple-600/20">
          <h3 className="text-xl sm:text-2xl font-bold font-['Outfit']">
            Explore Pakistan Legal Rights Agent
          </h3>
          <p className="text-xs sm:text-sm text-purple-100 max-w-lg mx-auto">
            Try the conversational legal assistant to clarify tenancy, labor, and consumer statutory rights.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link to="/how-it-works">
              <button
                type="button"
                className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors cursor-pointer"
              >
                How It Works
              </button>
            </Link>
            <Link to="/assistant">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-purple-950 bg-white hover:bg-purple-50 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md"
              >
                <span>Ask Legal Assistant</span>
                <ArrowRight className="w-4 h-4 text-purple-950" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <div className="pb-16" />
    </div>
  );
}

export default WhoBuiltThisPage;
