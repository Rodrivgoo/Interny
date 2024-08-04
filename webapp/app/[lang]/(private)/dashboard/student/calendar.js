'use client'
import React from 'react'
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';


export default function CalendarWidget({ events, dict }) {

    return (
        <div className='dashboard-widget xl:pb-10 '>
            <h1 className='text-md font-semibold mb-2'>{dict.dashboard.student.widgets.calendar.title}</h1>
            <div className='flex justify-center items-center'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar />
                </LocalizationProvider>
            </div>
        </div>
    )
}
