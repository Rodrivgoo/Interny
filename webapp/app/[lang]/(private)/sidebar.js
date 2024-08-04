'use client'
import { BriefCaseIcon, CheckedDocument, HomeIcon } from '@/app/icons';
import { useSession } from 'next-auth/react';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

export default function SideBar({ dict, lang }) {
    const pathname = usePathname();
    const session = useSession();

    // console.log('SESSION IN SIDEBAR: ', session)

    return (
        <div className='border-r border-gray-300 dark:border-gray-800 p-4 hidden lg:flex flex-col row-start-2 row-end-3 col-start-1 col-end-2 '>

            <Link href={`/${lang}/dashboard`} className={`group flex flex-row items-center gap-2 p-2 mb-2 text-gray-400 rounded-md ${pathname.includes("dashboard") ? "font-semibold bg-gray-100 dark:bg-gray-900 text-gray-950 dark:text-gray-100" : "hover:text-gray-950 hover:dark:text-gray-200 transition"}`}>
                <HomeIcon width={16} height={16} className={`${pathname.includes("dashboard") ? "fill-gray-950 dark:fill-gray-100" : "fill-gray-400 dark:fill-gray-600 group-hover:fill-gray-950 group-hover:dark:fill-gray-200 transition "}`} />
                {dict.navbar.dashboard}
            </Link>
            {session.data.role === 'company' ? (
                <></>
            ) : (
                <>
                    <Link href={`/${lang}/internships`} className={`group flex flex-row items-center gap-2 p-2 mb-2 text-gray-400 rounded-md ${pathname.includes("internships") ? "font-semibold bg-gray-100 dark:bg-gray-900 text-gray-950 dark:text-gray-100" : "hover:text-gray-950 hover:dark:text-gray-200 transition"}`}>
                        <BriefCaseIcon width={16} height={16} className={`${pathname.includes("internships") ? "fill-gray-950 dark:fill-gray-100" : "fill-gray-400 dark:fill-gray-600 group-hover:fill-gray-950 group-hover:dark:fill-gray-200 transition "}`} />
                        {dict.navbar.internships}
                    </Link>
                    <Link href={`/${lang}/grades`} className={`group flex flex-row items-center gap-2 p-2 mb-2 text-gray-400 rounded-md ${pathname.includes("grades") ? "font-semibold bg-gray-100 dark:bg-gray-900 text-gray-950 dark:text-gray-100" : "hover:text-gray-950 hover:dark:text-gray-200 transition"}`}>
                        <CheckedDocument width={16} height={16} className={`${pathname.includes("grades") ? "fill-gray-950 dark:fill-gray-100" : "fill-gray-400 dark:fill-gray-600 group-hover:fill-gray-950 group-hover:dark:fill-gray-200 transition "}`} />
                        {dict.navbar.grades}
                    </Link>
                </>
            )}
        </div>
    )
}

