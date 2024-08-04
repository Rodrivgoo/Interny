'use client'
import { useEffect, useState } from "react"
import { UpdateTeacherInternshipStep } from "@/app/actions/internships/teacher/updateInternshipStep.js"
import { useFormState } from "react-dom"
import { useFormStatus } from "react-dom"


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
	const initialState = {
		status: 0,
		message: "",
	}

	console.log('selectedStep: ', selectedStep)

	const [state, formAction] = useFormState(UpdateTeacherInternshipStep, initialState)


	function FileButton() {
		const handleClickFile = async () => {
			if (typeof window !== 'undefined') {

				const baseUrl = window.location.origin

				const res = await fetch(`${baseUrl}/api/file/internship-student/${internshipStudentId}/step/${selectedStep.id}/${selectedStep.file_key}`)
				const data = await res.json()

				if (data.url) {
					window.open(data.url, '_blank')
				}
			}
		}
		return (
			<div onClick={handleClickFile} className="cursor-pointer group">
				<svg className="w-[20px] h-[20px]" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path fillRule="evenodd" clipRule="evenodd" d="M2.75 14C1.7835 14 1 13.2165 1 12.25L1 9.74998C1 9.33576 1.33579 8.99998 1.75 8.99998C2.16421 8.99998 2.5 9.33576 2.5 9.74998L2.5 12.25C2.5 12.388 2.61193 12.5 2.75 12.5H13.25C13.3881 12.5 13.5 12.388 13.5 12.25V9.74998C13.5 9.33576 13.8358 8.99998 14.25 8.99998C14.6642 8.99998 15 9.33576 15 9.74998V12.25C15 13.2165 14.2165 14 13.25 14H2.75Z"
						className="fill-gray-600 dark:fill-gray-400 group-hover:fill-gray-800 group-hover:dark:fill-gray-200" />
					<path d="M7.25 7.68932L7.25 2C7.25 1.58579 7.58578 1.25 8 1.25C8.41421 1.25 8.75 1.58579 8.75 2L8.75 7.68932L10.7197 5.71965C11.0126 5.42675 11.4874 5.42675 11.7803 5.71965C12.0732 6.01254 12.0732 6.48741 11.7803 6.78031L8.53033 10.0303C8.23744 10.3232 7.76256 10.3232 7.46967 10.0303L4.21967 6.78031C3.92678 6.48741 3.92678 6.01254 4.21967 5.71965C4.51256 5.42675 4.98744 5.42675 5.28033 5.71965L7.25 7.68932Z"
						className="fill-gray-600 dark:fill-gray-400 group-hover:fill-gray-800 group-hover:dark:fill-gray-200" />
				</svg>
			</div>
		)
	}
	function InstructionsButton() {
		const handleClickInstructions = async () => {
			if (typeof window !== 'undefined') {

				const baseUrl = window.location.origin

				const res = await fetch(`${baseUrl}/api/file/internship/${internshipId}/${selectedStep.id}/instructions`)
				if (!res.ok) {
					return
				}
				const data = await res.json()
				// console.log(data)

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

	const [grade, setGrade] = useState(selectedStep?.grade || 0)
	const [evaluation, setEvaluation] = useState(selectedStep?.feedback || [])
	const [evaluationString, setEvaluationString] = useState('')

	useEffect(() => {
		let newGrade = 0
		evaluation.forEach(e => {
			newGrade += e.grade * e.weight
		})
		setGrade(newGrade.toFixed(2))

		setEvaluationString(JSON.stringify(evaluation))
	}, [evaluation])

	const handleGradeChange = (e) => {
		let value = e.target.value
		if (value != '' && (value > 7 || value < 1) || (value.length > 4)) {
			console.log('grade must be between 1 and 7')
			return
		}
		setGrade(value)
	}

	const handleEvaluationGradeChange = (e, index) => {
		let value = e.target.value
		if (value != '' && (value > 7 || value < 1) || (value.length > 4)) {
			console.log('grade must be between 1 and 7')
			return
		}
		setEvaluation(prevState => {
			const newState = [...prevState]
			newState[index].grade = value
			return newState
		})
	}

	const handleEvaluationCommentaryChange = (e, index) => {
		let value = e.target.value
		setEvaluation(prevState => {
			const newState = [...prevState]
			newState[index].commentary = value
			return newState
		})
	}

	const [currentStatus, setCurrentStatus] = useState(selectedStep?.status || '')
	const handleSelectChange = (e) => {
		setCurrentStatus(e.target.value)
	}


	useEffect(() => {
		setCurrentStatus(selectedStep?.status || '')
		setEvaluation(selectedStep?.feedback || [])
		state.status = 0

	}, [selectedStep])

	useEffect(() => {
		if (state.status === 200) {
			setTimeout(() => {
				window.location.reload()
			}, 1000)
		}
	}, [state.status])


	return (
		<div className='dashboard-widget flex flex-col h-full w-full relative pb-10'>
			<h1 className='text-lg font-semibold'>{dict.internship.widgets.step.title}</h1>
			<div className="">
				{selectedStep == null ?
					(
						<p>{dict.internship.widgets.step.noStep}</p>
					)
					:
					(
						<div className="mb-10">
							<div className={`p-2 pl-4 py-4 mb-8 border-b border-gray-200 dark:border-gray-800`}>
								<h3 className='font-semibold mb-2'>{selectedStep.title}</h3>
								<p className='text-sm text-gray-500'> {selectedStep.status === 'Completed' ? dict.internship.widgets.step.completed : dict.internship.widgets.step.pending}</p>
								{selectedStep.weight > 0 &&
									<p className='text-sm text-gray-500'>{dict.internship.widgets.step.weight}: {selectedStep.weight * 100}%</p>
								}
								<p className='text-sm text-gray-500'>{dict.internship.widgets.step.grade}: {selectedStep?.grade}</p>
							</div>


							<form action={formAction} className="flex flex-col gap-5 w-full">
								<div className="flex flex-col md:flex-row gap-4 w-full justify-start">
									<div className="">
										{selectedStep?.instructions_key &&
											<div className="flex flex-row gap-2 items-center mb-7">
												<p className="text-gray-600 dark:text-gray-400">{dict.internship.widgets.step.instructionsFile}</p>
												<InstructionsButton />
											</div>
										}
										<div className="flex gap-3 md:gap-6 flex-col md:flex-row items-start justify-start">
											<div className="flex flex-col gap-2 max-w-[200px]">
												<label>{dict.internship.widgets.step.status}</label>
												<select
													name="status"
													id="status"
													className="rounded-sm pr-5 py-2 pl-1 w-min"
													required
													value={currentStatus}
													onChange={handleSelectChange}
												>
													<option value="Completed">{dict.internship.widgets.step.completed}</option>
													<option value="pending">{dict.internship.widgets.step.pending}</option>
												</select>
											</div>
											<div className="flex flex-col gap-2">
												<p>{dict.internship.widgets.step.file}:</p>
												<div className="flex flex-row  justify-between gap-4 items-center min-w-[200px] max-w-[300px]  border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-[#1f1f1f] rounded-md p-3">
													<p className="overflow-hidden text-gray-500 dark:text-gray-300">{selectedStep.file_key ?
														selectedStep.file_key.split('/').pop()
														:
														dict.internship.widgets.step.noFile}</p>
													{selectedStep.file_key &&
														<FileButton />
													}
												</div>
											</div>
										</div>
									</div>
									<div className="flex flex-col gap-2 items-center w-full justify-evenly">
										<p className="font-semibold">{dict.internship.widgets.step.grade}:</p>
										<input
											className="font-medium text-6xl max-w-[170px] shadow-md rounded-md pl-3 dark:bg-[#141414] border border-gray-200 dark:border-gray-800"
											type="number"
											value={grade}
											onChange={handleGradeChange}
										/>
									</div>

								</div>

								<div>
									{evaluation.length > 0 && evaluation[0].title &&
										<div>
											<p className="font-medium text-lg mb-4">{dict.internship.widgets.step.evaluation}</p>
											{evaluation.map((evaluation, index) => {
												return (
													<div key={index} className="flex flex-col gap-3 px-3 py-5 rounded-md my-6 bg-gray-100 dark:bg-[#1f1f1f] border border-[#d9d9d9] dark:border-[#292929]">
														<div className="flex flex-row gap-2">
															<p>{evaluation.title}</p>
															<p className="text-gray-500">{evaluation.weight * 100}%</p>
														</div>
														<div className="flex flex-row gap-2">
															<p>{dict.internship.widgets.step.grade}:</p>
															<input className="max-w-[65px] rounded-md pl-2 dark:bg-[#141414] border border-gray-200 dark:border-gray-800" type="number" value={evaluation.grade} onChange={(e) => handleEvaluationGradeChange(e, index)} />
														</div>
														<label>{dict.internship.widgets.step.commentary}:</label>
														<textarea
															className="w-full resize-none h-24 p-2 dark:bg-[#141414] border border-gray-200 dark:border-gray-800 rounded-md"
															placeholder={dict.internship.widgets.step.commentaryPlaceholder}
															value={evaluation.commentary}
															onChange={(e) => handleEvaluationCommentaryChange(e, index)}>
														</textarea>
													</div>
												)
											})}
											{grade != selectedStep.grade &&
												<p>{dict.internship.widgets.step.newGrade}: {grade}</p>

											}
										</div>
									}
								</div>


								<input type="hidden" name="internshipStepId" value={selectedStep?.id} className="hidden" />
								<input type="hidden" name="internshipStudentId" value={internshipStudentId} className="hidden" />
								<input type="hidden" name="feedback" value={evaluationString} className="hidden" />
								<input type="hidden" name="grade" value={grade || 0} className="hidden" />
								<input type="hidden" name="commentary" value={""} className="hidden" />
								<input type="hidden" name="file_key" value={selectedStep?.file_key} className="hidden" />
								<input type="hidden" name="date_completed" value={selectedStep?.date_completed} className="hidden" />
								<input type="hidden" name="internship_grade" value={0} className="hidden" />


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

// {
// 	"title": "Introducción",
// 	"weight": 0.4,
// 	"commentary": "comentario del profesor..",
// 	"grade": 0
// },
