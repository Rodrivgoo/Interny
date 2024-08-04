'use client'
import { Fragment, useEffect, useState } from "react"

export default function GradeCalculator({ dict }) {

	const [mean, setMean] = useState(0.0)
	const [calculator, setCalculator] = useState({
		custom: false,
		finalGrade: 0.0,
		grades: [
			{
				id: 1,
				name: dict.grades.calculator.exampleGrade,
				weight: 1.0,
				grade: 1,
				showChilds: false,
				customChilds: true,
				childs: [
					{
						id: 1,
						name: dict.grades.calculator.exampleChild,
						weight: 0.5,
						grade: 0,
					}
				]
			}
		]
	})

	useEffect(() => {
		let sum = 0.0
		calculator.grades.forEach((grade) => {
			sum += grade.grade * grade.weight
		})
		setMean(sum)

		calculator.grades.forEach((grade) => {
			let sum = 0.0
			grade.childs.forEach((child) => {
				sum += child.grade * child.weight
			})
			grade.grade = sum
		})
		console.log('Calculator: ', calculator)
	}, [calculator])

	function handleGradeChange(e, gradeID) {
		const { name, value } = e.target
		if (name === 'grade' && (value > 7 || value < 1)) {
			return
		}

		if (name === 'weight' && value > 1) {
			return
		}

		if (name === 'name' && value.length > 20) {
			return
		}
		setCalculator({
			...calculator,
			grades: calculator.grades.map((grade) => {
				if (grade.id === gradeID) {
					grade[name] = value
					if (name === 'weight') {
						calculator.custom = true
					}
				}
				return grade
			})
		})
	}

	function handleChildChange(e, gradeID, childID) {
		const { name, value } = e.target
		if (name === 'grade' && (value > 7 || value < 1)) {
			return
		}

		if (name === 'weight' && value > 1) {
			return

		}

		if (name === 'name' && value.length > 20) {
			return
		}
		console.log('name: ', name, 'value: ', value)
		console.log('gradeID: ', gradeID, 'childID: ', childID)

		setCalculator({
			...calculator,
			grades: calculator.grades.map((grade) => {
				if (grade.id === gradeID) {
					grade.childs.map((child) => {
						if (child.id === childID) {
							child[name] = value
						}
					})
				}
				return grade
			})
		})
	}

	function updateWeights(total) {
		let weight = 0
		if (calculator.custom === false) {
			weight = 1 / total
			calculator.grades.forEach((grade) => {
				grade.weight = weight.toFixed(2)
			})
		}
	}



	function addGrade() {
		let weight = 0
		if (calculator.custom === false) {
			let total = calculator.grades.length + 1
			weight = 1 / total
		}
		const newGrade = {
			id: Math.floor(Math.random() * (10000 - 1) + 1),
			name: '',
			weight: weight.toFixed(2),
			grade: 1,
			showChilds: false,
			customChilds: false,
			childs: []
		}
		setCalculator({
			...calculator,
			grades: [...calculator.grades, newGrade]
		})
		updateWeights(calculator.grades.length + 1)
	}

	function deleteGrade(gradeID) {
		let grades = calculator.grades
		grades = grades.filter((grade) => grade.id !== gradeID)
		setCalculator({
			...calculator,
			grades: grades
		})

		updateWeights(grades.length)
	}


	function updateChildWeights(gradeID) {
		console.log("updating the child weights")
		let weight = 0
		let grades = calculator.grades
		let grade = grades.find((grade) => grade.id === gradeID)
		if (grade.customChilds === false) {
			let total = grade.childs.length
			weight = 1 / total
			console.log('Weight: ', weight)
			grade.childs.forEach((child) => {
				child.weight = weight.toFixed(2)
			})
		} else {
			console.log('Custom childs')
		}
		console.log('Grade: ', grade)
	}

	function addChild(gradeID) {
		const newChild = {
			id: Math.floor(Math.random() * (10000 - 1) + 1),
			name: '',
			weight: 0,
			grade: 0
		}
		let grades = calculator.grades
		grades.forEach((grade) => {
			if (grade.id === gradeID) {
				grade.childs.push(newChild)
			}
		})
		setCalculator({
			...calculator,
			grades: grades
		})
		updateChildWeights(gradeID)
	}

	function deleteChild(gradeID, childID) {
		let grades = calculator.grades
		grades.forEach((grade) => {
			if (grade.id === gradeID) {
				grade.childs = grade.childs.filter((child) => child.id !== childID)
			}
			if (grade.childs.length === 0) {
				grade.customChilds = false
			}
		})
		setCalculator({
			...calculator,
			grades: grades
		})
		updateChildWeights(gradeID)
	}



	return (
		<div className="flex gap-3 flex-col w-full max-w-[600px] justify-center items-center">
			<h1 className="font-bold text-xl my-8">{dict.grades.calculator.title}</h1>
			<div className={`grid p-3 gap-y-3 grid-cols-[1fr,4fr,1fr,1fr,0.5fr] grid-rows-${calculator.grades.length}`}>
				<p className="col-start-3 col-end-3 justify-self-center">{dict.grades.calculator.grade}</p>
				<p className="col-start-4 col-end-4 justify-self-center">{dict.grades.calculator.weight}</p>
				{calculator.grades.map((grade) => (
					<div className="col-span-5 grid gap-y-3 gap-x-1 grid-cols-[1fr,4fr,1fr,1fr,0.5fr] group" key={grade.id}>
						<button
							className={`col-span-1 col-start-1 place-self-center cursor-pointer transition duration-200 ${grade?.showChilds ? '' : '-rotate-90'}`}
							onClick={() => {
								grade.showChilds = !grade.showChilds
								setCalculator({ ...calculator })
							}}
						>
							<svg className="" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fillRule="evenodd" clipRule="evenodd" d="M12.7803 5.21967C13.0732 5.51256 13.0732 5.98744 12.7803 6.28033L8.53033 10.5303C8.23744 10.8232 7.76256 10.8232 7.46967 10.5303L3.21967 6.28033C2.92678 5.98744 2.92678 5.51256 3.21967 5.21967C3.51256 4.92678 3.98744 4.92678 4.28033 5.21967L8 8.93934L11.7197 5.21967C12.0126 4.92678 12.4874 4.92678 12.7803 5.21967Z"
									className="fill-gray-800 dark:fill-gray-400" />
							</svg>
						</button>
						<input
							type="text"
							placeholder={dict.grades.calculator.gradeName}
							value={grade.name}
							name="name"
							className="bg-transparent col-span-1 col-start-2 max-w-[130px] md:max-w-[220px]"
							onChange={(e) => handleGradeChange(e, grade.id)}
						/>
						<input
							type="number"
							placeholder="0"
							value={grade.grade}
							name="grade"
							className="bg-transparent max-w-10 col-span-1 col-start-3 justify-self-center"
							onChange={(e) => handleGradeChange(e, grade.id)}
						/>
						<input
							type="text"
							placeholder="0"
							value={grade.weight}
							name="weight"
							className="bg-transparent max-w-10 col-span-1 col-start-4 justify-self-center"
							onChange={(e) => handleGradeChange(e, grade.id)}
						/>
						{grade?.showChilds === true && (
							<div
								className="bg-gray-200 dark:bg-gray-800 group/child rounded-lg py-4 col-span-5 row-span-1 grid gap-y-2 gap-x-1 grid-cols-[1fr,4fr,1fr,1fr,0.5fr] animate-fadeIn"
							>
								{grade.childs.map((child) => (
									<Fragment key={child.id}>
										<input
											type="text"
											placeholder={dict.grades.calculator.childName}
											value={child.name}
											name="name"
											className={`bg-transparent col-span-1 col-start-2 max-w-[110px] md:max-w-[200px]`}
											onChange={(e) => handleChildChange(e, grade.id, child.id)}
										/>
										<input
											type="number"
											placeholder={child.grade}
											value={child.grade}
											name="grade"
											className="bg-transparent max-w-10 col-span-1 col-start-3"
											onChange={(e) => handleChildChange(e, grade.id, child.id)}
										/>
										<input
											type="text"
											placeholder={child.weight}
											value={child.weight}
											name="weight"
											className="bg-transparent max-w-10 col-span-1 col-start-4"
											onChange={(e) => handleChildChange(e, grade.id, child.id)}
										/>
										<button
											className={`hidden opacity-0 group-hover/child:opacity-100 group-hover/child:block transition-opacity duration-150`}
											onClick={() => deleteChild(grade.id, child.id)}
										>
											<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path fillRule="evenodd" clipRule="evenodd" d="M6.5 1.75C6.5 1.61193 6.61193 1.5 6.75 1.5H9.25C9.38807 1.5 9.5 1.61193 9.5 1.75V3H6.5V1.75ZM11 1.75V3H13.25C13.6642 3 14 3.33579 14 3.75C14 4.16421 13.6642 4.5 13.25 4.5H2.75C2.33579 4.5 2 4.16421 2 3.75C2 3.33579 2.33579 3 2.75 3H5V1.75C5 0.783502 5.7835 0 6.75 0H9.25C10.2165 0 11 0.783502 11 1.75ZM4.49627 6.67537C4.45506 6.26321 4.08753 5.9625 3.67537 6.00372C3.26321 6.04493 2.9625 6.41247 3.00372 6.82462L3.66367 13.4241C3.75313 14.3187 4.50592 15 5.40498 15H10.595C11.4941 15 12.2469 14.3187 12.3363 13.4241L12.9963 6.82462C13.0375 6.41247 12.7368 6.04493 12.3246 6.00372C11.9125 5.9625 11.5449 6.26321 11.5037 6.67537L10.8438 13.2749C10.831 13.4027 10.7234 13.5 10.595 13.5H5.40498C5.27655 13.5 5.169 13.4027 5.15622 13.2749L4.49627 6.67537Z"
													className="fill-red-400" />
											</svg>
										</button>
									</Fragment>
								))}
								<button
									className="bg-gray-300 dark:bg-gray-700 row-span-1 col-span-4  rounded-lg w-10 p-1 place-self-center"
									onClick={() => addChild(grade.id)}
								>
									+
								</button>
							</div>
						)}
						<button
							className="col-span-1 col-start-5 row-start-1 place-self-center hidden opacity-0 group-hover:opacity-100 group-hover:block transition-opacity duration-150"
							onClick={() => deleteGrade(grade.id)}
						>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fillRule="evenodd" clipRule="evenodd" d="M6.5 1.75C6.5 1.61193 6.61193 1.5 6.75 1.5H9.25C9.38807 1.5 9.5 1.61193 9.5 1.75V3H6.5V1.75ZM11 1.75V3H13.25C13.6642 3 14 3.33579 14 3.75C14 4.16421 13.6642 4.5 13.25 4.5H2.75C2.33579 4.5 2 4.16421 2 3.75C2 3.33579 2.33579 3 2.75 3H5V1.75C5 0.783502 5.7835 0 6.75 0H9.25C10.2165 0 11 0.783502 11 1.75ZM4.49627 6.67537C4.45506 6.26321 4.08753 5.9625 3.67537 6.00372C3.26321 6.04493 2.9625 6.41247 3.00372 6.82462L3.66367 13.4241C3.75313 14.3187 4.50592 15 5.40498 15H10.595C11.4941 15 12.2469 14.3187 12.3363 13.4241L12.9963 6.82462C13.0375 6.41247 12.7368 6.04493 12.3246 6.00372C11.9125 5.9625 11.5449 6.26321 11.5037 6.67537L10.8438 13.2749C10.831 13.4027 10.7234 13.5 10.595 13.5H5.40498C5.27655 13.5 5.169 13.4027 5.15622 13.2749L4.49627 6.67537Z"
									className="fill-red-400" />
							</svg>
						</button>
					</div>
				))}
				<button
					className="bg-gray-300 dark:bg-gray-700 row-span-1 col-span-4  rounded-lg w-10 p-1 place-self-center"
					onClick={addGrade}
				>
					+
				</button>
				<p className="text-5xl font-bold self-center col-start-3 col-span-3 justify-self-center">{mean.toFixed(2)}</p>
			</div>
		</div >
	)
}
