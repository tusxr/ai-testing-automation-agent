import { auth } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import {
  Github,
  Sparkles,
  Play,
  FileCode2,
  BarChart3,
  Workflow,
  Globe,
  ArrowRight,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Clock,
  Users,
  ChevronRight,
  Terminal,
  Cpu,
  Bug,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import ThemeToggle from '@/components/custom/ThemeToggle';

export const metadata = {
  title: 'Test Hive – AI-Powered Test Automation',
  description:
    'Connect your GitHub repository, generate AI test cases, convert them to Playwright scripts, and run them in the cloud. QA automation at the speed of AI.',
};

// ─────────────────────────────────────────────
// Feature cards data
// ─────────────────────────────────────────────
const features = [
  {
    icon: Github,
    title: 'GitHub Repository Analysis',
    description:
      'Connect any GitHub repo and let AI deeply analyze your codebase — routes, components, APIs — to understand what needs to be tested.',
    color: 'text-slate-700',
    bg: 'bg-slate-100',
  },
  {
    icon: Sparkles,
    title: 'AI Test Case Generation',
    description:
      'Gemini AI reads your source files and generates structured, meaningful QA test cases covering UI, auth, forms, edge cases, and more.',
    color: 'text-violet-700',
    bg: 'bg-violet-50',
  },
  {
    icon: FileCode2,
    title: 'Playwright Script Creation',
    description:
      'Every test case is automatically converted into a robust, resilient Playwright automation script — ready to run with zero manual effort.',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
  },
  {
    icon: Globe,
    title: 'Cloud Browser Execution',
    description:
      'Scripts are executed on real headless browsers in the cloud via Browserbase. No local setup, no infra, just results.',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
  },
  {
    icon: BarChart3,
    title: 'Test Reports & Live Logs',
    description:
      'View real-time execution logs, console output, pass/fail status, and session recordings for every test run.',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
  },
  {
    icon: Workflow,
    title: 'QA Workflow Automation',
    description:
      'Manage repos, configure global instructions, select test subsets, and run them in batches — all from one clean dashboard.',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
  },
];

// ─────────────────────────────────────────────
// How it works steps
// ─────────────────────────────────────────────
const steps = [
  {
    step: '01',
    icon: Github,
    title: 'Connect GitHub',
    description: 'OAuth connect your GitHub account with a single click to grant read access to your repositories.',
  },
  {
    step: '02',
    icon: Cpu,
    title: 'Select a Repository',
    description: 'Choose from all your GitHub repos. The AI will pull the file tree and source code automatically.',
  },
  {
    step: '03',
    icon: Sparkles,
    title: 'Generate Test Cases',
    description: 'Click "Generate" and watch AI produce structured QA test cases tailored to your actual codebase.',
  },
  {
    step: '04',
    icon: Play,
    title: 'Run Tests in Cloud',
    description: 'Select test cases, click Run, and AI converts them to Playwright scripts and executes them via Browserbase.',
  },
  {
    step: '05',
    icon: BarChart3,
    title: 'Review Results',
    description: 'See live logs, pass/fail status, and a session recording link for every test run — all in one place.',
  },
];

// ─────────────────────────────────────────────
// Benefits
// ─────────────────────────────────────────────
const benefits = [
  {
    icon: Clock,
    title: 'Save Weeks of QA Time',
    description: 'What used to take a QA engineer days to set up runs in minutes. Focus on building, not writing test boilerplate.',
  },
  {
    icon: Bug,
    title: 'Catch Bugs Before Users Do',
    description: 'Automated tests run on real browsers catch regressions, broken flows, and UI issues before they reach production.',
  },
  {
    icon: Zap,
    title: 'Zero Manual Test Writing',
    description: 'No more hand-writing Playwright scripts. AI reads your code and generates them with proper selectors and assertions.',
  },
  {
    icon: Users,
    title: 'Built for Every Team',
    description: 'Whether you\'re a solo founder, a QA team, or a dev shop — AI-powered testing scales to fit your workflow.',
  },
  {
    icon: ShieldCheck,
    title: 'Resilient & Selector-Safe',
    description: 'Scripts use flexible text-matching, retry logic, and smart waits so tests don\'t break on minor UI changes.',
  },
  {
    icon: Terminal,
    title: 'Full Observability',
    description: 'Every run produces a detailed log trail — browser console, system events, and errors — so debugging is effortless.',
  },
];

// ─────────────────────────────────────────────
// Page Component (Server Component)
// ─────────────────────────────────────────────
export default async function HomePage() {
  const { userId } = await auth();
  const isLoggedIn = !!userId;

  const dashboardHref = '/workspace';
  const signInHref = '/sign-in';
  const signUpHref = '/sign-up';

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">

      {/* ─── NAVBAR ─────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <span className="text-xl font-extrabold tracking-tight text-foreground">Test Hive.</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">How it Works</a>
            <a href="#benefits" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Benefits</a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isLoggedIn ? (
              <>
                <Link href={dashboardHref}>
                  <Button size="sm" className="gap-1.5">
                    Open Dashboard <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <div className='h-5 w-px bg-border' />
                <UserButton
                  appearance={{ elements: { avatarBox: 'h-8 w-8' } }}
                />
              </>
            ) : (
              <>
                <Link href={signInHref}>
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Sign In</Button>
                </Link>
                <Link href={signUpHref}>
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ─── HERO ───────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* subtle grid bg */}
        <div
          className="absolute inset-0 -z-10 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgb(203 213 225) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* glow blobs */}
        <div className="absolute -top-40 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-violet-100 to-blue-100 opacity-60 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8">
          <div className="flex flex-col items-center text-center">

            <Badge className="mb-6 gap-1.5 border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-none hover:bg-muted animate-fade-up">
              <Sparkles className="h-3 w-3 text-violet-600" />
              Powered by Gemini AI &amp; Browserbase
            </Badge>

            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-fade-up animation-delay-100">
              Ship with confidence using{' '}
              <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                AI-driven QA automation
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg animate-fade-up animation-delay-200">
              Connect your GitHub repository, let AI analyze the codebase, generate complete QA test cases,
              auto-convert them to Playwright scripts, and execute them on real cloud browsers — all in one dashboard.
            </p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4 animate-fade-up animation-delay-300">
              {isLoggedIn ? (
                <Link href={dashboardHref}>
                  <Button size="lg" className="h-12 gap-2 px-7 text-base shadow-md">
                    <Play className="h-4 w-4 fill-current" />
                    Open Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href={signUpHref}>
                    <Button size="lg" className="h-12 gap-2 px-7 text-base shadow-md">
                      <Sparkles className="h-4 w-4" />
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href={signInHref}>
                    <Button variant="outline" size="lg" className="h-12 gap-2 px-7 text-base">
                      View Dashboard
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* ── Dashboard Mockup ── */}
            <div className="mt-16 w-full max-w-5xl animate-scale-in animation-delay-500">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/10">
                {/* Window chrome bar */}
                <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <div className="ml-3 h-5 flex-1 rounded bg-muted text-center text-xs leading-5 text-muted-foreground">
                    qa-autopilot.app/workspace
                  </div>
                </div>
                {/* Mock dashboard body */}
                <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  {/* Sidebar */}
                  <div className="bg-muted/30 p-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Repositories</p>
                    {['my-saas-app', 'api-backend', 'marketing-site'].map((repo, i) => (
                      <div
                        key={repo}
                        className={`mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${i === 0 ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted'}`}
                      >
                        <Github className="h-4 w-4 shrink-0" />
                        <span className="truncate font-medium">{repo}</span>
                      </div>
                    ))}
                  </div>
                  {/* Test cases list */}
                  <div className="col-span-2 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">Generated Test Cases</p>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">8 tests</span>
                    </div>
                    {[
                      { title: 'User Sign-In Flow', type: 'auth', status: 'passed' },
                      { title: 'Dashboard Data Load', type: 'ui', status: 'passed' },
                      { title: 'Form Submission Validation', type: 'form', status: 'running' },
                      { title: 'API Error Handling', type: 'api', status: 'pending' },
                    ].map((tc) => (
                      <div key={tc.title} className="mb-2 flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className={`h-4 w-4 shrink-0 ${tc.status === 'passed' ? 'text-emerald-500' : tc.status === 'running' ? 'text-amber-500' : 'text-muted-foreground/40'}`} />
                          <span className="font-medium text-foreground">{tc.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">{tc.type}</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${tc.status === 'passed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : tc.status === 'running' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-muted text-muted-foreground'}`}>
                            {tc.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ───────────────────────────── */}
      <section id="features" className="bg-muted/40 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center animate-fade-up">
            <Badge className="mb-4 border-border bg-background text-muted-foreground shadow-none">Features</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to automate QA
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
              From codebase analysis to cloud test execution — the full pipeline, powered by AI.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              const delays = ['', 'animation-delay-100', 'animation-delay-200', 'animation-delay-300', 'animation-delay-400', 'animation-delay-500'];
              return (
                <Card key={f.title} className={`group border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md animate-fade-up ${delays[i] || ''}`}>
                  <CardContent className="p-6">
                    <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${f.bg}`}>
                      <Icon className={`h-5 w-5 ${f.color}`} />
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-foreground">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────── */}
      <section id="how-it-works" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center animate-fade-up">
            <Badge className="mb-4 border-border bg-muted/50 text-muted-foreground shadow-none">How It Works</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              From repository to results in minutes
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
              A simple five-step workflow that takes you from zero to fully automated QA.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line — hidden on mobile */}
            <div className="absolute left-1/2 top-8 hidden h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent lg:block" />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const delays = ['', 'animation-delay-100', 'animation-delay-200', 'animation-delay-300', 'animation-delay-400'];
                return (
                  <div key={step.step} className={`relative flex flex-col items-center text-center animate-fade-up ${delays[idx] || ''}`}>
                    <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-border bg-card shadow-md transition-transform duration-200 hover:scale-105">
                      <Icon className="h-6 w-6 text-foreground" />
                      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                        {idx + 1}
                      </span>
                    </div>
                    <h3 className="mb-1.5 text-sm font-semibold text-foreground">{step.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── BENEFITS ───────────────────────────── */}
      <section id="benefits" className="bg-gradient-to-b from-muted/40 to-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center animate-fade-up">
            <Badge className="mb-4 border-border bg-background text-muted-foreground shadow-none">Benefits</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why teams choose QA Autopilot
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
              Faster releases, fewer bugs, and no more manual test scripting.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              const delays = ['', 'animation-delay-100', 'animation-delay-200', 'animation-delay-300', 'animation-delay-400', 'animation-delay-500'];
              return (
                <div key={b.title} className={`flex gap-4 rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow duration-200 animate-fade-up ${delays[i] || ''}`}>
                  <div className="shrink-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-4 w-4 text-foreground" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">{b.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{b.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ──────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 dark:bg-slate-800 px-8 py-14 text-center shadow-2xl animate-scale-in sm:px-14">
            {/* subtle glow */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-900/40 via-transparent to-blue-900/40" />

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-4 py-1.5 text-xs font-medium text-slate-300">
              <Sparkles className="h-3 w-3 text-violet-400" />
              AI-Powered QA — No credit card required
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl animate-fade-up animation-delay-100">
              Start automating your tests today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-400 animate-fade-up animation-delay-200">
              Connect your GitHub repository, generate AI test cases, and run them in cloud browsers — all within minutes.
              No DevOps knowledge or Playwright experience needed.
            </p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4 animate-fade-up animation-delay-300">
              {isLoggedIn ? (
                <Link href={dashboardHref}>
                  <Button
                    size="lg"
                    className="h-12 gap-2 bg-white px-8 text-base font-semibold text-slate-900 shadow-md hover:bg-slate-100"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href={signUpHref}>
                    <Button
                      size="lg"
                      className="h-12 gap-2 bg-white px-8 text-base font-semibold text-slate-900 shadow-md hover:bg-slate-100"
                    >
                      <Sparkles className="h-4 w-4 text-violet-600" />
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href={signInHref}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-12 gap-2 border-slate-600 bg-transparent px-8 text-base text-white hover:bg-slate-800"
                    >
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
              {['Free to get started', 'GitHub OAuth', 'Cloud browser execution', 'No local setup'].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────── */}
      <footer className="border-t border-border bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            Made with ❤️ by{' '}
            <a
              href="https://github.com/tusxr"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors"
            >
              tusxr
            </a>
          </p>
        </div>
      </footer>

    </div>
  );
}
