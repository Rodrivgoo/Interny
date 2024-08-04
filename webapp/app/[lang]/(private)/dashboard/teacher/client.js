'use client'
import React, { useState } from 'react'
import TeacherStudentsListWidget from './students-list';
import TeacherStudentDetailsWidget from './student-details';

export default function TeacherDashboardClientComponent({ data, dict }) {

    const [selectedStudent, setSelectedStudent] = useState(null);
    console.log("SELECTED STUDENT: ", selectedStudent)

    return (
        <>
            <div className='col-span-1 row-start-1 row-span-1 min-h-[250px] '>
                <TeacherStudentsListWidget data={data} dict={dict} selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} />
            </div>
            <div className='col-span-1 xl:row-span-3'>
                <TeacherStudentDetailsWidget dict={dict} selectedStudent={selectedStudent} />
            </div>
        </>
    )
}
