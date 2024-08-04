import { auth } from "@/auth.js"
import StudentJobPage from "./studentJob.js"
import { getDictionary } from "@/app/[lang]/dictionaries.js"
import CompanyJobPage from "./_company/companyJob.js"


export default async function JobPage({ params: { job_id, lang } }) {
	const dict = await getDictionary(lang)
	const session = await auth()
	console.log('SESSION: ', session.role)

	switch (session.role) {
		case 'student':
			return (
				<StudentJobPage job_id={job_id} dict={dict} />
			)
		case 'company':
			return (
				<CompanyJobPage job_id={job_id} dict={dict} />
			)
		default:
			return (
				<div>
					<h1>Not Found</h1>
				</div>
			)
	}
}
