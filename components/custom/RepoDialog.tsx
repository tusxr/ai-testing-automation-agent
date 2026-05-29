import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Button } from '../ui/button'
import axios from 'axios'
import { UserDetailContext } from '@/context/UserDetailContext'
import { Repo, UserRepo } from '@/types'
import { Loader2, Plus, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface RepoDialogProps {
    userRepoList: UserRepo[];
    setRefreshPage: (refresh: boolean) => void;
    onAuthError?: () => void;
}

function RepoDialog({ userRepoList, setRefreshPage, onAuthError }: RepoDialogProps) {
    const [repoList, setRepoList] = useState<Repo[]>([])
    const [selectedRepo, setSelectedRepo] = useState<Repo | undefined>()
    const [searchTerm, setSearchTerm] = useState('')
    const { userDetail } = useContext(UserDetailContext)
    const [isOpen, setIsOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isLoadingRepos, setIsLoadingRepos] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [targetDomain, setTargetDomain] = useState('http://localhost:3000')

    useEffect(() => {
        if (isOpen) {
            GetRepoList();
        } else {
            setSelectedRepo(undefined);
            setSearchTerm('');
            setTargetDomain('http://localhost:3000');
        }
    }, [isOpen]);

    const GetRepoList = async () => {
        setIsLoadingRepos(true);
        setErrorMsg('');
        try {
            const result = await axios.get('/api/github/repo')
            if (Array.isArray(result.data)) {
                setRepoList(result.data)
            } else {
                setErrorMsg('Failed to parse repositories list.')
            }
        } catch (e: any) {
            if (e.response?.status === 401) {
                onAuthError?.();
                toast.error('GitHub session expired. Please reconnect.');
            } else {
                setErrorMsg(e.response?.data?.error || 'Failed to fetch repositories from GitHub.');
                toast.error('Could not load GitHub repositories');
            }
        } finally {
            setIsLoadingRepos(false);
        }
    }

    const filteredRepoList = useMemo(() => {
        const q = searchTerm.trim().toLowerCase()
        if (!q) return repoList;
        return repoList.filter(r => r.full_name.toLowerCase().includes(q));
    }, [repoList, searchTerm])

    const SaveRepoToDB = async () => {
        if (!selectedRepo || isSaving) return;
        setIsSaving(true);
        const toastId = toast.loading('Adding repository…');
        try {
            await axios.post('/api/user-repo', {
                repoId: selectedRepo.id,
                userId: userDetail?.id,
                name: selectedRepo.name,
                fullName: selectedRepo.full_name,
                private_: selectedRepo.private_ ? 1 : 0,
                description: selectedRepo.description || "",
                language: selectedRepo.language || "",
                htmlUrl: selectedRepo.html_url,
                owner: selectedRepo.owner,
                defaultBranch: selectedRepo.default_branch || 'main',
                targetDomain: targetDomain || 'http://localhost:3000',
            })
            toast.success('Repository added', {
                id: toastId,
                description: selectedRepo.full_name
            });
            setIsOpen(false);
            setRefreshPage(true);
        } catch {
            toast.error('Failed to add repository', { id: toastId });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <DialogTrigger asChild>
                <Button size='sm' className='gap-1.5'>
                    <Plus className='h-3.5 w-3.5' /> Add Repo
                </Button>
            </DialogTrigger>
            <DialogContent className='bg-background border-border'>
                <DialogHeader>
                    <DialogTitle className='text-foreground'>Add Repository</DialogTitle>
                    <DialogDescription className='text-muted-foreground'>
                        Search and select a GitHub repository to add to your workspace.
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <Input
                        placeholder='Search by repo name…'
                        className='w-full mb-3 bg-muted/30 border-border'
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)}
                    />
                    <ul className='max-h-52 overflow-y-auto border border-border rounded-xl mt-2 min-h-[100px] flex flex-col bg-background'>
                        {isLoadingRepos ? (
                            <div className="flex flex-1 items-center justify-center py-6 gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                <span>Loading repositories…</span>
                            </div>
                        ) : errorMsg ? (
                            <div className="flex flex-1 flex-col items-center justify-center py-6 px-4 text-center text-sm text-destructive gap-2">
                                <span>{errorMsg}</span>
                                <Button size="sm" variant="outline" onClick={GetRepoList}>Retry</Button>
                            </div>
                        ) : filteredRepoList.length === 0 ? (
                            <div className="flex flex-1 items-center justify-center py-6 text-sm text-muted-foreground">
                                No repositories found.
                            </div>
                        ) : (
                            filteredRepoList.map((repo) => {
                                const isAdded = userRepoList.some((ur) => ur.repoId === repo.id);
                                const isSelected = selectedRepo?.id === repo.id;
                                return (
                                    <li
                                        key={repo.id}
                                        className={`p-3 border-b border-border last:border-b-0 cursor-pointer flex justify-between items-center transition-colors ${
                                            isSelected
                                                ? 'bg-primary/10 text-foreground font-medium'
                                                : 'hover:bg-muted/50 text-foreground'
                                        }`}
                                        onClick={() => setSelectedRepo(repo)}
                                    >
                                        <span className="text-sm truncate mr-2">{repo.full_name}</span>
                                        <div className='flex items-center gap-1.5 shrink-0'>
                                            {isSelected && !isAdded && (
                                                <CheckCircle2 className='h-3.5 w-3.5 text-primary' />
                                            )}
                                            {isAdded && (
                                                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                                                    Added
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                );
                            })
                        )}
                    </ul>

                    {selectedRepo && (
                        <div className="mt-4 p-4 border border-border rounded-xl bg-muted/30 space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground block">
                                Target Domain (for running tests)
                            </label>
                            <Input
                                placeholder="e.g., http://localhost:3000"
                                value={targetDomain}
                                onChange={(e) => setTargetDomain(e.target.value)}
                                className="w-full bg-background border-border"
                            />
                        </div>
                    )}
                </div>

                <DialogFooter className='flex justify-end gap-2 mt-4'>
                    <DialogClose asChild>
                        <Button variant={'outline'} className='border-border'>Cancel</Button>
                    </DialogClose>
                    {(() => {
                        const isSelectedAlreadyAdded = selectedRepo && userRepoList.some((ur) => ur.repoId === selectedRepo.id);
                        return (
                            <Button
                                onClick={() => SaveRepoToDB()}
                                disabled={isSaving || !selectedRepo || !!isSelectedAlreadyAdded}
                            >
                                {isSaving ? (
                                    <><Loader2 className='h-3.5 w-3.5 animate-spin mr-1.5' />Adding…</>
                                ) : isSelectedAlreadyAdded ? 'Already Added' : 'Add Repository'}
                            </Button>
                        );
                    })()}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RepoDialog