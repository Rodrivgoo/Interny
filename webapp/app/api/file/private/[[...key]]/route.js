



import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function GET(request, { params }) {
	let fileKey = ''
	const keys = params.key
	for (let i = 0; i < keys.length; i++) {
		if (i === keys.length - 1) {
			fileKey += keys[i]
		} else {
			fileKey += keys[i] + '/'
		}
	}

	const s3Client = new S3Client({});

	const command = new GetObjectCommand({
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: fileKey,
	});

	if (!command) {
		return
	}

	const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

	return Response.json({ url: signedUrl })
}
