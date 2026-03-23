# CodeQuest

An AI-powered interactive programming learning platform that generates progressive tutorials on demand. Built as a portfolio project to demonstrate modern frontend architecture with real-time AI integration.

---

## Features

- **AI-generated tutorials** — Enter any programming topic and get a 5-step structured tutorial with concepts, code examples, and hands-on challenges
- **Multi-model support** — Uses Google Gemini by default (system key); users can bring their own Anthropic or OpenAI API keys
- **Interactive code editor** — Monaco Editor (same engine as VS Code) for each challenge
- **Progress tracking** — Step completion saved in real-time via Firebase Firestore
- **Google Authentication** — Sign in with Google to save preferences and API keys

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript (strict) |
| Bundler | Vite |
| Routing | TanStack Router (file-based, typed) |
| Data fetching | TanStack Query |
| UI state | Zustand |
| Styling | TailwindCSS |
| Animations | Motion |
| Code editor | Monaco Editor |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| AI — default | Google Gemini (`@google/genai`) |
| AI — user keys | Anthropic Claude, OpenAI GPT-4o |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Authentication (Google provider) and Firestore enabled
- A Google Gemini API key

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd codequest

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
# Fill in your Firebase and Gemini keys in .env.local

# Start development server
npm run dev
```

### Environment Variables

```bash
VITE_GEMINI_API_KEY=your_gemini_key
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> User API keys for Claude and OpenAI are stored **exclusively in Firestore** — never in environment variables or localStorage.

---

## Architecture

```
src/
├── routes/          # TanStack Router file-based routes
├── queries/         # Reusable TanStack Query options
├── services/        # AI and Firestore service layer
├── hooks/           # useAuth, useProgressSync
├── stores/          # Zustand stores (editor state)
├── components/      # UI, layout, tutorial, editor components
├── types/           # Shared TypeScript interfaces
└── lib/             # Firebase, QueryClient, Router initialization
```

### AI Orchestration

The `aiService` tries the user's preferred model first, then silently falls back to Gemini (system key) if the user's key is missing or fails:

```
User preferred model (claude / openai)
  └─ key available? → call that SDK
  └─ key missing or error? → fallback to Gemini
```

---

## Security Notes

### Browser-side API calls (`dangerouslyAllowBrowser`)

Currently, calls to the Anthropic and OpenAI SDKs are made **directly from the browser** using the user's own API keys. Both SDKs require the `dangerouslyAllowBrowser: true` flag for this to work, as they default to blocking browser environments.

**Why this is a limitation:** The API key is passed in HTTP headers visible in the browser's DevTools network tab. A malicious extension or XSS attack could potentially intercept it.

**Planned improvement — Firebase Cloud Functions:**
The production-grade solution is to proxy these calls through a serverless backend:

```
Browser → POST /api/generate { topic, model } → Cloud Function
                                                    └─ reads apiKey from Firestore server-side
                                                    └─ calls Anthropic / OpenAI SDK
                                                    └─ returns Tutorial JSON
```

This way the API key never touches the browser after being saved. Implementation would involve:
1. A `functions/` directory with a `generateTutorial` Cloud Function
2. Firestore Security Rules to prevent client-side key reads
3. Replacing direct SDK calls in `claudeService.ts` / `openaiService.ts` with `httpsCallable` from `firebase/functions`

For this portfolio project, the current approach is acceptable since users are providing their own keys and the scope is demonstrating AI integration patterns.

---

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /progress/{tutorialId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

---

## License

MIT