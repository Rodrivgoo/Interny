
import React from 'react'
import FirstInternshipWidget from './internship';
import NewsWidget from './news.js';
import SecondInternshipWidget from './internship2';
import CalendarWidget from './calendar';
import { auth } from '@/auth';

export const metadata = {
	title: "Dashboard",
	description: "Dashboard Page",
};

export default async function StudentDashboard({ dict }) {

	const apiURL = process.env.API_URL
	const session = await auth()
	let data = {}

	try {

		const res = await fetch(`${apiURL}/dashboard/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${session.accessToken}`,
			},
		})

		if (!res.ok) {
			console.error('ERROR in request: ')
		}

		data = await res.json()

	} catch (error) {
		console.error('ERROR FETCHING STUDENT DASHBOARD: ', error)
	}

	const actualInternships = data?.student?.actual_internships || []
	let lastInternshipData = {}
	let firstInternshipData = {}

	if (actualInternships.length != 0) {
		lastInternshipData = await getInternshipData(apiURL, actualInternships[actualInternships.length - 1]?.id)
		firstInternshipData = await getInternshipData(apiURL, actualInternships[0]?.id)
	}

	return (
		<div className='flex flex-col h-full w-full'>
			<h1 className='font-medium text-lg'>{data?.student?.name} - {data?.student?.career_name}</h1>
			<div className='h-full w-full grid grid-cols-1 grid-rows-[auto,auto,auto,auto] gap-8 xl:grid-cols-[_1fr,_1fr,_2fr] xl:grid-rows-[250px,minmax(300px, 350px),auto] my-4'>
				<div className='col-span-1 row-span-1'>
					<FirstInternshipWidget dict={dict} data={firstInternshipData} />
				</div>
				<div className='col-span-1 row-span-1'>
					<NewsWidget dict={dict} />
				</div>

				<div className='col-span-1 xl:row-span-3'>
					<SecondInternshipWidget dict={dict} data={lastInternshipData} />
				</div>
				<div className='xl:col-span-2 row-span-1'>
					<CalendarWidget dict={dict} />
				</div>
			</div>
		</div>
	)
}
// <div className='h-full w-full grid grid-cols-1 grid-rows-[auto_auto_auto] xl:grid-rows-[minmax(300px,350px),auto,auto] gap-8 xl:grid-cols-[_1fr,_2fr] my-4'>

async function getInternshipData(apiURL, internshipId) {

	const session = await auth()
	let data = {}

	try {
		const res = await fetch(`${apiURL}/dashboard/${internshipId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${session.accessToken}`,
			},
		})

		if (!res.ok) {
			console.error('ERROR getInternshipData ')
		}

		data = await res.json()
	} catch (error) {
		console.error('error fetching internship: ', internshipId, error)
	}

	return data
}
