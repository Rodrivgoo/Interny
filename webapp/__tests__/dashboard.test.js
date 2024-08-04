import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import LoginPage from '@/app/[lang]/login/page'
import TeacherStudentDetailsWidget from '@/app/[lang]/(private)/dashboard/teacher/student-details'
import dict from '@/app/[lang]/dictionaries/es.json'

describe('Page', () => {
    it('renders a heading', () => {
        render(<LoginPage />)

        const heading = screen.getByRole('heading', { level: 2 })
        const div = screen.getByRole('div')

        expect(div).toBeInTheDocument()
    })


    let mockSelectedStudent = {
        "id": "91b55936-8da3-413e-aa58-f206d8a58180",
        "name": "Diane Silva",
        "company_name": "Entidad Gubernamental",
        "company_logo": "N/A",
        "step": 4,
        "steps": [
            {
                "step_id": "36527244-12c9-4ea7-8fbc-b3ad6d82176e",
                "step": 1,
                "title": "Pasantía Inscrita",
                "status": "pending",
                "date": null
            },
            {
                "step_id": "a3a7ee4b-fbb5-485b-b187-a0af1f5534e0",
                "step": 2,
                "title": "Supervisores Registrados",
                "status": "pending",
                "date": null
            },
            {
                "step_id": "352ed7a1-f8d3-4fb1-8508-e6e72effcab9",
                "step": 3,
                "title": "Pasantía Validada",
                "status": "pending",
                "date": null
            },
            {
                "step_id": "05fee73c-dd40-4682-bb38-c86827be1ab8",
                "step": 4,
                "title": "Informe Final",
                "status": "completed",
                "date": "06-05-2024"
            },
            {
                "step_id": "c5cf9987-e207-4aaa-b388-6f8db5fafa34",
                "step": 5,
                "title": "Evaluación Final",
                "status": "pending",
                "date": null
            }
        ],
        "valid": false,
        "internship_student_id": "32d3b956-3af9-495f-a085-8722a225fb73"
    }

    it('teacher dashboard', () => {
        render(<TeacherStudentDetailsWidget dict={dict} selectedStudent={mockSelectedStudent} />)

        const heading = screen.getByRole('heading', { level: 2 })

        expect(heading).toBeInTheDocument()
    })
})
