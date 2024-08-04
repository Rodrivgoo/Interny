import { getDictionary } from "@/app/[lang]/dictionaries.js";
import LinkSupervisorForm from "./link.js";
import { LinkSupervisorAction } from "@/app/actions/supervisors/linkSupervisor.js";


export default async function LinkSupervisor({ params: { lang, internship_student_id } }) {
	const dict = await getDictionary(lang);

	return (
		<div className="w-full h-full grid place-items-center">
			<div className="px-4 py-8 bg-gray-100 dark:bg-[#1f1f1f] rounded-lg flex flex-col items-center justify-center gap-6">
				<h1 className="text-xl font-semibold">{dict.internship.supervisor.title}</h1>
				<LinkSupervisorForm dict={dict} action={LinkSupervisorAction} internship_student_id={internship_student_id} />
			</div>

		</div>
	)
}
