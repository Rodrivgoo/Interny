import Image from 'next/image'
import getPublicCompanyLogo from '@/app/_utils/logos.js'
import mock from './jobmock.json'
import { BriefCaseIcon, LocationIcon, MonitorIcon } from '@/app/icons.js'
import ApplicationForm from './applicationForm.js'
import { auth } from '@/auth.js'

export default async function StudentJobPage({ job_id, dict }) {

	const API_URL = process.env.API_URL || 'http://localhost:3000'
	const session = await auth()

	let data = {}

	try {
		const res = await fetch(`${API_URL}/jobs/${job_id}`, {
			headers: {
				'Authorization': `Bearer ${session.accessToken}`
			}
		})
		data = await res.json()

	} catch (error) {
		console.error(error)
	}


	return (
		<div className="w-full flex flex-col justify-center items-center pt-5">
			<div className="flex flex-col md:flex-row gap-4 w-full justify-center">
				<div className="flex flex-col gap-2 border border-gray-200 dark:border-gray-800 rounded-xl p-7 max-w-[500px]  bg-[#fafafa] dark:bg-[#161616] ">
					<div className='flex flex-row gap-3 items-center pb-2'>
						<Image src={getPublicCompanyLogo(data.company_logo)} alt={data.company} width={60} height={60} />
						<div className='flex flex-col'>
							<p className="text-gray-700 dark:text-gray-200 font-medium">{data.company_name}</p>
						</div>
					</div>
					<h1 className="text-2xl font-medium">{data.title}</h1>
					<div className='flex flex-row gap-2 items-center'>
						<LocationIcon width={20} height={20} className='fill-gray-500' />
						<p className="text-gray-700 dark:text-gray-400">{data.city} - {data.region}</p>
					</div>
					<div className='flex flex-row gap-2 items-center'>
						<MonitorIcon width={20} height={20} className='fill-gray-500' />
						<p className='text-gray-700 dark:text-gray-400'>{data.arrangement}</p>
					</div>
					<div className='flex flex-row gap-2 items-center'>
						<BriefCaseIcon width={20} height={20} className='fill-gray-500' />
						<p className='text-gray-700 dark:text-gray-400'>{data.employment}</p>
					</div>
					<p className='pt-2 text-sm text-gray-700 dark:text-gray-200'>{data.about}</p>
				</div>

				<div className="w-full max-w-[400px]">
					<h1 className='text-2xl font-medium mb-5'>{dict.jobs.apply}</h1>
					<ApplicationForm job_id={job_id} dict={dict} />
				</div>
			</div>
		</div>
	)
}
