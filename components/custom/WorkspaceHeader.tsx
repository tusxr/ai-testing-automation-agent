import React from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
function WorkspaceHeader() {
    return (
        <div className='flex w-full p-4 justify-between items-center'>

            {/* logo */}
            <Image src='/logo.svg' alt='logo' width={100} height={100} className='' />
            {/* menu Options */}
            <ul className='flex gap-5 text-xl items-center'>
                <li className='hover:text-blue-500 transition-all cursor-pointer'>Workspace</li>
                <li className='hover:text-blue-500 transition-all cursor-pointer'>Pricing</li>
                <li className='hover:text-blue-500 transition-all cursor-pointer'>Support</li>
            </ul>
            {/* User Button */}
            <UserButton />

        </div>
    )
}

export default WorkspaceHeader