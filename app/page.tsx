
import CalendarSwiper from './_components/CalendarSwiper';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main >
        <CalendarSwiper
        calendarCards={[]}
        isDatesPage={true}
      />
      </main>
    </div>
  );
}
