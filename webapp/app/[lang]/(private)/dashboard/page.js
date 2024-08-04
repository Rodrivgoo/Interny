import React from 'react'
import { getDictionary } from '../../dictionaries'
import { auth } from '@/auth'
import TeacherDashboard from './teacher/dashboard';
import DirectorDashboard from './director/dashboard';
import StudentDashboard from './student/dashboard';
import SupervisorGradePage from '../supervisorgrade/page.js';
import CompanyDashboard from './company/dashboard.js';

export const metadata = {
    title: "Dashboard",
    description: "Dashboard Page",
};


export default async function DashboardPage({ params: { lang } }) {
    const dict = await getDictionary(lang)
    const session = await auth()


    switch (session.role) {
        case 'student':
            return (
                <StudentDashboard dict={dict} />
            )
        case 'teacher':
            return (
                <TeacherDashboard dict={dict} />
            )
        case 'director':
            return (
                <DirectorDashboard dict={dict} />
            )
        case 'supervisor':
            return (
                <SupervisorGradePage dict={dict} />
            )
        case 'company':
            return (
                <CompanyDashboard dict={dict} />
            )
    }
}
