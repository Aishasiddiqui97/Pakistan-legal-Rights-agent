# Pakistan Legal Rights Agent — Sindh Legal Information Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC.svg)](https://tailwindcss.com/)
[![FastAPI Ready](https://img.shields.io/badge/FastAPI-Integration_Ready-009688.svg)](frontend/docs/API_CONTRACT.md)

An AI-powered legal information assistant initially focused on **Sindh, Pakistan**. Grounded in authentic provincial statutes, gazette notifications, and procedural rights for tenants, workers, consumers, and citizens.

---

## 🏛️ Project Overview

Citizens and workers in Pakistan frequently face difficulties navigating provincial laws and judicial procedures due to complex legal jargon, inaccessible court registries, and widespread misinformation.

**Pakistan Legal Rights Agent** bridges this gap by providing an accessible, mobile-first conversational interface backed by:
1. **Verifiable Sindh Statutory Citations**: Every answer references genuine enactments (e.g. *The Sindh Rented Premises Ordinance, 1979*, *Sindh Industrial Relations Act, 2013*).
2. **Transparent Evidence Passages**: Displays verbatim excerpts and relevance confidence scores directly from official gazette sources.
3. **Actionable Next Steps**: Practical guidance on procedural remedies, such as filing Section 33 Grievance Notices in Labour Courts or Section 11 applications before the Rent Controller.
4. **Responsible Legal Disclaimer**: Explicitly identifies information as educational context and encourages consultation with licensed advocates of the High Court of Sindh for active litigation.

---

## 🚀 Key Features

- **Conversational Legal Assistant**: Responsive chat composer with textarea auto-resize, keyboard shortcuts (`Enter` to submit, `Shift+Enter` for newline), and suggested inquiry chips.
- **Evidence & Citation System**: Interactive citation cards with gazette references, copy citation buttons, and verbatim statutory snippets.
- **Jurisdiction & Topic Filtering**: Emphasizes Sindh provincial law (Karachi, Hyderabad, Sukkur) while accommodating federal due process provisions.
- **Authentication & User Profiles**: Secure session management, sign-up with password strength validation, and profile settings for preferred jurisdiction.
- **Saved Inquiries & History**: Backend-persisted conversation history with search filtering and safe deletion confirmation dialogs.
- **High-Certainty Development Mode**: Built-in mock data adapter with authentic Sindh legal knowledge so the frontend can be fully experienced even before the FastAPI backend is launched.

---

## 📂 Repository Structure

```
Pakistan-legal-Rights-agent/
├── README.md                          # Repository overview & setup instructions
├── .gitignore                         # Root Git ignore rules
└── frontend/                          # React + TypeScript frontend application
    ├── index.html                     # HTML5 entry with Inter font & SEO meta
    ├── package.json                   # Dependencies & scripts
    ├── tsconfig.json                  # Root TypeScript configuration
    ├── tsconfig.app.json              # App compiler options & path aliases
    ├── vite.config.ts                 # Vite bundler with Tailwind CSS v4 & path alias
    ├── .env.example                   # Environment variable template
    ├── docs/
    │   └── API_CONTRACT.md            # Comprehensive FastAPI integration contract
    └── src/
        ├── main.tsx                   # Application bootstrap
        ├── app/
        │   ├── App.tsx                # Providers (QueryClient, AuthProvider, Router)
        │   └── router.tsx             # Code-split route definitions
        ├── components/
        │   ├── ui/                    # Reusable Button, Input, Card, Badge, Modal, Skeleton
        │   ├── layout/                # Navbar, MobileNav, Footer
        │   └── feedback/              # ErrorBoundary, EmptyState, DisclaimerBanner
        ├── features/
        │   ├── auth/                  # SignInForm, SignUpForm, AuthContext, ProtectedRoute
        │   ├── profile/               # ProfileOverview & jurisdiction settings
        │   ├── legal-assistant/       # ChatContainer, ChatComposer, ChatMessageBubble
        │   ├── conversations/         # ConversationList, useConversations TanStack hook
        │   └── evidence/              # CitationCard, EvidenceSnippetViewer
        ├── pages/
        │   ├── LandingPage.tsx        # Public landing experience
        │   ├── AssistantPage.tsx      # Split-screen legal assistant workspace
        │   ├── HistoryPage.tsx        # Full-page saved consultations
        │   ├── ProfilePage.tsx        # Citizen account & preferences
        │   ├── SignInPage.tsx         # Sign in page
        │   ├── SignUpPage.tsx         # Account registration page
        │   └── NotFoundPage.tsx       # 404 handler
        ├── services/
        │   ├── api-client.ts          # Typed fetch client with Bearer token & cookie support
        │   ├── endpoints.ts           # Centralized API route constants
        │   ├── auth-service.ts        # Auth adapter (Live backend + dev mock fallback)
        │   ├── chat-service.ts        # Chat adapter (Live backend + dev mock fallback)
        │   └── mock-data/             # Authentic Sindh statutory knowledge base
        ├── config/
        │   └── env.ts                 # Validated typed environment variables
        └── types/                     # Shared TypeScript interfaces (Auth, Chat, Evidence, API)
```

---

## 🛠️ Quick Start

### Prerequisites
- Node.js `v18+` (Tested on Node `v24.18.0`)
- npm `v9+` (Tested on npm `v11.16.0`)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env.local
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. Test production build:
   ```bash
   npm run build
   ```

---

## ⚙️ Environment Configuration

| Variable | Default Value | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000/api/v1` | URL of the Python / FastAPI backend |
| `VITE_APP_NAME` | `Pakistan Legal Rights Agent` | Application title |
| `VITE_ENABLE_MOCK_API` | `true` | When `true`, uses authentic local mock fixtures; when `false`, communicates with FastAPI |
| `VITE_API_TIMEOUT_MS` | `15000` | HTTP request timeout in milliseconds |

> **Security Note**: Never commit `.env` or `.env.local` files containing secrets. Frontend code runs entirely in the browser; never put Gemini API keys or database credentials in `VITE_` variables.

---

## 🤝 Backend Integration (FastAPI Teammate)

The frontend is built with strict TypeScript models matching the backend requirements. See [`frontend/docs/API_CONTRACT.md`](frontend/docs/API_CONTRACT.md) for full request/response schemas, error handling formats, and endpoint specifications.

To switch from mock mode to live FastAPI mode:
Set `VITE_ENABLE_MOCK_API=false` in `frontend/.env.local` and ensure your FastAPI server is running at `http://localhost:8000`.

---

## ⚖️ Legal Disclaimer

Pakistan Legal Rights Agent provides educational legal information and statutory citations based on gazetted laws of Sindh and Pakistan. **It does not constitute licensed legal advice, court representation, or an attorney-client relationship.** If you are facing eviction, detention, or active litigation, consult an advocate registered with the Sindh Bar Council or a recognized legal aid clinic.
