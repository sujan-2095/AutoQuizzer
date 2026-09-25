# AutoQuizzer - Architecture Documentation

## 1. Project Overview
**AutoQuizzer** (`ai-quiz-generator`) is a production-ready, full-stack quiz generation and assessment platform. It allows educators and students to:
- Generate quizzes automatically from custom topics or uploaded files (.txt, .pdf, .docx, .pptx/.ppsx) using Google Gemini AI (`gemini-3.5-flash`).
- Extract text client-side from PDFs (via PDF.js), Word documents (via Mammoth), and presentations (via JSZip).
- Summarize long context client-side using Hugging Face Transformers (`@xenova/transformers`).
- Attempt timed quizzes with instantaneous scoring, progress tracking, and detailed answer breakdowns.
- Download formatted quiz worksheets and answer keys as PDFs via `jsPDF`.
- Persist users and quizzes in a persistent SQLite database powered by `sql.js`.

---

## 2. System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Frontend (Port 3000)                 │
│  React 19 + TypeScript + Vite + Tailwind CDN           │
│  State: ThemeContext, AuthContext, Local Draft Storage │
│  Client AI: @xenova/transformers                       │
│  Client PDF: jsPDF + PDF.js + Mammoth                  │
└───────────────▲───────────────────────────────┬────────┘
                │ /api/ (Vite Proxy in dev)     │
                ▼                               ▼
┌────────────────────────────────────────────────────────┐
│                   Backend (Port 5000)                  │
│  Node.js ES Modules + Express 4                        │
│  Pattern: Route -> Controller -> Service -> Repository │
│  Database: SQLite via sql.js (data/autoquizzer.db)     │
│  AI Engine: @google/genai (Gemini 3.5 Flash)           │
│  Deployment: Render (Web Service + Persistent Disk)    │
└────────────────────────────────────────────────────────┘
```

---

## 3. Directory Structure

```
AutoQuizzer/
├── .env                              # Environment variables (GEMINI_API_KEY)
├── .gitignore                        # Git ignore patterns (includes data/*.db)
├── index.html                        # HTML root template (mounts /src/main.tsx)
├── package.json                      # NPM scripts & dependencies
├── package-lock.json                 # Lockfile
├── tsconfig.json                     # Path alias @/* -> ./src/*
├── vite.config.ts                    # Vite config (port 3000, proxy /api to 5000)
├── render.yaml                       # Cloud deployment configuration for Render
├── start.bat                         # Windows dual-startup script
│
├── data/                             # Dedicated database directory (gitignored)
│   └── autoquizzer.db                # SQLite database file
│
├── scripts/                          # Diagnostic & utility CLI scripts
│   ├── test-gemini.js                # Tests Gemini API connectivity and prompts
│   └── list-models.js                # Lists available Gemini models for API key
│
├── server/                           # Layered Express Backend
│   ├── config/
│   │   └── config.js                 # Environment configuration loader
│   ├── controllers/                  # HTTP Request / Response Handlers
│   │   ├── authController.js         # Register, login, and user lookup handlers
│   │   ├── quizController.js         # Quiz CRUD and score update handlers
│   │   └── geminiController.js       # AI generation request handler & error mapping
│   ├── services/                     # Business Logic Layer
│   │   ├── authService.js            # User business rules & validation
│   │   ├── quizService.js            # Quiz business rules & validation
│   │   ├── geminiService.js          # GoogleGenAI client & connectivity verification
│   │   └── ai/
│   │       ├── quizPrompt.js         # Prompt builder with difficulty & question rules
│   │       └── quizSchema.js         # Strict JSON schema for structured quiz output
│   ├── repositories/                 # Data Access Layer (Raw SQL Queries)
│   │   ├── userRepository.js         # SQLite queries for users table
│   │   └── quizRepository.js         # SQLite queries for quizzes table
│   ├── routes/                       # Express Route Endpoints
│   │   ├── auth.routes.js            # /api/auth routes
│   │   ├── quiz.routes.js            # /api/quiz routes
│   │   └── gemini.routes.js          # /api/gemini routes
│   ├── database/
│   │   ├── db.js                     # sql.js lifecycle, persistence & initialization
│   │   └── schema.sql                # Table definitions & indexes
│   └── index.js                      # Express entry point & static SPA server
│
└── src/                              # Feature-Sliced Frontend
    ├── app/
    │   ├── App.tsx                   # Top-level shell (Providers + Routes)
    │   └── routes.tsx                # Application screen router & navigation modals
    ├── assets/                       # Static media assets
    ├── components/                   # Shared Cross-Feature Components
    │   ├── ui/
    │   │   ├── Icons.tsx             # Centralized SVG icon components
    │   │   ├── LoadingSpinner.tsx    # Animated spinner with label
    │   │   ├── Modal.tsx             # Animated backdrop modal dialog
    │   │   └── ThemeToggle.tsx       # Sun/Moon mode toggle button
    │   └── layout/
    │       ├── Header.tsx            # Global sticky navbar
    │       ├── Footer.tsx            # Clean application footer
    │       └── WaveBackground.tsx    # Smooth animated SVG wave background
    ├── contexts/
    │   ├── ThemeContext.tsx          # Dark/Light theme state & localStorage sync
    │   └── AuthContext.tsx           # Authentication session state & methods
    ├── features/
    │   ├── auth/                     # Authentication Feature
    │   │   ├── pages/
    │   │   │   ├── LoginPage.tsx
    │   │   │   └── RegisterPage.tsx
    │   │   ├── services/
    │   │   │   └── authService.ts    # Frontend HTTP calls & sessionStorage
    │   │   └── types.ts              # User, AppState, AuthContextType
    │   ├── dashboard/                # Dashboard Feature
    │   │   ├── pages/
    │   │   │   └── Dashboard.tsx     # Quiz catalog and draft alert view
    │   │   ├── components/
    │   │   │   └── QuizCard.tsx      # Individual quiz card with actions
    │   │   └── types.ts              # DashboardProps
    │   ├── quiz/                     # Quiz Engine Feature
    │   │   ├── pages/
    │   │   │   ├── QuizCreator.tsx   # Quiz creation wizard
    │   │   │   ├── QuizTaker.tsx     # Timed interactive quiz player
    │   │   │   └── QuizResults.tsx   # Score summary and answer breakdown
    │   │   ├── components/
    │   │   │   ├── TopicInput.tsx
    │   │   │   ├── FileUploader.tsx
    │   │   │   ├── DifficultySelector.tsx
    │   │   │   ├── QuestionCountSelector.tsx
    │   │   │   ├── QuizTimer.tsx
    │   │   │   └── QuestionCard.tsx
    │   │   ├── hooks/
    │   │   │   ├── useQuizCreator.ts # Extraction, validation, draft recovery
    │   │   │   └── useQuizTimer.ts   # Countdown & stopwatch timer hooks
    │   │   ├── services/
    │   │   │   └── quizService.ts    # Frontend API calls to /api/quiz
    │   │   ├── utils/
    │   │   │   ├── quizScoring.ts    # Pure scoring & color utility functions
    │   │   │   ├── quizValidation.ts # Input & schema validation
    │   │   │   ├── quizDraftStorage.ts # localStorage draft storage
    │   │   │   ├── extractPdfText.ts # PDF.js client text extractor
    │   │   │   ├── extractDocxText.ts # Mammoth client text extractor
    │   │   │   └── extractPptxText.ts # JSZip presentation text extractor
    │   │   └── types.ts              # Quiz, Question, Difficulty, UserAnswer, Draft
    │   └── ai/                       # AI Client Feature
    │       ├── services/
    │       │   ├── geminiService.ts  # Frontend client for /api/gemini/generate
    │       │   └── summarizerService.ts # Client-side Hugging Face Transformers
    │       └── types.ts              # GenerationOptions, GeneratedQuizData
    ├── services/
    │   ├── apiClient.ts              # Unified fetch client with ApiError handling
    │   └── pdfService.ts             # jsPDF worksheet & answer key generator
    ├── types/
    │   └── api.ts                    # ApiResponse, HealthResponse transport types
    ├── styles/
    │   └── index.css                 # Base styles and font configurations
    └── main.tsx                      # Frontend entry mounting to DOM root
