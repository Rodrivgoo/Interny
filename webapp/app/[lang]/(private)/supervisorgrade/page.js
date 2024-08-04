import { React } from 'react'
import Link from 'next/link'

export default async function SupervisorGradePage({ dict }) {


    return (
        <main className='max-w-[700px] mx-auto my-20 relative flex flex-col items-center justify-center gap-3'>
            <div className='flex flex-col justify-center items-center'>


                <p>{dict.supervisor.dashboard.changePassword}</p>
                <Link href="/change-password" className='underline' >{dict.supervisor.dashboard.here}</Link>
            </div>
        </main>
    );
}
