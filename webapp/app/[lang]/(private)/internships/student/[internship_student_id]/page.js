import { auth } from "@/auth"
import { getDictionary } from "@/app/[lang]/dictionaries"
import StudentInternshipPage from "./(student)/student"
import TeacherInternshipPage from "./(teacher)/teacher"

export default async function InternshipPage({ params: { lang, internship_student_id } }) {

	const dict = await getDictionary(lang)
	const session = await auth()

	console.log('params: ', internship_student_id)

	switch (session.role) {
		case 'student':
			return (
				<StudentInternshipPage dict={dict} internship_student_id={internship_student_id} />
			)
		case 'teacher':
			return (
				<TeacherInternshipPage dict={dict} internship_student_id={internship_student_id} />
			)
		// case 'director':
		// 	return (
		// 		<DirectorDashboard dict={dict} />
		// 	)
	}
}
