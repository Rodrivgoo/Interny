"use server"

import { auth } from "@/auth"

export async function LinkSupervisorAction(prevState, formData) {

	let API_URL = process.env.API_URL
	if (!API_URL) {
		console.log('api_url not found, using default localhost:8000')
		API_URL = 'http://localhost:8000'
	}


	// POST TO BACKEND
	try {

		const data = {
			first_name: formData.get('first_name'),
			last_name: formData.get('last_name'),
			email: formData.get('email'),
			internship_id: formData.get('internship_id'),
		}


		const session = await auth()

		const res = await fetch(API_URL + '/dashboard/register-supervisor/', {
			method: 'POST',
			body: JSON.stringify({
				first_name: data.first_name,
				last_name: data.last_name,
				email: data.email,
				internship_id: data.internship_id
			}),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${session.accessToken}`,
			}
		})


		if (!res.ok) {
			return {
				status: 400,
				message: "Invalid credentials"
			}
		}

	} catch (error) {
		console.error('Error in teacher update step: ', error)
		return {
			status: 400,
			message: "Invalid credentials"
		}
	}

	return {
		status: 200,
		message: "success"
	}
}

