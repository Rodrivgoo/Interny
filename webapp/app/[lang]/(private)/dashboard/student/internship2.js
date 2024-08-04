import React from 'react'

export default function SecondInternshipWidget({ dict, data }) {

  return (
    <div className='dashboard-widget pb-0'>
      {Object.keys(data).length != 0 ?
        <div>
          <div className='flex flex-row justify-between items-start'>
            <div>
              <h2 className='text-base font-semibold'>{data?.internship_name}</h2>
              <h3 className='text-base font-medium text-gray-500'>{data?.company_name}</h3>
            </div>
            <img className='max-w-[70px]' src={'https://interny.s3.sa-east-1.amazonaws.com/public/companies/' + data?.company_logo} />
          </div>


          <div className='mx-3 my-5'>
            {data?.steps && data?.steps.map((step, index) => (
              <div className='flex flex-row gap-2 overflow-visible' key={index} >
                <svg className='w-[30px] h-[80px] overflow-visible'>
                  {!(data?.steps.length === index + 1) &&
                    <line x1="10" y1="16" x2="10" y2="83" className={`${step.status === "Completed" && (data?.steps[index + 1].status === "Completed") ? "stroke-black dark:stroke-gray-100" : "stroke-gray-400 dark:stroke-gray-600"} stroke-[5px]`} />
                  }
                  <circle
                    cx="10"
                    cy="10"
                    r="7"
                    className={`fill-none ${step.status === "Completed" ? "stroke-black dark:stroke-gray-300" : "stroke-gray-400 dark:stroke-gray-600"} stroke-[5px]`}
                  />
                </svg>
                <div className=''>
                  <h4 className='font-medium'>{step.title}</h4>
                  {step.status === "Completed" &&
                    <p className='text-gray-400 dark:text-gray-500'>{step.date_completed}</p>
                  }
                </div>
                <p></p>
              </div>
            ))}
          </div>
        </div>
        :
        <>
          <h2 className='text-base font-semibold'>{dict.dashboard.student.widgets.internship2.title}</h2>
          <h3 className='text-base font-medium text-gray-500'>{dict.dashboard.student.widgets.internship2.tbt}</h3>
        </>
      }

    </div>
  )
}
