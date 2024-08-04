'use client'
import { useEffect, useState } from "react"
import { useFormState } from "react-dom"
import { useFormStatus } from "react-dom"

export default function MonthlyEvaluationForm({ action, token, dict }) {

	const [state, formAction] = useFormState(action, "")

	const [grade, setGrade] = useState(0)
	const [evaluation, setEvaluation] = useState([
		{
			id: "commitment",
			title: dict.monthlyEval.evaluations.eval1.title,
			grade: 0,
			weight: 0.1,
		},
		{
			id: "adaptability",
			title: dict.monthlyEval.evaluations.eval2.title,
			grade: 0,
			weight: 0.1,
		},
		{
			id: "comunication",
			title: dict.monthlyEval.evaluations.eval3.title,
			grade: 0,
			weight: 0.1,
		},
		{
			id: "teamwork",
			title: dict.monthlyEval.evaluations.eval4.title,
			grade: 0,
			weight: 0.1,
		},
		{
			id: "leadership",
			title: dict.monthlyEval.evaluations.eval5.title,
			grade: 0,
			weight: 0.1,
		},
		{
			id: "capability",
			title: dict.monthlyEval.evaluations.eval6.title,
			grade: 0,
			weight: 0.1,
		},
		{
			id: "engineeringskills",
			title: dict.monthlyEval.evaluations.eval7.title,
			grade: 0,
			weight: 0.1,
		},
		{
			id: "proactivity",
			title: dict.monthlyEval.evaluations.eval8.title,
			grade: 0,
			weight: 0.1,
		},
		{
			id: "innovation",
			title: dict.monthlyEval.evaluations.eval9.title,
			grade: 0,
			weight: 0.1,
		},
		{
			id: "ethics",
			title: dict.monthlyEval.evaluations.eval10.title,
			grade: 0,
			weight: 0.1,
		},
	])

	const handleEvaluationChange = (e) => {
		const { name, value } = e.target
		const newEvaluation = evaluation.map(ev => ev.id === name ? { ...ev, grade: value } : ev)
		setEvaluation(newEvaluation)
	}

	useEffect(() => {
		let total = evaluation.reduce((acc, ev) => acc + ev.grade * ev.weight, 0)
		total = total.toFixed(2)
		setGrade(total)
	}, [evaluation])

	return (
		<form action={formAction} className="w-full max-w-[700px] bg-gray-100 dark:bg-[#1f1f1f] p-8 mx-5 rounded shadow-md">
			<div className="mb-4 flex flex-col gap-7">
				<div className="pb-4 border-b border-gray-500">
					<p className="font-bold">{dict.monthlyEval.calification}</p>
					<p>{dict.monthlyEval.calificationDescription}</p>
				</div>

				{evaluation.map((ev, index) => (
					<div key={index} className="w-full flex flex-col items-start justify-center gap-3">
						<p className="text-sm gray-500">{ev.title}</p>
						<select
							className="px-4 py-2 rounded-md"
							name={ev.id}
							onChange={handleEvaluationChange}
						>

							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
						</select>
					</div>
				))}

				<div>
					<label htmlFor="comments" className=" ml-1 text-sm  text-gray-500 dark:text-gray-300"> {dict.supervisor.comments} </label>
					<textarea
						className='border resize-none border-gray-200 dark:border-gray-900 dark:bg-black h-32 p-2 rounded-md mb-2 w-full'
						type="text"
						name="comments"
						placeholder="..."
						required
					/>
				</div>
				<input type="hidden" name="grade" value={grade} />
				<input type="hidden" name="token" value={token} />

			</div>

			<div className="flex flex-col items-start  justify-center">
				<p className="text-sm text-gray-500">{dict.monthlyEval.finalGrade}: {grade}</p>
				<SubmitButton dict={dict} />
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
	)
}

function SubmitButton({ dict }) {

	const { pending } = useFormStatus()

	return (
		<button
			type="submit"
			className="bg-black dark:bg-white text-white dark:text-black py-2 px-6 mt-1 rounded-md font-bold transition duration-200 hover:bg-gray-700 dark:hover:bg-gray-300"
		>
			{pending ?
				<svg xmlns="http://www.w3.org/2000/svg" className="w-[24px] h-[24px] fill-white dark:fill-black animate-spin duration-500" viewBox="0 0 512 512">
					<path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z" />
				</svg>
				:
				dict.supervisor.send
			}
		</button>
	)
}
