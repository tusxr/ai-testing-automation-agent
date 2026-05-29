import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { SettingsIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TestCase } from './UserRepoList'
import axios from 'axios'

type Props = {
    tc?: TestCase
    onReload?: () => void
}

function TestCaseSettingDialog({ tc, onReload }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [formTestCase, setFormTestCase] = useState<Partial<TestCase>>({
        title: tc?.title || '',
        description: tc?.description || '',
        targetRoute: tc?.targetRoute || '',
        expectedResult: tc?.expectedResult || '',
    });

    const handleInputChange = (field: keyof TestCase, value: string) => {
        setFormTestCase(prev => ({ ...prev, [field]: value }));
    }

    const updateTestCase = async () => {
        if (!tc || isUpdating) return;
        setIsUpdating(true);
        try {
            const response = await axios.post('/api/test-cases/settings', {
                title: formTestCase.title,
                description: formTestCase.description,
                targetRoute: formTestCase.targetRoute,
                expectedResult: formTestCase.expectedResult,
                repoId: tc?.repoId,
                testCaseId: tc?.id
            });
            if (response.data.success) {
                setIsOpen(false);
                onReload?.();
            }
        } catch (error) {
            console.error("Failed to update test case:", error);
        } finally {
            setIsUpdating(false);
        }
    }

    // Sync form whenever the dialog opens or the tc prop changes
    useEffect(() => {
        if (isOpen && tc) {
            setFormTestCase({
                title: tc.title || '',
                description: tc.description || '',
                targetRoute: tc.targetRoute || '',
                expectedResult: tc.expectedResult || '',
            });
        }
    }, [isOpen, tc]);

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className='rounded-full bg-green-300 text-green-700 border-green-300 hover:bg-green-400 hover:text-green-800 hover:border-green-400' >
                        <SettingsIcon className='text-sm h-4 w-4 ' />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Testing Requirements</DialogTitle>
                        <DialogDescription>
                            Modifying these parameters clears pre-generated test cases.
                            You can run a quick AI-driven test case generation using the "Try it out" option at the bottom.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='my-3'>
                        <div className='mb-3'>
                            <Label>Test Title</Label>
                            <Input value={formTestCase.title ?? ''} placeholder='Test Title' className='mt-1' onChange={e => handleInputChange('title', e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <Label>Description</Label>
                            <Textarea value={formTestCase.description ?? ''} placeholder='Description' className='mt-1' onChange={e => handleInputChange('description', e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <Label>Target Route/Path</Label>
                            <Input value={formTestCase.targetRoute ?? ''} placeholder='/api/...' className='mt-1' onChange={e => handleInputChange('targetRoute', e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <Label>Expected Result</Label>
                            <Textarea value={formTestCase.expectedResult ?? ''} placeholder='Expected Result' className='mt-1' onChange={e => handleInputChange('expectedResult', e.target.value)} />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isUpdating}>Cancel</Button>
                        </DialogClose>
                        <Button onClick={updateTestCase} disabled={isUpdating}>
                            {isUpdating ? 'Updating...' : 'Update Case'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default TestCaseSettingDialog

