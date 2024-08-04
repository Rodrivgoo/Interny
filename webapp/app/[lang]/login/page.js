import React from 'react'
import { getDictionary } from '../dictionaries'
import ThemeToggle from '@/components/theme-toggle.js'
import { MainLogo } from '../../icons.js'

import { auth, signIn, signOut } from "@/auth"
import LoginForm from './credentialsForm'
import { credentialsLoginAction } from '@/app/actions/auth/login.js'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import LangToggle from '@/components/lang-toggle'


function googleLogin(dict) {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google");
      }}>
      <button
        type='submit'
        className='border border-gray-200 dark:border-gray-900 dark:bg-gray-800 rounded-md shadow-sm w-[300px] h-10 p-6 mb-5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center'>
        <p className='w-[270px]'>{dict.login.loginWith} Google</p>
        <Image
          className='ml-2'
          src={`/logos/google.svg`}
          width={24}
          height={24}
          alt="Google Icon"
        />
      </button>
    </form>
  )
}

function microsoftLogin(dict) {
  return (
    <form action={async () => {
      "use server"
      await signIn("azure-ad");
    }}>
      <button
        type='submit'
        className='border border-gray-200 dark:border-gray-900 dark:bg-gray-800 rounded-md shadow-sm w-[300px] h-10 p-6 mb-5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center'>
        <p className='w-[270px]'>{dict.login.loginWith} Microsoft</p>
        <Image
          className='ml-2'
          src={`/logos/microsoft.svg`}
          width={24}
          height={24}
          alt="Microsoft Icon"
        />
      </button>
    </form>
  )
}


export default async function LoginPage({ params: { lang } }) {
  const dict = await getDictionary(lang)
  const session = await auth()

  if (session) {
    redirect(`/dashboard`)
  }

  let otherLang = 'es'
  if (lang === 'es') {
    otherLang = 'en'
  }

  return (
    <main className='max-w-[700px] mx-auto my-20 h-full relative flex flex-col items-center justify-center'>
      <div className='absolute -top-7 left-[75%] flex flex-col gap-3 items-center justify-center'>
        <LangToggle lang={lang} />
        <ThemeToggle />
      </div>
      <Link href={'/'} className='mb-10'>
        <MainLogo width={48} height={48} />
      </Link>

      <h1 className='text-4xl font-extrabold mb-5 sm:text-5xl'>{dict.login.title}</h1>

      {googleLogin(dict)}
      {microsoftLogin(dict)}
      <LoginForm dict={dict} lang={lang} loginAction={credentialsLoginAction} />

    </main>
  )
}
