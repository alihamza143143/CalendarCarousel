'use client'

import { useState } from 'react';
import CalendarSwiper from './_components/CalendarSwiper';
import ContactCard from './_components/ContactCard';

export default function Home() {
  const [cardCount, setCardCount] = useState(20);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      {/* Card Count Control Panel */}
      <div className="fixed top-4 left-4 z-50 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Count (for testing)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={5}
            max={100}
            value={cardCount}
            onChange={(e) => setCardCount(Math.max(5, Math.min(100, parseInt(e.target.value) || 20)))}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
          />
          <div className="flex gap-1">
            {[20, 40, 60, 80, 100].map((count) => (
              <button
                key={count}
                onClick={() => setCardCount(count)}
                className={`px-2 py-1 text-xs rounded ${
                  cardCount === count
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Current: {cardCount} cards</p>
      </div>

      <main>
        <CalendarSwiper calendarCards={[]} isDatesPage={true} cardCount={cardCount} />
      </main>
      <ContactCard />
    </div>
  );
}
