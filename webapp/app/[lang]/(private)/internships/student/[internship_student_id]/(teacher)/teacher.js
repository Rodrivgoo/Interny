
import { auth } from '@/auth.js'
import InternshipTeacherClientComponent from './client.js'
import InternshipTeacherDetailsWidget from './details.js'

export default async function TeacherInternshipPage({ dict, internship_student_id }) {

	let API_URL = process.env.API_URL
	if (!API_URL) {
		API_URL = 'http://localhost:8000'
	}

	let data = {}
	const session = await auth()

	try {

		const res = await fetch(`${API_URL}/dashboard/${internship_student_id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${session.accessToken}`,
			},
		})

		if (!res.ok) {
			console.error('ERROR in request: ', res.status)
		}

		data = await res.json()


	} catch (error) {
		console.error('ERROR FETCHING STUDENT DASHBOARD: ', error)
	}

	// data = mock

	return (
		<div className=''>
			<div className='flex flex-col md:flex-row md:gap-3 items-start '>
				<h1 className='font-semibold text-lg'>{data?.student}</h1>
				<h1 className='font-medium text-base md:text-lg  dark:text-gray-400 '>{data?.internship_name} - {data?.career}</h1>
			</div>
			<div className='h-full w-full grid grid-cols-1 grid-rows-[auto,auto,auto] xl:grid-rows-[minmax(200px,250px),auto,auto] gap-8 xl:grid-cols-[_2fr,_3fr] my-4'>
				<div className='col-span-1 row-span-1'>
					<InternshipTeacherDetailsWidget dict={dict} data={data} />
				</div>
				<InternshipTeacherClientComponent data={data} dict={dict} />
			</div>
		</div>
	)
}

