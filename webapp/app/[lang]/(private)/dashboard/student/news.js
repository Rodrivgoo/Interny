import React from 'react'

export default function NewsWidget({ dict }) {

  const data = [
    {
      title: dict.dashboard.student.widgets.news.mock.title,
      description: dict.dashboard.student.widgets.news.mock.description,
      date: "12-07-2024",
      minToRead: 2
    }
  ]

  return (
    <div className='dashboard-widget max-h-[250px] overflow-y-auto'>
      <h1 className='text-md font-semibold mb-2'>{dict.dashboard.student.widgets.news.title}</h1>
      <div className='w-full'>
        {data.map(news => (
          <div key={news.title} className='flex flex-col gap-1 border-t border-gray-200 dark:border-gray-700 pt-2'>
            <h2 className='font-semibold text-blue-950 dark:text-blue-300'>{news.title}</h2>
            <p className='text-sm text-gray-500 dark:text-gray-400'>{news.description}</p>
            <p className='text-xs text-gray-500 dark:text-gray-400'>{news.date} - {news.minToRead} {dict.dashboard.student.widgets.news.minToRead} </p>
          </div>
        ))}

      </div>
    </div>
  )
}
