# CodeQuest

> AI-powered interactive programming learning platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)

Enter any programming topic, pick a difficulty level, and receive a structured AI-generated tutorial with concepts, code examples, and hands-on challenges — entirely in the browser, with no local setup required.

Built as a portfolio project demonstrating modern frontend architecture, server-side AI proxying, and encryption at rest.

**[Live demo →](https://codequest-gutugaluppos-projects.vercel.app)**

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Map](#project-map)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Running Tests](#running-tests)
- [Security](#security)
- [Support](#support)
- [Project Status](#project-status)
- [License](#license)

---

## Features

- **AI-generated tutorials** — Any programming topic, 3 difficulty levels (Beginner / Intermediate / Advanced), structured into 5 progressive steps and a capstone final project
- **Multi-model support** — Bring your own Anthropic Claude, OpenAI GPT-4o, Google Gemini, or any OpenAI-compatible provider key
- **Server-side AI proxy** — All AI calls go through Vercel Functions; no SDK or key is ever bundled in the client JS
- **Encryption at rest** — User API keys are encrypted with AES-256-GCM before storage; plaintext is decrypted server-side on demand and never returned to the browser
- **Interactive code editor** — Monaco Editor (VS Code engine) with syntax highlighting, auto-format, and a Run button
- **In-browser code execution** — JavaScript and TypeScript run directly in the browser sandbox via Sucrase
- **AI solution verification** — Semantic evaluation of the user's code against the challenge, not simple string matching
- **Sandpack integration** — React challenges use a full Sandpack environment with live preview
- **Progress tracking** — Step completion and editor state persisted to Firestore in real time via `onSnapshot`
- **Tutorial history** — All generated tutorials saved to the account, accessible from the dashboard
- **Internationalization** — UI available in 6 languages: English, Portuguese (BR), Spanish, German, Greek, Polish
- **Google Authentication** — Sign in with Google; profile photo upload with in-browser crop via Cloudinary
- **Dev Log** — In-app timeline tracking every architectural decision and bug from day one

---

## Tech Stack

### Frontend

| Concern | Technology |
|---|---|
| Framework | React 19 + TypeScript (strict) |
| Bundler | Vite 8 |
| Routing | TanStack Router (file-based, type-safe) |
| Data fetching | TanStack Query v5 |
| UI state | Zustand v5 |
| Styling | TailwindCSS 4 |
| Animations | Motion |
| Code editor | Monaco Editor |
| React sandbox | Sandpack |
| Internationalization | i18next + react-i18next |
| Tests | Vitest + Testing Library |

### Backend & Infrastructure

| Concern | Technology |
|---|---|
| Serverless functions | Vercel Functions (Node.js) |
| Auth | Firebase Authentication (Google) |
| Database | Cloud Firestore (named database) |
| File storage | Cloudinary |
| AI — default | Google Gemini 2.5 Flash Lite |
| AI — user keys | Anthropic Claude, OpenAI GPT-4o, custom OpenAI-compatible |

---

## Project Map

```
 ┌─────────────────────────────────────────────────────────────────────────┐
 │  FRONTEND  —  React 19 SPA  (runs in the browser)                      │
 │                                                                         │
 │  TanStack Router · TanStack Query · Zustand · TailwindCSS · Motion     │
 │  Monaco Editor · Sandpack · i18next (6 languages)                       │
 │                                                                         │
 │  /              Landing page (topic search, how-it-works)               │
 │  /dashboard     Tutorial history + API key banner                       │
 │  /tutorial/:id  Step navigator · Monaco editor · Sandpack               │
 │  /profile       Account settings + API key management                   │
 │  /devlog        Development timeline                                    │
 └─────────────────────────────────┬───────────────────────────────────────┘
                                   │ HTTPS  ·  Authorization: Bearer <token>
 ┌─────────────────────────────────▼───────────────────────────────────────┐
 │  BACKEND  —  Vercel Functions  (Node.js serverless, server memory only) │
 │                                                                         │
 │  POST /api/generate    AI tutorial generation                           │
 │  POST /api/verify      Semantic code verification                       │
 │  POST /api/save-key    Encrypt + persist user API key                   │
 │                                                                         │
 │  Firebase ID token verification · AES-256-GCM decryption               │
 │  Rate limiting (5/min generate · 20/min verify) · Input validation      │
 └──────────┬────────────────────────────────────┬────────────────────────┘
            │                                    │
 ┌──────────▼──────────────────────┐  ┌──────────▼──────────────────────┐
 │  AUTH  —  Firebase Auth         │  │  DATABASE  —  Cloud Firestore   │
 │                                 │  │                                 │
 │  Google OAuth sign-in           │  │  users/{uid}/                   │
 │  ID token issuance & verify     │  │    tutorials/{id}               │
 └─────────────────────────────────┘  │    progress/{tutorialId}        │
                                      │    encryptedKeys/{provider}     │
 ┌─────────────────────────────────┐  │      (client access blocked)    │
 │  STORAGE  —  Cloudinary         │  └─────────────────────────────────┘
 │                                 │
 │  Profile photo upload           │  ┌─────────────────────────────────┐
 │  In-browser crop (react-easy-   │  │  AI PROVIDERS                   │
 │  crop) → transform → CDN URL    │  │                                 │
 └─────────────────────────────────┘  │  Google Gemini 2.5 Flash Lite   │
                                      │  Anthropic Claude 3.5 Sonnet    │
                                      │  OpenAI GPT-4o                  │
                                      │  Custom (OpenAI-compatible BYO) │
                                      └─────────────────────────────────┘
```

---

## Architecture

### Source tree

```
src/
├── routes/              # TanStack Router file-based routes
│   ├── __root.tsx       # Root layout: QueryClientProvider + AuthProvider + Header
│   ├── index.tsx        # Landing page
│   ├── dashboard.tsx    # Tutorial history + API key banner
│   ├── tutorial.$id.tsx # Step navigator, Monaco editor, Sandpack
│   ├── profile.tsx      # Profile management + API key setup
│   ├── devlog.tsx       # Development log timeline
│   └── design.tsx       # Internal design system reference
├── queries/             # TanStack Query options (query keys + fetchers)
├── services/            # aiService, verifyService, firestoreService, systemPrompt
├── hooks/               # useAuth, useProgressSync (onSnapshot → invalidateQueries)
├── stores/              # Zustand: editorStore (code, output, feedback, step)
├── components/
│   ├── layout/          # Header, navigation
│   ├── dashboard/       # TutorialCard, ApiKeyBanner, DashboardContent
│   ├── tutorial/        # StepNav, TutorialStep, ConceptBlock, ChallengeBlock
│   ├── editor/          # MonacoWrapper, EditorToolbar, OutputPanel
│   ├── landing/         # Hero, FeatureCards, HowItWorks, footer
│   └── profile/         # ProfileForm, ApiKeyInputs, ImageInput
├── types/               # Tutorial, UserProfile, ModelProvider, Level
├── i18n/locales/        # en, pt-BR, es, de, el, pl
└── lib/                 # Firebase client, QueryClient, Router init

api/                     # Vercel Functions (server-side, Node.js)
├── generate.ts          # POST /api/generate — AI tutorial generation
├── verify.ts            # POST /api/verify  — AI solution verification
├── save-key.ts          # POST /api/save-key — encrypt + persist user API key
├── _firebaseAdmin.ts    # Firebase Admin SDK singleton (lazy init)
├── _encrypt.ts          # AES-256-GCM encrypt/decrypt helpers
├── _validate.ts         # Input validation for all endpoints
├── _rateLimit.ts        # In-memory rate limiting
└── _cors.ts             # CORS headers helper
```

### Request flow — tutorial generation

```
Browser
  └─ POST /api/generate { topic, model, level, language }
       Authorization: Bearer <Firebase ID token>
  └─ Vercel Function
       ├─ Verify ID token → uid
       ├─ model = claude / openai / gemini / other:
       │    ├─ Fetch encryptedKeys/{provider} from Firestore (Admin SDK)
       │    ├─ Decrypt AES-256-GCM → plaintext key (server memory only)
       │    └─ Call provider SDK server-side
       └─ Returns Tutorial JSON
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- [Vercel CLI](https://vercel.com/docs/cli): `npm i -g vercel`
- A Firebase project with:
  - Authentication → Google provider enabled
  - Firestore database (note the database name/ID)
  - Service account key (Firebase Console → Project Settings → Service Accounts → Generate new private key)
- A [Google AI Studio](https://aistudio.google.com) API key (Gemini)
- A [Cloudinary](https://cloudinary.com) account with an unsigned upload preset

### 1. Clone and install

```bash
git clone https://github.com/GutuGaluppo/codequest.git
cd codequest
npm install
```

### 2. Configure environment variables

Create `.env.local` in the project root:

```bash
# ── Client-side (bundled by Vite — no secrets) ──────────────────────────

# Firebase client SDK (Firebase Console → Project Settings → Your apps)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Firestore database ID — same value as FIRESTORE_DATABASE_ID below
# Use "(default)" if you have not created a named database
VITE_AI_STUDIO_KEY=

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=

# ── Server-only (Vercel Functions — never sent to the browser) ───────────

# Gemini — system key, no user setup required
GEMINI_API_KEY=

# Firestore database ID used by the Admin SDK
FIRESTORE_DATABASE_ID=

# Firebase Admin SDK (from the downloaded service account JSON)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# AES-256 key for encrypting user API keys (64 hex chars = 32 bytes)
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=
```

> **`FIREBASE_PRIVATE_KEY`** — paste the value with literal `\n` sequences exactly as it appears in the downloaded JSON. Wrap the entire value in double quotes. The server converts them to real newlines automatically.

> **`VITE_AI_STUDIO_KEY` and `FIRESTORE_DATABASE_ID`** — must contain the exact same value: your Firestore database name. If you use the default Firestore database, set both to `(default)`.

### 3. Link to Vercel (first time only)

```bash
vercel link
```

Follow the prompts to connect the project to your Vercel account.

### 4. Start the development server

```bash
npm run dev:full
```

This starts both the Vite frontend and Vercel Functions locally at `http://localhost:3000`.

For frontend-only (AI features will not work):

```bash
npm run dev
```

### 5. Firestore security rules

Apply the following in Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /progress/{tutorialId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /tutorials/{tutorialId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      // encryptedKeys is read/written exclusively by the Admin SDK server-side.
      // Client access is intentionally blocked.
      match /encryptedKeys/{provider} {
        allow read, write: if false;
      }
    }
  }
}
```

---

## Deploying to Vercel

### 1. Import the repository

Connect your GitHub repo at [vercel.com/new](https://vercel.com/new). Vercel will detect `vercel.json` automatically.

### 2. Add environment variables

In the Vercel dashboard → Project → Settings → Environment Variables, add every variable from `.env.local`. Apply each to **Production**, **Preview**, and **Development**.

Key points:
- All `VITE_*` variables must keep the `VITE_` prefix — Vite injects them at build time
- `GEMINI_API_KEY`, `FIREBASE_*`, `ENCRYPTION_KEY`, and `FIRESTORE_DATABASE_ID` are server-only
- `FIREBASE_PRIVATE_KEY` — paste without surrounding quotes, keeping literal `\n` sequences

### 3. Deploy

Vercel auto-deploys on every push to `master`. To deploy manually:

```bash
vercel --prod
```

---

## API Reference

### `POST /api/generate`

Generates a tutorial with introduction, 5 steps, and a final project.

**Headers**
```
Authorization: Bearer <Firebase ID token>
Content-Type: application/json
```

**Body**
```json
{
  "topic": "React hooks",
  "model": "gemini",
  "level": "beginner",
  "language": "English"
}
```

| Field | Type | Values |
|---|---|---|
| `topic` | string | Any programming topic (max 200 chars) |
| `model` | string | `"gemini"` · `"claude"` · `"openai"` · `"other"` |
| `level` | string | `"beginner"` · `"intermediate"` · `"advanced"` |
| `language` | string | Language name for AI-generated content (e.g. `"Portuguese"`) |

Rate limit: **5 requests / minute** per IP.

---

### `POST /api/verify`

Semantically verifies a code submission against the challenge.

**Headers**
```
Authorization: Bearer <Firebase ID token>
Content-Type: application/json
```

**Body**
```json
{
  "prompt": "Write a function that doubles a number",
  "solution": "function double(n) { return n * 2; }",
  "userCode": "const double = n => n * 2",
  "output": "4",
  "model": "gemini"
}
```

Rate limit: **20 requests / minute** per IP.

---

### `POST /api/save-key`

Encrypts and persists a user-provided API key to Firestore.

**Headers**
```
Authorization: Bearer <Firebase ID token>
Content-Type: application/json
```

**Body**
```json
{
  "provider": "anthropic",
  "key": "sk-ant-..."
}
```

The key is encrypted with AES-256-GCM (random IV per write) before being stored. Plaintext is never persisted or logged.

---

## Running Tests

```bash
npm test          # Run test suite once
npm run test:ui   # Open Vitest UI in the browser
```

---

## Security

| Concern | Approach |
|---|---|
| API keys in client bundle | No — all provider keys are server-only env vars or decrypted server-side |
| User key storage | AES-256-GCM encryption at rest; only ciphertext + IV in Firestore |
| Identity verification | Every Function endpoint calls `adminAuth.verifyIdToken()` |
| Rate limiting | 5/min generate, 20/min verify, enforced per IP in each Function |
| Input validation | Topic length, model/level enum, key length validated on every request |
| Prompt injection | User input wrapped in XML delimiters before being sent to AI models |
| Firestore client access | `encryptedKeys` subcollection locked with `allow read, write: if false` |

---

## Support

Found a bug or have a question? [Open an issue](https://github.com/GutuGaluppo/codequest/issues) on GitHub.

---

## Project Status

Active development — portfolio project by [Augusto Galuppo](https://github.com/GutuGaluppo). See the [Dev Log](https://codequest-gutugaluppos-projects.vercel.app/devlog) for a full timeline of decisions and bugs.

---

## License

MIT
