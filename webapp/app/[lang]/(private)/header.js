"use client"
import { BriefCaseIcon, CheckedDocument, HamburgerIcon, HomeIcon, MainLogo, MainLogo16, UserIcon, SignOutIcon } from '@/app/icons';
import SpainFlag from '@/public/icons/es.svg';
import UKFlag from '@/public/icons/en.svg';
import ThemeToggle from '@/components/theme-toggle';
import Link from 'next/link'
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from "next-auth/react"
import React, { useEffect, useRef, useState } from 'react'

function changeLanguage(currentLang, newLang) {
    if (currentLang === newLang) return;
    let currentUrl = window.location.href;
    let newUrl = currentUrl.replace(currentLang, newLang);
    window.location.href = newUrl;
}

export default function Header({ dict, lang }) {

    const [showNav, setShowNav] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const session = useSession();

    // console.log('SESSION IN HEADER: ', session)
    const pathname = usePathname();

    const ref = useRef(null);
    const refUser = useRef(null);

    useEffect(() => {
        const handleOutSideClick = (event) => {
            if (!ref.current?.contains(event.target)) {
                setShowNav(false);
            }
        };

        window.addEventListener("mousedown", handleOutSideClick);

        return () => {
            window.removeEventListener("mousedown", handleOutSideClick);
        };
    }, [ref]);

    useEffect(() => {
        const handleOutSideClick = (event) => {
            if (!refUser.current?.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        window.addEventListener("mousedown", handleOutSideClick);

        return () => {
            window.removeEventListener("mousedown", handleOutSideClick);
        };
    }, [refUser]);

    useEffect(() => {
        const usermenu = document.getElementById("user-menu");
        usermenu.style.opacity = "0";
        usermenu.style.transform = "scale(0.5)";
        usermenu.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        usermenu.style.transformOrigin = "top right";
        // sleep
        setTimeout(() => {
            if (showUserMenu) {
                document.getElementById("user-menu").style.opacity = "1";
                document.getElementById("user-menu").style.transform = "scale(1)";
                // translate 0
                // document.getElementById("user-menu").style.transform = "translateY(0)";
            }
        }, 10);
    }, [showUserMenu])

    // console.log('SESSION IN HEADER: ', session)

    return (
        <div className='w-screen col-start-1 col-end-3 xl:pr-6 border-b-[0.5px] border-gray-300 dark:border-gray-800 py-2 px-4 flex flex-row justify-between items-center max-w-[100vw]'>
            <div ref={ref} className='relative lg:hidden z-10'>
                <div className='relative'>
                    <div className={`absolute text-xl top-12 left-0 flex flex-col bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded-sm p-5 ${showNav ? "flex" : "hidden"}`}>

                        <Link href="/dashboard" className={`group flex flex-row items-center gap-2 p-2 mb-2 text-gray-400 rounded-md ${pathname.includes("dashboard") ? "font-semibold bg-gray-100 dark:bg-gray-900 text-gray-950 dark:text-gray-100" : "hover:text-gray-950 hover:dark:text-gray-200 transition"}`}>
                            <HomeIcon width={16} height={16} className={`${pathname.includes("dashboard") ? "fill-gray-950 dark:fill-gray-100" : "fill-gray-400 dark:fill-gray-600 group-hover:fill-gray-950 group-hover:dark:fill-gray-200 transition "}`} />
                            {dict.navbar.dashboard}
                        </Link>

                        {session?.data?.role === 'company' ? (
                            <></>
                        ) : (
                            <>
                                <Link href="/internships" className={`group flex flex-row items-center gap-2 p-2 mb-2 text-gray-400 rounded-md ${pathname.includes("internships") ? "font-semibold bg-gray-100 dark:bg-gray-900 text-gray-950 dark:text-gray-100" : "hover:text-gray-950 hover:dark:text-gray-200 transition"}`}>
                                    <BriefCaseIcon width={16} height={16} className={`${pathname.includes("internships") ? "fill-gray-950 dark:fill-gray-100" : "fill-gray-400 dark:fill-gray-600 group-hover:fill-gray-950 group-hover:dark:fill-gray-200 transition "}`} />
                                    {dict.navbar.internships}
                                </Link>
                                <Link href="/grades" className={`group flex flex-row items-center gap-2 p-2 mb-2 text-gray-400 rounded-md ${pathname.includes("grades") ? "font-semibold bg-gray-100 dark:bg-gray-900 text-gray-950 dark:text-gray-100" : "hover:text-gray-950 hover:dark:text-gray-200 transition"}`}>
                                    <CheckedDocument width={16} height={16} className={`${pathname.includes("grades") ? "fill-gray-950 dark:fill-gray-100" : "fill-gray-400 dark:fill-gray-600 group-hover:fill-gray-950 group-hover:dark:fill-gray-200 transition "}`} />
                                    {dict.navbar.grades}
                                </Link>
                            </>
                        )}


                    </div>
                    <button className='border border-gray-300 dark:border-gray-800 dark:bg-[#121212] rounded-md p-2 mr-6'
                        onClick={() => {
                            setShowNav(!showNav)
                        }}>
                        <HamburgerIcon width={24} height={24} className={`fill-gray-950 dark:fill-gray-100`} />
                    </button>
                </div>
            </div >


            <div className='flex flex-row gap-2'>
                <Link href={'/dashboard'} className='flex flex-row gap-2 justify-center items-center'>
                    <MainLogo16 width={30} height={30} />
                    <p className='font-semibold text-2xl'>Interny</p>
                </Link>
            </div>


            <div ref={refUser} className='relative ml-auto mr-2 flex justify-center items-start '>
                <button
                    onClick={() => {
                        setShowUserMenu(!showUserMenu)
                    }}>
                    {session.data?.user?.image ?
                        <img src={session?.data?.user?.image} width={30} height={30} className={`border border-gray-500 rounded-full`} />
                        :
                        <UserIcon width={38} height={38} className={`fill-gray-950 dark:fill-gray-100`} />
                    }
                </button>
                <div id="user-menu" className={`absolute z-50 right-0 top-10 w-min max-w-[300px] min-w-[200px] overflow-hidden text-lg flex flex-col gap-3 justify-center items-start shadow-sm dark:shadow-gray-900 bg-[#fafafa] dark:bg-[#161616] border border-gray-300 dark:border-gray-800 rounded-xl py-5 px-4 transition duration-300 opacity-0 scale-50 ${showUserMenu ? 'flex' : 'hidden'}`}>
                    <div className='flex flex-col'>
                        {session.data?.user?.name && <h2 className='text-gray-800 text-base font-medium dark:text-gray-200'>{session.data?.user?.name}</h2>}
                        {session.data?.user?.email && <h2 className='text-gray-400 text-xs dark:text-gray-500 max-w-full'>{session.data?.user?.email}</h2>}
                    </div>
                    <Link href="/change-password" className='text-gray-400 text-xs dark:text-gray-500 hover:underline'>
                        {dict.supervisor.title}
                    </Link>
                    <div className='flex flex-col gap-1'>
                        <button className={`flex flex-row gap-2 rounded-md items-center  py-1  ${lang === 'en' ? 'opacity-100' : 'opacity-40'} hover:opacity-100`}
                            onClick={() => changeLanguage(lang, 'en')}>
                            <Image alt="UK flag" src={UKFlag} width={18} height={18} className={`rounded-sm `} />
                            <span className={`text-sm text-gray-800 dark:text-gray-200 ${lang === 'en' ? 'font-medium' : ''} `}>English</span>
                        </button>
                        <button className={`flex flex-row gap-2 rounded-md items-center  py-1  ${lang === 'es' ? 'opacity-100' : 'opacity-40'} hover:opacity-100`}
                            onClick={() => changeLanguage(lang, 'es')}>
                            <Image alt="Spain Flag" src={SpainFlag} width={18} height={18} className={`rounded-sm `} />
                            <span className={`text-sm text-gray-800 dark:text-gray-200 ${lang === 'es' ? 'font-medium' : ''} `}>Español</span>
                        </button>
                    </div>
                    <ThemeToggle />
                    <button className='flex flex-row gap-2 items-center px-3 py-2 rounded-md hover:bg-gray-200 hover:dark:bg-gray-800'
                        onClick={() => signOut()}>
                        <SignOutIcon width={18} height={18} className='fill-gray-800 dark:fill-gray-200' />
                        <p className='text-sm'>{dict.login.logOut}</p>
                    </button>
                </div>
            </div>
        </div >
    )
}


