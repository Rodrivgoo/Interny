"use client"
import { useState } from "react";
import StepWidget from "./step";
import StepsWidget from "./steps";


export default function InternshipClientComponent({ dict, data }) {

	const [selectedStep, setSelectedStep] = useState(null);
	const internshipId = data.internship_id
	const internshipStudentId = data.internship_student_id

	return (
		<>
			<div className='col-span-1 row-span-2 xl:col-start-1 xl:row-span-1 max-h-[450px]'>
				<StepsWidget dict={dict} data={data} selectedStep={selectedStep} setSelectedStep={setSelectedStep} />
			</div>
			<div className='col-span-1 row-span-3 xl:col-start-2 xl:row-start-1 '>
				<StepWidget selectedStep={selectedStep} dict={dict} internshipId={internshipId} internshipStudentId={internshipStudentId} />
			</div>
		</>
	)
}
