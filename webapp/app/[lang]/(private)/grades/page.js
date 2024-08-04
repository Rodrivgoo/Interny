import React from 'react'
import GradeCalculator from './calculator'
import { getDictionary } from '../../dictionaries';

export default async function GradesPage({ params: { lang } }) {

  const dict = await getDictionary(lang);

  return (
    <div className='h-full'>
      <div className='dashboard-widget h-full w-full flex justify-center items-start'>
        <GradeCalculator dict={dict} />
      </div>
    </div>
  )
}
