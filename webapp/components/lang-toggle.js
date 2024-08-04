'use client'
import Image from 'next/image';

import SpainFlag from '@/public/icons/es.svg';
import UKFlag from '@/public/icons/en.svg';

export default function LangToggle({ lang }) {

    let otherLang = 'es'
    if (lang === 'es') {
        otherLang = 'en'
    }


    function changeLanguage(currentLang, newLang) {
        if (currentLang === newLang) return;
        let currentUrl = window.location.href;
        let newUrl = currentUrl.replace(currentLang, newLang);
        window.location.href = newUrl;
    }

    return (
        <div>
            <button className={`flex flex-row gap-2 rounded-md items-center py-1  ${lang === 'en' ? 'hidden' : ''} hover:opacity-100`}
                onClick={() => changeLanguage(lang, 'en')}>
                <Image alt='english' src={UKFlag} width={18} height={18} className={`rounded-sm `} />
                <span className={`text-sm text-gray-800 dark:text-gray-200 ${lang === 'en' ? 'font-medium' : ''} `}>English</span>
            </button>
            <button className={`flex flex-row gap-2 rounded-md items-center  py-1  ${lang === 'es' ? 'hidden' : ''} hover:opacity-100`}
                onClick={() => changeLanguage(lang, 'es')}>
                <Image alt='spanish' src={SpainFlag} width={18} height={18} className={`rounded-sm `} />
                <span className={`text-sm text-gray-800 dark:text-gray-200 ${lang === 'es' ? 'font-medium' : ''} `}>Español</span>
            </button>
        </div>
    )
}
