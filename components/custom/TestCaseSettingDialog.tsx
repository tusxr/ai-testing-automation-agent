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
import { Settings2Icon, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TestCase } from './UserRepoList'
import axios from 'axios'
import { toast } from 'sonner'

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
        const toastId = toast.loading('Updating test case…');
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
                toast.success('Test case updated', { id: toastId });
                setIsOpen(false);
                onReload?.();
            } else {
                toast.error('Failed to update test case', { id: toastId });
            }
        } catch {
            toast.error('Failed to update test case', { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    }

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
                    <Button
                        variant="ghost"
                        size="icon"
                        className='h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted'
                        aria-label='Edit test case'
                    >
                        <Settings2Icon className='h-3.5 w-3.5' />
                    </Button>
                </DialogTrigger>
                <DialogContent className='bg-background border-border'>
                    <DialogHeader>
                        <DialogTitle className='text-foreground'>Edit Test Case</DialogTitle>
                        <DialogDescription className='text-muted-foreground'>
                            Modify the test case parameters. Changing these will reset any cached Playwright scripts.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-4 my-2'>
                        <div className='space-y-1.5'>
                            <Label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>Test Title</Label>
                            <Input
                                value={formTestCase.title ?? ''}
                                placeholder='Test Title'
                                className='bg-muted/30 border-border'
                                onChange={e => handleInputChange('title', e.target.value)}
                            />
                        </div>
                        <div className='space-y-1.5'>
                            <Label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>Description</Label>
                            <Textarea
                                value={formTestCase.description ?? ''}
                                placeholder='Description'
                                className='bg-muted/30 border-border resize-none'
                                rows={3}
                                onChange={e => handleInputChange('description', e.target.value)}
                            />
                        </div>
                        <div className='space-y-1.5'>
                            <Label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>Target Route / Path</Label>
                            <Input
                                value={formTestCase.targetRoute ?? ''}
                                placeholder='/api/...'
                                className='bg-muted/30 border-border'
                                onChange={e => handleInputChange('targetRoute', e.target.value)}
                            />
                        </div>
                        <div className='space-y-1.5'>
                            <Label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>Expected Result</Label>
                            <Textarea
                                value={formTestCase.expectedResult ?? ''}
                                placeholder='Expected Result'
                                className='bg-muted/30 border-border resize-none'
                                rows={3}
                                onChange={e => handleInputChange('expectedResult', e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isUpdating} className='border-border'>Cancel</Button>
                        </DialogClose>
                        <Button onClick={updateTestCase} disabled={isUpdating}>
                            {isUpdating ? (
                                <><Loader2 className='h-3.5 w-3.5 animate-spin mr-1.5' />Updating…</>
                            ) : 'Update Case'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default TestCaseSettingDialog
