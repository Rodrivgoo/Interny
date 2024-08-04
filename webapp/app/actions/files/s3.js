

export function getObjectUrl(key) {
	const bucket = process.env.AWS_BUCKET_NAME;
	const region = process.env.AWS_REGION;

	const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

	return url
}
