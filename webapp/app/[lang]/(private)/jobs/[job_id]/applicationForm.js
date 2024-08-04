'use client'
import { ApplyToJob } from "@/app/actions/jobs/student/apply.js"
import { useFormState } from "react-dom"
import { useFormStatus } from "react-dom"

export default function ApplicationForm({ dict, job_id }) {

	const initialState = {
		status: 0,
		message: "",
	}


	const [state, formAction] = useFormState(ApplyToJob, initialState)

	return (
		<form action={formAction} className="flex flex-col w-full items-start gap-2">
			<label htmlFor="message" className="text-sm">{dict.jobs.message}</label>
			<textarea
				name="description"
				className="border border-gray-200 dark:border-gray-800 rounded-md resize-none focus:outline-none p-2 min-h-[200px] h-full max-h-[400px] w-full"
			/>
			<input type="hidden" name="job_id" value={job_id} />
			<div className="flex gap-2 flex-col md:flex-row-reverse justify-between items-center w-full">
				<SubmitButton dict={dict} />
				<p
					className={`font-semibold ${state?.status === 200 || state?.status === 201 ? "text-green-600 dark:text-green-500" : "text-red-500 dark:text-red-500"}`} >
					{state?.status === 0 ?
						""
						:
						state?.status === 200 ?
							dict.jobs.success
							:
							dict.jobs.error
					}
				</p>
			</div>
		</form>
	)
}

function SubmitButton({ dict }) {
	const { pending } = useFormStatus()

	return (
		<button
			type="submit"
			className="w-[100px] h-[32px] flex justify-center items-center self-end text-white font-semibold bg-[--light-green] dark:bg-[--dark-green] hover:bg-[--dark-green] hover:dark:bg-[--light-green] transition-colors duration-100 rounded-md px-2 py-1">
			{pending ?
				<svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] fill-white dark:fill-black animate-spin duration-500" viewBox="0 0 512 512">
					<path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z" />
				</svg>
				:
				dict.jobs.submit
			}
		</button>
	)
}
