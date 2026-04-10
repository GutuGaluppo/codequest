# CodeQuest

An AI-powered interactive programming learning platform. Enter any topic, choose a difficulty level and an AI model, and get a structured tutorial with concepts, code examples, and hands-on challenges — all in the browser.

Built as a portfolio project demonstrating modern frontend architecture, server-side AI proxying, and encryption at rest.

---

## Features

- **AI-generated tutorials** — Any programming topic, 3 difficulty levels (Beginner / Intermediate / Advanced), structured into 5 progressive steps + a capstone final project
- **Multi-model support** — Google Gemini 2.5 Flash Lite (system key, no setup required); bring your own Anthropic Claude or OpenAI GPT-4o key for those models
- **Server-side AI proxy** — All AI calls go through Vercel Functions; no SDK or API key is ever bundled into the client JS
- **Encryption at rest** — User API keys are encrypted with AES-256-GCM before storage; only ciphertext + IV are written to Firestore; plaintext is decrypted server-side on demand and never returned to the browser
- **Interactive code editor** — Monaco Editor (VS Code engine) with syntax highlighting, auto-format, and a Run button
- **In-browser code execution** — JavaScript/TypeScript runs directly in the browser sandbox via Sucrase; output shown inline
- **AI solution verification** — Verify button sends code + output to the AI model for semantic evaluation, not just string matching
- **Sandpack integration** — React challenges use a full browser-side Sandpack environment with live preview
- **Progress tracking** — Step completion and editor code persisted to Firestore in real time via `onSnapshot` sync
- **Tutorial history** — All generated tutorials saved to your account, accessible from the dashboard
- **Internationalization** — UI in 6 languages: English, Portuguese (BR), Spanish, German, Greek, Polish
- **Google Authentication** — Sign in with Google; profile photo upload via Cloudinary
- **Dev Log** — In-app development log tracking every architectural decision and bug

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript (strict) |
| Bundler | Vite 8 |
| Routing | TanStack Router (file-based, type-safe loaders) |
| Data fetching | TanStack Query v5 |
| UI state | Zustand v5 |
| Styling | TailwindCSS 4 |
| Animations | Motion |
| Code editor | Monaco Editor |
| Sandbox (React) | Sandpack |
| Auth | Firebase Authentication (Google) |
| Database | Cloud Firestore (named database) |
| File storage | Cloudinary (profile photos) |
| Backend | Vercel Functions (Node.js) |
| AI — default | Google Gemini 2.5 Flash Lite |
| AI — user keys | Anthropic Claude 3.5 Sonnet, OpenAI GPT-4o |
| i18n | i18next + react-i18next |
| Tests | Vitest + Testing Library |

---

## Architecture Overview

```
src/
├── routes/              # TanStack Router file-based routes
│   ├── __root.tsx       # Root layout: QueryClientProvider + AuthProvider + Header
│   ├── index.tsx        # Landing page (topic search, feature cards, how-it-works)
│   ├── dashboard.tsx    # Tutorial history + API key banner
│   ├── tutorial.$id.tsx # Tutorial viewer: step nav, Monaco editor, Sandpack
│   ├── profile.tsx      # Profile management + API key setup
│   ├── devlog.tsx       # Development log (timeline of decisions and bugs)
│   └── design.tsx       # Internal design system reference
├── queries/             # Reusable TanStack Query options (query keys + fetcher)
├── services/            # aiService, verifyService, firestoreService, systemPrompt
├── hooks/               # useAuth, useProgressSync (onSnapshot → invalidateQueries)
├── stores/              # Zustand: editorStore (code, output, feedback, step)
├── components/
│   ├── layout/          # Header, nav
│   ├── dashboard/       # TutorialCard, ApiKeyBanner, DashboardContent
│   ├── tutorial/        # StepNav, TutorialStep, ConceptBlock, ChallengeBlock
│   ├── editor/          # MonacoWrapper, EditorToolbar, OutputPanel
│   ├── landing/         # Hero, FeatureCards, HowItWorks, ApiKeysCard, …
│   └── profile/         # ProfileForm, ProfileInputs, ImageInput
├── types/               # Tutorial, UserProfile, ModelProvider, Level
├── i18n/locales/        # en, pt-BR, es, de, el, pl
└── lib/                 # Firebase client, QueryClient, Router init

api/                     # Vercel Functions (server-side, Node.js)
├── generate.ts          # POST /api/generate — AI tutorial generation
├── verify.ts            # POST /api/verify  — AI solution verification
├── save-key.ts          # POST /api/save-key — encrypt + persist user API key
├── _firebaseAdmin.ts    # Firebase Admin SDK singleton (auth + Firestore)
├── _encrypt.ts          # AES-256-GCM encrypt/decrypt helpers
├── _validate.ts         # Input validation for all endpoints
├── _rateLimit.ts        # In-memory rate limiting (5/min generate, 20/min verify)
└── _cors.ts             # CORS headers helper
```

