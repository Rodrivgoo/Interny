'use client'
import { useEffect, useState } from 'react'
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';



export default function FirstInternshipWidget({ dict, data }) {

    // the last internship is the current one

    const internship = {
        name: dict.dashboard.student.widgets.internship.title,
        progress: 60,
        company: {
            name: 'Netflix',
            logo: 'https://interny.s3.sa-east-1.amazonaws.com/public/companies/ideQwN5lBE/logo.png',
            color: '#005AD6',
        }
    }

    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (data?.internship?.status == 'done') {
            setProgress(100)
        } else {
            let stepsLen = data?.steps?.length
            let completedSteps = data?.steps?.filter(step => step.status == 'Completed').length
            let percentage = (completedSteps / stepsLen) * 100
            setProgress(percentage)
        }
    }, [data])

    console.log('Progress: ', progress)



    return (
        <div className='dashboard-widget max-h-[250px]'>
            {Object.keys(data).length != 0 ?
                <div className='flex flex-col gap-3'>
                    <div className='flex flex-row justify-between items-center'>
                        <div>
                            <h2 className='text-base font-semibold'>{data?.internship_name}</h2>
                            <h3 className='text-base font-medium text-gray-500'>{data?.company_name}</h3>
                        </div>
                        <img alt='Logo' className='max-w-[100px] h-[50px]' src={'https://interny.s3.sa-east-1.amazonaws.com/public/companies/' + data?.company_logo} />
                    </div>
                    <div className=''>
                        <div className='flex justify-center items-center w-32 z-0'>
                            <Gauge
                                width={128}
                                height={128}
                                value={progress}
                                innerRadius='80%'
                                sx={() => ({
                                    [`& .${gaugeClasses.valueText}`]: {
                                        fontSize: 24,
                                        fontWeight: 500,
                                    },
                                    [`& .${gaugeClasses.valueArc}`]: {
                                        fill: internship.company.color,
                                    },
                                })}
                                text={
                                    ({ value }) => `${value}%`
                                }
                            />
                        </div>

                    </div>
                </div>
                :
                <>
                    <h2 className='text-base font-semibold'>{dict.dashboard.student.widgets.internship.title}</h2>
                    <h3 className='text-base font-medium text-gray-500'>{dict.dashboard.student.widgets.internship.tbt}</h3>
                </>
            }

        </div>
    )
}


// <svg className='absolute top-0 left-0 w-32 h-32 -rotate-90'>
//     <circle
//         style={{ transition: 'stroke-dashoffset 0.35s' }}
//         stroke={internship.company.color}
//         strokeWidth="8"
//         strokeDasharray="340"
//         // 30 -> 340
//         strokeDashoffset={`calc((${percentage} * 310 / 100) + 30)`}
//         strokeLinecap="square"
//         cx="64"
//         cy="64"
//         r="50"
//         fill='transparent'
//     ></circle>
// </svg>
// <p className={`text-[${internship.company.color}] font-extrabold absolute top-0 left-0 w-full h-full flex justify-center items-center ml-1 text-2xl`}>
//     {internship.progress}%
// </p>