```

---

## 4. Key Request Flows

### A. Authentication Flow
```
LoginPage / RegisterPage
       │
       ▼
features/auth/services/authService.ts
       │
       ▼
services/apiClient.ts (POST /api/auth/login or /api/auth/register)
       │
       ▼
server/routes/auth.routes.js
       │
       ▼
server/controllers/authController.js
       │
       ▼
server/services/authService.js
       │
       ▼
server/repositories/userRepository.js
       │
       ▼
SQLite Database (`data/autoquizzer.db`)
```

### B. AI Quiz Generation Flow
```
QuizCreator (UI Wizard)
       │
       ▼
useQuizCreator hook (extracts text from PDF/DOCX if file upload)
       │
       ▼
features/ai/services/geminiService.ts
       │
       ▼
services/apiClient.ts (POST /api/gemini/generate)
       │
       ▼
server/routes/gemini.routes.js
       │
       ▼
server/controllers/geminiController.js
       │
       ▼
server/services/geminiService.js
       ├─► server/services/ai/quizPrompt.js (builds strict prompt)
       ├─► server/services/ai/quizSchema.js (enforces JSON output)
       └─► GoogleGenAI SDK (`gemini-3.5-flash`)
              │
              ▼
   Response validated & parsed
              │
              ▼
Quiz data returned to QuizCreator -> Saved to Database -> Modal prompt
```

### C. Quiz Persistence Flow
```
Dashboard / QuizCreator / QuizTaker
       │
       ▼
features/quiz/services/quizService.ts
       │
       ▼
services/apiClient.ts (GET, POST, PATCH, DELETE /api/quiz)
       │
       ▼
server/routes/quiz.routes.js
       │
       ▼
server/controllers/quizController.js
       │
       ▼
server/services/quizService.js
       │
       ▼
server/repositories/quizRepository.js
       │
       ▼
SQLite Database (`data/autoquizzer.db` via `sql.js`)
```

---

## 5. Storage Keys & Configuration Standards

| Target | Key / Setting | Purpose |
| :--- | :--- | :--- |
| `sessionStorage` | `autoquizzer_currentUser` | Holds the logged-in user JSON session |
| `localStorage` | `autoquizzer_theme` | Stores 'dark' or 'light' user preference |
| `localStorage` | `autoquizzer_quiz_draft` | Stores autosaved or manually saved quiz drafts |
| Environment | `GEMINI_API_KEY` | Server-only Google Gemini API key (never exposed to client) |
| Environment | `PORT` | Express backend port (defaults to 5000) |
| Environment | `DB_PATH` | Path to persistent SQLite DB (used on Render disk mount `/var/data/autoquizzer.db`) |
| Environment | `NODE_ENV` | Environment mode (`development` / `production`) |

---

## 6. Deployment Workflow (Render)

1. **Build Step**:
   `npm install && npm run build`  
   Builds the Vite production bundle into `dist/`.
2. **Start Step**:
   `npm start`  
   Runs `node server/index.js`, which serves the API on `/api/*` and serves `dist/index.html` as the catch-all SPA.
3. **Database Disk**:
   Mounted at `/var/data`. Environment variable `DB_PATH=/var/data/autoquizzer.db` preserves user data across deploys.
