import { auth } from '@/auth';
import DirectorCompaniesWidget from './companies-chart';
import DirectorMailingWidget from './mailing';
import DirectorStepsChartWidget from './steps-chart';


export default async function DirectorDashboard({ dict }) {

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
        data = data.students

    } catch (error) {
        console.error('ERROR FERCHING DIRECTOR DASHBOARD: ', error)
    }


    return (
        <div className='flex flex-col h-full w-full'>
            <div className='h-full w-full grid grid-cols-1 grid-rows-[auto,auto,auto] gap-8 xl:grid-cols-[_2fr,_3fr] xl:grid-rows-[_1fr,_1fr] my-4'>
                <div className='col-span-1 xl:row-span-1'>
                    <DirectorCompaniesWidget data={data} dict={dict} />
                </div>
                <div className='col-span-1 xl:row-span-1'>
                    <DirectorStepsChartWidget data={data} dict={dict} />
                </div>
                <div className='col-span-1 xl:row-span-1 xl:col-span-2'>
                    <DirectorMailingWidget data={data} dict={dict} />
                </div>
            </div>
        </div>
    )
}
