"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useFormState } from "react-dom"

import { useFormStatus } from "react-dom"

function SubmitButton({ dict }) {
	const { pending } = useFormStatus()

	return (
		<button
			type="submit"
			className="flex justify-center items-center bg-black dark:bg-white text-white dark:text-black py-2 mt-2 rounded-md font-bold transition duration-200 hover:bg-gray-700 dark:hover:bg-gray-300"
		>
			{pending ?
				<svg xmlns="http://www.w3.org/2000/svg" className="w-[24px] h-[24px] fill-white dark:fill-black animate-spin duration-500" viewBox="0 0 512 512">
					<path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z" />
				</svg>
				:
				dict.internship.supervisor.register
			}
		</button>
	)
}


export default function LinkSupervisorForm({ dict, action, internship_student_id }) {

	const [state, formAction] = useFormState(action, "")

	useEffect(() => {
		console.log('useEffect triggered with state:', state);
		if (state?.success) {
			location.reload()
		}
	}, [state])

	return (
		<form className='flex flex-col gap-2' action={formAction}>
			<div className="w-full flex flex-col items-start justify-center">
				<label htmlFor="first_name" className="mb-2 ml-1 text-xs text-gray-500 dark:text-gray-300"> {dict.internship.supervisor.firstName} </label>
				<input
					type="text"
					name="first_name"
					required
					className='w-full border border-gray-200 dark:border-gray-900 dark:bg-black p-2 rounded-md mb-2 '
				/>
			</div>

			<div className="w-full flex flex-col items-start justify-center">
				<label htmlFor="last_name" className="mb-2 ml-1 text-xs text-gray-500 dark:text-gray-300"> {dict.internship.supervisor.lastName} </label>
				<input
					type="text"
					name="last_name"
					required
					className='w-full border border-gray-200 dark:border-gray-900 dark:bg-black p-2 rounded-md mb-2'
				/>
			</div>

			<div className="w-full flex flex-col items-start justify-center">
				<label htmlFor="email" className="mb-2 ml-1 text-xs text-gray-500 dark:text-gray-300"> {dict.internship.supervisor.email} </label>
				<input
					type="email"
					name="email"
					required
					className='w-full border border-gray-200 dark:border-gray-900 dark:bg-black  p-2  rounded-md mb-2'
				/>
			</div>
			<input type="hidden" name="internship_id" value={internship_student_id} />

			<SubmitButton dict={dict} />
			{state?.status == 200 && <p className='text-green-600 max-w-[300px] dark:text-green-300'>{dict.internship.supervisor.success}</p>}
			{state?.status == 400 && <p className='text-red-500 max-w-[300px] dark:text-red-300'>{dict.internship.supervisor.error}</p>}


		</form>
	)
}

