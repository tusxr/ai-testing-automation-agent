"use client"
import React, { useContext, useEffect, useState } from 'react'
import { UserDetailContext } from '@/context/UserDetailContext'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import EmptyWorkspace from './EmptyWorkspace'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import RepoDialog from './RepoDialog'
import UserRepoList from './UserRepoList'
import { UserRepo } from '@/types'
import { Github, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

type GithubUser = {
    login: string;
    name: string | null;
    avatar_url: string;
}

function WorkspaceBody() {
    const { userDetail } = useContext(UserDetailContext)
    const router = useRouter()
    const [token, setToken] = useState('')
    const [githubUser, setGithubUser] = useState<GithubUser | null>(null)
    const [userRepoList, setUserRepoList] = useState<UserRepo[]>([]);

    const GetGithubToken = async () => {
        try {
            const result = await axios.get('/api/github/token')
            if (result.data.token) {
                setToken(result.data.token)
                GetGithubUser()
            }
        } catch {
            // Token not available, silently handled
        }
    }

    const GetGithubUser = async () => {
        try {
            const result = await axios.get('/api/github/user')
            setGithubUser(result.data)
        } catch {
            // Silently handled — user info is cosmetic
        }
    }

    const GetUserRepoList = async () => {
        try {
            const result = await axios.get(`/api/user-repo?userId=${userDetail?.id}`);
            setUserRepoList(result.data);
        } catch {
            toast.error('Failed to load repositories');
        }
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
        <div className='space-y-6'>
            {/* Page heading */}
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-bold tracking-tight text-foreground'>Workspace</h1>
                    <p className='text-sm text-muted-foreground mt-0.5'>
                        Manage your connected repositories and run AI-generated tests
                    </p>
                </div>
            </div>

            {/* GitHub Connection Card */}
            <Card className='border-border bg-card'>
                <CardContent className='flex items-center justify-between gap-4 p-4'>
                    <div className='flex items-center gap-3'>
                        {/* Avatar or icon */}
                        {token && githubUser?.avatar_url ? (
                            <div className='relative h-10 w-10 shrink-0'>
                                <Image
                                    src={githubUser.avatar_url}
                                    alt={githubUser.login}
                                    fill
                                    className='rounded-full object-cover'
                                />
                                <span className='absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-card'>
                                    <CheckCircle2 className='h-2.5 w-2.5 text-white' />
                                </span>
                            </div>
                        ) : (
                            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-100 shrink-0'>
                                <Github className='h-5 w-5 text-white dark:text-slate-900' />
                            </div>
                        )}

                        <div>
                            <div className='flex items-center gap-2'>
                                <h2 className='text-sm font-semibold text-foreground'>
                                    {token
                                        ? (githubUser?.name || githubUser?.login || 'GitHub Connected')
                                        : 'Connect GitHub Account'}
                                </h2>
                                {token && githubUser?.login && (
                                    <span className='text-xs text-muted-foreground font-mono'>
                                        @{githubUser.login}
                                    </span>
                                )}
                            </div>
                            <p className='text-xs text-muted-foreground'>
                                {token
                                    ? 'Add repositories to generate and run AI test cases'
                                    : 'Connect your GitHub account to get started'}
                            </p>
                        </div>
                    </div>

                    <div className='shrink-0'>
                        {!token
                            ? <Button onClick={OnAddRepo} size='sm' className='gap-1.5'>
                                <Github className='h-3.5 w-3.5' />
                                Connect GitHub
                            </Button>
                            : <RepoDialog
                                userRepoList={userRepoList}
                                setRefreshPage={(refresh: boolean) => refresh && GetUserRepoList()}
                                onAuthError={() => { setToken(''); setGithubUser(null); }}
                            />
                        }
                    </div>
                </CardContent>
            </Card>

            {/* Repository list or empty state */}
            {!userRepoList.length ? (
                <Card className='border-border bg-card'>
                    <CardContent className='p-6'>
                        <EmptyWorkspace />
                    </CardContent>
                </Card>
            ) : (
                <UserRepoList repoList={userRepoList} onRefreshRepos={GetUserRepoList} />
            )}
        </div>
    )
}

export default WorkspaceBody