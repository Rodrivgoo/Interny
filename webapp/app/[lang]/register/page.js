import { React } from 'react'
import { getDictionary } from '../dictionaries'
import ThemeToggle from '@/components/theme-toggle.js'
import { MainLogo } from '../../icons.js'
import RegisterForm from './credentials'
import { credentialsRegisterAction } from '@/app/actions/auth/register.js'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LangToggle from '@/components/lang-toggle'

export default async function RegisterPage({ params: { lang } }) {
  const dict = await getDictionary(lang);
  const session = await auth()

  let API_URL = process.env.API_URL
  if (!API_URL) {
    API_URL = 'http://localhost:8000'
  }

  let data = []

  try {
    let res = await fetch(API_URL + '/dashboard/select-career/', {
      method: 'GET',
      headers: {
        accept: 'application/json',
      }
    })

    res = await res.json()
    data = res?.careers || []
  } catch (error) {
    console.error('ERROR FETCHING CAREERS: ', error)
  }


  if (session) {
        redirect(`/dashboard`) 
  }

  let otherLang = 'es'
  if (lang === 'es') {
    otherLang = 'en'
  }

  return (
    <main className='max-w-[700px] h-full mx-auto my-20 relative flex flex-col items-center justify-center'>
      <div className='absolute -top-5 left-[75%] flex flex-col gap-3 items-center justify-center'>
        <LangToggle lang={lang} />
        <ThemeToggle />
      </div>
      <div className='mb-10'>
        <MainLogo width={48} height={48} />
      </div>
      <h1 className='text-5xl font-extrabold mb-5'>{dict.register.title}</h1>

      <RegisterForm dict={dict} lang={lang} data={data} registerAction={credentialsRegisterAction} />

    </main>
  )
}
