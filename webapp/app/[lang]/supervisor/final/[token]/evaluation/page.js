import { getDictionary } from "@/app/[lang]/dictionaries";
import LangToggle from "@/components/lang-toggle.js";
import FinalEvaluationForm from "./form.js";
import { finalEvalAction } from "./finalEvalAction.js";

export default async function FinalEvaluationPage({ params: { lang, token } }) {
	const dict = await getDictionary(lang);
	return (
		<main className="w-full min-h-screen flex flex-col justify-start items-center gap-6 mt-10 p-4">
			<LangToggle lang={lang} />
			<h1 className="text-2xl md:text-4xl font-semibold">{dict.supervisor.evaluationTitle}</h1>
			<FinalEvaluationForm action={finalEvalAction} dict={dict} token={token} />
		</main>
	)
}
