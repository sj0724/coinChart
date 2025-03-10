'use client';

import { useMemo, useState } from 'react';
import SymbolSearchBar from './symbolSearchBar';
import SymbolSortDropdown from '@/app/en/trade/[name]/_components/symbolSortDropdown';
import { SORT_MENU } from '@/lib/menu';
import { useWebSocketStore } from '@/store/useWebsocketStore';
import SymbolListItem from './symbolListItem';

export default function SymbolList() {
  const [keyword, setKeyword] = useState('');
  const miniTicker = useWebSocketStore((state) => state.miniTicker);

  const changeKeyword = (value: string) => {
    setKeyword(value);
  };

  const filteredList = miniTicker.filter((item) =>
    item.s.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className='relative rounded-lg border h-[500px] w-[300px] overflow-scroll'>
      <div className='sticky top-0 bg-white flex flex-col w-full pt-3 px-3 gap-2 text-sm'>
        <SymbolSearchBar onChange={changeKeyword} />
        <div className='flex justify-between'>
          <p>USDT</p>
          <SymbolSortDropdown list={SORT_MENU} />
        </div>
      </div>
      <ul className='flex flex-col'>
        {filteredList.map((item) => (
          <li key={item.s}>
            <SymbolListItem symbol={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
