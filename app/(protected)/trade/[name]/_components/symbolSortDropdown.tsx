'use client';

import { SORT_OPTIONS } from '@/types/sort';
import { useEffect, useRef, useState } from 'react';

type DropdownItme = {
  name: string;
  value: SORT_OPTIONS;
};

interface Props {
  list: DropdownItme[];
  sortBy: SORT_OPTIONS;
  setSortBy: (option: SORT_OPTIONS) => void;
}

export default function SymbolSortDropdown({ list, sortBy, setSortBy }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClick = (option: SORT_OPTIONS) => {
    setSortBy(option);
    setIsOpen(false);
  };

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
    <div className='relative flex justify-end w-fit' ref={dropdownRef}>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='px-2 py-1 rounded text-xs my-1 hover:bg-gray-100'
      >
        정렬
        {/* {list.find((item) => item.value === sortBy)?.name} */}
      </button>
      {isOpen && (
        <ul className='flex flex-col p-2 gap-1 absolute right-0 top-8 w-28 bg-white items-center shadow-md rounded-md'>
          {list.map((item, index) => (
            <li key={index} className='w-full'>
              <button
                type='button'
                className={`p-2 w-full hover:bg-gray-100 rounded-md text-nowrap text-xs ${
                  sortBy === item.value && 'bg-gray-100'
                }`}
                onClick={() => handleClick(item.value)}
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
