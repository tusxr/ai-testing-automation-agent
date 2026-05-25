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

    useEffect(() => {
        GetRepoList()
    }, [])

    useEffect(() => {
        if (!isOpen) {
            setSelectedRepo(undefined);
            setSearchTerm('');
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
                private_: selectedRepo.private_,
                description: selectedRepo.description || "",
                language: selectedRepo.language || "",
                htmlUrl: selectedRepo.html_url,
                owner: selectedRepo.owner
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
                        className='w-full' onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)} />
                    <ul className='max-h-60 overflow-y-auto border-b rounded-xl mt-4'>
                        {filteredRepoList.map((repo) => {
                            const isAdded = userRepoList.some((ur) => ur.repoId === repo.id);
                            return (
                                <li
                                    key={repo.id}
                                    className={`p-4 border-b hover:bg-gray-100 cursor-pointer flex justify-between items-center ${selectedRepo?.id === repo.id ? 'bg-gray-100' : ''}`}
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
                </div>
                <DialogFooter className='flex justify-end gap-2 '>
                    <DialogClose>
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