'use client';

import { SymbolData } from '@/types/binance';
import SymbolListItem from './symbolListItem';
import { useEffect, useState } from 'react';
import SymbolSearchBar from './symbolSearchBar';
import Dropdown from '@/components/dropdown';

const DEFAULT_CURRENCY = 'USDT';

const SORT_MENU = [
  { name: '가격내림차순', value: 'priceDes' },
  { name: '가격오름차순', value: 'priceAsc' },
  { name: '거래량순', value: 'volume' },
];

export default function SymbolList() {
  const [keyword, setKeyword] = useState('');
  const [symbolData, setOrderData] = useState<SymbolData[] | null>(null);
  const [sortBy, setSortBy] = useState('priceDes');

  const changeKeyword = (value: string) => {
    setKeyword(value);
  };

  const changeSortBy = (value: string) => {
    setSortBy(value);
  };

  const fetchOrderBook = async () => {
    try {
      const data = await fetch(
        `http://localhost:3000/api/totalList?sortBy=${sortBy}&currency=${DEFAULT_CURRENCY}`
      );
      const result: SymbolData[] = await data.json();
      setOrderData([...result]);
    } catch (error) {
      console.error('Error fetching order book:', error);
    }
  };

  useEffect(() => {
    fetchOrderBook();
    const intervalId = setInterval(fetchOrderBook, 5000); // 5초마다 데이터 갱신

    return () => clearInterval(intervalId);
  }, [sortBy]);

  if (!symbolData) {
    return <div className='border rounded-md p-3 h-[400px] w-[300px]'></div>;
  }

  const filteredList = symbolData.filter((item) =>
    item.symbol.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className='relative rounded-lg border h-[500px] w-[300px] overflow-scroll'>
      <div className='sticky top-0 bg-white flex flex-col w-full pt-3 px-3 gap-2 text-sm'>
        <SymbolSearchBar onChange={changeKeyword} />
        <div className='flex justify-between'>
          <p>USDT</p>
          <Dropdown list={SORT_MENU} value={sortBy} onClick={changeSortBy} />
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
