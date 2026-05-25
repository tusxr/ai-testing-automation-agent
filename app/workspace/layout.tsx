import React from 'react'
import WorkSpaceHeader from '@/components/custom/WorkspaceHeader';

function WorkspaceLayout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <WorkSpaceHeader />
            {children}</div>
    )
}

export default WorkspaceLayout