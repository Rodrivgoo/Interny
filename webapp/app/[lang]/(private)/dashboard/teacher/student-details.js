
import Link from 'next/link'

export default function TeacherStudentDetailsWidget({ dict, selectedStudent }) {
  return (
    <div className='dashboard-widget h-min w-full '>
      <h2 className="text-lg font-semibold mb-3">{dict.dashboard.teacher.widgets.studentDetails.title}</h2>
      {selectedStudent ?
        (
          <div className='flex flex-col gap-8 '>
            <div className="">
              <div>
                <h3><span className='font-semibold'>{dict.dashboard.teacher.widgets.studentDetails.student}:</span> {selectedStudent.name}</h3>
                <h3><span className='font-semibold'>{dict.dashboard.teacher.widgets.studentDetails.company}:</span> {selectedStudent.company_name}</h3>
                <h3><span className='font-semibold'>{dict.dashboard.teacher.widgets.studentDetails.supervisors}:</span> {selectedStudent.name}</h3>
              </div>
            </div>

            <div>
              {/* <Link href={"/internships/student/" + selectedStudent.id}>Evaluar</Link> */}
              <Link
                href={"/internships/student/" + selectedStudent.internship_student_id}
                className='px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white dark:bg-blue-800 hover:dark:bg-blue-900 rounded-md font-semibold'
              >
                {dict.dashboard.teacher.widgets.studentDetails.evaluate}
              </Link>
            </div>
            <div>
              <div className='mx-3 mt-5 mb-0'>
                {selectedStudent.steps && selectedStudent.steps.map((step, index) => (
                  <div className='flex flex-row gap-2 overflow-visible' key={index} >
                    <svg className='w-[30px] h-[80px] overflow-visible'>
                      {!(selectedStudent.steps.length === index + 1) &&
                        <line x1="10" y1="16" x2="10" y2="83" className={`${step.status === "done" && (selectedStudent.steps[index + 1].status === "done") ? "stroke-black dark:stroke-gray-300" : "stroke-gray-400 dark:stroke-gray-600"} stroke-[5px]`} />
                      }
                      <circle
                        cx="10"
                        cy="10"
                        r="7"
                        className={`fill-none ${step.status === "done" ? "stroke-black dark:stroke-gray-300" : "stroke-gray-400 dark:stroke-gray-600"} stroke-[5px]`}
                      />
                    </svg>
                    <div className=''>
                      <h4 className='font-medium'>{step.title}</h4>
                      {step.status === "done" &&
                        <p className='text-gray-400 dark:text-gray-500'>{step.date}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )

        :

        (
          <p>{dict.dashboard.teacher.widgets.studentDetails.noSelectedStudent}</p>
        )
      }
    </div >
  )
}
