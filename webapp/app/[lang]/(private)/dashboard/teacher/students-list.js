import React from 'react';



export default function TeacherStudentsListWidget({ dict, data, selectedStudent, setSelectedStudent }) {
  // log the last student


  return (
    <div className='dashboard-widget pb-0 px-0 overflow-clip flex flex-col  '>
      <h3 className='pb-3 pl-5 pr-3 text-lg font-semibold'>{dict.dashboard.teacher.widgets.studentsList.title}</h3>
      {data.length > 0 ?
        <div className='max-h-[350px] max-w-full overflow-x-hidden overflow-y-scroll border-t border-gray-200 dark:border-gray-800'>
          {data.map((student) => (
            <div
              onClick={() => setSelectedStudent(student)}
              key={student.id}
              className={`p-2 pl-4 py-4 border-b border-gray-200 dark:border-gray-800 cursor-pointer ${selectedStudent?.internship_student_id === student.internship_student_id ? 'bg-gray-200 dark:bg-[#1f1f1f]' : 'hover:bg-gray-100 dark:hover:bg-gray-950'}`}>
              <h3 className='font-semibold'>{student.name}</h3>
              <p className='text-sm text-gray-500 '>{dict.dashboard.teacher.widgets.studentsList.step} {student.step}</p>
            </div>
          ))}
        </div>
        :
        <div>
          <p className='pl-5 text-gray-500 dark:text-gray-400'>{dict.dashboard.teacher.widgets.studentsList.noStudents}</p>
        </div>
      }
    </div>
  );
}
