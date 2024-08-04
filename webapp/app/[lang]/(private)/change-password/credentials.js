"use client";
import React, { useState } from 'react';
import { useFormState } from "react-dom"

const SupervisorPassForm = ({ dict, lang, supervisorpassAction, accessToken }) => {
    const [formData, setFormData] = useState({
        old_password: '',
        new_password: '',
        confirm_new_password: ''
    });
    const [message, setMessage] = useState('');



    const [state, formAction] = useFormState(supervisorpassAction, "")


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData(); // Create a new FormData instance

        formDataToSend.append('old_password', formData.old_password);
        formDataToSend.append('new_password', formData.new_password);
        formDataToSend.append('confirm_new_password', formData.confirm_new_password);

        const result = await supervisorpassAction(null, formDataToSend, accessToken); // Pass formDataToSend

        if (result.success) {
            setMessage(dict.supervisor.passChanged);
            // Optionally, reset the form fields after successful change
            setFormData({
                old_password: '',
                new_password: '',
                confirm_new_password: ''
            });
        } else {
            setMessage(result.error || dict.supervisor.passError);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <form action={formAction} className="w-full dark:bg-[#1f1f1f] max-w-md bg-white p-8 rounded shadow-md">
            <div className="mb-4">
                <label htmlFor="old_password" className="mb-2 ml-1 text-xs text-gray-500 dark:text-gray-300">
                    {dict.supervisor.oldpassword}
                </label>
                <input
                    type="password"
                    name="old_password"
                    id="old_password"
                    value={formData.old_password}
                    onChange={handleChange}
                    placeholder="********"
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 dark:border-gray-800"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="new_password" className="mb-2 ml-1 text-xs text-gray-500 dark:text-gray-300">
                    {dict.supervisor.newpassword}
                </label>
                <input
                    type="password"
                    name="new_password"
                    id="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    placeholder="********"
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 dark:border-gray-800"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="confirm_new_password" className="mb-2 ml-1 text-xs text-gray-500 dark:text-gray-300">
                    {dict.supervisor.confirmpassword}
                </label>
                <input
                    type="password"
                    name="confirm_new_password"
                    id="confirm_new_password"
                    value={formData.confirm_new_password}
                    onChange={handleChange}
                    placeholder="********"
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 dark:border-gray-800"
                />
            </div>
            <div className="flex items-center justify-center">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline items-center">
                    {dict.supervisor.change}
                </button>
            </div>
            {message && (
                <div className={`mt-4 p-3 rounded ${message === dict.supervisor.passChanged ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}
            {state && (
                <div className={`mt-4 p-3 rounded ${state.success ? 'bg-green-100 text-green-700' : state.error ? 'bg-red-100 text-red-700' : ''}`}>
                    {state.success ? dict.supervisor.passChanged
                        :
                        state.error ? dict.supervisor.passError
                            :
                            ""
                    }
                </div>
            )}
        </form>
    );
};

export default SupervisorPassForm;
