// supervisorpassAction.js

"use server";
import { auth } from "@/auth.js";

// Ensure this is correct for your environment


export async function supervisorpassAction(prevState, formData, accessToken) {
    const API_URL = process.env.API_URL || 'http://localhost:8000';



    try {
        const session = await auth();

        const res = await fetch(`${API_URL}/dashboard/change-password/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`
            },
            body: JSON.stringify({
                old_password: formData.get('old_password'),
                new_password: formData.get('new_password'),
                confirm_password: formData.get('confirm_new_password')
            })
        });

        if (!res.ok) {
            console.error('ERROR in password change request:', res.status);
            const errorData = await res.json();
            throw new Error(errorData.detail || 'Failed to change password');
        }

        return { success: true };

    } catch (error) {
        console.error('ERROR in password change request:', error);
        return { error: error.message || 'Error in changing password' };
    }
}
