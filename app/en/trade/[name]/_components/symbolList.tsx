'use client';

import { useState } from 'react';
import SymbolSearchBar from './symbolSearchBar';
import SymbolSortDropdown from '@/app/en/trade/[name]/_components/symbolSortDropdown';
import { SORT_MENU } from '@/lib/menu';
import { useWebSocketStore } from '@/store/useWebsocketStore';
import SymbolListItem from './symbolListItem';
import { SORT_OPTIONS } from '@/types/sort';

export default function SymbolList() {
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState<SORT_OPTIONS>('priceDes');
  const miniTicker = useWebSocketStore((state) => state.miniTicker);

  const sortTickerList = Array.from(miniTicker.values()).sort((a, b) => {
    if (sortBy === 'priceDes') return parseFloat(b.c) - parseFloat(a.c);
    if (sortBy === 'priceAsc') return parseFloat(a.c) - parseFloat(b.c);
    return parseFloat(b.q) - parseFloat(a.q);
  });

  const filteredList = sortTickerList.filter((item) =>
    item.s.toLowerCase().includes(keyword.toLowerCase())
  );

  const changeKeyword = (value: string) => {
    setKeyword(value);
  };

  const changeSortBy = (option: SORT_OPTIONS) => {
    setSortBy(option);
  };

  return (
    <div className='relative rounded-lg border h-[500px] w-[300px] overflow-scroll'>
      <div className='sticky top-0 bg-white flex flex-col w-full pt-3 px-3 gap-2 text-sm'>
        <SymbolSearchBar onChange={changeKeyword} />
        <div className='flex justify-between'>
          <p>USDT</p>
          <SymbolSortDropdown
            list={SORT_MENU}
            sortBy={sortBy}
            setSortBy={changeSortBy}
          />
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
