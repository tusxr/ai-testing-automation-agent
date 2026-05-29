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

interface RepoDialogProps {
    userRepoList: UserRepo[];
    setRefreshPage: (refresh: boolean) => void;
}

function RepoDialog({ userRepoList, setRefreshPage }: RepoDialogProps) {
    const [repoList, setRepoList] = useState<Repo[]>([])
    const [selectedRepo, setSelectedRepo] = useState<Repo | undefined>()
    const [searchTerm, setSearchTerm] = useState('')
    const { userDetail } = useContext(UserDetailContext)
    const [isOpen, setIsOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [targetDomain, setTargetDomain] = useState('http://localhost:3000')

    useEffect(() => {
        GetRepoList()
    }, [])

    useEffect(() => {
        if (!isOpen) {
            setSelectedRepo(undefined);
            setSearchTerm('');
            setTargetDomain('http://localhost:3000');
        }
    }, [isOpen]);

    const GetRepoList = async () => {
        const result = await axios.get('/api/github/repo')
        console.log(result.data)
        setRepoList(result.data)
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
                    <ul className='max-h-48 overflow-y-auto border rounded-xl mt-2'>
                        {filteredRepoList.map((repo) => {
                            const isAdded = userRepoList.some((ur) => ur.repoId === repo.id);
                            return (
                                <li
                                    key={repo.id}
                                    className={`p-3 border-b last:border-b-0 hover:bg-gray-100 cursor-pointer flex justify-between items-center ${selectedRepo?.id === repo.id ? 'bg-gray-100 font-medium' : ''}`}
                                    onClick={() => setSelectedRepo(repo)}
                                >
                                    <span>{repo.full_name}</span>
                                    {isAdded && (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded font-medium">
                                            Added
                                        </span>
                                    )}
                                </li>
                            );
                        })}
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