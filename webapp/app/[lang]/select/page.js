import { auth } from "@/auth";
import { getDictionary } from "../dictionaries";
import Image from 'next/image';

export default async function Select({ params: { lang } }) {

	const dict = await getDictionary(lang);
	const session = await auth();
	// console.log('session in select: ', session)

	const careers = [
		{
			id: '123123',
			university: 'Universidad Adolfo Ibáñez',
			title: 'Ingeniería Civil Industrial',
			logoUrl: '/logos/uai.jpg',
		},
		{
			id: '123123',
			university: 'Universidad Adolfo Ibáñez',
			title: 'Ingeniería Civil Industrial',
			logoUrl: '/logos/uai.jpg',
		},
		{
			id: '123123',
			university: 'Universidad Adolfo Ibáñez',
			title: 'Ingeniería Civil Industrial',
			logoUrl: '/logos/uai.jpg',
		},
		{
			id: '123123',
			university: 'Universidad Adolfo Ibáñez',
			title: 'Ingeniería Civil Industrial',
			logoUrl: '/logos/uai.jpg',
		},
		{
			id: '123123',
			university: 'Universidad Adolfo Ibáñez',
			title: 'Ingeniería Civil Industrial',
			logoUrl: '/logos/uai.jpg',
		},

	];

	function selectCareer(id) {
		session.selectedCareer = id;
	}

	return (
		<div className="flex gap-5 flex-col justify-center items-center w-full px-4">
			<h1>{dict.select.title}</h1>
			<div className="w-full max-w-[500px] flex flex-col gap-1">
				<label>{dict.select.searchbar.label}</label>
				<input type='text' className="max-width-[500px] border rounded-sm border-gray-300 p-1" />
			</div>

			<div className="max-w-[1200px] mt-5 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-rows-auto ">
				{careers.map((career, index) => (
					<div key={index} onClick={selectCareer(career.id)} className="flex flex-row gap-3 border border-gray-200 rounded-md hover:cursor-pointer transform hover:scale-105 duration-150 px-5 py-4" >
						<div className="flex justify-center items-center">
							<Image src={career.logoUrl} width={120} height={120} />
						</div>
						<div>
							<h3 className="font-bold text-lg">{career.title}</h3>
							<h4 className="font-medium text-md">{career.university}</h4>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
