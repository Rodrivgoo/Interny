import { auth } from "@/auth";
import NewInternshipsWidget from "./newinternship";
import OffersWidget from "./offers";
import UserInternshipsWidget from "./userinternships";


export default async function StudentInternships({ dict }) {

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
		console.log("data: ", data)

	} catch (error) {
		console.error('ERROR FETCHING STUDENT INTERNSHIP: ', error)
	}

	const actualInternships = data?.student?.actual_internships || []

	return (
		<div className='flex flex-col '>
			<h1 className='font-medium text-lg'>{data?.career}</h1>
			<div className='h-full w-full grid grid-cols-1 grid-rows-[auto, auto, auto] gap-8 xl:grid-cols-[_1fr,_1fr] my-4'>
				<div className='col-span-1 row-span-1'>
					<UserInternshipsWidget dict={dict} data={actualInternships} />
				</div>
				<div className='col-span-1 row-span-1 xl:row-span-2'>
					<NewInternshipsWidget dict={dict} data={data?.student} />
				</div>
				<div className='col-span-1 row-span-1 xl:row-span-2 '>
					<OffersWidget dict={dict} />
				</div>
			</div>
		</div>
	)

}
