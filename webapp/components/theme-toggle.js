"use client"

import React from 'react'
import { useTheme } from 'next-themes'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        <div className='w-[65px] h-[32px] rounded-[30px] border-[2px] border-gray-200 dark:border-gray-600 dark:bg-gray-800 relative'>
          <span
            className='absolute left-[4px] dark:left-[34px] top-[3px] w-[22px] h-[22px] rounded-full border-[3px] border-orange-400 bg-orange-200 dark:bg-gray-600 dark:border-gray-200 transition duration-300 ease-in'></span>
          <SunIcon classname="absolute left-[36px] top-[6px] block dark:hidden" />
          <MoonIcon classname="hidden dark:block absolute left-[8px] top-[6px] " />
        </div>
      </button>
    </div>
  )
}


function MoonIcon({ classname }) {
  return (
    <svg className={classname} width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M9.59796 1.59115C9.80375 1.38536 10.11 1.3172 10.3837 1.4163C13.075 2.39093 15 4.96959 15 7.99976C15 11.8658 11.866 14.9998 8.00001 14.9998C4.96983 14.9998 2.39117 13.0748 1.41654 10.3834C1.31745 10.1098 1.3856 9.8035 1.5914 9.59771C1.79719 9.39192 2.10345 9.32376 2.37709 9.42286C2.96068 9.6342 3.59102 9.74976 4.25001 9.74976C7.28757 9.74976 9.75001 7.28733 9.75001 4.24976C9.75001 3.59077 9.63444 2.96044 9.4231 2.37685C9.32401 2.10321 9.39217 1.79694 9.59796 1.59115ZM11.214 3.53583C11.2378 3.77069 11.25 4.00887 11.25 4.24976C11.25 8.11576 8.116 11.2498 4.25001 11.2498C4.00912 11.2498 3.77094 11.2376 3.53608 11.2137C4.53522 12.5989 6.16298 13.4998 8.00001 13.4998C11.0376 13.4998 13.5 11.0373 13.5 7.99976C13.5 6.16273 12.5991 4.53497 11.214 3.53583Z"
        className='fill-white stroke-2' />
    </svg>
  )
}

function SunIcon({ classname }) {
  return (
    <svg className={classname} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_857_34)">
        <path fillRule="evenodd" clipRule="evenodd" d="M8 10.5C9.38071 10.5 10.5 9.38071 10.5 8C10.5 6.61929 9.38071 5.5 8 5.5C6.61929 5.5 5.5 6.61929 5.5 8C5.5 9.38071 6.61929 10.5 8 10.5ZM8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z"
          className='fill-orange-500' />
        <path fillRule="evenodd" clipRule="evenodd" d="M8 0C8.41421 0 8.75 0.335786 8.75 0.75V2.25C8.75 2.66421 8.41421 3 8 3C7.58579 3 7.25 2.66421 7.25 2.25V0.75C7.25 0.335786 7.58579 0 8 0ZM8 13C8.41421 13 8.75 13.3358 8.75 13.75V15.25C8.75 15.6642 8.41421 16 8 16C7.58579 16 7.25 15.6642 7.25 15.25V13.75C7.25 13.3358 7.58579 13 8 13Z"
          className='fill-orange-500' />
        <path fillRule="evenodd" clipRule="evenodd" d="M2.34329 2.34329C2.63618 2.0504 3.11106 2.0504 3.40395 2.34329L4.46461 3.40395C4.7575 3.69684 4.7575 4.17172 4.46461 4.46461C4.17172 4.7575 3.69684 4.7575 3.40395 4.46461L2.34329 3.40395C2.0504 3.11106 2.0504 2.63618 2.34329 2.34329ZM11.5357 11.5357C11.8286 11.2428 12.3034 11.2428 12.5963 11.5357L13.657 12.5963C13.9499 12.8892 13.9499 13.3641 13.657 13.657C13.3641 13.9499 12.8892 13.9499 12.5963 13.657L11.5357 12.5963C11.2428 12.3034 11.2428 11.8286 11.5357 11.5357Z"
          className='fill-orange-500' />
        <path fillRule="evenodd" clipRule="evenodd" d="M16 8C16 8.41421 15.6642 8.75 15.25 8.75H13.75C13.3358 8.75 13 8.41421 13 8C13 7.58579 13.3358 7.25 13.75 7.25H15.25C15.6642 7.25 16 7.58579 16 8ZM3 8C3 8.41421 2.66421 8.75 2.25 8.75H0.75C0.335787 8.75 -1.81058e-08 8.41421 0 8C1.81058e-08 7.58579 0.335787 7.25 0.75 7.25H2.25C2.66421 7.25 3 7.58579 3 8Z"
          className='fill-orange-500' />
        <path fillRule="evenodd" clipRule="evenodd" d="M13.6567 2.34329C13.9496 2.63618 13.9496 3.11106 13.6567 3.40395L12.596 4.46461C12.3032 4.7575 11.8283 4.7575 11.5354 4.46461C11.2425 4.17172 11.2425 3.69684 11.5354 3.40395L12.596 2.34329C12.8889 2.0504 13.3638 2.0504 13.6567 2.34329ZM4.46432 11.5357C4.75721 11.8286 4.75721 12.3034 4.46432 12.5963L3.40366 13.657C3.11077 13.9499 2.63589 13.9499 2.343 13.657C2.05011 13.3641 2.05011 12.8892 2.343 12.5963L3.40366 11.5357C3.69655 11.2428 4.17143 11.2428 4.46432 11.5357Z"
          className='fill-orange-500' />
      </g>
      <defs>
        <clipPath id="clip0_857_34">
          <rect width="16" height="16" fill="black" />
        </clipPath>
      </defs>
    </svg>
  )
}
