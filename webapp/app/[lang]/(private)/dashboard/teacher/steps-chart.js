'use client'

import { PieChart, legendClasses, pieArcClasses, pieArcLabelClasses } from '@mui/x-charts/PieChart'
import { useTheme } from 'next-themes';

export default function TeacherStepsChartWidget({ data, dict }) {

    const { theme } = useTheme();
    const darkMode = theme === 'dark';

    const newData = []

    if (data.length > 0) {
        data.map((student) => {
            if (newData.some((item) => item.id === student.step)) {
                const index = newData.findIndex((item) => item.id === student.step)
                newData[index].value += 1
            } else {
                newData.push({ id: student.step, value: 1, label: `${dict.dashboard.teacher.widgets.studentsList.step} ${student.step}` })
            }
        })
    }
    newData.sort((a, b) => a.id - b.id)

    const pieChartParams = {
        colors: ['#03045e', '#023e8a', '#0077b6', '#0096c7', '#00b4d8', '#48cae4', '#90e0ef', '#ade8f4'],
        series: [
            {
                data: newData,
                highlightScope: { faded: 'global', highlighted: 'item' },
            },
        ],
        slotProps: {
            legend: {
                labelStyle: {
                    fontSize: 14,
                    fontWeight: 600,
                }
            },
        },
        sx: {
            [`& .${pieArcClasses.root}`]: {
                stroke: 'none',
            },
        },
        tooltip: {
            trigger: 'item',
        },
        width: 450,
        height: 250
    }

    return (
        <div className='dashboard-widget md:row-start-2 row-span-1 py-10 '>
            {/* <p>Steps chart</p> */}
            <div className='w-full h-full flex justify-center items-center'>

                {/* <style>
                    {`.MuiChartsTooltip-root {
                        background-color: ${darkMode ? '#2c2c2c' : 'white'};
                        color: ${darkMode ? 'white' : 'black'};
                    }`}
                </style> */}
                <PieChart {...pieChartParams}
                />
            </div>


        </div>
    )
}
