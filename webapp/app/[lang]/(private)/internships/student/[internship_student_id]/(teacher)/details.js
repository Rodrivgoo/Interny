import Image from 'next/image'
import CircleCheck from '@/public/icons/circle-check.svg'
import { getObjectUrl } from '@/app/actions/files/s3'

export default function InternshipTeacherDetailsWidget({ dict, data }) {


	return (
		<div className='dashboard-widget flex flex-col sm:flex-row gap-4 justify-around items-center w-full min-h-[240px]'>
			<div className='flex flex-col justify-center gap-4 items-center'>
				<h3 className='font-bold text-2xl'>{data?.company_name}</h3>
				{data?.company_logo &&
					<img src={getObjectUrl('public/companies/' + data?.company_logo)} alt="company logo" className='h-[100px] max-w-[200px]' />
				}
			</div>
			<div className="flex flex-col justify-center items-start gap-3">
				<div className='flex flex-row gap-2 mb-1 items-center'>
					<p className="font-semibold text-lg">{data?.status == 'done' ? dict.internship.widgets.internshipDetails.done : dict.internship.widgets.internshipDetails.progress}</p>
					{data?.status == 'done' ? <Image src={CircleCheck} alt="check" width={32} height={32} /> : ""}
				</div>
				<div className=''>
					<p className="font-semibold">{dict.internship.widgets.internshipDetails.grade}: <span className='text-xl'>{data?.grade}</span> </p>
				</div>

				<div className='flex flex-row gap-2'>
					<p className="text-gray-600 dark:text-gray-400">{dict.internship.widgets.internshipDetails.startDate}:</p>
					<p className="">{data?.start_date}</p>
				</div>
				<div className='flex flex-row gap-2'>
					<p className="text-gray-600 dark:text-gray-400">{dict.internship.widgets.internshipDetails.endDate}:</p>
					<p>{data?.end_date}</p>
				</div>
			</div>
		</div>
	)

}
