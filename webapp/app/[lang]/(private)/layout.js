import React from 'react'
import { getDictionary } from '../dictionaries'
import { auth } from '@/auth'
import { SessionProvider } from 'next-auth/react'
import SideBar from './sidebar'
import Header from './header'

export default async function PrivateLayout({ children, params }) {
    const dict = await getDictionary(params.lang)
    const session = await auth()
    return (
        <SessionProvider session={session}>
            <div className='grid grid-rows-layout grid-cols-layout h-screen'>
                <Header dict={dict} lang={params.lang} />
                <SideBar dict={dict} lang={params.lang} />
                <div className='row-start-2 row-end-3 col-start-1 lg:col-start-2 col-end-3 py-4 px-7 overflow-x-hidden max-w-[100vw] '>
                    {children}
                </div>
            </div>
        </SessionProvider>
    )
}
