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
        try {
            console.log("handleSaveSettings", repoSettings)
            await axios.post('/api/user-repo/settings', {
                repoId: repo.repoId,
                userId: repo.userId,
                targetDomain: repoSettings.targetDomain,
                globalInstruction: repoSettings.globalInstruction
            })
            setReload?.()
            setOpen(false)
        } catch (error) {
            console.error("Failed to save repo settings:", error)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button className='flex gap-3 items-center bg-black hover:bg-black/80 text-white rounded-xl px-3 py-2 cursor-pointer text-sm font-medium transition-colors'>
                        <Settings2Icon className='h-4 w-4' />
                        Project Config
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Project Configuration</DialogTitle>
                        <DialogDescription>
                            Configure project-level defaults used during script generation and execution.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className='text-gray-500'>APP URL / DEFAULT WEBSITE</Label>
                            <Input 
                                value={repoSettings.targetDomain} 
                                onChange={(e) => setRepoSettings({ ...repoSettings, targetDomain: e.target.value })} 
                                placeholder='https://example.com' 
                                className='mt-1' 
                                disabled={saving}
                            />
                            <p className='text-xs text-gray-500'>The target address where automated headless browsers will connect and run test cases</p>
                        </div>
                        <div className="space-y-2">
                            <Label className='text-gray-500'>GLOBAL TEST INSTRUCTION</Label>
                            <Input 
                                value={repoSettings.globalInstruction} 
                                onChange={(e) => setRepoSettings({ ...repoSettings, globalInstruction: e.target.value })} 
                                placeholder='e.g., Use test credentials for login, bypass 2FA...' 
                                className='mt-1' 
                                disabled={saving}
                            />
                            <p className='text-xs text-gray-500'>Includes any authentication credentials, cookies, setups or teardown instructions. These are automatically appended to Gemini's Prompts</p>
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <DialogClose asChild>
                            <Button variant="outline" disabled={saving}>Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleSaveSettings} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Config'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    )
}

export default RepoSetting