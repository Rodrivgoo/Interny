import { auth } from "@/auth"
import { NewJobForm } from "./newJobForm"
import { getDictionary } from "@/app/[lang]/dictionaries"



export default async function NewJobPage({ params: { lang } }) {
	const session = await auth()
	const dict = await getDictionary(lang)

	if (session.role !== 'company') {
		return (
			<div>
				<h1>Not Found</h1>
			</div>
		)
	}


	let data = []
	try {

		const API_URL = process.env.API_URL || 'http://localhost:8000'
		let res = await fetch(API_URL + '/dashboard/select-career/', {
			method: 'GET',
			headers: {
				accept: 'application/json',
			}
		})

		res = await res.json()
		data = res?.careers || []
	} catch (error) {
		console.error('ERROR FETCHING CAREERS: ', error)
	}

	return (
		<div className="w-full flex items-center justify-center">
			<NewJobForm dict={dict} data={data} />
		</div>
	)
}
