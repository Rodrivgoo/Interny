import { getDictionary } from "@/app/[lang]/dictionaries.js"
import { auth } from "@/auth.js"



export default async function CandidatesPage({ params: { lang, job_id } }) {
	const dict = await getDictionary(lang)

	let data = {}
	try {
		const session = await auth()

		const API_URL = process.env.API_URL || 'http://localhost:8000'


		const res = await fetch(`${API_URL}/jobs/aplly/${job_id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${session.accessToken}`,
			},
		})

		data = await res.json()


	} catch (e) {
		console.error(e)
	}


	return (
		<div className="w-full flex flex-col items-center justify-center">
			<div className="max-w-[800px]">
				<h1 className="text-xl font-medium mb-3">{dict.jobs.candidates.title}</h1>
				{data.length > 0 ? (
					<div className="flex flex-col gap-5">
						{data.map((candidate, index) => (
							<div
								key={index}
								className='flex flex-col gap-2 items-start p-3 px-4 border border-gray-300 dark:border-[#2f2f2f] rounded-xl shadow-lg'
							>
								<h3 className='font-semibold text-lg text-blue-950 dark:text-blue-200'>{candidate.student_name}</h3>
								<p className='text-sm font-medium'>{dict.jobs.candidates.email}: {candidate.student_email}</p>
								<p className='text-sm font-medium'>{dict.jobs.candidates.message}:</p>
								<p className="text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded-xl w-full max-h-[200px] overflow-y-auto">{candidate.description}</p>
							</div>
						))}
					</div>
				) : (
					<p>{dict.jobs.candidates.noCandidates}</p>
				)}
			</div>

		</div>
	)
}
