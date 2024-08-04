
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function GET(request, { params }) {
	const internshipStudentId = params.internship_student_id
	const internshipStepId = params.internship_step_id



	// fetch the instructions_fileKey from step
	const fileKey = "instructions.pdf"
	//
	const s3Client = new S3Client({});

	const key = `internship/${internshipId}/${stepId}/instructions/${fileKey}`;

	const command = new GetObjectCommand({
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: key,
	});
	console.log('command: ', command)

	if (!command) {
		return
	}

	const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
	console.log('signedUrl: ', signedUrl)

	return Response.json({ url: signedUrl })
}
