import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Search,
  BookOpen,
  CheckCircle2,
  Scale,
  Shield,
  Zap,
  Lock,
  ArrowRight,
  FileCheck,
  Building2,
  Users,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

export function HowItWorksPage() {
  const steps = [
    {
      step: '01',
      title: 'Citizen Inquires in Everyday Language',
      description:
        'Ask about your situation without legal jargon — whether your landlord locked you out, your employer withheld salary without written notice, or an e-commerce seller sent defective goods.',
      icon: MessageSquare,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Natural Language Input',
      details: [
        'Tenancy & eviction disputes (residential & commercial)',
        'Unlawful worker termination & gratuity calculations',
        'Consumer compensation & defect liability claims',
      ],
    },
    {
      step: '02',
      title: 'Statutory Vector Retrieval (RAG)',
      description:
        'Our retrieval engine semantically matches your query against verified Pakistani legislative enactments, provincial gazettes, and constitutional articles.',
      icon: Search,
      color: 'from-indigo-500 to-purple-600',
      badge: 'Verified Legal Index',
      details: [
        'Rented Premises Ordinances & rent restriction laws',
        'Industrial Relations Acts & Standing Orders',
        'Consumer Protection Acts & procedural rules',
      ],
    },
    {
      step: '03',
      title: 'Constitutional Due Process Synthesis',
      description:
        'The engine cross-references fundamental constitutional protections (Articles 4, 10-A, 25) alongside mandatory procedural timelines, such as 15-day vendor cure notices or 90-day grievance notices.',
      icon: Scale,
      color: 'from-purple-600 to-pink-600',
      badge: 'Procedural Compliance',
      details: [
        'Enforces mandatory pre-litigation written notice rules',
        'Identifies competent territorial forums (Rent Controller, Labour Court)',
        'Verifies burden of proof & statutory time bars',
      ],
    },
    {
      step: '04',
      title: 'Actionable Guidance with Verbatim Citations',
      description:
        'You receive clear legal rights explanations, exact statutory section citations, verbatim excerpts from published gazettes, and concrete next steps.',
      icon: FileCheck,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Grounded Output',
      details: [
        'Verbatim statutory citations with enactment years',
        'Pragmatic step-by-step checklist for immediate protection',
        'Guidance on when to retain a licensed High Court advocate',
      ],
    },
  ];

  const domains = [
    {
      icon: Building2,
      title: 'Tenancy & Rent Law',
      statute: 'Rent Restriction Ordinances',
      summary:
        'Protections against forced evictions without Rent Controller decrees, illegal utility disconnections, arbitrary rent increases, and fair rent determination.',
    },
    {
      icon: Users,
      title: 'Labour & Employment Rights',
      statute: 'Standing Orders & SIRA Enactments',
      summary:
        'Mandatory written termination orders, 30-day notice periods or pay in lieu, Section 33 grievance notice procedure, and statutory gratuity entitlements.',
    },
    {
      icon: ShoppingBag,
      title: 'Consumer Protection',
      statute: 'Consumer Protection Acts',
      summary:
        'Statutory warranties, vendor defect liability, misleading advertising claims, and zero-fee dispute adjudication before District Consumer Courts.',
    },
    {
      icon: Shield,
      title: 'Constitutional Rights',
      statute: 'Constitution of Pakistan, 1973',
      summary:
        'Articles 4 (Right to be dealt with in accordance with law), 10-A (Right to Fair Trial & Due Process), and 25 (Equality of all citizens before law).',
    },
  ];

  const pillars = [
    {
      icon: Lock,
      title: 'Privacy & Data Encryption',
      desc: 'All queries are encrypted with standard SSL/TLS protocols. We never harvest CNICs, passwords, or personal details.',
    },
    {
      icon: Zap,
      title: 'Hallucination Minimization',
      desc: 'Our AI answers are strictly grounded in verified legislative excerpts rather than unverified generative guesswork.',
    },
    {
      icon: Sparkles,
      title: 'Public Legal Education',
      desc: 'Built as an independent civic technology initiative to bridge the knowledge gap for everyday Pakistani citizens.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0A051B] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-10 pb-12 text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Technology &amp; Legal Retrieval Architecture</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-['Outfit']"
        >
          How LegalAI Pakistan Works
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          Learn how our AI-powered retrieval engine transforms everyday questions into
          evidence-grounded legal guidance referencing Pakistan statutory acts and constitutional protections.
        </motion.p>
      </section>

      {/* 4-Step Pipeline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400">
            Step-by-Step Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-['Outfit']">
            The Legal Grounding Journey
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((st, idx) => {
            const IconComponent = st.icon;
            return (
              <motion.div
                key={st.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#120B2E]/70 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-xs dark:shadow-xl space-y-4 text-left group hover:border-purple-500/40 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${st.color} flex items-center justify-center text-white shadow-md`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-500/30 px-2.5 py-0.5 rounded-full">
                      {st.badge}
                    </span>
                  </div>
                  <span className="text-2xl font-black font-['Outfit'] text-slate-300 dark:text-white/20">
                    {st.step}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit'] group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {st.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-1.5">
                  {st.details.map((detail, dIdx) => (
                    <div
                      key={dIdx}
                      className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Indexed Legal Domains */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400">
            Legal Coverage
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-['Outfit']">
            Supported Statutory Domains
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Our knowledge base indexes the statutes most critical to everyday citizen and worker challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {domains.map((dom, idx) => {
            const Icon = dom.icon;
            return (
              <motion.div
                key={dom.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#120B2E]/60 border border-slate-200/80 dark:border-white/[0.08] shadow-2xs space-y-2.5 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {dom.title}
                    </h4>
                    <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                      {dom.statute}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {dom.summary}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Safety & Ethics Pillars */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pillars.map((pil) => {
            const Icon = pil.icon;
            return (
              <div
                key={pil.title}
                className="p-5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/70 dark:border-purple-500/20 text-left space-y-2"
              >
                <div className="p-2 rounded-lg bg-white dark:bg-white/10 w-fit text-purple-600 dark:text-purple-300">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {pil.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {pil.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Disclaimer Notice */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs sm:text-sm text-left leading-relaxed flex items-start gap-3">
          <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Independent Public Education Tool:</strong> LegalAI Pakistan is not an official government portal or law firm. While designed to provide verified statutory context, it does not substitute consultation with a licensed advocate of the High Court.
          </div>
        </div>

        {/* Call to action */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white text-center space-y-4 shadow-xl shadow-purple-600/20">
          <h3 className="text-xl sm:text-2xl font-bold font-['Outfit']">
            Ready to explore your legal rights?
          </h3>
          <p className="text-xs sm:text-sm text-purple-100 max-w-lg mx-auto">
            Ask any question about tenancy, employment, or consumer rights in Pakistan with instant statutory grounding.
          </p>
          <div className="pt-2 flex justify-center">
            <Link to="/assistant">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold text-purple-950 bg-white hover:bg-purple-50 transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
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

export default HowItWorksPage;
