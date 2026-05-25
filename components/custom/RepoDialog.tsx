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
type Repo = {
    name: string,
    owner: string,
    html_url: string,
    description: string,
    language: string,
    private_: boolean,
    updated_at: string,
    full_name: string,
    id: number,
    default_branch: string,


}
function RepoDialog({ setRefreshPage }: { setRefreshPage: (refresh: boolean) => void }) {


    const [repoList, setRepoList] = useState<Repo[]>([])
    const [selectedRepo, setSelectedRepo] = useState<any>()
    const [searchTerm, setSearchTerm] = useState('')
    const { userDetail } = useContext(UserDetailContext)
    const [isOpen, setIsOpen] = useState(false)
    useEffect(() => {
        GetRepoList()
    }, [])

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
        if (!selectedRepo) return;
        const result = await axios.post('/api/user-repo', {
            repoId: selectedRepo.id,
            userId: userDetail?.id,
            name: selectedRepo.name,
            fullName: selectedRepo.full_name,
            private_: selectedRepo.private_,
            description: selectedRepo.description,
            language: selectedRepo.language,
            htmlUrl: selectedRepo.html_url,
            owner: selectedRepo.owner
        })
        console.log(result.data);
        setIsOpen(false);
        setRefreshPage(true);
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
                        {filteredRepoList.map((repo) => (
                            <li className={`p-4 border-b hover:bg-gray-100 cursor-pointer ${selectedRepo?.id === repo.id ? 'bg-gray-100' : null}`} onClick={() => setSelectedRepo(repo)} > {repo.full_name}</li>
                        ))}
                    </ul>
                </div>
                <DialogFooter className='flex justify-end gap-2 '>
                    <DialogClose>
                        <Button variant={'outline'}>Cancel</Button>
                    </DialogClose>
                    <Button onClick={() => SaveRepoToDB()}>Add</Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}

export default RepoDialog