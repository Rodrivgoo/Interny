import getPublicCompanyLogo from "@/app/_utils/logos.js"
import { auth } from "@/auth.js"
import Image from 'next/image'
import Link from 'next/link'

export default async function CompanyDashboard({ dict }) {

	const API_URL = process.env.API_URL || 'http://localhost:8000'

	let data = []
	let companyData = []

	try {
		const session = await auth()
		const res = await fetch(`${API_URL}/jobs`, {
			headers: {
				'Authorization': `Bearer ${session.accessToken}`
			}
		})
		data = await res.json()

		const companyRes = await fetch(`${API_URL}/dashboard/`, {
			headers: {
				'Authorization': `Bearer ${session.accessToken}`
			}
		})
		companyData = await companyRes.json()
		companyData = companyData.my_info
	} catch (error) {
		console.error(error)
	}



	return (
		<div className="flex flex-col xl:flex-row items-start gap-6 justify-center">
			<div className="dashboard-widget flex flex-col md:flex-row gap-6 md:gap-10 py-10 items-center justify-center">
				<Image src={getPublicCompanyLogo(companyData.logo)} alt={companyData.first_name} width={200} height={200} />
				<div>
					<h1 className="text-4xl font-semibold">{companyData.first_name}</h1>
					<p className="text-lg font-medium text-gray-600 black:text-gray-500">{companyData.email}</p>
				</div>
			</div>
			<div className="dashboard-widget">
				<h1 className="text-lg font-medium mb-3">{dict.dashboard.company.widgets.internships.title}</h1>
				<div className="max-h-[450px] overflow-y-auto mb-6">
					{data.length > 0 ? (
						data.map((job, index) => (
							<div
								key={index}
								className='py-3 px-2 border-t border-gray-300 dark:border-[#2f2f2f]'
							>
								<div>
									<Link href={`/jobs/${job.job_id}`} className='font-semibold hover:underline text-blue-950 dark:text-blue-200'>{job.title}</Link>
									<p className='text-sm font-medium'>{job.company_name}</p>
									<p className='text-sm text-gray-500'>{job.city} - {job.region}</p>
									<p className='text-sm text-gray-500'>{job.arrangement}</p>
									<div className="flex flex-row gap-2 mt-2">
										<Link
											href={`/jobs/candidates/${job.job_id}`}
											className="px-2 py-1 text-gray-800 dark:text-gray-200 font-semibold bg-gray-200 hover:bg-gray-400 dark:bg-gray-800 hover:dark:bg-gray-600 transition-colors duration-100 rounded-md"
										>
											{dict.dashboard.company.widgets.internships.candidates}
										</Link>
										<Link
											href={`/jobs/${job.job_id}`}
											className="px-2 py-1 text-violet-800 dark:text-violet-200 font-semibold bg-violet-200 hover:bg-violet-400 dark:bg-violet-800 hover:dark:bg-violet-600 transition-colors duration-100 rounded-md"
										>
											{dict.dashboard.company.widgets.internships.edit}
										</Link>
									</div>
								</div>
							</div>

						))
					) : (
						<p>{dict.dashboard.company.widgets.internships.noInternships}</p>
					)}
				</div>
				<Link href="/jobs/new/" className="px-3 py-2 text-white font-semibold bg-[--light-green] dark:bg-[--dark-green] hover:bg-[--dark-green] hover:dark:bg-[--light-green] transition-colors duration-100 rounded-md">
					{dict.dashboard.company.widgets.internships.addInternship}
				</Link>
			</div>
		</div>
	)
}
