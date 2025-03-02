'use client';

import { SORT_OPTIONS } from '@/types/sort';
import { useEffect, useRef, useState } from 'react';

type DropdownItme = {
  name: string;
  value: SORT_OPTIONS;
};

interface Props {
  onClick: (value: SORT_OPTIONS) => void;
  list: DropdownItme[];
  value: string;
}

export default function SymbolSortDropdown({ list, value, onClick }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='relative' ref={dropdownRef}>
      <button type='button' onClick={() => setIsOpen(!isOpen)}>
        {list.find((item) => item.value === value)?.name}
      </button>
      {isOpen && (
        <ul className='flex flex-col p-3 gap-1 absolute right-0 w-28 bg-white items-center shadow-md rounded-md'>
          {list.map((item, index) => (
            <li key={index} className='w-full'>
              <button
                type='button'
                className='p-3 w-full hover:bg-gray-100 rounded-md text-nowrap'
                onClick={() => onClick(item.value)}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
