import React from 'react'
import WorkspaceBody from '@/components/custom/WorkspaceBody'
import { cookies } from 'next/headers'

async function Workspace() {
    const cookieStore = await cookies()
    const token = cookieStore.get('gh-token')?.value

    return (
        <div className='mx-auto max-w-4xl'>
            <WorkspaceBody token={token} />
        </div>
    )
}

export default Workspace