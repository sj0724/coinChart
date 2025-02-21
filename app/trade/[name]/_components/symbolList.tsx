'use client';

import { SymbolData } from '@/types/binance';
import SymbolListItem from './symbolListItem';
import { useState } from 'react';
import SymbolSearchBar from './symbolSearchBar';

interface Props {
  data: SymbolData[];
}

export default function SymbolList({ data }: Props) {
  const [keyword, setKeyword] = useState('');
  const filteredList = data.filter((item) =>
    item.symbol.toLowerCase().includes(keyword.toLowerCase())
  );

  const changeKeyword = (value: string) => {
    setKeyword(value);
  };

  return (
    <div className='relative rounded-lg border h-[400px] w-[300px] overflow-scroll'>
      <div className='sticky top-0 bg-white flex flex-col w-full pt-3 px-3 gap-2'>
        <SymbolSearchBar onChange={changeKeyword} />
        <div className='flex justify-between'>
          <p>USDT</p>
          <p>가격순</p>
        </div>
      </div>
      <ul className='flex flex-col'>
        {filteredList.map((item) => (
          <li key={item.symbol}>
            <SymbolListItem symbol={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
