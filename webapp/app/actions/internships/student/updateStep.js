
"use server"
import { auth } from "@/auth"
import { getObjectUrl } from "../../files/s3"
import { SaveFileAction } from "../../files/save"

export async function UpdateStudentInternshipStep(userId, prevState, formData) {



	const fileKey = formData.get('key')
	const key = "internship-student/" + formData.get('internshipStudentId') + "/step/" + formData.get('internshipStepId') + "/" + formData.get('key')
	formData.delete('key')
	formData.append("key", key)



	try {
		// if file is not type File don't save it
		if (formData.get('file')?.constructor == File && formData.get('file')?.size > 0) {
			console.log('file is type File')
			await SaveFileAction(prevState, formData)
			let fileUrl = getObjectUrl(key)
		} else {
			console.log('file is not type File')
		}
	} catch (error) {
		return {
			status: 400,
			message: "Error uploading file"
		}
	}

	let API_URL = process.env.API_URL
	if (!API_URL) {
		API_URL = 'http://localhost:8000'
	}

	// POST TO BACKEND
	try {
		const date = new Date()
		const formattedDate = date.toISOString().slice(0, 10);
		const data = {
			internshipStudentId: formData.get('internshipStudentId'),
			internshipStepId: formData.get('internshipStepId'),
			fileKey: fileKey,
			feedback: formData.get('feedback'),
			status: formData.get('status'),
			commentary: formData.get('commentary'),
			grade: formData.get('grade'),
		}

		const session = await auth()


		const res = await fetch(API_URL + '/dashboard/' + data.internshipStudentId + '/' + data.internshipStepId + '/', {
			method: 'POST',
			body: JSON.stringify({
				status: data.status,
				file_key: fileKey,
				date_completed: formattedDate,
				commentary: data.commentary,
				feedback: data.feedback,
				grade: data.grade,
			}),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${session.accessToken}`,
			}
		})

		if (!res.ok) {
			console.log('ERROR UPDATING INTERNSHIP STEP', res.status)
			return {
				status: 400,
				message: "Invalid credentials"
			}
		}

	} catch (error) {
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
