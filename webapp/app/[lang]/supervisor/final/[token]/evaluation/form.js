'use client'

import { useState } from "react";
import { useFormState } from "react-dom"

export default function FinalEvaluationForm({ dict, action, token }) {

	const [formData, setFormData] = useState({
		grade: '',
		comments: '',
		mandatory: '',
	});

	const [state, formAction] = useFormState(action, "")



	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	return (
		<form action={formAction} className="max-w-md bg-gray-100 dark:bg-[#1f1f1f] p-8 rounded shadow-md">
			<input type="hidden" name="token" value={token} />
			<div className="mb-4">
				<label htmlFor="grade" className="mb-2 ml-1 text-xs text-gray-500 dark:text-gray-300"> {dict.supervisor.grade} </label>
				<div>
					<input
						className='border border-gray-200 dark:border-gray-900 dark:bg-black h-12 p-1 rounded-md mb-2 w-14'
						type="number"
						name="grade"
						placeholder="7.0"
						onChange={handleChange}
						value={formData.grade || ""}
						required
					/>
				</div>

				<div>
					<label htmlFor="comments" className="mb-2 ml-1 text-xs text-gray-500 dark:text-gray-300"> {dict.supervisor.comments} </label>
					<textarea
						className='border resize-none border-gray-200 dark:border-gray-900 dark:bg-black h-32 p-2 rounded-md mb-2 w-full md:w-[400px]'
						type="text"
						name="comments"
						placeholder="..."
						onChange={handleChange}
						value={formData.comments || ""}
						required
					/>
				</div>

			</div>

			<div className="flex flex-col items-start  justify-center">
				<button
					className="bg-black dark:bg-white text-white dark:text-black py-2 px-6 mt-1 rounded-md font-bold transition duration-200 hover:bg-gray-700 dark:hover:bg-gray-300"
					type="submit"
				>
					{dict.supervisor.send}
				</button>
				{state && (
					<div className={`mt-4 p-3 rounded ${state.success ? 'bg-green-100 text-green-700' : state.error ? 'bg-red-100 text-red-700' : ''}`}>
						{state.success ? dict.supervisor.gradedSuccessfully
							:
							state.error ? dict.supervisor.gradeError
								:
								""
						}
					</div>
				)}
			</div>


		</form>

	);
};
