
'use client'
import { StartNewInternship } from "@/app/actions/internships/student/startNewInternship.js"
import { useEffect, useState } from "react"
import { useFormState } from "react-dom"
import { useFormStatus } from "react-dom"

export function SubmitButton({ dict }) {
	const { pending } = useFormStatus()

	return (
		<button
			type="submit"
			className="w-[150px] flex justify-center items-center self-end text-white font-semibold bg-[--light-green] dark:bg-[--dark-green] hover:bg-[--dark-green] hover:dark:bg-[--light-green] transition-colors duration-100 rounded-md p-2">
			{pending ?
				<svg xmlns="http://www.w3.org/2000/svg" className="w-[24px] h-[24px] fill-white dark:fill-black animate-spin duration-500" viewBox="0 0 512 512">
					<path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z" />
				</svg>
				:
				dict.internships.widgets.newInternship.submit
			}
		</button>
	)
}

export default function NewInternshipsWidget({ dict, data }) {

	// company
	// area
	// startDate
	// endDate
	// description

	const initialState = {
		status: 0,
		message: "",
	}


	const [state, formAction] = useFormState(StartNewInternship, initialState)

	useEffect(() => {
		if (state.status === 200) {
			setTimeout(() => {
				window.location.reload()
			}, 1000)
		}
	}, [state.status])

	const [company, setCompany] = useState({
		name: "",
		logo: "",
		id: "",
	})
	const [companies, setCompanies] = useState([])

	const availableInternships = data?.possible_internships || []
	const availableTeachers = data?.available_teachers || []


	const companyApi = 'https://api.brandfetch.io/v2/search/'

	const handleCompanyInput = (e) => {
		const value = e.target.value
		setCompany({
			name: value,
			logo: "",
			id: "",
		})
		if (value === "") {
			setCompanies([])
			return
		}
		const options = {
			method: 'GET',
			headers: {
				accept: 'application/json',
				// Referer: 'https://interny.com/searchIntegrationPage'
			}
		};

		console.log("FETCHING COMPANIES: ", companyApi + value)
		fetch(companyApi + value, options)
			.then(res => res.json())
			.then(json => {
				console.log("COMPANIES: ", json)
				if (json.length === 0) {
					setCompanies([])
				} else {
					setCompanies(json)
				}
			})
			.catch(err => console.error('error:' + err));
	}

	useEffect(() => {
		console.log(company)

	}, [company])

	useEffect(() => {

		const companyInput = document.getElementById('company_name')
		const companiesDiv = document.getElementById('companies-div')
		companiesDiv?.addEventListener('mousedown', (event) => {
			event.preventDefault();
			companyInput.focus();
		})

	})

	return (
		<div className="dashboard-widget">
			<h1 className='text-lg font-semibold mb-2'>{dict.internships.widgets.newInternship.title}</h1>
			<form action={formAction} className="flex flex-col gap-2">
				<div className="w-full flex flex-col gap-1">
					<label htmlFor="internship">{dict.internships.widgets.newInternship.type}</label>
					<select required name="internship_id" id="internship" className="input">
						{availableInternships.map((internship, index) => (
							<option key={index} value={internship.id}>{internship.name}</option>
						))}
					</select>
				</div>
				<div className="w-full flex flex-col md:flex-row justify-between gap-2">
					<div className="w-full flex flex-col gap-1">
						<label htmlFor="teacher">{dict.internships.widgets.newInternship.teacher}</label>
						<select required name="teacher_id" id="internship" className="input">
							{availableTeachers.map((teacher, index) => (
								<option key={index} value={teacher.id}>{teacher.username}</option>
							))}
						</select>
					</div>
					<div id="company-div" className="w-full flex flex-col gap-1 relative">
						<label htmlFor="company">{dict.internships.widgets.newInternship.company}</label>
						<input required type="text" id="company_name" name="company_name" value={company.name} onChange={handleCompanyInput} className="input w-full peer" autoComplete="off" />

						{companies.length > 0 && (
							<div id="companies-div" className="hidden peer-focus:flex absolute top-full w-[60%] rounded-md bg-[#fafafa] dark:bg-[#181818] border border-[#d9d9d9] dark:border-[#353535] px-2 py-3 flex-col gap-3 justify-center items-start">
								{companies.length > 0 && companies
									.filter((company) => company.name !== "")
									.map((company, index) => (
										<div
											className="w-full flex flex-row gap-2 justify-between items-center rounded-sm px-3 py-1 hover:bg-[#d9d9d9] hover:dark:bg-[#2b2b2b] cursor-pointer"
											onClick={() => {
												console.log("CLICKED: ", company)
												setCompany({
													name: company.name,
													logo: company.icon,
													id: company.brandId,
												})
											}}
											key={index}
										>
											<p className="max-w-[70%]">{company.name}</p>
											{company.icon && <img src={company.icon} alt={company.name} className="w-8 h-8 rounded-md" />}
										</div>
									))}
							</div>

						)}
						<input type="hidden" id="company_logo" name="company_logo" value={company.logo || ''} className="hidden" />
						<input type="hidden" id="company_id" name="company_id" value={company.id || ''} className="hidden" />
					</div>
				</div>
				<div className="w-full flex flex-col md:flex-row justify-between gap-2">
					<div className="w-full flex flex-col gap-1">
						<label htmlFor="startDate">{dict.internships.widgets.newInternship.startDate}</label>
						<input required type="date" id="startDate" name="startDate" className="input w-full" />
					</div>
					<div className="w-full flex flex-col gap-1">
						<label htmlFor="endDate">{dict.internships.widgets.newInternship.endDate}</label>
						<input required type="date" id="endDate" name="endDate" className="input w-full" />
					</div>
				</div>
				<textarea name="description" id="description" cols="30" rows="10" className="input w-full resize-none h-full" placeholder={dict.internships.widgets.newInternship.description}></textarea>
				<div className="flex gap-2 flex-col md:flex-row-reverse justify-between items-center">
					<SubmitButton dict={dict} />
					<p
						className={`font-semibold ${state?.status === 200 || state?.status === 201 ? "text-green-600 dark:text-green-500" : "text-red-500 dark:text-red-500"}`} >
						{state?.status === 0 ?
							""
							:
							state?.status === 200 ?
								dict.internships.widgets.newInternship.success
								:
								dict.internships.widgets.newInternship.error
						}
					</p>
				</div>
			</form >

		</div >
	)
}