### Request flow — tutorial generation

```
Browser
  └─ POST /api/generate { topic, model, level, language }
       Authorization: Bearer <Firebase ID token>
  └─ Vercel Function
       ├─ Verify ID token → get uid
       ├─ model = claude / openai:
       │    ├─ Fetch encryptedKeys/{provider} from Firestore (Admin SDK)
       │    ├─ Decrypt AES-256-GCM → plaintext key (server memory only)
       │    └─ Call Anthropic / OpenAI SDK server-side
       └─ model = gemini:
            └─ Use GEMINI_API_KEY env var directly
  └─ Returns Tutorial JSON to browser
```

---

## Getting Started (Local Development)

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
git clone <repo-url>
cd codequest
npm install
```

### 2. Configure environment variables

Create `.env.local` in the project root:

```bash
# ── Client-side (bundled by Vite — no secrets) ────────────────────────────────

# Firebase client SDK (Firebase Console → Project Settings → Your apps)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Firestore database ID (Firebase Console → Firestore → top of the page)
# Use "(default)" if you have not created a named database
VITE_AI_STUDIO_KEY=

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=

# ── Server-only (Vercel Functions — never sent to the browser) ─────────────────

# Gemini — default AI model, no user key required
GEMINI_API_KEY=

# Same Firestore database ID as VITE_AI_STUDIO_KEY, used by the Admin SDK
FIRESTORE_DATABASE_ID=

# Firebase Admin SDK (from the service account JSON file)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# AES-256 key for encrypting user API keys (64 hex chars = 32 bytes)
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=
```

> **`FIREBASE_PRIVATE_KEY`** — paste the value with literal `\n` sequences (exactly as it appears in the downloaded JSON). Wrap the entire value in double quotes. The server converts them to real newlines automatically.

> **`VITE_AI_STUDIO_KEY` and `FIRESTORE_DATABASE_ID`** — must contain the exact same value: your Firestore database name. If you use the default Firestore database, set both to `(default)`.

### 3. Link to Vercel (first time only)

```bash
vercel link
```

Follow the prompts to link the project to your Vercel account.

### 4. Start the development server

```bash
vercel dev
```

This starts the full Vercel environment locally — both the Vite frontend and the Vercel Functions at `/api/*` — at `http://localhost:3000`.

> **Do not use `npm run dev`** for local testing. It starts only the Vite dev server without the Functions; all AI features will fail.

### 5. Firestore Security Rules

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

### 1. Import the repository on vercel.com

Connect your GitHub repo. Vercel will detect the `vercel.json` configuration automatically.

### 2. Add environment variables

In the Vercel dashboard → Project → Settings → Environment Variables, add every variable from `.env.local`. Apply each to **Production**, **Preview**, and **Development** environments.

Key points:
- All `VITE_*` variables must keep the `VITE_` prefix — Vite injects them at build time
- `GEMINI_API_KEY`, `FIREBASE_*`, `ENCRYPTION_KEY`, `FIRESTORE_DATABASE_ID` are server-only — no `VITE_` prefix
- `FIREBASE_PRIVATE_KEY` — paste **without** surrounding quotes, keeping literal `\n` sequences

### 3. Deploy

Vercel auto-deploys on every push to `master`. To deploy manually:

```bash
vercel --prod
```

---

## API Reference

### `POST /api/generate`

Generates a full tutorial with introduction, 5 steps, and a final project.

**Headers:**
```
Authorization: Bearer <Firebase ID token>
Content-Type: application/json
```

**Body:**
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
| `model` | string | `"gemini"` · `"claude"` · `"openai"` |
| `level` | string | `"beginner"` · `"intermediate"` · `"advanced"` |
| `language` | string | Language name for AI-generated content (e.g. `"Portuguese"`) |

Rate limit: **5 requests / minute** per IP.

---

### `POST /api/verify`

Semantically verifies a code submission against the challenge.

**Headers:**
```
Authorization: Bearer <Firebase ID token>
Content-Type: application/json
```

**Body:**
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

Encrypts and persists a user-provided API key. Only `anthropic` and `openai` are accepted; Gemini uses a system key.

**Headers:**
```
Authorization: Bearer <Firebase ID token>
Content-Type: application/json
```

**Body:**
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
npm test            # Run test suite once
npm run test:ui     # Open Vitest UI in the browser
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

## License

MIT
