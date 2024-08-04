'use server'
import { auth } from "@/auth"

export async function UpdateJob(prevState, formData) {



	try {
		const data = {
			"job_id": formData.get('job_id'),
			"company_name": formData.get('company_name'),
			"title": formData.get('title'),
			"region": formData.get('region'),
			"city": formData.get('city'),
			"arrengement": formData.get('arrangement'),
			"employment": formData.get('employment'),
			"about": formData.get('about')
		}

		const API_URL = process.env.API_URL || 'http://localhost:8000'

		const session = await auth()
		const res = await fetch(`${API_URL}/jobs/${data.job_id}/`, {
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
		console.error('ERROR UPDATING JOB: ')
		return {
			error: true,
			success: false,
		}
	}
}
