import { getDictionary } from '../../dictionaries';
import ThemeToggle from '@/components/theme-toggle.js';
import { MainLogo } from '../../../icons.js';
import SupervisorPassForm from './credentials';
import { supervisorpassAction } from './supervisorpassAction';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function SupervisorPassPage({ params: { lang } }) {
  const dict = await getDictionary(lang);
  const session = await auth();

  return (
    <main className='max-w-[700px]  h-full mx-auto my-20 relative flex flex-col items-center justify-start pt-10'>
      <div className='mb-10'>
        <MainLogo width={48} height={48} />
      </div>

      <h1 className='text-5xl font-extrabold mb-5'>{dict.supervisor.title}</h1>

      <SupervisorPassForm
        dict={dict}
        lang={lang}
        supervisorpassAction={supervisorpassAction}
        accessToken={session.accessToken}

      />

    </main>
  );
}
