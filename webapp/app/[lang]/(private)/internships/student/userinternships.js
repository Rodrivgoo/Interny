import { auth } from '@/auth'
import CircleCheck from '@/public/icons/circle-check.svg'
import CircleLines from '@/public/icons/circle-lines.svg'
import Image from 'next/image'
import Link from 'next/link'

async function getInternshipData(apiURL, internshipId) {

	const session = await auth()
	let data = {}

	try {
		const res = await fetch(`${apiURL}/dashboard/${internshipId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${session.accessToken}`,
			},
		})

		if (!res.ok) {
			console.error('ERROR: ', res)
		}

		data = await res.json()
	} catch (error) {
		console.error('error fetching internship: ', internshipId, error)
	}

	return data
}

export default async function UserInternshipsWidget({ dict, data }) {


	let newData = []

	let API_URL = process.env.API_URL
	if (!API_URL) {
		API_URL = 'http://localhost:8000'
	}

	for (let i = 0; i < data.length; i++) {
		const internship = data[i]
		const newInternshipData = await getInternshipData(API_URL, internship.id)
		newData.push({
			internship_name: newInternshipData.internship_name,
			company_name: newInternshipData.company_name,
			start_date: newInternshipData.start_date,
			end_date: newInternshipData.end_date,
			status: newInternshipData.status,
			internship_student_id: internship.id
		})
	}

	return (
		<div className="dashboard-widget">
			<h1 className='text-lg font-semibold'>{dict.internships.widgets.userInternships.title}</h1>
			<div className="flex flex-col justify-center items-center gap-4 mt-3">
				{newData.map((internship, index) => (
					<Link href={`internships/student/${internship.internship_student_id}`} key={index} className="w-full p-3 flex flex-row justify-between items-center gap-2 bg-[#f7f7f7] hover:bg-[#eaeaea] dark:bg-[#1c1c1c] hover:dark:bg-[#2f2f2f] border border-gray-200 dark:border-gray-800">
						<div>
							<p className="text-lg font-semibold hover:underline">{internship.internship_name}</p>
							<p className="text-base mb-1 text-gray-800 dark:text-gray-200">{internship.company_name}</p>
							<p className="text-xs md:text-sm text-gray-500">{internship.start_date} / {internship.end_date}</p>
						</div>
						<div>
							<Image src={internship.status === 'done' ? CircleCheck : CircleLines} alt="check" width={54} height={54} />
						</div>
					</Link>
				))}

			</div>
		</div>
	)
}
// <Link href={`/internships/new`} className='bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-900 px-3 py-2 rounded-md text-sm'>
// 	{dict.internships.widgets.userInternships.addInternship}
// </Link>
