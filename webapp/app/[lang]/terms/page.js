import React from 'react'
import { getDictionary } from '../dictionaries'
import ThemeToggle from '@/components/theme-toggle.js'
import { MainLogo } from '../../icons.js'


export default async function TermsPage({ params: { lang } }){
    const dict = await getDictionary(lang);

    
    return (        
        <main className='max-w-[700px] m-auto h-screen pb-20 relative flex flex-col items-center justify-center'>
        <div className='absolute top-5 left-[90%]'>
         <ThemeToggle />
        </div>
        <div className='mb-10'>
          <MainLogo width={48} height={48} />
        </div>
        
        <h1 className='text-4xl font-extrabold mb-5 sm:text-5xl'> {dict.register.termsTitle} </h1>

        <div> {dict.register.termsAndConditionsText} </div>
        
    </main>
    )
}