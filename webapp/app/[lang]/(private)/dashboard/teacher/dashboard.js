import { auth } from '@/auth.js';
import TeacherDashboardClientComponent from './client.js';
import TeacherStepsChartWidget from './steps-chart.js';
import logger from '@/logger.js';

export default async function TeacherDashboard({ dict }) {

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
            throw new Error('Error fetching teacher dashboard data')
        }
        data = await res.json()
        data = data.students
        // log the last student

        logger.debug({
            message: 'Teacher dashboard data fetched',
            students: data.length,
            teacher: session.user.email,
        });

    } catch (error) {
        logger.error({
            message: 'Error fetching teacher dashboard data',
            email: session.user.email,
        });
    }


    return (
        <div className=''>
            <h1 className='font-medium text-lg'>Universidad Adolfo Ibáñez</h1>
            <div className='h-full w-full grid grid-cols-1 grid-rows-[auto_auto_auto] xl:grid-rows-[minmax(300px,350px),auto,auto] gap-8 xl:grid-cols-[_1fr,_2fr] my-4'>
                <TeacherDashboardClientComponent data={data} dict={dict} />
                <div className='col-span-1 xl:row-span-1'>
                    <TeacherStepsChartWidget data={data} dict={dict} />
                </div>
            </div>
        </div>
    )
}
