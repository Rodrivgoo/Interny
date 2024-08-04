"use server"

import { auth } from "@/auth.js";

export async function finalEvalAction(prevState, formData) {
	const API_URL = process.env.API_URL || 'http://localhost:8000';

	console.log('MONTHLY EVALUATION ACTION');

	try {

		const session = await auth();

		const payload = {
			evaluation: {
				Grade: formData.get('grade'),
				Comentary: formData.get('comments')
			},
			mandatory: true
		};

		const token = formData.get('token');
		if (!token) {
			console.error('No token provided');
			return { error: 'No token provided' };
		}


		const res = await fetch(`${API_URL}/dashboard/company-evaluation/${token}/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload)
		});


		if (!res.ok) {
			console.error('ERROR in grade request:', res.status);
			throw new Error('Error in grading');
		}

		return {
			success: true
		};

	} catch (error) {
		console.error('ERROR monthly eval action:', error.message);
		return { error: error.message || 'Error in grading' };
	}
}


