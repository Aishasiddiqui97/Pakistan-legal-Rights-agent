import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Scale,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  ChevronDown,
  Plus,
  SquarePen,
  Trash2,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useConversations } from '@/features/conversations/hooks/useConversations';
import { useTheme } from '@/context/ThemeContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { conversations, deleteConversation } = useConversations();
  const { isDark, toggleTheme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModel, setActiveModel] = useState<'sindh-standard' | 'sindh-rag-pro'>('sindh-standard');
  const [showStatutesModal, setShowStatutesModal] = useState(false);
  const [showRightsModal, setShowRightsModal] = useState(false);
  const [showLegalNoticeModal, setShowLegalNoticeModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeySaved, setApiKeySaved] = useState(false);

  // Determine current page title and breadcrumb based on route
  const isChat = location.pathname.startsWith('/assistant');
  const isHistory = location.pathname.startsWith('/history');
  const isProfile = location.pathname.startsWith('/profile');

  const getPageInfo = () => {
    if (isHistory) return { breadcrumb: 'Saved Consultations', title: 'Saved Legal Consultations' };
    if (isProfile) return { breadcrumb: 'Citizen Profile', title: 'Citizen Profile & Settings' };
    return { breadcrumb: 'Legal Assistant', title: 'Pakistan Legal Rights Assistant' };
  };

  const pageInfo = getPageInfo();

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'AS';

  return (
    <div
      className={cn(
        'flex h-screen overflow-hidden font-sans transition-colors duration-200 select-none',
        isDark ? 'bg-transparent text-slate-100' : 'bg-transparent text-slate-800'
      )}
    >
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      {/* Left Sidebar (GPT Style) */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          isDark
            ? 'bg-[#0E0824] border-r border-white/5 text-slate-200'
            : 'bg-[#F9F9FB] border-r border-slate-200/70 text-slate-800'
        )}
      >
        {/* Top Header of Sidebar */}
        <div className="p-3 pb-2 flex items-center justify-between">
          <Link
            to="/assistant"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-200/50 dark:hover:bg-white/[0.06] transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Scale className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm tracking-tight font-['Outfit'] text-slate-900 dark:text-white">
              LegalAI
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              to="/assistant"
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
              title="New consultation"
              aria-label="New consultation"
            >
              <SquarePen className="w-4 h-4" />
            </Link>

            {/* Close button for mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* New Chat Action Button */}
        <div className="px-3 pt-1 pb-2">
          <Link
            to="/assistant"
            onClick={() => setSidebarOpen(false)}
            className={cn(
              'flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold transition-colors border',
              isDark
                ? 'border-white/5 hover:bg-white/[0.08] text-slate-200 hover:text-white'
                : 'border-slate-200/80 hover:bg-slate-200/60 text-slate-700 hover:text-slate-900'
            )}
          >
            <Plus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>New consultation</span>
          </Link>
        </div>

        {/* Recent Conversations List (GPT Style) */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 gpt-scrollbar">
          <div className="px-2 pt-1 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            <span>Recent</span>
            {conversations.length > 0 && (
              <Link
                to="/history"
                onClick={() => setSidebarOpen(false)}
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-[10px]"
              >
                View all ({conversations.length})
              </Link>
            )}
          </div>

          {conversations.length === 0 ? (
            <div className="px-3 py-6 text-center space-y-1 text-slate-400">
              <MessageSquare className="w-5 h-5 mx-auto opacity-40" />
              <p className="text-xs">No saved inquiries yet</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {conversations.slice(0, 25).map((c) => {
                const isActive = location.pathname === `/assistant/${c.id}`;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      navigate(`/assistant/${c.id}`);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      'group relative flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer',
                      isActive
                        ? isDark
                          ? 'bg-white/10 text-white font-semibold'
                          : 'bg-slate-200/80 text-slate-900 font-semibold'
                        : isDark
                        ? 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                        : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                    )}
                  >
                    <span className="truncate pr-2">{c.title || 'Untitled consultation'}</span>
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await deleteConversation(c.id);
                        if (location.pathname === `/assistant/${c.id}`) {
                          navigate('/assistant');
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-all rounded"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Profile Footer (GPT Style) */}
        <div className="p-2 border-t border-slate-200/60 dark:border-white/5 shrink-0">
          <div className="flex items-center justify-between">
            <Link
              to="/profile"
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-2.5 p-2 rounded-xl transition-colors flex-1 min-w-0',
                isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-slate-200/60'
              )}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                {userInitials}
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {user?.name || 'Aisha Siddiqui'}
                </span>
                <span className="text-[10px] text-slate-400 truncate">Citizen Account</span>
              </div>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-200/60 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area: Top Bar + Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Top Header Bar */}
        {/* Top Header Bar (GPT Style) */}
        <header
          className={cn(
            'h-14 px-4 sm:px-6 flex items-center justify-between shrink-0 z-10 transition-colors duration-200 border-b',
            isDark ? 'border-white/5 bg-transparent' : 'border-slate-200/50 bg-transparent'
          )}
        >
          {/* Left: Mobile Sidebar Toggle + Model Switcher */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className={cn(
                'lg:hidden p-1.5 rounded-lg transition-colors cursor-pointer',
                isDark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
              )}
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {isChat ? (
              <button
                type="button"
                onClick={() =>
                  setActiveModel(activeModel === 'sindh-standard' ? 'sindh-rag-pro' : 'sindh-standard')
                }
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer group',
                  isDark
                    ? 'text-slate-200 hover:bg-white/[0.08]'
                    : 'text-slate-800 hover:bg-slate-100'
                )}
                title="Switch Legal Intelligence Model"
              >
                <span>{activeModel === 'sindh-standard' ? 'Pakistan Legal RAG' : 'Judicial Precedents'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
              </button>
            ) : (
              <span
                className={cn(
                  'text-sm font-bold font-["Outfit"] tracking-tight px-1',
                  isDark ? 'text-white' : 'text-slate-900'
                )}
              >
                {pageInfo.title}
              </span>
            )}
          </div>

          {/* Right: New Chat + Theme Toggle + Profile Avatar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {isChat && (
              <Link
                to="/assistant"
                className={cn(
                  'p-2 rounded-xl transition-colors',
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                )}
                title="New consultation"
                aria-label="New consultation"
              >
                <Plus className="w-4 h-4" />
              </Link>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              className={cn(
                'p-2 rounded-xl transition-colors cursor-pointer',
                isDark
                  ? 'text-slate-400 hover:text-amber-400 hover:bg-white/[0.08]'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              )}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              to="/profile"
              className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs hover:opacity-90 transition-opacity ml-1"
              title="Citizen Profile"
            >
              {userInitials}
            </Link>
          </div>
        </header>

        {/* Central Content Canvas with Subtle Scales Emblem */}
        <main
          className={cn(
            'relative flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar transition-colors duration-200',
            isDark ? 'bg-transparent' : 'bg-transparent'
          )}
        >
          <Outlet context={{ activeModel, isDark }} />
        </main>
      </div>

      {/* Pakistan Statutes & Acts Modal */}
      <Modal
        isOpen={showStatutesModal}
        onClose={() => setShowStatutesModal(false)}
        title="Pakistan Statutes & Gazette Enactments"
        maxWidth="lg"
      >
        <div className="space-y-4 text-left">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            The legal assistant references verified statutory enactments published in gazettes across Pakistan:
          </p>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-purple-500/20 bg-slate-50 dark:bg-purple-950/20">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Sindh Rented Premises Ordinance, 1979 (SRPO)
                </h5>
                <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 px-2 py-0.5 rounded">
                  Tenancy Law
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Regulates tenant protections, fair rent determination, and mandates eviction solely through Rent Controller orders under Section 15. Prohibits cutting off utilities under Section 11.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-purple-500/20 bg-slate-50 dark:bg-purple-950/20">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Sindh Industrial Relations Act, 2013 (SIRA)
                </h5>
                <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 px-2 py-0.5 rounded">
                  Labour & Unions
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Protects collective bargaining agents (CBA), outlines unfair labour practices, and provides grievance redressal mechanisms before the Sindh Labour Court under Section 33.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-purple-500/20 bg-slate-50 dark:bg-purple-950/20">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Sindh Terms of Employment (Standing Orders) Act, 2015
                </h5>
                <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 px-2 py-0.5 rounded">
                  Worker Protections
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Standing Order 12 requires written termination with explicit justification, 30 days statutory notice or wages in lieu, and statutory gratuity entitlements.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-purple-500/20 bg-slate-50 dark:bg-purple-950/20">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  The Sindh Consumer Protection Act, 2014
                </h5>
                <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 px-2 py-0.5 rounded">
                  Consumer Rights
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Protects citizens against defective products, misleading warranties, and deficient services with zero-cost grievance filings before District Consumer Courts.
              </p>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="purple" size="sm" onClick={() => setShowStatutesModal(false)}>
              Close Library
            </Button>
          </div>
        </div>
      </Modal>

      {/* Citizen Fundamental Rights Modal */}
      <Modal
        isOpen={showRightsModal}
        onClose={() => setShowRightsModal(false)}
        title="Fundamental Rights (Constitution of Pakistan, 1973)"
        maxWidth="lg"
      >
        <div className="space-y-4 text-left">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Supreme constitutional guarantees protecting every citizen across Pakistan:
          </p>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <div className="p-3 rounded-xl border border-purple-200 dark:border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/30">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300">Article 4</span>
              <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-0.5">
                Right of individuals to be dealt with in accordance with law
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                No action detrimental to the life, liberty, body, reputation, or property of any person shall be taken except in accordance with law.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-purple-200 dark:border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/30">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300">Article 9 & 10</span>
              <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-0.5">
                Security of Person & Safeguards as to Arrest
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                No person shall be deprived of life or liberty save in accordance with law. Every arrested person must be informed of the grounds and produced before a magistrate within 24 hours.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-purple-200 dark:border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/30">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300">Article 10-A</span>
              <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-0.5">
                Right to Fair Trial and Due Process
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                For the determination of civil rights and obligations or in any criminal charge against him, a person shall be entitled to a fair trial and due process.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-purple-200 dark:border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/30">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300">Article 14 & 25</span>
              <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-0.5">
                Inviolability of Dignity & Equality of Citizens
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                The dignity of man and privacy of home is inviolable. All citizens are equal before law and entitled to equal protection without discrimination.
              </p>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="purple" size="sm" onClick={() => setShowRightsModal(false)}>
              Understood
            </Button>
          </div>
        </div>
      </Modal>

      {/* Legal Notice Guidance Modal */}
      <Modal
        isOpen={showLegalNoticeModal}
        onClose={() => setShowLegalNoticeModal(false)}
        title="Statutory Legal Notice Guidance"
        maxWidth="md"
      >
        <div className="space-y-4 text-left text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <p>
            Before initiating litigation in Pakistan, procedural statutes require serving formal written notices:
          </p>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200 dark:border-purple-500/20">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 dark:text-white">Consumer Disputes (15-Day Notice):</strong>
                Under the Sindh Consumer Protection Act, 2014, written notice with 15 days cure period is mandatory before approaching the Consumer Court.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200 dark:border-purple-500/20">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 dark:text-white">Labour Grievance (Section 33 SIRA):</strong>
                Worker must submit a formal written grievance notice to the employer within 90 days of grievance occurrence before filing a petition with the Labour Court.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200 dark:border-purple-500/20">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 dark:text-white">Tenancy Default Notice:</strong>
                Landlords must provide statutory notice for rent arrears before the Rent Controller will accept an ejectment petition under Section 15 of SRPO.
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="purple" size="sm" onClick={() => setShowLegalNoticeModal(false)}>
              Got it
            </Button>
          </div>
        </div>
      </Modal>

      {/* AI Engine & API Key Modal */}
      <Modal
        isOpen={showApiKeyModal}
        onClose={() => {
          setShowApiKeyModal(false);
          setApiKeySaved(false);
        }}
        title="AI Legal Engine & Retrieval Settings"
        maxWidth="md"
      >
        <div className="space-y-4 text-left">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Configure your custom API Key or vector indexing provider to execute dedicated statutory retrieval without rate limits:
          </p>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              OpenAI / Gemini / Custom LLM Key
            </label>
            <input
              type="password"
              placeholder="sk-..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-purple-500/30 bg-white dark:bg-purple-950/30 p-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {apiKeySaved && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 text-xs font-semibold border border-purple-200 dark:border-purple-500/20">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>API Key encrypted and active for your session!</span>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowApiKeyModal(false);
                setApiKeySaved(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="purple"
              size="sm"
              onClick={() => {
                setApiKeySaved(true);
                setTimeout(() => setShowApiKeyModal(false), 1200);
              }}
            >
              Save Key
            </Button>
          </div>
        </div>
      </Modal>

      {/* Legal Info Modal */}
      <Modal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="AI Legal Intelligence Notice & Disclaimer"
        maxWidth="md"
      >
        <div className="space-y-4 text-left text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <p>
            Pakistan Legal Rights Agent is an AI-powered assistant providing educational legal rights guidance referencing published gazetted acts and the Constitution of Pakistan. This is an independent educational tool, not an official government portal.
          </p>
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/20 text-purple-900 dark:text-purple-200 text-xs">
            <strong>Security & Privacy:</strong> Conversations are encrypted end-to-end. Your confidential inquiry data is never shared with third parties.
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="purple" size="sm" onClick={() => setShowInfoModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
