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
import { Loader2 } from 'lucide-react'

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
            console.log(result.data)
            if (Array.isArray(result.data)) {
                setRepoList(result.data)
            } else {
                setErrorMsg('Failed to parse repositories list.')
            }
        } catch (e: any) {
            console.error("Error fetching repository tree:", e);
            if (e.response?.status === 401) {
                onAuthError?.();
            }
            setErrorMsg(e.response?.data?.error || 'Failed to fetch repositories from GitHub.');
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
        try {
            const result = await axios.post('/api/user-repo', {
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
            console.log(result.data);
            setIsOpen(false);
            setRefreshPage(true);
        } catch (e) {
            console.error("Error saving repository:", e);
        } finally {
            setIsSaving(false);
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <DialogTrigger asChild>
                <Button> + Add Repo</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Repository</DialogTitle>
                    <DialogDescription>
                        Search and Select your repository
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Input placeholder='Search Repo by Name'
                        className='w-full mb-3' onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)} />
                    <ul className='max-h-48 overflow-y-auto border rounded-xl mt-2 min-h-[100px] flex flex-col justify-start'>
                        {isLoadingRepos ? (
                            <div className="flex flex-1 items-center justify-center py-6 gap-2 text-sm text-gray-500">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                <span>Loading repositories...</span>
                            </div>
                        ) : errorMsg ? (
                            <div className="flex flex-1 flex-col items-center justify-center py-6 px-4 text-center text-sm text-red-500 gap-2">
                                <span>{errorMsg}</span>
                                <Button size="sm" variant="outline" onClick={GetRepoList}>Retry</Button>
                            </div>
                        ) : filteredRepoList.length === 0 ? (
                            <div className="flex flex-1 items-center justify-center py-6 text-sm text-gray-500">
                                No repositories found.
                            </div>
                        ) : (
                            filteredRepoList.map((repo) => {
                                const isAdded = userRepoList.some((ur) => ur.repoId === repo.id);
                                return (
                                    <li
                                        key={repo.id}
                                        className={`p-3 border-b last:border-b-0 hover:bg-gray-100 cursor-pointer flex justify-between items-center ${selectedRepo?.id === repo.id ? 'bg-gray-100 font-medium' : ''}`}
                                        onClick={() => setSelectedRepo(repo)}
                                    >
                                        <span className="text-sm truncate mr-2">{repo.full_name}</span>
                                        {isAdded && (
                                            <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold shrink-0">
                                                Added
                                            </span>
                                        )}
                                    </li>
                                );
                            })
                        )}
                    </ul>

                    {selectedRepo && (
                        <div className="mt-4 p-4 border rounded-xl bg-gray-50 space-y-2">
                            <label className="text-xs font-semibold text-gray-600 block">
                                Target Domain (for running tests)
                            </label>
                            <Input
                                placeholder="e.g., http://localhost:3000"
                                value={targetDomain}
                                onChange={(e) => setTargetDomain(e.target.value)}
                                className="w-full bg-white"
                            />
                        </div>
                    )}
                </div>
                <DialogFooter className='flex justify-end gap-2 mt-4'>
                    <DialogClose asChild>
                        <Button variant={'outline'}>Cancel</Button>
                    </DialogClose>
                    {(() => {
                        const isSelectedAlreadyAdded = selectedRepo && userRepoList.some((ur) => ur.repoId === selectedRepo.id);
                        return (
                            <Button
                                onClick={() => SaveRepoToDB()}
                                disabled={isSaving || !selectedRepo || !!isSelectedAlreadyAdded}
                            >
                                {isSaving ? "Adding..." : isSelectedAlreadyAdded ? "Already Added" : "Add"}
                            </Button>
                        );
                    })()}
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}

export default RepoDialog