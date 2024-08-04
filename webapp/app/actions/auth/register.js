
"use server"
import { signIn } from "@/auth.js"
import logger from "@/logger"

export async function credentialsRegisterAction(prevState, formData) {
	let API_URL = process.env.API_URL
	if (!API_URL) {
		API_URL = 'http://localhost:8000'
	}


	try {
		const res = await fetch(API_URL + '/authenticate/register/', {
			method: 'POST',
			body: JSON.stringify({
				username: formData.get('username'),
				email: formData.get('email'),
				password: formData.get('password'),
				first_name: formData.get('first_name'),
				last_name: formData.get('last_name'),
				career_id: formData.get('career_id'),
				terms: '1.0.0'
			}),
			headers: { 'Content-Type': 'application/json' }
		});

		// if success, login with the credentials

		if (!res.ok) {
			console.log('ERROR REGISTRING USER')
			// parse the response
			const parsedRes = await res.json()
			if (parsedRes?.username == "custom user with this username already exists.") {
				console.log('username already exists')
				return {
					message: "username already exists"
				}
			} else if (parsedRes?.email == "custom user with this email already exists.") {
				return {
					message: "email already exists"
				}
			} else if (parsedRes?.non_field_errors) {
				return {
					message: "password error"
				}
			}

			return {
				message: "Error inesperado"
			}
		}

		await signIn("credentials", {
			email: formData.get('email'),
			password: formData.get('password'),
			redirect: false
		})

		logger.info({
			message: 'user registrated successfully',
			email: formData.get('email')
		});

		return {
			success: true
		}

	} catch (error) {
		console.error('catched error: ', error)
		return {
			message: "Error in register"
		}
	}
}
