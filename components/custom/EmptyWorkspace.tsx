"use client"
import React from 'react'
import Image from 'next/image'
import { Github } from 'lucide-react'

function EmptyWorkspace() {
    return (
        <div className='flex flex-col items-center justify-center py-12 px-4 text-center'>
            <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 dark:bg-slate-100 mb-4'>
                <Github className='h-8 w-8 text-white dark:text-slate-900' />
            </div>
            <h2 className='text-lg font-semibold text-foreground'>No repositories yet</h2>
            <p className='text-sm text-muted-foreground mt-2 max-w-xs'>
                Connect your GitHub account and add a repository to start generating and running AI-powered test cases.
            </p>
        </div>
    )
}

export default EmptyWorkspace