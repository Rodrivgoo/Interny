'use client'
import { BriefCaseIcon, LocationIcon, MonitorIcon, PlusIcon } from '@/app/icons.js'

import { useEffect, useState } from "react"
import { useFormState } from "react-dom"
import { useFormStatus } from "react-dom"
import { NewJob } from '@/app/actions/jobs/company/newJob.js'

export function NewJobForm({ dict, data }) {


	const [state, formAction] = useFormState(NewJob, "")


	const [job, setJob] = useState({
		title: "",
		company_name: "",
		company_logo: "",
		city: "",
		region: "",
		arrangement: "",
	})

	const handleChange = (event) => {
		const { value, name } = event.target
		setJob({ ...job, [name]: value })
	}


	const [universities, setUniversities] = useState([''])
	if (data.length != 0) {
		data.map((career) => {
			universities.includes(career.university) ? null : setUniversities([...universities, career.university])
		})
	}
	const [selectedUniversity, setSelectedUniversity] = useState('')
	const [selectedCareer, setSelectedCareer] = useState('')

	const [selectedCareers, setSelectedCareers] = useState([])


	useEffect(() => {
		selectedCareers.map((careerId) => {
			let name = data.find((career) => career.id === careerId)
		})
	}, [selectedCareers])

	return (
		<form action={formAction} className='flex flex-col gap-4 border border-gray-200 dark:border-gray-800 rounded-xl p-7 w-full max-w-[700px]  bg-[#fafafa] dark:bg-[#161616] '>
			<div className='flex flex-row gap-3 items-center pb-2'>
				<h1 className='text-2xl font-semibold'>{dict.jobs.newJob}</h1>
				<div className='flex flex-col'>
					<p className="text-gray-700 text-xl dark:text-gray-200 font-medium">{job.company_name}</p>
				</div>
			</div>
			<div className='flex flex-col gap-1 items-start'>
				<label className='text-gray-700 dark:text-gray-200'>{dict.jobs.form.title}</label>
				<input
					type='text'
					name='title'
					placeholder={dict.jobs.form.titlePlaceholder}
					className='border border-gray-300 dark:border-gray-800 rounded-md p-2 w-full'
					value={job.title}
					onChange={handleChange}
					required
				/>
			</div>
			<div className='flex flex-col gap-1 items-start'>
				<div className='flex flex-row gap-2 items-center'>
					<LocationIcon width={20} height={20} className='fill-gray-500 dark:fill-gray-300' />
					<p className="text-gray-700 dark:text-gray-200">{dict.jobs.form.city} - {dict.jobs.form.region}</p>
				</div>
				<div className='flex flex-row gap-1 justify-center w-full'>
					<input
						placeholder={dict.jobs.form.city}
						type='text'
						name='city'
						className='border border-gray-300 dark:border-gray-800 rounded-md p-2 w-full'
						value={job.city}
						onChange={handleChange}
						required
					/>
					<input
						placeholder={dict.jobs.form.region}
						type='text'
						name='region'
						className='border border-gray-300 dark:border-gray-800 rounded-md p-2 w-full'
						value={job.region}
						onChange={handleChange}
						required
					/>
				</div>
			</div>
			<div className='flex flex-col gap-1 items-start'>
				<div className='flex flex-row gap-2 items-center'>
					<MonitorIcon width={20} height={20} className='fill-gray-500 dark:fill-gray-300' />
					<p className='text-gray-700 dark:text-gray-200'>{dict.jobs.form.arrangement}</p>
				</div>

				<input
					placeholder={dict.jobs.form.arrangementPlaceholder}
					type='text'
					name='arrangement'
					className='border border-gray-300 dark:border-gray-800 rounded-md p-2 w-full'
					value={job.arrangement}
					onChange={handleChange}
					required
				/>
			</div>
			<div className='flex flex-col gap-1 items-start'>
				<div className='flex flex-row gap-2 items-center'>
					<BriefCaseIcon width={20} height={20} className='fill-gray-500 dark:fill-gray-300' />
					<p className='text-gray-700 dark:text-gray-200'>{dict.jobs.form.employment}</p>
				</div>

				<input
					placeholder={dict.jobs.form.employmentPlaceholder}
					type='text'
					name='employment'
					className='border border-gray-300 dark:border-gray-800 rounded-md p-2 w-full'
					value={job.employment}
					onChange={handleChange}
					required
				/>
			</div>


			<div className="flex flex-row items-end justify-center gap-3">
				<div className="flex flex-col w-full">
					<label htmlFor="username" className="text-gray-700 dark:text-gray-200"> {dict.jobs.form.university} </label>
					<select
						className='border border-gray-300 dark:border-gray-800 rounded-md p-2 w-full'
						type=""
						name=""
						placeholder="UAI"
						required
						onChange={(e) => setSelectedUniversity(e.target.value)}
						value={selectedUniversity || ""}
					>
						{universities.map((university, index) => (
							<option key={index}>{university}</option>
						))
						}

					</select>
				</div>
				<div className="flex flex-col w-full">
					<label htmlFor="username" className="text-gray-700 dark:text-gray-200"> {dict.jobs.form.career} </label>
					<select
						className='border border-gray-300 dark:border-gray-800 rounded-md p-2 w-full'
						type=""
						placeholder=""
						value={selectedCareer}
						onChange={(e) => setSelectedCareer(e.target.value)}
					>
						<option value=''></option>
						{data.map((career, index) => {
							if (career.university == selectedUniversity) {
								return <option key={index} value={career.id}>{career.name}</option>
							}

						})}
					</select>
				</div>
				<button
					className='p-2 border-2 border-gray-300 rounded-md dark:border-gray-600 text-lg font-bold max-h-[40px] hover:bg-gray-200 dark:hover:bg-gray-800'
					onClick={() => {
						if (selectedCareers.includes(selectedCareer) || selectedCareer === '') {
							return
						}
						setSelectedCareers([...selectedCareers, selectedCareer])
					}}

					type='button'
				>

					<PlusIcon width={20} height={20} className='fill-gray-500 dark:fill-gray-400' />
				</button>
			</div>
			{selectedCareers.length > 0 && (

				<div className=''>
					<p className='text-sm text-gray-500 mb-2'>{dict.jobs.form.selectedCareers}:</p>
					{selectedCareers.map((careerId, index) => (
						<div key={index} className='inline-block mr-2 my-1 group'>
							<div className='group flex flex-row gap-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 rounded-md px-2 py-1'>
								<p className=''>
									{data.find((career) => career.id === careerId)?.name} - {data.find((career) => career.id === careerId)?.university}
								</p>
								<button
									type='button'
									className='hidden group-hover:block'
									onClick={() => {
										setSelectedCareers(selectedCareers.filter((career) => career !== careerId))
									}}
								>
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path fillRule="evenodd" clipRule="evenodd" d="M6.5 1.75C6.5 1.61193 6.61193 1.5 6.75 1.5H9.25C9.38807 1.5 9.5 1.61193 9.5 1.75V3H6.5V1.75ZM11 1.75V3H13.25C13.6642 3 14 3.33579 14 3.75C14 4.16421 13.6642 4.5 13.25 4.5H2.75C2.33579 4.5 2 4.16421 2 3.75C2 3.33579 2.33579 3 2.75 3H5V1.75C5 0.783502 5.7835 0 6.75 0H9.25C10.2165 0 11 0.783502 11 1.75ZM4.49627 6.67537C4.45506 6.26321 4.08753 5.9625 3.67537 6.00372C3.26321 6.04493 2.9625 6.41247 3.00372 6.82462L3.66367 13.4241C3.75313 14.3187 4.50592 15 5.40498 15H10.595C11.4941 15 12.2469 14.3187 12.3363 13.4241L12.9963 6.82462C13.0375 6.41247 12.7368 6.04493 12.3246 6.00372C11.9125 5.9625 11.5449 6.26321 11.5037 6.67537L10.8438 13.2749C10.831 13.4027 10.7234 13.5 10.595 13.5H5.40498C5.27655 13.5 5.169 13.4027 5.15622 13.2749L4.49627 6.67537Z"
											className="fill-red-400" />
									</svg>
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			<div className='flex flex-col gap-1 items-start'>
				<label className='text-gray-700 dark:text-gray-200'>{dict.jobs.form.about}</label>

				<textarea
					placeholder={dict.jobs.form.aboutPlaceholder}
					type='text'
					name='about'
					className='resize-none h-[300px] border border-gray-300 dark:border-gray-800 rounded-md p-2 w-full'
					value={job.about}
					required
					onChange={handleChange}
				/>
			</div>

			<input type='hidden' name='careers' value={selectedCareers} />

			<SubmitButton dict={dict} />
			{state && (
				<div className={`mt-4 p-3 rounded ${state.success ? 'bg-green-100 text-green-700' : state.error ? 'bg-red-100 text-red-700' : ''}`}>
					{state.success ? dict.jobs.form.newSuccess
						:
						state.error ? dict.jobs.form.newError
							:
							""
					}
				</div>
			)}
		</form>
	)
}

function SubmitButton({ dict }) {
	const { pending } = useFormStatus()

	return (
		<button
			type="submit"
			className="w-[120px] h-[32px] flex justify-center items-center self-end text-white font-semibold bg-[--light-green] dark:bg-[--dark-green] hover:bg-[--dark-green] hover:dark:bg-[--light-green] transition-colors duration-100 rounded-md px-2 py-1">
			{pending ?
				<svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] fill-white dark:fill-black animate-spin duration-500" viewBox="0 0 512 512">
					<path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z" />
				</svg>
				:
				dict.jobs.form.update
			}
		</button>
	)
}
