
export default function DirectorMailingWidget({ dict }) {


  let sentEmails = [
    {
      subject: 'Aviso Prácticas Profesionales',
      date: '4-3-2024',
    },
    {
      subject: 'Nueva Oferta Laboral',
      date: '4-3-2024',
    },
  ]

  const careers = [
    {
      id: 1,
      name: 'Ingeniería en Informática',
    },
    {
      id: 2,
      name: 'Ingeniería en Construcción',
    },
    {
      id: 3,
      name: 'Ingeniería en Electricidad',
    },
  ]


  return (
    <div className="dashboard-widget">
      <h2 className="text-lg font-semibold mb-3">{dict.dashboard.director.widgets.mailing.title}</h2>
      <div className="flex flex-col xl:flex-row gap-10 justify-around">
        <div className="flex flex-col gap-2 items-start">
          <p>{dict.dashboard.director.widgets.mailing.lastEmails}</p>
          {sentEmails.map((email, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-800 py-2 px-3 rounded-md w-[300px]">
              <p><span className="font-medium">{dict.dashboard.director.widgets.mailing.subject}:</span> {email.subject}</p>
              <p className="text-gray-400">{email.date}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <p>{dict.dashboard.director.widgets.mailing.sendTo}</p>
          <div>
            <p>{dict.dashboard.director.widgets.mailing.career}</p>
            <select
              className="w-[280px] border border-gray-200 dark:border-gray-800 rounded-md p-1"
            >
              <option>{dict.dashboard.director.widgets.mailing.all}</option>
              {careers.map((career, index) => (
                <option key={index}>{career.name}</option>
              ))}
            </select>
          </div>

          <div>
            <p className="pb-3">{dict.dashboard.director.widgets.mailing.step}</p>
            <div className="flex flex-row gap-2">
              <select className="min-w-[120px] border border-gray-200 dark:border-gray-800 rounded-md p-1">
                <option>{dict.dashboard.director.widgets.mailing.equal}</option>
                <option>{dict.dashboard.director.widgets.mailing.greater}</option>
                <option>{dict.dashboard.director.widgets.mailing.less}</option>
              </select>
              <p className="mx-2">{dict.dashboard.director.widgets.mailing.to}</p>
              <select className="min-w-[120px] border border-gray-200 dark:border-gray-800 rounded-md p-1">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[500px] flex flex-col gap-2">
          <p>{dict.dashboard.director.widgets.mailing.subject}</p>
          <input
            className="w-full border border-gray-200 dark:border-gray-800 rounded-md p-1"
            type="text"
          />
          <p>{dict.dashboard.director.widgets.mailing.content}</p>
          <textarea
            className="w-full max-h-[100px] border border-gray-200 dark:border-gray-800 rounded-md p-1 resize-none"
            rows="5"
          ></textarea>
          <button className="bg-blue-500 text-white rounded-md p-2">{dict.dashboard.director.widgets.mailing.send}</button>
        </div>

      </div>
    </div>
  )
}
