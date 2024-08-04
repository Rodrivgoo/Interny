import { auth } from '@/auth'
import { getDictionary } from '../../dictionaries'
import StudentInternships from './student/internships'


export default async function InternshipsPage({ params: { lang } }) {
  const dict = await getDictionary(lang)
  const session = await auth()


  switch (session.role) {
    case 'student':
      return (
        <StudentInternships dict={dict} />
      )
    case 'teacher':
      return (
        <div>
        </div>
      )
    default:
      return (
        <div>
          <h1>Not Found</h1>
        </div>
      )
  }
}
