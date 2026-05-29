import React, { useState } from 'react'
import { TestCase } from './UserRepoList'
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from '../ui/button'
import { Play, RefreshCw, SettingsIcon } from 'lucide-react'
import TestCaseSettingDialog from './TestCaseSettingDialog'

type Props = {
    testCase: TestCase[],
    onReload: () => void,
    loading?: boolean
}

function TestCaseList({ testCase, onReload, loading }: Props) {
    const [selectedTestCases, setSelectedTestCases] = useState<TestCase[]>([]);
    const handleSelectedTestCase = (tc: TestCase, checked: boolean) => {
        if (checked) {
            setSelectedTestCases((prev) => [...prev, tc]);
        } else {
            setSelectedTestCases((prev) => prev.filter((t: TestCase) => t.id !== tc.id));
        }
    }


    return (
        <div>
            <div className='flex items-center justify-between mb-4'>
                <h2 className='font-semibold text-lg mb-3'>Generated Test Cases</h2>
                <Button
                    size={'sm'}
                    variant={'outline'}
                    onClick={() => onReload()}
                    disabled={loading}
                >
                    <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Refreshing...' : 'Refresh'}
                </Button>
            </div>
            <div className='border rounded-md'>
                {testCase.map((tc, index) => (
                    <div key={index} className='p-4 border-b last:border-b-0'>
                        <div className='flex gap-3 items-center justify-between'>
                            <div className='flex gap-3 items-center'>
                                <Checkbox checked={selectedTestCases.some((t: TestCase) => t.id === tc.id)} onCheckedChange={(checked) => handleSelectedTestCase(tc, checked === true)} />
                                <div>
                                    <h2>{tc.title}</h2>
                                    <p className='text-xs text-gray-500'>{tc.description}</p>
                                </div>
                            </div>
                            <div className='flex gap-2 shrink-0'>
                                <Badge variant={'secondary'}>{tc?.type}</Badge>
                                <Badge variant={'secondary'}>Pending</Badge>
                                <TestCaseSettingDialog tc={tc} onReload={onReload} />
                            </div>
                        </div>
                    </div>
                ))}
                <div>
                    <div className='p-4 flex items-center justify-end gap-2'>
                        <Button disabled={selectedTestCases?.length === 0}>
                            <Play className="mr-2 h-4 w-4" />
                            Run Selected Test Cases
                        </Button></div>
                </div>
            </div>
        </div>
    )
}

export default TestCaseList
