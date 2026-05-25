"use client"
import React, { useContext } from 'react'
import Image from 'next/image'
import { UserDetailContext } from '@/context/UserDetailContext'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import EmptyWorkspace from './EmptyWorkspace'

function WorkspaceBody() {
    const { userDetail } = useContext(UserDetailContext)
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
                    <Button >
                        + Add
                    </Button>
                </div>
            </Card>

            <Card className='mt-6'>
                <CardContent>
                    <EmptyWorkspace />
                </CardContent>
            </Card>


        </div >
    )
}

export default WorkspaceBody