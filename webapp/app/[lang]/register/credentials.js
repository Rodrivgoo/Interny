"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useFormState } from "react-dom"
import { TermsCheckbox } from '../terms/termsCheckbox'

import { useFormStatus } from "react-dom"


export default function RegisterForm({ dict, lang, registerAction, data }) {

    const [universities, setUniversities] = useState([''])
    if (data.length != 0) {
        data.map((career) => {
            universities.includes(career.university) ? null : setUniversities([...universities, career.university])
        })
    }
    const [selectedUniversity, setSelectedUniversity] = useState('')
    const [selectedCareer, setSelectedCareer] = useState('')


    const [credentials, setCredentials] = useState({ username: '', first_name: '', last_name: '', email: '', password: '' })
    const [isSelected, setIsSelected] = useState(false);

    const handleCheckboxChange = () => {
        setIsSelected(!isSelected);
    };

    const [state, formAction] = useFormState(registerAction, "")

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setCredentials(values => ({ ...values, [name]: value }))
    }

    useEffect(() => {

        if (state?.success) {
            location.reload()
        }
    }, [state])

    return (
        <form className='flex flex-col gap-2' action={formAction}>
            <div className="flex flex-col">
                <label htmlFor="first_name" className="mb-2 ml-1 text-xs text-gray-500 dark:text-gray-300"> {dict.register.firstName} </label>
                <input
                    className='border border-gray-200 dark:border-gray-900 dark:bg-black h-12 p-2 rounded-md mb-2 w-[300px]'
                    type="text"
                    name="first_name"
                    placeholder="John"
                    onChange={handleChange}
                    value={credentials.first_name || ""}
                    required
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="last_name" className="mb-2 ml-1 text-xs text-gray-500 dark:text-gray-300"> {dict.register.lastName} </label>
                <input
                    className='border border-gray-200 dark:border-gray-900 dark:bg-black h-12 p-2 rounded-md mb-2 w-[300px]'
                    type="text"
                    name="last_name"
                    placeholder="Doe"
                    onChange={handleChange}
                    value={credentials.last_name || ""}
                    required
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="username" className="mb-2 ml-1 text-xs text-gray-500 dark:text-gray-300"> {dict.register.username} </label>
                <input
                    className='border border-gray-200 dark:border-gray-900 dark:bg-black h-12 p-2 rounded-md mb-2 w-[300px]'
                    type="text"
                    name="username"
                    placeholder="john_doe"
                    onChange={handleChange}
                    value={credentials.username || ""}
                    required
                />
            </div>

            <div className="flex flex-row max-w-[300px] gap-1">
                <div className="flex flex-col w-full">
                    <label htmlFor="username" className="mb-2 ml-1 text-xs text-gray-500 dark:text-gray-300"> {dict.register.university} </label>
                    <select
                        className='border border-gray-200 dark:border-gray-900 dark:bg-black h-12 p-2 rounded-md mb-2 w-full '
                        type=""
                        name=""
                        placeholder="UAI"
                        required
                        onChange={(e) => setSelectedUniversity(e.target.value)}
                        value={selectedUniversity || ""}
                    >
                        {universities.map((university, index) => (
                            <option key={index}>{university}</option>
                        ))
                        }

                    </select>
                </div>
                <div className="flex flex-col w-full">
                    <label htmlFor="username" className="mb-2 ml-1 text-xs text-gray-500 dark:text-gray-300"> {dict.register.career} </label>
                    <select
                        className='border border-gray-200 dark:border-gray-900 dark:bg-black h-12 p-2 rounded-md mb-2 w-full '
                        type=""
                        name="career_id"
                        placeholder=""
                        required
                        value={selectedCareer}
                        onChange={(e) => setSelectedCareer(e.target.value)}
                    >
                        <option value=''></option>
                        {data.map((career, index) => {
                            if (career.university == selectedUniversity) {
                                return <option key={index} value={career.id}>{career.name}</option>
                            }

                        })}
                    </select>
                </div>
            </div>


            <div className="flex flex-col">
                <label htmlFor="email" className="mb-2 ml-1 text-xs text-gray-500 dark:text-gray-300"> {dict.register.email} </label>
                <input
                    className='border border-gray-200 dark:border-gray-900 dark:bg-black h-12 p-2 rounded-md mb-2 w-[300px]'
                    type="email"
                    name="email"
                    placeholder="email@gmail.com"
                    onChange={handleChange}
                    value={credentials.email || ""}
                    required
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="password" className="mb-2 ml-1 text-xs text-gray-500 dark:text-gray-300"> {dict.register.password} </label>
                <input
                    className='border border-gray-200 dark:border-gray-900 dark:bg-black h-12 p-2 rounded-md mb-2 w-[300px]'
                    type="password"
                    name="password"
                    placeholder="******"
                    onChange={handleChange}
                    value={credentials.password || ""}
                    required
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Link
                    className='text-sm underline font-semibold text-gray-800 dark:text-gray-300'
                    href={`/${lang}/terms`}
                >
                    {dict.register.termsLink}
                </Link>

                <TermsCheckbox />
            </div>


            <SubmitButton dict={dict} />

            <div className='max-w-[300px] '>
                <p className='text-xs text-gray-600 dark:text-gray-400'>{dict.register.loginInfo}</p>
                <Link
                    href={`/${lang}/login`}
                    className='text-sm underline font-semibold text-gray-800 dark:text-gray-300'>
                    {dict.register.loginLink}
                </Link>
            </div>

            {state?.message && handleRegisterError(state.message, dict)}

        </form>

    )
}

function SubmitButton({ dict }) {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            className="flex justify-center items-center bg-black dark:bg-white text-white dark:text-black py-2 mt-2 rounded-md font-bold transition duration-200 hover:bg-gray-700 dark:hover:bg-gray-300"
        >
            {pending ?
                <svg xmlns="http://www.w3.org/2000/svg" className="w-[24px] h-[24px] fill-white dark:fill-black animate-spin duration-500" viewBox="0 0 512 512">
                    <path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z" />
                </svg>
                :
                dict.register.registerButton
            }
        </button>
    )
}


function handleRegisterError(error, dict) {
    return (
        <p className='text-red-500 max-w-[300px] dark:text-red-300'>
            {(() => {
                switch (error) {
                    case "username already exists":
                        return dict.register.registerErrorUsername;
                    case "email already exists":
                        return dict.register.registerErrorEmail;
                    case "password error":
                        return dict.register.registerErrorPassword;
                    default:
                        return <p>Error</p>;
                }
            })()}
        </p>
    );
}
