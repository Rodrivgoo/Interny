
"use server"

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

export async function SaveFileAction(prevState, formData) {

	console.log("IN SAVE FILE SERVER ACTION")

	// get the body from form data
	const file = formData.get('file')
	const fileBuffer = await file.arrayBuffer()

	const body = new Uint8Array(fileBuffer)
	const key = formData.get('key')

	// throw new Error('Error in request')
	console.log('saving file with key: ', key)

	try {
		const s3Client = new S3Client({});

		await s3Client.send(
			new PutObjectCommand({
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: key,
				Body: body,
			})
		);

		console.log("saved file to s3")
	}

	catch (error) {
		console.log('catched error: ', error)
		return {
			status: 400,
			message: "Invalid credentials"
		}
	}
	return {
		status: 200,
		message: "success",
		fileUrl: "urll"
	}
};

export async function SaveFileFunction(key, body) {
	const s3Client = new S3Client({});

	try {
		await s3Client.send(
			new PutObjectCommand({
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: key,
				Body: body,
			})
		);
		console.log("saved file to s3, key: ", key)

	} catch (error) {
		console.log('catched error: ', error)
		throw new Error('Error in request')
	}
}
