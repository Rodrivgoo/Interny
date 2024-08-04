import InternshipClientComponent from "./client"
import Link from "next/link"
import mock from './mock.json'
import InternshipDetailsWidget from "./details"
import logger from "@/logger.js"
import { auth } from "@/auth"

export default async function StudentInternshipPage({ dict, internship_student_id }) {

	let data = {}

	let API_URL = process.env.API_URL
	if (!API_URL) {
		API_URL = 'http://localhost:8000'
	}

	try {

		const session = await auth()
		const res = await fetch(`${API_URL}/dashboard/${internship_student_id}/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${session.accessToken}`,
			},
		})

		if (!res.ok) {
			throw new Error('Error fetching teacher dashboard data')
		}
		data = await res.json()
		// console.log('fetch to: ', `${API_URL}/dashboard/${internship_student_id}/`)
		// console.log('token: ', session.accessToken)
		// console.log("data: ", data)

	} catch (error) {
		console.error('error fetching internship data: ', error)
		logger.error({
			message: 'Error internship data',
		});
	}

	// data = mock
	// fetch data using session auth token

	return (
		<div className='flex flex-col w-full'>
			<div className="flex flex-row gap-3 items-center">
				<Link href="/internships" className="bg-gray-200 dark:bg-gray-800 rounded-full w-[30px] h-[30px] flex justify-center items-center">
					<svg className="w-[20px] h-[20px]" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path className="fill-gray-700 dark:fill-gray-400" fillRule="evenodd" clipRule="evenodd" d="M7.78033 12.5303C7.48744 12.8232 7.01256 12.8232 6.71967 12.5303L2.46967 8.28033C2.17678 7.98744 2.17678 7.51256 2.46967 7.21967L6.71967 2.96967C7.01256 2.67678 7.48744 2.67678 7.78033 2.96967C8.07322 3.26256 8.07322 3.73744 7.78033 4.03033L4.81066 7H12.25C12.6642 7 13 7.33579 13 7.75C13 8.16421 12.6642 8.5 12.25 8.5H4.81066L7.78033 11.4697C8.07322 11.7626 8.07322 12.2374 7.78033 12.5303Z" />
					</svg>
				</Link>
				<h1 className='font-semibold text-xl'>{data?.student} - {data?.internship_name}</h1>
			</div>
			<div className='h-full w-full grid grid-cols-1 grid-rows-[auto,auto,auto] xl:grid-rows-[minmax(200px,300px),auto,auto] gap-8 xl:grid-cols-[_1fr,_1fr] my-4'>
				<div className='col-span-1 row-span-1'>
					<InternshipDetailsWidget internshipStudentId={internship_student_id} dict={dict} data={data} />
				</div>
				<InternshipClientComponent data={data} dict={dict} />
			</div>
		</div>
	)
}
