
"use server"

import { auth } from "@/auth";

export async function gradeSupervisorAction(prevState, formData) {
    const API_URL = process.env.API_URL || 'http://localhost:8000';
    let student_id = ""; // Initialize student_id
    let data = []



    try {

        const session = await auth();

        const res = await fetch(`${API_URL}/dashboard/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`,
            },
        })

        if (!res.ok) {
            console.error('ERROR in request: ', res)
        }

        data = await res.json();
        // console.log('Data:', data);
        // console.log('student 1:', data.students[0].student_id);

        student_id = data.students[0].internship_student_id; // Assuming you want the ID of the first student

        // Ensure student_id is set
        if (!student_id) {
            throw new Error('No student ID found');
        }

    } catch (error) {
        console.error('ERROR fetching student data: ', error);
        return { error: 'Failed to fetch student data' };
    }

    try {

        const session = await auth();

        const payload = {
            evaluation: {
                Grade: formData.get('grade'),
                Comentary: formData.get('comments')
            },
            mandatory: true
        };


        const res = await fetch(`${API_URL}/dashboard/company-evaluation/${student_id}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`
            },
            body: JSON.stringify(payload)
        });


        if (!res.ok) {
            console.error('ERROR in grade request:', res.status);
            const errorData = await res.json();
            console.log('Error response:', errorData);
            throw new Error(errorData.detail || 'Failed to grade');
        }

        return { success: true }; // Optionally return any success data needed

    } catch (error) {
        console.error('ERROR in grade request:', error);
        return { error: error.message || 'Error in grading' };
    }
}


