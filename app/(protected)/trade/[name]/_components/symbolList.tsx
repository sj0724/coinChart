'use client';

import { useEffect, useState } from 'react';
import SymbolSearchBar from './symbolSearchBar';
import { SORT_MENU } from '@/lib/menu';
import { useWebSocketStore } from '@/store/useWebsocketStore';
import SymbolListItem from './symbolListItem';
import { SORT_OPTIONS } from '@/types/sort';
import CurrencyContainer from './currencyContainer';
import { fetchSymbolList } from '@/app/api/totalList/helper';
import { convertToMiniTicker } from '@/utils/convertToMiniTicker';
import { DEFAULT_CURRENCY } from '@/lib/constance';
import SymbolSortDropdown from './symbolSortDropdown';

export default function SymbolList() {
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState<SORT_OPTIONS>('priceDes');
  const miniTicker = useWebSocketStore((state) => state.miniTicker);
  const setMiniTicker = useWebSocketStore((state) => state.setminiTicker);

  const sortTickerList = Array.from(miniTicker.values())
    .sort((a, b) => {
      if (sortBy === 'priceDes') return parseFloat(b.c) - parseFloat(a.c);
      if (sortBy === 'priceAsc') return parseFloat(a.c) - parseFloat(b.c);
      return parseFloat(b.q) - parseFloat(a.q);
    })
    .filter((item) => item.s.endsWith(currency));

  const changeCurrency = (value: string) => {
    setCurrency(value);
  };

  const filteredList = sortTickerList.filter((item) =>
    item.s.toLowerCase().includes(keyword.toLowerCase())
  );

  const changeKeyword = (value: string) => {
    setKeyword(value);
  };

  const changeSortBy = (option: SORT_OPTIONS) => {
    setSortBy(option);
  };

  useEffect(() => {
    const getSymbolList = async () => {
      const result = await fetchSymbolList();
      if (result) {
        const convertData = convertToMiniTicker(result);
        setMiniTicker(convertData);
      }
    };
    getSymbolList();
  }, []);

  return (
    <div className='rounded bg-white overflow-y-hidden w-full md:w-1/3 xl:w-full p-2'>
      <div className='bg-white flex flex-col w-full gap-2 text-sm'>
        <SymbolSearchBar onChange={changeKeyword} />
        <div className='flex flex-col items-end'>
          <CurrencyContainer
            currentCurrency={currency}
            handleClick={changeCurrency}
          />
          <SymbolSortDropdown
            list={SORT_MENU}
            sortBy={sortBy}
            setSortBy={changeSortBy}
          />
        </div>
      </div>
      <ul className='flex flex-col overflow-y-scroll h-[350px] pb-2'>
        {filteredList.map((item) => (
          <li key={item.s}>
            <SymbolListItem symbol={item} currency={currency} />
          </li>
        ))}
      </ul>
    </div>
  );
}
