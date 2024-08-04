import { auth } from '@/auth.js'
import { JobForm } from './jobForm.js'



export default async function CompanyJobPage({ job_id, dict }) {

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
		console.log(data)
	} catch (error) {
		console.error(error)
	}

	if (Object.keys(data).length === 0) {
		return (
			<div>
				<h1>Not Found</h1>
			</div>
		)
	}

	return (
		<div className="w-full flex flex-col justify-center items-center pt-5">
			<div className="flex flex-col gap-4 w-full items-center pb-10">
				<JobForm dict={dict} data={data} job_id={job_id} />
			</div>
		</div>
	)
}
