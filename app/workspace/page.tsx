import React from 'react'
import WorkspaceBody from '@/components/custom/WorkspaceBody'
import { cookies } from 'next/headers'
function Workspace() {
    return (
        <div className='mx-auto max-w-4xl'>
            <WorkspaceBody />
        </div>
    )
}

export default Workspace