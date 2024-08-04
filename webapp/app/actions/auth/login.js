
"use server"

import { signIn } from "@/auth.js"

export async function credentialsLoginAction(prevState, formData) {


	try {
		const credentials = {
			email: formData.get('email'),
			password: formData.get('password')
		}
		await signIn("credentials", {
			email: credentials.email,
			password: credentials.password,
			redirect: false
		})



		console.log('logged in: ', credentials.email)
		return {
			success: true
		}


	} catch (error) {
		console.log('catched error: ', error)
		return {
			message: "Invalid credentials"
		}
	}

}
