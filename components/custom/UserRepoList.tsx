import React, { useContext, useState } from 'react'
import { UserRepo } from '@/types'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion"
import {
    CheckCircle2,
    Globe2Icon,
    ListChecks,
    Loader2,
    Settings2Icon,
    Sparkles,
    TrendingUp,
    XCircle,
    GitBranch,
    Calendar,
    Code2,
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import axios from 'axios'
import { UserDetailContext } from '@/context/UserDetailContext'
import TestCaseList from './TestCaseList'
import RepoSetting from './RepoSetting'
import { toast } from 'sonner'

type props = {
    repoList: UserRepo[];
    onRefreshRepos?: () => void;
}

export type TestCase = {
    id: number;
    title: string;
    description: string;
    type: string;
    priority: string;
    repoId: string | null;
    repoName: string;
    repoOwner: string;
    branch: string | null;
    targetRoute: string | null;
    targetFiles: string[];
    expectedResult: string | null;
    status: string | null;
    createdAt: string | null;
    targetDomain: string | null;
    browserbaseScript?: string | null;
    logs?: string[] | null;
    sessionId?: string | null;
    sessionUrl?: string | null;
}

function UserRepoList({ repoList, onRefreshRepos }: props) {
    const { userDetail } = useContext(UserDetailContext);
    const [loadingRepoId, setLoadingRepoId] = useState<number | null>(null);
    const [testCaseMap, setTestCaseMap] = useState<Record<string, TestCase[]>>({});
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
    const [domainInputs, setDomainInputs] = useState<Record<number, string>>({});
    const [savingDomain, setSavingDomain] = useState<Record<number, boolean>>({});

    const handleDomainChange = (id: number, value: string) => {
        setDomainInputs(prev => ({ ...prev, [id]: value }));
    }

    const saveDomain = async (id: number) => {
        const value = domainInputs[id];
        if (value === undefined) return;
        setSavingDomain(prev => ({ ...prev, [id]: true }));
        try {
            await axios.put('/api/user-repo', { id, targetDomain: value });
            onRefreshRepos?.();
            toast.success('Target domain saved');
        } catch {
            toast.error('Failed to save target domain');
        } finally {
            setSavingDomain(prev => ({ ...prev, [id]: false }));
        }
    }

    const handleGenerateTestCases = async (repo: UserRepo) => {
        setLoadingRepoId(repo.id);
        const toastId = toast.loading('Generating AI test cases…', { description: repo.fullName });
        try {
            const result = await axios.post('/api/generate-test-cases', {
                userId: userDetail?.id,
                repoId: String(repo.repoId),
                owner: repo.owner,
                repo: repo.name,
                branch: repo.defaultBranch
            });
            if (result.data?.success) {
                await fetchTestCases(String(repo.repoId));
                toast.success('Test cases generated', {
                    id: toastId,
                    description: `${repo.fullName} — ready to run`
                });
            }
        } catch {
            toast.error('Failed to generate test cases', { id: toastId });
        } finally {
            setLoadingRepoId(null);
        }
    }

    const fetchTestCases = async (repoId: string) => {
        setLoadingMap(prev => ({ ...prev, [repoId]: true }));
        try {
            const result = await axios.get(`/api/test-cases?repoId=${repoId}&t=${Date.now()}`);
            setTestCaseMap(prev => ({ ...prev, [repoId]: result.data || [] }));
        } catch {
            toast.error('Failed to load test cases');
        } finally {
            setLoadingMap(prev => ({ ...prev, [repoId]: false }));
        }
    }

    const handleAccordionChange = (value: string) => {
        if (!value) return;
        fetchTestCases(value);
    }

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <h2 className='text-base font-semibold text-foreground'>Connected Repositories</h2>
                <Badge variant='secondary' className='font-mono text-xs'>
                    {repoList.length} {repoList.length === 1 ? 'repo' : 'repos'}
                </Badge>
            </div>

            <Accordion type="single" collapsible onValueChange={handleAccordionChange} className='space-y-2'>
                {repoList.map((repo) => {
                    const repoKey = String(repo.repoId);
                    const testCases = testCaseMap[repoKey] ?? [];
                    const loading = loadingMap[repoKey] ?? false;
                    const totalTests = testCases.length;
                    const passedTests = testCases.filter(tc => tc.status === 'passed').length;
                    const failedTests = testCases.filter(tc => tc.status === 'failed').length;
                    const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

                    return (
                        <AccordionItem
                            key={repo.id}
                            value={repoKey}
                            className='border border-border rounded-xl bg-card px-5 shadow-sm data-[state=open]:shadow-md transition-shadow'
                        >
                            <AccordionTrigger className='hover:no-underline py-4'>
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-100 shrink-0'>
                                        <Code2 className='h-4 w-4 text-white dark:text-slate-900' />
                                    </div>
                                    <div className='flex flex-col items-start gap-0.5 min-w-0'>
                                        <h3 className='text-sm font-semibold text-foreground truncate'>{repo.fullName}</h3>
                                        <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                                            {repo.defaultBranch && (
                                                <span className='flex items-center gap-1'>
                                                    <GitBranch className='h-3 w-3' />
                                                    {repo.defaultBranch}
                                                </span>
                                            )}
                                            {repo.language && (
                                                <span>{repo.language}</span>
                                            )}
                                            {repo.updatedAt && (
                                                <span className='flex items-center gap-1 hidden sm:flex'>
                                                    <Calendar className='h-3 w-3' />
                                                    {repo.updatedAt}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {/* Quick stats */}
                                    {totalTests > 0 && (
                                        <div className='ml-auto mr-4 hidden sm:flex items-center gap-2 shrink-0'>
                                            <Badge variant='secondary' className='text-[10px] font-mono'>
                                                {totalTests} tests
                                            </Badge>
                                            {passedTests > 0 && (
                                                <Badge className='text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 hover:bg-emerald-100 border-none'>
                                                    {passedTests} passed
                                                </Badge>
                                            )}
                                            {failedTests > 0 && (
                                                <Badge className='text-[10px] bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 hover:bg-red-100 border-none'>
                                                    {failedTests} failed
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </AccordionTrigger>

                            <AccordionContent>
                                <div className="pt-2 pb-4 space-y-5">
                                    {/* Target Domain + Settings Row */}
                                    <div className='flex gap-3 items-center justify-between p-3 rounded-xl bg-muted/50 border border-border'>
                                        <div className='flex gap-2.5 items-center flex-1 min-w-0'>
                                            <Globe2Icon className='h-4 w-4 text-muted-foreground shrink-0' />
                                            <span className='text-xs font-semibold text-foreground shrink-0'>Target URL</span>
                                            <Input
                                                value={domainInputs[repo.id] !== undefined ? domainInputs[repo.id] : (repo.targetDomain || '')}
                                                placeholder='e.g., http://localhost:3000'
                                                className='h-8 text-xs bg-background max-w-xs'
                                                onChange={(e) => handleDomainChange(repo.id, e.target.value)}
                                                disabled={savingDomain[repo.id]}
                                            />
                                            {(domainInputs[repo.id] !== undefined && domainInputs[repo.id] !== (repo.targetDomain || '')) && (
                                                <Button
                                                    size='sm'
                                                    className='h-8 px-3 text-xs'
                                                    onClick={() => saveDomain(repo.id)}
                                                    disabled={savingDomain[repo.id]}
                                                >
                                                    {savingDomain[repo.id] ? (
                                                        <><Loader2 className='h-3 w-3 animate-spin mr-1' />Saving</>
                                                    ) : 'Save'}
                                                </Button>
                                            )}
                                        </div>
                                        <RepoSetting repo={repo} setReload={onRefreshRepos} />
                                    </div>

                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <StatusCard
                                            title="Total Tests"
                                            value={totalTests}
                                            icon={<ListChecks className="h-4 w-4 text-blue-600" />}
                                            accent="bg-blue-100 dark:bg-blue-950/60"
                                        />
                                        <StatusCard
                                            title="Passed"
                                            value={passedTests}
                                            icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                                            accent="bg-emerald-100 dark:bg-emerald-950/60"
                                        />
                                        <StatusCard
                                            title="Failed"
                                            value={failedTests}
                                            icon={<XCircle className="h-4 w-4 text-red-600" />}
                                            accent="bg-red-100 dark:bg-red-950/60"
                                        />
                                        <StatusCard
                                            title="Pass Rate"
                                            value={`${passRate}%`}
                                            icon={<TrendingUp className="h-4 w-4 text-violet-600" />}
                                            accent="bg-violet-100 dark:bg-violet-950/60"
                                        />
                                    </div>

                                    {/* Loading state */}
                                    {loading && testCases.length === 0 && (
                                        <div className="flex items-center gap-2.5 py-4 text-sm text-muted-foreground">
                                            <Loader2 className='h-4 w-4 animate-spin text-primary' />
                                            <span>
                                                {loadingRepoId === repo.id
                                                    ? 'Generating test cases with AI…'
                                                    : 'Loading test cases…'}
                                            </span>
                                        </div>
                                    )}

                                    {/* Test case list */}
                                    {testCases.length > 0 && (
                                        <TestCaseList
                                            testCase={testCases}
                                            onReload={() => fetchTestCases(repoKey)}
                                            loading={loading}
                                            repository={repo}
                                        />
                                    )}

                                    {/* Generate CTA */}
                                    {!loading && testCases.length === 0 && (
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border rounded-xl p-4 bg-muted/30">
                                            <div>
                                                <h3 className="text-sm font-semibold text-foreground">
                                                    {loadingRepoId === repo.id ? 'Generating Test Cases…' : 'Generate AI Test Cases'}
                                                </h3>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Analyze this repository and generate comprehensive test cases using Gemini AI.
                                                </p>
                                            </div>
                                            <Button
                                                className="gap-2 shrink-0"
                                                disabled={loadingRepoId === repo.id}
                                                onClick={() => handleGenerateTestCases(repo)}
                                            >
                                                {loadingRepoId === repo.id
                                                    ? <Loader2 className='h-4 w-4 animate-spin' />
                                                    : <Sparkles className="h-4 w-4" />
                                                }
                                                Generate Test Cases
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    )
}

export default UserRepoList

function StatusCard({
    title,
    value,
    icon,
    accent,
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    accent: string;
}) {
    return (
        <div className="border border-border rounded-xl p-3.5 flex items-center justify-between bg-card">
            <div>
                <p className="text-xs text-muted-foreground">{title}</p>
                <h3 className="text-xl font-bold text-foreground mt-0.5">{value}</h3>
            </div>
            <div className={`h-9 w-9 rounded-full flex items-center justify-center ${accent}`}>
                {icon}
            </div>
        </div>
    );
}