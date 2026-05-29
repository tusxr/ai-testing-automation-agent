import React, { useContext, useState } from 'react'
import { UserRepo } from '@/types'
import Image from 'next/image'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion"
import { CheckCircle2, Globe2Icon, ListChecks, Loader2, Settings2Icon, Sparkles, TrendingUp, XCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from "@/components/ui/input"
import axios from 'axios'
import { UserDetailContext } from '@/context/UserDetailContext'
import TestCaseList from './TestCaseList'
import RepoSetting from './RepoSetting'

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
    // Map of repoId (string) -> TestCase[]
    const [testCaseMap, setTestCaseMap] = useState<Record<string, TestCase[]>>({});
    // Map of repoId (string) -> boolean (loading)
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
            await axios.put('/api/user-repo', {
                id,
                targetDomain: value
            });
            onRefreshRepos?.();
        } catch (e) {
            console.error('Failed to save target domain:', e);
        } finally {
            setSavingDomain(prev => ({ ...prev, [id]: false }));
        }
    }

    const handleGenerateTestCases = async (repo: UserRepo) => {
        setLoadingRepoId(repo.id);
        try {
            const result = await axios.post('/api/generate-test-cases', {
                userId: userDetail?.id,
                repoId: String(repo.repoId),
                owner: repo.owner,
                repo: repo.name,
                branch: repo.defaultBranch
            });
            // Refresh test cases after generation
            if (result.data?.success) {
                await fetchTestCases(String(repo.repoId));
            }
        } catch (e) {
            console.error("Error generating test cases:", e);
        } finally {
            setLoadingRepoId(null);
        }
    }

    const fetchTestCases = async (repoId: string) => {
        setLoadingMap(prev => ({ ...prev, [repoId]: true }));
        try {
            const result = await axios.get(`/api/test-cases?repoId=${repoId}&t=${Date.now()}`);
            setTestCaseMap(prev => ({ ...prev, [repoId]: result.data || [] }));
        } catch (e) {
            console.error("Error getting test cases:", e);
        } finally {
            setLoadingMap(prev => ({ ...prev, [repoId]: false }));
        }
    }

    const handleAccordionChange = (value: string) => {
        if (!value) return;
        fetchTestCases(value);
    }

    return (
        <div className='mt-6'>
            <h2 className='text-xl font-medium m-6'>Available Repositories</h2>
            <Accordion type="single" collapsible onValueChange={handleAccordionChange}>
                {repoList.map((repo) => {
                    const repoKey = String(repo.repoId);
                    const testCases = testCaseMap[repoKey] ?? [];
                    const loading = loadingMap[repoKey] ?? false;

                    const totalTests = testCases.length;
                    const passedTests = testCases.filter(tc => tc.status === 'passed').length;
                    const failedTests = testCases.filter(tc => tc.status === 'failed').length;
                    const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

                    return (
                        <AccordionItem key={repo.id} value={repoKey} className='border px-5 rounded-xl mb-2'>
                            <AccordionTrigger>
                                <div className="flex flex-center gap-5">
                                    <Image src={'/github.png'} alt='owner image' width={40} height={20} className='rounded-full' />
                                    <div className='flex flex-col items-start gap-1 text-xs'>
                                        <h2>{repo.fullName}</h2>
                                        <p className='text-xs text-gray-400'>
                                            {repo.defaultBranch} {' | '} {repo.language} {' | '} {repo.updatedAt}
                                        </p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="pt-4 space-y-5">
                                    <div className='bg-gray-50 p-3 border rounded-xl'>
                                        <div className='flex gap-3 items-center justify-between'>
                                            <div className='flex gap-3 items-center flex-1'>
                                                <Globe2Icon className='h-5 w-5 text-gray-500' />
                                                <h2 className='font-semibold text-sm shrink-0'>Target Domain</h2>
                                                <Input
                                                    value={domainInputs[repo.id] !== undefined ? domainInputs[repo.id] : (repo.targetDomain || '')}
                                                    placeholder='e.g., http://localhost:3000'
                                                    className='bg-white max-w-sm h-8 text-sm'
                                                    onChange={(e) => handleDomainChange(repo.id, e.target.value)}
                                                    disabled={savingDomain[repo.id]}
                                                />
                                                {(domainInputs[repo.id] !== undefined && domainInputs[repo.id] !== (repo.targetDomain || '')) && (
                                                    <Button
                                                        size='sm'
                                                        className='h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white'
                                                        onClick={() => saveDomain(repo.id)}
                                                        disabled={savingDomain[repo.id]}
                                                    >
                                                        {savingDomain[repo.id] ? 'Saving...' : 'Save'}
                                                    </Button>
                                                )}
                                            </div>
                                            {/* <button className='flex gap-3 items-center bg-black   hover:bg-black/80 text-white rounded-xl px-3 py-2 cursor-pointer'> <Settings2Icon className='h-4 w-4' />Project Config</button> */}
                                            <RepoSetting repo={repo} setReload={onRefreshRepos} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <StatusCard
                                            title="Total Tests"
                                            value={totalTests}
                                            icon={<ListChecks className="h-5 w-5 text-blue-600" />}
                                            bgColor="bg-blue-50"
                                        />
                                        <StatusCard
                                            title="Passed"
                                            value={passedTests}
                                            icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
                                            bgColor="bg-green-50"
                                        />
                                        <StatusCard
                                            title="Failed"
                                            value={failedTests}
                                            icon={<XCircle className="h-5 w-5 text-red-600" />}
                                            bgColor="bg-red-50"
                                        />
                                        <StatusCard
                                            title="Pass Rate"
                                            value={`${passRate}%`}
                                            icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
                                            bgColor="bg-purple-50"
                                        />
                                    </div>

                                    {loading && testCases.length === 0 && (
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <h2 className='font-medium text-green-600'>
                                                {loadingRepoId === repo.id
                                                    ? 'Please wait while generating test cases..'
                                                    : 'Please wait while loading test cases..'}
                                            </h2>
                                            <Loader2 className='h-4 w-4 animate-spin' />
                                        </div>
                                    )}

                                    {testCases.length > 0 && (
                                        <TestCaseList
                                            testCase={testCases}
                                            onReload={() => fetchTestCases(repoKey)}
                                            loading={loading}
                                            repository={repo}
                                        />
                                    )}

                                    {!loading && testCases.length === 0 && (
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border rounded-xl p-4 bg-gray-50">
                                            <div>
                                                <h3 className="font-medium">
                                                    {loadingRepoId === repo.id ? 'Generating Test Cases...' : 'Generate AI Test Cases'}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Analyze this repository and generate automated test cases using AI.
                                                </p>
                                            </div>
                                            <Button
                                                className="gap-2"
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
    bgColor,
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    bgColor: string;
}) {
    return (
        <div className="border rounded-xl p-4 flex items-center justify-between bg-white">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h3 className="text-2xl font-semibold mt-1">{value}</h3>
            </div>

            <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${bgColor}`}
            >
                {icon}
            </div>
        </div>
    );
}