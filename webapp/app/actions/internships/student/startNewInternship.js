"use server"

import { HeadObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { SaveFileFunction } from "../../files/save"
import { auth } from "@/auth"


export async function StartNewInternship(prevState, formData) {

	let API_URL = process.env.API_URL
	if (!API_URL) {
		console.log('API_URL not found, using default localhost:8000')
		API_URL = 'http://localhost:8000'
	}


	try {
		const internship = {
			internshipId: formData.get('internship_id'),
			teacherId: formData.get('teacher_id'),
			companyName: formData.get('company_name'),
			companyLogo: formData.get('company_logo'),
			companyId: formData.get('company_id'),
			startDate: formData.get('startDate'),
			endDate: formData.get('endDate'),
			description: formData.get('description'),
		}

		let logoKey = ""
		if (internship.companyName != "") {
			logoKey = await saveCompanyLogo(internship.companyLogo, internship.companyId)
		}

		// post to backend

		// {
		//   "internship_id": 3,
		//   "teacher_id": 23,
		//   "company_name": "UAI",
		//   "company_logo": "UAIlogo.png",
		//   "startDate": "2024-05-30",
		//   "endDate": "2024-06-30",
		//   "description": "Text"
		// }
		const session = await auth()
		const res = await fetch(`${API_URL}/dashboard/link-internship/`, {
			method: 'POST',
			body: JSON.stringify({
				internship_id: internship.internshipId,
				teacher_id: internship.teacherId,
				company_name: internship.companyName,
				company_logo: logoKey,
				startDate: internship.startDate,
				endDate: internship.endDate,
				description: internship.description
			}),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${session.accessToken}`,
			}

		})


		if (!res.ok) {
			console.error('ERROR in post link-internship: ')
			throw new Error('Error in request', res.status)
		}

	} catch (error) {
		console.log('catched error: ', error)
		return {
			status: 400,
			message: "Invalid credentials"
		}
	}

	return {
		status: 200,
		message: "success"
	}
};


async function saveCompanyLogo(companyLogo, companyId) {
	console.log("saving logo...")
	console.log("companyLogo: ", companyLogo)
	console.log("companyId: ", companyId)


	// check if logo exists in s3
	try {
		const s3Client = new S3Client({});
		let res = await s3Client.send(
			new HeadObjectCommand({
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: 'public/companies/' + companyId + "/logo.png",
			})
		);
		console.log("logo png exists in s3")
		return companyId + "/logo.png"
	} catch (error) {
		console.log('logo png does not exist in s3')
	}
	try {
		const s3Client = new S3Client({});
		let res = await s3Client.send(
			new HeadObjectCommand({
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: 'public/companies/' + companyId + "/logo.jpeg",
			})
		);
		console.log("logo jpeg exists in s3")
		return companyId + "/logo.jpeg"

	} catch (error) {
		console.log('logo png does not exist in s3')
	}

	// companyLogo = 'https://asset.brandfetch.io/idL0iThUh6/idls3LaPPQ.png'
	const url = 'https://api.brandfetch.io/v2/brands/' + companyId
	try {
		let res = await fetch(url, {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: 'Bearer ' + process.env.BRANDFETCH_API_KEY
			}
		})

		res = await res.json()
		const logos = res.logos
		const symbol = logos.filter(logo => logo.type === "symbol")[0];
		let icon = logos.filter(logo => logo.type === "icon")[0];
		if (symbol == undefined || symbol.formats[0].format == 'svg') {
			console.log('symbol not found')
			if (icon == undefined) {
				console.log('icon not found')
				throw new Error('No logo found')
			}
		} else {
			console.log('symbol found')
			icon = symbol
		}

		const iconFormats = icon.formats
		const iconUrl = iconFormats[0].src
		const iconFormat = iconFormats[0].format
		console.log('iconUrl: ', iconUrl)


		res = await fetch(iconUrl, {
			method: 'GET',
		})

		const blob = await res.blob();
		const body = new Uint8Array(await blob.arrayBuffer())

		const fileKey = 'public/companies/' + companyId + "/logo." + iconFormat
		await SaveFileFunction(fileKey, body)
		console.log("saved file to s3")

		return companyId + "/logo." + iconFormat

	}

	catch (error) {
		console.log('catched error: ', error)
		throw new Error('Error in request')
	}

}
