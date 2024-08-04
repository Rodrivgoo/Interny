
import { redirect } from 'next/navigation'

export async function GET(request, { params }) {
	const internshipId = params.internship
	const stepId = params.step

	// fetch the step data from api

	let data = {}

	const mockData = {
		"id": "2",
		"title": "Evaluación supervisores",
		"status": "done",
		"fileKey": "instructions",
	}

	data = mockData





	redirect('https://nextjs.org/')
}
