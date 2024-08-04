import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function GET(request, { params }) {
	const internshipId = params.internship_id
	const stepId = params.step_id
	const fileKey = params.file_key


	// fetch the instructions_fileKey from step
	//
	const s3Client = new S3Client({});

	console.log('fetching in S3: ', `internship/${internshipId}/${stepId}/${fileKey}`)

	const key = `internship/${internshipId}/${stepId}/instructions/${fileKey}`;

	try {

		const command = new GetObjectCommand({
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: key,
		});

		const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 5 });

		return Response.json({ url: signedUrl })

	} catch (error) {
		return Response.json({ error: error.message }, { status: 500 })
	}


}
