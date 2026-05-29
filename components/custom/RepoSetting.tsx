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
import { Label } from "@/components/ui/label"
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { UserRepo } from '@/types'
import axios from 'axios'
import { Settings2Icon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type props = {
    repo: UserRepo;
    setReload?: () => void;
}

function RepoSetting({ repo, setReload }: props) {
    const [open, setOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [repoSettings, setRepoSettings] = useState({
        targetDomain: repo?.targetDomain || '',
        globalInstruction: repo?.globalInstruction || ''
    })

    useEffect(() => {
        if (open) {
            setRepoSettings({
                targetDomain: repo?.targetDomain || '',
                globalInstruction: repo?.globalInstruction || ''
            })
        }
    }, [open, repo])

    const handleSaveSettings = async () => {
        setSaving(true)
        const toastId = toast.loading('Saving project config…');
        try {
            await axios.post('/api/user-repo/settings', {
                repoId: repo.repoId,
                userId: repo.userId,
                targetDomain: repoSettings.targetDomain,
                globalInstruction: repoSettings.globalInstruction
            })
            toast.success('Project config saved', {
                id: toastId,
                description: repo.fullName
            });
            setReload?.()
            setOpen(false)
        } catch {
            toast.error('Failed to save project config', { id: toastId });
        } finally {
            setSaving(false)
        }
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant='outline' size='sm' className='gap-1.5 h-8 text-xs border-border'>
                        <Settings2Icon className='h-3.5 w-3.5' />
                        Config
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-background border-border">
                    <DialogHeader>
                        <DialogTitle className='text-foreground'>Project Configuration</DialogTitle>
                        <DialogDescription className='text-muted-foreground'>
                            Configure project-level defaults used during script generation and execution.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-5 py-4">
                        <div className="space-y-2">
                            <Label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                                App URL / Default Website
                            </Label>
                            <Input
                                value={repoSettings.targetDomain}
                                onChange={(e) => setRepoSettings({ ...repoSettings, targetDomain: e.target.value })}
                                placeholder='https://example.com'
                                className='bg-muted/30 border-border'
                                disabled={saving}
                            />
                            <p className='text-xs text-muted-foreground'>
                                The target address where automated headless browsers will connect and run test cases.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                                Global Test Instruction
                            </Label>
                            <Input
                                value={repoSettings.globalInstruction}
                                onChange={(e) => setRepoSettings({ ...repoSettings, globalInstruction: e.target.value })}
                                placeholder='e.g., Use test credentials for login, bypass 2FA…'
                                className='bg-muted/30 border-border'
                                disabled={saving}
                            />
                            <p className='text-xs text-muted-foreground'>
                                Authentication credentials, setup or teardown instructions. Appended to AI prompts automatically.
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="outline" disabled={saving} className='border-border'>Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleSaveSettings} disabled={saving}>
                            {saving ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</>
                            ) : 'Save Config'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default RepoSetting