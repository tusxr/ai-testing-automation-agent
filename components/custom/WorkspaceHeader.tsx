"use client";
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import ThemeToggle from './ThemeToggle'
import { Sparkles } from 'lucide-react'

function WorkspaceHeader() {
    return (
        <header className='sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm'>
            <div className='flex h-16 items-center justify-between px-6'>
                {/* Logo */}
                <Link href='/' className='flex items-center gap-2.5 group'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-foreground transition-opacity group-hover:opacity-80'>
                        <Sparkles className='h-4 w-4 text-background' />
                    </div>
                    <span className='text-base font-bold tracking-tight text-foreground hidden sm:block'>
                        QA Autopilot
                    </span>
                </Link>

                {/* Nav */}
                <nav>
                    <ul className='flex gap-1 items-center'>
                        <li>
                            <Link
                                href='/workspace'
                                className='px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors'
                            >
                                Workspace
                            </Link>
                        </li>
                        <li>
                            <a
                                href='mailto:support@qaautopilot.app'
                                className='px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors'
                            >
                                Support
                            </a>
                        </li>
                    </ul>
                </nav>

                {/* Right actions */}
                <div className='flex items-center gap-2'>
                    <ThemeToggle />
                    <div className='h-5 w-px bg-border' />
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: 'h-8 w-8',
                            }
                        }}
                    />
                </div>
            </div>
        </header>
    )
}

export default WorkspaceHeader