import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "./dictionaries.js";
import heroImage from "@/public/images/hero.png";
import teacherImage from "@/public/images/teacher.png";
import teacherDashboard from "@/public/images/teacherdashboard.png";
import directorDashboard from "@/public/images/directordashboard.png";
import companiesImage from "@/public/images/companies.png";

import uaiLogo from '@/public/images/uai.jpg'
import amazonLogo from '@/public/images/amazon.jpg'
import microsoftLogo from '@/public/images/microsoft.png'
import ucLogo from '@/public/images/uc.png'
import duocLogo from '@/public/images/duoc.png'
import accentureLogo from '@/public/images/accenture.png'
import uddLogo from '@/public/images/udd.png'
import bciLogo from '@/public/images/bci.png'

export default async function Home({ params: { lang } }) {


  const dict = await getDictionary(lang)
  const otherLang = lang === "es" ? "en" : "es";



  return (
    <main className="flex flex-col items-center justify-start  min-h-screen  bg-white text-[#241f21]">
      <header className="w-full px-4 py-3 flex flex-row justify-between items-center ">
        <div className="flex flex-row items-center gap-2">
          <svg width={42} height={42} viewBox="0 0 24 24" className='fill-black' xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M12.2917 2.05906C12.1052 1.98031 11.8948 1.98031 11.7083 2.05906L0.458271 6.80906C0.180526 6.92633 0 7.19851 0 7.5C0 7.80149 0.180526 8.07367 0.458271 8.19094L4.25 9.79189V13.5955C3.76381 13.7216 3.30237 13.9729 2.9228 14.3524C2.34402 14.9312 2 15.7627 2 16.7811V21.2811C2 21.5304 2.12795 21.7681 2.33509 21.9059C2.39421 21.9451 2.45249 21.9787 2.55517 22.0301C2.67876 22.0919 2.85216 22.1683 3.07529 22.2427C3.52261 22.3918 4.1651 22.5312 5 22.5312C5.83487 22.5312 6.47733 22.3919 6.92463 22.2428C7.14776 22.1684 7.32115 22.0921 7.44474 22.0303C7.54157 21.9819 7.59819 21.9487 7.65465 21.9128C7.86613 21.7752 8 21.5344 8 21.2813V16.7813C8 15.7629 7.65599 14.9313 7.07721 14.3525C6.69764 13.9729 6.2362 13.7216 5.75 13.5955V10.4252L11.7083 12.9409C11.8948 13.0197 12.1052 13.0197 12.2917 12.9409L17.5 10.7419V14.7441C17.4774 14.7696 17.4512 14.798 17.4213 14.8288C17.2597 14.9949 16.9876 15.2338 16.572 15.4791C15.7458 15.9667 14.3174 16.5 12 16.5C11.388 16.5 10.8384 16.4628 10.346 16.3992C9.93522 16.3462 9.55922 16.6362 9.50619 17.047C9.45317 17.4578 9.74321 17.8339 10.154 17.8869C10.7132 17.9591 11.3271 18 12 18C14.5576 18 16.2543 17.4083 17.3343 16.7709C17.8718 16.4537 18.2481 16.1301 18.4968 15.8744C18.6402 15.7268 18.7814 15.5683 18.8894 15.3921L18.89 15.3911C18.9619 15.2733 19 15.138 19 15V10.1085L23.5417 8.19094C23.8195 8.07367 24 7.80149 24 7.5C24 7.19851 23.8195 6.92633 23.5417 6.80906L12.2917 2.05906ZM4.99993 15C4.99992 15 4.99995 15 4.99993 15C4.62297 15 4.25546 15.1411 3.98345 15.4131C3.71848 15.6781 3.5 16.1121 3.5 16.7811V20.8027C3.7989 20.9079 4.29726 21.0312 5 21.0312C5.70271 21.0312 6.20108 20.908 6.5 20.8027V16.7813C6.5 16.1122 6.28151 15.6781 6.01654 15.4132C5.74451 15.1411 5.37691 15 4.99993 15ZM12 11.4359L2.67816 7.5L12 3.56411L21.3218 7.5L12 11.4359Z" />
          </svg>
          <h3 className="font-medium text-xl text-black">Interny</h3>
        </div>

        <div className="flex flex-row gap-3 items-center">
          <Link
            className=" border border-gray-200 px-2 py-1 rounded-lg"
            href={'/' + otherLang}>{otherLang.toUpperCase()}</Link>
          <Link href="/login" className="font-semibold text-white bg-black rounded-md px-5 py-1 hover:bg-[#484848]">{dict.landing.login}</Link>
        </div>
      </header>

      <div className="w-full flex flex-col justify-center items-center">

        <div className="hero w-full flex gap-1 flex-col-reverse md:flex-row items-center justify-center mb-16 mt-10 md:mt-16">
          <div className="flex flex-col gap-2 md:items-start items-center">
            <h1 className="font-bold text-4xl md:text-5xl max-w-[400px] text-center md:text-start ">{dict.landing.hero.title}</h1>
            <p className="max-w-[350px] text-gray-600 text-center md:text-start">{dict.landing.hero.subtitle}</p>
            <Link href="/register" className="font-semibold text-sm mt-1 text-white bg-black rounded-md px-5 py-[6px] hover:bg-[#484848]">{dict.landing.register}</Link>
          </div>
          <div className="">
            <Image src={heroImage} alt="Hero Image" className="w-[300px] h-auto" />
          </div>
        </div>

        <div className="w-full max-w-[700px]  border-t border-gray-200 mt-16">
          <div className="w-full min-h-[300px] flex flex-col md:flex-row items-center justify-center gap-4 my-10">
            <div>
              <Image src={teacherImage} alt="Teacher Image" className="w-[200px] h-auto" />
            </div>
            <div>
              <h2 className="font-bold text-3xl md:text-4xl text-center md:text-start my-5">{dict.landing.teacher.title}</h2>
              <p className="max-w-[350px] text-gray-600 text-center md:text-start">{dict.landing.teacher.subtitle}</p>
            </div>
          </div>
        </div>
        <div className="w-[80%] lg:w-full max-w-[900px] rounded-xl shadow-[0_35px_50px_-10px_rgba(0,0,0,0.3)] shadow-gray-200 border-2 border-gray-200 overflow-hidden">
          <Image src={teacherDashboard} alt="Teacher Dashboard" className="w-full h-auto" />
        </div>
        <div className="w-full max-w-[700px] mt-24 border-t border-gray-200"></div>


        <div className="w-full grid place-items-center my-16 lg:mt-24">
          <div className="w-[80%] lg:max-w-[1000px]  min-h-[300px] flex flex-col-reverse md:flex-row items-center justify-center gap-8">
            <div className="shadow-[0_35px_50px_-10px_rgba(0,0,0,0.3)] shadow-gray-200 border-2 border-gray-200 rounded-xl overflow-hidden">
              <Image src={directorDashboard} alt="Teacher Image" className="w-full h-auto" />
            </div>
            <div>
              <h2 className="font-bold text-3xl md:text-4xl text-center md:text-start my-5">{dict.landing.director.title}</h2>
              <p className="max-w-[400px] min-w-[250px] text-gray-600 text-center md:text-start">{dict.landing.director.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="w-full grid place-items-center my-16 lg:mt-24">
          <div className="w-[80%] lg:max-w-[1000px]  min-h-[300px] flex flex-col-reverse md:flex-row items-center justify-center gap-8">
            <div>
              <h2 className="font-bold text-3xl md:text-4xl text-center md:text-start my-5">{dict.landing.companies.title}</h2>
              <p className="max-w-[400px] min-w-[250px] text-gray-600 text-center md:text-start">{dict.landing.companies.subtitle}</p>
            </div>
            <div className=" max-w-[300px] overflow-hidden">
              <Image src={companiesImage} alt="Teacher Image" className="w-full h-auto" />
            </div>
          </div>
        </div>

        <div className="w-full flex-col items-center justify-center max-w-[400px] px-4  pt-16  overflow-hidden">
          <h2 className="font-bold text-3xl text-center my-5">{dict.landing.organizations.title}</h2>
        </div>


        <div className="logos relative w-full mt-24 mb-40 px-4 overflow-hidden">
          <div className=" relative inline-block overflow-hidden whitespace-nowrap">
            <div className="logos-slide inline-block px-3">
              <Image src={amazonLogo} alt="amazon" width={100} height={50} className="inline-block mx-14 shadow-none" />
              <Image src={ucLogo} alt="uc" width={80} height={50} className="inline-block mx-14 shadow-none" />
              <Image src={microsoftLogo} alt="microsoft" width={100} height={50} className="inline-block mx-14 shadow-none" />
              <Image src={duocLogo} alt="uc" width={160} height={50} className="inline-block mx-14 shadow-none" />
              <Image src={accentureLogo} alt="uc" width={65} height={70} className="inline-block mx-14 shadow-none" />
              <Image src={uaiLogo} alt="uai" width={180} height={70} className="inline-block mx-14 shadow-none" />
              <Image src={uddLogo} alt="uc" width={180} height={50} className="inline-block mx-14 shadow-none" />
              <Image src={bciLogo} alt="uc" width={100} height={50} className="inline-block mx-14 shadow-none" />
            </div>

            <div class="logos-slide inline-block px-3">
              <Image src={amazonLogo} alt="amazon" width={100} height={50} className="inline-block mx-14 shadow-none" />
              <Image src={ucLogo} alt="uc" width={80} height={50} className="inline-block mx-14 shadow-none" />
              <Image src={microsoftLogo} alt="microsoft" width={100} height={50} className="inline-block mx-14 shadow-none" />
              <Image src={duocLogo} alt="uc" width={160} height={50} className="inline-block mx-14 shadow-none" />
              <Image src={accentureLogo} alt="uc" width={65} height={70} className="inline-block mx-14 shadow-none" />
              <Image src={uaiLogo} alt="uai" width={180} height={70} className="inline-block mx-14 shadow-none" />
              <Image src={uddLogo} alt="uc" width={180} height={50} className="inline-block mx-14 shadow-none" />
              <Image src={bciLogo} alt="uc" width={100} height={50} className="inline-block mx-14 shadow-none" />
            </div>
          </div>
        </div>
      </div>

      <footer className="min-h-[200px] py-10 border-t border-gray-200 shadow-xl shadow-gray-500 w-full flex items-center justify-center">
        <div className="flex flex-col md:flex-row gap-7 items-center justify-around h-full w-full max-w-[700px]">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <p className="text-gray-500 text-center font-medium">{dict.landing.footer.about}:</p>
            <p className="text-gray-500 text-center">Rodrigo Gómez</p>
            <p className="text-gray-500 text-center">Leonardo Silva</p>
            <p className="text-gray-500 text-center">Pedro Pizarro</p>
          </div>
          <div>
            <p className="text-gray-500 text-center">{dict.landing.footer.design}</p>
            <Link href="https://www.notion.so/" target="_blank" className="font-semibold text-gray-600 hover:underline">Notion</Link>
          </div>

        </div>
      </footer>
    </main >
  );
}

