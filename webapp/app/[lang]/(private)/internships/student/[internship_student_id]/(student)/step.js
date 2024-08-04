'use client'
import { useEffect, useState } from "react"
import { UpdateStudentInternshipStep } from "@/app/actions/internships/student/updateStep.js"
import { useFormState } from "react-dom"
import { useFormStatus } from "react-dom"
import { useSession } from 'next-auth/react';


export function SubmitButton({ dict }) {
	const { pending } = useFormStatus()

	return (
		<button
			type="submit"
			className="w-[150px] flex justify-center items-center self-end text-white font-semibold bg-[--light-green] dark:bg-[--dark-green] hover:bg-[--dark-green] hover:dark:bg-[--light-green] transition-colors duration-100 rounded-md p-2"
		>
			{pending ?
				<svg xmlns="http://www.w3.org/2000/svg" className="w-[24px] h-[24px] fill-white dark:fill-black animate-spin duration-500" viewBox="0 0 512 512">
					<path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z" />
				</svg>
				:
				dict.internship.widgets.step.save
			}
		</button>
	)
}


export default function StepWidget({ dict, selectedStep, internshipId, internshipStudentId }) {


	// create an empty file with name
	const fileName = selectedStep?.file_key ? selectedStep?.file_key.split('/').pop() : ""
	const initialFile = new File([""], fileName, { type: "text/plain" })

	const [file, setFile] = useState(initialFile)

	const handleFileChange = (e) => {
		if (e.target.files) {
			console.log("setting file")
			setFile(e.target.files[0])
		} else {
			console.log("resetting file")
			setFile("")
		}
	}


	const initialState = {
		status: 0,
		message: "",
	}

	const session = useSession()
	let userId = session.data.user.id
	const UpdateInternshipStepWithId = UpdateStudentInternshipStep.bind(null, userId)
	const [state, formAction] = useFormState(UpdateInternshipStepWithId, initialState)




	function InstructionsButton({ dict }) {

		const handleClickInstructions = async () => {
			console.log('Fetching instructions for ', selectedStep.instructions_key)
			if (typeof window !== 'undefined') {

				const baseUrl = window.location.origin

				const res = await fetch(`${baseUrl}/api/file/private/${selectedStep.instructions_key}`)
				const data = await res.json()
				console.log(data)

				if (data.url) {
					window.open(data.url, '_blank')
				}
			}
		}

		return (
			<div onClick={handleClickInstructions} className="cursor-pointer group">
				<svg className="w-[20px] h-[20px]" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path fillRule="evenodd" clipRule="evenodd" d="M2.75 14C1.7835 14 1 13.2165 1 12.25L1 9.74998C1 9.33576 1.33579 8.99998 1.75 8.99998C2.16421 8.99998 2.5 9.33576 2.5 9.74998L2.5 12.25C2.5 12.388 2.61193 12.5 2.75 12.5H13.25C13.3881 12.5 13.5 12.388 13.5 12.25V9.74998C13.5 9.33576 13.8358 8.99998 14.25 8.99998C14.6642 8.99998 15 9.33576 15 9.74998V12.25C15 13.2165 14.2165 14 13.25 14H2.75Z"
						className="fill-gray-600 dark:fill-gray-400 group-hover:fill-gray-800 group-hover:dark:fill-gray-200" />
					<path d="M7.25 7.68932L7.25 2C7.25 1.58579 7.58578 1.25 8 1.25C8.41421 1.25 8.75 1.58579 8.75 2L8.75 7.68932L10.7197 5.71965C11.0126 5.42675 11.4874 5.42675 11.7803 5.71965C12.0732 6.01254 12.0732 6.48741 11.7803 6.78031L8.53033 10.0303C8.23744 10.3232 7.76256 10.3232 7.46967 10.0303L4.21967 6.78031C3.92678 6.48741 3.92678 6.01254 4.21967 5.71965C4.51256 5.42675 4.98744 5.42675 5.28033 5.71965L7.25 7.68932Z"
						className="fill-gray-600 dark:fill-gray-400 group-hover:fill-gray-800 group-hover:dark:fill-gray-200" />
				</svg>
			</div>
		)

	}



	useEffect(() => {
		let fileInput = document.getElementById('file-upload')
		if (fileInput && !file) {
			fileInput.value = ""
		}
	}, [file])

	useEffect(() => {
		const fileName = selectedStep?.file_key ? selectedStep?.file_key.split('/').pop() : ""
		const initialFile = new File([""], fileName, { type: "text/plain" })
		var fileInput = document.getElementById('file-upload')
		if (fileInput) {
			fileInput.value = ""
		}

		console.log('selectedStep: ', selectedStep)

		setFile(initialFile)


		state.status = 0

	}, [selectedStep])

	useEffect(() => {
		if (state.status === 200) {
			setTimeout(() => {
				window.location.reload()
			}, 2000)
		}
	}, [state.status])




	return (
		<div className='dashboard-widget flex flex-col h-full w-full relative pb-20'>
			<h1 className='text-lg font-semibold'>{dict.internship.widgets.step.title}</h1>
			<div className="">
				{selectedStep == null ?
					(
						<p>{dict.internship.widgets.step.noStep}</p>
					)
					:
					(
						<div className="">
							<div className={`p-2 pl-4 py-4 mb-8 border-b border-gray-200 dark:border-gray-800`}>
								<h3 className='font-semibold mb-2'>{selectedStep.title}</h3>
								<p className='text-sm text-gray-500'> {selectedStep.status === 'done' ? dict.internship.widgets.step.completed : dict.internship.widgets.step.pending}</p>
								{selectedStep.weight > 0 &&
									<p className='text-sm text-gray-500'>{dict.internship.widgets.step.weight}: {selectedStep.weight * 100}%</p>
								}
								<div>

								</div>
							</div>

							<form action={formAction} className="flex flex-col gap-5">
								<div className="flex flex-col md:flex-row gap-4 w-full justify-start">
									<div className="">
										{selectedStep?.instructions_key &&
											<div className="flex flex-row gap-2 items-center mb-7">
												<p className="text-gray-600 dark:text-gray-400">{dict.internship.widgets.step.instructionsFile}</p>
												<InstructionsButton />
											</div>
										}
										<div className="flex gap-3 md:gap-6 flex-col  items-start justify-start">
											<p>{dict.internship.widgets.step.status}: {selectedStep.status == 'done' ? dict.internship.widgets.step.completed : dict.internship.widgets.step.pending}</p>
											<div className="flex flex-col gap-2">
												<p>{dict.internship.widgets.step.file}:</p>
												{file && file?.name != "" ?
													<div className="flex flex-row group justify-between gap-2 items-center min-w-[200px] max-w-[300px] border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-[#1f1f1f] rounded-md p-3">
														<p className="overflow-hidden">{file?.name}</p>
														<div className="cursor-pointer" onClick={handleFileChange}>
															<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path fillRule="evenodd" clipRule="evenodd" d="M6.5 1.75C6.5 1.61193 6.61193 1.5 6.75 1.5H9.25C9.38807 1.5 9.5 1.61193 9.5 1.75V3H6.5V1.75ZM11 1.75V3H13.25C13.6642 3 14 3.33579 14 3.75C14 4.16421 13.6642 4.5 13.25 4.5H2.75C2.33579 4.5 2 4.16421 2 3.75C2 3.33579 2.33579 3 2.75 3H5V1.75C5 0.783502 5.7835 0 6.75 0H9.25C10.2165 0 11 0.783502 11 1.75ZM4.49627 6.67537C4.45506 6.26321 4.08753 5.9625 3.67537 6.00372C3.26321 6.04493 2.9625 6.41247 3.00372 6.82462L3.66367 13.4241C3.75313 14.3187 4.50592 15 5.40498 15H10.595C11.4941 15 12.2469 14.3187 12.3363 13.4241L12.9963 6.82462C13.0375 6.41247 12.7368 6.04493 12.3246 6.00372C11.9125 5.9625 11.5449 6.26321 11.5037 6.67537L10.8438 13.2749C10.831 13.4027 10.7234 13.5 10.595 13.5H5.40498C5.27655 13.5 5.169 13.4027 5.15622 13.2749L4.49627 6.67537Z"
																	className="group-hover:fill-red-500 " />
															</svg>
														</div>
													</div>
													:
													<label
														htmlFor="file-upload"
														className="w-[200px] h-[50px] p-6 border dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-[#1f1f1f] hover:cursor-pointer rounded-md flex flex-col justify-center items-center"
													>
														<div>
															<svg className="w-6 h-6" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path fillRule="evenodd" clipRule="evenodd" d="M7.75 2C7.94891 2 8.13968 2.07902 8.28033 2.21967C8.42098 2.36032 8.5 2.55109 8.5 2.75V7H12.75C12.9489 7 13.1397 7.07902 13.2803 7.21967C13.421 7.36032 13.5 7.55109 13.5 7.75C13.5 7.94891 13.421 8.13968 13.2803 8.28033C13.1397 8.42098 12.9489 8.5 12.75 8.5H8.5V12.75C8.5 12.9489 8.42098 13.1397 8.28033 13.2803C8.13968 13.421 7.94891 13.5 7.75 13.5C7.55109 13.5 7.36032 13.421 7.21967 13.2803C7.07902 13.1397 7 12.9489 7 12.75V8.5H2.75C2.55109 8.5 2.36032 8.42098 2.21967 8.28033C2.07902 8.13968 2 7.94891 2 7.75C2 7.55109 2.07902 7.36032 2.21967 7.21967C2.36032 7.07902 2.55109 7 2.75 7H7V2.75C7 2.55109 7.07902 2.36032 7.21967 2.21967C7.36032 2.07902 7.55109 2 7.75 2Z"
																	className="fill-gray-700"
																/>
															</svg>
														</div>
													</label>
												}
											</div>
										</div>
									</div>
									<div className="flex flex-col items-center w-full justify-evenly">
										<p className="font-medium">{dict.internship.widgets.step.grade}:</p>
										<p
											className="font-medium text-6xl max-w-[170px]"
										>
											{selectedStep.grade}
										</p>
									</div>

								</div>

								<div className="flex flex-col gap-2">
									<p>{dict.internship.widgets.step.addFile}</p>

									<div>
										{selectedStep?.feedback?.length > 0 && selectedStep?.feedback[0].title &&
											<div>
												<p className="font-medium text-lg mb-4">{dict.internship.widgets.step.evaluation}</p>
												{selectedStep.feedback.map((evaluation, index) => {
													return (
														<div key={index} className="flex flex-col gap-3 px-3 py-5 rounded-md my-6 bg-gray-100 dark:bg-[#1f1f1f] border border-[#d9d9d9] dark:border-[#292929]">
															<div className="flex flex-row gap-2">
																<p>{evaluation.title}</p>
																<p className="text-gray-500">{evaluation.weight * 100}%</p>
															</div>
															<div className="flex flex-row gap-2">
																<p>{dict.internship.widgets.step.grade}:</p>
																<p>{evaluation.grade}</p>
															</div>
															<div className="flex flex-col gap-2">
																<p>{dict.internship.widgets.step.commentary}:</p>
																<p>{evaluation.commentary}</p>
															</div>
														</div>
													)
												})}
											</div>
										}
									</div>

									<input type="file" name="file" id="file-upload" className="hidden" onChange={handleFileChange} />
									<input type="hidden" name="internshipStudentId" value={internshipStudentId} className="hidden" />
									<input type="hidden" name="internshipStepId" value={selectedStep?.id} className="hidden" />
									<input type="hidden" name="key" value={file?.name} className="hidden" />
									<input type="hidden" name="commentary" value={''} className="hidden" />
									<input type="hidden" name="feedback" value={selectedStep.feedback} className="hidden" />
									<input type="hidden" name="grade" value={selectedStep.grade} className="hidden" />
									<input type="hidden" name="status" value={selectedStep.status} className="hidden" />

								</div>

								{state.status === 200 && <p className="font-semibold text-green-500">{dict.internship.widgets.step.updateSuccess}</p>}
								{state.status === 400 && <p className="font-semibold text-red-500">{dict.internship.widgets.step.updateError}</p>}
								<div className="absolute bottom-6 right-8">
									<SubmitButton dict={dict} />
								</div>
							</form>
						</div>
					)
				}
			</div>
		</div>
	)
}

