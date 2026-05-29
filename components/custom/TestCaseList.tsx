import React, { useState } from 'react'
import { TestCase } from './UserRepoList'
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from '../ui/button'
import { Play, RefreshCw } from 'lucide-react'
import TestCaseSettingDialog from './TestCaseSettingDialog'
import TestExecutionModal from './TestCaseExecution'
import { toast } from 'sonner'

type Props = {
    testCase: TestCase[],
    onReload: () => void,
    loading?: boolean,
    repository?: any
}

function TestCaseList({ testCase, onReload, loading, repository }: Props) {
    const [selectedTestCases, setSelectedTestCases] = useState<TestCase[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSelectedTestCase = (tc: TestCase, checked: boolean) => {
        if (checked) {
            setSelectedTestCases((prev) => [...prev, tc]);
        } else {
            setSelectedTestCases((prev) => prev.filter((t: TestCase) => t.id !== tc.id));
        }
    }

    const handleSelectAll = () => {
        if (selectedTestCases.length === testCase.length) {
            setSelectedTestCases([]);
        } else {
            setSelectedTestCases([...testCase]);
        }
    }

    const handleRunSelected = () => {
        if (selectedTestCases.length === 0) return;
        setIsModalOpen(true);
        toast.info(`Running ${selectedTestCases.length} test${selectedTestCases.length > 1 ? 's' : ''}`, {
            description: 'Connecting to Browserbase cloud runner…'
        });
    }

    const allSelected = testCase.length > 0 && selectedTestCases.length === testCase.length;

    return (
        <div>
            {/* Header row */}
            <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-3'>
                    <h2 className='text-sm font-semibold text-foreground'>Generated Test Cases</h2>
                    <Badge variant='secondary' className='text-[10px] font-mono'>
                        {testCase.length}
                    </Badge>
                </div>
                <Button
                    size={'sm'}
                    variant={'ghost'}
                    onClick={() => onReload()}
                    disabled={loading}
                    className='text-muted-foreground hover:text-foreground h-8 px-2'
                >
                    <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Refreshing…' : 'Refresh'}
                </Button>
            </div>

            {/* Test case table */}
            <div className='border border-border rounded-xl overflow-hidden bg-card'>
                {/* Select all bar */}
                <div className='flex items-center gap-3 px-4 py-2.5 border-b border-border bg-muted/30'>
                    <Checkbox
                        checked={allSelected}
                        onCheckedChange={handleSelectAll}
                        className='border-border'
                        aria-label='Select all test cases'
                    />
                    <span className='text-xs text-muted-foreground'>
                        {selectedTestCases.length > 0
                            ? `${selectedTestCases.length} of ${testCase.length} selected`
                            : 'Select all'}
                    </span>
                </div>

                {testCase.map((tc, index) => (
                    <div key={tc.id ?? index} className='px-4 py-3.5 border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors'>
                        <div className='flex gap-3 items-start justify-between'>
                            <div className='flex gap-3 items-start flex-1 min-w-0'>
                                <Checkbox
                                    checked={selectedTestCases.some((t: TestCase) => t.id === tc.id)}
                                    onCheckedChange={(checked) => handleSelectedTestCase(tc, checked === true)}
                                    className='mt-0.5 border-border'
                                />
                                <div className='min-w-0'>
                                    <h3 className='text-sm font-medium text-foreground truncate'>{tc.title}</h3>
                                    <p className='text-xs text-muted-foreground mt-0.5 line-clamp-2'>{tc.description}</p>
                                </div>
                            </div>
                            <div className='flex gap-2 shrink-0 items-center'>
                                <Badge variant={'secondary'} className='text-[10px] font-mono capitalize'>
                                    {tc?.type}
                                </Badge>
                                {tc?.status === 'failed' && (
                                    <Badge variant={'destructive'} className='text-[10px] font-normal capitalize'>
                                        {tc?.status}
                                    </Badge>
                                )}
                                {tc?.status === 'passed' && (
                                    <Badge className='text-[10px] font-normal capitalize bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 hover:bg-emerald-100 border-none'>
                                        {tc?.status}
                                    </Badge>
                                )}
                                {(tc?.status === 'pending' || tc?.status === 'generated') && (
                                    <Badge variant={'secondary'} className='text-[10px] font-normal capitalize text-amber-600 dark:text-amber-400'>
                                        {tc?.status}
                                    </Badge>
                                )}
                                {tc?.status === 'running' && (
                                    <Badge className='text-[10px] font-normal capitalize bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 hover:bg-blue-100 border-none'>
                                        running
                                    </Badge>
                                )}
                                <TestCaseSettingDialog tc={tc} onReload={onReload} />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Action bar */}
                <div className='px-4 py-3 flex items-center justify-between border-t border-border bg-muted/20'>
                    <span className='text-xs text-muted-foreground'>
                        {selectedTestCases.length === 0 ? 'Select test cases to run' : `${selectedTestCases.length} test${selectedTestCases.length > 1 ? 's' : ''} selected`}
                    </span>
                    <Button
                        size={'sm'}
                        disabled={selectedTestCases?.length === 0}
                        onClick={handleRunSelected}
                        className='gap-1.5'
                    >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        Run Selected
                    </Button>
                </div>
            </div>

            <TestExecutionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    onReload();
                }}
                testCases={selectedTestCases}
                repository={repository}
            />
        </div>
    )
}

export default TestCaseList
