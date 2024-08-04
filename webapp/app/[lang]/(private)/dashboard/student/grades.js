import React from 'react'

export default function NewsWidget({ dict }) {
  return (
    <div className='dashboard-widget max-h-[250px]'>
      <h1 className='text-md font-semibold mb-2'>{dict.dashboard.student.widgets.news.title}</h1>
      <div className='w-full'>


      </div>
    </div>
  )
}
