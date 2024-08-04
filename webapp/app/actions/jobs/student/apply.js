'use server'

import { auth } from "@/auth.js"

export async function ApplyToJob(prevState, formData) {

	// post to backend

	// sleep
	await new Promise(r => setTimeout(r, 1000))
	try {
		const API_URL = process.env.API_URL || 'http://localhost:8000'
		const session = await auth()

		const data = {
			description: formData.get('description'),
			job_id: formData.get('job_id')
		}
		const res = await fetch(`${API_URL}/jobs/aplly/${data.job_id}/`, {
			method: 'POST',
			body: JSON.stringify({
				description: data.description
			}),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${session.accessToken}`,
			}
		})

		if (!res.ok) {
			throw new Error('ERROR in request: ', res.status)
		} else {
			return {
				status: 200,
				success: true,
				message: "Applied to job"
			}
		}


	} catch (e) {
		console.error(e)
		return {
			status: 500,
			error: true,
			message: "Error applying to job"
		}
	}

}
