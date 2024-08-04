
'use server'
import { auth } from "@/auth"




export async function NewJob(prevState, formData) {



	try {
		const data = {
			"job_id": formData.get('job_id'),
			"company_name": formData.get('company_name'),
			"title": formData.get('title'),
			"region": formData.get('region'),
			"city": formData.get('city'),
			"arrangement": formData.get('arrangement'),
			"employment": formData.get('employment'),
			"about": formData.get('about'),
			"careers": formData.get('careers'),
		}

		if (!data.careers) {
			throw new Error('No careers were specified')
		}

		const API_URL = process.env.API_URL || 'http://localhost:8000'

		const session = await auth()
		const res = await fetch(`${API_URL}/jobs/`, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${session.accessToken}`,
			}
		})


		if (!res.ok) {
			throw new Error('ERROR in request: ', res.status)
		}

		return {
			success: true,
		}


	}
	catch (error) {
		console.error('ERROR UPDATING JOB: ', error)
		return {
			error: true,
			success: false,
		}
	}
}
