import Link from 'next/link'
import Image from 'next/image'
import getPublicCompanyLogo from '@/app/_utils/logos.js'
import offersmock from './offersmock.json'
import { auth } from '@/auth.js'


export default async function OffersWidget({ dict }) {

	// const data = offersmock.offers

	const API_URL = process.env.API_URL || 'http://localhost:8000'

	let data = []

	try {
		const session = await auth()
		const res = await fetch(`${API_URL}/jobs`, {
			headers: {
				'Authorization': `Bearer ${session.accessToken}`
			}
		})
		data = await res.json()
	} catch (error) {
		console.error(error)
	}


	return (
		<div className="dashboard-widget min-h-[300px] h-min overflow-y-scroll max-h-[500px]">
			<h1 className="font-semibold text-lg">{dict.internships.widgets.offers.title}</h1>
			<div className="w-full mt-3">
				{data.map((job, index) => (
					<Link
						href={`/jobs/${job.job_id}`}
						key={index}
						className='flex flex-row gap-3 py-3 px-2 justify-start items-start border-t border-gray-300 dark:border-[#2f2f2f]  hover:cursor-pointer hover:bg-[#eaeaea] hover:dark:bg-[#2f2f2f]'
					>
						<Image src={getPublicCompanyLogo(job.company_logo)} alt={job.company_name} width={50} height={50} />
						<div>
							<h3 className='font-semibold hover:underline text-blue-950 dark:text-blue-200'>{job.title}</h3>
							<p className='text-sm font-medium'>{job.company_name}</p>
							<p className='text-sm text-gray-500'>{job.city} - {job.region}</p>
							<p className='text-sm text-gray-500'>{job.arrangement}</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}
