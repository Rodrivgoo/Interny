'use client'
import Image from 'next/image'
import getPublicCompanyLogo from '@/app/_utils/logos.js'
import { BriefCaseIcon, LocationIcon, MonitorIcon } from '@/app/icons.js'

import { useEffect, useState } from "react"
import { useFormState } from "react-dom"
import { useFormStatus } from "react-dom"
import { UpdateJob } from '@/app/actions/jobs/company/updateJob.js'

export function JobForm({ dict, job_id, data }) {
	const [state, formAction] = useFormState(UpdateJob, "")


	const [job, setJob] = useState(data)

	const handleChange = (event) => {
		const { value, name } = event.target
		setJob({ ...job, [name]: value })
	}

	return (
		<form action={formAction} className='flex flex-col gap-4 border border-gray-200 dark:border-gray-800 rounded-xl p-7 w-full max-w-[700px]  bg-[#fafafa] dark:bg-[#161616] '>
			<div className='flex flex-row gap-3 items-center pb-2'>
				<Image src={getPublicCompanyLogo(job.company_logo)} alt={job.company} width={60} height={60} />
				<div className='flex flex-col'>
					<p className="text-gray-700 text-xl dark:text-gray-200 font-medium">{job.company_name}</p>
				</div>
			</div>
			<div className='flex flex-col gap-1 items-start'>
				<label className='text-gray-700 dark:text-gray-200'>{dict.jobs.form.title}</label>
				<input
					type='text'
					name='title'
					className='border border-gray-300 dark:border-gray-800 rounded-md p-2 w-full'
					value={job.title}
					onChange={handleChange}
					required
				/>
			</div>
			<div className='flex flex-col gap-1 items-start'>
				<div className='flex flex-row gap-2 items-center'>
					<LocationIcon width={20} height={20} className='fill-gray-500' />
					<p className="text-gray-700 dark:text-gray-400">{dict.jobs.form.city} - {dict.jobs.form.region}</p>
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
					<MonitorIcon width={20} height={20} className='fill-gray-500' />
					<p className='text-gray-700 dark:text-gray-400'>{dict.jobs.form.arrangement}</p>
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
					<BriefCaseIcon width={20} height={20} className='fill-gray-500' />
					<p className='text-gray-700 dark:text-gray-400'>{dict.jobs.form.employment}</p>
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
			<div className='flex flex-col gap-1 items-start'>
				<label className='text-gray-700 dark:text-gray-200'>{dict.jobs.form.about}</label>

				<textarea
					placeholder={dict.jobs.form.aboutPlaceholder}
					type='text'
					name='about'
					className='resize-none h-[300px] border border-gray-300 dark:border-gray-800 rounded-md p-2 w-full'
					value={job.about}
					onChange={handleChange}
				/>
			</div>

			<input type='hidden' name='job_id' value={job_id} />

			<SubmitButton dict={dict} />
			{state && (
				<div className={`mt-4 p-3 rounded ${state.success ? 'bg-green-100 text-green-700' : state.error ? 'bg-red-100 text-red-700' : ''}`}>
					{state.success ? dict.jobs.form.updateSuccess
						:
						state.error ? dict.jobs.form.updateError
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
