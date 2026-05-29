# Test Hive. 🐝

> **AI-Powered QA Test Automation** — Connect your GitHub repo, generate test cases with Gemini AI, convert them to Playwright scripts, and run them on real cloud browsers via Browserbase.

🔗 **Live Demo:** [ai-testing-automation-agent-virid.vercel.app](https://ai-testing-automation-agent-virid.vercel.app)

---

## What is Test Hive?

Test Hive is an intelligent QA automation platform that eliminates the need to manually write end-to-end tests. Simply connect your GitHub repository, and the platform's AI engine analyzes your entire codebase — routes, components, APIs, and business logic — to generate structured, meaningful test cases. These test cases are then automatically converted into Playwright automation scripts and executed on real headless browsers in the cloud.

No Playwright knowledge required. No local browser setup. No DevOps expertise needed.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔗 **GitHub Integration** | OAuth-based connection to any public or private GitHub repository |
| 🤖 **AI Test Case Generation** | Gemini AI analyzes your source code and generates comprehensive test cases covering UI, auth, forms, APIs, and edge cases |
| 📝 **Playwright Script Creation** | Each test case is auto-converted into a resilient Playwright script with smart selectors, retry logic, and proper waits |
| ☁️ **Cloud Browser Execution** | Scripts run on real headless Chromium browsers via Browserbase — no local setup required |
| 📊 **Live Logs & Results** | Real-time console output, pass/fail status, and Browserbase session recording links per test run |
| ⚙️ **Project Configuration** | Set target domain URLs and global test instructions (e.g. login credentials) per repository |
| 🌗 **Dark / Light Mode** | Full system-aware theme toggle across the entire app |
| 🔔 **Toast Notifications** | Real-time feedback for every async action |
| 🔒 **Auth Protected** | Clerk authentication protects all workspace routes |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) |
| **Authentication** | [Clerk](https://clerk.com/) |
| **Database** | PostgreSQL via [Drizzle ORM](https://orm.drizzle.team/) + [Neon](https://neon.tech/) |
| **AI** | [Google Gemini AI](https://ai.google.dev/) (`gemini-1.5-flash`) |
| **Browser Automation** | [Playwright](https://playwright.dev/) |
| **Cloud Browser** | [Browserbase](https://browserbase.com/) |
| **GitHub API** | REST API via OAuth token |
| **Deployment** | [Vercel](https://vercel.com/) |
| **Toasts** | [Sonner](https://sonner.emilkowal.ski/) |
| **Theme** | [next-themes](https://github.com/pacocoursey/next-themes) |

---

## 📸 Screenshots

### Landing Page
The polished homepage with animated hero, features, how-it-works steps, and benefits sections.

### Workspace Dashboard
- Connected GitHub repositories in an accordion layout
- Per-repo stats: total tests, passed, failed, pass rate
- Inline target domain configuration
- AI test case generation with loading state
- Test case list with select-all, run-selected, and live status badges

### Test Execution Modal
- Browserbase cloud runner panel
- Execution queue with per-test status indicators
- Live console logs streamed in real time
- Generated Playwright script viewer
- Session recording links

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (Neon recommended)
- A GitHub OAuth App
- A Google AI Studio API key (Gemini)
- A Browserbase account + API key
- A Clerk account

### 1. Clone the repository

```bash
git clone https://github.com/tusxr/ai-testing-automation-agent.git
cd ai-testing-automation-agent
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file at the project root:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://...

# GitHub OAuth App
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:3000/api/github/callback

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Browserbase
BROWSERBASE_API_KEY=your_browserbase_api_key
BROWSERBASE_PROJECT_ID=your_browserbase_project_id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Push the database schema

```bash
npx drizzle-kit push
```

### 5. Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers) → OAuth Apps → New OAuth App
2. Set **Homepage URL** to `http://localhost:3000`
3. Set **Authorization callback URL** to `http://localhost:3000/api/github/callback`
4. Copy the **Client ID** and generate a **Client Secret**
5. Add both to your `.env` file

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗂 Project Structure

```
ai-testing-automation-agent/
├── app/
│   ├── api/
│   │   ├── github/              # GitHub OAuth + repo + user endpoints
│   │   ├── generate-test-cases/ # Gemini AI test case generation
│   │   ├── test-cases/          # CRUD + run test cases
│   │   └── user-repo/           # User repository management
│   ├── sign-in/                 # Clerk sign-in page
│   ├── sign-up/                 # Clerk sign-up page
│   ├── workspace/               # Protected dashboard page
│   ├── globals.css              # Global styles + animation utilities
│   ├── layout.tsx               # Root layout (ThemeProvider, Toaster)
│   └── page.tsx                 # Public landing page
├── components/
│   └── custom/
│       ├── EmptyWorkspace.tsx       # Empty state when no repos added
│       ├── RepoDialog.tsx           # Add repository dialog
│       ├── RepoSetting.tsx          # Per-repo config dialog
│       ├── TestCaseExecution.tsx    # Browserbase cloud runner modal
│       ├── TestCaseList.tsx         # Test case table with run controls
│       ├── TestCaseSettingDialog.tsx # Edit individual test case
│       ├── ThemeToggle.tsx          # Dark/light mode toggle button
│       ├── UserRepoList.tsx         # Accordion repo list with stats
│       ├── WorkspaceBody.tsx        # Main dashboard body
│       └── WorkspaceHeader.tsx      # Sticky dashboard navigation
├── context/
│   └── UserDetailContext.tsx    # User session context
├── db/
│   └── schema.ts                # Drizzle ORM table definitions
├── types/
│   └── index.ts                 # Shared TypeScript types
├── next.config.ts               # Next.js config (image domains, etc.)
└── middleware.ts                # Clerk auth middleware
```

---

## 🔄 How It Works

```
1. Sign in with Clerk
       ↓
2. Connect GitHub via OAuth
       ↓
3. Add a repository from your GitHub account
       ↓
4. Click "Generate Test Cases"
   → Gemini AI reads your file tree + source code
   → Returns structured test cases (title, description, type, target route, expected result)
       ↓
5. Review & edit test cases in the dashboard
       ↓
6. Select test cases → Click "Run Selected"
   → AI generates a Playwright script per test case
   → Script is executed on a cloud Chromium browser via Browserbase
   → Live logs streamed to the UI
       ↓
7. View results: passed ✅ / failed ❌ + session recording link
```

---

## 🌐 Deployment

The project is deployed on **Vercel**. To deploy your own instance:

1. Fork the repository
2. Import into [Vercel](https://vercel.com/)
3. Add all environment variables from the `.env` section above
4. Update `GITHUB_REDIRECT_URI` to your production URL:
   ```
   GITHUB_REDIRECT_URI=https://your-app.vercel.app/api/github/callback
   ```
5. Deploy — Vercel handles the build automatically

---

## 🧩 Key API Routes

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/github` | Initiate GitHub OAuth flow |
| `GET` | `/api/github/callback` | Handle OAuth callback, store token |
| `GET` | `/api/github/token` | Retrieve stored GitHub token |
| `GET` | `/api/github/repo` | List authenticated user's GitHub repos |
| `GET` | `/api/github/user` | Get connected GitHub account info |
| `GET/POST` | `/api/user-repo` | List / add repos to workspace |
| `POST` | `/api/user-repo/settings` | Update repo config (domain, instructions) |
| `POST` | `/api/generate-test-cases` | Generate AI test cases for a repo |
| `GET` | `/api/test-cases` | Fetch test cases for a repo |
| `POST` | `/api/test-cases/run` | Generate Playwright script + execute via Browserbase |
| `POST` | `/api/test-cases/settings` | Update a test case |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

1. Fork the project
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ by <a href="https://github.com/tusxr">tusxr</a></p>
