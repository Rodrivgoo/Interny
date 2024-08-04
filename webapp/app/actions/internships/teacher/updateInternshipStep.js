"use server"

import { auth } from "@/auth"

export async function UpdateTeacherInternshipStep(prevState, formData) {

	let API_URL = process.env.API_URL
	if (!API_URL) {
		console.log('api_url not found, using default localhost:8000')
		API_URL = 'http://localhost:8000'
	}


	// POST TO BACKEND
	try {

		const date = new Date()
		const formattedDate = date.toISOString().slice(0, 10);
		const data = {
			internshipStudentId: formData.get('internshipStudentId'),
			internshipStepId: formData.get('internshipStepId'),
			feedback: formData.get('feedback'),
			status: formData.get('status'),
			commentary: formData.get('commentary'),
			grade: formData.get('grade'),
			file_key: formData.get('file_key'),
			completed_date: formData.get('completed_date'),
			internship_grade: formData.get('internship_grade'),
		}

		if (isNaN(data.grade)) {
			data.grade = 0
		}

		const session = await auth()
		let isFinalStep = false

		try {

			const res = await fetch(`${API_URL}/dashboard/${data.internshipStudentId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${session.accessToken}`,
				},
			})


			if (!res.ok) {
				console.error('ERROR in request: ')
			}

			const internshipData = await res.json()
			const steps = internshipData.steps
			// get the last step
			const lastStep = steps[steps.length - 1]
			if (lastStep.id === data.internshipStepId && data.status === 'Completed') {
				isFinalStep = true
			}

			console.log('isFinalStep: ', isFinalStep)
			if (isFinalStep) {
				data.internship_grade = await calculateInternshipGrade(steps, data.grade, session.accessToken, data.internshipStudentId)
				console.log('CALCULATED INTERNSHIP GRADE: ', data.internship_grade)
			}

		} catch (error) {
			console.error('ERROR FETCHING STUDENT DASHBOARD: ', error)
		}


		const res = await fetch(API_URL + '/dashboard/' + data.internshipStudentId + '/' + data.internshipStepId + '/', {
			method: 'POST',
			body: JSON.stringify({
				status: data.status,
				file_key: data.file_key,
				date_completed: data.completed_date || formattedDate,
				commentary: data.commentary,
				feedback: data.feedback,
				grade: data.grade == NaN ? 0 : data.grade,
				internship_grade: data.internship_grade,
			}),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${session.accessToken}`,
			}
		})


		if (!res.ok) {
			await res.json()
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

async function calculateInternshipGrade(steps, finalStepGrade, token, internship_student_id) {
	// hardcoded for práctica profesional
	let API_URL = process.env.API_URL
	if (!API_URL) {
		console.log('api_url not found, using default localhost:8000')
		API_URL = 'http://localhost:8000'
	}
	console.log('CALCULATING INTERNSHIP GRADE')
	let grade = 0

	for (let i = 0; i < steps.length; i++) {
		const step = steps[i]
		// if is the last step
		if (i === steps.length - 1) {
			console.log('STEP GRADE: ', finalStepGrade, "*", step.weight, "=", finalStepGrade * step.weight)
			grade += finalStepGrade * step.weight
		} else {
			if (step.grade && step.weight != 0) {
				console.log('STEP GRADE: ', step.grade, "*", step.weight, "=", step.grade * step.weight)
				grade += step.grade * step.weight
			}
		}
	}

	// get the supervisors evaluations:
	try {
		const res = await fetch(`${API_URL}/dashboard/get-evaluations/${internship_student_id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
		})

		const data = await res.json()


		const company_evaluations = data.company_evaluations
		const supervistor_evaluations = data.supervisor_evaluations

		let company_grade = 0
		let supervisor_grade = 0

		if (company_evaluations.length > 0) {
			console.log('COMPANY EVALUATIONS: ', company_evaluations)
			for (let i = 0; i < company_evaluations.length; i++) {
				company_grade += Number(company_evaluations[i].Grade)
			}
			company_grade = company_grade / company_evaluations.length
		}

		if (supervistor_evaluations.length > 0) {
			console.log('SUPERVISOR EVALUATIONS: ', supervistor_evaluations)
			for (let i = 0; i < supervistor_evaluations.length; i++) {
				supervisor_grade += Number(supervistor_evaluations[i].Grade)
			}
			supervisor_grade = supervisor_grade / supervistor_evaluations.length
		}


		grade += company_grade * 0.15
		grade += supervisor_grade * 0.15

		console.log('SUPERVISOR EVALUATIONS: ', data)

	} catch (error) {
		console.error('ERROR FETCHING evaluations data: ', error)
	}



	// get the company evaluations:

	return grade.toFixed(2) || 0
}
