"use client"
import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { UserDetailContext } from '@/context/UserDetailContext'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import EmptyWorkspace from './EmptyWorkspace'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import RepoDialog from './RepoDialog'
import UserRepoList from './UserRepoList'
import { Repo, UserRepo } from '@/types'

function WorkspaceBody() {
    const { userDetail } = useContext(UserDetailContext)
    const router = useRouter()
    const [token, setToken] = useState('')
    const [userRepoList, setUserRepoList] = useState<UserRepo[]>([]);

    const GetGithubToken = async () => {
        const result = await axios.get('/api/github/token')
        console.log(result.data.token)
        setToken(result.data.token)
    }

    const GetUserRepoList = async () => {
        const result = await axios.get(`/api/user-repo?userId=${userDetail?.id}`);
        setUserRepoList(result.data);
    }

    const OnAddRepo = async () => {
        router.push('/api/github')
    }

    useEffect(() => {
        GetGithubToken();
    }, []);

    useEffect(() => {
        if (userDetail?.id) {
            GetUserRepoList();
        }
    }, [userDetail]);
    return (
        <div>

            <div className='flex justify-between items-center m-6'>
                <h2 className='text-2xl font-medium m-6'>Workspaces</h2>
                <h2 className='text-blue-600 font-medium bg-blue-100 rounded-lg p-2'>Remaining Credits:{userDetail?.credits}</h2>
            </div>



            <Card className='flex items-center justify-between gap-4 p-4 border  rounded-lg cursor-pointer'>
                <div className='flex items-center gap-4'>
                    <Image src={'/github.png'} alt='github' width={50} height={50}></Image>
                    <h2 className='text-lg'>Connect Github & Add Repository</h2>
                </div>

                <div>
                    {!token ? <Button onClick={OnAddRepo}>
                        Setup
                    </Button> : <RepoDialog userRepoList={userRepoList} setRefreshPage={(refresh: boolean) => refresh && GetUserRepoList()} />}

                </div>
            </Card>
            {!userRepoList.length ?
                <Card className='mt-6'>
                    <CardContent>
                        <EmptyWorkspace />
                    </CardContent>
                </Card> : (
                    <UserRepoList repoList={userRepoList} onRefreshRepos={GetUserRepoList} />
                )}


        </div >
    )
}

export default WorkspaceBody