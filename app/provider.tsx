"use client";
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/nextjs'
import { UserDetailContext } from '@/context/UserDetailContext';

function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user, isLoaded } = useUser()
    const [userDetail, setUserDetail] = useState<any>();
    useEffect(() => {
        if (isLoaded && user) {
            CreateNewUser()
        }
    }, [isLoaded, user])

    const CreateNewUser = async () => {
        const result = await axios.post('/api/users', {})
        console.log(result)
        setUserDetail(result.data?.user)
    }

    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            {children}
        </UserDetailContext.Provider>
    )
}

export default Provider