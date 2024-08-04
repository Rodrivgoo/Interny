import { getDictionary } from "@/app/[lang]/dictionaries";
import { monthlyEvalAction } from "./monthlyEvalAction.js";
import MonthlyEvaluationForm from "./form.js";
import LangToggle from "@/components/lang-toggle.js";

export default async function MontlhyEvaluation({ params: { lang, token } }) {
	const dict = await getDictionary(lang);
	return (
		<main className="w-full min-h-screen flex flex-col justify-start items-center gap-6 mt-10 p-4">
			<LangToggle lang={lang} />
			<h1 className="text-2xl md:text-4xl font-semibold">{dict.supervisor.monthlyTitle}</h1>
			<MonthlyEvaluationForm action={monthlyEvalAction} dict={dict} token={token} />
		</main>
	)
}
