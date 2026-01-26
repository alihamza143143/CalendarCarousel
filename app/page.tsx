

import CalendarSwiper from './_components/CalendarSwiper';
import dynamic from 'next/dynamic';

const ContactCard = dynamic(() => import('./_components/ContactCard'), { ssr: false });

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main>
        <CalendarSwiper calendarCards={[]} isDatesPage={true} />
      </main>
      <ContactCard />
    </div>
  );
}
