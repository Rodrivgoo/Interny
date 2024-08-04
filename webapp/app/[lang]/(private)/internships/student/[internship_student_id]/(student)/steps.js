
export default function StepsWidget({ dict, data, selectedStep, setSelectedStep }) {
	return (
		<div className='dashboard-widget flex flex-col h-full w-full'>
			<h1 className='text-lg font-semibold'>{dict.internship.widgets.steps.title}</h1>
			<div className="max-h-[290px] xl:max-h-[90%] overflow-y-scroll">
				{data.steps?.map((step) => (
					<div
						onClick={() => setSelectedStep(step)}
						key={step.id}
						className={`p-2 pl-4 py-4 border-b border-gray-200 dark:border-gray-800 cursor-pointer ${selectedStep?.id === step.id ? 'bg-gray-100 dark:bg-[#1f1f1f]' : 'hover:bg-gray-100 dark:hover:bg-[#1f1f1f]'}`}>
						<h3 className='font-semibold'>{step.title}</h3>
						<p className='text-sm text-gray-500'> {step.status === 'done' ? dict.internship.widgets.steps.completed : dict.internship.widgets.steps.pending}</p>
					</div>
				))}
			</div>
		</div>
	)
}
