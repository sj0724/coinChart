'use client';

import { INTERVAL_MENU } from '@/lib/menu';
import { INTERVAL_OPTIONS } from '@/types/sort';

interface Props {
  changeInterval: (value: INTERVAL_OPTIONS) => void;
  chartInterval: string;
}

export default function IntervalMenu({ changeInterval, chartInterval }: Props) {
  return (
    <ul className='flex gap-1 bg-white p-2 rounded-t'>
      {INTERVAL_MENU.map((item, index) => (
        <li key={index}>
          <button
            type='button'
            className={`w-10 h-10 rounded-md hover:bg-gray-200 flex justify-center items-center text-sm ${
              chartInterval === item && 'bg-gray-200'
            }`}
            onClick={() => changeInterval(item)}
          >
            {item}
          </button>
        </li>
      ))}
    </ul>
  );
}
